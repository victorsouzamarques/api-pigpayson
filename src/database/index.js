const mongoose = require("mongoose");

//mongoose.connect("mongodb://localhost/noderest", { useNewUrlParser: true });
mongoose
.connect("mongodb+srv://victorsouzamarques:01j03u05l07i09a@cluster0.hrd0l.mongodb.net/picpay-controle?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

module.exports = mongoose;
