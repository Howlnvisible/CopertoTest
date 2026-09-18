import { z } from 'zod';

import type { ApiErrorBody } from './contracts';

const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.record(z.array(z.string())).optional(),
  }),
});

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly fieldErrors?: ApiErrorBody['error']['fieldErrors'],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  url: string,
  decode: (value: unknown) => T,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: 'no-store' });
  } catch (error: unknown) {
    if (init?.signal?.aborted) throw error;
    throw new ApiError(
      'Не удалось связаться с сервером. Проверьте соединение и попробуйте ещё раз.',
      'NETWORK_ERROR',
      0,
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error: unknown) {
    if (init?.signal?.aborted) throw error;
    throw new ApiError(
      response.ok
        ? 'Сервер вернул некорректный ответ. Попробуйте ещё раз.'
        : 'Не удалось выполнить запрос. Попробуйте ещё раз.',
      response.ok ? 'INVALID_RESPONSE' : 'HTTP_ERROR',
      response.status,
    );
  }

  if (!response.ok) {
    const result = apiErrorSchema.safeParse(body);
    if (result.success) {
      const { message, code, fieldErrors } = result.data.error;
      throw new ApiError(message, code, response.status, fieldErrors);
    }
    throw new ApiError(
      'Не удалось выполнить запрос. Попробуйте ещё раз.',
      'HTTP_ERROR',
      response.status,
    );
  }

  try {
    return decode(body);
  } catch {
    throw new ApiError(
      'Сервер вернул некорректные данные. Попробуйте ещё раз.',
      'INVALID_RESPONSE',
      response.status,
    );
  }
}
