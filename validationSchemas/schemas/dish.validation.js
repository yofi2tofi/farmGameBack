module.exports = {
  name: 'dishSchema',
  properties: {
    time: [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Должно быть указано время приготовления в миллисекундах'
      }
    ],
    title: [
      {
        type: 'length',
        constraints: [3, 30],
        message: 'Должно быть длинной от 3 до 30'
      }
    ],
    authorId: [
      {
        type: 'isMongoId',
        constraints: [],
        message: 'У блюда должен быть автор'
      }
    ],
    coverImgUrl: [
      {
        type: 'isString',
        constraints: [],
        message: 'У блюда должна быть обложка'
      }
    ],
    photos: [
      {
        type: 'isArray',
        constraints: [],
        message: 'Должен быть список фотографий'
      },
      {
        type: 'arrayNotEmpty',
        constraints: [],
        message: 'Необходимо добавить больше фотографий'
      },
      {
        type: 'arrayMinSize',
        constraints: [3],
        message: 'Фотографий должно быть не меньше 3х'
      }
    ],
    videoUrl: [
      {
        type: 'isString',
        constraints: [],
        message: 'У блюда должна быть видео-обложка'
      }
    ],
    complexity: [
      {
        type: 'isNumber',
        constraints: [],
        message: 'У блюда должна быть обложка'
      },
      {
        type: 'min',
        constraints: [0],
        message: 'Сложность не может быть меньше 1'
      },
      ,
      {
        type: 'max',
        constraints: [11],
        message: 'Сложность не может быть больше 10'
      }
    ],
    recipe: [
      {
        type: 'isString',
        constraints: [],
        message: 'Блюдо должно содержать рецепт приготовления'
      }
    ],
    ingredients: [
      {
        type: 'isArray',
        constraints: [],
        message: 'Должен быть список ингредиентов'
      }
    ],
    description: [
      {
        type: 'isString',
        constraints: [],
        message: 'Краткое описание блюда'
      }
    ],
    price: [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Примерная цена продуктов для приготовления 1 порции'
      }
    ],
    minutes: [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Должно быть указано время приготовления в минутах'
      }
    ]
  }
};
