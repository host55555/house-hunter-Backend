const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Agent = require('../models/agentModel')
const User = require('../models/userModel')
const secret = process.env.SECRET
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const validator = require('email-validator')
//transpoter
const transpoter = nodemailer.createTransport({    
    service:'gmail',
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
})
//validate email
const validateEmail=(email)=>{
    return validator.validate(email)
}
//@desc register new agent
//@route POST api/agents
//private
const registerAgent = asyncHandler (async(req,res)=>{
    const {agency, location, address,contacts,email} = req.body
     //check if all fields are availble
     if(!agency || !location || !address || !contacts || !email){
        res.status(400)

        throw new Error('All fields are required!!')

     }
     // check if user exists
     const agentExist = await Agent.findOne({email: email})
     if(agentExist){
        res.status(400)
         throw new Error('Agent already exists!!')
     }

     //add a new agent
     const agent = await Agent.create({
        agency,
        location,
        address,
        contacts,
        email
     })
     if(agent){
        res.status(201).json({agent})
     }else{
        res.status(401)
        throw new Error('User not found!!')
    }
})

//@desc create user account
//@route POST api/agents
//public
const createAccount = asyncHandler(async (req, res)=>{
    const {agency,email, password} = req.body

    //check for empty fields
    if(!agency ||!email || !password){
        res.status(400)
        throw new Error('All fields are required!!')
    }
    //check if email is registered in agents database
    const emailRegistered = await Agent.findOne({email:email})

    if(emailRegistered){
        //check if user account exists
        const userExists = await User.findOne({email: email})
        if(userExists){
            res.status(400)

            throw new Error('User Already Exists!!')
        }
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //create user
        const user = await User.create({
            agency,
            email,
            password: hashedPassword,
        })

        if(user){
            res.status(200).json("user registered successfully")
        }else{
            res.status(400)
            throw new Error('something went wrong!!!')
        }
    }else{
        res.status(401).send('Email is not registered Contact admin!!')
    }
})
//@desc login user 
//@route POST api/login
//public
const loginAgent = asyncHandler(async(req,res)=>{
    const {email, password} = req.body
    //check if user exists
    const user = await User.findOne({email: email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,      
            agency:user.agency,
            email:user.email,
            token: generateToken(user._id)
        })
    }else{
        return res.status(401).send('User Not found')
    }
})
//generate token
 const generateToken = (id)=>{
    

    return jwt.sign({id}, secret,{
        expiresIn: '30d',      
    })
 }
 //mail options
 const generateOTP=()=>{
    return otpGenerator.generate(6,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
 }
 //reset password 
 const resetPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const isValidEmail = validateEmail(email);
    

    try {

        if(!isValidEmail){
            res.status(400).json({message:"Email is invalid!!"})
        }
        //find user by email
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(404).json({message:"User not found!!"})
        }
        //generate OTP
        const otpCode = generateOTP();
        //update user's register Token
        user.resetToken = otpCode;
        await user.save();

        //sendOTP via email
        const mailOptions={
            from:process.env.USER,
            to:email,
            subject:"Password Reset OTP",
            text:  `Your OTP code is:${otpCode}`
        }
        await transpoter.sendMail(mailOptions)
        res.status(200).json({message:"OTP code has been sent to your email"})
    } catch (error) {
        res.status(400).json(error)
    }
 })
 const verifyResetPassword = asyncHandler(async(req,res)=>{
    const {email,otpCode,newPassword} = req.body

    try {
        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({message:"user not found"})            
        }
        //verify OTP code
        if(user.resetToken !== otpCode){
            res.status(400).json({message:"Invalid OTP code"})
        }
       //hashnew password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(newPassword,salt)
        //update user's password
        user.password = hashedPassword;
        user.resetToken='';
        await user.save();
        const mailOptions={
            from:'househunterplatform@gmail.com',
            to:email,
            subject:"Password reset Successful",
            text:  `Your have successfully reset your password.`
        }
        await transpoter.sendMail(mailOptions)
        res.status(201).json({message:"Password reset successful"})
    } catch (error) {
        
    }
 })
 //edit agents details
 const EditAgent=asyncHandler(async(req,res)=>{
    try {
        const newAgent = await Agent.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        })
        res.status(200).json("User details updated successfuly")
    } catch (error) {
        res.status(400).json(error)
    }
 })
 //delete agents
 const deleteAgent = asyncHandler(async(req,res)=>{
    const agent = await Agent.findById(req.params.id)
    try {
        await agent.remove()
        res.status(200).json("Agent was deleted successfully")
    } catch (error) {
        res.status(400).json(error)
    }
 })
 //get agenmt by id
 const getAgentById = asyncHandler(async(req,res)=>{
    const agent = await Agent.findById(req.params.id)
    if(agent != null){
        return res.status(200).json(agent);
    }else{
        return   res.status(500).json('No such agent found')
    }
   })



module.exports ={
    getAgentById,
    registerAgent,
    createAccount,
    loginAgent,
    secret,
    resetPassword,
    verifyResetPassword,
    EditAgent,
    deleteAgent
}