interface Props {
  amount: number;
  className?: string;
}

export const AmountDisplay = ({ amount, className = '' }: Props) => {
  const formatted = new Intl.NumberFormat('ko-KR').format(amount);
  const negative = amount < 0;
  return (
    <span className={`font-mono tabular-nums ${negative ? 'text-red-400' : ''} ${className}`}>
      {formatted}
    </span>
  );
};
