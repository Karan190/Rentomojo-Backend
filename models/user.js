const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema=new Schema({
    
    email:{
        type:String,
        required:true,
        unique:[true,'Email already exist']
    },
    password:{
        type:String,
        required:true
    }
})


module.exports=mongoose.model('User',userSchema);