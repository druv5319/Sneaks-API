const Sneaker = require('../models/Sneaker');
const values = require('lodash/values');
const request = require('request');
const stockXScraper = require('../scrapers/stockx-scraper');
const flightclubScraper = require('../scrapers/flightclub-scraper')
var options = {
    url: "",
    headers: {
      'User-Agent': 'comp'
    }
  };
exports.create = async function(req, res) {
    if(!req.params) {
        return res.status(400).send({
            message: "Shoe parameters can not be empty"
        });
    }
    stockXScraper.getProducts(req.params.shoe, options, function(error, products){
        if(error){
         res.send("Product Not Found");
       }
       else{ 
         res.json(products);
       }
     });

};


exports.findOneWithSize = (req, res) => {
    let shoeID = req.params.id;
    let size = req.query.size


 console.log(req.params);
  Sneaker.findOne({styleID: shoeID}, function(err, docs){
    if(!docs){
      console.log("ERROR");
      
    }
    console.log(docs);
    res.json(docs);


  });

    Sneaker.find({styleID: shoeID}).then(sneaks=> {console.log(sneaks)});
   // console.log(Sneaker.find())
    /*options.url = 'https://stockx.com/api/products/' + shoe + '?includes=market';
    request(options, function (error, response, data) {
  
      if (!error) {
        var json = JSON.parse(data);
        const product = values(json.Product.children).find(o => o.shoeSize == size)
      
      
        let shoe = new Sneaker({
          shoeName: json.Product.title,
          size: size,
          lowestResellPrice: {
            stockX: product.market.lowestAsk
          },        
        })
        
        res.send(shoe);
      }
  
    });*/

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
  stockXScraper.getProducts("", options, function(error, products){
    if(error){
     res.send("Product Not Found");
   }
   else{ 
     res.send(products);
   }
 });


};

var findSneakerById = function(sneakerId, done) {
  Sneaker.find({styleID:sneakerId},(err,data)=>{
  if(err) return done(err)
    return done(null,data)
    })  
  
  };


/* // Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a sneaker with the specified noteId in the request
exports.delete = (req, res) => {

};  */
