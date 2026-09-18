import 'server-only';

import { setTimeout as delay } from 'node:timers/promises';

import type { ZodError } from 'zod';

import { stopInputSchema, type MenuItem } from '@/entities/menu-item';
import type { ApiErrorBody, ApiSuccess } from '@/shared/api/contracts';

import {
  getMenuItem,
  listMenuItems,
  saveMenuItem,
} from '../mock-api/store.server';

const GET_DELAY_MS = 400;
const MUTATION_DELAY_MS = 600;
const FAILURE_RATE = 0.2;
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' };

type MenuItemRouteContext = { params: Promise<{ id: string }> };

function success<T>(data: T): Response {
  return Response.json({ data } satisfies ApiSuccess<T>, {
    headers: NO_STORE_HEADERS,
  });
}

function failure(
  status: number,
  code: string,
  message: string,
  fieldErrors?: Record<string, string[]>,
): Response {
  return Response.json(
    {
      error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) },
    } satisfies ApiErrorBody,
    { status, headers: NO_STORE_HEADERS },
  );
}

function invalidFields(error: ZodError): Response {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === 'reason' || field === 'until') {
      (fieldErrors[field] ??= []).push(issue.message);
    }
  }

  return failure(
    400,
    'VALIDATION_ERROR',
    'Проверьте причину и срок стопа.',
    fieldErrors,
  );
}

function missingItem(): Response {
  return failure(404, 'NOT_FOUND', 'Позиция меню не найдена.');
}

function simulatedFailure(): Response {
  return failure(
    500,
    'SIMULATED_FAILURE',
    'Не удалось сохранить изменения. Попробуйте ещё раз.',
  );
}

function unexpectedFailure(error: unknown): Response {
  console.error('Menu API error:', error);
  return failure(
    500,
    'INTERNAL_ERROR',
    'Не удалось выполнить запрос. Попробуйте ещё раз.',
  );
}

export async function getMenuItemsRoute(): Promise<Response> {
  try {
    await delay(GET_DELAY_MS);
    return success(listMenuItems());
  } catch (error: unknown) {
    return unexpectedFailure(error);
  }
}

export async function stopMenuItemRoute(
  request: Request,
  { params }: MenuItemRouteContext,
): Promise<Response> {
  try {
    await delay(MUTATION_DELAY_MS);
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return failure(
        400,
        'INVALID_JSON',
        'Тело запроса должно содержать корректный JSON.',
      );
    }

    const result = stopInputSchema.safeParse(body);
    if (!result.success) return invalidFields(result.error);

    const item = getMenuItem(id);
    if (!item) return missingItem();
    if (Math.random() < FAILURE_RATE) return simulatedFailure();

    const updated: MenuItem = {
      ...item,
      status: 'stopped',
      stopReason: result.data.reason,
      until: result.data.until,
    };

    saveMenuItem(updated);
    return success(updated);
  } catch (error: unknown) {
    return unexpectedFailure(error);
  }
}

export async function resumeMenuItemRoute(
  _request: Request,
  { params }: MenuItemRouteContext,
): Promise<Response> {
  try {
    await delay(MUTATION_DELAY_MS);
    const { id } = await params;

    const item = getMenuItem(id);
    if (!item) return missingItem();
    if (item.remaining === 0) {
      return failure(
        409,
        'OUT_OF_STOCK',
        'Нельзя вернуть в продажу позицию с нулевым остатком.',
      );
    }
    if (Math.random() < FAILURE_RATE) return simulatedFailure();

    const updated: MenuItem = {
      ...item,
      status: 'available',
      stopReason: null,
      until: null,
    };

    saveMenuItem(updated);
    return success(updated);
  } catch (error: unknown) {
    return unexpectedFailure(error);
  }
}
