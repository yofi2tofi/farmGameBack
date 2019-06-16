const mongoose = require('mongoose');

const ProductDictionary = require('./schemas/dictionaries/ProductDictionary.schema');
const FactoryDictionary = require('./schemas/dictionaries/factoryDictionary.schema');
const ProductionLineDictionary = require('./schemas/dictionaries/productionLineDictionary.schema');
const AnimalDictionary = require('./schemas/dictionaries/animalDictionary.schema');
const HusbandryDictionary = require('./schemas/dictionaries/husbandryDictionary.schema');
const LevelDictionary = require('./schemas/dictionaries/levelDictionary.schema');
const HouseDictionary = require('./schemas/dictionaries/houseDictionary.schema');

const User = require('./schemas/user.schema');
const Player = require('./schemas/player.schema');
const { Farming, Field } = require('./schemas/farming.schema');
const { Manufacture, Factory } = require('./schemas/manufacture.schema');
const {
  AnimalHusbandry,
  Animal,
  AnimalHusbandryBuilding
} = require('./schemas/animalHusbandry.schema');
const { House, HouseKeeping } = require('./schemas/houseKeeping.schema');

const dbConfigUrl =
  process.env.NODE_ENV === 'development'
    ? ''
    : '';

mongoose.connect(dbConfigUrl);
var db = mongoose.connection;

db.on('error', err => {
  console.log('connection error:', err.message);
});

db.once('open', () => {
  console.log('Connected to DB!');
});

const ProductDictionaryModel = mongoose.model(
  'ProductDictionary',
  ProductDictionary
);
const FactoryDictionaryModel = mongoose.model(
  'FactoryDictionary',
  FactoryDictionary
);
const ProductionLineDictionaryModel = mongoose.model(
  'ProductionLineDictionary',
  ProductionLineDictionary
);
const AnimalDictionaryModel = mongoose.model(
  'AnimalDictionary',
  AnimalDictionary
);
const HusbandryDictionaryModel = mongoose.model(
  'HusbandryDictionary',
  HusbandryDictionary
);
const HouseDictionaryModel = mongoose.model('HouseDictionary', HouseDictionary);

const LevelDictionaryModel = mongoose.model('LevelDictionary', LevelDictionary);

const UserModel = mongoose.model('User', User);
const PlayerModel = mongoose.model('Player', Player);
const FarmingModel = mongoose.model('Farming', Farming);
const ManufactureModel = mongoose.model('Manufacture', Manufacture);
const AnimalHusbandryModel = mongoose.model('AnimalHusbandry', AnimalHusbandry);
const AnimalHusbandryBuildingModel = mongoose.model(
  'AnimalHusbandryBuilding',
  AnimalHusbandryBuilding
);
const HouseKeepingModel = mongoose.model('HouseKeeping', HouseKeeping);

const FieldModel = mongoose.model('Field', Field);
const FactoryModel = mongoose.model('Factory', Factory);
const AnimalModel = mongoose.model('Animal', Animal);
const HouseModel = mongoose.model('House', House);

module.exports = {
  ProductDictionaryModel,
  FactoryDictionaryModel,
  ProductionLineDictionaryModel,
  AnimalDictionaryModel,
  HusbandryDictionaryModel,
  AnimalHusbandryBuildingModel,
  LevelDictionaryModel,
  HouseDictionaryModel,
  UserModel,
  PlayerModel,
  FarmingModel,
  FieldModel,
  ManufactureModel,
  FactoryModel,
  AnimalHusbandryModel,
  AnimalModel,
  HouseKeepingModel,
  HouseModel
};
