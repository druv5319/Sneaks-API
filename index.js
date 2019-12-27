const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const values = require('lodash/values');
const app = express();
const Sneaker = require('./models/Sneaker');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true })
const stockXScraper = require('./scrapers/stockx-scraper');


var options = {
  url: "",
  headers: {
    'User-Agent': 'comp'
  }
};

app.get('/search/shoe', function (req, res) {
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

});

 app.get('/search/:shoe', async function(req, res) {
   stockXScraper.getProducts(req.params.shoe, options, function(error, products){
     if(error){
      res.send("Product Not Found");
    }
    else{ 
      res.send(products);
    }
  });
});


app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;
