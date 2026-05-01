"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from "framer-motion";
import { CalendarDays, RefreshCcw, Plus } from "lucide-react";
import { apiFetch } from '@/lib/api';

// --- Sub-Components (Assuming these paths are correct) ---
import SkeletonLoading from "@/components/SkelitonLoading";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import LeaveBalanceRing from "@app/(dashboard)/dashboard/employee/components/LeaveBalanceRing";
import EmployeesOnLeaveList from "@app/(dashboard)/dashboard/employee/components/EmployeesOnLeaveList";
import LeaveRequestHistory from "@app/(dashboard)/dashboard/employee/components/LeaveRequestHistory";
import LeaveApplicationDialog from "@app/(dashboard)/dashboard/employee/components/LeaveApplicationDialog";
import VacationEmployeeList from './VacationEmployeeList';
import VacationCalendarView from './VacationCalendarView';

// --- Interfaces ---
export interface Leave {
  id: number;
  user_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason?: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  userid: string;
  leaves: Leave[];
}

type LeaveSummary = {
  month?: { startDate?: string; endDate?: string };
  selectedDate?: string;
  allowances?: {
    vacation?: { total?: number; used?: number; remaining?: number };
    sick?: { total?: number; used?: number; remaining?: number };
  };
  requests?: any[];
  colleaguesOnLeave?: { today?: any[]; tomorrow?: any[] };
};

export default function VacationsCalendar() {
  // --- Shared State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'calendar'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Dashboard State (from first file) ---
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // --- List/Calendar State (from second file) ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Alert Config ---
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: undefined as (() => void) | undefined,
  });

  // --- Data Fetching: Dashboard ---
  const fetchDashboard = useCallback(async (date: string, silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      const response = await apiFetch(`/leaves/dashboard?date=${date}`);
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
        setSelectedDate(result.data.selectedDate);
      }
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // --- Data Fetching: Employees/Leaves ---
  const fetchEmployees = async () => {
    try {
      const response = await apiFetch('/vacations');
      
      const result = await response.json();
      if (result.success) setEmployees(result.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedDate);
    fetchEmployees();
  }, [fetchDashboard]);

  // --- Actions ---
  const handleApplyLeave = async (payload: any) => {
    try {
      const response = await apiFetch("/leaves/apply", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setDialogOpen(false);
        setAlertConfig({
          isOpen: true,
          title: "Success",
          description: "Request submitted!",
          type: "success",
          onConfirm: undefined
        });
        fetchDashboard(selectedDate);
        fetchEmployees();
      }
    } catch (err) {
      alert("Failed to submit request");
    }
  };

  const getLeaveCount = (employeeId: number, leaveType: string): number => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.leaves) return 0;
    return emp.leaves.filter(l => l.leave_type === leaveType && l.status === 'approved').length;
  };

  const getLeaveForDay = (employeeId: number, day: number): Leave | null => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee || !employee.leaves) return null;
    const targetDate = Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employee.leaves.find(leave => {
      const start = new Date(leave.start_date).getTime();
      const end = new Date(leave.end_date).getTime();
      return targetDate >= start && targetDate <= end;
    }) || null;
  };

  // --- Calendar Math ---
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (loading && !summary) return <SkeletonLoading />;

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vacations</h1>
          <p className="text-gray-500">Manage leave requests and track team availability</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit mb-6">
        {(['overview', 'employees', 'calendar'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Dashboard Filters/Stats */}
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
              requests={summary?.requests || []} 
              onDelete={() => fetchDashboard(selectedDate)} 
            />
          </motion.div>
        )}

        {activeTab === 'employees' && (
          <VacationEmployeeList 
            employees={employees} 
            loading={refreshing} 
            getLeaveCount={getLeaveCount} 
          />
        )}

        {activeTab === 'calendar' && (
          <VacationCalendarView
            employees={employees}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            monthName={monthName}
            daysArray={daysArray}
            getLeaveForDay={getLeaveForDay}
          />
        )}
      </div>

      {/* Shared Dialogs */}
      <LeaveApplicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleApplyLeave}
        submitting={refreshing}
        // Logic to pre-fill or handle state within Dialog
        minDate={summary?.month?.startDate}
        maxDate={summary?.month?.endDate}
      />

      <ConfirmationAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
}