// backend/src/modules/events/events.controller.js
const eventsService = require('./events.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// Get all events (for calendar)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventsService.getAllEvents();
        successResponse(res, events, 'Events retrieved successfully');
    } catch (err) {
        errorResponse(res, err.message, 500);
    }
};

// Get nearest events (for dashboard)
exports.getNearestEvents = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 4;
        const events = await eventsService.getNearestEvents(limit);
        successResponse(res, events, 'Nearest events retrieved');
    } catch (err) {
        errorResponse(res, err.message, 500);
    }
};

// Create new event (HR only)
exports.createEvent = async (req, res) => {
    try {
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
        } = req.body;
        
        if (!title || !eventDate) {
            return errorResponse(res, 'Title and event date are required', 400);
        }
        
        const result = await eventsService.createEvent({
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
        }, req.user.id);
        
        successResponse(res, result, 'Event created successfully', 201);
    } catch (err) {
        errorResponse(res, err.message, 500);
    }
};

// Update event (HR only)
exports.updateEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const result = await eventsService.updateEvent(eventId, req.body, req.user.id);
        successResponse(res, result, 'Event updated successfully');
    } catch (err) {
        errorResponse(res, err.message, err.message === 'Event not found' ? 404 : 500);
    }
};

// Delete event (HR only)
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const result = await eventsService.deleteEvent(eventId, req.user.id);
        successResponse(res, result, 'Event deleted successfully');
    } catch (err) {
        errorResponse(res, err.message, err.message === 'Event not found' ? 404 : 500);
    }
};

// Get events by date range
exports.getEventsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return errorResponse(res, 'Start date and end date are required', 400);
        }
        
        const events = await eventsService.getEventsByDateRange(startDate, endDate);
        successResponse(res, events, 'Events retrieved successfully');
    } catch (err) {
        errorResponse(res, err.message, 500);
    }
};