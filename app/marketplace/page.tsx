import type { Metadata } from "next";
import MarketplaceExplorer from "@/components/MarketplaceExplorer";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Transfer Marketplace | TransferHub",
  description: "Explore fictional illustrative transfer corridors available in the TransferHub prototype.",
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader currentPage="marketplace" />
      <section className="border-b border-blue-950/20 bg-[#071a35] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl"><p className="eyebrow text-emerald-300">ILLUSTRATIVE DISCOVERY</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Transfer Marketplace</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Explore available illustrative transfer corridors and see which fictional sample options the current prototype can compare.</p><p className="mt-5 max-w-2xl rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">All provider identities, fees, rates, delivery estimates, payout methods, rankings, and corridor values are fictional sample data—not live quotes.</p></div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20"><MarketplaceExplorer /></div>
      <footer className="bg-[#06152e] px-5 py-10 text-sm text-slate-400 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p>© 2026 TransferHub.info.</p><p>Illustrative corridor discovery does not imply provider partnership or endorsement.</p></div></footer>
    </main>
  );
}
