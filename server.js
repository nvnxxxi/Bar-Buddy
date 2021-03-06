// server.js - Bar Buddy entry point and initialization file.
//
// This version of server.js is (nearly) generic for a server-client
// Web App with User Authentication via passport/express-session, 
// and a mySQL database behind the sequelize ORM.

//@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@
//@*@*@                                     @*@*@
//@*@*@      mySQL SETUP IS REQUIRED!       @*@*@
//@*@*@                                     @*@*@
//@*@*@  1. The repo has not given you a    @*@*@
//@*@*@     file with a mySQL password.     @*@*@
//@*@*@     In your repo directory, create  @*@*@
//@*@*@     file '.env' with:               @*@*@
//@*@*@     password=<your password>        @*@*@
//@*@*@                                     @*@*@
//@*@*@     Make sure your repo manager     @*@*@
//@*@*@     is ignoring file '.env'!        @*@*@
//@*@*@                                     @*@*@
//@*@*@  2. The username is 'root' in file  @*@*@
//@*@*@     './config/config.json'. Change  @*@*@
//@*@*@     to your username if different.  @*@*@
//@*@*@                                     @*@*@
//@*@*@  3. If you are using the app        @*@*@
//@*@*@     locally, you must first create  @*@*@
//@*@*@     mySQL database 'barbuddy_db'.   @*@*@
//@*@*@     No tables are needed.           @*@*@
//@*@*@                                     @*@*@
//@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@*@

//********************
//*   Dependencies   *
//********************

// Requiring necessary npm packages
const express = require('express');
const session = require('express-session');
// const checkModel = require('./config/checkModel.js');
// passport.js has been tailored for a 'Local' strategy
let passport = require('./config/passport.js');
var exphbs = require("express-handlebars");

//***************
//*   Startup   *
//***************

// HTTP port assignment; use environment variable if it exists.
let PORT = process.env.PORT ? process.env.PORT : 8080;

// load and run index.js in the ./models directory
let db = require('./models');

// Configure express
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Session specification - session is established on valid login
app.use(
  session({
    secret: 'profound keyphrase',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Register our route handlers
require('./routes/routes.js')(app);

// 'Sync' the ORM model with the database tables, on completion link to the HTTP service.
// during development, set force = true if you wish to destroy and re-create tables 
// on every run. force == false means the tables will only be created if they're absent.
// let force = false;

// after deployment, when process.env.PORT is non-zero, use force == false.
// force = process.env.PORT ? false : force;

db.sequelize.sync().then(() => {

  // checkModel();
  app.listen(PORT, () => {
    console.log(`Serving PORT ${PORT}`);
  });
});
