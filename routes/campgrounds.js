const express = require ("express");
const router  = express.Router();
let Campground = require("../models/campground");
const middleware = require ("../middleware")

// ==============
// CAMPGROUNDS ROUTES
// ==============

// INDEX 
router.get ("/campgrounds", function(req, res) {
        Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log (err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds });
        }
    });
});
    
// CREATE
router.post ("/campgrounds", middleware.isLoggedIn, function (req, res){
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let author = { 
        id: req.user._id,
        username: req.user.username,
    };
    let newCampground = {name: name, image: image, description: description, author: author, price: price};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log (err);
        }
         else {
            req.flash ("success", "Campground added successfully!")
            res.redirect ("/campgrounds");
            console.log(newlyCreated);
        }
   } );
    
});

// NEW 
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render ("campgrounds/new");
});

// SHOW 
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get ("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function (err, foundCampground) {
            res.render ("campgrounds/edit", {campground: foundCampground});
    });
    
});

// UPDATE
router.put ("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res){
    console.log (req.body.campground)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updateCampground){
        if (err){
            res.redirect("/campgrounds")
        }
        else {
            res.redirect ("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete ("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove (req.params.id, function (err){
        if (err){
            res.redirect ("/campgrounds")
        }
        else
        {
            req.flash("success", "Successfully deleted Campground");
            res.redirect ("/campgrounds")
        }
    })
})




module.exports = router;