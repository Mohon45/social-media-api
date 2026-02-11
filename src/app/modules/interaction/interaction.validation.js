const { z } = require("zod");

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.string().optional(),
});

const mongoIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

const addComment = {
    params: mongoIdSchema,
    body: z.object({
        content: z
            .string()
            .min(1, "Content is required")
            .max(500, "Content must not exceed 500 characters"),
    }),
};

const likePost = {
    params: mongoIdSchema,
};
const getPostLikes = {
    params: mongoIdSchema,
};

const getPostComments = {
    params: mongoIdSchema,
    query: paginationSchema,
};

module.exports = {
    addComment,
    likePost,
    getPostLikes,
    getPostComments,
};
