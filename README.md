# Sneaks API
![version](https://img.shields.io/npm/v/sneaks-api "Version")
![npm](https://img.shields.io/npm/dt/sneaks-api.svg "Total Downloads")

A StockX API, FlightClub API, Goat API, and Stadium Goods API all in one.

Heres a [demo](https://druv5319.github.io/sneaks-app) of the [Sneaks App](https://github.com/druv5319/sneaks-app) using the API

Sneaks API is a web scraper built using Node.JS, Express, and Axios. Sneaks API allows users to get essential sneaker content such as images, links of purchase and even prices from resell sites while also collecting data and storing it within a database. This API mainly scrapes StockX for sneaker information and then asynchronously scrapes Stadium Goods, Goat, and Flight Club for additional sneaker information such as images and its respective resell price. This API outputs a sneaker object of the following variables:

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
  
Feel free to fork, edit and submit a pull request for this API for any changes or improvements. If you have any questions or issues regarding this feel free to create an issue and I will try to answer them as soon as I can.
  
## Screenshots

## Technologies Used
  - Node.JS
  - Express
  - Axios
  - Request
  - MongoDB
  - Mongoose
  
## Features
  - Product search
  - Grab price map of product
  
## Installation
To use this API you will need to have [node.js](https://nodejs.org/en/).
Once installed, use this line on the terminal within your project directory
```
npm install sneaks-api
```
and place this line at the top of your main file
```js
const SneaksAPI = require('sneaks-api');
```
### How to Use
#### Method #1: Using localhost:3000
  
