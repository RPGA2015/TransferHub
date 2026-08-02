import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TransferComparison from "@/components/TransferComparison";
import { getCorridorById } from "@/lib/services/comparisonEngine";

const features = [
  { icon: "fee", title: "Compare fees", text: "See illustrative transfer fees side by side before choosing an option." },
  { icon: "rate", title: "Check exchange rates", text: "Understand how the rate can affect what your recipient may receive." },
  { icon: "speed", title: "Review delivery speed", text: "Compare estimated delivery windows, from minutes to multiple days." },
  { icon: "wallet", title: "Explore payout methods", text: "Review potential bank, cash pickup, and mobile wallet delivery options." },
  { icon: "people", title: "Save recipients", text: "Keep recipient details organized for a smoother experience next time." },
  { icon: "track", title: "Track transfers", text: "Follow transfer progress in one clear, easy-to-understand view." },
];

const faqs = [
  ["What is TransferHub?", "TransferHub is a comparison platform in development, designed to help people review money-transfer options in one place, initially focusing on transfers to Haiti."],
  ["Can I send money through TransferHub today?", "No. Version 0.1.0 is an interactive comparison prototype and development-only waitlist. Sending or initiating transfers would require authorized provider connections and additional safeguards."],
  ["Does TransferHub partner with the providers shown?", "No partnership or integration is being claimed. Provider names may describe the market TransferHub intends to compare, while all preview data on this website is illustrative until authorized data connections exist."],
  ["How will comparisons work?", "The planned platform will organize available fees, exchange rates, payout methods, and delivery estimates so users can review relevant options side by side."],
  ["Will TransferHub support countries beyond Haiti?", "Haiti is the initial focus. Additional transfer corridors may be considered as the platform grows and reliable data becomes available."],
  ["How can I get early access?", "Join the waitlist to receive occasional product updates and learn when early access becomes available."],
];

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

type HomeProps = { searchParams: Promise<{ corridor?: string | string[] }> };

