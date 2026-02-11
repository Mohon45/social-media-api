const { z } = require("zod");

// Common schemas
const paginationSchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.string().optional(),
});

const mongoIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

// Get notifications validation
const getNotifications = {
    query: paginationSchema,
};

// Mark notification as read validation
const markAsRead = {
    params: mongoIdSchema,
};

module.exports = {
    getNotifications,
    markAsRead,
};
