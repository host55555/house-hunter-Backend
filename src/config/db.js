const mongoose = require('mongoose')
require('dotenv/config')
let mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL)

let db = mongoose.connection;

db.on('connected', ()=>{
    console.log(`Mongo Db connection successful`)

});

db.on ('error',()=>{
    console.log(`Mongo db connection failed`)       

})

module.exports = mongoose
