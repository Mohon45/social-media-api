var mongoose = require("mongoose");
const connectionString = process.env.USE_LOCAL_DB === "true" ? process.env.LOCAL_DATABASE : process.env.ATLAS_URI;

let connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    try {
      mongoose.connect(connectionString, connectOptions, () => {
        console.log("Local DB: ", process.env.USE_LOCAL_DB);
        console.log("Connection to MongoDB established");
        dbConnection = mongoose.connection;
        return callback();
      });
    } catch (error) {
      return callback(error);
    }
  },
  getDb: function () {
    return dbConnection;
  },
};
