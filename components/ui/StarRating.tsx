'use client';

import { Star } from 'lucide-react';
import { ZUSTAND_LABELS } from '@/constants/formOptions';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  showLabel?: boolean;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  showLabel = true,
  readOnly = false,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className="focus:outline-none transition-transform duration-100 hover:scale-110 disabled:cursor-default"
            aria-label={`${star} Sterne`}
          >
            <Star
              size={36}
              strokeWidth={2.5}
              fill={star <= value ? '#FB6F6F' : 'none'}
              color={star <= value ? '#FB6F6F' : '#CBD5E1'}
            />
          </button>
        ))}
      </div>
      {showLabel && value > 0 && (
        <span className="text-sm font-medium text-[#0369A1]">
          {ZUSTAND_LABELS[value]}
        </span>
      )}
    </div>
  );
}

export default StarRating;
