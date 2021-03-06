const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const req = require("express/lib/request");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const tourRoute = require("./routes/tourRoute");
const userRoute = require("./routes/userRoute");
const locationRoute = require("./routes/locationRoute");
const requestRoute = require("./routes/requestRoute");

const AppError = require("./utils/appError");

const globalErrHandler = require("./controller/errorController");

// eslint-disable-next-line no-shadow
function getcookie(req) {
  if (req.headers.cookie) {
    const { cookie } = req.headers; //console.log(cookie);
    return cookie.split("; ");
  }
}

dotenv.config({ path: "./config.env" });
const app = express();

app.use(
  cors({ credentials: true, origin: "https://tn-travelxd.herokuapp.com" })
);

//app.use(helmet({contentSecurityPolicy:false}));
//disable csp for outside script DANGEROUS
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this ip, Please try again later",
});

app.use("/api", limiter);
app.use(express.json());

//data protect form nosql query
app.use(mongoSanitize());
//data protect against xss
// but remove due html injection for tour description
//app.use(xss());

// eslint-disable-next-line no-shadow
app.use("*", (req, res, next) => {
  const cookie = getcookie(req);
  if (cookie) {
    req.jwt = cookie;
  }

  // console.log(cookie);
  next();
});
/*
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy-Report-Only",
    "default-src *  data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval' 'unsafe-dynamic';  script-src * data: blob: 'unsafe-inline' 'unsafe-eval';  connect-src * data: blob: 'unsafe-inline';  img-src * data: blob: 'unsafe-inline';  frame-src * data: blob: ;  style-src * data: blob: 'unsafe-inline'; font-src * data: blob: 'unsafe-inline'; frame-ancestors * data: blob: 'unsafe-inline'; "
  );
  next();
});
*/
app.use(hpp({ whitelist: ["duration"] }));
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/locations", locationRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/requests", requestRoute);
app.all("*", function (req, res) {
  res.sendFile(path.join(__dirname, req.originalUrl.split("?")[0]));
});

// eslint-disable-next-line no-shadow
// app.all("*", (req, res, next) => {
//   next(new AppError(`can't find ${req.originalUrl} on this server`));
// });
app.use(globalErrHandler);
module.exports = app;
