import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: string;
  variant?: 'primary' | 'secondary';
};

export function Button({
  children,
  pending = false,
  pendingLabel = 'Сохраняем…',
  variant = 'primary',
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 ${variant === 'primary' ? 'bg-accent text-white hover:bg-accent/90' : 'border border-foreground/20 bg-white text-foreground hover:bg-background'} ${className}`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
        />
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
