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
    role: {type: String, enum:['customer', 'admin', 'superAdmin', 'user'], default: 'user'}
    
    
});

// UserSchema.pre('save', function(next){

//     let user = this;
//     let SALT_FACTOR = 10;

//     //hash password if its new or modified
//     if(!user.isModified('password')) return next();
    
//     // //gen salt
//     // bcrypt.genSalt(SALT_FACTOR, function(err, salt){
//     //     if(err) return next(err);
//     //     //hash password with salt
//     //     bcrypt.hash(user.password, salt, function(err, hash){
//     //         if(err) return next(err);
//     //         user.password = hash; 
//     //         console.log(user.password);
//     //          return next();
//      //   });
//     //});

// });

let User = mongoose.model('User', UserSchema);
module.exports = User;