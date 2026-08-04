'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { InputField } from '../ui/input-field';
import { ResultRow } from '../ui/result-row';
import { calculateCryptoNet } from '../../lib/calculators/crypto-logic';
import { CRYPTO_NETWORKS, FIAT_CURRENCIES } from '../../lib/constants/fee-rates';

export default function CryptoCalculator() {
  const [usdtAmount, setUsdtAmount] = useState<string>('500');
  const [network, setNetwork] = useState<keyof typeof CRYPTO_NETWORKS>('solana');
  const [fiatType, setFiatType] = useState<keyof typeof FIAT_CURRENCIES>('uah');
  const [exchangeRate, setExchangeRate] = useState<string>('41.50');
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLiveRate() {
      setIsLoadingRate(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          const targetCurrency = fiatType.toUpperCase();
          const rate = data.rates[targetCurrency];
          
          if (rate) {
            setExchangeRate(rate.toFixed(2));
          }
        }
      } catch (error) {
        console.error('Помилка завантаження курсу валют:', error);
      } finally {
        setIsLoadingRate(false);
      }
    }

    fetchLiveRate();
  }, [fiatType]);

  const currentSymbol = FIAT_CURRENCIES[fiatType].symbol;

  const result = useMemo(() => {
    const amount = parseFloat(usdtAmount) || 0;
    const rate = parseFloat(exchangeRate) || 0;
    const currentNetwork = CRYPTO_NETWORKS[network];
    
    return calculateCryptoNet(amount, currentNetwork.feeUsdt, rate);
  }, [usdtAmount, network, exchangeRate]);

  return (
    <div className="flex flex-col space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField
          label="Сума переказу"
          type="number"
          min="0"
          step="1"
          suffixSymbol="USDT"
          value={usdtAmount}
          onChange={(e) => setUsdtAmount(e.target.value)}
          placeholder="500"
        />

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Мережа (Комісія)</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as keyof typeof CRYPTO_NETWORKS)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          >
            {Object.values(CRYPTO_NETWORKS).map((n) => (
              <option key={n.id} value={n.id} title={`Комісія мережі: $${n.feeUsdt}`}>
                {n.name} (${n.feeUsdt})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Фіатна валюта</label>
            <span className="text-xs text-slate-400" title="Активна валюта">
              {FIAT_CURRENCIES[fiatType].description}
            </span>
          </div>
          <select
            value={fiatType}
            onChange={(e) => setFiatType(e.target.value as keyof typeof FIAT_CURRENCIES)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          >
            {Object.values(FIAT_CURRENCIES).map((c) => (
              <option key={c.id} value={c.id} title={c.description}>
                {c.name} — {c.description}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <InputField
            label={isLoadingRate ? 'Оновлення курсу...' : 'Курс обміну (Live API)'}
            type="number"
            min="0"
            step="0.01"
            prefixSymbol={currentSymbol}
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            placeholder="41.50"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <ResultRow label="Дійде після комісії мережі:" value={`${result.netUsdt.toFixed(2)} USDT`} />
        <ResultRow label="Еквівалент у фіаті:" value={`${currentSymbol}${result.fiatAmount.toFixed(2)}`} highlight />
      </div>
    </div>
  );
}