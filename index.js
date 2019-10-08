const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const values = require('lodash/values')
const app = express();

function jsonParser(stringValue) {

  var string = JSON.stringify(stringValue);
  var objectValue = JSON.parse(string);

  return objectValue['Product'];
}

app.get('/', function (req, res) {
  let shoe = req.query.shoe;
  let size = req.query.size
  let url = 'https://stockx.com/api/products/' + shoe + '?includes=market';
  const options = {
    url,
    headers: {
      'User-Agent': 'Sneaks-API'
    }
  };
  request(options, function (error, response, data) {

    if (!error) {
      var json = JSON.parse(data);
      const product = values(json.Product.children).find(o => o.shoeSize == size)
console.log(product)
      var sneaker = {
        shoe: json.Product.title,
        size: product.shoeSize,
        brand:json.Product.brand,
        silhoutte: json.Product.shoe,
        stockXPrice: product.market.lowestAsk,
        stockXLink: 'www.stockx.com/'+json.Product.urlKey,
        retailPrice: json.Product.retailPrice

        
      }
      res.send(sneaker);
    }

  });

});
app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;