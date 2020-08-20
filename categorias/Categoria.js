const Sequelize = require("sequelize")
const conection = require("../models/conector")

const Categoria = conection.define("categorias", {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Categoria