import type { ReactNode } from 'react';

export const formControlClassName =
  'mt-2 block w-full min-w-0 rounded-lg border border-foreground/25 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-accent disabled:opacity-60';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  hint,
  children
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-foreground/65">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent-strong">
          {error}
        </p>
      )}
    </div>
  );
}
