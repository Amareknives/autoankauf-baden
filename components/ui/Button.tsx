'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'coral' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-[12px]';

  const variants = {
    primary: 'bg-[#0369A1] text-white hover:bg-[#025d8f] focus-visible:ring-[#0369A1]',
    coral: 'bg-[#FB6F6F] text-white hover:bg-[#e85f5f] focus-visible:ring-[#FB6F6F]',
    outline:
      'border-2 border-[#0369A1] text-[#0369A1] bg-transparent hover:bg-[#F0F7FF] focus-visible:ring-[#0369A1]',
    ghost: 'text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-[#F1F5F9] focus-visible:ring-[#0369A1]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 size={16} strokeWidth={2.5} className="mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
}

export default Button;
