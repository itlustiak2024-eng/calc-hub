export type CalculationMode = 'direct' | 'reverse';

export interface PaymentCalculatorInput {
  amount: number;
  rate: number;
  fixedFee: number;
  mode: CalculationMode;
}

export interface PaymentCalculatorResult {
  gross: number;
  net: number;
  fee: number;
}

export interface CryptoCalculatorInput {
  usdtAmount: number;
  networkFee: number;
  exchangeRate: number;
}

export interface CryptoCalculatorResult {
  netUsdt: number;
  fiatAmount: number;
}