const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt =require('jsonwebtoken');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('morgan');
const mongoose =require('mongoose');
const config = require('./config/database');



//connect to mongodb
mongoose.set('useCreateIndex', true);
mongoose.connect(config.database, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

let db = mongoose.connection;

//check db errors
db.once('open', function(){
  console.log('connection to the database established');
}).on('error', function(error){
  console.log(error);
});


//routes

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true })); 

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir: __dirname + '/views'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//expressvalidator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg : msg,
      value : value
    }
  }
}));

app.use(cookieParser());

//express session middleware
app.use(session({
  secret: 'secret123',
  saveUninitialized: true,
  resave: true
}));


// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());



 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
app.use(flash());

//express messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
// Initialize Passport
let initPassport = require('./passport/init');
initPassport(passport);

//app.use(expressJwt({secret: 'mysecretcantbeshared'}).unless({path: ['/', '/login']}));


let indexRouter = require('./routes/index')(passport);
let adminRouter = require('./routes/admin');
let skservRouter = require('./routes/skserv');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/skserv', skservRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
