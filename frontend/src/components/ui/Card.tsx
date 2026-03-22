import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`bg-surface-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-lg relative overflow-hidden flex flex-col before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-primary-500 before:to-transparent before:opacity-50 ${className}`} {...props}>
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }: CardProps) => (
  <div className={`p-6 pb-2 flex flex-col gap-1.5 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-slate-100 leading-tight tracking-tight m-0 ${className}`} {...props}>{children}</h3>
);

export const CardContent = ({ className = '', children, ...props }: CardProps) => (
  <div className={`p-6 flex-1 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ className = '', children, ...props }: CardProps) => (
  <div className={`px-6 py-4 border-t border-slate-700/50 bg-black/20 flex items-center justify-end gap-3 ${className}`} {...props}>{children}</div>
);
