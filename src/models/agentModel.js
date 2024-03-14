const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const agentShema = new Schema({
    agency:{type:String,required: true},
    location:{type:String, required:true},
    address:{type:String, required:true},
    contacts:{type:String, required:true},
    email:{type:String, required:true},
});

const Agents = mongoose.model("Agents", agentShema);

module.exports = Agents;