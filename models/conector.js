require("dotenv").config()
const Sequelize = require("sequelize")

const conection = new Sequelize(process.env.DATABASE, process.env.USERS, process.env.PASSWORD,{
    host: process.env.HOST,
    dialect: 'mysql',
    define:{
        timestamps: false
    }
})

conection.authenticate().then(()=>{
    console.log("Conectado ao banco dados AWS")
})
module.exports = conection