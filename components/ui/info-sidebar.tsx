'use client';

import React, { useState } from 'react';

interface InfoSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function InfoSidebar({ isOpen, setIsOpen }: InfoSidebarProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-200 text-slate-800 font-medium hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Меню</span>
        </button>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <h3 className="text-lg font-bold text-slate-900">Меню</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold flex items-center justify-center"
              title="Згорнути меню"
            >
              ✕
            </button>
          </div>

          {/* Блок 1: Корисна інформація (згорнутий за замовчуванням) */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
            >
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span>💡</span>
                <span>Корисна інформація</span>
              </span>
              <span className={`text-slate-400 transform transition-transform duration-200 ${isInfoOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isInfoOpen && (
              <div className="p-4 space-y-4 text-sm text-slate-600 bg-white border-t border-slate-100">
                <div>
                  <h5 className="font-semibold text-slate-800 mb-1">Для чого цей калькулятор?</h5>
                  <p className="text-slate-500 leading-relaxed">
                    Інструмент розроблений для швидкого прорахунку реальних витрат на еквайринг та транзакції. Допомагає зрозуміти, скільки грошей реально дійде до гаманця після всіх комісій сервісів та блокчейн-мереж.
                  </p>
                </div>

                <div className="pt-2">
                  <h5 className="font-semibold text-slate-800 mb-1">🚀 Як виводити найвигідніше?</h5>
                  <ul className="space-y-2 text-slate-500">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Обирайте екосистеми з мінімальним газом:</strong> Для крипти використовуйте мережі Solana, Polygon або BEP20 замість дорогих ERC20 чи Bitcoin.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Враховуйте країну виплат:</strong> Комісії Wise та Payoneer часто суттєво нижчі за класичний експорт через посередників.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Реверсний розрахунок:</strong> Завжди додавайте комісію платіжної системи зверху до прайсу клієнта, щоб не втрачати власний чистий прибуток.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Блок 2: Потрібна допомога? (згорнутий за замовчуванням) */}
          <div className="border border-blue-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors text-left"
            >
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span>💬</span>
                <span>Потрібна допомога?</span>
              </span>
              <span className={`text-slate-400 transform transition-transform duration-200 ${isHelpOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isHelpOpen && (
              <div className="p-4 space-y-3 bg-white border-t border-blue-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Не знаєте, як вигідніше вивести кошти звідти чи звідти, або потрібна індивідуальна консультація? Звертайтеся напряму!
                </p>
                <a
                  href="https://t.me/your_telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors w-full justify-center shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.88.03-.25.38-.51 1.06-.78 4.15-1.81 6.91-3.01 8.28-3.6 3.94-1.67 4.75-1.96 5.28-1.97.12 0 .39.03.56.17.15.12.19.28.21.4-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>Написати в Telegram</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}