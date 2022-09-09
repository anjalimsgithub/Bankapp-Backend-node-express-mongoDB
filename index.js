//1.import express
const express = require('express')
const jwt = require('jsonwebtoken')
const dataService = require('./service/data.service')
const cors=require('cors')


//2.create server app
const app = express()
//to parse JSON
app.use(express.json())
//to use cors to share data with others
app.use(cors({
    origin:'http://localhost:4200'
}))

// Application specific Middleware=>entire application
// const appMiddleware = (req, res, next) => {
// //     console.log('Application specific Middleware');
//     next()
// }
// app.use(appMiddleware)

//Router specific Middleware=>after login
const jwtMiddleware = (req, res, next) => {
    try {
        console.log('Router specific Middleware');
        const token = req.headers['x-token']
        const data = jwt.verify(token, "secretkey123")
        console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'please login'
        })
    }

}

//3.HTTP request resolve
//GET Request-to read data
app.get('/', (req, res) => {
    res.send('GET METHOD')
})

//POST Request-to set data like register
app.post('/', (req, res) => {
    res.send('POST METHOD')
})

//PUT Request-to update data completely
app.put('/', (req, res) => {
    res.send('PUT METHOD')
})

//PATCH Request-to update data partially
app.patch('/', (req, res) => {
    res.send('PATCH METHOD')
})

//DELETE Request-to remove data
app.delete('/', (req, res) => {
    res.send('DELETE METHOD')
})

//Bank App Request
//register 
app.post('/register', (req, res) => {
    console.log(req.body);
    dataService.register(req.body.acno, req.body.password, req.body.username)
        .then(result => {
            //send client in json format with respect to result's statuscode
            res.status(result.statusCode).json(result)
        })

})

//login
app.post('/login', (req, res) => {
    console.log(req.body);
    dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            //send client in json format with respect to result's statuscode
            res.status(result.statusCode).json(result)
        })
})

//deposit
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        //send client in json format with respect to result's statuscode
        res.status(result.statusCode).json(result)
    })
  })

//withdrawal
app.post('/withdrawal', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.withdrawal(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        //send client in json format with respect to result's statuscode
        res.status(result.statusCode).json(result)
    })
})

//getTransaction
app.post('/getTransaction', jwtMiddleware, (req, res) => {
    console.log(req.body)
        try {
        dataService.getTransaction(req.body.acno)
        .then(result => {
            //send client in json format with respect to result's statuscode
            res.status(result.statusCode).json(result)
        })
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'No transaction has been done'
        })
    }

})



//onDelete api
app.delete('/onDelete/:acno',(req,res)=>{
    dataService.onDelete(req.params.acno)
    .then(result => {
        //send client in json format with respect to result's statuscode
        res.status(result.statusCode).json(result)
    })
})


//4.set up port no:
app.listen(3000, () => {
    console.log('server started at port 3000');
})