const express = require ("express");
const router  = express.Router();
const passport = require ("passport");
const User = require ("../models/user");
const middleware = require ("../middleware");

// HOME ROUTE
router.get ("/", function(req, res) {
    res.render ("landing");
});




//============
// AUTH ROUTES
//============

// REGISTER
router.get("/register", function(req, res) {
    res.render ("register");
});

router.post ("/register", function(req, res) {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash ("error", err.message);
            console.log (err)
            res.redirect("back")
            // return res.render ("register");
        } else {
        passport.authenticate("local")(req, res, function(){
            req.flash ("success", "Welcome to YelpCamp " + user.username);
            res.redirect ("/campgrounds");  
        });
        }
        });
    });

//LOGIN
router.get ("/login", function(req, res) {
    res.render ("login");
});

router.post ("/login",
    passport.authenticate("local",
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"})
    ,function(req, res) {
    
});

// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "Logged you out!!")
    res.redirect ("/campgrounds");
})



module.exports = router;