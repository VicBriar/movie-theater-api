const express = require('express');
const router = express.Router();
const {body, check, validationResult, oneOf} = require('express-validator');
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

router.get(
    '/genres/:genre',
    async (req,res) => {
        let genre = req.params.genre;
        try{
            if(genreEnum.includes(genre)){
                let shows = await Show.findAll(
                    {where:
                     {genre: genre}
                    }
                )
                res.status(200).json(shows);
            }else{
                res.status(406).send(`${genre} is not a valid genre`)
            }
            
        }catch(err){
            res.status(500)
            console.error(err);
        }
    })


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
                    let show = {title, genre, rating, status}
                    await Show.create(show)
                    //this is to confirm I sucessfully added the show; delete later
                    let shows = await Show.findAll()
                    res.status(200).json(shows);
                }else{
                    //1st implementation, allows custom errors but is a seperate error handler
                    res.status(406).send(`${genre} is not allowed. please use ${genreEnum} next time.`)
                }
                
            }else{
                res.status(406).send(errors);
            }
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)



//PUT
router.put(
    '/:id',
    //how can I allow the absence of a key value pair, but catch the prescense of a key with an empty value pair?
    oneOf([
        check("rating").isNumeric().trim(),
        check("rating").isEmpty().trim()
    ]),
    //2nd implementation; doesn't allow for custom errors
    oneOf([
        check("genre").equals(genreEnum[0]),
        check("genre").equals(genreEnum[1]),
        check("genre").equals(genreEnum[2]),
        check("genre").equals(genreEnum[3]),
        check("genre").isEmpty()
    ]),
    async (req,res) =>{
        let id = req.params.id;
        let errors = validationResult(req);
        try{
            if(errors.isEmpty()){
                let show = await Show.findByPk(id);
                show.set(req.body);
                await show.save();
                let shows = await Show.findAll()
                res.status(200).json(shows)
            }else {
                res.status(406).send(errors); 
            }
        }catch(err){
            res.status(500)
            console.error(err);
        }
    }
)
/*
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