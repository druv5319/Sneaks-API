const request = require('request');
const axios = require('axios');


module.exports = {
    getLink: async function (shoe, callback) {

        var options = {
            url: "https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.4.0%3BJS%20Helper%202.26.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a",
            body: "{\"requests\":[{\"indexName\":\"product_variants_v2_flight_club\",\"params\":\"query=" + shoe.styleID + "&hitsPerPage=1&maxValuesPerFacet=1&filters=&facets=%5B%22lowest_price_cents_usd%22%5D&tagFilters=\"}]}",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15-API'
            }
        };
        request.post(options,
            function (error, response, data) {
                if (error) {
                    let err = new Error("Could not connect to Flight Club while searching '" + shoe.styleID + "' Error: ", error)
                    console.log(err);
                    callback(err)
                } else if (response.statusCode != 200) {
                    let err = new Error("Could not connect to Flight Club while searching '" + shoe.styleID + "' -  Status Code: ", response.statusCode)
                    console.log(err);
                    callback(err)
                } else {
                    var json = JSON.parse(data);
                    if (json.results[0].hits[0]) {
                        if (json.results[0].hits[0].lowest_price_cents_usd / 100 != 0) {
                            shoe.lowestResellPrice.flightClub = json.results[0].hits[0].lowest_price_cents_usd / 100;
                        }
                        shoe.resellLinks.flightClub = 'https://www.flightclub.com/' + json.results[0].hits[0].slug;
                        shoe.description = json.results[0].hits[0].story
                    }
                    callback(shoe);
                }

            }
        );
    },


    getPrices: function (shoe, callback) {
        if (!shoe.resellLinks.flightClub) {
            callback()
        } else {
            var options = {
                url: 'https://www.flightclub.com/token',
                headers: {
                    'User-Agent': 'Sneaks-API',
                    Cookie: '_ga=GA1.2.1305697265.1589650884; _gat_mpgaTracker1=1; _gid=GA1.2.110567219.1592159329; _xsrf=ACpmRhbR-o7gf2gOoZrduFroRkcMReIv0VaM; ab.storage.sessionId.bfd3619a-0e44-4389-b0e4-30cca9ba859f=%7B%22g%22%3A%2270eb2c6d-82af-5175-401c-05b1b17c008f%22%2C%22e%22%3A1592165414984%2C%22c%22%3A1592161566043%2C%22l%22%3A1592163614984%7D; __stripe_mid=23ecdd48-6f99-42e4-a01c-2a3b66ad8f85; __stripe_sid=86d74e96-4eb3-45b0-9ffa-1cbf7ced6deb; _pxde=cb6ac20c0c2d68d7343c4508da0f1aff46a46615056b68de3a61ed3c12945823:eyJ0aW1lc3RhbXAiOjE1OTIxNjM2MTQwMTYsImZfa2IiOjAsImlwY19pZCI6W119; _pxff_rf=1; _fbp=fb.1.1589652394965.825578106; _px=bG1e+ChJB5noY44i/b5+ec1RYb3CHINQNxB9uQwsOPJutcYBUMndLvXy2nYUvkInZAw5ccmSKX+Jz2/rg7tThg==:1000:C9OlEdqfQV85zrT3Ehf9ROYfc6Mgwurx6eS70cXnpXIunhz171ULOo4lCIn1qC3vYI643A0+zzTdn6+l1uk/HkjbCTXt3YXepmzx25LgsbiafOofD/M9gfdrWcVTOBTFAzHRdy3AfMFAZMbfjTLLExh7ELWFaXR5Y4AIFSpcoJ9EVy3pi7d8WfLt9ovEk7pSW+jecXGzeR+HDkB5qgTvct9goMe2nH1PyvCNUPxI9h2hENV3WmtkAmWSoSKdfPzmFdOuHZI/bHW7DqJ5KRolxg==; _px3=f9373bd44c36697e1917ffc8bedfebda19b91c675884b6c652b76ad4db11f2b3:bG1e+ChJB5noY44i/b5+ec1RYb3CHINQNxB9uQwsOPJutcYBUMndLvXy2nYUvkInZAw5ccmSKX+Jz2/rg7tThg==:1000:JEiKt5U/MzH2hwNkVdu3FcNxxwFWzE9KSdjiOmAKrcchHj9lOSLFukjBQk1imSgxzsQXK6+gcdDQJEOiQdH0xB+GhxplxjaXSJnqWRf72xhdXQDjEFepal/9virvQjrbbe8v/SZ0vqOREwdQpuZ1RaJJySCPaKau67Pv5YF636U=; _csrf=YB0s2Rxh9LAc6PgZIAM7vBo9; _pxvid=b164dfb6-979b-11ea-869f-0242ac12000b; __cfduid=da573444825c291236c950b508eb7a4741589650553; GSIDPE8xI3mBKqVw=d157f2f9-4c3c-4fcc-beee-6e5ff281eae2; optimizelyBuckets=%7B%7D; optimizelySegments=%7B%22985729904%22%3A%22safari%22%2C%22986786736%22%3A%22search%22%2C%22995297024%22%3A%22false%22%7D; 3060738.3440491=7452ec8e-d2bb-4b7f-bcbf-474676736c2a; tracker_device=bfe4ad7b-07db-401e-8b4a-a7739ff53d2d; optimizelyEndUserId=oeu1511627844219r0.6301887025421603'
                }
            };
            let slug = shoe.resellLinks.flightClub.split('.com/')[1];
            var token;
            request(options,
                function getToken(error, response, data) {
                    if (error) {
                        let err = new Error("Could not connect to Flight Club while getting token - Error: ", error)
                        console.log(err);
                        callback(err)
                    } else if (response.statusCode != 200) {
                        let err = new Error("Could not connect to Flight Club while  getting token-  Status Code: ", response.statusCode)
                        console.log(err);
                        callback(err)
                    } else {
                        token = data;
                        let config = {
                            headers: {
                                'User-Agent': 'Test',
                                'Content-Type': 'application/json',
                                Cookie: '_ga=GA1.2.1305697265.1589650884; _gat_mpgaTracker1=1; _gid=GA1.2.110567219.1592159329; _xsrf=ACpmRhbR-o7gf2gOoZrduFroRkcMReIv0VaM; ab.storage.sessionId.bfd3619a-0e44-4389-b0e4-30cca9ba859f=%7B%22g%22%3A%2270eb2c6d-82af-5175-401c-05b1b17c008f%22%2C%22e%22%3A1592165414984%2C%22c%22%3A1592161566043%2C%22l%22%3A1592163614984%7D; __stripe_mid=23ecdd48-6f99-42e4-a01c-2a3b66ad8f85; __stripe_sid=86d74e96-4eb3-45b0-9ffa-1cbf7ced6deb; _pxde=cb6ac20c0c2d68d7343c4508da0f1aff46a46615056b68de3a61ed3c12945823:eyJ0aW1lc3RhbXAiOjE1OTIxNjM2MTQwMTYsImZfa2IiOjAsImlwY19pZCI6W119; _pxff_rf=1; _fbp=fb.1.1589652394965.825578106; _px=bG1e+ChJB5noY44i/b5+ec1RYb3CHINQNxB9uQwsOPJutcYBUMndLvXy2nYUvkInZAw5ccmSKX+Jz2/rg7tThg==:1000:C9OlEdqfQV85zrT3Ehf9ROYfc6Mgwurx6eS70cXnpXIunhz171ULOo4lCIn1qC3vYI643A0+zzTdn6+l1uk/HkjbCTXt3YXepmzx25LgsbiafOofD/M9gfdrWcVTOBTFAzHRdy3AfMFAZMbfjTLLExh7ELWFaXR5Y4AIFSpcoJ9EVy3pi7d8WfLt9ovEk7pSW+jecXGzeR+HDkB5qgTvct9goMe2nH1PyvCNUPxI9h2hENV3WmtkAmWSoSKdfPzmFdOuHZI/bHW7DqJ5KRolxg==; _px3=f9373bd44c36697e1917ffc8bedfebda19b91c675884b6c652b76ad4db11f2b3:bG1e+ChJB5noY44i/b5+ec1RYb3CHINQNxB9uQwsOPJutcYBUMndLvXy2nYUvkInZAw5ccmSKX+Jz2/rg7tThg==:1000:JEiKt5U/MzH2hwNkVdu3FcNxxwFWzE9KSdjiOmAKrcchHj9lOSLFukjBQk1imSgxzsQXK6+gcdDQJEOiQdH0xB+GhxplxjaXSJnqWRf72xhdXQDjEFepal/9virvQjrbbe8v/SZ0vqOREwdQpuZ1RaJJySCPaKau67Pv5YF636U=; _csrf=YB0s2Rxh9LAc6PgZIAM7vBo9; _pxvid=b164dfb6-979b-11ea-869f-0242ac12000b; __cfduid=da573444825c291236c950b508eb7a4741589650553; GSIDPE8xI3mBKqVw=d157f2f9-4c3c-4fcc-beee-6e5ff281eae2; optimizelyBuckets=%7B%7D; optimizelySegments=%7B%22985729904%22%3A%22safari%22%2C%22986786736%22%3A%22search%22%2C%22995297024%22%3A%22false%22%7D; 3060738.3440491=7452ec8e-d2bb-4b7f-bcbf-474676736c2a; tracker_device=bfe4ad7b-07db-401e-8b4a-a7739ff53d2d; optimizelyEndUserId=oeu1511627844219r0.6301887025421603',
                                'x-csrf-token': token

                            }
                        }
                        options = {
                            url: 'https://www.flightclub.com/graphql',
                            body: '{"operationName":"getProductTemplate","variables":{"slug":"' + slug + '"},"query":"query getProductTemplate($slug: String!) {\\n  getProductTemplate(slug: $slug) {\\n    id\\n    storyHtml\\n    sku\\n    description\\n    releaseDate {\\n      shortDisplay\\n      __typename\\n    }\\n    newSizes {\\n      productTemplateId\\n      size {\\n        value\\n        display\\n        __typename\\n      }\\n      shoeCondition\\n      boxCondition\\n      lowestPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      instantShipPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      isInstantShip\\n      __typename\\n    }\\n    usedVariants {\\n      size {\\n        value\\n        display\\n        __typename\\n      }\\n      price {\\n        value\\n        ...ProductTemplatePriceDisplayParts\\n        __typename\\n      }\\n      shoeCondition\\n      boxCondition\\n      isInstantShip\\n      __typename\\n    }\\n    newLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    usedLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    sizePickerDefault {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    sizePickerOptions {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    sizeCategory\\n    productCategory\\n    __typename\\n  }\\n}\\n\\nfragment ProductTemplatePriceDisplayParts on Price {\\n  display(useGrouping: false, hideEmptyCents: true)\\n  localizedValue\\n  value\\n  __typename\\n}\\n\\nfragment SizePickerOptionParts on SizePickerOption {\\n  size {\\n    display\\n    value\\n    __typename\\n  }\\n  new {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  used {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n"}',
                        }
                        let priceMap = {};
                        axios.post(options.url, options.body, config).then(res => {
                            for (var i = 0; i < res.data.data.getProductTemplate.newSizes.length; i++) {
                                priceMap[res.data.data.getProductTemplate.newSizes[i].size.display] = res.data.data.getProductTemplate.newSizes[i].lowestPriceOption.price.value / 100;
                            }
                            shoe.resellPrices.flightClub = priceMap
                            callback(shoe);
                        }).catch(error => {
                            let err = new Error("Could not connect to Flight Club while searching '", shoe.styleID, "' Error: ", error)
                            console.error(err);
                            callback(shoe);
                        });

                    }
                });
        }
    }
}