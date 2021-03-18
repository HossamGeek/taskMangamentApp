const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let collectionName = 'task'

const task = new Schema({
    _id             :   { type: Schema.ObjectId, auto: true },
    createdBy       :   {type:String,ref:'user'},
    email:String,
    phone:String,
    depart_id:{type:String,ref:"department"},
    name:String,
    responsible_name:String,
    status:  {
        type: String,
        enum : ["pending","done","confirm","deactivate"],
        default: 'pending',
    },
   
});


//Register Model..
const task_model =mongoose.model(collectionName,task,collectionName);
module.exports = task_model;