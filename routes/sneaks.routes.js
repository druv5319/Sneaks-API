module.exports = (app) => {
    const sneaks = require('../controllers/sneaks.controllers.js/index.js');

    // Create a new Note
   // app.post('/notes', sneaks.create);

    // Retrieve a single Note with noteId
    app.get('/search/shoe', sneaks.findOneWithSize);
    
    // Retrieve all Notes
    app.get('/search/:shoe', sneaks.create);

    app.get('/shoes', sneaks.findAll);


   // app.put('/search/shoe', sneaks.update);


    //app.delete('/search/shoe', sneaks.delete);
}