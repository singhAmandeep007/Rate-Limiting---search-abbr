var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const dataRouter = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.startDt = new Date();
app.locals.rateLimits = {};

app.use((req, res, next) => {
  const LIMIT_PER_TIME_PERIOD = 5;
  const LIMIT_TIME_PERIOD = 1000 * 60; // 10sec 1min

  req.currDt = new Date();

  const { ip, currDt } = req;
  const { rateLimits } = res.app.locals;

  // 1) check if ip is not registered, if not set a key and value as initial limit and start time
  if (!rateLimits[ip]) {
    rateLimits[ip] = { limit: LIMIT_PER_TIME_PERIOD, startDt: currDt };

    res.app.locals.rateLimits = rateLimits;
    return next();
  }

  const { startDt, limit } = rateLimits[ip];
  // 2) check if req is has arrived within the TIME_FRAME (i.e. time at starting of req and time after (TIME_LIMIT + time when req arrived for 1st time)
  let isWithinTimeFrame =
    currDt.getTime() <= startDt.getTime() + LIMIT_TIME_PERIOD;

  // 3) check if limit has been exceeded
  let isLimitExceeded = limit === 1;
  // if within time frame and limit has not been exceeded
  if (isWithinTimeFrame && !isLimitExceeded) {
    rateLimits[ip].limit -= 1;
    res.app.locals.rateLimits = rateLimits;
    return next();
  }
  // if within time frame and limit is exceeded
  if (isWithinTimeFrame && isLimitExceeded) {
    return res.status(429).json({
      message: `Limit exceeded , try again after ${
        LIMIT_TIME_PERIOD / 1000
      } sec`,
    });
  }

  // surpassed the time period to track the req so we can ,reset startDt to track the req and limit again
  rateLimits[ip] = { limit: LIMIT_PER_TIME_PERIOD, startDt: currDt };
  res.app.locals.rateLimits = rateLimits;
  return next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
