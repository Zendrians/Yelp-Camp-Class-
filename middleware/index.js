const Campground = require ("../models/campground.js");
const Comment = require ("../models/comment.js");


let middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function  (req, res, next){
    if (req.isAuthenticated()){
         Campground.findById(req.params.id, function (err, foundCampground) {
                if (err){
                    req.flash("error", "Campground not found")
                    res.redirect ("back");
                } else {
                    // if (foundCampground.author.id == req.user.id){
                    if (foundCampground.author.id.equals(req.user._id)){
                        next ();
                    } else {
                        req.flash ("error", "Created by a different User")
                        res.redirect("back");
                    }
                }
         });
    } else {
        req.flash ("error", "You need to Login to do that!")
        res.redirect ("back")
    }
};

middlewareObject.checkCommentOwnership = function (req, res, next){
    if (req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err){
                    req.flash("error", "Comment not found")
                    res.redirect ("back");
                } else {
                    // if (foundCampground.author.id == req.user.id){
                    if (foundComment.author.id.equals(req.user._id)){
                        next ();
                    } else {
                        req.flash ("error", "Created by a different User")
                        res.redirect("back");
                    }
                }
         });
    } else {
        req.flash ("error", "You need to Login to do that!")
        res.redirect ("back")
    }
};

middlewareObject.isLoggedIn = function  (req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash ("error", "You need to Login to do that!");
        res.redirect ("/login");
    };
    




module.exports = middlewareObject