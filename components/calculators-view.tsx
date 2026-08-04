'use client';

import React, { useState } from 'react';
import StripeCalculator from './calculators/stripe-calculator';
import CryptoCalculator from './calculators/crypto-calculator';
import InfoSidebar from './ui/info-sidebar';

export default function CalculatorsView() {
  const [isOpen, setIsOpen] = useState(false); // За замовчуванням меню закрите, контент по центру

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Фінансові калькулятори
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Швидко розраховуйте комісії платіжних систем, формуйте чеки для клієнтів та дізнавайтеся чистий профіт при виводі крипти.
        </p>
      </div>

      {isOpen ? (
        /* Відкритий стан: сітка з сайдбаром зліва та зміщеними калькуляторами праворуч */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-300">
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <InfoSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <h2 className="text-xl font-bold text-slate-800">Еквайринг (Платіжні системи)</h2>
              </div>
              <StripeCalculator />
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <h2 className="text-xl font-bold text-slate-800">Крипто-Вивід (USDT)</h2>
              </div>
              <CryptoCalculator />
            </section>
          </div>
        </div>
      ) : (
        /* Закритий стан: кнопка меню зліва, калькулятори строго по центру */
        <div className="space-y-6 transition-all duration-300">
          <div className="max-w-3xl mx-auto">
            <InfoSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <h2 className="text-xl font-bold text-slate-800">Еквайринг (Платіжні системи)</h2>
              </div>
              <StripeCalculator />
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <h2 className="text-xl font-bold text-slate-800">Крипто-Вивід (USDT)</h2>
              </div>
              <CryptoCalculator />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}