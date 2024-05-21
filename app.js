var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var livereload = require("livereload");
var connectlivereload = require("connect-livereload");

let indexRouter = require("./routes/index");
let apiRouter = require("./routes/api");

let publicDir = path.join(__dirname, "public");

// create a livereload server
var liveReloadServer = livereload.createServer();
// watch the public directory for changes
liveReloadServer.watch(publicDir);
// refresh the browser when a file is changed
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

var app = express();

// add livereload script tag to the response
app.use(connectlivereload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDir));

// rate limit setup
app.locals.rateLimits = {};
app.use((req, res, next) => {
  // if the request is not an api request, skip the rate limiting
  if (!req.path.includes("/api")) {
    return next();
  }

  const REQUEST_LIMIT_PER_TIME_PERIOD = 5;
  const TIME_PERIOD = 1000 * 60; // 1sec * 60 -> 1min

  const currentTime = Date.now();

  const clientIp = req.ip;

  // 1) check if ip is not registered, if not set a key and value as initial limit and start time
  if (!app.locals.rateLimits[clientIp]) {
    app.locals.rateLimits[clientIp] = { limit: REQUEST_LIMIT_PER_TIME_PERIOD, startTime: currentTime };

    return next();
  }

  const { startTime, limit } = app.locals.rateLimits[clientIp];
  // 2) check if req is has arrived within the TIME_FRAME (i.e. time at starting of req and time after (TIME_LIMIT + time when req arrived for 1st time)
  let isWithinTimeFrame = currentTime < startTime + TIME_PERIOD;

  // 3) check if limit has been exceeded
  let isLimitExceeded = limit === 1;
  // 4) if within time frame and limit has not been exceeded
  if (isWithinTimeFrame && !isLimitExceeded) {
    // decrement the limit
    app.locals.rateLimits[clientIp].limit -= 1;
    app.locals.rateLimits[clientIp].startTime = currentTime;
    // continue to the next middleware
    return next();
  }
  // 4) if within time frame and limit is exceeded
  if (isWithinTimeFrame && isLimitExceeded) {
    let timeElapsed = currentTime - app.locals.rateLimits[clientIp].startTime;
    // return a 429 status code with a message
    return res.status(429).json({
      message: `Limit exceeded, try again after ${Math.round((TIME_PERIOD - timeElapsed) / 1000)} sec`,
    });
  }

  // 5) surpassed the time period to track the req so we can ,reset startTime to track the req and limit again
  app.locals.rateLimits[clientIp] = { limit: REQUEST_LIMIT_PER_TIME_PERIOD, startTime: currentTime };

  return next();
});

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
