export const SHOPS = ['kitchen', 'bar', 'pastry'] as const;

export const STOP_REASONS = [
  'ingredients_unavailable',
  'equipment_failure',
  'temporarily_unavailable',
  'other',
] as const;

export const SHOP_LABELS: Record<(typeof SHOPS)[number], string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STOP_REASON_LABELS: Record<(typeof STOP_REASONS)[number], string> =
  {
    ingredients_unavailable: 'Закончились ингредиенты',
    equipment_failure: 'Неисправность оборудования',
    temporarily_unavailable: 'Временно снято с продажи',
    other: 'Другая причина',
  };

export const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
export const STEP_MS = 15 * 60 * 1000;
