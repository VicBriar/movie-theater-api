const express = require('express');
const router = express.Router();
const {body, check, validationResult} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {User} = require('../models/index')

//GET all users
router.get(
    '/',
    async (req,res) =>{
        try{
            let users = await User.findAll()
            res.status(200).json(users);
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)

//Get user
router.get(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{
            let user = await User.findByPk(id);
            if(user){
                res.status(200).send(user)
            }else{
                res.status(404).send("User doesn't exsist")
                console.log("User doesn't exist")
            }
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)
/*
//POST to users
router.post(
    '/',
    check("name").isEmpty(),
    async (req,res)=>{
        try{}catch(err){
            res.status(500)
            console.error(err);
        };
    }
)

//PUT a user
router.put(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){
            res.status(500)
            console.error(err);
        };
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

*/
module.exports = router;