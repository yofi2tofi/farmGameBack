const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const ProductionLineDictionary = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  name: String,
  time: Number,
  playerLevel: {
    type: Schema.Types.ObjectId,
    ref: 'LevelDictionary'
  },
  sell: Number,
  experience: Number,
  produced: {
    count: Number,
    product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }
  },
  materials: [
    {
      count: Number,
      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }
    }
  ],
  factoryId: {
    type: Schema.Types.ObjectId
  }
});

module.exports = ProductionLineDictionary;
