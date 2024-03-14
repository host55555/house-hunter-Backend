const express = require('express')
const router = express.Router()

const {adminSignUp, adminLogin,allAgents} = require("../controllers/adminController")
const {protect}=require('../middlewares/protect')
//admin sign up
router.post('/signup', adminSignUp)
//admin login
router.post('/login',adminLogin)
//fetch agents
router.get('/all-agents',protect,allAgents)   


module.exports = router