const express = require('express');
const router = express.Router();
const {body, check, validationResult, oneOf} = require('express-validator');
//in this project, our instance of sequelize is called 'db'
const {db} = require('../db'); 
const {Show} = require('../models/index')

let genreEnum = ["Comedy", "Drama", "Horror", "Sitcom"]
const assignValue = (key,value,object) => {
    if(value){
        object[key] = value;
        console.log(`value is ${value} key is ${key}`);
        return true;
    }else{
        return false;
    }
}
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
    check("title").isAscii().withMessage("you must provide a valid title"),
    check("genre").not().isEmpty().trim().withMessage("you must provide a genre"),
    check("genre").isAscii().withMessage("you must povide a valid genre"),
    //rating doesn't have to be provided, as new shows can't be rated before they're watched.
    check("rating").isNumeric().trim().withMessage("rating must be a number"),
    check("status").not().isEmpty().trim().withMessage("you must provide a status"),
    check("status").isAscii().withMessage("you must provide a valid status"),
    async (req,res)=>{
        try{
            let errors = validationResult(req);
            if(errors.isEmpty()){
                let {title, genre, rating, status} = req.body;
                //validate enum, 1st implementation
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
    //title can be empty or asci
    oneOf([
        check("title").isEmpty().trim().withMessage("title doesn't have to be provided"),
        check("title").isAscii().trim().withMessage("if title is provided, it must be valid title")
    ]),
    //rating can be numeric, or empty
    oneOf([
        check("rating").isEmpty().trim().withMessage("rating doesn't have to be provided"),
        check("rating").isNumeric().trim().withMessage("if rating it provided, it must be a number")
    ]),
    //genre can be an enum member, or empty
    oneOf([
        check("genre").isEmpty().withMessage("genre doesn't have to be provided"),
        check("genre").isIn(genreEnum).withMessage("genre must be one of the valid types; Comedy, Drama, Horror, or Sitcom")
    ]),
    //status can be empty or ascii
    oneOf([
        check("status").isEmpty().trim().withMessage("status doesn't have to be provided"),
        check("status").isAscii().withMessage("you must provide a valid status")
        
    ]),
    async (req,res) =>{
        let id = req.params.id;
        let errors = validationResult(req);
        try{
            if(errors.isEmpty()){
                let show = await Show.findByPk(id);
                let values = {}
                values.title = req.body.title;
                values.rating = req.body.rating;
                values.genre = req.body.genre;
                values.status = req.body.status;
                for(let key in values){
                    assignValue(key,values[key],show)
                }
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

//DELETE
router.delete(
    '/:id',
    async (req,res) =>{
        let id = req.params.id;
        try{
            let show = await Show.findByPk(id)
            if(show){
                show.destroy();
                let shows = await Show.findAll();
                res.status(200).json(shows);
            }else{
                console.error("Show doesn't exist.")
            }
        }catch(err){
            res.status(500)
            console.error(err);
        };
    }
)

router.delete(
    '/',
    (req,res)=>{
        res.status(405).send("You cannot delete all shows!")
    }
)
//export
module.exports = router;