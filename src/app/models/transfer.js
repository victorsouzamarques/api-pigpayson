const mongoose = require("../../database/index");
const transferSchema = new mongoose.Schema({
  cpfCnpj: {
    type: String,
    required: true
  },
  sucess: {
      type: Boolean
  },
  transation_id: {
      type: String
  },
  errorMessage: {
      type: String
  },
  value: {
      type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = Transfer;
