'use client';

import { useState, useEffect } from 'react';

// === БАЗА ДАНИХ ДЛЯ КАЛЬКУЛЯТОРІВ ===
const countriesList = [
  { id: 'Ukraine', uk: 'Україна', en: 'Ukraine' },
  { id: 'Poland', uk: 'Польща', en: 'Poland' },
  { id: 'USA', uk: 'США', en: 'USA' },
  { id: 'UK', uk: 'Велика Британія', en: 'United Kingdom' },
  { id: 'EU', uk: 'ЄС', en: 'EU' },
];

const paymentSystemsMap: Record<string, { name: string; feePercent: number; feeFixed: number }[]> = {
  'Ukraine': [
    { name: 'WayForPay', feePercent: 2.2, feeFixed: 0 },
    { name: 'LiqPay', feePercent: 1.5, feeFixed: 0 },
    { name: 'Fondy', feePercent: 2.0, feeFixed: 0 },
  ],
  'Poland': [
    { name: 'Przelewy24', feePercent: 1.9, feeFixed: 0 },
    { name: 'PayU', feePercent: 2.3, feeFixed: 0.3 },
    { name: 'Stripe', feePercent: 1.5, feeFixed: 1.0 },
  ],
  'USA': [
    { name: 'Stripe', feePercent: 2.9, feeFixed: 0.3 },
    { name: 'PayPal', feePercent: 3.49, feeFixed: 0.49 },
  ],
  'UK': [
    { name: 'Stripe', feePercent: 1.4, feeFixed: 0.2 },
    { name: 'PayPal', feePercent: 2.9, feeFixed: 0.3 },
  ],
  'EU': [
    { name: 'Stripe', feePercent: 1.5, feeFixed: 0.25 },
    { name: 'Adyen', feePercent: 1.2, feeFixed: 0.1 },
  ],
};

const currencies = ['UAH', 'USD', 'EUR', 'PLN', 'GBP'];
const cryptoCoins = ['USDT', 'USDC', 'BTC', 'ETH'];

const cryptoNetworksMap: Record<string, { name: string; feePercent: number; feeFixed: number }[]> = {
  'USDT': [
    { name: 'TRC20 (Tron)', feePercent: 0, feeFixed: 1.0 },
    { name: 'ERC20 (Ethereum)', feePercent: 0, feeFixed: 5.0 },
    { name: 'BEP20 (BNB Chain)', feePercent: 0, feeFixed: 0.3 },
    { name: 'Polygon', feePercent: 0, feeFixed: 0.1 },
  ],
  'USDC': [
    { name: 'ERC20 (Ethereum)', feePercent: 0, feeFixed: 5.0 },
    { name: 'Solana', feePercent: 0, feeFixed: 0.1 },
    { name: 'Polygon', feePercent: 0, feeFixed: 0.1 },
  ],
  'BTC': [
    { name: 'Bitcoin Network', feePercent: 0.1, feeFixed: 2.0 },
    { name: 'Lightning', feePercent: 0.01, feeFixed: 0 },
  ],
  'ETH': [
    { name: 'ERC20 (Ethereum)', feePercent: 0, feeFixed: 3.0 },
    { name: 'Arbitrum One', feePercent: 0, feeFixed: 0.5 },
  ],
};

