const {
  ProductDictionaryModel,
  FactoryDictionaryModel,
  ProductionLineDictionaryModel,
  AnimalDictionaryModel,
  HusbandryDictionaryModel,
  LevelDictionaryModel,
  HouseDictionaryModel
} = require('../db/db.module');

const products = require('../mocks/dictionaries/products');
const factories = require('../mocks/dictionaries/factories');
const productionLines = require('../mocks/dictionaries/productionLines');
const animals = require('../mocks/dictionaries/animals');
const husbandry = require('../mocks/dictionaries/husbandry');
const levels = require('../mocks/dictionaries/levels');
const houses = require('../mocks/dictionaries/houses');

const initDictionaries = async () => {
  await ProductDictionaryModel.deleteMany();
  await FactoryDictionaryModel.deleteMany();
  await ProductionLineDictionaryModel.deleteMany();
  await AnimalDictionaryModel.deleteMany();
  await HusbandryDictionaryModel.deleteMany();
  await LevelDictionaryModel.deleteMany();
  await HouseDictionaryModel.deleteMany();

  products.forEach(
    async product => await new ProductDictionaryModel(product).save()
  );
  factories.forEach(
    async factory => await new FactoryDictionaryModel(factory).save()
  );
  productionLines.forEach(
    async productionLine =>
      await new ProductionLineDictionaryModel(productionLine).save()
  );
  animals.forEach(
    async animal => await new AnimalDictionaryModel(animal).save()
  );
  husbandry.forEach(
    async itemHusbandry =>
      await new HusbandryDictionaryModel(itemHusbandry).save()
  );
  levels.forEach(async level => await new LevelDictionaryModel(level).save());
  houses.forEach(async house => await new HouseDictionaryModel(house).save());
};

module.exports = initDictionaries;
