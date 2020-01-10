module.exports = (app) => {
    const sneaks = require('../controllers/sneaks.controllers.js');

  
   // app.post('/search/shoe', sneaks.create);


    app.get('/search/shoe', sneaks.findOneWithSize);

    //grabs the most popular sneakers 
    app.get('/home', sneaks.getMostPopular)
    
   
    app.get('/search/:shoe', sneaks.create);

    app.get('/shoes', sneaks.findAll);


   // app.put('/search/shoe', sneaks.update);


    //app.delete('/search/shoe', sneaks.delete);
}