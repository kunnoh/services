const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//services schema

const servceSchema = new Schema({
    uniqId:{type: String, required: true},
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    category:{type: String, required: true},
    location:{type: String, required:true}
});

const Servces = mongoose.model('services', servceSchema);

module.exports = Servces;