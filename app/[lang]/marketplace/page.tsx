import type { Metadata } from "next";
import MarketplaceExplorer from "@/components/MarketplaceExplorer";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> { const { lang } = await params; if (!isLocale(lang)) return {}; const dictionary = getDictionary(lang); return { title: dictionary.metadata.marketplaceTitle, description: dictionary.metadata.marketplaceDescription }; }

export default async function MarketplacePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader locale={lang} dictionary={dictionary} currentPage="marketplace" />
      <section className="border-b border-blue-950/20 bg-[#071a35] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl"><p className="eyebrow text-emerald-300">{dictionary.marketplace.eyebrow}</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{dictionary.marketplace.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{dictionary.marketplace.intro}</p><p className="mt-5 max-w-2xl rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">{dictionary.marketplace.disclosure}</p></div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20"><MarketplaceExplorer locale={lang} dictionary={dictionary} /></div>
      <footer className="bg-[#06152e] px-5 py-10 text-sm text-slate-400 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p>{dictionary.common.copyright}</p><p>{dictionary.marketplace.footer}</p></div></footer>
    </main>
  );
}
