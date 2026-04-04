'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronLeft } from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'Januar' },
  { value: 2, label: 'Februar' },
  { value: 3, label: 'März' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Dezember' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

type Step = 'monat' | 'jahr';

interface BaujahrChipSelectProps {
  monat: number | undefined;
  jahr: number | undefined;
  onMonatChange: (v: number | undefined) => void;
  onJahrChange: (v: number | undefined) => void;
  error?: string;
}

export function BaujahrChipSelect({
  monat,
  jahr,
  onMonatChange,
  onJahrChange,
  error,
}: BaujahrChipSelectProps) {
  const [step, setStep] = useState<Step>('monat');
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const sheetSearchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStartY = useRef(0);

  const hasBothValues = monat !== undefined && jahr !== undefined;
  const monthLabel = monat ? (MONTHS.find(m => m.value === monat)?.label ?? '') : '';
  const chipLabel = hasBothValues ? `${monthLabel} ${jahr}` : '';

  // Mobile-Erkennung
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const doOpen = (s: Step = 'monat') => {
    clearTimeout(closeTimer.current);
    setStep(s);
    setSearch('');
    setActiveIndex(-1);
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const doClose = () => {
    setVisible(false);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setSearch('');
    }, 200);
  };

  // Fokus auf Sheet-Suchfeld (Mobile)
  useEffect(() => {
    if (visible && isMobile) {
      const t = setTimeout(() => sheetSearchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [visible, isMobile]);

  // Fokus auf Desktop-Input wenn sich der Step ändert
  useEffect(() => {
    if (!isMobile && isOpen) {
      const t = setTimeout(() => desktopInputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [step, isMobile, isOpen]);

  // Zum gewählten Jahr scrollen wenn Jahr-Schritt öffnet
  useEffect(() => {
    if (step === 'jahr' && isOpen && listRef.current && jahr && !search) {
      const idx = YEARS.indexOf(jahr);
      if (idx >= 0) {
        const item = listRef.current.children[idx] as HTMLElement;
        item?.scrollIntoView({ block: 'center' });
      }
    }
  }, [step, isOpen]);

  // Klick außerhalb → schließen (Desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) doClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, isMobile]);

  // Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') doClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Aktiven Eintrag scrollen
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      (listRef.current.children[activeIndex] as HTMLElement)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Aktuelle Optionsliste je nach Step
  const allOptions =
    step === 'monat'
      ? MONTHS.map(m => ({ value: String(m.value), label: m.label }))
      : YEARS.map(y => ({ value: String(y), label: String(y) }));

  const filteredOptions = search
    ? allOptions.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : allOptions;

  const pickItem = (val: string) => {
    if (step === 'monat') {
      onMonatChange(Number(val));
      // Automatisch zu Jahr-Schritt wechseln
      setStep('jahr');
      setSearch('');
      setActiveIndex(-1);
      if (!isMobile) {
        setTimeout(() => desktopInputRef.current?.focus(), 10);
      }
    } else {
      onJahrChange(Number(val));
      doClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, filteredOptions.length - 1));
        if (!isOpen) doOpen(monat !== undefined ? 'jahr' : 'monat');
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          pickItem(filteredOptions[activeIndex >= 0 ? activeIndex : 0].value);
        } else if (!isOpen) {
          doOpen(monat !== undefined ? 'jahr' : 'monat');
        }
        break;
      case 'Escape':
        doClose();
        break;
    }
  };

  const renderList = (maxH: string) => (
    <ul
      ref={listRef}
      role="listbox"
      className="overflow-y-auto"
      style={{ maxHeight: maxH }}
    >
      {filteredOptions.length === 0 ? (
        <li className="px-4 py-3 text-[15px] text-[#64748B]">Keine Ergebnisse</li>
      ) : (
        filteredOptions.map((opt, i) => {
          const isSelected =
            step === 'monat' ? monat === Number(opt.value) : jahr === Number(opt.value);
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={isSelected}
              onMouseDown={e => { e.preventDefault(); pickItem(opt.value); }}
              onTouchEnd={e => { e.preventDefault(); pickItem(opt.value); }}
              className={[
                'flex min-h-[48px] cursor-pointer items-center px-4 text-[15px] transition-colors duration-100',
                isSelected
                  ? 'bg-[#0369A1] font-semibold text-white'
                  : i === activeIndex
                    ? 'bg-[#EBF5FF] text-[#0369A1]'
                    : 'text-[#0F172A] hover:bg-[#EBF5FF]',
              ].join(' ')}
            >
              {opt.label}
            </li>
          );
        })
      )}
    </ul>
  );

  const renderStepHeader = () => (
    <div className="flex shrink-0 items-center gap-2 border-b border-[#E2EDF7] px-4 py-2.5">
      {step === 'jahr' && (
        <button
          type="button"
          onClick={() => { setStep('monat'); setSearch(''); setActiveIndex(-1); }}
          className="flex items-center gap-1 text-[13px] text-[#0369A1] transition-colors hover:text-[#025A8E]"
        >
          <ChevronLeft size={14} />
          {monthLabel}
        </button>
      )}
      <span className="text-[13px] font-semibold text-[#0F172A]">
        {step === 'monat' ? 'Monat wählen' : 'Jahr wählen'}
      </span>
    </div>
  );

  // Desktop Trigger-Display: zeigt Monat wenn gewählt aber Jahr fehlt
  const triggerDisplayValue = isOpen
    ? search
    : monat && !hasBothValues
      ? monthLabel
      : '';
  const triggerPlaceholder = monat && !hasBothValues
    ? 'Jahr wählen'
    : 'Erstzulassung wählen';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-[#0F172A]">
        Erstzulassung
      </label>

      <div ref={containerRef} className="relative">
        {hasBothValues ? (
          /* Kombinierter Chip */
          <button
            type="button"
            aria-label={`Erstzulassung ${chipLabel} entfernen`}
            onClick={() => { onMonatChange(undefined); onJahrChange(undefined); doOpen('monat'); }}
            className="inline-flex items-center gap-2 rounded-lg text-[14px] font-bold text-white transition-colors duration-200"
            style={{ backgroundColor: '#0369A1', padding: '6px 12px' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#025A8E')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0369A1')}
          >
            {chipLabel}
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        ) : isMobile ? (
          /* Mobile: Tap-Target */
          <button
            type="button"
            onClick={() => doOpen(monat !== undefined ? 'jahr' : 'monat')}
            aria-expanded={isOpen}
            className="form-field flex w-full cursor-pointer items-center gap-2 text-left"
          >
            <Search size={16} className="shrink-0 text-[#64748B]" aria-hidden="true" />
            <span className="text-[#94A3B8]">
              {monat && !hasBothValues ? `${monthLabel} · Jahr wählen` : 'Erstzulassung wählen'}
            </span>
          </button>
        ) : (
          /* Desktop: Sucheingabe */
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <input
              ref={desktopInputRef}
              type="text"
              value={triggerDisplayValue}
              onChange={e => {
                setSearch(e.target.value);
                setActiveIndex(-1);
                if (!isOpen) doOpen(monat !== undefined ? 'jahr' : 'monat');
              }}
              onFocus={() => {
                if (!isOpen) doOpen(monat !== undefined ? 'jahr' : 'monat');
              }}
              onKeyDown={handleKeyDown}
              placeholder={triggerPlaceholder}
              autoComplete="off"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className="form-field pl-9"
            />
          </div>
        )}

        {/* Desktop Dropdown */}
        {!isMobile && isOpen && (
          <div
            role="presentation"
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl bg-white"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 200ms ease, transform 200ms ease',
            }}
          >
            {renderStepHeader()}
            {renderList('280px')}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobile && isOpen && (
        <>
          {/* Overlay */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black"
            style={{
              opacity: visible ? 0.5 : 0,
              transition: 'opacity 200ms ease',
            }}
            onClick={doClose}
          />
          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[20px] bg-white"
            style={{
              height: '65vh',
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 200ms ease',
            }}
            onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
              if (e.changedTouches[0].clientY - touchStartY.current > 60) doClose();
            }}
          >
            {/* Handle */}
            <div className="flex shrink-0 justify-center pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-[#CBD5E1]" aria-hidden="true" />
            </div>
            {/* Step-Header */}
            {renderStepHeader()}
            {/* Suchfeld */}
            <div className="shrink-0 px-4 py-3">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                  aria-hidden="true"
                />
                <input
                  ref={sheetSearchRef}
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setActiveIndex(-1); }}
                  onKeyDown={handleKeyDown}
                  placeholder={step === 'monat' ? 'Monat suchen...' : 'Jahr suchen...'}
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-[#E2EDF7] bg-white pl-9 pr-3 text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#0369A1]/20"
                />
              </div>
            </div>
            {/* Liste */}
            {renderList('calc(65vh - 155px)')}
          </div>
        </>
      )}

      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export default BaujahrChipSelect;
