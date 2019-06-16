const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const LevelDictionary = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  level: Number,
  experience: Number,
  bonus: {
    coins: Number,
		cash: Number,
		wheat: Number
  }
});

module.exports = LevelDictionary;
