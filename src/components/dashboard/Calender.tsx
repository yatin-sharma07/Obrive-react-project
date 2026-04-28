'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'
import ProfileNotifications from '@app/(dashboard)/dashboard/employee/components/ProfileNotifications'

export default function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDuration, setNewEventDuration] = useState('1h')
  const [newEventTrend, setNewEventTrend] = useState('up')

  const [events, setEvents] = useState([
    {
      id: '1',
      title: "Anna's Birthday",
      start: '2026-04-09',
      allDay: true,
      extendedProps: { duration: '3h', trend: 'down', color: '#c084fc' } // purple
    },
    {
      id: '2',
      title: 'Presentation of the new...',
      start: '2026-04-17',
      allDay: true,
      extendedProps: { duration: '2h', trend: 'up', color: '#60a5fa' } // blue
    },
    {
      id: '3',
      title: "Ray's Birthday",
      start: '2026-04-29',
      allDay: true,
      extendedProps: { duration: '3h', trend: 'down', color: '#c084fc' } // purple
    }
  ])

  const openAddEventModal = (dateStr?: string) => {
    setSelectedDate(dateStr || new Date().toISOString().split('T')[0])
    setNewEventTitle('')
    setIsModalOpen(true)
  }

  // CREATE EVENT (Click on date)
  const handleDateClick = (arg: any) => {
    openAddEventModal(arg.dateStr)
  }

  const handleSaveEvent = () => {
    if (newEventTitle.trim()) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title: newEventTitle,
          start: selectedDate,
          allDay: true,
          extendedProps: { 
            duration: newEventDuration, 
            trend: newEventTrend, 
            color: newEventTrend === 'up' ? '#60a5fa' : '#c084fc' 
          }
        }
      ])
      setIsModalOpen(false)
    }
  }

  // DRAG & DROP
  const handleEventDrop = (info: any) => {
    setEvents(events.map(e =>
      e.id === info.event.id
        ? { ...e, start: info.event.startStr, end: info.event.endStr }
        : e
    ))
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
    <div className="flex-1 flex flex-col gap-4 h-full relative background-#F4F9FD;
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

          <div className="flex justify-end mb-2">
              <ProfileNotifications/>
          </div>

          <div className="flex items-center justify-between mb-2">

               <h1 className="text-3xl font-bold text-[#0f172a] ml-1">Calendar</h1> 

                <button 
                  onClick={() => openAddEventModal()}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Event
               </button>    
          </div>


      </div>

      <div className="flex-1 w-full bg-white rounded-xl shadow-sm overflow-hidden h-full p-2">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
              
              <div className="grid grid-cols-2 gap-4">
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
                    className="text-sm w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all"
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
                <div className="flex gap-4">
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
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEvent}
                disabled={!newEventTitle.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#3b82f6]/50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
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