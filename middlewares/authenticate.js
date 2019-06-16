const passport = require('passport');
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { UserModel } = require('../db/db.module');

// Мидлвер првоерки авторизации и обновления токена
module.exports = () => {
  return async (req, res, next) => {
    const accessToken = ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);
    const refreshToken = req.headers.refresh_token;

    try {
      const verifiedAccessToken = jwt.verify(accessToken, 'secret');
      const userId = verifiedAccessToken._id;

      const newRefreshToken = jwt.sign({ _id: userId }, 'secret', {
        expiresIn: '24h'
      });

      const updateUser = await UserModel.findByIdAndUpdate(userId, {
        $set: { refreshToken: newRefreshToken }
      }).exec();

      res.append('refresh_token', newRefreshToken);

      req.user = updateUser;
      
      next();
    } catch (e) {
      const decodedRefreshToken = jwt.decode(refreshToken, 'secret');
      const userId = decodedRefreshToken._id;

      const user = await UserModel.findById(userId);
      const userRefreshToken = user.refreshToken;

      if (refreshToken !== userRefreshToken) {
        return res.status(401).json({ message: 'Вы не авторизованы' });
      }

      const newAccessToken = jwt.sign({ _id: userId }, 'secret', {
        expiresIn: '24h'
      });
      const newRefreshToken = jwt.sign({ _id: userId }, 'secret', {
        expiresIn: '24h'
      });

      const updateUser = await UserModel.findByIdAndUpdate(userId, {
        $set: { refreshToken: newRefreshToken }
      }).exec();

      res.append('access_token', newAccessToken);
      res.append('refresh_token', newRefreshToken);

      req.user = updateUser;

      return next();
    }
  };
};
