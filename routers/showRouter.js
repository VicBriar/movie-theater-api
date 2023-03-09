const express = require('express');
const router = express.Router();
const {body, check, validationResult} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {Show} = require('../models/index')

let genreEnum = ["Comedy", "Drama", "Horror", "Sitcom"]
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


//POST
router.post(
    '/',
    check("title").not().isEmpty().trim().withMessage("you must provide a title"),
    check("genre").not().isEmpty().trim().withMessage("you must provide a genre"),
    check("rating").isNumeric().trim().withMessage("rating must be a number"),
    check("status").not().isEmpty().trim().withMessage("you must provide a status"),
    async (req,res)=>{
        try{
            let errors = validationResult(req);
            if(errors.isEmpty()){
                let {title, genre, rating, status} = req.body;
                if(genreEnum.includes(genre)){
                    let show = {title: title, genre: genre, rating: rating, status: status}
                    await Show.create(show)
                    //this is to confirm I sucessfully added the show; delete later
                    let shows = await Show.findAll()
                    res.status(200).json(shows);
                }else{
                    res.status(406).send(`${genre} is not allowed. please use ${genreEnum} next time.`)
                }
                
            }else{
                res.status(406).send(errors);
            }
        }catch(err){};
    }
)


/*
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