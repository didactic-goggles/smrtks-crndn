const path = require('path');
const express = require('express');
const compression = require('express-compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const logger = require('./utils/logger');

// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const apiRouter = require('./routes/apiRoutes');

const app = express();

app.locals.env = process.env;

app.use(compression());

app.enable('trust proxy');

//Added for Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//console.log(process.env.NODE_ENV);
// 1) GLOBAL MIDDLEWARES

app.use(cors());

app.options('*', cors());

//render static file with defination
//app.use(express.static(`${__dirname}/public`));
const maxAge = process.env.NODE_ENV === 'development' ? 0 : 24 * 60 * 60 * 1000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge }));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
  })
);

app.use((req, res, next) => {
  req.created = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

app.use('/api', apiRouter);
app.use('/', viewRouter);

app.locals.moment = require('moment');

app.use(globalErrorHandler);

module.exports = app;
