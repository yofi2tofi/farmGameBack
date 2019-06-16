const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Field = new Schema({
  harvest: {
    type: Date,
    default: Date.now()
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'ProductDictionary'
  },
  farmingId: {
    type: Schema.Types.ObjectId,
    ref: 'Farming'
  },
  userId: {
    type: Schema.Types.ObjectId
  }
});

const Farming = new Schema(
  {
    wheatId: {
      type: Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId()
    }
  },
  { toJSON: { virtuals: true } }
);

Farming.virtual('wheat', {
  ref: 'Field', // The model to use
  localField: 'wheatId', // Find people where `localField`
  foreignField: 'farmingId', // is equal to `foreignField`
  justOne: false
});

module.exports = { Farming, Field };
