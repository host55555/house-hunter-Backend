const express = require('express')
const upload = require('../middlewares/uploads')

const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary')

const asyncHandler = require('express-async-handler')

const House = require('../models/house.model')
const User = require('../models/userModel')

//desc Get Houses 
//@route GET /api/houses
//@access Public 
//fetching houses from the clients
const allHouses = asyncHandler(async (req, res) => {
   
    const houses = await House.find()
    
    res.status(200).json(houses)    
})
//desc Get Houses 
//@route GET /api/houses
//@access Public 
//fetching houses by agents
const getAllHouses = asyncHandler (async (req, res)=>{
    const houses = await House.find({user: req.user.id})
    res.status(200).json(houses)
})



//desc Set Houses
//@route POST /api/assets
//@access Private
const addHouse = asyncHandler(  async(req, res) => {
    const { owner,contacts, desc, amount, quantity, category, location } = req.body  
    

    //check if fields are epmty
    if (!owner ||!contacts || !desc || !amount || !quantity || !category || !location) {
        res.status(400)
        throw new Error("All fields are required");

    }
    try {
        const urls = [];
        //upload Image to cloudinary

        for(let i = 0; i< req.files.length; i++){
            const data = await uploadToCloudinary(req.files[i].path, "test-one")
            urls.push(data.url)
        }
       
        //save Image url  to the database
        const imageUrl = urls
        const house = new House({
            owner,
            contacts,
            desc,        
            amount,
            quantity,
            category,
            location,    
            images: imageUrl,
            user: req.user.id 
           
        })

        await house.save();
        res.status(200).json(house)
    
        
    }catch (error) {
        res.status(400).send(error);
    }
})
//get house by id
const houseId = asyncHandler (async (req,res)=>{
    const house = await House.findById(req.params.id)
    if(!house){
        res.status(400)
        throw new Error("House not found!!")
    }

    res.status(200).json(house)
})
//update house
const houseUpdate = asyncHandler (async (req, res)=>{
    const house = await House.findById(req.params.id)
    //chect if house exists
    if(!house){
        res.status(400)
        throw new Error("House not found!!")
    }

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(400)
        throw new Error("user not found!!")
    }
    //check if user is logged in
if(house.user.toString() !== user.id){
    res.status(404)
    throw new Error("Not Authorized!!")
}

const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
})
res.status(200).json(updatedHouse)

})
//desc delete house
//@route DELETE /api/house
//@acces Privete

const deleteHouse = asyncHandler(async (req,res)=>{
    const house = await House.findById(req.params.id)
    //check if house exists
    if(!house){
        res.status(400)
        throw new Error("House not Found!!");
    }
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(400)

        throw new Error("user not found!!")
    }
    //check if user is logged in
    if(house.user.toString() !== user.id){
        res.status(404)
        throw new Error("Not Authorized")
    }
    await house.remove()

    res.status(200).json({message:"House Deleted Successfully!!"})
})
//desc search houses by category from the database
//@route GET /api/houses
//@access Public
const searchHouses = asyncHandler (async (req,res)=>{
    const query = req.params.query
    const results = await House.find({
        $or:[
            {location:{$regex: query, $options:'i'}},
            {category:{$regex: query, $options:'i'}}
        ]
    
    })//search houses
    if(!results){
        res.status(400)
        throw new Error('Category not found!!')
    }

    res.status(200).json(results)

})
//sort houses in ascending order from different criteria
const sortAscOrder = asyncHandler (async (req,res)=>{
    const {query, sortBy} = req.query
    const sortOptions={}
    if(sortBy){
        sortOptions[sortBy] = 1
    }

    const results = await House.find({ $text: {$search: query}}).sort(sortOptions)

   !results ? res.status(404).json({message:"not found!!"}): (
        res.status(201).json(results)
   )   
})   
const filterBedsitters = asyncHandler(async(req,res)=>{
    const houses = await House.find({category:'Bedsitter'})
    res.status(200).json(houses)
}) 
const filterSingles = asyncHandler(async(req,res)=>{
    const houses = await House.find({category:'Singles'})
    res.status(200).json(houses)
})





module.exports = {
    addHouse,
    allHouses,    
    getAllHouses,   
    houseId,
    houseUpdate ,
    deleteHouse ,
    searchHouses,
    sortAscOrder,
    filterBedsitters
}