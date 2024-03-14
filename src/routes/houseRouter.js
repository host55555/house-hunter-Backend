const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads')
const House = require('../models/house.model');
const {addHouse,allHouses,getAllHouses,
    houseId,houseUpdate,deleteHouse, searchHouses,sortAscOrder,filterBedsitters} = require('../controllers/houseController')
const {protect} = require('../middlewares/protect')


//REQUEST GET ALL THE HOUSES by users
router.get('/all-houses',allHouses)
//get all houses by agents 
router.get('/myproperties', protect, getAllHouses)
//REQUEST ADD NEW HOUSE
router.post('/addhouse',protect,upload.array("images"), addHouse)
//REQUEST FIND HOUSE BY ID 
router.get('/house/:id',houseId)
//find house by id and update
router.put('/update/house/:id',protect,houseUpdate)
//find house by id and delete
router.delete('/delete/house/:id',protect, deleteHouse)
//filter houses 
router.get('/search-houses/:query', searchHouses)
//sort by creteria
router.get('/sort' , sortAscOrder)
//filter bedsitters
router.get('/bedsitters',filterBedsitters)




module.exports = router;