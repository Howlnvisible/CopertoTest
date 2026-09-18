import { z } from 'zod';

import { SHOPS, STOP_REASONS } from './constants';

export const shopSchema = z.enum(SHOPS);
export const stopReasonSchema = z.enum(STOP_REASONS, {
  errorMap: () => ({ message: 'Выберите причину стопа из списка' }),
});

export const untilSchema = z
  .string({
    required_error: 'Укажите срок стопа',
    invalid_type_error: 'Некорректное время',
  })
  .datetime({ offset: true, message: 'Некорректное время' })
  .nullable();

const baseFields = {
  id: z.string().min(1),
  name: z.string().min(1),
  shop: shopSchema,
  remaining: z.number().int().nonnegative(),
};

export const menuItemSchema = z.discriminatedUnion('status', [
  z.object({
    ...baseFields,
    status: z.literal('available'),
    stopReason: z.null(),
    until: z.null(),
  }),
  z.object({
    ...baseFields,
    status: z.literal('stopped'),
    stopReason: stopReasonSchema,
    until: untilSchema,
  }),
]);

export const menuItemResponseSchema = z.object({ data: menuItemSchema });
export const menuItemsResponseSchema = z.object({
  data: z.array(menuItemSchema),
});
