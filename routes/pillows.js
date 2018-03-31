var express = require("express");
var router = express.Router();
var Pillow = require("../models/pillow");
var middleware = require("../middleware");

router.get("/", function(req, res) {

    Pillow.find({}, function(err, allPillows) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("pillows/index", { pillows: allPillows, currentUser: req.user });
        }
    });


    // res.render("pillows", {pillows:pillows});


});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("pillows/new");
});

// CREATE ROUTE

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;
    var image = req.body.image;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPillow = { name: name, image: image, description: desc, author: author, price: price };

    Pillow.create(newPillow, function(err, NewlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(NewlyCreated); SHOW IN TERMINAL
            res.redirect("/pillows");
        }
    });
});

// SHOW ROUTE

router.get("/:id", function(req, res) {
    Pillow.findById(req.params.id).populate("comments").exec(function(err, foundPillow) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(foundPillow); SHOW IN TERMINAL
            res.render("pillows/show", { pillow: foundPillow });
        }
    });
});

// EDIT ROUTE

router.get("/:id/edit", middleware.checkPillowOwnership, function(req, res) {
    Pillow.findById(req.params.id, function(err, foundPillow) {
        if (err) {
            req.flash("error", "Pillow not found...");
        }
        res.render("pillows/edit", { pillow: foundPillow });
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkPillowOwnership, function(req, res) {

    Pillow.findByIdAndUpdate(req.params.id, req.body.pillow, function(err, updatedPillow) {
        if (err) {
            res.redirect("/pillows");
        }
        else {
            res.redirect("/pillows/" + req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/:id", middleware.checkPillowOwnership, function(req, res) {
    Pillow.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/pillows");
        }
        else {
            res.redirect("/pillows");
        }
    });
});

module.exports = router;
