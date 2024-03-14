const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {secret} = require("../controllers/agentController")
const Admin = require("../models/adminModel")
const Agent = require('../models/agentModel')
//@desc register Admin
//@router POST /api/admin
//public
const adminSignUp = asyncHandler (async (req, res)=>{
    
        const {username, password} = req.body

        if(!username || !password){
            res.status(400)
            throw new Error("All fields are required!!");
        }
        //check if admin exists
        const admins = await Admin.find();
        if(admins.length !==0 ){
            res.status(401)
            throw new Error("Only one Admin account is allowed!!")
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //create user
        const admin = await Admin.create({
            username,
            password: hashedPassword    
        })        

        if(admin){
            res.status(201).json({admin})
        } else{
            res.status(400)
            throw new Error("Something Went Wrong!!")
        }   
})
//@desc Admin login
//@router POST /api/admin
//public
const adminLogin= asyncHandler( async (req,res)=>{
    const {username, password} = req.body
    const admin = await Admin.findOne({username:username})
    if(admin && (await bcrypt.compare(password, admin.password))){
        res.status(200).json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin.id)
        })
    }

})

//generate token
const generateToken=(id)=>{
    return jwt.sign({id}, secret,{
        expiresIn: '1d',
    })
}
//fetch agents by admin
const allAgents=asyncHandler(async(req,res)=>{
        const agents = await Agent.find()
        if(agents){
            res.status(200).json(agents)
        }else{
            res.status(404).json("No agents found.")
        }
})


module.exports = {
    adminSignUp,
    adminLogin,
    allAgents
}