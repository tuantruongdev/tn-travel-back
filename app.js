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
    const { cookie } = req.headers;
    //console.log(cookie);
    return cookie.split("; ");
  }
}

dotenv.config({ path: "./config.env" });
const app = express();

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self';
    script-src 'report-sample' 'self' https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js https://code.jquery.com/jquery-3.6.0.js https://kit.fontawesome.com/3fc531ce88.js https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js wasm-eval;
    style-src 'report-sample' 'self' https://cdn.datatables.net https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com https://stackpath.bootstrapcdn.com;
    object-src 'none';
    base-uri 'self';
    connect-src 'self' https://ka-f.fontawesome.com;
    font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com https://ka-f.fontawesome.com https://maxcdn.bootstrapcdn.com;
    frame-src 'self';
    img-src * data:;
    manifest-src 'self';
    media-src 'self';
    report-uri https://62a23e815a9e55900da76cca.endpoint.csper.io/?v=0;
    worker-src 'none';`
  );
  next();
});

app.use(
  cors({ credentials: true, origin: "https://tn-travelxd.herokuapp.com" })
);
app.use(helmet());

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
app.use(hpp({ whitelist: ["duration"] }));
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/locations", locationRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/requests", requestRoute);
app.all("*", function (req, res) {
  res.sendFile(path.join(__dirname, req.originalUrl));
});

// eslint-disable-next-line no-shadow
// app.all("*", (req, res, next) => {
//   next(new AppError(`can't find ${req.originalUrl} on this server`));
// });
app.use(globalErrHandler);
module.exports = app;
