'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'onClick'> {
  listId: string;
  value: string;
  onValueChange: (value: string) => void;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

/**
 * Input mit Datalist – zeigt beim Fokussieren und beim Klick in ein bereits
 * fokussiertes Feld ALLE Optionen an. Direkte DOM-Manipulation per Ref damit
 * der Browser die leere Datalist sofort (synchron) sieht.
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
  const inputRef = useRef<HTMLInputElement>(null);
  const savedValue = useRef(value);
  const isFocused = useRef(false);

  // Externe Wertänderungen (z.B. Formular-Reset) in DOM übernehmen,
  // aber nur wenn Feld nicht fokussiert ist
  useEffect(() => {
    savedValue.current = value;
    if (inputRef.current && !isFocused.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const openDropdown = () => {
    if (!inputRef.current) return;
    savedValue.current = inputRef.current.value;
    // Direkt im DOM leeren → Browser sieht sofort '' → alle Optionen erscheinen
    inputRef.current.value = '';
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocused.current = true;
    openDropdown();
    onFocus?.(e);
  };

  // Feld bereits fokussiert und hat noch einen Wert → blur+focus simulieren,
  // das ist exakt was "rausklicken und wieder reinklicken" macht (und was funktioniert)
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (isFocused.current && inputRef.current && inputRef.current.value !== '') {
      inputRef.current.blur();
      inputRef.current.focus();
    }
    onClick?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocused.current = false;
    if (inputRef.current && inputRef.current.value.trim() === '') {
      // Nichts ausgewählt → vorherigen Wert wiederherstellen
      inputRef.current.value = savedValue.current;
      onValueChange(savedValue.current);
    }
    onBlur?.(e);
  };

  return (
    <input
      ref={inputRef}
      {...props}
      list={listId}
      defaultValue={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onClick={handleClick}
      onBlur={handleBlur}
      className={cn(className)}
    />
  );
}

export default ComboboxInput;
