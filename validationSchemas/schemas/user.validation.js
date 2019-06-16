module.exports = {
  name: 'userLocalSchema',
  properties: {
    username: [
      {
        type: 'isEmail',
        constraints: [],
        message: 'Должно быть почтой'
      }
    ],
    password: [
      {
        type: 'length',
        constraints: [6, 20],
        message: 'Должно быть длинной от 6 до 20'
      },
      {
        type: 'isAlphanumeric',
        constraints: [],
        message: 'Пароль должен содержать буквы и цифры'
      }
    ]
  }
};
