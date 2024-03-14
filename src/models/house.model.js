const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const houseShema = new Schema({
    owner:{type: String, required: true},
    contacts:{type:String,required:true},
    desc: {type: String, required: true},
    amount: {type:String, required: true},
    quantity: {type:String, required: true},
    category: {type:String, required: true},
    location: {type:String, required: true},
    images:{type: [], required:true},
    user:{type: String}
   //owner,desc,amount,quantity,category,location,image    
       
});

const House = mongoose.model("House", houseShema);

module.exports = House;