import type { FieldErrors, Resolver } from 'react-hook-form';

import {
  stopInputSchema,
  type MenuItem,
  type StopInput,
  type StopReason,
} from '@/entities/menu-item';

export type StopFormValues = {
  reason: StopReason | '';
  duration: 'shift' | 'time';
  localUntil: string;
};

export function toLocalDateTime(value: string): string {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getStopFormValues(item: MenuItem): StopFormValues {
  return {
    reason: item.stopReason ?? '',
    duration: item.until === null ? 'shift' : 'time',
    localUntil: item.until === null ? '' : toLocalDateTime(item.until)
  };
}

export function toStopInput(values: StopFormValues): unknown {
  if (values.duration === 'shift') {
    return { reason: values.reason, until: null };
  }

  const date = new Date(values.localUntil);

  return {
    reason: values.reason,
    until: Number.isFinite(date.getTime())
      ? date.toISOString()
      : values.localUntil
  };
}

export const stopFormResolver: Resolver<StopFormValues, unknown, StopInput> = (
  values,
) => {
  const result = stopInputSchema.safeParse(toStopInput(values));
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<StopFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] === 'reason' ? 'reason' : 'localUntil';
    errors[field] ??= { type: issue.code, message: issue.message };
  }

  return { values: {}, errors };
};
