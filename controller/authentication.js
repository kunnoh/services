const fs = require('fs');
const jwt = require('jsonwebtoken');


const publickey = require('../config/rsakeys/publickey.pem');
const privatekey = require('../config/rsakeys/privtekey.pem');

function generateToken(user){
    return jwt.sign(user, publickey, {expiresIn: 3600});
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

exports.login = function(req, res, next){
    const userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
    });
}

exports.register = function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if(!email){return res.status(422).send({error: 'you must enter a valid email address'});}
    if(!password){return res.status(422).send({error:'you must enter a password'});}

    User.findOne({email: email}, function(err, existingUser){
        if(err) {return next(err);}
        if(existingUser){return res.status(422).send({error: 'User with that email already exist'});}
        else{
            const user = new User({
                email:email,
                password: password,
                role: role
            });
            user.save(function(err, user){
                if(err){return next(err);}
                const userInfo = setUserInfo(user);

                res.status(201).json({
                    token: 'JWT' + generateToken(userInfo),
                    user: userInfo
                });
            });
        }
    });
}

exports.roleAuthorization = function(roles){
    return function(req, res, next){
        const user = req.user;

        User.findById(user._id, function(err, foundUser){
            if(err){res.status(422).json({error: 'no user found'});
            return next(err);
        }
        if(role.indexOf(foundUser.role) > -1){return next();}
        res.status(404).json({error: 'You are not authorized to view this page'});
        return next('unauthorized');
        });
    }
}