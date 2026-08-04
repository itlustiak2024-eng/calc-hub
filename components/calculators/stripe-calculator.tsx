'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { InputField } from '../ui/input-field';
import { ResultRow } from '../ui/result-row';
import { calculatePaymentFee } from '../../lib/calculators/stripe-logic';
import { PAYMENT_FEES, FIAT_CURRENCIES, COUNTRIES } from '../../lib/constants/fee-rates';
import { CalculationMode } from '../../types/calculator';

export default function StripeCalculator() {
  const [country, setCountry] = useState<keyof typeof COUNTRIES>('ua');
  const [provider, setProvider] = useState<keyof typeof PAYMENT_FEES>('paypal');
  const [currency, setCurrency] = useState<keyof typeof FIAT_CURRENCIES>('uah');
  const [amount, setAmount] = useState<string>('100');
  const [mode, setMode] = useState<CalculationMode>('direct');

  const availableProviders = useMemo(() => {
    const currentCountry = COUNTRIES[country];
    return currentCountry.supportedMethods.map(
      (methodId) => PAYMENT_FEES[methodId as keyof typeof PAYMENT_FEES]
    );
  }, [country]);

  useEffect(() => {
    const currentCountry = COUNTRIES[country];
    if (!currentCountry.supportedMethods.includes(provider)) {
      setProvider(currentCountry.supportedMethods[0] as keyof typeof PAYMENT_FEES);
    }
  }, [country, provider]);

  const currentSymbol = FIAT_CURRENCIES[currency].symbol;

  const result = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    const currentProvider = PAYMENT_FEES[provider];
    if (!currentProvider) return { gross: 0, net: 0, fee: 0 };
    return calculatePaymentFee(numAmount, currentProvider.rate, currentProvider.fixed, mode);
  }, [amount, provider, mode]);

  return (
    <div className="flex flex-col space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setMode('direct')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'direct' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          З суми виплати
        </button>
        <button
          onClick={() => setMode('reverse')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'reverse' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Скільки виставити в чек
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Країна реєстрації</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as keyof typeof COUNTRIES)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          >
            {Object.values(COUNTRIES).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Платіжна система</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as keyof typeof PAYMENT_FEES)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          >
            {availableProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({(p.rate * 100).toFixed(1)}% + {p.fixed})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Валюта</label>
            <span className="text-xs text-slate-400" title="Поточна валюта розрахунку">
              {FIAT_CURRENCIES[currency].description}
            </span>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as keyof typeof FIAT_CURRENCIES)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          >
            {Object.values(FIAT_CURRENCIES).map((c) => (
              <option key={c.id} value={c.id} title={c.description}>
                {c.name} — {c.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={mode === 'direct' ? 'Сума транзакції' : 'Бажана сума чистими'}
          type="number"
          min="0"
          step="0.01"
          prefixSymbol={currentSymbol}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00"
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <ResultRow label="Комісія сервісу:" value={`-${currentSymbol}${result.fee.toFixed(2)}`} />
        {mode === 'direct' ? (
          <ResultRow label="Ви отримаєте чистими:" value={`${currentSymbol}${result.net.toFixed(2)}`} highlight />
        ) : (
          <ResultRow label="Потрібно виставити рахунок на:" value={`${currentSymbol}${result.gross.toFixed(2)}`} highlight />
        )}
      </div>
    </div>
  );
}