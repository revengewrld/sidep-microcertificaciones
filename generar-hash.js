const bcrypt = require("bcryptjs");

const contraseña = "admin123";
const hash = bcrypt.hashSync(contraseña, 10);

console.log("Contraseña encriptada:", hash);