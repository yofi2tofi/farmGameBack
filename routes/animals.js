const express = require('express');
const router = express.Router();
const moment = require('moment');

const {
  AnimalHusbandryModel,
  AnimalModel,
  PlayerModel
} = require('../db/db.module');

router.get('/', async (req, res, next) => {
  try {
    const animalHusbandry = await AnimalHusbandryModel.findOne({
      userId: req.user._id
    })
      .populate({
        path: 'cowsheds',
        populate: {
          path: 'animals'
        }
      })
      .exec();

    return res.json({
      data: animalHusbandry,
      meta: null
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const animalId = req.params.id;
    const animal = await AnimalModel.findById(animalId)
      .populate({
        path: 'animal',
        populate: [
          {
            path: 'produced.product',
            select: 'type time'
          },
          {
            path: 'material.product',
            select: 'type'
          }
        ]
      })
      .exec();

    return res.json({
      data: animal,
      meta: null
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const animalId = req.params.id;

    const resources = await PlayerModel.findOne({ userId }).exec();
    const animalUser = await AnimalModel.findById(animalId)
      .populate({
        path: 'animal',
        populate: [
          {
            path: 'produced.product',
            select: 'type time'
          },
          {
            path: 'material.product',
            select: 'type name'
          }
        ]
      })
      .exec();

    const material = animalUser.animal.material;
    const produced = animalUser.animal.produced;

    if (animalUser.isBusy) {
      return res.status(400).json({
        message: `В данный момент животное занято.`
      });
    }

    if (!resources[material.product.type]) {
      return res
        .status(400)
        .json({ message: `Недостаточно ${material.product.name}` });
    }

    if (resources[material.product.type] - material.count < 0) {
      return res
        .status(400)
        .json({ message: `Недостаточно ${material.product.name}` });
    }

    const resource = {
      [material.product.type]: -material.count
    };

    await PlayerModel.findOneAndUpdate({ userId }, { $inc: resource }).exec();
    await AnimalModel.findByIdAndUpdate(animalId, {
      $set: {
        isBusy: true,
        gathering: new Date(Date.now() + produced.product.time).toISOString()
      }
    }).exec();

    return res.json({ message: 'Производство запущенно!' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

router.put('/produced/:id', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const animalId = req.params.id;

    const animalUser = await AnimalModel.findById(animalId)
      .populate({
        path: 'animal',
        populate: [
          {
            path: 'produced.product',
            select: 'type experience'
          }
        ]
      })
      .exec();

    if (!animalUser.isBusy) {
      return res.status(400).json({ message: 'Животное ничего не производит' });
    }

    const producedMs = new Date(animalUser.gathering).getTime();
    const currentMs = new Date().getTime();

    if (producedMs > currentMs) {
      const remainTime = moment(producedMs).from(moment(currentMs));
      return res.status(400).json({
        message: `Товар еще не произведен, нужно подождать, ${remainTime}`
      });
    }

    const produced = animalUser.animal.produced;

    await PlayerModel.findOneAndUpdate(
      { userId },
      {
        $inc: {
          [produced.product.type]: produced.count,
          experience: produced.product.experience
        }
      }
    ).exec();

    await AnimalModel.findByIdAndUpdate(animalId, {
      $set: {
        isBusy: false
      },
      $currentDate: { gathering: { $type: 'date' } }
    }).exec();

    return res.json({ message: 'Товар успешно произведен!' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

module.exports = router;
