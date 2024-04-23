const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "123456",
    database: "harry"
});

const createWizar = async (req, res) => {
    try {
        const {nombre, correo, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await pool.query("INSERT INTO magos(nombre, correo, password) VALUES ($1, $2, $3) RETURNING*",
        [nombre, correo, hashedPassword])
        
        const newUser = response.rows[0];
        const token = jwt.sign(
          {
              id: newUser.id,
              nombre: newUser.nombre,
              correo: newUser.correo
          },
          "clavesecreta",
      );
        res.status(201).json({
          message: "usuario creado",
          body: { nombre, correo, password},
          token: token
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error en los datos del mago")
    }

}

const loginWizar = async (req, res, next) => {
  const { nombre, password } = req.body;
  const response = await pool.query(
      "SELECT * FROM magos WHERE nombre=$1",
      [nombre]
  );
  const wizard = response.rows[0];
  console.log(wizard);
  if (!wizard) {
      return res.status(401).send("El mago NO EXISTE");
  } else {
      if (!bcrypt.compareSync(password, wizard.password)) {
          return res.status(401).send("CONTRASEÑA INCORRECTA");
      } else {
          // Utilizar el mismo token generado durante la creación del usuario
          const token = jwt.sign(
              {
                  id: wizard.id,
                  nombre: wizard.nombre,
                  correo: wizard.correo
              },
              "clavesecreta"
          );
          res.json({ token });
      }
  }
};


module.exports = {createWizar, loginWizar}