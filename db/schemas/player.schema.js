const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Player = new Schema({
  experience: {
    type: Number,
    default: 0
  },
  population: {
    type: Number,
    default: 0
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'LevelDictionary'
  },
  coins: {
    type: Number,
    default: 0
  },
  cash: {
    type: Number,
    default: 0
  },
  wheat: {
    type: Number,
    default: 10
  },
  corn: { type: Number, default: 10 },
  cowFood: { type: Number, default: 0 },
  milk: { type: Number, default: 0 },
  userId: {
    type: Schema.Types.ObjectId
  }
});

module.exports = Player;
