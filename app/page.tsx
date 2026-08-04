import type { Metadata } from 'next';
import CalculatorsView from '../components/calculators-view';

export const metadata: Metadata = {
  title: 'FinCalc | Калькулятори платіжних систем та крипто',
  description: 'Швидкий та зручний розрахунок комісій платіжних систем та виводу USDT з урахуванням мережевих комісій.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <CalculatorsView />

      <footer className="text-center pt-8 text-sm text-slate-400 border-t border-slate-200 mt-12">
        <p>Всі розрахунки виконуються миттєво у вашому браузері. Дані нікуди не передаються.</p>
      </footer>
    </main>
  );
}