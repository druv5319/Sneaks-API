const Sneaker = require('../models/Sneaker');
const values = require('lodash/values');
const request = require('request');
const stockXScraper = require('../scrapers/stockx-scraper');
var options = {
    url: "",
    headers: {
      'User-Agent': 'comp'
    }
  };
// Create and Save a new Note
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
         res.send(products);
       }
     });

};
 // Retrieve and return all notes from the database.
/* exports.findAll = (req, res) => {

};
 */

exports.findOneWithSize = (req, res) => {
    let shoe = req.query.shoe;
    let size = req.query.size
    options.url = 'https://stockx.com/api/products/' + shoe + '?includes=market';
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
  
    });

};

exports.findAll = (req, res) => {
    Sneaker.find()
    .then(sneaks => {
        res.send(sneaks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

};

/* // Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};  */