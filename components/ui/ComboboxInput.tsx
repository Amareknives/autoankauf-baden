'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'list'> {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
}

export function ComboboxInput({
  options,
  value,
  onValueChange,
  className,
  onFocus,
  onBlur,
  ...props
}: ComboboxInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filtered = inputValue
    ? options.filter(o => o.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  const selectOption = (opt: string) => {
    setInputValue(opt);
    onValueChange(opt);
    setIsOpen(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    onFocus?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onValueChange(e.target.value);
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setIsOpen(false);
    onBlur?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' && isOpen && filtered.length > 0) {
      e.preventDefault();
      selectOption(filtered[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        {...props}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={cn(className)}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-[#E2EDF7] bg-white shadow-lg">
          {filtered.map((opt) => (
            <li
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
              className="cursor-pointer px-3 py-2 text-sm text-[#0F172A] hover:bg-[#F0F7FF]"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComboboxInput;
