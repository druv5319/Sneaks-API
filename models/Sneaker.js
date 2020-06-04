const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var SneakerSchema = new Schema({
    shoeName: String,
    brand: String,
    silhoutte: String,
    styleID: String, 
    retailPrice: Number,
    description_html: String,
    imageLinks: [String],
    urlKey: String,
    resellLinks:{
        stockX: String,
        stadiumGoods: String,
        goat: String,
        flightClub: String
    },
    size: Number,
    lowestResellPrice:{
        stockX: Number,
        stadiumGoods: Number,
        goat: Number,
        flightClub: Number
    }

});

var Sneaker = mongoose.model("Sneaker", SneakerSchema);

module.exports = Sneaker;