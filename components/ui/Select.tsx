import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, required, className, id, ...props }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide"
          >
            {label}
            {!required && <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'form-field pr-10 cursor-pointer',
              error && 'error',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={16} strokeWidth={2.5} className="text-primary" />
          </div>
        </div>
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
export default Select;
