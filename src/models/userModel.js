const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userShema = new Schema({
    agency:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    resetToken:{type:String},
    
});

const User = mongoose.model("User", userShema);

module.exports = User;   