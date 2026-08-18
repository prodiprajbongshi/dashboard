import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:   'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/25',
  secondary: 'bg-white/8 text-slate-200 hover:bg-white/12 border border-white/10',
  ghost:     'text-slate-400 hover:text-slate-200 hover:bg-white/6',
  danger:    'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
  outline:   'border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-[10px] gap-2',
  lg: 'px-6 py-2.5 text-sm rounded-xl gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
