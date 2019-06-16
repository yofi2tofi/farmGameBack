const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const ProductDictionary = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  name: String,
  time: Number,
  type: String,
  price: Number,
  sell: Number,
  level: {
    type: Schema.Types.ObjectId,
    ref: 'LevelDictionary'
  },
  experience: Number
});

module.exports = ProductDictionary;
