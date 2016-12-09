/**
 * Created by a11 on 2016. 11. 27..
 */


var express = require('express');
var router = express.Router();
var async    = require('async');
var passport = require('passport')
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy; // localstratage 호출
var User = require('../model/user');
var Post = require('../model/post');

/*passport.serializeUser(function(user, done) {
  console.log("user--"+ user);
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log("id--"+ id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.use(passport.initialize());
router.use(passport.session());*/

passport.use('local-login', // localstratage 이름을 local-login
  new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function (req, email, password, done) {
      console.log("login start");
      User.findOne({email : email}, function(err, user){
        if (err) return done(err);
        console.log(user);
        if(!user){

          console.log("email doesn't exist.");
          return done(null, false);
        }
        console.log("email is checked.")
        if(user.password != password){

          console.log("Wrong password.");
          return done(null, false);
        }
        console.log("password is checked.")
        console.log(user);
        return done(null, user); // 성공시 user 객체를 이용해서 session 생성
      });

    })
);

//중복체크
function checkUserRegValidation(req, res, next){ // newuser정보 check
  var isValid  = true;
  var errmsg="";
  /*req.body.user = JSON;
  req.body.user.email = req.body.email;
  req.body.user.nickname = req.body.nickname;
  req.body.user.password = req.body.password;*/
  async.waterfall( // 비동기를 막기위한 async
    [function(callback){
      User.findOne({email: req.body.email},
        function(err,user){
          if(user){
            isValid = false;
            console.log("- This email is already resistered.");
            errmsg += "This email is already resistered.";
          }
          callback(null, isValid);
        }
      );
    }, function(isValid, callback) {
      //User.findOne({nickname: req.body.user.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
      User.findOne({nickname: req.body.nickname},
        function(err,user){
          if(user){
            isValid = false;
            console.log("- This nickname is already resistered.");
            errmsg += "This nickname is already resistered.";
          }
          callback(null, isValid);
        }
      );
    }], function(err, isVaild){
      if(err) return res.json({data:{error:err,data:""}});
      if(isVaild){
        return next();
      }
      else{
        res.json({data:{error:errmsg,data:""}});
      }
    }

  );
}



//user 가입
router.post('/register', checkUserRegValidation, function(req, res, next){
    var user = new User({
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password
    });

    user.save(function(err,user){
        if(err){
            console.error(err);
            next(err);
            return res.json({data:{
              error:err,
              data:""
            }});
        }
        console.log("User is registered.")
        res.json({data: {
          error: "",
          data: user
        }
        });
    });
});
//내 정보 보기
router.get('/info', function(req, res){
    Post.find({nickname: req.user.nickname}, function(err, user){
        if(err) return res.json({data:{error: "Database failure",data:""}});
      console.log("User information is searched.")
      res.json({data:{
        error:"",
        data:user
      }});
    });
});


//User있는지 체크 후 로그인 성공 or 실패
router.post('/login', passport.authenticate('local-login'),function (req, res, err) {

    console.log("authenticate is completed.")
    res.json({
        data: {
          error: "",
          data: ""
        }
      });
});

router.post('/loggedin',function (req,res,err) {
    if(req.user){
      res.json({
        data:{
          error:"",
          data:req.user
        }
      })
    }else{
      res.json({
        data:{
          error:"User doesn't exist",
          data:""
        }
      })
    }
})

router.post('/logout', function(req, res){ // logout으로 접속시 logout한다.
  if(!req.user) {
    console.log("Log-out failed.")
    res.json({data:{
      error: "can't access " + JSON.stringify(req.user),
      data:""
    }});
  }
  else {
    console.log("Log-out completed.")
    req.logout();// pasport에서 제공하는 logout 함수
    res.json({data:{
      error:"",
      data:""
    }})
  }

});

module.exports = router;
