export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#E2EDF7] border-t-[#0369A1] rounded-full animate-spin" />
        <p className="text-[#64748B] font-medium">Wird geladen...</p>
      </div>
    </div>
  );
}
