//import jsonwebtoken library
const jwt = require("jsonwebtoken")

//import db 
const db = require('./db')

//database
userDetails = {
  1000: { acno: 1000, username: 'Neer', password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, username: 'Laisha', password: 1001, balance: 6000, transaction: [] },
  1002: { acno: 1002, username: 'Vyom', password: 1002, balance: 4000, transaction: [] }
}

//Register request
const register = (acno, password, username) => {
  //asynchronus
  return db.User.findOne({
    acno
  })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'User already exist please login'
        }
      }
      else {
        const newUser = new db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()//to save mongoDB
        return {
          statusCode: 200,
          status: true,
          message: 'Register Successfully'
        }
      }
    })
}


//login
const login = (acno, pswd) => {
  //asynchronus
  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        currentUsername = user.username
        currentAcno = acno
        //Token generation using jwt
        const token = jwt.sign({
          currentAcno: acno//To identify which user is loged in->not necessary
        }, "secretkey123")
        return {
          statusCode: 200,
          status: true,
          message: 'Login Successfull',
          currentUsername,
          currentAcno,
          token
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Incorrect password or User does not exist'
        }
      }
    })
}
//deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  //asynchronus
  return db.User.findOne({
    acno,
    password: pswd,
  })
    .then(user => {
      if (user) {
        user.balance += amount
        user['transaction'].push({
          type: 'CREDIT',
          amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amount} Credited Successfully,New Balance is ${user.balance}`
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'User doesnot exist'
        }
      }
    })
}

//withdrawal
const withdrawal = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd,
  })
    .then(user => {
      if (user) {
        if (user.balance > amount) {
          user.balance -= amount
          user['transaction'].push({
            type: 'DEBIT',
            amount
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            message: `${amount} Debitted Successfully,New Balance is ${user.balance}`
          }
        }
        else {
          return {
            statusCode: 401,
            status: false,
            message: 'Insufficient Balance'
          }
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'User does not exist'
        }
      }
    })
}

//transaction history
const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  })
    .then(user => {
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user['transaction']
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'incorrect acc number'
        }
      }
    })
}

//onDelete
const onDelete = (acno) => {
  return db.User.deleteOne({
    acno
  })
    .then(result => {
      if (result) {
        return {
          statusCode: 200,
          status: true,
          message: 'Deleted successfully'
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'incorrect acc number'
        }
      }
    })
}

//to export
module.exports = {
  register,
  login,
  deposit,
  withdrawal,
  getTransaction,
  onDelete
}
