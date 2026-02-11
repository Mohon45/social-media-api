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

// Create post validation
const createPost = {
    body: z.object({
        content: z
            .string()
            .min(1, "Content is required")
            .max(1000, "Content must not exceed 1000 characters"),
    }),
};

// Get posts validation (pagination)
const getPosts = {
    query: paginationSchema,
};

// Update post validation
const updatePost = {
    params: mongoIdSchema,
    body: z.object({
        content: z
            .string()
            .min(1, "Content is required")
            .max(1000, "Content must not exceed 1000 characters"),
    }),
};

// Get/Delete post by ID validation
const postById = {
    params: mongoIdSchema,
};

module.exports = {
    createPost,
    getPosts,
    updatePost,
    postById,
};
