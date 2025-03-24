const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World]
    res.send("Hello World");
});

router.use('/contacts', require('./contacts'));

router.use('/books', require('./books'));

module.exports = router;