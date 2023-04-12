const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,'./.env')});

const DB = process.env.MONGO_URL

const connectDB = async()=> {
    try{
        const conn = await mongoose.connect(DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (conn) { console.log('Connection to DB established')}
    } catch(err) {console.log(err)}
    
}

// connectDB()
connectDB()