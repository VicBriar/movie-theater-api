const express = require('express');
const router = express.Router();
const {body, check, validationResult} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {Show} = require('../models/index')

//GET all shows
router.get(
    '/',
    async (req,res) =>{
        try{
            let shows = await Show.findAll()
            res.status(200).json(shows);
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)

//Get show #
router.get(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{
            let show = await Show.findByPk(id);
        if(show){
            res.status(200).send(show)
        }else{
            res.status(404).send("Show doesn't exsist")
            console.log("Show doesn't exist")
        }
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)

/*
//POST
router.post(
    '/',
    check(),
    async (req,res)=>{
        try{}catch(err){};
    }
)

//PUT
router.put(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){};
    }
)

//DELETE
router.delete(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{}catch(err){};
    }
)

router.delete(
    '/',
    (req,res)=>{
        res.status(405).send("You cannot delete all shows!")
    }
)
*/
//export
module.exports = router;