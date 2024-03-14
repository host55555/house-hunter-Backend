const express = require('express')
const asyncHandler = require('express-async-handler')
require('dotenv/config')
const Client = require('../models/clientModel')
const nodemailer = require('nodemailer')
const House = require('../models/house.model')

//nodemailer transpoter using a fake tester
/*const transpoter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth:{
        user:"yasmin.stiedemann@ethereal.email",
        pass:"PmtqwXQtUf2pS6FD45"
    }
})*/
const transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})



//clients Bookings
const Book = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber, email, duration } = req.body

    const { id } = req.params

    if (!fullName || !phoneNumber || !email || !duration) {
        res.status(400).json({ message: "All fields are required!!!" })
    }

    try {
        const house = await House.findById(id);
        const user = house.user;


        const client = new Client({
            fullName,
            phoneNumber,
            email,
            duration,
            house: id,
            agency: user,
        })
        await client.save()
        //send email to client after Booking
        /*const mailOptions ={
            from:'yasmin.stiedemann@ethereal.email',
            to: email,
            subject: "House Booking",
            text:`Hey ${fullName} you have successfully booked a house.`
        }*/
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: "House Booking",
            text: `Hey ${fullName} you have successfully booked a house for ${duration}. From house hunter platform. Hope you Enjoy your stay.
            kindly reach out to your property agent before three days for more information.
            Agent details
            ${house.contacts}
            from Admin,
            Isaac
            `
        }
        await transpoter.sendMail(mailOptions)
        res.status(201).json({ message: "Booking Successful" })

    } catch (error) {
        res.status(400).json(error)


    }
})
//fetch clients
const getClients = asyncHandler(async (req, res) => {
    const clients = await Client.find()
    if (clients) {
        res.status(200).json(clients)
    } else {
        res.status(400).json({ message: "Could not fetch Clients" })
    }
})
//fetch clients by agency
const getAgencyClients = asyncHandler(async (req, res) => {
    const clients = await Client.find({ agency: req.user.id })
    try {
        if (clients) {
            res.status(200).json(clients)
        } else {
            res.status(401).json({ message: "you have no clients" })
        }
    } catch (error) {
        res.status(400).json(error)
    }

})

module.exports = {
    Book,
    getClients,
    getAgencyClients
}