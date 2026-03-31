export default function FahrzeugVerkaufenLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="mx-auto max-w-[800px] px-4">
        {/* Header skeleton */}
        <div className="mb-10 text-center flex flex-col items-center gap-3">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-[#E2EDF7]" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-[#E2EDF7]" />
          <div className="flex gap-3 mt-1">
            <div className="h-5 w-28 animate-pulse rounded-full bg-[#E2EDF7]" />
            <div className="h-5 w-28 animate-pulse rounded-full bg-[#E2EDF7]" />
            <div className="h-5 w-36 animate-pulse rounded-full bg-[#E2EDF7]" />
          </div>
        </div>

        {/* Form card skeleton */}
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E2EDF7]">
          {/* ProgressBar skeleton */}
          <div className="px-10 pt-8 pb-6 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="h-4 w-36 animate-pulse rounded bg-[#E2EDF7]" />
              <div className="h-4 w-10 animate-pulse rounded bg-[#E2EDF7]" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-[#E2EDF7]" />
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-[#E2EDF7]" />
                  <div className="hidden sm:block h-3 w-16 animate-pulse rounded bg-[#E2EDF7]" />
                </div>
              ))}
            </div>
          </div>

          {/* Form fields skeleton */}
          <div className="px-6 pb-10 sm:px-10 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 animate-pulse rounded bg-[#E2EDF7]" />
              <div className="h-10 w-48 animate-pulse rounded-lg bg-[#E2EDF7]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="h-4 w-20 animate-pulse rounded bg-[#E2EDF7]" />
                  <div className="h-12 animate-pulse rounded-lg bg-[#E2EDF7]" />
                </div>
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-[#E2EDF7]" />
                  <div className="h-12 animate-pulse rounded-lg bg-[#E2EDF7]" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-[#E2EDF7]" />
                  <div className="h-12 animate-pulse rounded-lg bg-[#E2EDF7]" />
                </div>
              </div>
            ))}
            {/* Navigation skeleton */}
            <div className="mt-8 flex items-center justify-end border-t border-[#E2EDF7] pt-6">
              <div className="h-12 w-44 animate-pulse rounded-[12px] bg-[#E2EDF7]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
