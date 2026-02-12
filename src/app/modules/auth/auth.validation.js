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

// Register validation
const register = {
    body: z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        // .regex(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        //     "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        // ),
    }),
};

// Login validation
const login = {
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
};

module.exports = {
    register,
    login,
};
