import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalcHub — Онлайн-калькулятори для бізнесу, ФОП та крипти",
  description: "Зручні безкоштовні інструменти: розрахунок податків ФОП, калькулятор маржі, конвертер криптовалют та розрахунок комісій Stripe.",
  keywords: [
    "калькулятор фоп", 
    "податки фоп 2026", 
    "розрахунок податків онлайн", 
    "калькулятор для бізнесу україна",
    "калькулятор маржі",
    "розрахунок маржинальності",
    "криптоконвертер",
    "конвертер криптовалют",
    "калькулятор комісій stripe",
    "stripe калькулятор"
  ],
  other: {
    "google-adsense-account": "ca-pub-9151853318987476",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        {/* Прямий метатег для AdSense (гарантоване розпізнавання роботами Google) */}
        <meta name="google-adsense-account" content="ca-pub-9151853318987476" />
      </head>
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-0K9TG0HR3K"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0K9TG0HR3K');
          `}
        </Script>

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9151853318987476"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {children}
      </body>
    </html>
  );
}