const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, GET, DELETE, OPTIONS");
  next();
});
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
require("./app/controllers/index")(app);
console.log('entrou aqui')
app.listen(process.env.PORT || 3000);
