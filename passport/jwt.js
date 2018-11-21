

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const User = require('../models/user');

module.exports = function(passport){
    const opts = {};

     opts.jwtFromRequest = ExtractJwt;
     opts.secretOrKey = fs.readFileSync(__dirname +'/../config/rsakeys/private.key', 'utf8');
     
     console.log(toString(opts.jwtFromRequest));
     passport.use(new JwtStrategy(opts, function(token, done){
         console.log('niko hapa');
        console.log(token);
         User.findOne(token.userid, function(err, user){
             if(err){return done(err, false);}
             if(user){return done(null, user);}
             else{return done(null, false);}
         });
     }));
};