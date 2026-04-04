'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'list'> {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  /** Stil wenn ein Wert gewählt ist. Auf dunklem Hintergrund undefined übergeben. */
  selectedStyle?: React.CSSProperties;
}

export function ComboboxInput({
  options,
  value,
  onValueChange,
  className,
  placeholder,
  selectedStyle = { color: '#0369A1', fontWeight: 600 },
  ...props
}: ComboboxInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Was im Input-Feld steht (angezeigter Text)
  const [displayValue, setDisplayValue] = useState(value);
  // Was gefiltert wird – leer = alle Optionen zeigen
  const [filterText, setFilterText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Externe Wertänderungen übernehmen (z.B. Marke-Reset → Modell leeren)
  useEffect(() => {
    setDisplayValue(value);
    setFilterText('');
  }, [value]);

  // filterText leer = alle Optionen, sonst gefiltert
  const filtered = filterText
    ? options.filter(o => o.toLowerCase().includes(filterText.toLowerCase()))
    : options;

  const selectOption = (opt: string) => {
    setDisplayValue(opt);
    setFilterText('');
    onValueChange(opt);
    setIsOpen(false);
  };

  // Klick/Fokus → Dropdown öffnen, Filter zurücksetzen → ALLE Optionen sichtbar
  const handleOpen = () => {
    setFilterText('');
    setIsOpen(true);
  };

  // Nutzer tippt → filtern
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDisplayValue(v);
    setFilterText(v);
    onValueChange(v);
    setIsOpen(true);
  };

  // Fokus verloren → schließen
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setIsOpen(false);
    setFilterText('');
    // Tippfehler ohne Auswahl → letzten bestätigten Wert wiederherstellen
    if (!options.includes(displayValue) && value) {
      setDisplayValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFilterText('');
      setDisplayValue(value);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && isOpen && filtered.length > 0) {
      e.preventDefault();
      selectOption(filtered[0]);
    }
  };

  // Blau wenn Wert ausgewählt und Nutzer gerade nicht tippt
  const showSelectedStyle = !!value && displayValue === value && !filterText;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        {...props}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleOpen}
        onClick={handleOpen}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={showSelectedStyle ? selectedStyle : undefined}
        className={cn(className, 'pr-9')}
      />

      {/* Pfeil-Icon */}
      <div
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
        aria-hidden="true"
      >
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={cn('transition-transform duration-200', isOpen ? 'rotate-180 text-[#0369A1]' : '')}
        />
      </div>

      {/* Dropdown-Liste */}
      {isOpen && filtered.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#E2EDF7] bg-white shadow-xl"
          role="listbox"
        >
          {filtered.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
              className={cn(
                'flex min-h-[44px] cursor-pointer items-center px-4 py-2.5 text-[15px] transition-colors duration-100',
                opt === value
                  ? 'bg-[#F0F7FF] font-semibold text-[#0369A1]'
                  : 'text-[#0F172A] hover:bg-[#F0F7FF] hover:text-[#0369A1]'
              )}
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
