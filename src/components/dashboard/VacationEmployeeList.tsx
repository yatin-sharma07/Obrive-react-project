import React from 'react';
// Changed the import to match your new file name 'VacationsCalendar' if necessary
import { Employee } from './Vacations'; 

interface VacationEmployeeListProps {
  employees: Employee[];
  loading: boolean;
  getLeaveCount: (employeeId: number, leaveType: string) => number;
}

export default function VacationEmployeeList({ employees, loading, getLeaveCount }: VacationEmployeeListProps) {
  return (
    <div className="h-full flex-1 bg-white rounded-xl shadow-sm overflow-auto border border-gray-100">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-medium">Loading employee records...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-gray-400">
          <p className="font-medium">No employees found in the system</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between px-6 py-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50 group"
            >
              {/* Left: Profile Picture + Employee Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full bg-slate-50 flex-shrink-0 object-cover border border-gray-100"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-md font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {employee.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {employee.email}
                  </span>
                </div>
              </div>

              {/* Right: Leave Stats */}
              <div className="flex items-center gap-10 ml-4 flex-shrink-0">
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vacations</span>
                  <span className="text-lg font-black text-cyan-600">
                    {getLeaveCount(employee.id, 'vacation')}d
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sick Leave</span>
                  <span className="text-lg font-black text-red-500">
                    {getLeaveCount(employee.id, 'sick_leave')}d
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Remote</span>
                  <span className="text-lg font-black text-purple-600">
                    {getLeaveCount(employee.id, 'work_remotely')}d
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}