const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");

var indexRouter = require("./app/routes/index");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./app/middleware/error");

const app = express();

app.use(helmet());
app.use(compression());
app.use(xss());
app.use(mongoSanitize());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//cors
var whitelist = ["http://localhost:3000", "http://localhost:5000"];

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(
    cors({ origin: corsOptions, optionsSuccessStatus: 200, credentials: true }),
);
app.set("view engine", "ejs");

app.use("/api", indexRouter);

app.use("/", (req, res) => {
    res.send("Server is Running!");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
