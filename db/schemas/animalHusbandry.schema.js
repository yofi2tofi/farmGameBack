const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Animal = new Schema({
  gathering: {
    type: Date,
    default: Date.now()
  },
  isBusy: {
    type: Boolean,
    default: false
  },
  animal: {
    type: Schema.Types.ObjectId,
    ref: 'AnimalDictionary'
  },
  husbandryBuildingId: {
    type: Schema.Types.ObjectId,
    ref: 'AnimalHusbandryBuilding'
  }
});

const AnimalHusbandryBuilding = new Schema(
  {
    animalHusbandryBuilding: {
      type: Schema.Types.ObjectId,
      ref: 'HusbandryDictionary'
    },
    animalHusbandryId: {
      type: Schema.Types.ObjectId,
      ref: 'AnimalHusbandry'
    },
    userId: {
      type: Schema.Types.ObjectId
    }
  },
  { toJSON: { virtuals: true } }
);

AnimalHusbandryBuilding.virtual('animals', {
  ref: 'Animal',
  localField: '_id',
  foreignField: 'husbandryBuildingId',
  justOne: false
});

const AnimalHusbandry = new Schema(
  {
    cowshedId: {
      type: Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId()
    },
    userId: {
      type: Schema.Types.ObjectId
    }
  },
  { toJSON: { virtuals: true } }
);

AnimalHusbandry.virtual('cowsheds', {
  ref: 'AnimalHusbandryBuilding',
  localField: 'cowshedId',
  foreignField: 'animalHusbandryId',
  justOne: false
});

module.exports = { AnimalHusbandry, AnimalHusbandryBuilding, Animal };
