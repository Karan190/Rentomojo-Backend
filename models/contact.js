const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema=new Schema({
    fullname:{
        type:String,
        required:true
    },
    phone:
    {
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:[true,'Email already exist']
    }
})
contactSchema.indexes([{'fullname':'text'},{email:1}]);

const Contact=mongoose.model('Contact',contactSchema);
// Contact.createIndexes();
module.exports=Contact;