const { z } = require("zod");

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.string().optional(),
});

const mongoIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

// Create user validation
const createUser = {
    body: z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Email is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            ),
        role: z.enum(["admin", "user"]).optional().default("user"),
        profileImage: z.string().url().optional(),
    }),
};

const getUsers = {
    query: paginationSchema,
};

const getUser = {
    params: mongoIdSchema,
};

module.exports = {
    createUser,
    getUsers,
    getUser,
};
