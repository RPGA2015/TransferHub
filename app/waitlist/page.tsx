import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist | TransferHub",
  description: "Join the TransferHub waitlist for occasional product updates and early-access news.",
};

export default function WaitlistPage() {
  return (
    <main className="waitlist-page min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-white/10 bg-[#06152e]">
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Waitlist navigation">
          <Link href="/#home" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-emerald-300" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h13m-4-4 4 4-4 4M19 16H6m4 4-4-4 4-4" /></svg></span>
            TransferHub
          </Link>
          <Link href="/#home" className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">Back to home</Link>
        </nav>
      </header>

      <section className="waitlist-hero relative overflow-hidden bg-[#06152e] pb-32 pt-16 text-white sm:pb-40 sm:pt-24">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="text-xs font-extrabold tracking-[0.18em] text-emerald-300">EARLY ACCESS UPDATES</p>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Be first to know what’s next.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Join the TransferHub waitlist for occasional updates as we build a clearer way to compare money-transfer options, initially focused on transfers to Haiti.</p>
        </div>
      </section>

      <section className="relative mx-auto -mt-20 grid max-w-6xl gap-8 px-5 pb-20 sm:-mt-24 sm:px-8 sm:pb-28 lg:grid-cols-[1fr_.62fr] lg:items-start">
        <WaitlistForm />
        <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/5 sm:p-8" aria-labelledby="privacy-heading">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg></span>
          <h2 id="privacy-heading" className="mt-5 text-xl font-bold">A simple signup—not a transfer.</h2>
          <p className="mt-3 leading-7 text-slate-600">Joining the waitlist does not create a financial account and does not enable you to send, receive, or process transfers.</p>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            {['No payment information is required.', 'TransferHub will never ask for money to join.', 'Your signup is for product updates only.', 'You may unsubscribe from future emails.'].map((item) => <li key={item} className="flex gap-3"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700" aria-hidden="true">✓</span>{item}</li>)}
          </ul>
          <div className="mt-7 border-t border-slate-100 pt-6 text-xs leading-5 text-slate-500">Sprint 1B stores this signup only in this browser for development and testing. Secure server-side storage is required before public launch.</div>
        </aside>
      </section>
    </main>
  );
}
