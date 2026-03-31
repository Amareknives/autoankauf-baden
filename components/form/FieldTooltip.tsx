'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface FieldTooltipProps {
  text: string;
}

export function FieldTooltip({ text }: FieldTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="flex h-4 w-4 items-center justify-center rounded-full text-[#64748B] hover:text-[#0369A1] transition-colors duration-150 focus:outline-none"
        aria-label="Hilfe"
      >
        <HelpCircle size={16} strokeWidth={2.5} />
      </button>
      {visible && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg bg-[#0F172A] px-3 py-2 text-xs text-white shadow-lg">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F172A]" />
        </span>
      )}
    </span>
  );
}

export default FieldTooltip;
