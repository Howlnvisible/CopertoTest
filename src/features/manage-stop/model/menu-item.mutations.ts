'use client';

import {
  useMutation,
  useMutationState,
  useQueryClient,
  type QueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import {
  menuItemsKeys,
  resumeMenuItem,
  stopMenuItem,
  type MenuItem,
  type StopInput,
} from '@/entities/menu-item';
import { ApiError } from '@/shared/api';
import { useToastStore } from '@/shared/ui/toast';

import { applyMenuItemChange, replaceMenuItem } from './optimistic-menu-item';
import { useStopPanelStore } from './stop-panel.store';

export type MenuItemChange =
  | { type: 'stop'; id: string; input: StopInput }
  | { type: 'resume'; id: string };

type MutationContext = { previousItem: MenuItem };
type MenuItemMutation = UseMutationResult<
  MenuItem,
  ApiError,
  MenuItemChange,
  MutationContext
>;

const mutationKey = [...menuItemsKeys.all, 'change'] as const;

function getMutationItemId(variables: unknown): string | null {
  return typeof variables === 'object' &&
    variables !== null &&
    'id' in variables &&
    typeof variables.id === 'string'
    ? variables.id
    : null;
}

export function hasPendingMenuItemChanges(queryClient: QueryClient): boolean {
  return queryClient.isMutating({ mutationKey }) > 0;
}

function getChangeError(
  queryClient: QueryClient,
  change: MenuItemChange,
): ApiError | null {
  if (
    queryClient.isMutating({
      mutationKey,
      predicate: (mutation) =>
        getMutationItemId(mutation.state.variables) === change.id
    }) > 0
  ) {
    return new ApiError(
      'Эта позиция уже сохраняется. Дождитесь завершения.',
      'ALREADY_PENDING',
      0
    );
  }
  if (
    !queryClient
      .getQueryData<MenuItem[]>(menuItemsKeys.list())
      ?.some((item) => item.id === change.id)
  ) {
    return new ApiError(
      'Позиция отсутствует в загруженном меню. Обновите список.',
      'NOT_CACHED',
      0
    );
  }
  return null;
}

export function useMenuItemMutation(): MenuItemMutation {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    MenuItem,
    ApiError,
    MenuItemChange,
    MutationContext
  >({
    mutationKey,
    retry: 0,
    mutationFn: (change) =>
      change.type === 'stop'
        ? stopMenuItem(change.id, change.input)
        : resumeMenuItem(change.id),
    onMutate: async (change) => {
      await queryClient.cancelQueries({ queryKey: menuItemsKeys.list() });
      const previousItem = queryClient
        .getQueryData<MenuItem[]>(menuItemsKeys.list())
        ?.find((item) => item.id === change.id);
      if (!previousItem) {
        throw new ApiError(
          'Позиция отсутствует в загруженном меню. Обновите список.',
          'NOT_CACHED',
          0
        );
      }
      const optimisticItem = applyMenuItemChange(previousItem, change);
      queryClient.setQueryData<MenuItem[]>(menuItemsKeys.list(), (items) =>
        items === undefined
          ? undefined
          : replaceMenuItem(items, optimisticItem),
      );
      return { previousItem };
    },
    onSuccess: (item, change) => {
      queryClient.setQueryData<MenuItem[]>(menuItemsKeys.list(), (items) =>
        items === undefined ? undefined : replaceMenuItem(items, item),
      );
      if (change.type === 'stop')
        useStopPanelStore.getState().closePanelFor(item.id);
    },
    onError: (error, _, context) => {
      if (context) {
        queryClient.setQueryData<MenuItem[]>(menuItemsKeys.list(), (items) =>
          items === undefined
            ? undefined
            : replaceMenuItem(items, context.previousItem)
        );
      }
      useToastStore.getState().addError(error.message);
    },
    onSettled: () => {
      const isOnlyCurrentPendingMutation = queryClient.isMutating({ mutationKey }) === 1;
      
      if (isOnlyCurrentPendingMutation) {
        return queryClient.invalidateQueries({
          queryKey: menuItemsKeys.list(),
        });
      }
    },
  });

  const mutate: MenuItemMutation['mutate'] = (change, options) => {
    const error = getChangeError(queryClient, change);
    if (error) {
      useToastStore.getState().addError(error.message);
      return;
    }

    mutation.mutate(change, options);
  };

  const mutateAsync: MenuItemMutation['mutateAsync'] = (change, options) => {
    const error = getChangeError(queryClient, change);
    if (error) {
      useToastStore.getState().addError(error.message);
      return Promise.reject(error);
    }

    return mutation.mutateAsync(change, options);
  };

  return { ...mutation, mutate, mutateAsync };
}

export function usePendingMenuItemIds(): ReadonlySet<string> {
  const ids = useMutationState({
    filters: { mutationKey, status: 'pending' },
    select: (mutation) => getMutationItemId(mutation.state.variables),
  });
  return new Set(ids.filter((id): id is string => id !== null));
}
