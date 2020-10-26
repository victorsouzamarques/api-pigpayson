const express = require("express");
const router = express.Router();
const axios = require("axios");
//atributes
var count = 0;
const authConfig = require("../../config/auth");

router.post("/authenticate", async (req, res) => {
  // #swagger.description = 'Endpoint usado para logar na api do pic pay, utilize o client_id e client_secret.'
  /* #swagger.tags = ['User'] */
  /* #swagger.parameters['client_id'] = {
        in: 'body',
        name: 'user',
        type: 'object',
        description: 'Id do cliente(client_id)',
        required: true,

  } */
   /* #swagger.parameters['client_secret'] = {
        in: 'body',
        name: 'client_secret',
        type: 'string',
        description: 'Senha do cliente(client_secret)',
        required: true,

  } */
  const { client_id, client_secret } = req.body;

  axios
    .post("https://api.picpay.com/oauth2/token", {
      grant_type: "client_credentials",
      client_id: client_id,
      client_secret: client_secret,
      scope: "openid b2p.transfer",
    })
    .then(response => {
      console.log(response.data);
      res.send({
        response: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).send({ error });
    });
});

module.exports = (app) => app.use("/auth", router);