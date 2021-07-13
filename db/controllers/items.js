const Items = require("../model/Items");

const itemsPorUserId = async (idUsuario) => {
  const items = await Items.findOne({
    user: idUsuario,
  });

  const itemsFormateados = items.objetos;

  if (!items) {
    return false;
  } else {
    return itemsFormateados;
  }
};

module.exports = { itemsPorUserId };
