const express = require("express");
const Transfer = require("../models/transfer");
const router = express.Router();
const fs = require("fs");
const formidable = require("formidable");
const xlsx = require("node-xlsx");
const FormData = require("form-data");
const form = new FormData();
const BrM = require("br-masks");

const resultSucess = {
  transaction_id: 11111111,
  created_at: "2010-22-11",
};

const messageTransferExist = "já foi transferido para esse cpf/cnpj";

router.get("/listTransfer/:sucess/:cpfCnpj", async (req, res, next) => {
  // #swagger.description = 'Endpoint usado para filtrar as transferências feitas.'
  /* #swagger.tags = ['Transfers'] */
  /* #swagger.parameters['Payload listTransfer'] = {
        in: 'body',
        name: 'Payload listTransfer',
        type: 'object',
        schema:{
          type: "object",
          propeties: {
            sucess: {
              type: "string"
            },
            cpfCnpj: {
              type: "string"
            }
          }
        },
        example: {
          sucess: "True ou False",
          cpfCnpj: "cpf ou cnpj(com ou sem máscara)"
        },
        description: "",
        required: true
  } */

  const { sucess, cpfCnpj } = req.params;
  let listTransfer;
  let maskedCpfCnpj = putMaskOnCpfCnpj(cpfCnpj);
  if (sucess === "all" && maskedCpfCnpj === "all") {
    listTransfer = await Transfer.find();
    res.send(listTransfer);
  } else if (sucess === "all" && maskedCpfCnpj !== null) {
    listTransfer = await Transfer.find({ cpfCnpj: maskedCpfCnpj });
    res.send(listTransfer);
  } else if (sucess !== null && maskedCpfCnpj === "all") {
    console.log(sucess);
    listTransfer = await Transfer.find({ sucess });
    res.send(listTransfer);
  } else if (sucess !== null && maskedCpfCnpj !== null) {
    listTransfer = await Transfer.find({ sucess, cpfCnpj: maskedCpfCnpj });
    res.send(listTransfer);
  }
});

router.post("/", async (req, res, next) => {
  // #swagger.description = 'Endpoint para ler um arquivo .xlsx e retornar os cpfs e fazer as transferências, o resultado é salvo em um banco NoSQL.'
  /* #swagger.tags = ['Transfers'] */
  /* #swagger.parameters['filetoupload'] = {
        in: 'formData',
        name: 'filetoupload',
        type: 'file',
        description: 'Arquivo para upload',
        required: true,

  } */
  /* #swagger.parameters['value'] = {
        in: 'formData',
        name: 'value',
        type: 'number',
        description: 'Valor a ser transferido',
        required: true,

  } */
  /* #swagger.parameters['token'] = {
        in: 'formData',
        name: 'token',
        type: 'string',
        description: 'token para validação da requisição',
        required: true,

  } */

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    const { token, value } = fields;
    const config = {
      headers: { Authorization: `Baerer ${token}` },
    };

    var filePath = files.filetoupload.path;
    let file;
    file = xlsx.parse(fs.readFileSync(filePath));
    let arrayCpfCnpj = [];
    file.map((data, index) => {
      // if (index === 1) {
      data.data.map((data) => {
          arrayCpfCnpj.push(putMaskOnCpfCnpj(String(data[2])));
      });
      // }
    });

    arrayCpfCnpj.map(async (cpfCnpj) => {
      if (cpfCnpj === undefined || cpfCnpj === "CPF" || cpfCnpj === "undefined") {
        
      } else {
        let findcpfCnpj = await Transfer.findOne({ cpfCnpj });
        // console.log(findcpfCnpj);

        if (findcpfCnpj === null) {
          processTransferMock(cpfCnpj, value, config);
        } else if (
          findcpfCnpj.sucess ||
          findcpfCnpj.errorMessage === messageTransferExist
        ) {
          await Transfer.create({
            cpfCnpj: cpfCnpj,
            sucess: false,
            errorMessage: messageTransferExist,
          });
        } else if (
          !findcpfCnpj.sucess &&
          findcpfCnpj.errorMessage !== messageTransferExist
        ) {
          processTransferMock(cpfCnpj, value, config);
        }
      }
    });
    res.status(200).send({message:"Execução finalizada!"});
  });

  //   arrayCpfCnpj.map(async (cpfCnpj) => {
  //     console.log(value);

  //     let findcpfCnpj = await Transfer.findOne({ cpfCnpj });
  //     // console.log(findCpf);

  //     if (findcpfCnpj === null) {
  //       processTransfer(cpfCnpj, value, config);
  //     } else if (
  //       findcpfCnpj.sucess ||
  //       findcpfCnpj.errorMessage === messageTransferExist
  //     ) {
  //       await Transfer.create({
  //         cpfCnpj: cpfCnpj,
  //         sucess: false,
  //         errorMessage: messageTransferExist,
  //       });
  //     } else if (
  //       !findcpfCnpj.sucess &&
  //       findcpfCnpj.errorMessage !== messageTransferExist
  //     ) {
  //       processTransfer(cpfCnpj, value, config);
  //     }
  //   });
  //   res.send("Execução finalizada!");
  // });
});

function putMaskOnCpfCnpj(cpfCnpj) {
  let maskedCpfCnpj = cpfCnpj;

  if (cpfCnpj !== null) {
    if (cpfCnpj.indexOf(".") === -1) {
      if (cpfCnpj.length === 11) {
        maskedCpfCnpj = BrM.cpf(cpfCnpj);
      } else if (cpfCnpj.length === 14) {
        maskedCpfCnpj = BrM.cnpj(cpfCnpj);
      }
    }
  }
  return maskedCpfCnpj;
}

async function processTransferMock(cpfCnpj, value, config) {
  await Transfer.create({
    cpfCnpj: cpfCnpj,
    sucess: true,
    transation_id: resultSucess.transaction_id,
    value: value,
  });
}

async function processTransfer(cpfCnpj, value, config) {
  await axios
    .post(
      "https://api.picpay.com/v1/b2p/transfer",
      {
        consumer: cpfCnpj,
        value: value,
        not_withdrawable: false,
      },
      config
    )
    .then(async function (response) {
      console.log(response);
      await Transfer.create({
        cpfCnpj: cpfCnpj,
        sucess: true,
        transation_id: response.data.transaction_id,
        value: value,
      });
      res.send({ response: response.data });
    })
    .catch(async function (error) {
      console.log(error);
      Transfer.create({
        cpfCnpj: cpfCnpj,
        sucess: false,
        errorMessage: error,
      });
      res.status(400).send({ error });
    });
}

module.exports = (app) => app.use("/transfer", router);
