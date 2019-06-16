const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const AnimalCost = new Schema({
  cost: {
    type: Array
  }
});

const HusbandryDictionary = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  name: String,
  cost: [Number],
  experience: [Number],
  animalCost: [AnimalCost],
  buildTime: [Number],
  defaultAnimalsCount: Number,
  maxBuildings: Number,
  linkAnimal: {
    type: Schema.Types.ObjectId,
    ref: 'AnimalDictionary'
  }
});

module.exports = HusbandryDictionary;
