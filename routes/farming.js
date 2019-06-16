const express = require('express');
const router = express.Router();
const moment = require('moment');

const { UserModel, PlayerModel, FieldModel } = require('../db/db.module');

router.put('/:id', async (req, res, next) => {
  try {
    const farmingPropertyId = req.params.id;

    const farmingProperty = await FieldModel.findById(farmingPropertyId)
      .populate('product')
      .exec();

    const harvestTime = new Date(farmingProperty.harvest).getTime();
    const nextHarvestTime = harvestTime + farmingProperty.product.time;
    const currentTime = new Date().getTime();

    if (nextHarvestTime > currentTime) {
      const remainTime = moment(nextHarvestTime).from(moment(currentTime));
      return res.status(403).json({
        message: `Урожай не созрел, нужно подождать, ${remainTime}`
      });
    }

    await FieldModel.findByIdAndUpdate(farmingPropertyId, {
      $currentDate: { harvest: { $type: 'date' } }
    });

    await PlayerModel.findOneAndUpdate(
      { userId: req.user.id },
      {
        $inc: {
          [farmingProperty.product.type]: 1,
          experience: farmingProperty.product.experience
        }
      }
    ).exec();

    return res.json({
      message: `Урожай ${
        farmingProperty.product.name
      } в размере 1, собран! Вы заработали ${
        farmingProperty.product.experience
      } единиц опыта!`
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так =(' });
  }
});

module.exports = router;
