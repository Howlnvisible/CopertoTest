import { MenuItemRow, type MenuItem } from '@/entities/menu-item';

export function MenuList({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <div role="status" className="px-6 py-16 text-center">
        <h2 className="text-lg font-semibold">Позиций пока нет</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Когда в меню появятся позиции, они отобразятся здесь.
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Таблица меню — доступна горизонтальная прокрутка"
      tabIndex={0}
      className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      <table className="w-full min-w-212.5 text-left text-sm">
        <caption className="sr-only">Позиции меню смены и их статус</caption>
        <thead className="border-b border-foreground/10 bg-foreground/2 text-xs text-foreground/60">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">
              Позиция
            </th>
            <th scope="col" className="px-4 py-4 font-medium">
              Цех
            </th>
            <th scope="col" className="px-4 py-4 font-medium">
              Остаток
            </th>
            <th scope="col" className="px-4 py-4 font-medium">
              Статус
            </th>
            <th scope="col" className="px-4 py-4 font-medium">
              Причина и срок стопа
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {items.map((item) => (
            <MenuItemRow key={item.id} item={item} isPending={false} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
