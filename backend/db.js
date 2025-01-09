// connection to database using mongoose
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/";

const connectToMongo = async()=>{
  await mongoose.connect(mongoURI);
  console.log("Connection to mongodb successfully")
}

module.exports = connectToMongo;