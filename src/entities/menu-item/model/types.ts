import type { z } from 'zod';

import type {
  menuItemSchema,
  shopSchema,
  stopReasonSchema,
} from './menu-item.schema';
import type { stopInputSchema } from './stop-schema';

export type Shop = z.infer<typeof shopSchema>;
export type StopReason = z.infer<typeof stopReasonSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type StopInput = z.infer<typeof stopInputSchema>;
