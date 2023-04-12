const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema ({
    name:String,
    password:String,
    balance:mongoose.Types.Decimal128,
    pin:Number,
});


module.exports = mongoose.model('USERS',userSchema);
// module.exports Users;