/**
 * Created by a11 on 2016. 11. 21..
 */

/* GET users listing. */

var express = require('express');
var router = express.Router();
var Post = require('../model/post');
var User = require('../model/user');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var image_urls = require('../assets/image_url');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(req, res, next) {
    console.log(req.user);
    Post.find(req.query,{markers:0,__v:0}).sort({number:-1}).exec(function(err,posts){
        //	console.log(req.query);
        if(err) return res.json({data:{error: 'Database failure',data:""}});
        console.log(posts);
        res.json({data:{
            error:"",
            data:posts,
            user:req.user
        }});
    })
});

router.get('/:number',function (req,res) {
    Post.findOne({number:req.params.number},function (err,post) {
        if(err) return res.json({data:{error: "Post doesn't exist",data:""}});
        console.log(post);
        res.json({data:{
            error:"",
            data:post
        }});
    })
})

//게시글 쓰기

router.post('/',function (req,res) {
    console.log("Write post"+req.user);
    var date = new Date();
    //save the post in DB
    console.log(req.body.title);
    var post = new Post(req.body);
    post.author = req.user.nickname;
    post.number = date.getTime();
    post.image_url = image_urls[req.body.nation];
    post.save(function(err) {
        if (err) {
            console.error(err);
            res.json({data:{
                error:"Can't save the post ",
                data:""
            }});
            return;
        }
        res.json({data:{
            error:"",
            data:""
        }});
    });

})
/*router.post('/', function(req, res){


  console("Write post:"+ req.user);
/*var date = new Date();
//save the post in DB
  console.log(req.body.title);
  var post = new Post(req.body);
  post.nickname = req.user.nickname;
  post.number = date.getTime();

  post.save(function(err) {
      if (err) {
        console.error(err);
        res.json({data:{
          error:"Can't save the post ",
          data:""
        }});
        return;
      }
    res.json({data:{
      error:"",
      data:""
    }});
    });


});*/
router.get('/del/:number',function(req,res){
    var nickname="";
    Post.findOne({number:req.params.number},function (err,post) {
        if (err) return res.json({data: {error: "Post doesn't exist", data: ""}});

        console.log(post);
        nickname = post.author;

        if (nickname == req.user.nickname) {
            Post.remove({number: req.params.number}, function (err) {
                if (err) return res.json({data: {error: "Can't delete the post", data: ""}})

                res.json({data: {error: "", data: "Completely deleted."}})

            })

        } else {
            console.log(req.user);
            res.json({
                data: {
                    error: "Authorization failed.",
                    data: ""

                }

            });

        }
    })


})
module.exports = router;
