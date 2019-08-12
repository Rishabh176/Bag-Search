const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BagSchema = new mongoose.Schema({
    bag_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        validate: {
            validator: function(v) {
              return /\d{10}/.test(v);
            },
            description : 'Check if the text is a valid Mobile No.',
          required: [true, 'User phone number required']
        }
    },
    airline: {
        type: String,
        required: true
    },
    carousel_id: {
        type: Number,
        required: true
    },
    source:{
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('bags', BagSchema);