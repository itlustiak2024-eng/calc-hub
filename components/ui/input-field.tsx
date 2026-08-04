import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefixSymbol?: string;
  suffixSymbol?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  prefixSymbol, 
  suffixSymbol, 
  ...props 
}) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {prefixSymbol && (
          <span className="absolute left-3 text-slate-500 font-medium select-none">
            {prefixSymbol}
          </span>
        )}
        <input
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm ${
            prefixSymbol ? 'pl-8' : ''
          } ${suffixSymbol ? 'pr-12' : ''}`}
          {...props}
        />
        {suffixSymbol && (
          <span className="absolute right-3 text-slate-500 font-medium select-none">
            {suffixSymbol}
          </span>
        )}
      </div>
    </div>
  );
};