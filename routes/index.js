const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

// router.get('/', (req, res) => {
//     //#swagger.tags=['Hello World]
//     res.send("Hello World");
// });

router.use('/contacts', require('./contacts'));

router.use('/books', require('./books'));

router.use('/author', require('./author'));


router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
 });


module.exports = router;