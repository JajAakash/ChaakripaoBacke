const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const userSchema=new Schema({
    userName:{type:String, required:true},
    googleid:{type:String, required:true},
    email:{type:String, required:true},
    photoUrl:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true}

});

const User=mongoose.model('user',userSchema,'USER')
module.exports=User;