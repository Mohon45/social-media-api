const jwt = require("jsonwebtoken");

const clearCookies = (res) => {
    try {
        res.clearCookie("token", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("refreshToken", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });
        res.clearCookie("tokenExp", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("userId", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("roleId", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("status", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("teamId", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        res.clearCookie("role", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: "/",
        });

        return res;
    } catch (e) {
        console.log(e);
        return res;
    }
};

const createToken = (params, secret, expiresIn = null) => {
    const maxAge = 3 * 24 * 60 * 60;
    return jwt.sign({ ...params }, secret, {
        expiresIn: expiresIn ? expiresIn : maxAge,
    });
};

const addCookies = (res, cookiesData) => {
    res.cookie("tokenExp", "1", {
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    });

    res.cookie("token", cookiesData.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", cookiesData.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
    });

    res.cookie("userId", cookiesData.id, {
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
    });
    res.cookie("role", cookiesData.role, {
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
    });
};

module.exports = { clearCookies, createToken, addCookies };
