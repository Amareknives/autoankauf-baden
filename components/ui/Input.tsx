import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, id, onWheel, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const handleWheel = props.type === 'number'
      ? (e: React.WheelEvent<HTMLInputElement>) => { e.currentTarget.blur(); onWheel?.(e) }
      : onWheel

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide"
          >
            {label}
            {required && <span className="ml-0.5 text-[#EF4444]">*</span>}
            {!required && <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          onWheel={handleWheel}
          className={cn(
            'form-field',
            error && 'error',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-[#94A3B8]">{hint}</span>
        )}
        {error && (
          <span className="text-xs text-[#EF4444]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
export default Input;
