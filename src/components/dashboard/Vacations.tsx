"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from "framer-motion";
import { Plus, RefreshCcw } from "lucide-react";
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
  selectedDate?: string;
  allowances?: {
    vacation?: { total?: number; used?: number; remaining?: number };
    sick?: { total?: number; used?: number; remaining?: number };
  };
  requests?: any[];
  colleaguesOnLeave?: { today?: any[]; tomorrow?: any[] };
};

export default function VacationsCalendar() {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'calendar'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Data State ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // --- Form State (Using the logic from your 2nd file) ---
  const [newLeave, setNewLeave] = useState({
    leave_type: 'vacation',
    start_date: '',
    end_date: '',
    reason: '',
  });

  // --- Fetching Logic ---
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch both endpoints in parallel for better performance
      const [empRes, dashRes] = await Promise.all([
        apiFetch('/vacations'),
        apiFetch(`/leaves/dashboard?date=${new Date().toISOString().split('T')[0]}`)
      ]);

      const empResult = await empRes.json();
      const dashResult = await dashRes.json();

      if (empResult.success) setEmployees(empResult.data);
      if (dashResult.success) setSummary(dashResult.data);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Leave Request Handler (The logic you liked from File 2) ---
  const handleCreateLeave = async () => {
    if (!newLeave.start_date || !newLeave.end_date) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch('/vacations/request', {
        method: 'POST',
        body: JSON.stringify(newLeave),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        setNewLeave({ leave_type: 'vacation', start_date: '', end_date: '', reason: '' });
        await fetchAllData(); // Refresh both the dashboard and the lists
        alert('Leave request submitted!');
      }
    } catch (error) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Math for Calendar ---
  const getLeaveCount = (empId: number, type: string) => {
    const emp = employees.find(e => e.id === empId);
    return emp?.leaves?.filter(l => l.leave_type === type && l.status === 'approved').length || 0;
  };

  const getLeaveForDay = (empId: number, day: number) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return null;
    const target = Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return emp.leaves?.find(l => {
      const s = new Date(l.start_date).getTime();
      const e = new Date(l.end_date).getTime();
      return target >= s && target <= e;
    }) || null;
  };

  if (loading && !summary) return <SkeletonLoading />;

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 gap-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Vacation Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {['dashboard', 'employees', 'calendar'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <LeaveBalanceRing
                label="Vacation Leaves"
                total={summary?.allowances?.vacation?.total || 0}
                used={summary?.allowances?.vacation?.used || 0}
                remaining={summary?.allowances?.vacation?.remaining || 0}
                accentColor="#0f766e" trackColor="#d8f3ef"
              />
              <LeaveBalanceRing
                label="Sick Leaves"
                total={summary?.allowances?.sick?.total || 0}
                used={summary?.allowances?.sick?.used || 0}
                remaining={summary?.allowances?.sick?.remaining || 0}
                accentColor="#2563eb" trackColor="#dbeafe"
              />
            </div>
            <EmployeesOnLeaveList
              selectedDate={summary?.selectedDate || ""}
              today={summary?.colleaguesOnLeave?.today || []}
              tomorrow={summary?.colleaguesOnLeave?.tomorrow || []}
            />
            <LeaveRequestHistory requests={summary?.requests || []} onDelete={fetchAllData} />
          </motion.div>
        )}

        {activeTab === 'employees' && (
          <VacationEmployeeList employees={employees} loading={loading} getLeaveCount={getLeaveCount} />
        )}

        {activeTab === 'calendar' && (
          <VacationCalendarView
            employees={employees}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            monthName={currentMonth.toLocaleString('default', { month: 'long' })}
            daysArray={Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }, (_, i) => i + 1)}
            getLeaveForDay={getLeaveForDay}
          />
        )}
      </div>

      {/* --- The Dialog/Modal from your 2nd File --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Request Leave</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in the details for your time off</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Type</label>
                <select
                  value={newLeave.leave_type}
                  onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="vacation">🌴 Vacation</option>
                  <option value="sick_leave">🤒 Sick Leave</option>
                  <option value="work_remotely">🏠 Work Remotely</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.start_date}
                    onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">End Date</label>
                  <input
                    type="date"
                    value={newLeave.end_date}
                    onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="Optional details..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreateLeave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}