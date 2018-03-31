var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var Pillow = require("./models/pillow");
var Comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");

// REQUIRING PILLOWS ROUTES
	
var commentRoutes = require("./routes/comments"),
    pillowRoutes = require("./routes/pillows"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/fluffy-pillows");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Such a fine secret you have here!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/pillows/:id/comments", commentRoutes);
app.use("/pillows", pillowRoutes);

app.listen(8081, 'localhost', function() {
    console.log("Server is running on port 8081");
});