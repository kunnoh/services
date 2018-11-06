const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemail =  require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const expressValidator = require('express-validator');



const isAuthenticated = function(req, res, next){
  	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

  if(req.isAuthenticated())
    return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

module.exports = function(passport){
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', {title: 'Sokokapu home'});
  });
  
  //login route
  router.get('/login', function(req, res, next){
    res.render('login', {title: ' Sokokapu login'});
  });
  
  //login process
   router.post('/login', passport.authenticate('login', {
     successRedirect:'/skserv',
     failureRedirect: '/login', 
     failureFlash: true
  }));

  
  //register route
  router.get('/signup', function(req, res){
    res.render('register', {
      title: ' Sokokapu Register',
  });
  });
  
  //register user 
  router.post('/signup', passport.authenticate('signup',{
    successRedirect:'/login',
    failureRedirect: '/signup',
    failureFlash: true
  }), function(req, res){
    if(errors)
    console.log('error in password matching');
    res.render('register');
  });
  

  //forgot password route
  router.get('/forgotpass', function(req, res){
    res.render('forgotpassword');
  });

  router.post('/forgotpass', function(req,res){
    async.waterfall([
      function(done){
        crypto.randomBytes(20, function(err, buf){
          let token = buf.toString('hex');
          done(err, token);
          console.log(token);
        });
      },
      function(token, done){
        User.findOne({email:req.body.email}, function(err, user){
          let email = req.body.email;
          if(!user){
            console.log('user with email' +email+ ' does not exist');
            req.flash('danger','user with email' +email+ ' does not exist');
            return res.redirect('/forgotpass');
          } else {
            //get token for the user with that email
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;

            //save user token
            user.save(function(err){
              done(err, token, user);
              console.log(user);
            });

            console.log(user.username);
            return res.redirect('/passreset');
          }      
        });
        console.log('reseting password');
      },
      function(token, user, done){
        let smtpTransport = nodemail.createTransport({
          service: 'Gmail',
          auth: {
            user: 'alvindereba@gmail.com',
            pass: 'sportpesa2'
          }
        });
      var mailOptions = {
        to: user.email,
        from: 'alvindereba@gmail.com',
        subject: 'Sokokapu Password Reset',
        text: 'you requested for a password reset. if you didnt request, ignore this. follow this link to set new password or copy paste it to the browser.http://' + req.headers.host + '/passreset/' + token,
        };

        smtpTransport.sendMail(mailOptions, function(err){
          console.log('mail.sent');
          console.log(mailOptions);
          req.flash('success', 'an email has been sent to ' + user.email);
          done(err, 'done');
        });
      }

    ], function(err){
      if(err){
        console.log(err);
        res.redirect('/forgotpass');
        return next(err);
        
        
      }
    });
  });


  //
  router.get('/passreset',function(req, res){
    res.render('passreset');
  });
  //passwordreset route
  router.get('/passreset/:token', function(req,res){
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}}, function(err, user){
      if(! user){
        console.log('not authorized');
        req.flash('error', 'Password token invalid or expired');
        return res.redirect('/forgotpass');
      } else{
          res.render('passwordreset', {token: req.params.token});
          console.log('you can now reset password');
          console.log(user);
      }

    });
  });


  router.post('/passreset/:token', function(req, res){
    async.waterfall([
      function(done){
        User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now() }},
        function(err, user, next){
          if(!user){
            req.flash('error', 'Password reset token expired or invalid');
            return res.redirect('/forgotpass');
          }

          //validate password
          let newpassword = req.body.newpassword;
          let confirmpassword = req.body.confirmpassword;

          req.checkBody('newpassword','password is required').notEmpty();
          req.checkBody('confirmpassword','passwords dont match').equals(req.body.newpassword);

          let errors = req.validationErrors();

          if(errors.length > 0){
            console.log(errors);
            return;
          } else {
          user.password = newpassword;
          user.resetPasswordExpires = undefined;
          user.resetPasswordToken = undefined;
          console.log(user);
          console.log('am here now');
          }



          user.save(function(err){
            if(err){
              console.log(err);
              return res.redirect('/');
            } else {
              console.log('her now savin new password');
              req.logIn(user, function(err){
                done(err, user);
              });
            }
          });
        });
      },
    ]);
  });


  //logout route
  router.get('/logout', function(req, res){
    req.logout(req.flash('success', 'successfully logged out'));
    res.redirect('/');
  });
  //global route
router.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

  return router;
};