const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const House = new Schema({
  house: { type: Schema.Types.ObjectId, ref: 'HouseDictionary' },
  houseKeepingId: { type: Schema.Types.ObjectId, ref: 'HouseKeeping' }
});

const HouseKeeping = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    }
  },
  { toJSON: { virtuals: true } }
);

HouseKeeping.virtual('houses', {
  ref: 'House',
  localField: '_id',
  foreignField: 'houseKeepingId',
  justOne: false
});

module.exports = { HouseKeeping, House };
