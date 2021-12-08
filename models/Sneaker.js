const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var SneakerSchema = new Schema({
    shoeName: String,
    brand: String,
    silhoutte: String,
    styleID: String, 
    retailPrice: Number,
    releaseDate: String,
    description: String,
    imageLinks: [String],
    thumbnail: String,
    urlKey: String,
    make: String,
    goatProductId: Number,
    colorway: String,
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
    },
    resellPrices:{
        stockX: {},
        goat: {},
        stadiumGoods: {},
        flightClub: {}
    }

});

var Sneaker = mongoose.model("Sneaker", SneakerSchema);

module.exports = Sneaker;