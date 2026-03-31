import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide"
          >
            {label}
            {!required && <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full resize-y rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all duration-200 min-h-[100px]',
            'focus:border-[#0369A1] focus:ring-3 focus:ring-[#E8F4FD]',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#FEF2F2]',
            className
          )}
          {...props}
        />
        {hint && !error && <span className="text-xs text-[#94A3B8]">{hint}</span>}
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
export default Textarea;
