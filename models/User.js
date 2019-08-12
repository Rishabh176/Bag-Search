const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        validate: {
            validator: function(v) {
              return /^[a-z ,.'-]+$/i.test(v);
            },
            description : 'Check if the text is a valid firstname',
          required: [true, 'User firstname required']
        }
    },
    lastname: {
        type: String,
        validate: {
            validator: function(v) {
              return /^[a-z ,.'-]+$/i.test(v);
            },
            description : 'Check if the text is a valid lastname',
          required: [true, 'User lastname required']
        }
    },
    phone: {
        type: Number,
        validate: {
            validator: function(v) {
              return /\d{10}/.test(v);
            },
            description : 'Check if the text is a valid Mobile No.',
          required: [true, 'User phone number required']
        }
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
              return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v);
            },
            description : 'Check if the text is a valid email',
          required: [true, 'User email required']
        }
    },
    password: {
        type: String,
        validate: {
          validator: function(v) {
            return /^(?=.*\d).{8,15}$/.test(v);
          },
          description : 'Check if the text is a valid password',
        required: [true, 'User password required']
      }
    },
    date:{
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('users', UserSchema);