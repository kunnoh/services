const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    email:{type: String, required: true},
    password:{type: String, required: true},
    resetPasswordToken:{type: String},
    resetPasswordExpires: {type: Date},
    role: {type: String, enum:['customer', 'admin', 'superAdmin'], default: 'user'}
    
    
});

UserSchema.pre('save', function(next){
    let User = this;
    let SALT_FACTOR = 10;

    if(!User.isModified('password')) return next();
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err) {
            console.log(err);
            return next(err);
        }

        //gen hash
        bcrypt.hash(User.password, salt ,function(err, hash){
            if(err){
                console.log(err);
                return next(err);
            } else {
                User.password = hash;
                next();
            }
        });
    });
});



var User = mongoose.model('User', UserSchema);
module.exports = User;