const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const Admin = require('../models/adminModel')
const {secret} = require("../controllers/agentController")
const adminProtect = asyncHandler(async(req,res, next)=>{
    let token

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
            try {
                //get token from headers
                token = req.headers.authorization.split(' ')[1]

                //verify token 
                const decode = jwt.verify(token, secret)

                //get user from the token

                req.admin = await Admin.findById(decode.id).select('-password')
                next()

            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error('Not authorized')      
                
            }
           
        }
        if(!token){
            res.status(401)
            throw new Error('Not authorized, no token')
        }
}) 
const protect = asyncHandler(async (req, res,next)=>{
    let token 

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
            try{
                //get token from header
                token = req.headers.authorization.split(' ')[1]

                //verify token 
                const decode = jwt.verify(token, secret)

                //get user from the token

                req.user = await User.findById(decode.id).select('-password')
                next()

            }catch(error){
                console.log(error)
                res.status(401)
                throw new Error('Not authorized')       

            }
        }     

        if(!token){
            res.status(401)
            throw new Error('Not authorized, no token')
        }
})

module.exports = {
    adminProtect,
    protect
}          


