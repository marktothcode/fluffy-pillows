// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};
var Pillow = require("../models/pillow");
var Comment = require("../models/comment");

middlewareObj.checkPillowOwnership = function(req, res, next) {

    if (req.isAuthenticated()) {
        Pillow.findById(req.params.id, function(err, foundPillow) {
            if (err) {
                req.flash("error", "You don't have permission to do that.")
                res.redirect("back");
            }
            else {
                // CHECK IF AUTHOR IS THE SAME AS THE PERSON LOGGED IN (MONGOOSE METHOD)
                if (foundPillow.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You need to be logged in to do that.")
                    res.redirect("back");
                }
            }
        });
    }

    else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Pillow not found...")
                res.redirect("back");
            }
            else {
                // CHECK IF AUTHOR IS THE SAME AS THE PERSON LOGGED IN (MONGOOSE METHOD)
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    }

    else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that.")
    res.redirect("/login");
};


module.exports = middlewareObj;
