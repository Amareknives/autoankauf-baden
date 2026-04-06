'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface ChipSelectSection {
  label?: string;
  items: string[];
}

interface ChipSelectProps {
  /** Flache Optionsliste */
  options?: string[];
  /** Gruppierte Optionen mit Labels (z.B. Beliebte / Alle Marken) */
  sections?: ChipSelectSection[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  /** Desktop: Panel öffnet rechts neben dem Eingabefeld, 80vh hoch */
  rightPanel?: boolean;
  /** Alias-Map für Suche: { 'Eintrag': ['alias1'] } */
  aliases?: Record<string, string[]>;
  disabled?: boolean;
  /** Hinweis statt "Keine Ergebnisse" wenn options leer (z.B. "Erst Marke wählen") */
  emptyHint?: string;
  /** Dropdown sofort beim Mounten öffnen und Element in den sichtbaren Bereich scrollen */
  autoOpen?: boolean;
}

export function ChipSelect({
  options = [],
  sections,
  value,
  onChange,
  placeholder = 'Tippen oder wählen',
  label,
  required,
  error,
  rightPanel = false,
  aliases = {},
  disabled = false,
  emptyHint,
  autoOpen = false,
}: ChipSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [sheetBottom, setSheetBottom] = useState(0);
  // x-Position des Right Panels (berechnet beim Öffnen per getBoundingClientRect)
  const [panelLeft, setPanelLeft] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetSearchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStartY = useRef(0);       // Sheet swipe-to-close
  const itemTouchY = useRef(0);        // Item tap vs. scroll

  // Alle Einträge flach – basis für Filterung und Tastatur-Navigation
  const allItems: string[] = sections ? sections.flatMap(s => s.items) : options;

  // 2-Spalten nur wenn: kein rightPanel, keine Sections, lange Liste
  const useColumns = !isMobile && !rightPanel && !sections && allItems.length > 15;
  const colStep = useColumns ? 2 : 1;

  // Right Panel: volle Viewport-Höhe nur bei vielen Items, sonst kompakt (Höhe = Inhalt)
  const useFullHeight = rightPanel && !isMobile && !search && allItems.length > 10;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const doOpenRef = useRef<() => void>(() => {});

  // autoOpen: Element in Sicht scrollen + Dropdown sofort öffnen (nur Desktop)
  useEffect(() => {
    if (!autoOpen) return;
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) return; // Mobil: kein Auto-Open
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      doOpenRef.current();
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doOpen = () => {
    if (disabled) return;
    clearTimeout(closeTimer.current);

    // Right Panel: x-Position aus Input-Rect berechnen
    if (rightPanel && !isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const panelW = 280;
      const gap = 8;
      const fitsRight = rect.right + gap + panelW <= window.innerWidth;
      setPanelLeft(fitsRight ? rect.right + gap : rect.left - panelW - gap);
    }

    setSearch('');
    setActiveIndex(-1);
    setHoveredIndex(-1);
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  doOpenRef.current = doOpen;

  const doClose = () => {
    setVisible(false);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setSearch('');
    }, 200);
  };

  // Auto-Focus Suchfeld: sofort nach erstem Render (Keyboard erscheint mit Sheet-Animation)
  useEffect(() => {
    if (!isMobile || !isOpen || allItems.length === 0) return;
    const frame = requestAnimationFrame(() => {
      sheetSearchRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [isMobile, isOpen, allItems.length]);

  // Body-Scroll-Lock: verhindert dass iOS beim Keyboard-Öffnen die Seite hochschiebt
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isMobile, isOpen]);

  // Visual Viewport: Sheet über Tastatur schieben (iOS) oder schrumpfen (Android)
  useEffect(() => {
    if (!isMobile || !isOpen) {
      setSheetBottom(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop ?? 0));
      setSheetBottom(offset);
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setSheetBottom(0);
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    // Schließen bei Klick außerhalb:
    // - normales Dropdown: immer
    // - rightPanel im Suchmodus (kompaktes Dropdown): ja
    // - rightPanel im Übersichtsmodus (full-height): nein, Overlay übernimmt
    if (!isOpen || isMobile) return;
    if (useFullHeight) return; // Overlay übernimmt das Schließen
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) doClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, isMobile, rightPanel, search, allItems.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') doClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Scroll zum aktiven Eintrag – nutzt data-index damit Section-Header nicht mitzählen
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      listRef.current
        .querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const filtered = allItems.filter(opt => {
    if (!search) return true;
    const s = search.toLowerCase();
    if (opt.toLowerCase().includes(s)) return true;
    return (aliases[opt] ?? []).some(a => a.toLowerCase().includes(s));
  });

  const pick = (opt: string) => {
    // Keyboard auf Mobile schließen
    sheetSearchRef.current?.blur();
    inputRef.current?.blur();
    onChange(opt);
    doClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + colStep, filtered.length - 1));
        if (!isOpen) doOpen();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - colStep, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && filtered.length > 0) pick(filtered[activeIndex >= 0 ? activeIndex : 0]);
        else if (!isOpen) doOpen();
        break;
      case 'Escape':
        doClose();
        break;
    }
  };

  // Einzelnes Option-Element (data-index = Position im flachen allItems-Array)
  const makeItem = (opt: string, flatIdx: number, extraStyle?: React.CSSProperties) => {
    const isSelected = opt === value;
    const isActive = flatIdx === activeIndex || flatIdx === hoveredIndex;
    return (
      <li
        key={`${opt}-${flatIdx}`}
        role="option"
        aria-selected={isSelected}
        data-index={flatIdx}
        onMouseDown={e => { e.preventDefault(); pick(opt); }}
        onTouchEnd={e => { e.preventDefault(); pick(opt); }}
        onMouseEnter={() => setHoveredIndex(flatIdx)}
        onMouseLeave={() => setHoveredIndex(-1)}
        className="flex min-h-[48px] cursor-pointer items-center px-4 text-[15px] text-white transition-colors duration-100"
        style={{
          backgroundColor: isSelected
            ? 'rgba(255,255,255,0.22)'
            : isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
          ...extraStyle,
        }}
      >
        {opt}
      </li>
    );
  };

  // Desktop-Listeninhalt
  const renderDesktopContent = () => {
    // Keine Optionen vorhanden (z.B. Modell ohne Marke)
    if (allItems.length === 0 && emptyHint) {
      return (
        <li className="flex items-center gap-2.5 px-4 py-4 text-[14px] text-white/60">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 opacity-70">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {emptyHint}
        </li>
      );
    }
    // Leerer Zustand nach Suche
    if (filtered.length === 0 && search) {
      return <li className="px-4 py-3 text-[15px] text-white/60">Keine Ergebnisse</li>;
    }

    // Suche aktiv → flache gefilterte Liste
    if (search) {
      return filtered.map((opt, i) => {
        const flatIdx = allItems.indexOf(opt);
        const isLastOdd = useColumns && i === filtered.length - 1 && filtered.length % 2 === 1;
        return makeItem(opt, i, isLastOdd ? { gridColumn: '1 / -1' } : undefined);
      });
    }

    // Sections vorhanden → Gruppen mit Trennlinien und Labels
    if (sections) {
      const nodes: React.ReactNode[] = [];
      let flatIdx = 0;

      sections.forEach((section, sIdx) => {
        // Trennlinie zwischen Gruppen (nicht vor der ersten)
        if (sIdx > 0) {
          nodes.push(
            <li key={`div-${sIdx}`} role="presentation" aria-hidden="true" className="px-4 py-1.5">
              <div className="h-px bg-white/25" />
            </li>
          );
        }
        // Gruppen-Label
        if (section.label) {
          nodes.push(
            <li
              key={`lbl-${sIdx}`}
              role="presentation"
              className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-white/50"
            >
              {section.label}
            </li>
          );
        }
        // Items
        section.items.forEach(opt => {
          nodes.push(makeItem(opt, flatIdx));
          flatIdx++;
        });
      });

      return nodes;
    }

    // Flache Liste (kein search, keine sections)
    return allItems.map((opt, i) => {
      const isLastOdd = useColumns && i === allItems.length - 1 && allItems.length % 2 === 1;
      return makeItem(opt, i, isLastOdd ? { gridColumn: '1 / -1' } : undefined);
    });
  };

  // Mobile-Listeninhalt (mit Sections + Labels, bei Suche flach)
  const renderMobileContent = () => {
    // Leerer Zustand
    if (allItems.length === 0) {
      const isHint = !!emptyHint;
      return (
        <li className="flex items-center gap-2.5 px-4 py-4 text-[14px] text-white/60">
          {isHint && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 opacity-70">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
          {isHint ? emptyHint : 'Keine Ergebnisse'}
        </li>
      );
    }

    const makeMobileItem = (opt: string, key: string) => (
      <li
        key={key}
        role="option"
        aria-selected={opt === value}
        onTouchStart={e => { itemTouchY.current = e.touches[0].clientY; }}
        onTouchEnd={e => {
          const moved = Math.abs(e.changedTouches[0].clientY - itemTouchY.current);
          if (moved < 8) { e.preventDefault(); pick(opt); }
        }}
        className="flex min-h-[48px] cursor-pointer items-center px-4 text-[15px] text-white transition-colors duration-100"
        style={{ backgroundColor: opt === value ? 'rgba(255,255,255,0.22)' : 'transparent' }}
      >
        {opt}
      </li>
    );

    // Suche aktiv → flache gefilterte Liste ohne Sections
    if (search) {
      if (filtered.length === 0) {
        return <li className="px-4 py-3 text-[14px] text-white/60">Keine Ergebnisse</li>;
      }
      return filtered.map((opt, i) => makeMobileItem(opt, `ms-${opt}-${i}`));
    }

    // Sections vorhanden → mit Labels und Trennlinien
    if (sections) {
      const nodes: React.ReactNode[] = [];
      sections.forEach((section, sIdx) => {
        if (sIdx > 0) {
          nodes.push(
            <li key={`mdiv-${sIdx}`} role="presentation" aria-hidden="true" className="px-4 py-1.5">
              <div className="h-px bg-white/20" />
            </li>
          );
        }
        if (section.label) {
          nodes.push(
            <li key={`mlbl-${sIdx}`} role="presentation"
              className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-white/45">
              {section.label}
            </li>
          );
        }
        section.items.forEach((opt, i) => nodes.push(makeMobileItem(opt, `m-${sIdx}-${opt}-${i}`)));
      });
      return nodes;
    }

    // Flache Liste ohne Sections
    return allItems.map((opt, i) => makeMobileItem(opt, `m-${opt}-${i}`));
  };

  const inputDisplayValue = isOpen ? search : value;
  const hasBlueBorder = !!value || isOpen;
  const showX = !!value && !isOpen && !disabled;

  const PANEL_BG = '#014f7a';
  const PANEL_BORDER = '1.5px solid rgba(255,255,255,0.22)';
  const PANEL_SHADOW = '0 8px 32px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08)';

  // Style für normales Dropdown unterhalb
  const dropdownBelowStyle: React.CSSProperties = {
    left: 0,
    right: 0,
    top: '100%',
    marginTop: '4px',
    maxHeight: useColumns ? '360px' : '280px',
    borderRadius: '10px',
    border: PANEL_BORDER,
    boxShadow: PANEL_SHADOW,
    display: useColumns ? 'grid' : undefined,
    gridTemplateColumns: useColumns ? 'repeat(2, 1fr)' : undefined,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-8px)',
    transition: 'opacity 200ms ease, transform 200ms ease',
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#EF4444]">*</span>}
          {!required && <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputDisplayValue}
          onChange={e => {
            if (isMobile) return;
            setSearch(e.target.value);
            setActiveIndex(-1);
            if (!isOpen) doOpen();
          }}
          onClick={() => { if (!isOpen) doOpen(); }}
          onFocus={() => { if (!isOpen) doOpen(); }}
          onKeyDown={handleKeyDown}
          placeholder={isOpen && value ? '' : placeholder}
          autoComplete="off"
          readOnly={isMobile}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          className={[
            'w-full rounded-[10px] border py-3 pl-4 pr-10',
            'text-[15px] placeholder-[#94A3B8]',
            'outline-none transition-colors duration-200',
            disabled
              ? 'bg-[#F8FAFC] border-[#E2EDF7] text-[#94A3B8] cursor-not-allowed opacity-60'
              : [
                  'bg-white text-[#0F172A]',
                  hasBlueBorder ? 'border-[#0369A1]' : 'border-[#E2EDF7] hover:border-[#0369A1]',
                ].join(' '),
          ].join(' ')}
        />

        {showX ? (
          <button
            type="button"
            aria-label="Auswahl löschen"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#0369A1]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        ) : (
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            aria-hidden="true"
          >
            <Search size={16} strokeWidth={2} />
          </div>
        )}

        {/* Desktop: normales Dropdown unterhalb */}
        {!isMobile && isOpen && !rightPanel && (
          <ul
            ref={listRef}
            role="listbox"
            className="dropdown-scroll absolute z-50 overflow-y-auto"
            style={{ background: PANEL_BG, ...dropdownBelowStyle }}
          >
            {renderDesktopContent()}
          </ul>
        )}

        {/* Desktop: Right Panel */}
        {!isMobile && isOpen && rightPanel && (
          <>
            {/* Overlay — nur bei voller Viewport-Höhe */}
            {useFullHeight && (
              <div
                aria-hidden="true"
                className="fixed inset-0 z-[998]"
                onClick={doClose}
              />
            )}

            <ul
              ref={listRef}
              role="listbox"
              className="dropdown-scroll overflow-y-auto"
              style={
                useFullHeight
                  ? {
                      // Viele Items → wächst mit Inhalt, max. voller Bildschirm
                      position: 'fixed',
                      top: 0,
                      maxHeight: '100vh',
                      left: panelLeft,
                      width: '280px',
                      background: PANEL_BG,
                      border: PANEL_BORDER,
                      boxShadow: PANEL_SHADOW,
                      zIndex: 999,
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                      transition: 'opacity 200ms ease, transform 200ms ease',
                    }
                  : {
                      // Wenige Items oder Suche aktiv → kompakt, Höhe passt sich an
                      position: 'absolute',
                      left: 'calc(100% + 8px)',
                      top: 0,
                      width: '280px',
                      maxHeight: '400px',
                      borderRadius: '12px',
                      background: PANEL_BG,
                      border: PANEL_BORDER,
                      boxShadow: PANEL_SHADOW,
                      zIndex: 999,
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateX(0)' : 'translateX(-8px)',
                      transition: 'opacity 200ms ease, transform 200ms ease',
                    }
              }
            >
              {renderDesktopContent()}
            </ul>
          </>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobile && isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black"
            style={{ opacity: visible ? 0.5 : 0, transition: 'opacity 200ms ease' }}
            onClick={doClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-[20px] bg-white"
            style={{
              bottom: sheetBottom,
              height: '35vh',
              maxHeight: sheetBottom > 0
                ? `calc(100vh - ${sheetBottom + 60}px)`
                : '50vh',
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 200ms ease',
            }}
            onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
              if (e.changedTouches[0].clientY - touchStartY.current > 60) doClose();
            }}
          >
            <div className="shrink-0 bg-white">
              <div className="flex items-center justify-between px-4 pb-2 pt-3">
                <div className="w-12" />
                <div className="h-1 w-10 rounded-full bg-[#CBD5E1]" aria-hidden="true" />
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); doClose(); }}
                  onTouchEnd={e => { e.preventDefault(); doClose(); }}
                  className="w-12 text-right text-[15px] font-semibold text-[#0369A1]"
                >
                  Fertig
                </button>
              </div>
              {/* Suchfeld nur wenn Optionen vorhanden – verhindert Tastatur bei leerem Hinweis */}
              {allItems.length > 0 && (
                <div className="px-4 pb-3">
                  {/* form onSubmit: zuverlässiges Enter/Go auf Android + iOS */}
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (filtered.length === 1) pick(filtered[0]);
                    else if (filtered.length > 1 && activeIndex >= 0) pick(filtered[activeIndex]);
                  }}>
                  <div className="relative">
                    <input
                      ref={sheetSearchRef}
                      type="search"
                      enterKeyHint={filtered.length === 1 ? 'done' : 'search'}
                      value={search}
                      onChange={e => { setSearch(e.target.value); setActiveIndex(-1); }}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      autoComplete="off"
                      className="w-full rounded-[10px] border border-[#E2EDF7] py-3 pl-4 pr-10 text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0369A1] focus:outline-none"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" aria-hidden="true">
                      <Search size={16} strokeWidth={2} />
                    </div>
                  </div>
                  </form>
                </div>
              )}
            </div>
            <div className="min-h-0 flex-1" style={{ background: PANEL_BG }}>
              <ul
                ref={listRef}
                role="listbox"
                className="dropdown-scroll h-full overflow-y-auto"
                style={{ touchAction: 'pan-y', paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                {renderMobileContent()}
              </ul>
            </div>
          </div>
        </>
      )}

      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export default ChipSelect;
