const app = require("./app");

const port = 3000;
app.listen(process.env.PORT, () => {
  console.log("app is listening on port "+process.env.PORT);
});
