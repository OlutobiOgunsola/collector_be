const express = require("express");
const session = require('express-session');
const cors = require("cors");
// const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const passport = require('passport')

const MongoStore = require('connect-mongo');
 
//CONFIGURE DOTENV
dotenv.config();

const { AppRouter } = require("./src/Router");
const { connectDB } = require("./src/Model");

const app = express();

const PORT = process.env.PORT || 5000;

const whiteList =   ['https://datacollector.netlify.app', 'http://localhost:3000', 'http://localhost:3001']
app.use(cors({
  credentials: true,
  origin: whiteList
}));

//CONFIGURE SESSION DATA
const appSession = {
  store: new MongoStore({
   mongoUrl: process.env.DATABASE_URL,
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: `${ process.env.NODE_ENV === 'production'}`,
    maxAge: 1000 * 60 * 24
  }
}

app.use(session(appSession))

app.use(passport.initialize());
app.use(passport.session());

// use express json
app.use(express.json());

//CONFIGURE ROUTESs
app.use("/api/v1/", new AppRouter ());

app.use("*", (req, res, next) => {
  return res.status(404).json({
    message: "failure",
    error: "Resource not found",
  });
});

connectDB().then(async () => {
  app.listen(PORT, (req, res) => {
    console.log(`App connected to DB and listening on ${PORT}`);
  });
});
