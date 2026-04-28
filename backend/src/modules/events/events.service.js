// backend/src/modules/events/events.service.js
const { prisma } = require('../../config/db');

class EventsService {
    
    async getAllEvents() {
    const events = await prisma.$queryRaw`
        SELECT 
            id,
            title,
            description,
            category,
            priority,
            event_date,
            TO_CHAR(event_time, 'HH24:MI') as event_time,
            end_time,
            location,
            event_type,
            is_recurring,
            repeat_type,
            repeat_days,
            repeat_end_date,
            created_by,
            created_at
        FROM events
        ORDER BY event_date ASC, event_time ASC
    `;
    
    return events.map(event => ({
        ...event,
        id: Number(event.id)
    }));
}
    
    // Get nearest events for dashboard (within next 4 days)
    async getNearestEvents(limit = 4) {
        const events = await prisma.$queryRaw`
            SELECT 
                id,
                title,
                description,
                priority,
                event_date,
                event_time,
                end_time,
                location,
                event_type,
                CASE 
                    WHEN event_date = CURRENT_DATE THEN 'Today'
                    WHEN event_date = CURRENT_DATE + INTERVAL '1 day' THEN 'Tomorrow'
                    ELSE TO_CHAR(event_date, 'Mon DD')
                END as display_date,
                TO_CHAR(event_time, 'HH12:MI AM') as formatted_time
            FROM events
            WHERE event_date >= CURRENT_DATE
            ORDER BY event_date ASC, event_time ASC
            LIMIT ${limit}
        `;
        
        return events.map(event => ({
            ...event,
            id: Number(event.id)
        }));
    }
    
    // backend/src/modules/events/events.service.js - Fixed createEvent with time casting

async createEvent(data, createdBy) {
    const {
        title,
        description,
        category,
        priority,
        eventDate,
        eventTime,
        endTime,
        location,
        eventType,
        isRecurring,
        repeatType,
        repeatDays,
        repeatEndDate
    } = data;
    
    // Handle date conversion
    const formattedEventDate = eventDate ? new Date(eventDate).toISOString().split('T')[0] : null;
    const formattedRepeatEndDate = repeatEndDate ? new Date(repeatEndDate).toISOString().split('T')[0] : null;
    
    // Handle time conversion (ensure proper format)
    const formattedEventTime = eventTime ? `${eventTime}:00` : null;
    const formattedEndTime = endTime ? `${endTime}:00` : null;
    
    await prisma.$executeRaw`
        INSERT INTO events (
            title, description, category, priority, 
            event_date, event_time, end_time, location, 
            event_type, is_recurring, repeat_type, repeat_days, 
            repeat_end_date, created_by, created_at, updated_at
        ) VALUES (
            ${title}, ${description || null}, ${category || null}, ${priority || 'medium'},
            ${formattedEventDate}::date, ${formattedEventTime}::time, ${formattedEndTime}::time, ${location || null},
            ${eventType || 'general'}, ${isRecurring || false}, ${repeatType || null}, ${repeatDays || null},
            ${formattedRepeatEndDate ? `${formattedRepeatEndDate}::date` : null}, ${createdBy}, NOW(), NOW()
        )
    `;
    
    return { success: true, message: 'Event created successfully' };
}
    // Update event (HR only)
    async updateEvent(eventId, data, userId) {
        const {
            title,
            description,
            category,
            priority,
            eventDate,
            eventTime,
            endTime,
            location,
            eventType,
            isRecurring,
            repeatType,
            repeatDays,
            repeatEndDate
        } = data;
        
        // Check if event exists and user owns it
        const event = await prisma.$queryRaw`
            SELECT created_by FROM events WHERE id = ${eventId} LIMIT 1
        `;
        
        if (!event[0]) {
            throw new Error('Event not found');
        }
        
        if (event[0].created_by !== userId) {
            throw new Error('You can only edit your own events');
        }
        
        // Handle date conversion
        const formattedEventDate = eventDate ? new Date(eventDate).toISOString().split('T')[0] : null;
        const formattedRepeatEndDate = repeatEndDate ? new Date(repeatEndDate).toISOString().split('T')[0] : null;
        
        await prisma.$executeRaw`
            UPDATE events SET
                title = COALESCE(${title}, title),
                description = COALESCE(${description}, description),
                category = COALESCE(${category}, category),
                priority = COALESCE(${priority}, priority),
                event_date = COALESCE(${formattedEventDate}::date, event_date),
                event_time = COALESCE(${eventTime}, event_time),
                end_time = COALESCE(${endTime}, end_time),
                location = COALESCE(${location}, location),
                event_type = COALESCE(${eventType}, event_type),
                is_recurring = COALESCE(${isRecurring}, is_recurring),
                repeat_type = COALESCE(${repeatType}, repeat_type),
                repeat_days = COALESCE(${repeatDays}, repeat_days),
                repeat_end_date = COALESCE(${formattedRepeatEndDate ? `${formattedRepeatEndDate}::date` : null}, repeat_end_date),
                updated_at = NOW()
            WHERE id = ${eventId}
        `;
        
        return { success: true, message: 'Event updated successfully' };
    }
    
    // Delete event (HR only)
    async deleteEvent(eventId, userId) {
        // Check if event exists and user owns it
        const event = await prisma.$queryRaw`
            SELECT created_by FROM events WHERE id = ${eventId} LIMIT 1
        `;
        
        if (!event[0]) {
            throw new Error('Event not found');
        }
        
        if (event[0].created_by !== userId) {
            throw new Error('You can only delete your own events');
        }
        
        await prisma.$executeRaw`
            DELETE FROM events WHERE id = ${eventId}
        `;
        
        return { success: true, message: 'Event deleted successfully' };
    }
    
    // Get events by date range (for calendar view)
    async getEventsByDateRange(startDate, endDate) {
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
        
        const events = await prisma.$queryRaw`
            SELECT 
                id,
                title,
                description,
                event_date,
                event_time,
                end_time,
                location,
                event_type,
                priority
            FROM events
            WHERE event_date BETWEEN ${formattedStartDate}::date AND ${formattedEndDate}::date
            ORDER BY event_date ASC, event_time ASC
        `;
        
        return events.map(event => ({
            ...event,
            id: Number(event.id)
        }));
    }
}

module.exports = new EventsService();