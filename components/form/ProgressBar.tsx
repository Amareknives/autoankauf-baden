import { Fragment } from 'react'
import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
  maxReachedStep?: number
  onStepClick?: (step: number) => void
}

const STEP_LABELS = ['Fahrzeug', 'Zustand', 'Ausstattung', 'Kontakt']

export function ProgressBar({ currentStep, totalSteps = 4, maxReachedStep = 1, onStepClick }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="flex flex-col gap-2 px-10 pt-8 pb-6">
      {/* Kopfzeile */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
          Schritt {currentStep} von {totalSteps} &mdash; {STEP_LABELS[currentStep - 1]}
        </span>
        <span className="text-xs font-bold text-[#0369A1]">{percent}%</span>
      </div>

      {/* Fortschrittsbalken */}
      <div className="h-2 w-full rounded-full bg-[#E2EDF7] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0369A1] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Schritt-Kreise mit Verbindungslinien */}
      <div className="flex items-start mt-2 w-full">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          const isLast = i === STEP_LABELS.length - 1
          const isDone = step < currentStep
          const isActive = step === currentStep
          const isAccessible = step > currentStep && step <= maxReachedStep
          const isLocked = step > maxReachedStep
          const isClickable = !!(onStepClick && step <= maxReachedStep && step !== currentStep)

          const circleClasses = [
            'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200',
            isDone
              ? 'bg-[#0369A1] text-white'
              : isActive
              ? 'bg-[#0369A1] text-white ring-4 ring-[#E8F4FD]'
              : isAccessible
              ? 'bg-white border-2 border-[#0369A1] text-[#0369A1] group-hover:bg-[#0369A1] group-hover:text-white'
              : 'bg-[#E2EDF7] text-[#94A3B8]',
          ].join(' ')

          const labelClasses = [
            'hidden sm:block text-[11px] font-semibold text-center mt-1.5 transition-colors duration-200',
            isDone || isActive || isAccessible ? 'text-[#0369A1]' : 'text-[#94A3B8]',
            isClickable ? 'group-hover:underline' : '',
          ].join(' ')

          const stepColumn = (
            <div className="flex flex-col items-center">
              <div className={circleClasses}>
                {isDone ? <Check size={16} strokeWidth={2.5} /> : step}
              </div>
              <span className={labelClasses}>{label}</span>
            </div>
          )

          return (
            <Fragment key={step}>
              {/* Schritt-Kachel: klickbar oder statisch */}
              <div className="flex-shrink-0">
                {isClickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick!(step)}
                    className="group flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0369A1] focus-visible:ring-offset-2 rounded-lg"
                    aria-label={`Zu Schritt ${step}: ${label}`}
                  >
                    {stepColumn}
                  </button>
                ) : (
                  <div className={`flex flex-col items-center${isLocked ? ' opacity-50' : ''}`}>
                    {stepColumn}
                  </div>
                )}
              </div>

              {/* Verbindungslinie zum nächsten Schritt */}
              {!isLast && (
                <div className="flex-1 h-0.5 mt-[17px] mx-2 bg-[#E2EDF7] relative overflow-hidden rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#0369A1] transition-all duration-500 ease-out rounded-full"
                    style={{ width: isDone ? '100%' : '0%' }}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressBar
