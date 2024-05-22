var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var livereload = require("livereload");
var connectlivereload = require("connect-livereload");
var rateLimiter = require("./middlewares/rate-limiter");

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

app.use(
  rateLimiter({
    windowMs: 1 * 60 * 1000,
    maxRequests: 5,
    // apply rate limit to these routes
    blackListedRoutes: ["/api/*"],
    // but don't rate limit theses routes, basically override the blackListedRoutes
    whiteListedRoutes: ["/api/search?q=am", "/api/search?q=qa"],
  })
);

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
