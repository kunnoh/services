let LocalStrategy   = require('passport-local').Strategy;
let User = require('../models/user');
let bcrypt = require('bcryptjs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var email = req.body.email;
            var cPassword = req.body.cPassword;

            //form validator
            req.checkBody('username','username required').notEmpty();
            req.checkBody('firstName', 'firstname is required').notEmpty();
            req.checkBody('lastName','firstname required').notEmpty();
            req.checkBody('email', 'lastname is required').isEmail();
            req.checkBody('password', 'password is required').notEmpty();
            req.checkBody('cPassword', 'password do not match').equals(req.body.password);

            var errors = req.validationErrors();

            if(errors.length > 0){
                console.log(errors);
                return done(null, false,{message:'password dont match'});
            } else {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ username :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists with that username'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User({
                        username:username,
                        password:createHash(password),
                        email:email,
                        firstName:firstName,
                        lastName:lastName
                        });

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err; 
                            }
                            console.log('User Registration succesful');    
                            console.log(newUser);
                            return done(null, newUser, req.flash('success','you are now registred, you can login'));
                        });
                    }
                });
            };

        }
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
    // Generates hash using bCrypt
    let createHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };

};