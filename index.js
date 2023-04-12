const express = require('express');
let app = express();
const mongoose = require('mongoose')
const connectDB = require('./connect')
const cors = require('cors');
const path = require('path');
var bodyParser = require('body-parser')

require('dotenv').config({path:path.resolve(__dirname,'./.env')});
// console.log(__dirname)
const PORT = process.env.PORT
// console.log(PORT)

app.use(cors({credentials: true, origin: 'https://bankingms.netlify.app/'}))
// connectD
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(require('./router/apis'))
app.listen(PORT, ()=> {
    console.log(`Listening on ${PORT}`)
})