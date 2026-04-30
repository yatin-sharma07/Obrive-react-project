"use client";

type LeaveBalanceRingProps = {
  label: string;
  total: number;
  used: number;
  remaining: number;
  accentColor: string;
  trackColor: string;
};

export default function LeaveBalanceRing({
  label,
  total,
  used,
  remaining,
  accentColor,
  trackColor,
}: LeaveBalanceRingProps) {
  const ratio = total > 0 ? Math.max(0, Math.min(remaining / total, 1)) : 0;
  const degrees = ratio * 360;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#123c35]">{label}</p>
          <p className="text-xs text-gray-500">{used} used this month</p>
        </div>
        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {total} total
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${accentColor} 0deg ${degrees}deg, ${trackColor} ${degrees}deg 360deg)`,
          }}
        >
          <div className="flex h-[5.8rem] w-[5.8rem] flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-3xl font-bold text-[#123c35]">
              {remaining}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-gray-400">
              left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
