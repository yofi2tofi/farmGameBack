const express = require('express');
const router = express.Router();
const moment = require('moment');

const {
  ManufactureModel,
  FactoryDictionaryModel,
  ProductionLineDictionaryModel,
  PlayerModel,
  FactoryModel
} = require('../db/db.module');

router.get('/', async (req, res, next) => {
  try {
    const manufacture = await ManufactureModel.findOne({
      userId: req.user._id
    })
      .populate({
        path: 'feed',
        populate: {
          path: 'factory',
          populate: {
            path: 'lines',
            populate: {
              path: 'materials.product',
              model: 'ProductDictionary'
            }
          }
        }
      })
      .exec();

    return res.json({
      data: manufacture,
      meta: null
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.get('/:factoryId', async (req, res, next) => {
  try {
    const factoryPropertyId = req.params.factoryId;
    const factory = await FactoryDictionaryModel.findById(factoryPropertyId)
      .populate({
        path: 'lines',
        populate: {
          path: 'materials.product',
          model: 'ProductDictionary'
        }
      })
      .exec();

    return res.json({
      data: factory,
      meta: null
    });
  } catch (e) {
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.put('/', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userFactoryId, lineId } = req.body;

    const resources = await PlayerModel.findOne({ userId }).exec();
    const productionLine = await ProductionLineDictionaryModel.findById(lineId)
      .populate({ path: 'materials.product', select: 'name type time' })
      .exec();

    let factory = await FactoryModel.findById(userFactoryId).exec();
    if (factory.isBusy) {
      return res.status(400).json({
        message: `Нельзя запускать фабрику, пока выполняется предыдущий заказ`
      });
    }

    const materials = productionLine.materials;
    const materialsLength = materials.length;
    const resource = {};
    for (let i = 0; i < materialsLength; i++) {
      const material = materials[i];
      if (!resources[material.product.type]) {
        return res
          .status(400)
          .json({ message: `Недостаточно ${material.product.name}` });
        break;
      }

      if (resources[material.product.type] - material.count < 0) {
        return res
          .status(400)
          .json({ message: `Недостаточно ${material.product.name}` });
        break;
      }

      resource[material.product.type] = -material.count;
    }

    await PlayerModel.findOneAndUpdate({ userId }, { $inc: resource }).exec();
    await FactoryModel.findByIdAndUpdate(userFactoryId, {
      $set: {
        isBusy: true,
        produced: new Date(Date.now() + productionLine.time).toISOString(),
        selectedLine: lineId
      }
    }).exec();

    return res.json({ message: 'Производство запущенно!' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.put('/produced', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userFactoryId, lineId } = req.body;

    const factory = await FactoryModel.findById(userFactoryId).exec();

    if (!factory.isBusy) {
      return res.status(400).json({ message: 'Фабрика ничего не производит' });
    }

    const producedMs = new Date(factory.produced).getTime();
    const currentMs = new Date().getTime();

    if (producedMs > currentMs) {
      const remainTime = moment(producedMs).from(moment(currentMs));
      return res.status(400).json({
        message: `Товар еще не произведен, нужно подождать, ${remainTime}`
      });
    }

    const productionLine = await ProductionLineDictionaryModel.findById(lineId)
      .populate({ path: 'produced.product', select: 'name type time' })
      .exec();
    const { count, product } = productionLine.produced;

    await PlayerModel.findOneAndUpdate(
      { userId },
      {
        $inc: {
          [product.type]: count,
          experience: productionLine.experience
        }
      }
    ).exec();

    await FactoryModel.findByIdAndUpdate(userFactoryId, {
      $set: {
        isBusy: false,
        selectedLine: null
      },
      $currentDate: { produced: { $type: 'date' } }
    }).exec();

    return res.json({ message: 'Товар успешно произведен!' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

module.exports = router;
