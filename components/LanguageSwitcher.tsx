"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ locale, label, dark = false }: { locale: Locale; label: string; dark?: boolean }) {
  const pathname = usePathname();
  const suffix = pathname.replace(/^\/(en|ht|fr|es)(?=\/|$)/, "") || "";

  return (
    <div className="flex flex-wrap items-center gap-1" aria-label={label}>
      {locales.map((nextLocale) => {
        const href = `/${nextLocale}${suffix}`;
        const active = nextLocale === locale;
        return <Link key={nextLocale} href={href} hrefLang={nextLocale} lang={nextLocale} aria-current={active ? "page" : undefined} onClick={(event) => {
          if (typeof window === "undefined") return;
          event.preventDefault();
          window.location.assign(`${href}${window.location.search}${window.location.hash}`);
        }} className={`min-h-10 rounded-lg px-2.5 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${active ? "bg-blue-600 text-white" : dark ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-100"}`}>
          {localeNames[nextLocale]}
          {active && <span className="sr-only"> ({label})</span>}
        </Link>;
      })}
    </div>
  );
}
