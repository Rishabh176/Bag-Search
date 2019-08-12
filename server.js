var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var mongoose = require('mongoose')
var port = process.env.PORT || 3000
var morgan = require('morgan')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

const mongoURI= 'mongodb://localhost:27017/testing'

mongoose
    .connect(mongoURI,{useNewUrlParser: true})
    .then(()=>console.log('MongoDB connected'))
    .catch(err => console.log(err))

var Users = require('./routes/Users')
var Bags=require('./routes/Bags')

app.use(morgan('dev'))
app.use('/',Users)
app.use('/bags',Bags)



app.listen(port,() => {
    console.log('Server is running on port: ' + port)
})