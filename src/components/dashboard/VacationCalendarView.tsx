import React from 'react';
import { Employee, Leave } from './Vacations';

interface VacationCalendarViewProps {
  employees: Employee[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  monthName: string;
  daysArray: number[];
  getLeaveForDay: (employeeId: number, day: number) => Leave | null;
}



export default function VacationCalendarView({
  employees,
  currentMonth,
  setCurrentMonth,
  monthName,
  daysArray,
  getLeaveForDay,
}: VacationCalendarViewProps) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm  flex flex-col overflow-hidden max-h-full h-full">
      {/* Header Area */}
      <div className="flex bg-white">
        {/* Left Header - Employees Search */}
        <div className="w-[300px] flex-shrink-0 border-r border-gray-100 border-b border-gray-100 flex items-center justify-between p-4">
          <div className="text-[16px] font-bold text-gray-800">Employees</div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right Header - Calendar Focus Navigation */}
        <div className="flex-1 flex items-center justify-between py-3 px-6 border-b border-gray-100">
          <div />
          <div className="text-[14px] font-bold text-gray-800">First month ({monthName})</div>
          <div className="flex gap-3 text-blue-500">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="hover:text-blue-600 transition opacity-50 hover:opacity-100 font-bold">←</button>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="hover:text-blue-600 transition font-bold">→</button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex flex-1 overflow-auto relative scrollbar-hide">
        <div className="min-w-max flex flex-col">
          {/* Header Row (Sticky Header for Days AND empty top-left sticky intersection) */}
          <div className="flex sticky top-0 z-30 bg-white border-b border-gray-100 w-full pt-1 pb-1">
            {/* Top-left corner above employee list */}
            <div className="w-[300px] flex-shrink-0 sticky left-0 z-40 bg-white border-r border-[#f1f5f9]" />
            
            {daysArray.map((day) => (
              <div key={day} className="flex-shrink-0 w-[42px] flex flex-col items-center justify-center">
                <span className="text-[12px] font-bold text-[#8ba3b8]">{day}</span>
                <span className="text-[10px] text-gray-300 font-bold capitalize mt-[2px]">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    .toLocaleDateString('default', { weekday: 'short' })
                    .substring(0, 3)}
                </span>
              </div>
            ))}
          </div>

          {/* Employee Rows with Leave Blocks */}
          <div className="flex flex-col w-full">
            {employees.map((employee) => (
              <div key={employee.id} className="flex h-14 border-b border-[#f1f5f9] bg-white items-center hover:bg-gray-50 transition-colors">
                
                {/* Fixed Left Column - Employee Info */}
                <div className="w-[300px] flex-shrink-0 sticky left-0 z-20 bg-white group-hover:bg-gray-50 flex items-center gap-3 h-full px-6 border-r border-[#f1f5f9] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`}
                    alt={employee.name}
                    className="w-8 h-8 rounded-full bg-gray-100 object-cover"
                  />
                  <span className="text-[13px] font-medium text-gray-700 truncate">{employee.name}</span>
                </div>

                {/* Timeline Grid Cells */}
                {daysArray.map((day) => {
                  const leave = getLeaveForDay(employee.id, day);
                  
                  // Exact Colors from Figma
                  let colorStr = '#00bcd4'; // Cyan (Vacation)
                  if (leave?.leave_type === 'sick_leave') colorStr = '#ff4d4f'; // Light Red (Sick)
                  if (leave?.leave_type === 'work_remotely') colorStr = '#7a62db'; // Blue-Purple (Remote)
                  
                  const isApproved = leave?.status === 'approved';

                  return (
                    <div
                      key={`${employee.id}-${day}`}
                      className="flex-shrink-0 w-[42px] h-full flex items-center justify-center relative p-[2px]"
                    >
                      {/* Empty faint background cell block */}
                      <div className="absolute w-[36px] h-[38px] rounded-[6px] bg-[#f8fafc]"></div>
                      
                      {/* Colored Leave Overlay */}
                      {leave && (
                        <div
                          className="absolute w-[38px] h-[40px] rounded-[8px] z-10 shadow-sm transition hover:scale-105 cursor-pointer"
                          style={{
                            backgroundColor: isApproved ? colorStr : '#fff',
                            border: isApproved ? 'none' : `1.5px solid ${colorStr}`
                          }}
                          title={`${employee.name} - ${leave.leave_type.replace('_', ' ').toUpperCase()}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Area */}
      <div className="flex items-center gap-24 px-8 py-5 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] text-gray-500 font-medium">Sick Leave</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#ff4d4f]"></div>
              <span className="text-[12px] text-gray-800 font-medium">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-[#ff4d4f] bg-transparent"></div>
              <span className="text-[12px] text-gray-800 font-medium">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[12px] text-gray-500 font-medium">Work remotely</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#7a62db]"></div>
              <span className="text-[12px] text-gray-800 font-medium">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-[#7a62db] bg-transparent"></div>
              <span className="text-[12px] text-gray-800 font-medium">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[12px] text-gray-500 font-medium">Vacation</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#00bcd4]"></div>
              <span className="text-[12px] text-gray-800 font-medium">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-[#00bcd4] bg-transparent"></div>
              <span className="text-[12px] text-gray-800 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
