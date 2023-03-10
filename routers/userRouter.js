const express = require('express');
const router = express.Router();
const {body, check, validationResult} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {User,Show} = require('../models/index')

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
//get user's shows
router.get('/:id/shows', async (req,res) => {
    let id = req.params.id;
        try{
            let user = await User.findByPk(id);
            if(user){
                res.status(200).send(user.getShows())
            }else{
                res.status(404).send("User doesn't exsist")
                console.log("User doesn't exist")
            }
        }catch(err){
            res.status(500)
            console.error(err);
        };
    })

//POST new user to users
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


//PUT a show to user
router.put(
    '/:id',
    check("showTitle").not().isEmpty().trim().withMessage("you must supply a show title"),
    async (req,res) =>{
        let id = req.params.id;
        let showTitle = req.body.showTitle;
        try{
            let user = await User.findByPk(id, {include: Show})
            if(user){
                let show = await Show.findOne({
                    where:
                        {title: showTitle}
                    })
                    if(showTitle){
                        await user.addShow(show);
                        await user.save()
                        res.status(200).send(user)
                    }else{
                        res.status(404).send("Show doesn't exsist")
                        console.log("Show doesn't exist")  
                    }
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