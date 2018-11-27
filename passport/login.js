const LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');




module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        }, function(req, username, password, done) { 
            // check in mongo if a user with username exists
            User.findOne({ username : username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(password, user)){
                        console.log('Invalid Password');
                        return done(null, false,req.flash('message', 'Invalid Password')); // redirect back to login page
                    
                    }

                    else{
                        console.log('login successful');
                    }                  
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user, req.flash('success','Dear: '+user.username, 'you are now logged in. book a service'));
                }
            );
            
        })
    );


    let isValidPassword = function(password, user){
        console.log(user);
        return bcrypt.compareSync(password, user.password);
    };
};