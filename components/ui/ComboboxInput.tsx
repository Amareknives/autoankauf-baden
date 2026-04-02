'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'list' | 'onClick'> {
  /** ID des zugehörigen <datalist> – wird genutzt um die Optionen auszulesen */
  listId: string;
  value: string;
  onValueChange: (value: string) => void;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

/**
 * Custom Combobox: zeigt beim Fokus/Klick ALLE Optionen als eigenes Dropdown,
 * ohne das Feld zu leeren. Tippt der User, wird gefiltert.
 */
export function ComboboxInput({
  listId,
  value,
  onValueChange,
  className,
  onFocus,
  onBlur,
  onClick,
  ...props
}: ComboboxInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  // Externe Wertänderungen (Formular-Reset etc.) synchronisieren
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const readOptions = () => {
    const list = document.getElementById(listId);
    if (!list) return [];
    return Array.from(list.querySelectorAll('option')).map(o => o.value);
  };

  const openDropdown = () => {
    setOptions(readOptions());
    setIsOpen(true);
  };

  const selectOption = (opt: string) => {
    setInputValue(opt);
    onValueChange(opt);
    setIsOpen(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    openDropdown();
    onFocus?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    openDropdown();
    onClick?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onValueChange(e.target.value);
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Nicht schließen wenn Fokus ins Dropdown geht
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

  const filtered = inputValue
    ? options.filter(o => o.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        {...props}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onClick={handleClick}
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
              onMouseDown={(e) => {
                e.preventDefault(); // verhindert blur vor click
                selectOption(opt);
              }}
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
