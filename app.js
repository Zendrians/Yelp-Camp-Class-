const express     = require ("express");
const app         = express ();
const bodyParser  = require ("body-parser");
const mongoose    = require ("mongoose");
const flash       = require ("connect-flash");
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require ("method-override");
const Campground    = require("./models/campground");
const Comment       = require ("./models/comment");
const User          = require ("./models/user");
const seedDB      = require("./seed");

const commentRoutes     = require ("./routes/comments");
const campgroundRoutes  = require ("./routes/campgrounds");
const indexRoutes       = require ("./routes/index")

// seedDB()
app.set ("view engine", "ejs");

let dataURL = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v2"
mongoose.connect(dataURL, { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v2', { useNewUrlParser: true });
// mongoose.connect('mongodb+srv://zendrian:xxxx@cluster0-a0vyb.mongodb.net/yelp_camp?retryWrites=true', { useNewUrlParser: true });

app.use (bodyParser.urlencoded({extended: true}));
app.use (express.static(__dirname + ("/public")));
app.use (methodOverride("_method"));
app.use (flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Summer",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser (User.serializeUser());
passport.deserializeUser (User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// requiring routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function (){
    console.log ("Yelp Server 'on'");
});