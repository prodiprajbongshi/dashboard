import { getInitials, cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  src?: string;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-indigo-500',
  'from-emerald-500 to-cyan-500',
  'from-violet-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-teal-500 to-emerald-500',
];

function pickColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Avatar({ name, size = 'md', src, className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = pickColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white/10', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      title={name}
      className={cn(
        'rounded-full flex items-center justify-center font-semibold bg-gradient-to-br shrink-0',
        'ring-2 ring-white/10 text-white',
        colorClass,
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
