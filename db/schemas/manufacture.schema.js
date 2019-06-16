const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Factory = new Schema({
  produced: {
    type: Date,
    default: Date.now()
  },
  isBusy: {
    type: Boolean,
    default: false
  },
  selectedLine: {
    type: Schema.Types.ObjectId,
    ref: 'ProductionLineDictionary'
  },
  factory: {
    type: Schema.Types.ObjectId,
    ref: 'FactoryDictionary'
  },
  manufactureId: {
    type: Schema.Types.ObjectId,
    ref: 'Manufacture'
  },
  userId: {
    type: Schema.Types.ObjectId
  }
});

const Manufacture = new Schema(
  {
    feedFactoryId: {
      type: Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId()
    },
    userId: {
      type: Schema.Types.ObjectId
    }
  },
  { toJSON: { virtuals: true } }
);

Manufacture.virtual('feed', {
  ref: 'Factory',
  localField: 'feedFactoryId',
  foreignField: 'manufactureId',
  justOne: false
});

module.exports = { Manufacture, Factory };
