require("dotenv").config();
const mongoose = require("mongoose");

const conectarBD = async () => {
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.log("No se ha podido conectar a la base de datos");
        console.log(err.message);
        return false;
      }
      console.log("Conectado a la base de datos");
      return true;
    }
  );
};

module.exports = { conectarBD };
