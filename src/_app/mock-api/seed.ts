import 'server-only';

import {
  menuItemSchema,
  STEP_MS,
  type MenuItem,
  type Shop,
} from '@/entities/menu-item';

function available(
  id: string,
  name: string,
  shop: Shop,
  remaining: number,
): MenuItem {
  return {
    id,
    name,
    shop,
    remaining,
    status: 'available',
    stopReason: null,
    until: null,
  };
}

export function createMenuSeed(now = Date.now()): MenuItem[] {
  const until = new Date(
    Math.ceil((now + 2 * 60 * 60 * 1000) / STEP_MS) * STEP_MS,
  ).toISOString();

  return menuItemSchema.array().parse([
    available('kitchen-1', 'Салат «Цезарь»', 'kitchen', 12),
    available('kitchen-2', 'Борщ со сметаной', 'kitchen', 8),
    available('kitchen-3', 'Паста карбонара', 'kitchen', 15),
    {
      id: 'kitchen-4',
      name: 'Стейк из говядины',
      shop: 'kitchen',
      remaining: 0,
      status: 'stopped',
      stopReason: 'ingredients_unavailable',
      until: null,
    },
    {
      id: 'kitchen-5',
      name: 'Лосось на гриле',
      shop: 'kitchen',
      remaining: 6,
      status: 'stopped',
      stopReason: 'equipment_failure',
      until,
    },
    available('bar-1', 'Эспрессо', 'bar', 40),
    available('bar-2', 'Капучино', 'bar', 25),
    available('bar-3', 'Чёрный чай', 'bar', 30),
    available('bar-4', 'Домашний лимонад', 'bar', 10),
    {
      id: 'bar-5',
      name: 'Апельсиновый фреш',
      shop: 'bar',
      remaining: 4,
      status: 'stopped',
      stopReason: 'temporarily_unavailable',
      until: null,
    },
    available('pastry-1', 'Чизкейк', 'pastry', 7),
    available('pastry-2', 'Медовик', 'pastry', 9),
    available('pastry-3', 'Тирамису', 'pastry', 5),
    available('pastry-4', 'Круассан', 'pastry', 14),
    available('pastry-5', 'Шоколадный эклер', 'pastry', 11),
  ]);
}
