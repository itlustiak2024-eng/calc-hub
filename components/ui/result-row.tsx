'use client';
import React, { useState } from 'react';

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({ label, value, highlight = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const cleanValue = value.replace(/[^0-9.-]/g, '');
      await navigator.clipboard.writeText(cleanValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors gap-3 ${
      highlight 
        ? 'bg-emerald-50 border-emerald-200' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <span className={`text-sm font-medium ${highlight ? 'text-emerald-800' : 'text-slate-600'}`}>
        {label}
      </span>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        <span className={`text-xl font-bold tracking-tight ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
          {value}
        </span>
        <button
          onClick={handleCopy}
          className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md border shadow-sm transition-all active:scale-95 ${
            copied 
              ? 'bg-emerald-500 border-emerald-600 text-white' 
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {copied ? '✓ Копійовано' : 'Копіювати'}
        </button>
      </div>
    </div>
  );
};