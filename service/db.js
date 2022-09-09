//server-database connection

//1.import mongoose
const mongoose=require('mongoose')

//2.connect server with mongoDB via mongoose
mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true//to avoid warning
})

//3.create model for db bank in mongoDB=>user must singular,firstletter capital,const and model name must same
const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}