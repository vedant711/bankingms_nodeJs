const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_type:String,
    amount:mongoose.Types.Decimal128,
    balance:mongoose.Types.Decimal128,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'USERS'}
})

module.exports = new mongoose.model('TRANSACTIONS',transactionSchema)