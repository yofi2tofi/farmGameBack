const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = require('mongoose').Schema;

const User = new Schema(
  {
    method: String,
    local: {
      username: { type: String, unique: true },
      salt: String,
      hashedPassword: String
    },
    hash: String,
    salt: String,
    refreshToken: String
  },
  { toJSON: { virtuals: true } }
);

User.virtual('resources', {
  ref: 'Player', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  justOne: true
});

User.virtual('agricultures', {
  ref: 'Farming', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  justOne: true
});

User.virtual('manufactures', {
  ref: 'Manufacture', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  justOne: true
});

User.virtual('animalFactories', {
  ref: 'AnimalHusbandry', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  justOne: true
});

User.virtual('houseKeeping', {
  ref: 'HouseKeeping', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  justOne: true
});

module.exports = User;
