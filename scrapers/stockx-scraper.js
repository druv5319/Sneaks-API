const got = require('got');
const Sneaker = require('../models/Sneaker');


module.exports = {
    getProductsAndInfo: async function (key, count, callback) {
      
        try {
            const response = await got.post('https://xw7sbct9v6-1.algolianet.com/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6b5e76b49705eb9f51a06d3c82f7acee', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    "accept": "application/json",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                body: `{"params":"query=${key}&facets=*&filters=&hitsPerPage=${count}"}`,
                http2: true
            });
           
            
            var json = JSON.parse(response.body);
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
                    make: json.hits[i].make,
                    colorway: json.hits[i].colorway,
                    retailPrice: json.hits[i].searchable_traits['Retail Price'],
                    thumbnail: json.hits[i].media.imageUrl,
                    releaseDate: json.hits[i].release_date,
                    description: json.hits[i].description,
                    urlKey: json.hits[i].url,
                    resellLinks: {
                        stockX: 'https://stockx.com/' + json.hits[i].url
                    }
                });
                if(json.hits[i].lowest_ask){
                    shoe.lowestResellPrice.stockX = json.hits[i].lowest_ask;
                }
                products.push(shoe)
            }
          
            if (products.length == 0 || numOfShoes == 0) {
                callback(new Error('Product Not Found'), null);
            } 
            else {
                callback(null, products);
            }
        } catch (error) {
            let err = new Error("Could not connect to StockX while searching '", key, "' Error: ", error)
            console.log(err);
            callback(err, products)
        }
    },

    getPrices: async function (shoe, callback) {
        let priceMap = {}
        try {
            const response = await got('https://stockx.com/api/products/' + shoe.urlKey + '?includes=market', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'
                },
                http2: true
            });
            let json = JSON.parse(response.body);
            Object.keys(json.Product.children).forEach(function (key) {
                if (json.Product.children[key].market.lowestAsk == 0) return;
                //if size is in womens, then remove "W"
                var size = json.Product.children[key].shoeSize
                if(size[size.length-1] == 'W'){
                    size = size.substring(0, size.length - 1);
                    
                }
                priceMap[size] = json.Product.children[key].market.lowestAsk;
                
            });
            shoe.resellPrices.stockX = priceMap;
            callback();
        } catch (error) {
            console.log(error)
            let err = new Error("Could not connect to StockX while searching '", shoe.styleID, "' Error: ", error)
            console.log(err);
            callback(err)

        }
    }
}
