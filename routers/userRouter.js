const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {User} = require('../models/index')

//GET all users
router.get(
    '/',
    async (req,res) =>{
        try{}catch(err){};
    }
)
//Get user
router.get(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){};
    }
)

//POST to users
router.post(
    '/',
    check(),
    async (req,res)=>{
        try{}catch(err){};
    }
)

//PUT a user
router.put(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){};
    }
)

//DELETE a user
router.delete(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){};
    }
)
//you can't delete database!
router.delete(
    '/',
    (req,res)=>{
        res.status(405).send("You cannot delete all shows!")
    }
)


module.exports = router;