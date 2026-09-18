import { z } from 'zod';

import { stopReasonSchema, untilSchema } from './menu-item.schema';
import { validateUntil } from './validate-until';

export const stopInputSchema = z
  .object({
    reason: stopReasonSchema,
    until: untilSchema.superRefine((value, context) => {
      const message = validateUntil(value);

      if (message !== null) {
        context.addIssue({ code: z.ZodIssueCode.custom, message });
      }
    }),
  })
  .strict();
