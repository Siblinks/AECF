import { type LucideIcon } from 'lucide-react';

export default function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  suffix,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="card card-hover p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {value}
            {suffix && <span className="text-base text-slate-400 ml-1">{suffix}</span>}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
