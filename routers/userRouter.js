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

//POST to users
router.post(
    '/',
    check("username").not().isEmpty().trim().withMessage("username cannot be blank"),
    check("username").isLength({min: 3, max: 30}).withMessage("username must be at least 2 characters, and not excede 15"),
    check("password").not().isEmpty().trim().isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}),
    async (req,res)=>{
        try{
            let errors = validationResult(req)
            let {username, password} = req.body;
            if(errors.isEmpty()){
                let user = req.body;
                await User.create({username, password});
                 //this is to confirm I sucessfully added the user; delete later
                let users = await User.findAll();
                res.status(200).json(users);
            }else{
                res.status(406).send(errors);
            }
        }catch(err){
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
/*
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