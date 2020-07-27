const Sneaker = require('../models/Sneaker');
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

exports.getProductPrices = (req, res) => {
  let shoeID = req.params.id;
  Sneaker.findOne({
    styleID: shoeID
  }, function (err, shoe) {
    if (!shoe || err) {
      console.log(new Error("Sneaker not found in database"));
      getProducts(shoeID);
    }
    console.time('async')
    var cbCounter = 0;
    stockXScraper.getPrices(shoe, function () {
      cbCounter++;
      if (cbCounter == 4) {
        console.log("FINISHED GRABBING SNEAKERS")
        console.timeEnd('async')
        res.json(shoe);
      }

    });
    stadiumGoodsScraper.getPrices(shoe, function () {
      cbCounter++;
      if (cbCounter == 4) {
        console.log("FINISHED GRABBING SNEAKERS")
        console.timeEnd('async')
        res.json(shoe);
      }

    });
    flightClubScraper.getPrices(shoe, function () {
      cbCounter++;
      if (cbCounter == 4) {
        console.log("FINISHED GRABBING SNEAKERS")
        console.timeEnd('async')
        res.json(shoe);
      }

    });
    goatScraper.getPrices(shoe, function () {
      cbCounter++;
      if (cbCounter == 4) {
        console.log("FINISHED GRABBING SNEAKERS")
        console.timeEnd('async')
        res.json(shoe);
      }

    });

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
  getProducts("", function (error, products) {
    if (error) {
      res.send("Product Not Found");
    } else {
      res.json(products);
    }
  });


};


var getProducts = function (keyword, callback) {
  var productCounter = 0;
 
  stockXScraper.getProductsAndInfo(keyword, function (error, products) {
    console.time('total')
    products.forEach(function (shoe) {
      var cbCounter = 0;
     
       
      flightClubScraper.getLink(shoe, function () {
        if(++cbCounter == 3){
          Sneaker.countDocuments({
            styleID: shoe.styleID
          }, function (err, count) {
            if (count <= 0) {
              shoe.save()
            }
            //if all shoes links have been parsed then return
            if (productCounter++ + 1 == products.length) {
              callback(null, products);
            }
          });
        }
      });
      stadiumGoodsScraper.getLink(shoe, function () {
        if(++cbCounter == 3){
          Sneaker.countDocuments({
            styleID: shoe.styleID
          }, function (err, count) {
            if (count <= 0) {
              shoe.save()
            }
            //if all shoes links have been parsed then return
            if (productCounter++ + 1 == products.length) {
              callback(null, products);
            }
          });
        }
      });
      goatScraper.getLink(shoe, function (){
        goatScraper.getPictures(shoe, function () {
          if(++cbCounter == 3){
            Sneaker.countDocuments({
              styleID: shoe.styleID
            }, function (err, count) {
              if (count <= 0) {
                shoe.save()
              }
              //if all shoes links have been parsed then return
              if (productCounter++ + 1 == products.length) {
                callback(null, products);
              }
            });
          }
        });

      });


    });

  });



}


