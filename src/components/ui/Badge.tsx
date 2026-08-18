import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'violet'
    | 'cyan';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses: Record<string, string> = {
  default: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  style,
}: BadgeProps) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center font-semibold rounded-full border',
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px]'
          : 'px-3 py-1 text-xs',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}