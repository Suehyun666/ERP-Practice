import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-100">{label}</label>}
        
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">{leftIcon}</span>}
          
          <input
            id={inputId}
            ref={ref}
            className={`w-full py-2 px-3 text-sm bg-surface-900 text-slate-100 border rounded-md outline-none transition-all shadow-sm disabled:bg-surface-800 disabled:opacity-70 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'}
              ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            {...props}
          />
          
          {rightIcon && <span className="absolute right-3 text-slate-400 flex items-center">{rightIcon}</span>}
        </div>
        
        {error && <p className="text-[13px] text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
