const Sneaker = require('../models/Sneaker');
const request = require('request');
const stockXScraper = require('../scrapers/stockx-scraper');
const flightClubScraper = require('../scrapers/flightclub-scraper');
const goatScraper = require('../scrapers/goat-scraper');
const stadiumGoodsScraper = require('../scrapers/stadiumgoods-scraper');


exports.findOne = (req, res) => {
  let shoeID = req.params.id;

  Sneaker.findOne({
    styleID: shoeID
  }, function (err, shoe) {
    if (err) {
      console.log(err);
      res.send(err);
    }

    res.json(shoe);
  });
};

exports.create = async function (req, res) {
  if (!req.params) {
    return res.status(400).send({
      message: "Shoe parameters can not be empty"
    });
  }
  getProducts(req.params.shoe, function (error, products) {
    if (error) {
      res.send("Product Not Found");
    } else {
      res.json(products);
    }
  });
};



exports.findOneWithPrices = (req, res) => {
  let shoeID = req.params.id;


  Sneaker.findOne({
    styleID: shoeID
  }, function (err, shoe) {
    if (!shoe || err) {
      console.log(new Error("Sneaker not found in database"));
      getProducts(shoeID);
    }
 


   console.time('StockX Price')
    stockXScraper.getPrices(shoe, function () {
      console.timeEnd('StockX Price')
      console.time('SG Price')
      stadiumGoodsScraper.getPrices(shoe, function () {
        console.timeEnd('SG Price')
        console.time('FC Price')
        
      
        flightClubScraper.getPrices(shoe, function () {
          console.timeEnd('FC Price')
          console.time('Goat Price')
          

          goatScraper.getPrices(shoe, function () {
            console.timeEnd('Goat Price')


            res.json(shoe);

          });
        });
      });
    });

  });

  Sneaker.find({
    styleID: shoeID
  }).then(sneaks => {
  });
};

exports.findAll = (req, res) => {
  Sneaker.find()
    .then(sneaks => {
      res.send(sneaks);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sneakers."
      });
    });

};


exports.getMostPopular = (req, res) => {

  stockXScraper.getProductsAndInfo("", function (error, products) {
    if (error) {
      res.send("Product Not Found");
    } else {
      
      res.send(products);
    }
  });


};

var findSneakerById = function (sneakerId, done) {
  Sneaker.find({
    styleID: sneakerId
  }, (err, data) => {
    if (err) return done(err)
    return done(null, data)
  })

};



var getProducts = function (keyword, callback) {
  var ct = 0;
  console.time('stockX')
  stockXScraper.getProductsAndInfo(keyword, function (error, products) {
console.timeEnd('stockX')
console.time('total')
    products.forEach(function (shoe) {
   
      flightClubScraper.getLink(shoe, function () {
       
        goatScraper.getLink(shoe, function () {

          stadiumGoodsScraper.getLink(shoe, function (err) {
           
            if (err) {
              // console.log(err);
            }
            
          


            Sneaker.countDocuments({
              styleID: shoe.styleID
            }, function (err, count) {

              if (count <= 0) {
                shoe.save()
              }

              //if all shoes links have been parsed then return
              if (ct++ + 1 == products.length){ 
                console.timeEnd('total')
                callback(null, products);}

            });

          });

        });


      });

    });
    
  });


}
