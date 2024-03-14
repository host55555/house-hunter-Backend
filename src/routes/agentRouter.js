const express = require('express')
const router = express.Router()
const {adminProtect} = require('../middlewares/protect')
 const {registerAgent, createAccount, loginAgent, resetPassword,verifyResetPassword,EditAgent,getAgentById} = require('../controllers/agentController')

 //agent creating an account by admin
 router.post('/register',adminProtect, registerAgent)
 //agent credentials by agent
 router.post('/createAccount',createAccount)
 //agent login
 router.post('/login', loginAgent)
 //get egent by id
 router.get('/agentbyid/:id', getAgentById);
 //sending otpcode
 router.post('/reset-password', resetPassword)
 //verify otp
 router.post('/verify-otp', verifyResetPassword)
 //edit agents
 router.put('/update/:id',)
 //delete agent
 router.delete('/delete/:id')
 //get agent
 //router.get('/me', getAgent)


 module.exports = router   
