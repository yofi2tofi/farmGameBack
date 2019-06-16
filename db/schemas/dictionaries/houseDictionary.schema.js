const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const HouseDictionary = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  name: String,
  playerLevels: [
    {
      maxBuilding: Number,
      level: { type: Schema.Types.ObjectId, ref: 'LevelDictionary' }
    }
  ],
  population: Number,
  cost: Number,
  buildTime: Number,
  experience: Number,
  size: {
    side: Number,
    front: Number
	},
	isFirstFree: Boolean
});

module.exports = HouseDictionary;
