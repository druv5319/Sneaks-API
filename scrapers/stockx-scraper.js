const request = require('request');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const Sneaker = require('../models/Sneaker');

module.exports = {
      getProducts: function(shoe, options, callback) {
        options.url = 'https://stockx.com/api/browse?productCategory=sneakers&_search=' + shoe + '&dataType=product&country=US';
        request(options, async function (error, response, data) {
            if (!error) {
                var json = JSON.parse(data);
                var products = [];
                for (var i = 0; i < json.Products.length; i++) {
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
                            flightClub: 'https://www.flightclub.com/catalogsearch/result/?q=' + json.Products[i].styleId
                        }
                    });
                    products.push(shoe);
                    
                }
                

          console.log(products);
                if(products.length == 0){
                    callback(new Error('Product Not Found'));
                    
                }
                else{
                callback(null, products);
                }
                            
            }
           

        });
    }
}
