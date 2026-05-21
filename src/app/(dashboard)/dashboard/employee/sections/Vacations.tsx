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
import ConfirmationAlert from "@/components/ConfirmationAlert";

export const dynamic = 'force-dynamic';

type LeaveSummary = {
  month?: {
    startDate?: string;
    endDate?: string;
  };
  selectedDate?: string;
  allowances?: {
    vacation?: { total?: number; used?: number; remaining?: number };
    sick?: { total?: number; used?: number; remaining?: number };
  };
  requests?: Array<{
    id: number;
    leaveType?: string;
    leaveDate?: string;
    reason?: string | null;
    status?: string;
  }>;
  colleaguesOnLeave?: {
    today?: Array<{
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
    }>;
    tomorrow?: Array<{
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
    }>;
  };
};

const getCurrentMonthBounds = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const pad = (n: number) => String(n).padStart(2, "0");
  const toLocalDateString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    startDate: toLocalDateString(start),
    endDate: toLocalDateString(new Date(year, month + 2, 0)), // Allow until the end of next month
    today: toLocalDateString(now),
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
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "error" | "info" | "warning";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });

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
      setAlertConfig({
        isOpen: true,
        title: "Success",
        description: "Leave application submitted successfully!",
        type: "success",
      });
      fetchSummary(selectedDate);
    } catch (submitError: any) {
      setAlertConfig({
        isOpen: true,
        title: "Error",
        description: submitError.message || "Failed to apply for leave",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLeave = async (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Leave Request",
      description: "Are you sure you want to delete this leave request?",
      type: "warning",
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/leaves/${id}`, {
            method: "DELETE",
          });
          const result = await response.json();
          if (result.success) {
            setAlertConfig({
              isOpen: true,
              title: "Success",
              description: "Leave request deleted successfully",
              type: "success",
            });
            fetchSummary(selectedDate);
          } else {
            throw new Error(result.message || "Failed to delete leave request");
          }
        } catch (err: any) {
          setAlertConfig({
            isOpen: true,
            title: "Error",
            description: err.message || "An unexpected error occurred",
            type: "error",
          });
        }
      },
    });
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
                    min={summary?.month?.startDate}
                    max={summary?.month?.endDate}
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
              total={summary?.allowances?.vacation?.total || 0}
              used={summary?.allowances?.vacation?.used || 0}
              remaining={summary?.allowances?.vacation?.remaining || 0}
              accentColor="#0f766e"
              trackColor="#d8f3ef"
            />
            <LeaveBalanceRing
              label="Sick Leaves"
              total={summary?.allowances?.sick?.total || 0}
              used={summary?.allowances?.sick?.used || 0}
              remaining={summary?.allowances?.sick?.remaining || 0}
              accentColor="#2563eb"
              trackColor="#dbeafe"
            />
          </div>

          <EmployeesOnLeaveList
            selectedDate={summary?.selectedDate || ""}
            today={summary?.colleaguesOnLeave?.today || []}
            tomorrow={summary?.colleaguesOnLeave?.tomorrow || []}
          />

          <LeaveRequestHistory 
            requests={(summary?.requests || []).map(r => ({
              ...r,
              leaveDate: r.leaveDate || r.startDate // Support both naming conventions
            }))} 
            onDelete={handleDeleteLeave}
          />
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
        minDate={bounds.startDate}
        maxDate={bounds.endDate}
        onChange={(field, value) => {
          setForm((prev) => ({ ...prev, [field]: value }));
        }}
      />

      <ConfirmationAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
