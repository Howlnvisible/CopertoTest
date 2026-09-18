import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { QueryProvider } from '@/_app/providers/query-provider';

import '@/_app/styles/globals.css';

export const metadata: Metadata = {
  title: 'Стоп лист кухни',
  description: 'Панель управления стоп листом.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
