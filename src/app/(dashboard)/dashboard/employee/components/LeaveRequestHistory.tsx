"use client";

import { Trash2 } from "lucide-react";

type LeaveRequestHistoryProps = {
  requests: Array<{
    id: number;
    leaveType?: string;
    leaveDate?: string;
    reason?: string | null;
    status?: string;
  }>;
  onDelete?: (id: number) => void;
};

const formatDate = (value?: string) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) : "N/A";

export default function LeaveRequestHistory({
  requests,
  onDelete,
}: LeaveRequestHistoryProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#123c35]">
          This Month’s Leave
        </h2>
        <p className="text-sm text-gray-500">
          Your submitted leave dates for the current month.
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          No leave requests yet for this month.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-gray-100 bg-[#fbfdff] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-medium text-[#123c35]">
                    {formatDate(request.leaveDate)}
                  </p>
                  <p className="text-sm capitalize text-gray-500">
                    {request.leaveType || 'N/A'} leave
                  </p>
                  {request.reason ? (
                    <p className="mt-2 text-sm text-gray-600">
                      {request.reason}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    request.status === 'approved' ? 'bg-green-100 text-green-700' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-[#e2f5f1] text-[#0f766e]'
                  }`}>
                    {request.status || 'pending'}
                  </span>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(request.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete leave request"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
