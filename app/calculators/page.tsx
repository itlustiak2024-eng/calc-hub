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

const currencySymbols: Record<string, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
  PLN: 'zł',
  GBP: '£',
};

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

// Список криптовалют, альткоїнів та мемкоїнів для криптоконвертера
const availableCryptos = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin (BTC)' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum (ETH)' },
  { id: 'solana', symbol: 'SOL', name: 'Solana (SOL)' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP (Ripple)' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB (Binance)' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano (ADA)' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin (DOGE - 🐶 Мемекойн)' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu (SHIB - 🐕 Мемекойн)' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe (PEPE - 🐸 Мемекойн)' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk (BONK - 🐕 Мемекойн)' },
  { id: 'floki', symbol: 'FLOKI', name: 'Floki (FLOKI - 🐶 Мемекойн)' },
  { id: 'dogwifcoin', symbol: 'WIF', name: 'dogwifhat (WIF - 🧶 Мемекойн)' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche (AVAX)' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink (LINK)' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot (DOT)' },
  { id: 'tron', symbol: 'TRX', name: 'TRON (TRX)' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol (NEAR)' },
  { id: 'sui', symbol: 'SUI', name: 'Sui (SUI)' },
  { id: 'book-of-meme', symbol: 'BOME', name: 'Book of Meme (BOME - 📖 Мемекойн)' },
  { id: 'notcoin', symbol: 'NOT', name: 'Notcoin (NOT - 🟡 Telegram)' },
  { id: 'toncoin', symbol: 'TON', name: 'Toncoin (TON - 💎 Telegram)' },
];

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
    roiTab: "📊 ROI / ROAS",
    converterTab: "💱 Конвертер валют",
    cryptoConvTab: "🪙 Криптоконвертер",
    deliveryTab: "📦 Доставка Україною",
    chinaTab: "✈️ З Китаю в Україну",
    close: "Закрити ✕",
    country: "Країна реєстрації",
    paymentSystem: "Платіжна система",
    checkAmount: "Сума чеку",
    currency: "Валюта",
    serviceFee: "Комісія сервісу",
    toPayout: "До зарахування:",
    cryptoCoin: "Криптовалюта / Мемкойн",
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
    adSpend: "Витрати на рекламу (Ad Spend)",
    revenue: "Отриманий дохід (Revenue)",
    cogs: "Собівартість товарів (COGS)",
    roiCurrency: "Валюта аналізу",
    netProfitTotal: "Чистий прибуток кампанії:",
    roiText: "ROI (Рентабельність інвестицій):",
    roasText: "ROAS (Окупність реклами):",
    deliveryService: "Служба доставки",
    parcelWeight: "Вага посилки (кг)",
    declaredValue: "Оголошена вартість (грн)",
    shippingBase: "Вартість пересилання:",
    insuranceCost: "Страховка:",
    totalShipping: "Загальна вартість доставки:",
    chinaService: "Спосіб та сервіс доставки",
    chinaWeight: "Вага посилки з Китаю (кг)",
    chinaInvoice: "Вартість товару за інвойсом ($)",
    chinaShippingCost: "Вартість фрахту:",
    chinaInsurance: "Страховка (~1%):",
    chinaTotalUsd: "Загальна вартість логістики (USD):",
    chinaTotalUah: "Загальна вартість логістики (UAH):",
    termDays: "Орієнтовний термін:",
    chooseCalc: "Оберіть свій калькулятор вище",
    chooseCalcSub: "Для початку розрахунків натисніть на відповідну вкладку",
    usefulTitle: "Для чого ці калькулятори",
    usefulDesc: "Цей розділ створений для швидких та зручних розрахунків. Інструменти допомагають точно обчислювати підсумкові значення з урахуванням різних комісій, конвертацій та параметрів для різних завдань.",
    understood: "Зрозуміло",
    privacyTitle: "Політика конфіденційності",
    privacyText1: "Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо інформацію під час використання нашого сайту та калькуляторів.",
    privacyText2: "1. Збір даних: Ми не вимагаємо та не зберігаємо ваші персональні дані (імена, номери телефонів, пошту), окрім випадків, коли ви самостійно звертаєтесь до нас через контакти чи месенджери.",
    privacyText3: "2. Розрахунки: Усі обчислення (еквайринг, комісії крипти, маржинальність, ROI) виконуються динамічно у вашому браузері. Введені вами суми не передаються на зовнішні бази даних.",
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
    roiTab: "📊 ROI / ROAS",
    converterTab: "💱 Currency Converter",
    cryptoConvTab: "🪙 Crypto Converter",
    deliveryTab: "📦 Local Delivery",
    chinaTab: "✈️ China to Ukraine",
    close: "Close ✕",
    country: "Registration country",
    paymentSystem: "Payment system",
    checkAmount: "Check amount",
    currency: "Currency",
    serviceFee: "Service fee",
    toPayout: "To payout:",
    cryptoCoin: "Cryptocurrency / Memecoin",
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
    adSpend: "Ad Spend",
    revenue: "Revenue",
    cogs: "Cost of Goods Sold (COGS)",
    roiCurrency: "Analysis currency",
    netProfitTotal: "Net profit of campaign:",
    roiText: "ROI (Return on Investment):",
    roasText: "ROAS (Return on Ad Spend):",
    deliveryService: "Delivery service",
    parcelWeight: "Parcel weight (kg)",
    declaredValue: "Declared value (UAH)",
    shippingBase: "Shipping base cost:",
    insuranceCost: "Insurance fee:",
    totalShipping: "Total shipping cost:",
    chinaService: "Delivery method & service",
    chinaWeight: "Parcel weight from China (kg)",
    chinaInvoice: "Invoice goods value ($)",
    chinaShippingCost: "Freight cost:",
    chinaInsurance: "Insurance (~1%):",
    chinaTotalUsd: "Total logistics cost (USD):",
    chinaTotalUah: "Total logistics cost (UAH):",
    termDays: "Estimated term:",
    chooseCalc: "Choose your calculator above",
    chooseCalcSub: "Click on the corresponding tab to start calculations",
    usefulTitle: "Purpose of these calculators",
    usefulDesc: "This section is designed for quick and convenient calculations. The tools help accurately calculate final values taking into account various fees, conversions, and parameters for different tasks.",
    understood: "Understood",
    privacyTitle: "Privacy Policy",
    privacyText1: "This Privacy Policy explains how we collect, use, and protect information when using our website and calculators.",
    privacyText2: "1. Data collection: We do not require or store your personal data (names, phone numbers, email) except when you independently contact us via contacts or messengers.",
    privacyText3: "2. Calculations: All calculations (acquiring, crypto fees, margins, ROI) are performed dynamically in your browser. The amounts you enter are not sent to external databases.",
    privacyText4: "3. External services: The site may use open data from national banks (e.g., NBU) to obtain current exchange rates, as well as links to third-party platforms (Telegram).",
    privacyText5: "4. Changes: We reserve the right to update this policy in case of new tools or functionality.",
    helpTitle: "Help & Support",
    helpDesc: "If you have questions about the calculators or want to suggest new features or improvements, you can contact us directly via Telegram.",
    writeTelegram: "Write on Telegram",
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'acquiring' | 'crypto' | 'margin' | 'roi' | 'converter' | 'cryptoConv' | 'delivery' | 'china' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'useful' | 'help' | 'privacy' | null>(null);
  const [lang, setLang] = useState<'uk' | 'en'>('uk');

  const t = translations[lang];

  // --- КУРСИ ВАЛЮТ ЗАГАЛЬНІ ---
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
      .catch(err => console.error('Помилка курсів НБУ:', err));
  }, []);

  // --- GOOGLE-STYLE КОНВЕРТЕР ВАЛЮТ ---
  const [allRates, setAllRates] = useState<Record<string, number>>({ USD: 1, UAH: 41.0, EUR: 0.92, PLN: 4.0 });
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['USD', 'UAH', 'EUR', 'PLN', 'GBP']);
  const [curr1, setCurr1] = useState<string>('USD');
  const [curr2, setCurr2] = useState<string>('UAH');
  const [val1, setVal1] = useState<number | string>(1);
  const [val2, setVal2] = useState<number | string>(41.0);
  const [updateInfo, setUpdateInfo] = useState<string>('');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setAllRates(data.rates);
          const codes = Object.keys(data.rates);
          setAvailableCurrencies(codes);
          if (data.rates['UAH']) {
            setVal2(Number((1 * data.rates['UAH']).toFixed(2)));
          }
          if (data.time_last_update_utc) {
            setUpdateInfo(data.time_last_update_utc);
          }
        }
      })
      .catch(err => console.error('Помилка завантаження світових курсів:', err));
  }, []);

  const handleVal1Change = (val: number | string) => {
    setVal1(val);
    const num = typeof val === 'number' ? val : parseFloat(val) || 0;
    const r1 = allRates[curr1] || 1;
    const r2 = allRates[curr2] || 1;
    const inUSD = num / r1;
    const res = inUSD * r2;
    setVal2(res ? Number(res.toFixed(2)) : '');
  };

  const handleVal2Change = (val: number | string) => {
    setVal2(val);
    const num = typeof val === 'number' ? val : parseFloat(val) || 0;
    const r1 = allRates[curr1] || 1;
    const r2 = allRates[curr2] || 1;
    const inUSD = num / r2;
    const res = inUSD * r1;
    setVal1(res ? Number(res.toFixed(2)) : '');
  };

  const handleCurr1Change = (newCurr: string) => {
    setCurr1(newCurr);
    const num = typeof val1 === 'number' ? val1 : parseFloat(val1) || 0;
    const r1 = allRates[newCurr] || 1;
    const r2 = allRates[curr2] || 1;
    const inUSD = num / r1;
    const res = inUSD * r2;
    setVal2(res ? Number(res.toFixed(2)) : '');
  };

  const handleCurr2Change = (newCurr: string) => {
    setCurr2(newCurr);
    const num = typeof val1 === 'number' ? val1 : parseFloat(val1) || 0;
    const r1 = allRates[curr1] || 1;
    const r2 = allRates[newCurr] || 1;
    const inUSD = num / r1;
    const res = inUSD * r2;
    setVal2(res ? Number(res.toFixed(2)) : '');
  };

  const handleSwapCurrencies = () => {
    const tempCurr = curr1;
    const tempVal = val1;
    setCurr1(curr2);
    setCurr2(tempCurr);
    setVal1(val2);
    setVal2(tempVal);
  };

  // --- КРИПТОКОНВЕРТЕР (COINGECKO LIVE API) ---
  const [cryptoRatesData, setCryptoRatesData] = useState<Record<string, Record<string, number>>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('bitcoin');
  const [cryptoInputAmount, setCryptoInputAmount] = useState<number | string>(1);
  const [fiatTargetCurrency, setFiatTargetCurrency] = useState<string>('uah');

  useEffect(() => {
    const ids = availableCryptos.map(c => c.id).join(',');
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,uah,eur,pln,gbp`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCryptoRatesData(data);
        }
      })
      .catch(err => console.error('Помилка завантаження курсів криптовалют:', err));
  }, []);

  const getCalculatedCryptoFiatValue = () => {
    const num = typeof cryptoInputAmount === 'number' ? cryptoInputAmount : parseFloat(cryptoInputAmount) || 0;
    const coinData = cryptoRatesData[selectedCryptoId];
    if (!coinData) return 0;
    const rate = coinData[fiatTargetCurrency.toLowerCase()] || 0;
    return num * rate;
  };

  // --- ЕКВАЙРИНГ ---
  const [amount, setAmount] = useState<number | string>(1000);
  const [country, setCountry] = useState<string>('Ukraine');
  const [system, setSystem] = useState(paymentSystemsMap['Ukraine'][0]);
  const [currency, setCurrency] = useState<string>('UAH');

  useEffect(() => {
    const availableSystems = paymentSystemsMap[country];
    if (availableSystems) setSystem(availableSystems[0]);
  }, [country]);

  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const acquiringFee = (numAmount * system.feePercent) / 100 + system.feeFixed;
  const acquiringNet = numAmount - acquiringFee;
  const acquiringNetUAH = acquiringNet * (rates[currency] || 1);

  // --- КРИПТОВИВІД ---
  const [cryptoAmount, setCryptoAmount] = useState<number | string>(500);
  const [coin, setCoin] = useState<string>('USDT');
  const [network, setNetwork] = useState(cryptoNetworksMap['USDT'][0]);

  useEffect(() => {
    const availableNetworks = cryptoNetworksMap[coin];
    if (availableNetworks) setNetwork(availableNetworks[0]);
  }, [coin]);

  const numCryptoAmount = typeof cryptoAmount === 'number' ? cryptoAmount : parseFloat(cryptoAmount) || 0;
  const cryptoFeeTotal = (numCryptoAmount * network.feePercent) / 100 + network.feeFixed;
  const cryptoNet = numCryptoAmount - cryptoFeeTotal;

  // --- МАРЖИНАЛЬНІСТЬ ТА ПРИБУТОК ---
  const [costPrice, setCostPrice] = useState<number | string>(300);
  const [sellingPrice, setSellingPrice] = useState<number | string>(600);
  const [marginCurrency, setMarginCurrency] = useState<string>('UAH');

  const numCostPrice = typeof costPrice === 'number' ? costPrice : parseFloat(costPrice) || 0;
  const numSellingPrice = typeof sellingPrice === 'number' ? sellingPrice : parseFloat(sellingPrice) || 0;

  const profit = numSellingPrice - numCostPrice;
  const margin = numSellingPrice > 0 ? (profit / numSellingPrice) * 100 : 0;
  const markup = numCostPrice > 0 ? (profit / numCostPrice) * 100 : 0;

  // --- ROI / ROAS ---
  const [adSpend, setAdSpend] = useState<number | string>(10000);
  const [revenue, setRevenue] = useState<number | string>(35000);
  const [cogs, setCogs] = useState<number | string>(12000);
  const [roiCurrency, setRoiCurrency] = useState<string>('UAH');

  const numAdSpend = typeof adSpend === 'number' ? adSpend : parseFloat(adSpend) || 0;
  const numRevenue = typeof revenue === 'number' ? revenue : parseFloat(revenue) || 0;
  const numCogs = typeof cogs === 'number' ? cogs : parseFloat(cogs) || 0;

  const netProfitTotal = numRevenue - numAdSpend - numCogs;
  const totalCost = numAdSpend + numCogs;
  const roiValue = totalCost > 0 ? (netProfitTotal / totalCost) * 100 : 0;
  const roasValue = numAdSpend > 0 ? numRevenue / numAdSpend : 0;

  // --- КАЛЬКУЛЯТОР ДОСТАВКИ УКРАЇНОЮ ---
  const [deliveryType, setDeliveryType] = useState<string>('nova_branch');
  const [parcelWeight, setParcelWeight] = useState<number | string>(1);
  const [declaredValue, setDeclaredValue] = useState<number | string>(500);

  const numWeight = typeof parcelWeight === 'number' ? parcelWeight : parseFloat(parcelWeight) || 0;
  const numVal = typeof declaredValue === 'number' ? declaredValue : parseFloat(declaredValue) || 0;

  let baseShipping = 70;
  if (deliveryType === 'nova_branch') {
    if (numWeight <= 1) baseShipping = 60;
    else if (numWeight <= 2) baseShipping = 70;
    else if (numWeight <= 5) baseShipping = 90;
    else if (numWeight <= 10) baseShipping = 120;
    else if (numWeight <= 20) baseShipping = 170;
    else baseShipping = 170 + Math.ceil(numWeight - 20) * 10;
  } else if (deliveryType === 'nova_courier') {
    if (numWeight <= 1) baseShipping = 95;
    else if (numWeight <= 2) baseShipping = 105;
    else if (numWeight <= 5) baseShipping = 125;
    else if (numWeight <= 10) baseShipping = 155;
    else baseShipping = 200 + Math.ceil(numWeight - 20) * 10;
  } else if (deliveryType === 'ukrposhta') {
    if (numWeight <= 1) baseShipping = 40;
    else if (numWeight <= 5) baseShipping = 55;
    else if (numWeight <= 10) baseShipping = 75;
    else baseShipping = 75 + Math.ceil(numWeight - 10) * 10;
  }

  const insuranceFee = deliveryType.includes('nova') ? Math.max(10, numVal * 0.005) : numVal * 0.01;
  const totalDeliveryCost = baseShipping + (deliveryType.includes('nova') ? insuranceFee : 0);

  // --- КАЛЬКУЛЯТОР ДОСТАВКИ З КИТАЮ ---
  const [chinaServiceType, setChinaServiceType] = useState<string>('meest_avia');
  const [chinaWeightInput, setChinaWeightInput] = useState<number | string>(5);
  const [chinaInvoiceValue, setChinaInvoiceValue] = useState<number | string>(300);

  const numChinaWeight = typeof chinaWeightInput === 'number' ? chinaWeightInput : parseFloat(chinaWeightInput) || 0;
  const numChinaInvoice = typeof chinaInvoiceValue === 'number' ? chinaInvoiceValue : parseFloat(chinaInvoiceValue) || 0;

  let ratePerKg = 15.0; 
  let chinaTerm = '9–12 днів';

  if (chinaServiceType === 'meest_avia') {
    ratePerKg = 15.0;
    chinaTerm = '9–12 днів';
  } else if (chinaServiceType === 'meest_sea') {
    ratePerKg = 5.1;
    chinaTerm = '50–55 днів';
  } else if (chinaServiceType === 'cargo_avia') {
    ratePerKg = 12.0;
    chinaTerm = '8–12 днів (Експрес Карго)';
  } else if (chinaServiceType === 'cargo_sea') {
    ratePerKg = 3.2;
    chinaTerm = '45–60 днів (Економ Карго)';
  }

  const chinaFreightCost = numChinaWeight * ratePerKg;
  const chinaInsuranceCost = numChinaInvoice * 0.01; 
  const chinaTotalUsd = chinaFreightCost + chinaInsuranceCost;
  const usdRate = rates['USD'] || 41.0;
  const chinaTotalUah = chinaTotalUsd * usdRate;

  const toggleTab = (tab: 'acquiring' | 'crypto' | 'margin' | 'roi' | 'converter' | 'cryptoConv' | 'delivery' | 'china') => {
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
          className="bg-white/85 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md font-medium hover:bg-white transition-all duration-300 flex items-center gap-2 text-slate-700 active:scale-95"
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
          className="bg-white/85 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md font-medium hover:bg-white transition-all duration-300 flex items-center gap-2 text-slate-700 active:scale-95"
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

        {/* КНОПКИ ПЕРЕМИКАННЯ КАЛЬКУЛЯТОРІВ */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          <button
            onClick={() => toggleTab('acquiring')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'acquiring'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.acquiring}
          </button>
          
          <button
            onClick={() => toggleTab('crypto')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'crypto'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.crypto}
          </button>

          <button
            onClick={() => toggleTab('cryptoConv')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'cryptoConv'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-orange-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.cryptoConvTab}
          </button>

          <button
            onClick={() => toggleTab('margin')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'margin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.margin}
          </button>

          <button
            onClick={() => toggleTab('roi')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'roi'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.roiTab}
          </button>

          <button
            onClick={() => toggleTab('converter')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'converter'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.converterTab}
          </button>

          <button
            onClick={() => toggleTab('delivery')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'delivery'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.deliveryTab}
          </button>

          <button
            onClick={() => toggleTab('china')}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm ${
              activeTab === 'china'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-teal-500/25 shadow-lg'
                : 'bg-white/85 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            {t.chinaTab}
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
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[currency] || currency}</span>
                </div>
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
                  - {acquiringFee.toFixed(2)} {currencySymbols[currency] || currency}
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
              <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                <input
                  type="number"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                />
                <span className="text-indigo-600 font-bold text-sm pl-2">{coin}</span>
              </div>
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

        {/* ================= КРИПТОКОНВЕРТЕР (LIVE COINGECKO API) ================= */}
        {activeTab === 'cryptoConv' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                {t.cryptoConvTab.replace(/^[^\wа-яА-Я]+/, '')}
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
                  value={selectedCryptoId}
                  onChange={(e) => setSelectedCryptoId(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-medium"
                >
                  {availableCryptos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.currency}</label>
                <select
                  value={fiatTargetCurrency}
                  onChange={(e) => setFiatTargetCurrency(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="uah">UAH (₴)</option>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="pln">PLN (zł)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Кількість монет</label>
              <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white transition-all">
                <input
                  type="number"
                  value={cryptoInputAmount}
                  onChange={(e) => setCryptoInputAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-transparent border-none text-slate-900 font-semibold text-lg py-2.5 outline-none"
                  step="any"
                />
                <span className="text-amber-600 font-bold text-sm pl-2">
                  {availableCryptos.find(c => c.id === selectedCryptoId)?.symbol || ''}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white p-6 rounded-2xl shadow-lg mt-6">
              <div className="flex justify-between items-center text-slate-300 text-sm mb-2">
                <span>Поточний курс:</span>
                <span className="font-semibold text-amber-300">
                  1 {availableCryptos.find(c => c.id === selectedCryptoId)?.symbol} = {cryptoRatesData[selectedCryptoId]?.[fiatTargetCurrency.toLowerCase()]?.toLocaleString() || '...'} {fiatTargetCurrency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center text-2xl font-extrabold pt-3 border-t border-slate-800">
                <span>Вартість у фіаті:</span>
                <span className="text-emerald-400">
                  {getCalculatedCryptoFiatValue() > 0 ? getCalculatedCryptoFiatValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} {fiatTargetCurrency.toUpperCase()}
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
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[marginCurrency] || marginCurrency}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.sellingPrice}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[marginCurrency] || marginCurrency}</span>
                </div>
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
                  + {profit.toFixed(2)} {currencySymbols[marginCurrency] || marginCurrency}
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

        {/* ================= КАЛЬКУЛЯТОР ROI / ROAS ================= */}
        {activeTab === 'roi' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                {t.roiTab.replace(/^[^\wа-яА-Я]+/, '')}
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
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.adSpend}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[roiCurrency] || roiCurrency}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.revenue}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[roiCurrency] || roiCurrency}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.cogs}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={cogs}
                    onChange={(e) => setCogs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">{currencySymbols[roiCurrency] || roiCurrency}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.roiCurrency}</label>
                <select
                  value={roiCurrency}
                  onChange={(e) => setRoiCurrency(e.target.value)}
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

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mt-6 space-y-3">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.netProfitTotal}</span>
                <span className={`font-semibold text-base ${netProfitTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netProfitTotal > 0 ? `+ ${netProfitTotal.toFixed(2)}` : netProfitTotal.toFixed(2)} {currencySymbols[roiCurrency] || roiCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.roasText}</span>
                <span className="font-semibold text-white">
                  {roasValue.toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold border-t border-slate-800 pt-3">
                <span>{t.roiText}</span>
                <span className={roiValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {roiValue.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= GOOGLE-STYLE КОНВЕРТЕР ВАЛЮТ ================= */}
        {activeTab === 'converter' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                {t.converterTab.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>

            {/* ПЕРШИЙ РЯДОК ВАЛЮТИ */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
              <input
                type="number"
                value={val1}
                onChange={(e) => handleVal1Change(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent border-none text-2xl md:text-3xl font-semibold text-slate-900 outline-none"
                placeholder="0"
              />
              <select
                value={curr1}
                onChange={(e) => handleCurr1Change(e.target.value)}
                className="bg-transparent border-none text-indigo-600 font-bold text-base md:text-lg outline-none cursor-pointer pl-3"
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>
                    {code} {currencySymbols[code] ? `(${currencySymbols[code]})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* КНОПКА ЗМІНИ МІСЦЯМИ (⇅) */}
            <div className="flex justify-center -my-3 relative z-10">
              <button
                onClick={handleSwapCurrencies}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
                title="Міняти місцями"
              >
                ⇅
              </button>
            </div>

            {/* ДРУГИЙ РЯДОК ВАЛЮТИ */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mt-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
              <input
                type="number"
                value={val2}
                onChange={(e) => handleVal2Change(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent border-none text-2xl md:text-3xl font-semibold text-slate-900 outline-none"
                placeholder="0"
              />
              <select
                value={curr2}
                onChange={(e) => handleCurr2Change(e.target.value)}
                className="bg-transparent border-none text-indigo-600 font-bold text-base md:text-lg outline-none cursor-pointer pl-3"
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>
                    {code} {currencySymbols[code] ? `(${currencySymbols[code]})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center text-xs text-slate-400 mt-6">
              {updateInfo ? `Оновлено курсів: ${updateInfo}` : 'Оновлення курсів валют у реальному часі...'}
            </div>
          </div>
        )}

        {/* ================= КАЛЬКУЛЯТОР ДОСТАВКИ УКРАЇНОЮ ================= */}
        {activeTab === 'delivery' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                {t.deliveryTab.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.deliveryService}</label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="nova_branch">Нова Пошта (Відділення)</option>
                <option value="nova_courier">Нова Пошта (Кур'єр)</option>
                <option value="ukrposhta">Укрпошта (Стандарт / Експрес)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.parcelWeight}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={parcelWeight}
                    onChange={(e) => setParcelWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">кг</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.declaredValue}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-indigo-600 font-bold text-sm pl-2">₴</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mt-6 space-y-3">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.shippingBase}</span>
                <span className="font-semibold text-white">
                  {baseShipping.toFixed(2)} ₴
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.insuranceCost}</span>
                <span className="font-semibold text-rose-400">
                  + {insuranceFee.toFixed(2)} ₴
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold border-t border-slate-800 pt-3">
                <span>{t.totalShipping}</span>
                <span className="text-emerald-400">
                  ≈ {totalDeliveryCost > 0 ? totalDeliveryCost.toFixed(2) : '0.00'} ₴
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= КАЛЬКУЛЯТОР ДОСТАВКИ З КИТАЮ ================= */}
        {activeTab === 'china' && (
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 animate-in fade-in duration-300 relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
                {t.chinaTab.replace(/^[^\wа-яА-Я]+/, '')}
              </h2>
              <button 
                onClick={() => setActiveTab(null)} 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                {t.close}
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.chinaService}</label>
              <select
                value={chinaServiceType}
                onChange={(e) => setChinaServiceType(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              >
                <option value="meest_avia">Meest China (Авіа) — $15.0 / кг</option>
                <option value="meest_sea">Meest China (Море) — $5.1 / кг</option>
                <option value="cargo_avia">Cargo Express (Авіа через ЄС) — $12.0 / кг</option>
                <option value="cargo_sea">Cargo Sea (Море Економ) — $3.2 / кг</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.chinaWeight}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={chinaWeightInput}
                    onChange={(e) => setChinaWeightInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-teal-600 font-bold text-sm pl-2">кг</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.chinaInvoice}</label>
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    value={chinaInvoiceValue}
                    onChange={(e) => setChinaInvoiceValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent border-none text-slate-900 font-medium py-2.5 outline-none"
                  />
                  <span className="text-teal-600 font-bold text-sm pl-2">$</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-lg mt-6 space-y-3">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.termDays}</span>
                <span className="font-semibold text-teal-300">
                  {chinaTerm}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.chinaShippingCost} ({ratePerKg}$ × {numChinaWeight} кг):</span>
                <span className="font-semibold text-white">
                  $ {chinaFreightCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>{t.chinaInsurance}</span>
                <span className="font-semibold text-rose-300">
                  + $ {chinaInsuranceCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-slate-800 text-slate-200">
                <span>{t.chinaTotalUsd}</span>
                <span className="text-teal-400">
                  $ {chinaTotalUsd.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold pt-2 border-t border-slate-800">
                <span>{t.chinaTotalUah}</span>
                <span className="text-emerald-400">
                  ≈ {chinaTotalUah.toFixed(2)} ₴
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