import { getStatusInfo } from '@/lib/constants';

export default function StatusBadge({ status }: { status: string }) {
  const info = getStatusInfo(status);
  return (
    <span className={`badge ${info.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {info.label}
    </span>
  );
}
