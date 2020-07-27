const request = require('request');
const Sneaker = require('../models/Sneaker');
const flightClubScraper = require('../scrapers/flightclub-scraper')
var options = {
    url: "",
    body: "",
    headers: {
        'User-Agent': 'Sneaks-API'
    }
};
module.exports = {
    getProductsAndInfo: function (key, callback) {
        options.body = '{"params":"query='+key+'&facets=*&filters="}'
        options.url = 'https://xw7sbct9v6-1.algolianet.com/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3';
        request.post(options, 
            function (error, response, data) {
            if (!error) {
                var json = JSON.parse(data);
                var products = [];
                var numOfShoes = json.hits.length;
                for (var i = 0; i < json.hits.length; i++) {
                    if (!json.hits[i].style_id || (json.hits[i].style_id).indexOf(' ') >= 0) {
                        numOfShoes--;
                        continue;
                    }
                    var shoe = new Sneaker({
                        shoeName: json.hits[i].name,
                        brand: json.hits[i].brand,
                        silhoutte: json.hits[i].make,
                        styleID: json.hits[i].style_id,
                        retailPrice: json.hits[i].retailPrice,
                        thumbnail: json.hits[i].media.imageUrl,
                        releaseDate: json.hits[i].release_date,
                        description: json.hits[i].description,
                        urlKey: json.hits[i].url,
                        resellLinks: {
                            stockX: 'https://stockx.com/' + json.hits[i].url
                        },
                        lowestResellPrice:{
                            stockX: json.hits[i].lowest_ask
                        }
                    });
                    products.push(shoe)
                }
             
                if (products.length == 0) {
                    callback(new Error('Product Not Found'), null);
                } else {
                    callback(null, products);
                }

            }
        });
    },

    getPrices: function (shoe, callback) {
        options.url = 'https://stockx.com/api/products/' + shoe.urlKey + '?includes=market'
        let priceMap = {}
        request(options,
            function getPriceMap(error, response, data) {
                if (error) {
                    let err = new Error("Could not connect to StockX while searching '", shoe.styleID, "' Error: ", error)
                    console.log(err);
                    callback(err)
                } else if (response.statusCode != 200) {
                    let err = new Error("Could not connect to StockX while searching '", shoe.styleID, "' -  Status Code: ", response.statusCode)
                    console.log(err);
                    callback(err)
                } else {

                    let json = JSON.parse(data);
                    Object.keys(json.Product.children).forEach(function (key) {
                        if (json.Product.children[key].market.lowestAsk == 0) return;

                        priceMap[json.Product.children[key].shoeSize] = json.Product.children[key].market.lowestAsk;
                    });
                    shoe.resellPrices.stockX = priceMap;
                    callback();
                }
            });
    }
}
