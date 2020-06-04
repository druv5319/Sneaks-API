const request = require('request');
const Sneaker = require('../models/Sneaker');
const flightClubScraper = require('../scrapers/flightclub-scraper')

module.exports = {
      getProducts: function(shoe, options, callback) {
        options.url = 'https://stockx.com/api/browse?productCategory=sneakers&_search=' + shoe + '&dataType=product&country=US';
        request(options, async function (error, response, data) {
            if (!error) {
                var json = JSON.parse(data);
                var products = [];
                var numOfShoes = json.Products.length;
                for (var i = 0; i < json.Products.length; i++) {
                    if(!json.Products[i].styleId || (json.Products[i].styleId).indexOf(' ') >= 0){
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
                            stockX: 'https://stockx.com/' + json.Products[i].urlKey,
                            stadiumGoods: 'https://www.stadiumgoods.com/catalogsearch/result/?q='+ json.Products[i].styleId,
                            goat: 'https://www.goat.com/search?query=' + json.Products[i].styleId,
                            flightClub:  ''
                        }
                    });
                
                    products.push(shoe)
                }
                if(products.length == 0) callback(new Error('Product Not Found'))

                // Grabs links for each shoe. This function runs asynchronously thus a simple counter is needed to see
                //  if all shoes links have been grabbed before returning products to the callback
                var count = 0
                products.forEach(function(shoe){
                    getAllProductInfo(shoe, function(){
                        Sneaker.countDocuments({styleID: shoe.styleID}, function(err, count){
                            if(count<=0){
                                shoe.save()
                            }
                        });
                       
                        //if all shoes links have been parsed then return
                        if(count++ + 1 == products.length)  callback(null, products); 
                    });

                })
            }
        });
    }
}

  

function getAllProductInfo(shoe, callback){
    flightClubScraper.getProductInfo(shoe, function(){
        callback()
    });

}



