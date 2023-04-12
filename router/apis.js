const router = require('express').Router();
const Users = require('../models/userSchema');
const Transactions = require('../models/transactionSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path:path.resolve(__dirname,'./.env')});


router.post('/create',async(req,res)=>{
    try{
        const {name,password,balance,pin} = req.body
        if(!name||!password||!balance||!pin){res.status(400).json({message:'Bad Request'})}
        else{
            let user1 = await Users.findOne({name:name});
            // console.log(user1)
            if (user1) res.status(400).json({message:'Username already taken'});
            else if (password.length>=8){
                const user = new Users(req.body)
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) res.status(400).json({message:'Bad Request'});
                    bcrypt.hash(user.password,salt,function(err,hash){
                        if (err) res.status(400).json({message:'Bad Request'});
                        user.password= hash;
                        user.save().then((s)=>{
                            res.status(200).json({message:'User Added Successfully'});
                        });
                    });
                });
            } else {res.status(400).json({message:'Incorrect Password'})}
        }
        // res.status(200).json(req.body)
    } catch(err) {
        // console.log(err)
        res.status(500).json({error:err})
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {name,password} = req.body
        console.log(password)
        Users.findOne({name:name}).then(async (user)=>{
            if (user && await bcrypt.compare(password,user.password)){
                res.status(200).json({token:generateToken(user)})
            } else{
                res.status(400).json('Invalid Credentials')
            }
        })
    } catch(err) {
        res.status(500).json({message:'Bad Request'})
    }
})

const generateToken = user => {
    const payload = {
        userid:user._id,
        username:user.name,
        // balance:user.balance,
        pin:user.pin
    };
    const options={
        // expiresIn:'5h',
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET,options);
    return token
}

router.get('/balance/:id',async(req,res)=>{
    const user = await Users.findOne({_id:req.params.id});
    const balance = user.balance;
    // console.log(user.balance)
    res.status(200).json({balance:balance})
})

router.get('/dashboard/:id',async(req,res)=>{
    let transactions = await Transactions.find({userId:req.params.id});
    res.status(200).json({transactions:transactions})
})

router.post('/credit/:id',async(req,res)=>{
    try {
        const {amount,pin} = req.body;
        let user = await Users.findOne({_id:req.params.id});
        if (isFloat(amount)) {
            if (pin==user.pin) {
                const balance = parseFloat(user.balance)+parseFloat(amount);
                await Users.updateOne({_id:req.params.id},{balance:balance})
                let tran = new Transactions({
                    transaction_type:'CREDIT',
                    amount: amount,
                    balance: balance,
                    userId: req.params.id,
                });
                tran.save()
                res.status(200).json({message:`Amount ${amount} credited successfully`})
            } else {
                res.status(400).json({message:'Invalid PIN'})
            }
        } else {
            res.status(400).json({message:'Invalid Amount'})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message:'Bad Request'})
    }
})

router.post('/debit/:id',async(req,res)=>{
    try {
        const {amount,pin} = req.body;
        let user = await Users.findOne({_id:req.params.id});
        if (isFloat(amount) && parseFloat(user.balance)>=parseFloat(amount)) {
            if (pin==user.pin) {
                const balance = parseFloat(user.balance)-parseFloat(amount);
                await Users.updateOne({_id:req.params.id},{balance:balance})
                let tran = new Transactions({
                    transaction_type:'DEBIT',
                    amount: amount,
                    balance: balance,
                    userId: req.params.id,
                });
                tran.save()
                res.status(200).json({message:`Amount ${amount} debited successfully`})
            } else {
                res.status(400).json({message:'Invalid PIN'})
            }
        } else {
            res.status(400).json({message:'Invalid Amount'})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message:'Bad Request'})
    }
})

const isFloat = num => {
    let floating_num = parseFloat(num);
    if (floating_num !== NaN) return true
    else return false 
}

module.exports = router;