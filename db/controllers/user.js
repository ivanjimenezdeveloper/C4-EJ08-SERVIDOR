const User = require("../model/User");

const loginUsuario = async (username, password) => {
  const user = await User.findOne({
    nombre: username,
    password,
  });

  if (user === null) {
    return false;
  } else {
    return user;
  }
};

module.exports = { loginUsuario };
