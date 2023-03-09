//express & port init
const express = require('express')
const app = express()
const port = 3000
//routers
const userRouter = require('./routers/userRouter');
const showRouter = require('./routers/showRouter');

//parsing
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));

//routes
app.use('/shows',showRouter);
app.use('/users',userRouter);


//server listening
app.listen(port, () =>{
    console.log(`app is listening at HTTP://localhost${port}`);
})