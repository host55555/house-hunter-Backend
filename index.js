const express = require('express');
const cors = require('cors')
const connectDb =require('./src/config/db')
 require('dotenv/config')
//import routes
const houseRouter = require('./src/routes/houseRouter')
const agentRouter = require('./src/routes/agentRouter')
const adminRouter = require('./src/routes/adminRouter')
const clientRouter = require('./src/routes/clientRouter')
//creating app
const app = express();
//middleware
app.use(express.json());        
app.use(cors())      
//routes
app.use('/api/house',houseRouter);
app.use('/api/agents',agentRouter);   
app.use('/api/admin', adminRouter);
app.use('/api/clients', clientRouter);     
             
    

const port = process.env.PORT                         
     

    
//home route
  


//server starting
app.listen(port, ()=> {    
    console.log(`Server started on: http://localhost:${port}`)
})      
