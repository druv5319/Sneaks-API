const request = require('request');
//const Nightmare = require('nightmare');
//const nightmare = Nightmare({ show: true });
const Sneaker = require('../models/Sneaker');
var options = {
    url: "",
    body: "",
    headers: {
      'User-Agent': 'Sneaks-API'
    }
  };

module.exports = {
    getProductInfo: function(shoe, callback){
        options.body = "{\"requests\":[{\"indexName\":\"product_variants_v2_flight_club\",\"params\":\"query=" + shoe.styleID + "&hitsPerPage=1&maxValuesPerFacet=1&filters=&facets=%5B%22lowest_price_cents_usd%22%5D&tagFilters=\"}]}"
        options.url = "https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.4.0%3BJS%20Helper%202.26.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a";
        request.post(options,
            function (error, response, data) {        
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(data);
                    var url;
                    var story;
                    if(json.results[0].hits[0]){
                        url = 'https://www.flightclub.com/' + json.results[0].hits[0].slug;
                        story = json.results[0].hits[0].story_html
                        shoe.resellLinks.flightClub = url;
                        shoe.description_html = story;

                    } 
                    //else url = 'Not Found'
                    
                    callback()

               
                    
                }
            }
        );

    }}