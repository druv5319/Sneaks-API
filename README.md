
<p align="center">
  
<img src="https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/Sneaks_Logo.png?raw=true" width=250>
  
  </p>
  
<p align="center">
  
   <a href="https://www.npmjs.com/package/sneaks-api" alt="Version">
        <img src="https://img.shields.io/npm/v/sneaks-api" /></a>
<a href="https://www.npmjs.com/package/sneaks-api" alt="Downloads">
        <img src="https://img.shields.io/npm/dt/sneaks-api " /></a>


 </p>

A StockX API, FlightClub API, Goat API, and Stadium Goods API all in one.

Heres a [demo](https://druv5319.github.io/sneaks-app) of the [Sneaks App](https://github.com/druv5319/sneaks-app) using the API

Sneaks API is a sneaker API built using Node.JS, Express, and Axios. The Sneaks API allows users to get essential sneaker content such as images, product links and even prices from resell sites while also collecting data and storing it within a database. This API mainly scrapes StockX for sneaker information and then asynchronously scrapes Stadium Goods, Goat, and Flight Club for additional sneaker information such as images and its respective resell price. This API outputs a sneaker object of the following variables:

  - Sneaker Name
  - Colorway
  - Description
  - Release Date
  - Retail Price
  - Style ID
  - Image Links
  - Product links from each of the resell sites
  - Price map (of shoe size to price) from each of the resell sites
  - And more

I built this API so sneaker heads and developers are able to create sneaker based programs, trackers and websites without having to fumble with scrapping information on all 4 resell websites. Feel free to fork, edit and submit a pull request for this API for any changes or improvements. If you have any questions or issues regarding this feel free to create an issue and I will try to answer them as soon as I can.

UPDATE: As per many requests, I updated this API to version 1.1 which removes the caching database from the API so no need to download and have MongoDB running for the API. If youd like to use the database version of the API, it is now a [branch](https://github.com/druv5319/Sneaks-API/tree/API-with-database) to this repository in the branches section.
  


## Technologies Used
  - Node.JS
  - Express
  - Axios
  - Request
  - Mongoose
  

  
## Installation
To use this API you will need to have [node.js](https://nodejs.org/en/) installed and running.
Once installed, use this line on the terminal within your project directory
```
npm install sneaks-api
```
and place this line at the top of your main file
```js
const SneaksAPI = require('sneaks-api');
```
## How to Use
### Method #1: Using the SneaksAPI class
```js
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

//getProducts(keyword, callback) takes in a keyword and returns an array of products
sneaks.getProducts("Yeezy Cinder", function(err, products){
    console.log(products)
})

//Product object includes styleID where you input it in the getProductPrices function
//getProductPrices(styleID, callback) takes in a style ID and returns sneaker info including a price map and more images of the product
sneaks.getProductPrices("FY2903", function(err, product){
    console.log(product)
})
//getMostPopular(callback) returns an array of the current popular products curated by StockX
sneaks.getMostPopular(function(err, products){
    console.log(products)
})
```
[Console log](https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/exampleSearchScreenshot%231.png) of sneaks.getProducts("Yeezy Cinder", ...)           
[Console log](https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/exampleSearchScreenshot%232.png) of sneaks.getProductPrices("FY2903", ...)

### Method #2: Using localhost:3000
Once your program starts with the sneaks-api module imported, a server should start and listen on port 3000

<b>Routes:</b>

This route takes in a keyword and returns an array of products (getProducts(keyword))
```
GET localhost:3000/search/:keyword
```


This route takes in a style ID and returns sneaker info including a price map and more images of the product (getProductprices(styleID))
```
GET localhost:3000/id/:styleID/prices
```


This route returns an array of the current popular products curated by StockX (getMostPopular())
```
GET localhost:3000/home
```

