const axios = require('axios');
const request = require('request');
const cheerio = require('cheerio');
const Sneaker = require('../models/Sneaker');

var options = {
    url: "",
    body: "",
    headers: {
        'User-Agent': 'Sneaks-API',
        'Content-Type': 'text/html',
    }
};
let config = {
    headers: {
        'User-Agent': 'Sneaks-API',
        'Content-Type': 'application/json',
        'Host': 'graphql.stadiumgoods.com',
        'Content-Length': 466
    }
}
module.exports = {
    getLink: function (shoe, callback) {
        options.body = '{"operationId":"sg-front/cached-a41eba558ae6325f072164477a24d3c2","variables":{"initialSearchQuery":"' + shoe.styleID + '","initialSort":"RELEVANCE","filteringOnCategory":false,"filteringOnBrand":false,"filteringOnMensSizes":false,"filteringOnKidsSizes":false,"filteringOnWomensSizes":false,"filteringOnApparelSizes":false,"filteringOnGender":false,"filteringOnColor":false,"filteringOnPriceRange":false},"locale":"USA_USD"}'
        options.url = 'https://graphql.stadiumgoods.com/graphql'
        var data = '{"operationId":"sg-front/cached-a41eba558ae6325f072164477a24d3c2","variables":{"initialSearchQuery":"' + shoe.styleID + '","initialSort":"RELEVANCE","filteringOnCategory":false,"filteringOnBrand":false,"filteringOnMensSizes":false,"filteringOnKidsSizes":false,"filteringOnWomensSizes":false,"filteringOnApparelSizes":false,"filteringOnGender":false,"filteringOnColor":false,"filteringOnPriceRange":false},"locale":"USA_USD"}'
        axios.post(options.url, data, config).then(response => {
                if (response.data.data.configurableProducts.edges[0]) {
                
                    shoe.resellLinks.stadiumGoods = response.data.data.configurableProducts.edges[0].node.pdpUrl;
                    shoe.lowestResellPrice.stadiumGoods = Number(response.data.data.configurableProducts.edges[0].node.lowestPrice.value.formattedValue.replace(/[^0-9.-]+/g, ""));
                    callback();
                } else {

                    callback(new Error("Product '" + shoe.styleID + "' not found on Stadium Goods'"));
                }
            })
            .catch(error => {
                console.log(error);
            });

    },

    getPrices: function (shoe, callback) {
        if (!shoe.resellLinks.stadiumGoods) {
            callback()
        } else {
            options.url = shoe.resellLinks.stadiumGoods;
            let priceMap = {};
            request.post(options,
                function getPriceMap(error, response, data) {
                    if (error) {
                        let err = new Error("Could not connect to Stadium Goods while searching '", shoe.styleID, "' Error: ", error)
                        console.log(err);
                        callback(err)
                    } else if (response.statusCode != 200) {
                        let err = new Error("Could not connect to Stadium Goods while searching '", shoe.styleID, "' -  Status Code: ", response.statusCode)
                        console.log(err);
                        callback(err)
                    } else {

                        const $ = cheerio.load(data);
                        $('.product-sizes__input').map(function (i, product) {
                            if ($(product).attr('data-stock') == 'true') {
                                priceMap[$(product).attr('data-size')] = parseInt($(product).attr('data-amount')) / 100;
                            }
                            if (i == $('.product-sizes__input').length - 1) {
                                shoe.resellPrices.stadiumGoods = priceMap;

                                callback();
                            }
                        });
                    }
                });
        }
    }

}