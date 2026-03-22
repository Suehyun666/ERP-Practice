import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-primary-500/50',
  secondary: 'bg-surface-800 text-slate-100 border border-slate-700 hover:bg-slate-700',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-red-500/50',
  ghost: 'bg-transparent text-slate-400 hover:bg-surface-800 hover:text-slate-100'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseClass = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:opacity-60 disabled:cursor-not-allowed gap-2 tracking-tight';
    const classes = `${baseClass} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} disabled={disabled || isLoading} className={classes} {...props}>
        {isLoading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
        {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
