'use client';

import { useEffect, useId } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  STOP_REASONS,
  STOP_REASON_LABELS,
  type MenuItem,
  type StopInput,
} from '@/entities/menu-item';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { FormField, formControlClassName } from '@/shared/ui/form-field';

import {
  useMenuItemMutation,
  usePendingMenuItemIds,
} from '../model/menu-item.mutations';
import {
  getStopFormValues,
  stopFormResolver,
  type StopFormValues,
} from '../model/stop-form';

export function StopForm({
  item,
  onCancel
}: {
  item: MenuItem;
  onCancel: () => void;
}) {
  const prefix = useId();
  const reasonId = `${prefix}-reason`;
  const durationId = `${prefix}-duration`;
  const untilId = `${prefix}-until`;
  const mutation = useMenuItemMutation();
  const pendingIds = usePendingMenuItemIds();
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<StopFormValues, unknown, StopInput>({
    defaultValues: getStopFormValues(item),
    resolver: stopFormResolver,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const duration = useWatch({ control, name: 'duration' });
  const pending = isSubmitting || pendingIds.has(item.id);
  const durationField = register('duration');

  useEffect(() => {
    if (pending) return;

    if (errors.reason?.type === 'server') setFocus('reason');
    else if (errors.localUntil?.type === 'server') setFocus('localUntil');
  }, [pending, errors.reason, errors.localUntil, setFocus]);

  const submit = handleSubmit(async (input) => {
    if (pendingIds.has(item.id)) return;

    try {
      await mutation.mutateAsync({ type: 'stop', id: item.id, input });
    } catch (error: unknown) {
      if (!(error instanceof ApiError) || !error.fieldErrors) return;

      for (const field of ['reason', 'until'] as const) {
        const message = error.fieldErrors[field]?.[0];
        if (!message) continue;
        setError(field === 'until' ? 'localUntil' : 'reason', {
          type: 'server',
          message,
        });
      }
    }
  });

  return (
    <form noValidate onSubmit={submit}>
      <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">Причина и срок стопа</legend>
        <FormField
          id={reasonId}
          label="Причина стопа"
          error={errors.reason?.message}
        >
          <select
            {...register('reason')}
            id={reasonId}
            required
            data-dialog-initial-focus
            aria-invalid={Boolean(errors.reason)}
            aria-describedby={errors.reason ? `${reasonId}-error` : undefined}
            className={formControlClassName}
          >
            <option value="">Выберите причину</option>
            {STOP_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {STOP_REASON_LABELS[reason]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id={durationId} label="Срок стопа">
          <select
            {...durationField}
            id={durationId}
            className={formControlClassName}
            onChange={(event) => {
              void durationField.onChange(event);
              clearErrors('localUntil');
            }}
          >
            <option value="shift">До конца смены</option>
            <option value="time">Конкретное время</option>
          </select>
        </FormField>
        {duration === 'time' && (
          <FormField
            id={untilId}
            label="Дата и время"
            error={errors.localUntil?.message}
            hint="Местное время. В пределах 24 часов, с шагом 15 минут."
          >
            <input
              {...register('localUntil')}
              id={untilId}
              type="datetime-local"
              step={900}
              required
              aria-invalid={Boolean(errors.localUntil)}
              aria-describedby={[
                `${untilId}-hint`,
                errors.localUntil ? `${untilId}-error` : '',
              ]
                .filter(Boolean)
                .join(' ')}
              className={formControlClassName}
            />
          </FormField>
        )}
      </fieldset>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" pending={pending}>
          {item.status === 'stopped'
            ? 'Сохранить изменения'
            : 'Поставить в стоп-лист'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
