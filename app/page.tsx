'use client';

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ua'>('en');

  const content = {
    en: {
      badge: "CalcHub Platform",
      titleStart: "CHOOSE YOUR",
      titleGradient: "CALCULATOR",
      subtitle: "Instant financial tools for freelancers, business, crypto & Stripe fees.",
      button: "Get Started",
      calculatorsPath: "/calculators",
    },
    ua: {
      badge: "CalcHub Платформа",
      titleStart: "ОБЕРИ СВІЙ",
      titleGradient: "КАЛЬКУЛЯТОР",
      subtitle: "Швидкі фінансові інструменти для ФОП, бізнесу, крипти та Stripe.",
      button: "Старт",
      calculatorsPath: "/calculators",
    },
  };

  const t = content[lang];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white px-4">
      {/* Перемикач мов у правому верхньому кутку */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            lang === 'en'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🇺🇸 EN
        </button>
        <button
          onClick={() => setLang('ua')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            lang === 'ua'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🇺🇦 UA
        </button>
      </div>

      {/* Декоративне сяйво */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Контент сторінки */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl space-y-8">
        <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 backdrop-blur-md">
          {t.badge}
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-tight">
          {t.titleStart} <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t.titleGradient}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-md font-medium">
          {t.subtitle}
        </p>

        <div className="pt-2">
          <Link
            href={t.calculatorsPath}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 font-bold text-lg text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95"
          >
            <span>{t.button}</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}