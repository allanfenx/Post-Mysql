const Sequelize = require("sequelize")
const conection = require("../models/conector")

const Usuario = conection.define("usuarios", {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Usuario