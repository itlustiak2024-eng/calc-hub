import { CryptoCalculatorResult } from '../../types/calculator';

export function calculateCryptoNet(
  usdtAmount: number,
  networkFee: number,
  exchangeRate: number
): CryptoCalculatorResult {
  if (usdtAmount <= 0 || isNaN(usdtAmount)) {
    return { netUsdt: 0, fiatAmount: 0 };
  }

  const netUsdt = Math.max(0, usdtAmount - networkFee);
  const fiatAmount = netUsdt * exchangeRate;

  return {
    netUsdt: Number(netUsdt.toFixed(2)),
    fiatAmount: Number(fiatAmount.toFixed(2)),
  };
}