// === СЛОВНИК ПЕРЕКЛАДІВ ===
const translations = {
  uk: {
    title: "Калькулятори та розрахунки",
    subtitle: "Професійні інструменти для швидкого бізнес-аналізу",
    menu: "Меню",
    home: "Головна сторінка",
    about: "Для чого ці калькулятори",
    privacy: "Політика конфіденційності",
    help: "Допомога",
    acquiring: "💳 Еквайринг",
    crypto: "🪙 Криптовивід",
    margin: "📈 Маржинальність",
    close: "Закрити ✕",
    country: "Країна реєстрації",
    paymentSystem: "Платіжна система",
    checkAmount: "Сума чеку",
    currency: "Валюта",
    serviceFee: "Комісія сервісу",
    toPayout: "До зарахування:",
    cryptoCoin: "Криптовалюта",
    network: "Мережа (Network)",
    withdrawAmount: "Сума виводу",
    networkFee: "Комісія мережі",
    wallet: "На гаманець:",
    costPrice: "Закупівельна ціна (собівартість)",
    sellingPrice: "Ціна продажу клієнту",
    marginCurrency: "Валюта розрахунку",
    netProfit: "Чистий прибуток з одиниці:",
    markup: "Націнка (Markup):",
    marginText: "Маржа (Margin):",
    chooseCalc: "Оберіть свій калькулятор вище",
    chooseCalcSub: "Для початку розрахунків натисніть на відповідну вкладку",
    usefulTitle: "Для чого ці калькулятори",
    usefulDesc: "Цей розділ створений для швидких та зручних розрахунків. Інструменти допомагають точно обчислювати підсумкові значення з урахуванням різних комісій, конвертацій та параметрів для різних завдань.",
    understood: "Зрозуміло",
    privacyTitle: "Політика конфіденційності",
    privacyText1: "Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо інформацію під час використання нашого сайту та калькуляторів.",
    privacyText2: "1. Збір даних: Ми не вимагаємо та не зберігаємо ваші персональні дані (імена, номери телефонів, пошту), окрім випадків, коли ви самостійно звертаєтесь до нас через контакти чи месенджери.",
    privacyText3: "2. Розрахунки: Усі обчислення (еквайринг, комісії крипти, маржинальність) виконуються динамічно у вашому браузері. Введені вами суми не передаються на зовнішні бази даних.",
    privacyText4: "3. Зовнішні сервіси: Сайт може використовувати відкриті дані національних банків (наприклад, НБУ) для отримання актуальних курсів валют, а також посилання на сторонні платформи (Telegram).",
    privacyText5: "4. Зміни: Ми залишаємо за собою право оновлювати цю політику в разі появи нових інструментів чи функціоналу.",
    helpTitle: "Допомога та підтримка",
    helpDesc: "Якщо у вас виникли запитання щодо роботи калькуляторів або ви хочете запропонувати новий функціонал чи покращення, ви можете зв'язатися напряму через Telegram.",
    writeTelegram: "Написати в Telegram",
  },
  en: {
    title: "Calculators & Analytics",
    subtitle: "Professional tools for quick business analysis",
    menu: "Menu",
    home: "Home page",
    about: "Purpose of calculators",
    privacy: "Privacy Policy",
    help: "Help",
    acquiring: "💳 Acquiring",
    crypto: "🪙 Crypto Payout",
    margin: "📈 Margin",
    close: "Close ✕",
    country: "Registration country",
    paymentSystem: "Payment system",
    checkAmount: "Check amount",
    currency: "Currency",
    serviceFee: "Service fee",
    toPayout: "To payout:",
    cryptoCoin: "Cryptocurrency",
    network: "Network",
    withdrawAmount: "Withdrawal amount",
    networkFee: "Network fee",
    wallet: "To wallet:",
    costPrice: "Cost price",
    sellingPrice: "Selling price",
    marginCurrency: "Calculation currency",
    netProfit: "Net profit per unit:",
    markup: "Markup:",
    marginText: "Margin:",
    chooseCalc: "Choose your calculator above",
    chooseCalcSub: "Click on the corresponding tab to start calculations",
    usefulTitle: "Purpose of these calculators",
    usefulDesc: "This section is designed for quick and convenient calculations. The tools help accurately calculate final values taking into account various fees, conversions, and parameters for different tasks.",
    understood: "Understood",
    privacyTitle: "Privacy Policy",
    privacyText1: "This Privacy Policy explains how we collect, use, and protect information when using our website and calculators.",
    privacyText2: "1. Data collection: We do not require or store your personal data (names, phone numbers, email) except when you independently contact us via contacts or messengers.",
    privacyText3: "2. Calculations: All calculations (acquiring, crypto fees, margins) are performed dynamically in your browser. The amounts you enter are not sent to external databases.",
    privacyText4: "3. External services: The site may use open data from national banks (e.g., NBU) to obtain current exchange rates, as well as links to third-party platforms (Telegram).",
    privacyText5: "4. Changes: We reserve the right to update this policy in case of new tools or functionality.",
    helpTitle: "Help & Support",
    helpDesc: "If you have questions about the calculators or want to suggest new features or improvements, you can contact us directly via Telegram.",
    writeTelegram: "Write on Telegram",
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'acquiring' | 'crypto' | 'margin' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'useful' | 'help' | 'privacy' | null>(null);
  const [lang, setLang] = useState<'uk' | 'en'>('uk');

  const t = translations[lang];

  // --- КУРСИ ВАЛЮТ ---
  const [rates, setRates] = useState<Record<string, number>>({ UAH: 1, USD: 41.0, EUR: 45.0, PLN: 10.3, GBP: 53.0 });

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(res => res.json())
      .then(data => {
        const fetchedRates: Record<string, number> = { UAH: 1 };
        data.forEach((item: any) => {
          if (currencies.includes(item.cc)) {
            fetchedRates[item.cc] = item.rate;
          }
        });
        setRates(prev => ({ ...prev, ...fetchedRates }));
      })
      .catch(err => console.error('Помилка курсів:', err));
  }, []);

  // --- ЕКВАЙРИНГ ---
  const [amount, setAmount] = useState<number>(1000);
  const [country, setCountry] = useState<string>('Ukraine');
  const [system, setSystem] = useState(paymentSystemsMap['Ukraine'][0]);
  const [currency, setCurrency] = useState<string>('UAH');

  useEffect(() => {
    const availableSystems = paymentSystemsMap[country];
    if (availableSystems) setSystem(availableSystems[0]);
  }, [country]);

  const acquiringFee = (amount * system.feePercent) / 100 + system.feeFixed;
  const acquiringNet = amount - acquiringFee;
  const acquiringNetUAH = acquiringNet * (rates[currency] || 1);

  // --- КРИПТОВИВІД ---
  const [cryptoAmount, setCryptoAmount] = useState<number>(500);
  const [coin, setCoin] = useState<string>('USDT');
  const [network, setNetwork] = useState(cryptoNetworksMap['USDT'][0]);

  useEffect(() => {
    const availableNetworks = cryptoNetworksMap[coin];
    if (availableNetworks) setNetwork(availableNetworks[0]);
  }, [coin]);

  const cryptoFeeTotal = (cryptoAmount * network.feePercent) / 100 + network.feeFixed;
  const cryptoNet = cryptoAmount - cryptoFeeTotal;

  // --- МАРЖИНАЛЬНІСТЬ ТА ПРИБУТОК ---
  const [costPrice, setCostPrice] = useState<number>(300);
  const [sellingPrice, setSellingPrice] = useState<number>(600);
  const [marginCurrency, setMarginCurrency] = useState<string>('UAH');

  const profit = sellingPrice - costPrice;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const markup = costPrice > 0 ? (profit / costPrice) * 100 : 0;

  const toggleTab = (tab: 'acquiring' | 'crypto' | 'margin') => {
    setActiveTab(prev => (prev === tab ? null : tab));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/40 text-slate-900 p-6 relative font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ДЕКОРАТИВНІ ФОНОВІ ЕЛЕМЕНТИ */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* МЕНЮ ЗЛІВА ЗВЕРХУ */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md font-medium hover:bg-white transition-all duration-300 flex items-center gap-2 text-slate-700 active:scale-95"
        >
          <span className="text-lg">☰</span>
          <span>{t.menu}</span>
        </button>

        {isMenuOpen && (
          <div className="mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <button 
              onClick={() => { setActiveTab(null); setActiveModal(null); setIsMenuOpen(false); }}
              className="px-4 py-3 text-left hover:bg-indigo-50/60 border-b border-slate-100 font-medium text-slate-800 transition-colors"
            >
              {t.home}
            </button>
            <button 
              onClick={() => { setActiveModal('useful'); setIsMenuOpen(false); }}
              className="px-4 py-3 text-left hover:bg-indigo-50/60 border-b border-slate-100 text-slate-600 transition-colors"
            >
              {t.about}
            </button>
            <button 
              onClick={() => { setActiveModal('privacy'); setIsMenuOpen(false); }}
              className="px-4 py-3 text-left hover:bg-indigo-50/60 border-b border-slate-100 text-slate-600 transition-colors"
            >
              {t.privacy}
            </button>
            <button 
              onClick={() => { setActiveModal('help'); setIsMenuOpen(false); }}
              className="px-4 py-3 text-left hover:bg-indigo-50/60 text-slate-600 transition-colors"
            >
              {t.help}
            </button>
          </div>
        )}
      </div>

      {/* КНОПКА ЗМІНИ МОВИ ЗПРАВА ЗВЕРХУ */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setLang(prev => (prev === 'uk' ? 'en' : 'uk'))}
          className="bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md font-medium hover:bg-white transition-all duration-300 flex items-center gap-2 text-slate-700 active:scale-95"
        >
          <span>🌐</span>
          <span>{lang === 'uk' ? '🇺🇸 ENG' : '🇺🇦 УКР'}</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto pt-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-center text-slate-500 text-sm mb-10">{t.subtitle}</p>

        {/* КНОПКИ ПЕРЕМИКАННЯ */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          <button
            onClick={() => toggleTab('acquiring')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'acquiring'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.acquiring}
          </button>
          
          <button
            onClick={() => toggleTab('crypto')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'crypto'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.crypto}
          </button>

          <button
            onClick={() => toggleTab('margin')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'margin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.margin}
          </button>
        </div>

        {/* ================= КАЛЬКУЛЯТОР ЕКВАЙРИНГУ ================= */}
        {activeTab === 'acquiring' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                {t.acquiring.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.country}</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {countriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.paymentSystem}</label>
                <select
                  value={system.name}
                  onChange={(e) => {
                    const selected = paymentSystemsMap[country].find((s) => s.name === e.target.value);
                    if (selected) setSystem(selected);
                  }}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {paymentSystemsMap[country]?.map((sys) => (
                    <option key={sys.name} value={sys.name}>
                      {sys.name} ({sys.feePercent}% {sys.feeFixed > 0 ? `+ ${sys.feeFixed}` : ''})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.checkAmount}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 font-medium p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.currency}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} {curr !== 'UAH' ? `(≈ ${rates[curr]?.toFixed(2)} ₴)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mt-6">
              <div className="flex justify-between items-center mb-3 text-slate-300 text-sm">
                <span>{t.serviceFee} ({system.name}):</span>
                <span className="font-semibold text-rose-400">
                  - {acquiringFee.toFixed(2)} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold pt-3 border-t border-slate-800">
                <span>{t.toPayout}</span>
                <span className="text-emerald-400">
                  ≈ {acquiringNetUAH > 0 ? acquiringNetUAH.toFixed(2) : '0.00'} ₴
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= КАЛЬКУЛЯТОР КРИПТОВИВОДУ ================= */}
        {activeTab === 'crypto' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                {t.crypto.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.cryptoCoin}</label>
                <select
                  value={coin}
                  onChange={(e) => setCoin(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {cryptoCoins.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.network}</label>
                <select
                  value={network.name}
                  onChange={(e) => {
                    const selected = cryptoNetworksMap[coin].find((n) => n.name === e.target.value);
                    if (selected) setNetwork(selected);
                  }}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {cryptoNetworksMap[coin]?.map((net) => (
                    <option key={net.name} value={net.name}>
                      {net.name} ({lang === 'uk' ? 'Комісія' : 'Fee'}: {net.feeFixed > 0 ? `${net.feeFixed} ${coin}` : `${net.feePercent}%`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.withdrawAmount} ({coin})</label>
              <input
                type="number"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(Number(e.target.value))}
                className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 font-medium p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mt-6">
              <div className="flex justify-between items-center mb-3 text-slate-300 text-sm">
                <span>{t.networkFee} ({network.name}):</span>
                <span className="font-semibold text-rose-400">
                  - {cryptoFeeTotal.toFixed(2)} {coin}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold pt-3 border-t border-slate-800">
                <span>{t.wallet}</span>
                <span className="text-emerald-400">
                  {cryptoNet > 0 ? cryptoNet.toFixed(2) : '0.00'} {coin}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= КАЛЬКУЛЯТОР МАРЖИНАЛЬНОСТІ ================= */}
        {activeTab === 'margin' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                {t.margin.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.costPrice}</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 font-medium p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.sellingPrice}</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 font-medium p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.marginCurrency}</label>
              <select
                value={marginCurrency}
                onChange={(e) => setMarginCurrency(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} {curr !== 'UAH' ? `(≈ ${rates[curr]?.toFixed(2)} ₴)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mt-6 space-y-3">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.netProfit}</span>
                <span className="font-semibold text-emerald-400 text-base">
                  + {profit.toFixed(2)} {marginCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.markup}</span>
                <span className="font-semibold text-white">
                  {markup.toFixed(1)} %
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold border-t border-slate-800 pt-3">
                <span>{t.marginText}</span>
                <span className="text-indigo-400">
                  {margin.toFixed(1)} %
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* ГОЛОВНИЙ ТЕКСТ ПОСЕРЕДИНІ */}
        {activeTab === null && (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200/80 transition-all">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 shadow-inner">
              ⚡
            </div>
            <h2 className="text-xl font-semibold text-slate-700">{t.chooseCalc}</h2>
            <p className="text-slate-400 text-sm mt-1">{t.chooseCalcSub}</p>
          </div>
        )}
      </div>

      {/* МОДАЛЬНЕ ВІКНО: ДЛЯ ЧОГО ЦІ КАЛЬКУЛЯТОРИ */}
      {activeModal === 'useful' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{t.usefulTitle}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t.usefulDesc}
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25 active:scale-95"
            >
              {t.understood}
            </button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО: ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{t.privacyTitle}</h3>
            <div className="text-slate-600 text-sm leading-relaxed mb-6 space-y-3">
              <p>{t.privacyText1}</p>
              <p>{t.privacyText2}</p>
              <p>{t.privacyText3}</p>
              <p>{t.privacyText4}</p>
              <p>{t.privacyText5}</p>
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25 active:scale-95"
            >
              {t.close.replace(' ✕', '')}
            </button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО: ДОПОМОГА */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{t.helpTitle}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t.helpDesc}
            </p>
            <div className="flex gap-3">
              <a 
                href="https://t.me/student020239" 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center"
              >
                {t.writeTelegram}
              </a>
              <button 
                onClick={() => setActiveModal(null)}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-sm font-medium transition-colors active:scale-95"
              >
                {t.close.replace(' ✕', '')}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}