"use client";

type LeaveRequestHistoryProps = {
  requests: Array<{
    id: number;
    leaveType: string;
    leaveDate: string;
    reason?: string | null;
    status: string;
  }>;
};

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function LeaveRequestHistory({
  requests,
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

      {requests.length === 0 ? (
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
                <div>
                  <p className="font-medium text-[#123c35]">
                    {formatDate(request.leaveDate)}
                  </p>
                  <p className="text-sm capitalize text-gray-500">
                    {request.leaveType} leave
                  </p>
                  {request.reason ? (
                    <p className="mt-2 text-sm text-gray-600">
                      {request.reason}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-[#e2f5f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
