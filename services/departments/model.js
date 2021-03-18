const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let collectionName = 'department'

const depart = new Schema({
    _id             :   { type: Schema.ObjectId, auto: true },
    createdBy       :   {type:String,ref:'user'},
    depart_name:   {type:String,unique:true},
    depart_id:   {type:String,unique:true},
   
});


//Register Model..
const depart_model =mongoose.model(collectionName,depart,collectionName);
module.exports = depart_model;