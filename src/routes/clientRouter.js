const express = require('express')
const router = express.Router()
const {Book, getClients,getAgencyClients} = require('../controllers/clientControllers')
const {protect} = require('../middlewares/protect')
//client booking route
router.post('/booking/:id',Book)
//fetch clients route
router.get('/all', getClients)
//fetch clients by agency
router.get('/my-clients',protect,getAgencyClients)

module.exports = router      