export const COUNTRIES = {
  ua: { 
    id: 'ua', 
    name: 'Україна', 
    supportedMethods: ['paypal', 'wise', 'payoneer'] 
  },
  pl: { 
    id: 'pl', 
    name: 'Польща', 
    supportedMethods: ['stripe', 'paypal', 'wise', 'payoneer'] 
  },
  us: { 
    id: 'us', 
    name: 'США', 
    supportedMethods: ['stripe', 'paypal', 'wise', 'payoneer'] 
  },
  it: { 
    id: 'it', 
    name: 'Італія', 
    supportedMethods: ['stripe', 'paypal', 'wise', 'payoneer'] 
  },
  de: { 
    id: 'de', 
    name: 'Німеччина', 
    supportedMethods: ['stripe', 'paypal', 'wise', 'payoneer'] 
  },
};

export const FIAT_CURRENCIES = {
  usd: { id: 'usd', name: 'USD ($)', symbol: '$', description: 'Долар США (United States Dollar)' },
  eur: { id: 'eur', name: 'EUR (€)', symbol: '€', description: 'Євро (Euro)' },
  gbp: { id: 'gbp', name: 'GBP (£)', symbol: '£', description: 'Британський фунт стерлінгів (British Pound)' },
  pln: { id: 'pln', name: 'PLN (zł)', symbol: 'zł', description: 'Польський злотий (Polish Zloty)' },
  uah: { id: 'uah', name: 'UAH (₴)', symbol: '₴', description: 'Українська гривня (Ukrainian Hryvnia)' },
};

export const PAYMENT_FEES = {
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    rate: 0.029,
    fixed: 0.30,
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    rate: 0.0349,
    fixed: 0.49,
  },
  wise: {
    id: 'wise',
    name: 'Wise (Бізнес)',
    rate: 0.005,
    fixed: 0.50,
  },
  payoneer: {
    id: 'payoneer',
    name: 'Payoneer',
    rate: 0.02,
    fixed: 0.00,
  },
};

export const CRYPTO_NETWORKS = {
  solana: { id: 'solana', name: 'Solana (SOL)', feeUsdt: 0.01 },
  polygon: { id: 'polygon', name: 'Polygon (POL/MATIC)', feeUsdt: 0.02 },
  bep20: { id: 'bep20', name: 'BSC (BEP20)', feeUsdt: 0.10 },
  arbitrum: { id: 'arbitrum', name: 'Arbitrum One', feeUsdt: 0.05 },
  trc20: { id: 'trc20', name: 'TRON (TRC20)', feeUsdt: 1.00 },
  bitcoin: { id: 'bitcoin', name: 'Bitcoin (BTC Network)', feeUsdt: 2.50 },
  erc20: { id: 'erc20', name: 'Ethereum (ERC20)', feeUsdt: 6.00 },
};