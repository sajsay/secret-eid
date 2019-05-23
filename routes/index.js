var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;
var _ = require('underscore');


// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});



router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/', function (req, res) {
  res.send("Success! You are logged in.");
});

router.get('/users', function (req, res, next) {

  // Gets all users
  User.find({}, function (err, user) {
    console.log(user)
    if (err) {
      res.send({ 'message': err.message })
    } else {
      res.send({
        data: user,
        'message': 'success'
      })
    }
  });
});

router.get('/pairs', function (req, res, next) {

  // Gets all pairs
  models.Pairs.find({ 'id': 1234 }, function (err, pairs) {
    console.log(pairs)
    if (err) {
      console.log(err.message)
      res.send({ 'message': err.message })
    } else {
      res.send({
        data: pairs
      })
    }
  });
});

router.get('/secreteid', function (req, res) {
  console.log('req user:', req.user)
  if (req.user.assignedPerson) {
    User.findById(req.user.assignedPerson, function (err, assignedUser) {
      console.log('assigned User :', assignedUser)
      if (err) {
        console.log(err)
      } else {
        res.render('secreteid', {
          name: req.user.name,
          wishlist: req.user.wishlist,
          assignedName: assignedUser.name,
          assignedWishList: assignedUser.wishlist,
        })
      }
    })
  } else {
    res.render('secreteid', {
      name: req.user.name,
      wishlist: req.user.wishlist,
    })
  }
})

router.post('/secreteid', function (req, res) {
  User.findByIdAndUpdate(req.user._id, { $set: { wishlist: req.body.wishlist } }, { new: true }, function (err, user) {
    if (err) return handleError(err);
    res.redirect('/secreteid');
    res.render('secreteid', {
      name: req.user.name,
      wishlist: req.body.wishlist
    })
  });
  console.log(req.body);

})

router.get('/users/:userId', function (req, res, next) {
  User.findById(req.params.userId, function (err, user) {
    res.render('singleProfile', {
      user: user
      // user: {
      //   email: user.email
      // }
    });
  });
});


// Creates a follower

router.post('/users/:userId/follow', function (req, res) {
  req.user.follow(req.params.userId, function (err) {
    if (err) {
      console.log(err);
      res.send(err.message);

    } else {
      res.direct('/users/' + req.params.userId);
    }
  })
  // Create a new follower
});


router.get('/tweets/', function (req, res, next) {

  // Displays all tweets in the DB

});


router.post('/tweets/:tweetId/likes', function (req, res, next) {

  //Should add the current user to the selected tweets like list (a.k.a like the tweet)

});


router.get('/tweets/new', function (req, res, next) {

  //Display the form to fill out for a new tweet

});


router.post('/tweets/new', function (req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB


});



router.get('/rand', function (req, res) {
  models.User.find({}, function (err, users) {
    //console.log('users :', users)
    if (err) {
      console.log(err.message)
      res.send('no')
    } else if (users.length != 12) {
      res.send('not 12')
    } else {
      randomizer(function (pairs) {
        console.log('pairs in /admin', pairs)
        res.send('goo')
        /*  res.render('admin', {
            cellName: null, //invoke
          }); */
      })
    }
  })
})

module.exports = router;
