import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import WorkspaceDashboard from "@/components/WorkspaceDashboard";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> { const { lang } = await params; if (!isLocale(lang)) return {}; const copy = getDictionary(lang).workspaceCenter; return { title: copy.metadataTitle, description: copy.metadataDescription }; }

export default async function WorkspacePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const dictionary = getDictionary(lang); const copy = dictionary.workspaceCenter;
  return <main className="min-h-screen bg-slate-50 text-slate-950"><SiteHeader locale={lang} dictionary={dictionary} currentPage="workspace" /><section className="border-b border-blue-950/20 bg-[#071a35] px-5 py-16 text-white sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><p className="eyebrow text-emerald-300">{copy.eyebrow}</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p><p className="mt-5 max-w-3xl rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">{copy.disclosure}</p></div></section><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20"><WorkspaceDashboard locale={lang} dictionary={dictionary} /></div><footer className="bg-[#06152e] px-5 py-10 text-sm text-slate-400 sm:px-8"><div className="mx-auto max-w-7xl"><p>{dictionary.common.copyright}</p></div></footer></main>;
}
