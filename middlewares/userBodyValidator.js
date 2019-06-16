const classValidator = require('class-validator');

module.exports = (req, res, next) => {
  classValidator
    .validate('userLocalSchema', req.body, {
      whitelist: true,
      forbidNonWhitelisted: true
    })
    .then(errors => {
      if (errors.length) {
        const errorsMessages = errors.map(error => {
          const key = error.property;
          const messageRaw = error.constraints;

          let message;
          for (const key in messageRaw) {
            message = messageRaw[key];
          }

          return { [key]: message };
        });

        return res.status(404).json(errorsMessages);
      }

      next();
    });
};
