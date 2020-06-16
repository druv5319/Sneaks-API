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
    getProductsAndInfo: function (shoe, callback) {
        options.url = 'https://stockx.com/api/browse?productCategory=sneakers&_search=' + shoe + '&dataType=product&country=US';
        request(options,  function (error, response, data) {
            if (!error) {
                var json = JSON.parse(data);
                var products = [];
                var numOfShoes = json.Products.length;
                for (var i = 0; i < json.Products.length; i++) {
                    if (!json.Products[i].styleId || (json.Products[i].styleId).indexOf(' ') >= 0) {
                        numOfShoes--;
                        continue;
                    }
                    var shoe = new Sneaker({
                        shoeName: json.Products[i].title,
                        brand: json.Products[i].brand,
                        silhoutte: json.Products[i].shoe,
                        styleID: json.Products[i].styleId,
                        retailPrice: json.Products[i].retailPrice,
                        imageLinks: json.Products[i].media.imageUrl,
                        urlKey: json.Products[i].urlKey,
                        resellLinks: {
                            stockX: 'https://stockx.com/' + json.Products[i].urlKey
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

                        priceMap[json.Product.children[key].shoeSize] = json.Product.children[key].market.lowestAsk * 100;
                    });
                    shoe.resellPrices.stockX = priceMap;
                    callback();
                }
            });
    }
}
