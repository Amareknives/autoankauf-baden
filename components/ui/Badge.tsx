import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'blue' | 'coral' | 'green' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  const variants = {
    blue: 'bg-[#E0F2FE] text-[#0369A1]',
    coral: 'bg-[#FEE2E2] text-[#DC2626]',
    green: 'bg-[#DCFCE7] text-[#16A34A]',
    gray: 'bg-[#F1F5F9] text-[#64748B]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
