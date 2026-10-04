const express = require('express');
const mongoose = require('mongoose');

const app = express();

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

app.set("view engine","ejs");

app.get('/', (req,res)=>{
    res.render("index");
});

const DB_A = process.env.DATABASE_ATLAS.replace('<db_password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB_A).then(con => {
    console.log('DB Connection Successful!');
});

const port = process.env.PORT;

const server = app.listen(port, ()=>{
    console.log(`Server is runing on port: ${port}`);
});
