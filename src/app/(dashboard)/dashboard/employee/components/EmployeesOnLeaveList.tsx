"use client";

type LeaveColleague = {
  id: number;
  leaveType?: string;
  status?: string;
  leaveDate?: string;
  employee?: {
    id: number;
    name?: string;
    email?: string;
    job_title?: string | null;
    department?: string | null;
  };
};

type EmployeesOnLeaveListProps = {
  selectedDate: string;
  today: LeaveColleague[];
  tomorrow: LeaveColleague[];
};

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SectionList = ({
  title,
  items,
}: {
  title: string;
  items: LeaveColleague[];
}) => (
  <div className="rounded-2xl bg-[#f6fbff] p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-[#123c35]">{title}</h3>
      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500">
        {items.length}
      </span>
    </div>

    {items.length === 0 ? (
      <p className="text-sm text-gray-500">No other employees are on leave.</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[#123c35]">
                  {item.employee?.name || "Unknown employee"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.employee?.job_title ||
                    item.employee?.department ||
                    item.employee?.email ||
                    "No details available"}
                </p>
              </div>
              <span className="rounded-full bg-[#e2f5f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
                {item.leaveType || "Leave"}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function EmployeesOnLeaveList({
  selectedDate,
  today,
  tomorrow,
}: EmployeesOnLeaveListProps) {
  // 1. Guard clause: If selectedDate is missing, don't try to process it
  if (!selectedDate) {
    return null; // Or a loading spinner/placeholder
  }

  // 2. Safer Date Parsing
  // Using the template literal can sometimes fail depending on the input format.
  // This approach is generally safer for YYYY-MM-DD strings.
  const current = new Date(`${selectedDate}T00:00:00`);
  
  // Check if the date is actually valid before calling methods on it
  if (isNaN(current.getTime())) {
    return <p className="text-sm text-red-500">Invalid date selected.</p>;
  }

  const nextDay = new Date(current);
  nextDay.setDate(current.getDate() + 1);
  const nextDayLabel = nextDay.toISOString().split("T")[0];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* ... rest of your JSX ... */}
    </div>
  );
}
