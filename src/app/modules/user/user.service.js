const httpStatus = require("http-status");
const User = require("./user.model");
const ApiError = require("../../../utils/ApiError");
const { get_query } = require("../../../utils/mongooseUtils");

const createUser = async (userBody, session = null) => {
    let options = session ? { session } : {};
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    if (await User.isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }

    const newUser = await User.create([userBody], options);

    return newUser[0];
};

const getUsers = async (query) => {
    let tempQuery = { ...query };
    const { data, meta, page, pageSize } = get_query(User, tempQuery);

    let [singlePageData, totalDocs] = await Promise.all([data, meta]);
    return {
        data: singlePageData,
        metaData: {
            page,
            totalPages: Math.ceil(totalDocs[0]?.count / pageSize),
            perPage: pageSize,
            total: totalDocs[0]?.count,
        },
    };
};

const getUserById = async (id) => {
    const result = await User.findOne({ _id: id });
    return result;
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
};
