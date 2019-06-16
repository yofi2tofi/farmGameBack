module.exports = {
  name: 'ingredientSchema',
  properties: {
    title: [
      {
        type: 'isString',
        constraints: [],
        message: 'У ингредиента должно быть название'
      }
    ],
    coverImgUrl: [
      {
        type: 'isString',
        constraints: [],
        message: 'У ингредиента должна быть обложка'
      }
    ],
    category: [
      {
        type: 'isMongoId',
        constraints: [],
        message: 'Не указана категория продукта'
      }
    ],
    calories: [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Не указано количество калорий'
      }
    ],
    'nutrients.carbohydrates': [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Не указано количество углеводов'
      }
    ],
    'nutrients.fats': [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Не указано количество жиров'
      }
    ],
    'nutrients.protein': [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Не указано количество белков'
      }
    ],
    'nutrients.water': [
      {
        type: 'isNumber',
        constraints: [],
        message: 'Не указано количество воды'
      }
    ]
  }
};
