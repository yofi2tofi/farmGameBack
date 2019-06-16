const classValidator = require('class-validator');
const { registerSchema } = classValidator;

const UserValidationSchema = require('./schemas/user.validation');
const DishValidationSchema = require('./schemas/dish.validation');
const IngredientValidationSchema = require('./schemas/ingredient.validation');

registerSchema(UserValidationSchema);
registerSchema(DishValidationSchema);
registerSchema(IngredientValidationSchema);
