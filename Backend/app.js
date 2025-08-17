const { request } = require("express");


const express = require('express')

const bodyParse = require('body-parser');

const cors = require('cors');

require('dotenv').config();


const sequelize = require('./Database/db');

const {User,Store,Rating} = require('./Model');

const authRoutes = require('./Router/auth');
const userRoutes = require('./Router/users');
const storeRoutes = require('./Router/stores');

const app  = express();


app.use(cors());

app.use(bodyParse.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);

app.get('/api/dashboard',async(req,res)=>{
    try{

        
    const totalUsers = await User.count();

    const totalStores = await Store.count();
    const totalRating = await Rating.count();
     res.json({ totalUsers, totalStores, totalRatings: totalRating });
    }
    catch(error){
        console.log(error);
    }

});

const PORT = process.env.PORT || 5000;

sequelize.sync({alter:true}).then(async ()=>{
    console.log('DB Connection Sucessfully');

    // created default admin if not exist

    const admin = await User.findOne({where:{email :'sanket@local'}});
    if(!admin) await User.create({name : 'Admin', email:'sanket@local',password:'sanket@12345',role:'admin'})

    app.listen(PORT,()=>{
        console.log(`Server started ${PORT}`)
    })
})