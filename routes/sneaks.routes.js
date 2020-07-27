module.exports = (app) => {
    const sneaks = require('../controllers/sneaks.controllers.js');

  
   // app.post('/search/shoe', sneaks.create);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
 
    //Grabs sneaker info from the database given the styleID
    app.get('/id/:id', sneaks.findOne);

    //Grabs price maps from each site of a particular shoe
    app.get('/id/:id/prices', sneaks.getProductPrices);

    //grabs the most popular sneakers 
    app.get('/home', sneaks.getMostPopular)
    
   //Grabs all sneakers given a keyword/parameter
    app.get('/search/:shoe', sneaks.create);

    app.get('/shoes', sneaks.findAll);

    //redirects root route to home page
    app.get('/', function(req, res){
        res.redirect('/home')

    });


   // app.put('/search/shoe', sneaks.update);


    //app.delete('/search/shoe', sneaks.delete);
}