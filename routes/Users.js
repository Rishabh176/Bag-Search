const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const path = require('path')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator/check')

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY= 'secret'

users.use(express.static(path.join(__dirname, '../bag-search/public')))

users.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'../bag-search/public/index.html'));
});

users.post('/signup',[

    check('firstname').isAlpha().not().isEmpty().isLength({max: 15}),
    check('lastname').isAlpha().not().isEmpty().isLength({max: 15}),
    check('phone').isInt().not().isEmpty().isLength(10),
    check('email').exists().not().isEmpty().isEmail(),
    check('password').isAlphanumeric().not().isEmpty().isLength({min: 8, max: 15}) 

], (req, res,next) => {
    const today= new Date()
    const validation = validationResult(req);
    var parentObject={}
    const Codes=[
        '0','101','102','103','104','105']
    console.log(validation.mapped())
    if(Object.keys(validation.mapped()).length == 0){
        parentObject.code = 0;
        parentObject.errCode+=Codes[0]+" "
        parentObject.msg="Sucesssfully Registered"
    }
    else{
        parentObject.code =1;
        parentObject.msg="Invalid"
        parentObject.errCode=""
        Object.keys(validation.mapped()).forEach(element => {
            switch(element){
                case "firstname":
                    parentObject.errCode+=Codes[1]+" "
                    parentObject.msg+=" firstname"
                    break;
                case "lastname":
                        parentObject.errCode+=Codes[2]+" "
                    parentObject.msg+=" lastname"
                    break;
                case "phone":
                        parentObject.errCode+=Codes[3]+" "
                    parentObject.msg+=" phone"
                    break;
                case "email":
                        parentObject.errCode+=Codes[4]+" "
                    parentObject.msg+=" email"
                    break;
                case "password":
                        parentObject.errCode+=Codes[5]+" "
                    parentObject.msg+=" password"
                    break;
            }
        });

    }


    if (!validation.isEmpty()) {
      return res.status(422).json(parentObject);
    } else {
        const userData ={
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email:req.body.email,
            password: req.body.password,
            created: today
        }
    
        User.findOne({
            email: req.body.email
        })
        .then(user =>{
            if(!user){
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password =hash
                    User.create(userData)
                    .then(user => {
                        if(user){
                            res.json()
                        }
                        
                    })
                    .catch(err => {
                        res.json(parentObject)
                    })
                })
            }
            else{
                res.json({error : 'User already exists' })
            }
        })
        .catch(err => {
            res.json({error : err})
        })
    }
    
})


users.post('/login', (req, res,next) => {
    User.findOne({
        email: req.body.email
    })
    .then(user =>{
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const payload ={
                    _id: user._id,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    phone: user.phone,
                    email: user.email,
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                    expiresIn: 1440
                })
                res.send(token)
        }
        else{
            res.json({error : 'Please enter the right credentials' })
        }
    } else {
        res.json({error : 'User does not exists' })
    }
    })
    .catch(err => {
        res.json({error : err})
    })

})


const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

users.get('/profile',checkToken, (req,res,next)=>{
    var decoded = jwt.verify(req.token, process.env.SECRET_KEY)
    User.findOne({
        _id: decoded._id
    })
    .then(user =>{
        if(user){
            res.json(user)
        }else{
            res.json({error : 'user does not exist'})
        }
    })
    .catch(err => {
        res.json({error : err})
    })
})

module.exports= users