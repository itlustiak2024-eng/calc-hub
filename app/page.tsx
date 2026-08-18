import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          ОБЕРИ СВІЙ КАЛЬКУЛЯТОР
        </h1>
        <p className="text-lg text-slate-300">
          Зручні онлайн-інструменти для розрахунку податків ФОП, маржі, криптовалют та комісій Stripe.
        </p>
        <div className="pt-4">
          <Link
            href="/calculators"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl transition-all shadow-lg hover:scale-105"
          >
            Старт
          </Link>
        </div>
      </div>
    </main>
  );
}