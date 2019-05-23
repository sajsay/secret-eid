var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: true
  },
  wishlist: {
    type: String
  },
  assignedPerson: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

var pairSchema = new mongoose.Schema({
  pairs: [],
  id: { type: Number }

});

var FollowsSchema = new mongoose.Schema({
  following: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  follower: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  }
});


// Arr=['Sajid', '', '', '']
//
//
//
// user.find from an array
// object.name
// create new schemas
// .splice() or .pop()



// var tweetSchema = new mongoose.Schema({
//
// });
//
// userSchema.methods.getFollows = function (callback){
//
// }
// userSchema.methods.follow = function (idToFollow, callback){
//   Follow.findOne({follower: following }, function(err, result){
//     if (err) {
//
//     } else if (result) {
//
//     } else {
//       var newFollow = new Follow({ follower: following });
//       newFollow.save(function(err){
//         if (err) {
//
//         } else {
//
//         }
//       });
//     }
//   });
// }
//
// userSchema.methods.unfollow = function (idToUnfollow, callback){

// }
// userSchema.methods.getTweets = function (callback){
//
// }
//
//
// tweetSchema.methods.numLikes = function (tweetId, callback){
//
// }


var User = mongoose.model('User', userSchema);
var Pairs = mongoose.model('Pairs', pairSchema);

// var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Pairs: Pairs,
  Follow: Follow
};
