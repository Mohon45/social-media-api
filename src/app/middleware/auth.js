const jwt = require("jsonwebtoken");
const { httpResponse } = require("../../utils/httpResponse");
const httpStatus = require("http-status");
const { createToken } = require("../../utils/authUtils");

const checkRefreshToken = (token) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, userDecoded) => {
        if (err) {
            console.log("Refresh token expired or not valid!");
            return null;
        }
        return userDecoded;
    });
};

const auth = {
    verifyToken: (req, res, next) => {
        let authToken = req.cookies.token;
        let refreshToken = req.cookies.refreshToken;
        if (
            req.headers["user-agent"] === "ios" ||
            req.headers["user-agent"] === "android"
        ) {
            authToken = req.headers.authorization.split("token")[1]?.slice(1);
            refreshToken = req.headers.authorization
                .split("token")[2]
                ?.slice(1);
        }

        const token = authToken;
        if (token === undefined) {
            const err = new Error(
                JSON.stringify(
                    httpResponse("error_auth", {}, "User not logged in."),
                ),
            );
            err.status = 401;
            return next(err);
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                let userDecoded = checkRefreshToken(refreshToken);
                if (userDecoded !== null) {
                    let accessToken = createToken(
                        userDecoded,
                        process.env.ACCESS_TOKEN_SECRET,
                        "2h",
                    );

                    req.user = userDecoded;

                    res.cookie("tokenExp", "1", {
                        sameSite: "strict",
                        secure: true,
                        path: "/",
                        expires: new Date(
                            new Date().getTime() + 12 * 60 * 60 * 1000,
                        ),
                    });

                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                        path: "/",
                        expires: new Date(
                            new Date().getTime() + 12 * 60 * 60 * 1000,
                        ),
                    });

                    next();
                } else {
                    const err = new Error(
                        JSON.stringify(
                            httpResponse("error_auth", {}, "Token expired."),
                        ),
                    );
                    err.status = 403;
                    return next(err);
                }
            } else {
                req.user = user;
                next();
            }
        });
    },
    checkPermission: (req, res, next) => {
        const authToken = req.cookies.token;
        const token = authToken;
        if (token === null) return res.sendStatus(httpStatus.UNAUTHORIZED);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    },
};

module.exports = auth;
