'use client'
import { useEffect } from 'react';
import { apiFetch } from '@/lib/api'; // Or use your relative path

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'
// import ProfileNotifications from '@app/(dashboard)/dashboard/employee/components/ProfileNotifications'

export default function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDuration, setNewEventDuration] = useState('1h')
  const [newEventTrend, setNewEventTrend] = useState('up')

  // 1. Keep your state but start with an empty array
  const [events, setEvents] = useState<any[]>([])

  // 2. Create a function to fetch tasks from the backend
  const fetchCalendarTasks = async () => {
    try {
      // Calls your new backend route
      const response = await apiFetch('/calendar/tasks');
      const result = await response.json();

      if (result.success && result.data) {
        // 3. Map your Postgres 'tasks' to FullCalendar 'Event' format
        const formattedEvents = result.data.map((task: any) => ({
          id: String(task.id),
          title: task.title,
          start: task.deadline, // Use the deadline field from your database
          allDay: true, // You can configure this based on your database times
          extendedProps: { 
            duration: '1h', // Default fallback
            trend: task.status === 'completed' ? 'up' : 'down', 
            color: task.status === 'completed' ? '#60a5fa' : '#c084fc' 
          }
        }));
        
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Failed to load calendar tasks:", error);
    }
  };

  // 4. Fetch the events when the component loads
  useEffect(() => {
    fetchCalendarTasks();
  }, []);

    useEffect(() => {
    fetchCalendarTasks();
  }, []);

  const openAddEventModal = (dateStr?: string) => {
    setSelectedDate(dateStr || new Date().toISOString().split('T')[0])
    setNewEventTitle('')
    setIsModalOpen(true)
  }

  // CREATE EVENT (Click on date)
  const handleDateClick = (arg: any) => {
    openAddEventModal(arg.dateStr)
  }


    const handleSaveEvent = async () => {
    if (!newEventTitle.trim()) return
    
    try {
      const response = await apiFetch('/calendar/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: newEventTitle,
          deadline: selectedDate,
          status: 'pending'
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setEvents([...events, {
          id: String(result.data.id),
          title: newEventTitle,
          start: selectedDate,
          allDay: true,
          extendedProps: { status: 'pending', color: '#c084fc' }
        }])
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  // DRAG & DROP
  const handleEventDrop = async (info) => {
    try {
      const response = await apiFetch(`/calendar/tasks/${info.event.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          deadline: info.event.startStr
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Update local state
        setEvents(events.map(e =>
          e.id === info.event.id
            ? { ...e, start: info.event.startStr }
            : e
        ))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const renderEventContent = (eventInfo: any) => {
    const { duration, trend, color } = eventInfo.event.extendedProps || {};
    
    return (
      <div style={{ borderLeftColor: color || '#60a5fa', borderLeftWidth: '3px' }} className="flex flex-col p-1.5 bg-[#f4f6f8] rounded-[4px] w-full overflow-hidden">
        <div className="font-semibold text-xs text-gray-800 truncate leading-tight tracking-tight">
          {eventInfo.event.title}
        </div>
        {duration && (
          <div className="text-[10px] text-gray-500 font-medium flex items-center mt-1">
            {duration} 
            {trend === 'up' ? (
              <svg className="w-3 h-3 text-yellow-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            ) : (
              <svg className="w-3 h-3 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col gap-4 p-3 sm:p-4
">
      
      <style>{`
        .fc .fc-toolbar.fc-header-toolbar {
          padding: 0rem;
          margin:0.4rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 1rem;
        }
        .fc .fc-toolbar-chunk {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .fc .fc-button-group {
          display: flex;
          align-items: center;
        }
        .fc .fc-button-primary {
          background-color: transparent !important;
          border: none !important;
          color: #3b82f6 !important;
          box-shadow: none !important;
          padding: 0.25rem 0.5rem;
        }
        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled):hover {
          background-color: #eff6ff !important;
          color: #2563eb !important;
        }
        .fc .fc-button .fc-icon {
          font-size: 1.25rem;
        }
        .fc-theme-standard th {
          background: white;
          font-weight: 800;
          color: #64748b;
          font-size: 0.875rem;
          text-align: left;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #f1f5f9;
        }
        .fc .fc-daygrid-day-top {
          flex-direction: row;
          padding: 0.75rem;
        }
        .fc .fc-daygrid-day-number {
          padding: 0;
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        .fc .fc-daygrid-day-events {
          padding: 0 0.5rem 0.5rem 0.5rem !important;
        }
        .fc-col-header-cell-cushion {
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          font-size: 0.rem;
        }
        .fc .fc-day-today {
          background-color: #fafafa !important; // day color
        }
        .fc-h-event {
          background-color: transparent !important;
          border: transparent !important;
        }
      `}</style>
      
      <div className=' '>

          {/* <div className="flex justify-end mb-2">
              <ProfileNotifications/>
          </div> */}

          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

               <h1 className="ml-1 text-2xl font-bold text-[#0f172a] sm:text-3xl">Calendar</h1> 

                <button 
                  onClick={() => openAddEventModal()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#074139] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#154e47] sm:w-auto cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Event
               </button>    
          </div>


      </div>

      <div className="h-[70vh] min-h-[520px] w-full flex-1 overflow-hidden rounded-xl bg-white p-2 shadow-sm md:h-full">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: '',
              center: 'prev title next',
              right: ''
            }}
            editable={true} // drag & resize
            selectable={true}
            events={events}
            dateClick={handleDateClick} // create event
            eventDrop={handleEventDrop} // drag
            eventContent={renderEventContent} // custom render
            height="100%"
            dayHeaderFormat={{ weekday: 'short' }} // "Mon", "Tue"
        />
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="text-sm fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Event</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all"
                  placeholder="e.g. Design Sync"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select 
                    value={newEventDuration}
                    onChange={(e) => setNewEventDuration(e.target.value)}
                    className="text-sm w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#074139] outline-none transition-all"
                  >
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="2h">2 hours</option>
                    <option value="3h">3 hours</option>
                    <option value="All Day">All Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend / Priority</label>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg flex-1 hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="trend" 
                      value="up" 
                      checked={newEventTrend === 'up'}
                      onChange={() => setNewEventTrend('up')}
                      className="text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      Blue / Up
                      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg flex-1 hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="trend" 
                      value="down" 
                      checked={newEventTrend === 'down'}
                      onChange={() => setNewEventTrend('down')}
                      className="text-[#c084fc] focus:ring-[#c084fc]"
                    />
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      Purple / Down
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEvent}
                disabled={!newEventTitle.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-[#074139] hover:bg-[#154e47] disabled:bg-[#074139]/50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
