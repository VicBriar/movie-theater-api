//express & port init
const express = require('express')
const app = express()
const port = 3000
//routers


//routes

//server listening
app.listen(port, () =>{
    console.log(`app is listening at HTTP://localhost${port}`)
})