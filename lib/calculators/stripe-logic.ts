import { PaymentCalculatorResult } from '../../types/calculator';

export function calculatePaymentFee(
  amount: number,
  rate: number,
  fixedFee: number,
  mode: 'direct' | 'reverse'
): PaymentCalculatorResult {
  if (amount <= 0 || isNaN(amount)) {
    return { gross: 0, net: 0, fee: 0 };
  }

  if (mode === 'direct') {
    const fee = amount * rate + fixedFee;
    const net = amount - fee;
    return {
      gross: Number(amount.toFixed(2)),
      net: Number((net > 0 ? net : 0).toFixed(2)),
      fee: Number(fee.toFixed(2)),
    };
  } else {
    const gross = (amount + fixedFee) / (1 - rate);
    const fee = gross - amount;
    return {
      gross: Number(gross.toFixed(2)),
      net: Number(amount.toFixed(2)),
      fee: Number(fee.toFixed(2)),
    };
  }
}