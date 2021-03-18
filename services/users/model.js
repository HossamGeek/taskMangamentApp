const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let collectionName = 'user'

const user = new Schema({
    _id             :   { type: Schema.ObjectId, auto: true },
    username       :   {type:String,unique:true},
    password:   String,
    email:  String,
    genrated_code:String,
    is_confirmed:{type:Boolean,default:false},
    role:   {
        type: String,
        enum : ["user","admin"],
        default: 'user',
    },
});


//Register Model..
const user_model =mongoose.model(collectionName,user,collectionName);
module.exports = user_model;