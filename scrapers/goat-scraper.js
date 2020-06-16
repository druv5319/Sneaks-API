const request = require('request');
const Sneaker = require('../models/Sneaker');


module.exports = {
  getLink: function (shoe, callback) {
   
    var options = {
      url: 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.2.0)%3BJS%20Helper%20(3.1.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a',
      body: '{"requests":[{"indexName":"product_variants_v2","params":"distinct=true&maxValuesPerFacet=1&page=0&query=' + shoe.styleID + '&facets=%5B%22instant_ship_lowest_price_cents"}]}',
      headers: {
        'User-Agent': 'Sneaks-API'
      }
    };
    request.post(options,
      function (error, response, data) {
        if (error) {
          let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' Error: ", error)
          console.log(err);
          callback(err)
        } else if (response.statusCode != 200) {
          let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' -  Status Code: ", response.statusCode)
          console.log(err);
          callback(err)
        }
          else {
          var json = JSON.parse(data);
          if (json.results[0].hits[0]) {
            shoe.resellLinks.goat = 'https://www.goat.com/sneakers/' + json.results[0].hits[0].slug;
          }
          
          callback();
        }
      }
    );
  },

  getPrices: function (shoe, callback) {
    if (!shoe.resellLinks.goat) {
      callback()
    } else {
      let apiLink = shoe.resellLinks.goat.replace('sneakers', 'web-api/v1/product_templates');
      var options = {
        url: apiLink,
        headers: {
          'User-Agent': 'Sneaks-API'
        }
      };
     
      let priceMap = {};
      request(options,
        function getPriceMap(error, response, data) {
          if (error) {
            let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' Error: ", error)
            console.log(err);
            callback(err)
          } else if (response.statusCode != 200) {
            let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' -  Status Code: ", response.statusCode)
            console.log(err);
            callback(err)
          } else {

            var json = JSON.parse(data);
            if (!error) {
              for (var i = 0; i < json.availableSizesNew.length; i++) {
                priceMap[json.availableSizesNew[i][0]] = json.availableSizesNew[i][1];
              }
            }
            shoe.resellPrices.goat = priceMap;
            shoe.nickname = json.nickname;
            shoe.midsole = json.midsole;
            if (json.productTemplateExternalPictures[0]) {
              shoe.imageLinks.push(json.productTemplateExternalPictures[0].mainPictureUrl);
            }
            if (json.productTemplateExternalPictures[2]) {
              shoe.imageLinks.push(json.productTemplateExternalPictures[2].mainPictureUrl);
            }
            if (json.productTemplateExternalPictures[5]) {
              shoe.imageLinks.push(json.productTemplateExternalPictures[5].mainPictureUrl);
            }
            if (json.productTemplateExternalPictures[7]) {
              shoe.imageLinks.push(json.productTemplateExternalPictures[7].mainPictureUrl);
            }
            if (json.productTemplateExternalPictures[3]) {
              shoe.imageLinks.push(json.productTemplateExternalPictures[3].mainPictureUrl);
            }
            callback();
          }
        });
    }
  }

}
