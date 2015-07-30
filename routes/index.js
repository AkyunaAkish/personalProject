require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bcrypt = require('bcryptjs');


var protectRoute = function (req, res, next) {
  if (req.session.id) {
    next();
  }
  else {

    res.redirect('/');
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Chat' });
});

 router.get('/index', function(req,res){
     //users.findOne({_id: req.session.id}, function (err, docs) {
     //    res.render('index', { title: 'Chat', username: docs.username});
     //})
     res.render('index');
})


router.post('/login', function(req, res, next) {

        users.findOne({username: req.body.username}, function (err, docs) {
            if (docs && bcrypt.compareSync(req.body.password, docs.password)) {
                req.session.id = docs._id;
                console.log(req.session);
                res.redirect('/index');
            }

            else {
                res.render('home', {loginError: 'Invalid username or password'});
            }

        })

});




router.post('/register', function (req, res) {
    users.find({username: req.body.username}, function (err, docs) {
        if (docs.length === 0) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    req.body.password = hash;
                    users.insert(req.body);

                });
            });
            res.render('home', {successfulRegister: 'You have successfully registered, please log in to continue.'});
        }
        else {
            res.render('home', {registerError: 'Username already exists in the database'})
        }
    })


})


router.get('/logout', function (req, res) {
    req.session = null;
    res.redirect('/');
})





module.exports = router;
