const SneaksAPI = require('../controllers/sneaks.controllers.js');
const sneaks = new SneaksAPI();
module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    //Grabs sneaker info from the database given the styleID
    app.get('/id/:id', function(req, res){
        sneaks.findOne(req.params.id, function(error, shoe){
            if (error) {
                res.send("Product Not Found");
              } else {
                res.json(shoe);
              }
        })
    });

    //Grabs price maps from each site of a particular shoe
    app.get('/id/:id/prices', function(req, res){
        sneaks.getProductPrices(req.params.id, function(error, products){
            if (error) {
                console.log(error)
                res.send("Product Not Found");
              } else {
                res.json(products);
              }
        })
    });

    //grabs the most popular sneakers 
    app.get('/home', function(req, res){
        sneaks.getMostPopular(function(error, products){
            if (error) {
                console.log(error)
                res.send("Product Not Found");
              } else {
                res.json(products);
              }
        })
    });

    //Grabs all sneakers given a keyword/parameter
    app.get('/search/:shoe', function(req, res){
        sneaks.getProducts(req.params.shoe, function(error, products){
            if (error) {
                console.log(error)
                res.send("Product Not Found");
              } else {
                res.json(products);
              }
        })
    });
//Grabs all sneakers in the database
    app.get('/shoes', function(req, res){
        sneaks.findAll( function(error, products){
            if (error) {
                console.log(error)
                res.send("No Products In Database");
              } else {
                res.json(products);
              }
        })
    });

    //redirects root route to home page
    app.get('/', function (req, res) {
        res.redirect('/home')
    });

}