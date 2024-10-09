const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();


const mongoUrl = process.env.MONGODB_URL;

// Check if mongoUrl is defined
if (!mongoUrl) {
  console.error("Error: MongoDB URL is not defined. Please check your .env file.");
  process.exit(1); 
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoose connected to the server"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); 
  });



  
const db = mongoose.connection;


db.on('connected', () => {
  console.log("Mongoose successfully connected to the server");
});

db.on('error', (err) => {
  console.error("Mongoose connection error:", err);
});

db.on('disconnected', () => {
  console.log("Mongoose disconnected from the server");
});

module.exports = db;
