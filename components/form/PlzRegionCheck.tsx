'use client';

import { getRegionByPlz } from '@/lib/plzRegion';

interface PlzRegionCheckProps {
  plz: string;
}

export function PlzRegionCheck({ plz }: PlzRegionCheckProps) {
  if (!plz || plz.length < 4) return null;

  const region = getRegionByPlz(plz);

  if (!region) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#F0FDF4] border border-[#86EFAC] px-3 py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#22C55E"
        className="h-4 w-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-medium text-[#166534]">
        Super! Wir holen in{' '}
        <span className="font-bold">{region}</span> kostenlos ab.
      </span>
    </div>
  );
}

export default PlzRegionCheck;
