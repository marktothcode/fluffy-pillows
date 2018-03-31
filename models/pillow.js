// SCHEMA SETUP
var mongoose = require("mongoose");
var pillowSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    

    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",        
    }]
});

module.exports = mongoose.model("pillow", pillowSchema);
