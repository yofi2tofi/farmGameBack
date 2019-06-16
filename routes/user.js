var express = require('express');
var router = express.Router();

const {
  UserModel,
  PlayerModel,
  FarmingModel,
  FieldModel,
  FactoryModel,
  ManufactureModel,
  ProductDictionaryModel,
  AnimalHusbandryModel,
  AnimalHusbandryBuildingModel,
  AnimalModel,
  HusbandryDictionaryModel,
  LevelDictionaryModel,
  HouseKeepingModel,
  HouseModel,
  HouseDictionaryModel
} = require('../db/db.module');

const whiteFields = require('../util/whitefield');

/**
 * @swagger
 * /user:
 *    get:
 *      tags: [ "Users" ]
 *      description: "This should generated or get all info about user include: \n
 *        resources with level, \n
 *        manufactures with feed, \n
 *        agricultures with wheat and with product \n
 *        animalFactories with cowsheds and with animalHusbandryBuilding \n
 *        houseKeeping with houses"
 *        
 */
router.get('/', async (req, res, next) => {
  try {
    const commonUserInfo = await UserModel.findById(req.user._id)
      .populate({ path: 'resources', populate: { path: 'level' } })
      .populate({
        path: 'manufactures',
        populate: {
          path: 'feed'
        }
      })
      .populate({
        path: 'agricultures',
        populate: {
          path: 'wheat',
          populate: {
            path: 'product'
          }
        }
      })
      .populate({
        path: 'animalFactories',
        populate: {
          path: 'cowsheds',
          populate: {
            path: 'animalHusbandryBuilding'
          }
        }
      })
      .populate({
        path: 'houseKeeping',
        populate: {
          path: 'houses'
        }
      })
      .select('resources agricultures')
      .exec();

    if (!commonUserInfo.resources) {
      let playerStatistics = await new PlayerModel({
        userId: req.user._id,
        level: '5d10795556b4a12e1dfbd642'
      }).save();

      playerStatistics = await PlayerModel.findById(playerStatistics._id)
        .populate('level')
        .exec();

      commonUserInfo.resources = playerStatistics;
    }

    if (!commonUserInfo.agricultures) {
      const wheatDict = await ProductDictionaryModel.findById(
        '5d06ac6f8d82b625736035c1'
      ).exec();
      const agricultures = await new FarmingModel({
        userId: req.user._id
      }).save();
      const wheatUser = await new FieldModel({
        product: wheatDict._id,
        farmingId: agricultures.wheatId
      }).save();

      wheatUser.product = wheatDict;
      agricultures.wheat = [wheatUser];
      commonUserInfo.agricultures = agricultures;
    }

    if (!commonUserInfo.manufactures) {
      const manufactures = await new ManufactureModel({
        userId: req.user._id
      }).save();

      const factory = await new FactoryModel({
        manufactureId: manufactures.feedFactoryId,
        factory: '5d07ef5757a05507c6bd2c12',
        userId: req.user._id
      }).save();

      manufactures.feed = [factory];
      commonUserInfo.manufactures = manufactures;
    }

    if (!commonUserInfo.animalFactories) {
      const animalHusbandry = await new AnimalHusbandryModel({
        userId: req.user._id
      }).save();

      const husbandryBuilding = await new AnimalHusbandryBuildingModel({
        userId: req.user._id,
        animalHusbandryId: animalHusbandry.cowshedId,
        animalHusbandryBuilding: '5d07ef5757a44407c6bd2c12'
      }).save();

      const husbandryBuildingDict = await HusbandryDictionaryModel.findById(
        '5d07ef5757a44407c6bd2c12'
      ).exec();

      const length = husbandryBuildingDict.defaultAnimalsCount;
      const animals = [];
      for (let i = 0; i < length; i++) {
        animals.push(
          await new AnimalModel({
            animal: '5d07ef5757a33507c6bd2c12',
            husbandryBuildingId: husbandryBuilding._id
          }).save()
        );
      }

      husbandryBuilding.animals = [animals];
      animalHusbandry.cowsheds = [husbandryBuilding];
      commonUserInfo.animalFactories = animalHusbandry;
    }

    if (!commonUserInfo.houseKeeping) {
      const houseKeeping = await new HouseKeepingModel({
        userId: req.user._id
      }).save();

      const houseDict = await HouseDictionaryModel.findById(
        '5d07ef5757a44407c6bd2c12'
      ).exec();

      const house = await new HouseModel({
        house: houseDict._id,
        houseKeepingId: houseKeeping._id
      }).save();

      await PlayerModel.findByIdAndUpdate(playerStatistics._id, {
        $inc: { population: house.population }
      }).exec();

      houseKeeping.houses = [house];
      commonUserInfo.houseKeeping = houseKeeping;
    }

    return res.json({
      data: commonUserInfo,
      meta: null
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.get('/level', async (req, res, next) => {
  try {
    const userId = req.user._id;
    let player = await PlayerModel.findOne({
      userId
    })
      .populate('level')
      .exec();

    const { level } = player.level;
    const upLevelDict = await LevelDictionaryModel.findOne({
      level: level + 1
    }).exec();

    if (player.experience < upLevelDict.experience) {
      return res.json({ data: null });
    }

    const resources = {};
    const bonus = upLevelDict.bonus;
    for (const key in bonus) {
      if (
        bonus.hasOwnProperty(key) &&
        whiteFields.includes(key) &&
        bonus[key]
      ) {
        resources[key] = bonus[key];
      }
    }

    await PlayerModel.findByIdAndUpdate(player._id, {
      $inc: {
        ...resources
      },
      $set: {
        level: upLevelDict._id
      }
    }).exec();

    player = await PlayerModel.findById(player._id)
      .populate('level')
      .exec();

    return res.json({
      data: player,
      meta: null
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

module.exports = router;
