export default function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
}: {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };
  const color =
    value >= 100
      ? 'bg-success-500'
      : value >= 50
      ? 'bg-primary-600'
      : value >= 25
      ? 'bg-accent-500'
      : 'bg-slate-400';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Progress</span>
          <span className="text-xs font-bold text-slate-700">{value}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
