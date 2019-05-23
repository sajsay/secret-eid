// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');
var _ = require('underscore')



module.exports = function (passport) {

  router.get('/member', function (req, res) {
    res.render('member');
  });

  // GET registration page
  router.get('/signup', function (req, res) {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function (userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function (req, res) {
    console.log(req.body)

    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    models.User.find({}, function (err, users) {
      console.log('users :', users)
      if (err) {
        console.log(err)
      } else if (users.length == 12) {
        console.log('ln: ', users.length);
        res.redirect('/login');
      } else {
        /* res.render('secreteid', {
          name: req.user.name,
          wishlist: req.user.wishlist,
          assignedName: assignedUser.name,
          assignedWishList: assignedUser.wishlist,
        }) */

        var u = new models.User({
          // Note: Calling the email form field 'username' here is intentional,
          //    passport is expecting a form field specifically named 'username'.
          //    There is a way to change the name it expects, but this is fine.
          email: req.body.username,
          password: req.body.password,
          name: req.body.name,
          wishlist: ''
        });

        u.save(function (err, user) {
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
            return;
          }
          console.log(user);
          res.redirect('/login');
        });

      }
    })
  });


  function randomizer(next) {

    models.User.find({}, '_id name').exec()
      .then(function (users) {
        //console.log('users: ', users);
        var usersShuffled = _.shuffle(users);
        console.log('shuf: ', usersShuffled);
        var pairs = [];
        for (var i = 0; i < 12; i++) {
          console.log('cn: ', i)
          if (i == 0) {
            pairs.push({ giver: usersShuffled[i], givee: usersShuffled[11] });
          }
          else {
            pairs.push({ giver: usersShuffled[i], givee: usersShuffled[i - 1] });
          }
        };
        next(pairs)

        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i];
          var giverId = pair.giver._id;
          var giveeId = pair.givee._id;

          //models.User.findById(giverId, function (err, giver) {
          //  console.log('giv', giver)
          //giver.assignedPerson = giveeId;
          models.User.findOneAndUpdate({
            '_id': giverId
          }, {
              $set: {
                assignedPerson: giveeId
              }

            }).then(d => {
              console.log(d);
            }).catch(err => { console.log('asin', err.message) })
          //})

        }

      })
      .catch(err => { console.log('ero', err.message) })
  }



  router.get('/admin/rand', function (req, res) {
    console.log(req.get('Cookie'))
    if (req.get('Cookie').split(';')[0] === 'admin=true') {
      models.User.find({}, function (err, users) {
        //console.log('users :', users)
        if (err) {
          console.log(err.message)
          res.send({ 'message': 'no' });
        } else if (users.length != 12) {
          res.send({ 'message': 'not 12' });
        } else {
          randomizer(function (pairs) {
            //console.log('pairs in /admin', pairs)

            models.Pairs.findOneAndUpdate({ 'id': 1234 }, {
              $set: {
                pairs: pairs
              }
            }, { upsert: true },
              function (err, doc) {
                if (err) return res.send(500, { error: err.message });
                return res.send({ 'message': 'good' });
              });
            //res.send({ 'message': 'good' });
            //res.render('admin', {
            //  cellName: null, //invoke
            //});
          })
        }
      })
    } else {
      return res.send({ 'message': 'denied' });
    }

  })

  // GET Login page
  router.get('/', function (req, res) {
    res.redirect('/login');
  });

  // GET Login page
  router.get('/login', function (req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/secreteid',
    failureRedirect: '/login'
  }));

  router.get('/admin/login', function (req, res) {
    res.render('adminlogin');
  });

  router.get('/admin', function (req, res) {
    console.log(req.get('Cookie'))
    if (req.get('Cookie')) {
      if (req.get('Cookie').split(';')[0] === 'admin=true') {

        models.Pairs.find({ 'id': 1234 }, function (err, pairs) {
          //let p = pairs;

          //console.log(pairs[0].pairs)
          if (err) {
            console.log(err.message)
            res.redirect('/admin/login');
          } else {
            if(pairs[0] != null){
              console.log('yep')
            res.render('admin', {
              pairs: pairs[0].pairs
            });
          }else{
            res.render('admin');
          }

          }
        }).lean();
      } else
        res.redirect('/admin/login');
    } else
      res.redirect('/admin/login');
  });


  router.post('/admin/login', function (req, res) {
    if (process.env.user === req.body.username && process.env.pass === req.body.password) {
      res.setHeader('Set-Cookie', 'admin=true');
      res.redirect('/admin');
    } else {
      res.redirect('/admin/login');
    }
  });

  // GET Logout page
  router.get('/logout', function (req, res) {
    req.logout();
    res.send({'message':'ok'});
    //res.redirect('/login');
  });

  return router;
};


  // pairs[Math.floor(Math.random() * pairs.length)]

  // var arr=["Dilara", "Dilnaz", "Meena", "Mohsin", "Mariam", "Nana", "Nani", "Qaiser", "Sajid", "Sawleh", "Tariq", "Yousuf"]
  //
  // var pairs = [];
  // while(arr.length > 0) {
  //   for(var i = 0; i < arr.length; i++) {
  //     var random = Math.floor(Math.random() * arr.length);
  //     var pick1 = arr.splice(random, 1);
  //     var random2 = Math.floor(Math.random() * arr.length);
  //     var pick2 = arr.splice(random2, 1);
  //     console.log(pick1, pick2)
  //     pairs.push({name1: pick1, name2: pick2});
  //   }
  // }

  // console.log(pairs)

  // var shuffled=_.shuffle(arr)
  // var matchesLength=_.range(shuffled.length)
  // var newArray=[];
  // for(var i=0;i<shuffled.length;i++){
  // if(i===shuffled.length-1){
  //   User.findOne({name:shuffled[i+1]}, function(err,user){
  //     console.log('user:',user)
  //     User.findOneAndUpdate({name:shuffled[i]},{assignedUser:user._id})
  //   })
  //   newArray.push({'giver':shuffled[i], 'givee':shuffled[0]})
  // }else{
  //   User.findOne({name:shuffled[0]}, function(err,user){
  //     User.findOneAndUpdate({name:shuffled[i]},{assignedUser:user._id})
  //   })
  //   newArray.push({'giver':shuffled[i], 'givee':shuffled[i+1]})
  // }
  // }
  // var newNewArray=_.shuffle(newArray)
