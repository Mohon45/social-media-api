//https://github.com/omniti-labs/jsend
// {
//   status: success/fail/error
//   data: []/{}/''/null
//   message: ''/'something' - show only when error
// }

const httpResponse = (status, data, message) => {
    let respObj = {
        status, data, message
    };
    return respObj
};

module.exports = { httpResponse };
