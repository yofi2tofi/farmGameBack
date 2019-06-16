const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const FactoryDictionary = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId
    },
    id: Number,
    name: String,
    playerLevel: [{ type: Schema.Types.ObjectId, ref: 'LevelDictionary' }],
    population: [Number],
    cost: [Number],
    buildTime: [Number],
    experience: [Number]
  },
  { toJSON: { virtuals: true } }
);

FactoryDictionary.virtual('lines', {
  ref: 'ProductionLineDictionary',
  localField: '_id',
  foreignField: 'factoryId',
  justOne: false
});

module.exports = FactoryDictionary;
