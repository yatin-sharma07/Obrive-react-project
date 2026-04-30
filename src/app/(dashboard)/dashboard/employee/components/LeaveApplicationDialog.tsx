"use client";

import Image from "next/image";
import supportImg from "@/assets/images/employee/illustration.png";

type LeaveApplicationDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    leaveType: "vacation" | "sick";
    leaveDate: string;
    reason: string;
  }) => void;
  submitting: boolean;
  leaveType: "vacation" | "sick";
  leaveDate: string;
  reason: string;
  minDate: string;
  maxDate: string;
  onChange: (
    field: "leaveType" | "leaveDate" | "reason",
    value: string,
  ) => void;
};

export default function LeaveApplicationDialog({
  open,
  onClose,
  onSubmit,
  submitting,
  leaveType,
  leaveDate,
  reason,
  minDate,
  maxDate,
  onChange,
}: LeaveApplicationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          x
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[#073933]">
          Apply for Leave
        </h2>

        <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={supportImg}
            alt="leave support"
            className="h-full w-auto object-contain"
          />
        </div>

        <p className="mb-5 text-center text-sm text-gray-600">
          Pick your leave type, choose a day, and send your
          leave request.
        </p>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ leaveType, leaveDate, reason });
          }}
        >
          <div>
            <label
              htmlFor="leave-type"
              className="mb-1 block text-sm text-gray-500"
            >
              Type of leave
            </label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(event) => onChange("leaveType", event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63ff]"
            >
              <option value="vacation">Vacation leave</option>
              <option value="sick">Sick leave</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="leave-date"
              className="mb-1 block text-sm text-gray-500"
            >
              Leave date
            </label>
            <input
              id="leave-date"
              type="date"
              value={leaveDate}
              min={minDate}
              max={maxDate}
              onChange={(event) => onChange("leaveDate", event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63ff]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="leave-reason"
              className="mb-1 block text-sm text-gray-500"
            >
              Reason
            </label>
            <textarea
              id="leave-reason"
              value={reason}
              onChange={(event) => onChange("reason", event.target.value)}
              placeholder="Add a short note for your leave request"
              className="h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63ff]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !leaveDate}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Send Leave Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
