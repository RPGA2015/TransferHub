import Link from "next/link";

function LogoMark() {
  return <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-emerald-300" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h13m-4-4 4 4-4 4M19 16H6m4 4-4-4 4-4" /></svg></span>;
}

const sectionLinks = [
  ["Home", "home"],
  ["Features", "features"],
  ["How It Works", "how-it-works"],
  ["About", "about"],
  ["FAQ", "faq"],
] as const;

export default function SiteHeader({ currentPage = "home" }: { currentPage?: "home" | "marketplace" }) {
  const sectionHref = (section: string) => currentPage === "home" ? `#${section}` : `/#${section}`;
  return (
    <header className={`${currentPage === "home" ? "absolute" : "relative bg-[#06152e]"} inset-x-0 top-0 z-50 border-b border-white/10`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary navigation">
        <Link href={sectionHref("home")} className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"><LogoMark />TransferHub</Link>
        <div className="hidden items-center gap-7 lg:flex">
          {sectionLinks.map(([label, section]) => <Link key={section} href={sectionHref(section)} aria-current={currentPage === "home" && section === "home" ? "page" : undefined} className="text-sm font-medium text-slate-300 transition hover:text-white">{label}</Link>)}
          <Link href="/marketplace" aria-current={currentPage === "marketplace" ? "page" : undefined} className="text-sm font-medium text-slate-300 transition hover:text-white">Marketplace</Link>
        </div>
        <div className="hidden items-center gap-5 lg:flex"><span className="cursor-not-allowed text-sm font-semibold text-slate-400" aria-disabled="true">Sign In <span className="sr-only">coming soon</span></span><Link href="/waitlist" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/10 transition hover:bg-blue-50">Join Waitlist</Link></div>
        <details className="group relative lg:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl border border-white/15 text-white [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
            {sectionLinks.map(([label, section]) => <Link key={section} href={sectionHref(section)} aria-current={currentPage === "home" && section === "home" ? "page" : undefined} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{label}</Link>)}
            <Link href="/marketplace" aria-current={currentPage === "marketplace" ? "page" : undefined} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Marketplace</Link>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3"><span className="rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-400" aria-disabled="true">Sign In soon</span><Link href="/waitlist" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">Join Waitlist</Link></div>
          </div>
        </details>
      </nav>
    </header>
  );
}
