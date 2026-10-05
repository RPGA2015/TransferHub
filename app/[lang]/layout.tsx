import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import "../globals.css";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getApplicationDataSourceMetadata,
  initializeApplicationDataSource,
} from "@/lib/services/productionDataService";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export function generateStaticParams() { return locales.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dictionary = getDictionary(lang);
  return { title: dictionary.metadata.homeTitle, description: dictionary.metadata.homeDescription };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  initializeApplicationDataSource();
  const dataSourceMetadata = getApplicationDataSourceMetadata();
  return (
    <html
      lang={lang}
      data-data-source-mode={dataSourceMetadata.mode}
      data-data-source-semantics={dataSourceMetadata.semantics}
     data-data-source-live={dataSourceMetadata.isLive}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
