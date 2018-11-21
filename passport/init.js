const login = require('./login');
const signup = require('./signup');
const User = require('../models/user');

module.exports = function(passport){
    //passport serialize and deserialize
    passport.serializeUser(function(user, done){
        console.log('serializing user: ');
        console.log(user._id);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            console.log('deserializin user: ',user._id);
            done(err, user);
        });
    });

    //setup passport startegy for login and signup
    login(passport);
    signup(passport);
    

};