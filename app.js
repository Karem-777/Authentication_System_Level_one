const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const userController = require('./controllers/userController')
const viewsRoutes = require('./routes/viewsRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));   

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

app.set("view engine","ejs");


app.use('/', viewsRoutes); //===> View pages

app.use('/api/v1/users',userRoutes); //===> APIs

const DB_A = process.env.DATABASE_ATLAS.replace('<db_password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB_A).then(con => {
    console.log('DB Connection Successful!');
}).catch(err => console.log('DB Connection Error:', err));

const port = process.env.PORT;

const server = app.listen(port, ()=>{
    console.log(`Server is runing on port: ${port}`);
});
