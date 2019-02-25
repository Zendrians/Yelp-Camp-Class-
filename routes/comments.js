const express = require ("express");
const router  = express.Router();
let Campground = require("../models/campground");
let Comment    = require ("../models/comment");
const middleware = require ("../middleware");

// ==============
// COMMENT ROUTES
// ==============

// NEW
router.get ("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function (err, campground){
        if (err){
            console.log (err);
        }
        else {
            res.render ("comments/new", {campground: campground});  
        }
    })
 
});

// CREATE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if (err){
            console.log (err);
            res.redirect ("/campgrounds");
        }
        else {
            Comment.create (req.body.comment, function (err, comment){
                if (err){
                    req.flash ("error", "Something went wrong!");
                    console.log (err);
                }
                else{
                    //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully added comment")
               res.redirect('/campgrounds/' + campground._id);
                    
                }
            })
        }
    })
});

// EDIT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
    let campId = req.params.id;
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err){
            res.redirect ("back");
        } else {
            res.render ("comments/edit", {comment: foundComment, campId: campId});
        }
            
    });
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndUpdate (req.params.comment_id, req.body.comment, function (err, foundComment){
        if (err){
            res.render ("back");
        } else {
            res.redirect ("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete ("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndRemove (req.params.comment_id, function (err){
        if (err){
            res.redirect ("back");
        }
        else
        {
            req.flash("success", "Successfully deleted comment");
            res.redirect ("/campgrounds/" + req.params.id);
        }
    });
});




module.exports = router;