export default async function Home({ searchParams }: HomeProps) {
  const corridorParam = (await searchParams).corridor;
  const corridor = typeof corridorParam === "string" ? getCorridorById(corridorParam) : undefined;
  const initialCorridor = corridor ? { fromCountry: corridor.fromCountry, toCountry: corridor.toCountry } : undefined;
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <SiteHeader />

      <section id="home" className="hero-grid relative bg-[#06152e] pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-48">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />BUILT FOR GLOBAL FAMILIES</div>
            <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">One App.<br/><span className="text-gradient">Every Transfer.</span></h1>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-8 text-slate-300 lg:mx-0">Explore how money-transfer options could be compared across fees, exchange rates, payout methods, and delivery estimates. All current results are fictional and illustrative.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><Link href="/waitlist" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500">Join the Waitlist <ButtonArrow /></Link><Link href="/marketplace" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">Explore corridors</Link></div>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400 lg:justify-start"><svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-400" fill="currentColor" aria-hidden="true"><path d="M10 2 4 4.5V9c0 4.1 2.5 7.3 6 9 3.5-1.7 6-4.9 6-9V4.5L10 2Zm3 6-3.5 4L7 9.7l1.1-1.1 1.3 1.2 2.5-2.9L13 8Z"/></svg>No transfer required. Be first to know when we launch.</p>
          </div>
          <TransferComparison initialCorridor={initialCorridor} initialCorridorId={corridor?.id} />
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="EVERYTHING IN ONE PLACE" title="Clarity before you send" text="TransferHub is being built to make comparing transfer options simpler, faster, and easier to understand." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map((feature) => <article key={feature.title} className="feature-card rounded-2xl border border-slate-200/80 bg-white p-7"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={feature.icon}/></span><h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3><p className="mt-2 leading-7 text-slate-600">{feature.text}</p></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow="SIMPLE BY DESIGN" title="How TransferHub will work" text="A clearer path from deciding to delivering—without jumping between tabs." />
          <div className="relative mt-16 grid gap-10 md:grid-cols-3"><div className="absolute left-[16.7%] right-[16.7%] top-7 hidden border-t border-dashed border-blue-200 md:block" />
            {[["01", "Enter your transfer", "Choose where you’re sending from, your destination, and the amount."], ["02", "Compare your options", "Review illustrative provider details across the factors that matter to you."], ["03", "Choose with confidence", "Select your preferred option when authorized provider connections become available."]].map(([n,t,d]) => <article key={n} className="relative text-center"><span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">{n}</span><h3 className="mt-6 text-xl font-bold">{t}</h3><p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">{d}</p></article>)}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#071a35] py-24 text-white sm:py-28"><div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div><p className="eyebrow text-emerald-300">THOUGHTFUL FROM THE START</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Designed for security.<br/>Built for transparency.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">TransferHub is being designed with security, privacy, and transparent data labeling in mind. We&apos;ll clearly distinguish illustrative information from verified provider data as the platform evolves.</p><a href="#faq" className="mt-8 inline-flex items-center gap-2 font-bold text-emerald-300 hover:text-emerald-200">Learn more about our approach <ButtonArrow /></a></div>
        <div className="grid gap-4 sm:grid-cols-2">{[["shield", "Security-minded design", "Safeguards will be considered throughout product development."], ["eye", "Clear data labels", "Preview, illustrative, and authorized data will be clearly identified."], ["lock", "Privacy in mind", "We aim to collect only what is needed for the experience."], ["check", "No hidden endorsements", "Provider listings will not imply partnerships that do not exist."]].map(([icon,title,text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><span className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><SecurityIcon name={icon}/></span><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div>
      </div></section>

      <section className="py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow="WHAT WE’RE BUILDING" title="The road ahead" text="A deliberate path toward a clearer transfer comparison experience." />
        <ol className="mt-16 grid gap-5 md:grid-cols-4">{[["01", "Website & Waitlist", "Now", "Live"], ["02", "Comparison Platform", "Next", "In design"], ["03", "Authorized Provider Integrations", "Later", "Planned"], ["04", "Mobile Apps", "Future", "Planned"]].map(([n,title,time,status],i) => <li key={title} className={`relative rounded-2xl border p-6 ${i===0 ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between"><span className={`text-sm font-bold ${i===0 ? "text-blue-600" : "text-slate-400"}`}>{n}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${i===0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{status}</span></div><h3 className="mt-8 font-bold leading-6">{title}</h3><p className="mt-2 text-sm text-slate-500">{time}</p></li>)}</ol>
      </div></section>

      <section id="faq" className="bg-slate-50 py-24 sm:py-32"><div className="mx-auto max-w-3xl px-5 sm:px-8"><SectionHeading eyebrow="QUESTIONS, ANSWERED" title="Frequently asked questions" text="What to know as TransferHub takes shape." />
        <div className="mt-12 space-y-3">{faqs.map(([q,a],i) => <details key={q} className="faq-item group rounded-2xl border border-slate-200 bg-white p-5" open={i===0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">{q}<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-blue-600 transition group-open:rotate-45"><svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="2"><path d="M10 4v12M4 10h12"/></svg></span></summary><p className="pr-10 pt-4 leading-7 text-slate-600">{a}</p></details>)}</div>
      </div></section>

      <section id="waitlist" className="bg-white px-5 py-20 sm:px-8 sm:py-24"><div className="cta-glow relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12 sm:py-16"><div className="relative"><p className="text-sm font-bold tracking-[0.16em] text-blue-100">BE FIRST IN LINE</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">A clearer way to compare transfers is coming.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-blue-100">Join the TransferHub waitlist for product updates and early-access news.</p><Link href="/waitlist" className="mx-auto mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#06152e] px-7 py-3.5 font-bold text-white shadow-xl transition hover:bg-slate-900">Join the Waitlist <ButtonArrow /></Link><div className="mx-auto mt-6 max-w-2xl border-t border-white/15 pt-5 text-sm leading-6 text-blue-100"><p>No payment information is required. TransferHub will not ask for money to join the waitlist.</p><p>The waitlist is for product updates only.</p></div></div></div></section>

      <footer className="bg-[#06152e] text-slate-300"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="flex flex-col justify-between gap-10 md:flex-row"><div><a href="#home" className="flex items-center gap-2.5 text-lg font-bold text-white"><LogoMark light/>TransferHub</a><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">One App. Every Transfer.<br/>Transfer comparison, made clearer.</p></div><nav className="flex flex-wrap gap-x-7 gap-y-4 text-sm" aria-label="Footer navigation">{["Privacy", "Terms", "Security", "Contact", "About"].map(x=><a key={x} href={x === "About" ? "#about" : "#waitlist"} className="hover:text-white">{x}</a>)}</nav></div><div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row"><p>© 2026 TransferHub.info. All rights reserved.</p><p>Provider information shown is illustrative and does not imply partnership or endorsement.</p></div></div></footer>
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
