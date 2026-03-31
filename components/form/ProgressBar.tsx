import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ['Fahrzeug', 'Zustand', 'Ausstattung', 'Kontakt'];

export function ProgressBar({ currentStep, totalSteps = 4 }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-2 px-10 pt-8 pb-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
          Schritt {currentStep} von {totalSteps} &mdash; {STEP_LABELS[currentStep - 1]}
        </span>
        <span className="text-xs font-bold text-[#0369A1]">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#E2EDF7] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0369A1] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                  isDone
                    ? 'bg-[#0369A1] text-white'
                    : isActive
                    ? 'bg-[#0369A1] text-white ring-4 ring-[#E8F4FD]'
                    : 'bg-[#E2EDF7] text-[#94A3B8]',
                ].join(' ')}
              >
                {isDone ? <Check size={14} strokeWidth={2.5} /> : step}
              </div>
              <span
                className={[
                  'hidden sm:block text-[10px] font-medium',
                  isActive ? 'text-[#0369A1]' : 'text-[#94A3B8]',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
