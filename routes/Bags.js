const express = require('express')
const bags = express.Router()
const cors = require('cors')
const path = require('path')

const Bag = require("../models/Bag")
bags.use(cors())

bags.use(express.static(path.join(__dirname, '../bag-search/public')))

bags.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'../bag-search/public/index.html'));
});


bags.post('/data',(req, res, next) => {
    const bagdata ={
        bag_id: req.body.bag_id,
        name: req.body.name,
        mobile: req.body.mobile,
        airline: req.body.airline,
        carousel_id: req.body.carousel_id,
        source: req.body.source,
        destination: req.body.destination
    }

    Bag.findOne({
        bag_id: req.body.bag_id
    })
    .then(bag => {
        if(!bag){
            Bag.create(bagdata)
            .then(bag => {
                if(bag){
                    res.json(bagdata)
                }
            })
            .catch(err => {
                res.json(err)
            })
        }
        else{
            res.json({error: 'bag already exists '})
        }
    })
    .catch(err => {
        res.json(err)
    })
})


bags.get('/search/:id',async  (req,res,next)=> {
  try{
      var x = await Bag.findById(req.params.id).exec();
      res.send(x);
  }
  catch(error){
      res.send(error)
  }
   
})




module.exports= bags