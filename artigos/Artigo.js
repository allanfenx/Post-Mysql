const Sequelize = require("sequelize")
const conection = require("../models/conector")
const Categoria = require("../categorias/Categoria")

const Artigo = conection.define("artigos", {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    corpo:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})
Categoria.hasMany(Artigo)
Artigo.belongsTo(Categoria)

module.exports = Artigo