'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import VacationEmployeeList from './VacationEmployeeList'
import VacationCalendarView from './VacationCalendarView'

// --- Interfaces ---
export interface Leave {
  id: number
  user_id: number
  leave_type: string
  start_date: string
  end_date: string
  status: string
  reason?: string
}

export interface Employee {
  id: number
  name: string
  email: string
  userid: string
  leaves: Leave[]
}

export default function VacationsCalendar() {
  // --- State ---
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Set to actual current date
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'employees' | 'calendar'>('employees')
  const [loading, setLoading] = useState(false)
  
  const [newLeave, setNewLeave] = useState({
    leave_type: 'vacation',
    start_date: '',
    end_date: '',
    reason: '',
  })

  // --- Data Fetching ---
  const fetchVacations = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/vacations')
      if (!response.ok) throw new Error('Failed to load vacations')
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Ensure we handle the nested structure from Prisma
        setEmployees(result.data)
      }
    } catch (error) {
      console.error('Failed to load vacations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  // --- Helper Functions ---

  /**
   * CRITICAL: Matches a calendar day with leave records.
   * Uses UTC to prevent timezone shifts (Prisma/Postgres default).
   */
  const getLeaveForDay = (employeeId: number, day: number): Leave | null => {
    const employee = employees.find(e => e.id === employeeId)
    if (!employee || !employee.leaves) return null

    return employee.leaves.find(leave => {
      const start = new Date(leave.start_date)
      const end = new Date(leave.end_date)
      
      // Target date in UTC at midnight
      const targetDate = Date.UTC(
        currentMonth.getFullYear(), 
        currentMonth.getMonth(), 
        day
      )

      // Range boundaries in UTC at midnight
      const startDate = Date.UTC(
        start.getUTCFullYear(), 
        start.getUTCMonth(), 
        start.getUTCDate()
      )
      const endDate = Date.UTC(
        end.getUTCFullYear(), 
        end.getUTCMonth(), 
        end.getUTCDate()
      )

      return targetDate >= startDate && targetDate <= endDate
    }) || null
  }

  const getLeaveCount = (employeeId: number, leaveType: string): number => {
    const employee = employees.find(e => e.id === employeeId)
    if (!employee || !employee.leaves) return 0
    
    // Count days based on start/end range for approved leaves
    return employee.leaves
      .filter(l => l.leave_type === leaveType && l.status === 'approved')
      .reduce((acc, l) => {
        const diff = new Date(l.end_date).getTime() - new Date(l.start_date).getTime()
        return acc + (Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
      }, 0)
  }

  const handleCreateLeave = async () => {
    if (!newLeave.start_date || !newLeave.end_date) {
      alert('Please select both start and end dates')
      return
    }

    try {
      setLoading(true)
      const response = await apiFetch('/vacations/request', {
        method: 'POST',
        body: JSON.stringify(newLeave),
      })

      const result = await response.json()
      if (result.success) {
        setIsModalOpen(false)
        setNewLeave({
          leave_type: 'vacation',
          start_date: '',
          end_date: '',
          reason: '',
        })
        await fetchVacations() // Refresh data
        alert('Leave request submitted!')
      }
    } catch (error) {
      console.error('Request Error:', error)
      alert('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  // --- Calendar Math ---
  const monthName = currentMonth.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="flex-1 flex flex-col gap-4 h-full bg-gray-50">
      {/* Page Title & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Vacations</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'employees' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Employees List
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'calendar' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {loading && employees.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Loading data...</div>
        ) : activeTab === 'employees' ? (
          <VacationEmployeeList
            employees={employees}
            loading={loading}
            getLeaveCount={getLeaveCount}
          />
        ) : (
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

      {/* Add Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Request Leave</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in the details for your time off</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                <select
                  value={newLeave.leave_type}
                  onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="vacation">🌴 Vacation</option>
                  <option value="sick_leave">🤒 Sick Leave</option>
                  <option value="work_remotely">🏠 Work Remotely</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.start_date}
                    onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    value={newLeave.end_date}
                    onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason</label>
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
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLeave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}