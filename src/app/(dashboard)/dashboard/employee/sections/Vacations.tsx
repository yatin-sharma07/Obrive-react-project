"use client";

import { motion } from "framer-motion";
import { CalendarDays, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SkeletonLoading from "@/components/SkelitonLoading";
import { apiFetch } from "@/lib/api";
import EmployeesOnLeaveList from "../components/EmployeesOnLeaveList";
import LeaveApplicationDialog from "../components/LeaveApplicationDialog";
import LeaveBalanceRing from "../components/LeaveBalanceRing";
import LeaveRequestHistory from "../components/LeaveRequestHistory";

type LeaveSummary = {
  month: {
    startDate: string;
    endDate: string;
  };
  selectedDate: string;
  allowances: {
    vacation: { total: number; used: number; remaining: number };
    sick: { total: number; used: number; remaining: number };
  };
  requests: Array<{
    id: number;
    leaveType: string;
    leaveDate: string;
    reason?: string | null;
    status: string;
  }>;
  colleaguesOnLeave: {
    today: Array<{
      id: number;
      leaveType: string;
      status: string;
      leaveDate: string;
      employee: {
        id: number;
        name: string;
        email: string;
        job_title?: string | null;
        department?: string | null;
      };
    }>;
    tomorrow: Array<{
      id: number;
      leaveType: string;
      status: string;
      leaveDate: string;
      employee: {
        id: number;
        name: string;
        email: string;
        job_title?: string | null;
        department?: string | null;
      };
    }>;
  };
};

const getCurrentMonthBounds = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
    today: now.toISOString().split("T")[0],
  };
};

export default function Vacations() {
  const [bounds] = useState(getCurrentMonthBounds);
  const [initialDate] = useState(() =>
    bounds.today >= bounds.startDate && bounds.today <= bounds.endDate
      ? bounds.today
      : bounds.startDate,
  );

  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<{
    leaveType: "vacation" | "sick";
    leaveDate: string;
    reason: string;
  }>({
    leaveType: "vacation",
    leaveDate: initialDate,
    reason: "",
  });
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const fetchSummary = useCallback(async (date: string, silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiFetch(`/leaves/dashboard?date=${date}`, {
        method: "GET",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load leave dashboard");
      }

      setSummary(result.data);
      setSelectedDate(result.data.selectedDate);
      setForm((current) => ({
        ...current,
        leaveDate: result.data.selectedDate,
      }));
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load leave dashboard",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(initialDate);
  }, [fetchSummary, initialDate]);

  const handleDateFilterChange = (value: string) => {
    setSelectedDate(value);
    fetchSummary(value, true);
  };

  const handleApplyLeave = async (payload: {
    leaveType: "vacation" | "sick";
    leaveDate: string;
    reason: string;
  }) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await apiFetch("/leaves/apply", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to apply for leave");
      }

      setSummary(result.data.summary);
      setSelectedDate(result.data.summary.selectedDate);
      setForm({
        leaveType: "vacation",
        leaveDate: result.data.summary.selectedDate,
        reason: "",
      });
      setDialogOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to apply for leave",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonLoading />;
  }

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm sm:p-6">
        <p className="font-semibold">Unable to load leave data</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <>
      <motion.div
        className="h-full min-h-0 p-3 sm:p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
          <div className="rounded-2xl bg-[#eef7ff] p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-[#123c35]">
                  Leave Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  6 vacation leaves and 2 sick leaves are available every month.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
                  <CalendarDays className="h-4 w-4 text-[#123c35]" />
                  <input
                    type="date"
                    value={selectedDate}
                    min={summary.month.startDate}
                    max={summary.month.endDate}
                    onChange={(event) =>
                      handleDateFilterChange(event.target.value)
                    }
                    className="bg-transparent outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-[#073933] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
                >
                  Apply Leave
                </button>

                <button
                  type="button"
                  onClick={() => fetchSummary(selectedDate, true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            ) : null}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <LeaveBalanceRing
              label="Vacation Leaves"
              total={summary.allowances.vacation.total}
              used={summary.allowances.vacation.used}
              remaining={summary.allowances.vacation.remaining}
              accentColor="#0f766e"
              trackColor="#d8f3ef"
            />
            <LeaveBalanceRing
              label="Sick Leaves"
              total={summary.allowances.sick.total}
              used={summary.allowances.sick.used}
              remaining={summary.allowances.sick.remaining}
              accentColor="#2563eb"
              trackColor="#dbeafe"
            />
          </div>

          <EmployeesOnLeaveList
            selectedDate={summary.selectedDate}
            today={summary.colleaguesOnLeave.today}
            tomorrow={summary.colleaguesOnLeave.tomorrow}
          />

          <LeaveRequestHistory requests={summary.requests} />
        </div>
      </motion.div>

      <LeaveApplicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleApplyLeave}
        submitting={submitting}
        leaveType={form.leaveType}
        leaveDate={form.leaveDate}
        reason={form.reason}
        minDate={summary.month.startDate}
        maxDate={summary.month.endDate}
        onChange={(field, value) => {
          setForm((current) => {
            if (field === "leaveType") {
              return { ...current, leaveType: value as "vacation" | "sick" };
            }

            if (field === "leaveDate") {
              return { ...current, leaveDate: value };
            }

            return { ...current, reason: value };
          });
        }}
      />
    </>
  );
}
