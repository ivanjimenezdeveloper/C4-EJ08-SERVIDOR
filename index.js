const { conectarBD } = require("./db/conexionDb");
require("./apiServer");

(async () => {
  const resultado = await conectarBD();
  if (!resultado) {
    console.log("No se ha podido conectar con la base de datos");
    process.exit(1);
  }
})();
