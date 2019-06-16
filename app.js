const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const moment = require('moment');

const swaggerDocument = require('./swagger.js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const farmingRouter = require('./routes/farming');
const manufactureRouter = require('./routes/manufacture');
const animalsRouter = require('./routes/animals');

const authenticate = require('./middlewares/authenticate');

const initDictionaries = require('./util/initDictionaries');

const app = express();

require('./passport/local');
require('./passport/google');

require('./validationSchemas/validation.module');

moment.locale('ru');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authenticate(), usersRouter);
app.use('/api/v1/farming', authenticate(), farmingRouter);
app.use('/api/v1/manufacture', authenticate(), manufactureRouter);
app.use('/api/v1/animals', authenticate(), animalsRouter);
app.use('*', indexRouter);

initDictionaries();

module.exports = app;
