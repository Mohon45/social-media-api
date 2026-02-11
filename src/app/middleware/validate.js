const { z } = require("zod");

const validate = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }

            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }

            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error?.errors?.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }

            return res.status(500).json({
                success: false,
                message: "Internal server error during validation",
            });
        }
    };
};

module.exports = validate;
