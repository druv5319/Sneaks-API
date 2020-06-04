const request = require('request');

const Sneaker = require('../models/Sneaker');

module.exports = {
      getLink: function(shoe, options, callback) {
        options.url = 'https://stockx.com/api/browse?productCategory=sneakers&_search=' + shoe + '&dataType=product&country=US';
        request(options, async function (error, response, data) {    
            });
        
        }
    
}
