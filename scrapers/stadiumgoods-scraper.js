const request = require('request');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const cheerio = require('cheerio');
const Sneaker = require('../models/Sneaker');

module.exports = {
    getLink: function(styleID, callback){
        options.url = 'https://www.stadiumgoods.com/catalogsearch/result/?q='+ styleID;

        request(options, async function (error, response, data) {
                                 
               
            const SGLink = await nightmare
            .goto('https://www.stadiumgoods.com/catalogsearch/result/?q='+ styleId)
            .wait('.item')
            .evaluate(() => document.querySelector('.item').innerHTML)
            .then(response => {
                const $ = cheerio.load(response);
                console.log($('a').attr('href'));
                return $('a').attr('href');
            }).catch(err => {
                console.log(err);
            }); 
            await nightmare.end();
            return SGLink; 
            
        });

    }
}