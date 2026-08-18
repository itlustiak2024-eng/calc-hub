'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white px-4">
      {/* Декоративне світіння */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl space-y-8">
        <span className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 backdrop-blur-md">
          CalcHub Platform
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-tight">
          Обери свій <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            калькулятор
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-md font-medium">
          Швидкі інструменти для ФОП, бізнесу, крипти та Stripe
        </p>

        <div className="pt-2">
          <Link
            href="/calculators"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 font-bold text-lg text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95"
          >
            <span>Старт</span>
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