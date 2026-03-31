import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[#0369A1] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Seite nicht gefunden</h2>
        <p className="text-[#64748B] mb-8">Die gesuchte Seite existiert leider nicht.</p>
        <Link href="/" className="bg-[#FB6F6F] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#e85f5f] transition-colors">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
