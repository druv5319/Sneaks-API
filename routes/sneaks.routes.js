module.exports = (app) => {
    const sneaks = require('../controllers/sneaks.controllers.js');

  
   // app.post('/search/shoe', sneaks.create);
 
    //Grabs a sneaker with urls to all resell sites and lowest price given the style ID (can be found when searching a sneaker using the /search/:shoe route)
    app.get('/id/:id', sneaks.findOneWithSize);

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