const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const AnimalDictionary = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId
    },
    id: Number,
    name: String,
    produced: {
      count: Number,
      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }
    },
    material: {
      count: Number,
      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }
    }
  },
  { toJSON: { virtuals: true } }
);

module.exports = AnimalDictionary;
