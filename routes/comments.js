var express = require("express");
var router = express.Router({ mergeParams: true });
var Pillow = require("../models/pillow");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// NEW ROUTE - show form to create a new Pillow

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Pillow.findById(req.params.id, function(err, pillow) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { pillow: pillow });
        }
    });
});

// CREATE ROUTE - Pushing new comment to the database

router.post("/", middleware.isLoggedIn, function(req, res) {  
    Pillow.findById(req.params.id, function(err, pillow) {
        if (err) {
            console.log(err);
            res.redirect("/pillows/");
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong...")
                    console.log(err);
                }
                else {
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    pillow.comments.push(comment);
                    pillow.save();
                    req.flash("success", "Comment create successful.")
                    res.redirect('/pillows/' + pillow._id);
                  
                    
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err)
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { pillow_id: req.params.id, comment: foundComment });
        }
    });
});

// COMMENT UPDATE ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            console.log(req.params.comment_id);
            console.log(req.body.comment);
            console.log(updatedComment);
            res.redirect("/pillows/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong...")
            res.redirect("back");
        }
        else {
            console.log(err);
            req.flash("success", "Comment deleted.")
            res.redirect("/pillows/" + req.params.id);
        }
    })
})

module.exports = router;
