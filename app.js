var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var async = require('async');

var routes = require('./routes/main');
var bbs = require('./routes/bbs');
var user = require('./routes/user');
var nation = require('./routes/nation');
// routes폴더안의 js파일 위치

//DB connection
mongoose.connect('mongodb://localhost:27017/project');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function callback(){
  console.log("mongo db connection ok.");
});
var MongoDBStore = require('connect-mongodb-session')(session)
var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/project",
  collection: 'sessions'
});

//DB schema import
var User = require('./model/user');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


passport.serializeUser(function(user, done){
   done(null, user.id);
}); // 세션 생성시 어떤 정보 저장할지 설정한다.
//user객체를  받아서, user.id를 세션에 저장
//id는 username이 아닌 db의 id

passport.deserializeUser(function(id, done){

  User.findById(id, function(err, user){
     done(err, user);
  })
}); //  session으로 부터 개체를 가져올때 어떻게 가져오는지 설정
//현재 id를 넘겨받아 DB에서 user를 찾고 user를 가져온다
//이렇게 가져온 user는 req.user에서 session이 유지되고 있는 동안에 언제든지 접근


app.use(session({
  saveUninitialized: true,
  secret: 'footprint',
  resave: false
}));
app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret:'MySecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/user', user);
app.use('/post', bbs);
app.use('/getgeo', nation);

//routes함수의 js파일을 주소와 연결


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
