import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, expect, test, vi } from 'vitest';

import {
  menuItemsKeys,
  menuItemsQueryOptions,
  type MenuItem,
} from '@/entities/menu-item';
import { ApiError } from '@/shared/api';
import { useToastStore } from '@/shared/ui/toast';

import { useMenuItemMutation } from './menu-item.mutations';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  useToastStore.setState({ toasts: [] });
});

test('откатывает только ошибочную позицию и синхронизирует список после размонтирования инициаторов', async () => {
  const first: MenuItem = {
    id: 'first',
    name: 'Первая',
    shop: 'kitchen',
    remaining: 5,
    status: 'available',
    stopReason: null,
    until: null,
  };
  const second: MenuItem = {
    id: 'second',
    name: 'Вторая',
    shop: 'bar',
    remaining: 3,
    status: 'stopped',
    stopReason: 'other',
    until: null,
  };
  const confirmedSecond: MenuItem = {
    ...second,
    status: 'available',
    stopReason: null,
    until: null,
  };
  const stopResponse = deferred<Response>();
  const resumeResponse = deferred<Response>();
  let serverItems: MenuItem[] = [first, second];
  const readMenu = vi.fn(() =>
    Promise.resolve(Response.json({ data: serverItems })),
  );

  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>((input, init) => {
      if (init?.method !== 'POST') return readMenu();

      const url = input instanceof Request ? input.url : String(input);
      if (url.endsWith('/first/stop')) return stopResponse.promise;
      if (url.endsWith('/second/resume')) return resumeResponse.promise;
      throw new Error('Неожиданный запрос: ' + url);
    }),
  );

  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { gcTime: Infinity },
    },
  });
  client.setQueryData(menuItemsKeys.list(), [first, second]);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  try {
    const menu = renderHook(
      () => useQuery({ ...menuItemsQueryOptions(), staleTime: Infinity }),
      { wrapper },
    );
    const stop = renderHook(useMenuItemMutation, { wrapper });
    const resume = renderHook(useMenuItemMutation, { wrapper });
    let failed: Promise<unknown>;
    let succeeded: Promise<MenuItem>;

    act(() => {
      failed = stop.result.current
        .mutateAsync({
          type: 'stop',
          id: first.id,
          input: { reason: 'equipment_failure', until: null }
        })
        .catch((error: unknown) => error);
      succeeded = resume.result.current.mutateAsync({
        type: 'resume',
        id: second.id
      });
    });

    await waitFor(() => {
      expect(menu.result.current.data?.map((item) => item.status)).toEqual([
        'stopped',
        'available'
      ]);
    });
    stop.unmount();
    resume.unmount();

    await act(async () => {
      serverItems = [first, confirmedSecond];
      resumeResponse.resolve(Response.json({ data: confirmedSecond }));
      await succeeded;
    });
    expect(readMenu).not.toHaveBeenCalled();
    expect(menu.result.current.data?.[0].status).toBe('stopped');

    await act(async () => {
      stopResponse.resolve(
        Response.json(
          {
            error: {
              code: 'SIMULATED_FAILURE',
              message: 'Не удалось сохранить первую позицию',
            },
          },
          { status: 500 },
        ),
      );
      await expect(failed).resolves.toBeInstanceOf(ApiError);
    });

    await waitFor(() =>
      expect(menu.result.current.data).toEqual([first, confirmedSecond]),
    );
    expect(readMenu).toHaveBeenCalledTimes(1);
    expect(client.isMutating()).toBe(0);
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe(
      'Не удалось сохранить первую позицию',
    );
  } finally {
    cleanup();
    client.clear();
  }
});
