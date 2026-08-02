import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TransferComparison from "@/components/TransferComparison";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCorridorById } from "@/lib/services/comparisonEngine";
import { notFound } from "next/navigation";

function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-white/10 text-emerald-300" : "bg-blue-600 text-white"}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h13m-4-4 4 4-4 4M19 16H6m4 4-4-4 4-4" />
      </svg>
    </span>
  );
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    fee: <><path d="M4 7h16v11H4z"/><path d="M8 11h8M8 14h5M7 4v3m10-3v3"/></>,
    rate: <><path d="m7 7 3-3 3 3M10 4v10M17 17l-3 3-3-3M14 20V10"/></>,
    speed: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4.5V20"/></>,
    track: <><path d="M5 4h14v16H5zM9 8h6M9 12h6M9 16h3"/><path d="m16 15 1.5 1.5L21 13"/></>,
  };
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const ButtonArrow = () => <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 10h12m-4-4 4 4-4 4"/></svg>;

type HomeProps = { params: Promise<{ lang: string }>; searchParams: Promise<{ corridor?: string | string[] }> };

export default async function Home({ params, searchParams }: HomeProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  const home = dictionary.homepage;
  const corridorParam = (await searchParams).corridor;
  const corridor = typeof corridorParam === "string" ? getCorridorById(corridorParam) : undefined;
  const initialCorridor = corridor ? { fromCountry: corridor.fromCountry, toCountry: corridor.toCountry } : undefined;
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <SiteHeader locale={lang} dictionary={dictionary} />

      <section id="home" className="hero-grid relative bg-[#06152e] pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-48">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />{home.hero.eyebrow}</div>
            <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{home.hero.titleStart}<br/><span className="text-gradient">{home.hero.titleEmphasis}</span></h1>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-8 text-slate-300 lg:mx-0">{home.hero.description}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><Link href={`/${lang}/waitlist`} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500">{dictionary.navigation.joinWaitlist} <ButtonArrow /></Link><Link href={`/${lang}/marketplace`} className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">{dictionary.navigation.marketplace}</Link></div>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400 lg:justify-start"><svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-400" fill="currentColor" aria-hidden="true"><path d="M10 2 4 4.5V9c0 4.1 2.5 7.3 6 9 3.5-1.7 6-4.9 6-9V4.5L10 2Zm3 6-3.5 4L7 9.7l1.1-1.1 1.3 1.2 2.5-2.9L13 8Z"/></svg>{home.hero.launchNote}</p>
          </div>
          <TransferComparison locale={lang} dictionary={dictionary} initialCorridor={initialCorridor} initialCorridorId={corridor?.id} />
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow={home.features.eyebrow} title={home.features.title} text={home.features.description} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{home.features.items.map((feature) => <article key={feature.id} className="feature-card rounded-2xl border border-slate-200/80 bg-white p-7"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={feature.id}/></span><h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3><p className="mt-2 leading-7 text-slate-600">{feature.description}</p></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow={home.howItWorks.eyebrow} title={home.howItWorks.title} text={home.howItWorks.description} />
          <div className="relative mt-16 grid gap-10 md:grid-cols-3"><div className="absolute left-[16.7%] right-[16.7%] top-7 hidden border-t border-dashed border-blue-200 md:block" />
            {home.howItWorks.steps.map((step) => <article key={step.id} className="relative text-center"><span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">{step.number}</span><h3 className="mt-6 text-xl font-bold">{step.title}</h3><p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">{step.description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#071a35] py-24 text-white sm:py-28"><div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div><p className="eyebrow text-emerald-300">{home.about.eyebrow}</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{home.about.titleStart}<br/>{home.about.titleEnd}</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{home.about.description}</p><a href="#faq" className="mt-8 inline-flex items-center gap-2 font-bold text-emerald-300 hover:text-emerald-200">{home.about.learnMore} <ButtonArrow /></a></div>
        <div className="grid gap-4 sm:grid-cols-2">{home.about.items.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><span className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><SecurityIcon name={item.id}/></span><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></article>)}</div>
      </div></section>

      <section className="py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow={home.roadmap.eyebrow} title={home.roadmap.title} text={home.roadmap.description} />
        <ol className="mt-16 grid gap-5 md:grid-cols-4">{home.roadmap.items.map((item,i) => <li key={item.id} className={`relative rounded-2xl border p-6 ${i===0 ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between"><span className={`text-sm font-bold ${i===0 ? "text-blue-600" : "text-slate-400"}`}>{item.number}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${i===0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.status}</span></div><h3 className="mt-8 font-bold leading-6">{item.title}</h3><p className="mt-2 text-sm text-slate-500">{item.timing}</p></li>)}</ol>
      </div></section>

      <section id="faq" className="bg-slate-50 py-24 sm:py-32"><div className="mx-auto max-w-3xl px-5 sm:px-8"><SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} text={home.faq.description} />
        <div className="mt-12 space-y-3">{home.faq.items.map((item,i) => <details key={item.id} className="faq-item group rounded-2xl border border-slate-200 bg-white p-5" open={i===0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">{item.question}<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-blue-600 transition group-open:rotate-45"><svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="2"><path d="M10 4v12M4 10h12"/></svg></span></summary><p className="pr-10 pt-4 leading-7 text-slate-600">{item.answer}</p></details>)}</div>
      </div></section>

      <section id="waitlist" className="bg-white px-5 py-20 sm:px-8 sm:py-24"><div className="cta-glow relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12 sm:py-16"><div className="relative"><p className="text-sm font-bold tracking-[0.16em] text-blue-100">{dictionary.waitlist.eyebrow}</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{dictionary.waitlist.title}</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-blue-100">{dictionary.waitlist.intro}</p><Link href={`/${lang}/waitlist`} className="mx-auto mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#06152e] px-7 py-3.5 font-bold text-white shadow-xl transition hover:bg-slate-900">{dictionary.navigation.joinWaitlist} <ButtonArrow /></Link><div className="mx-auto mt-6 max-w-2xl border-t border-white/15 pt-5 text-sm leading-6 text-blue-100"><p>{dictionary.waitlist.noPayment}</p></div></div></div></section>

      <footer className="bg-[#06152e] text-slate-300"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="flex flex-col justify-between gap-10 md:flex-row"><div><a href="#home" className="flex items-center gap-2.5 text-lg font-bold text-white"><LogoMark light/>TransferHub</a><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{home.footer.taglineStart}<br/>{home.footer.taglineEnd}</p></div><nav className="flex flex-wrap gap-x-7 gap-y-4 text-sm" aria-label={home.footer.navigationLabel}>{[
        { id: "privacy", label: home.footer.privacy, href: "#waitlist" }, { id: "terms", label: home.footer.terms, href: "#waitlist" }, { id: "security", label: home.footer.security, href: "#about" }, { id: "contact", label: home.footer.contact, href: "#waitlist" }, { id: "about", label: home.footer.about, href: "#about" },
      ].map((item) => <a key={item.id} href={item.href} className="hover:text-white">{item.label}</a>)}</nav></div><div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row"><p>{home.footer.rights}</p><p>{home.footer.disclosure}</p></div></div></footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="eyebrow text-blue-600">{eyebrow}</p><h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2><p className="mt-4 text-lg leading-8 text-slate-600">{text}</p></div>;
}

function SecurityIcon({ name }: { name: string }) {
  const path: Record<string, React.ReactNode> = { shield:<path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"/>, eye:<><path d="M3 12s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5Z"/><circle cx="12" cy="12" r="2"/></>, lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, check:<><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></> };
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path[name]}</svg>;
}
