const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const conection = require("./models/conector")
const categorias = require("./categorias/categoriacontroler")
const artigos = require("./artigos/artigocontroler")
const usuarios = require("./usuario/usuarioControler")
const Categoria = require("./categorias/Categoria")
const Artigo = require("./artigos/Artigo")
const Usuario = require("./usuario/Usuario")
const session = require("express-session")

const Port = 3000

//Configurações
    //View engine
    app.set('view engine', "ejs")
    //Session
    app.use(session({
        secret: "fenxs",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 3000000}
    }))
    //Carrega arquivos css ou js
    app.use(express.static('public'))
    //Captura dados do formulario
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    //Rotas

    app.use("/", categorias)
    app.use("/", artigos)
    app.use("/", usuarios)

    app.get("/", (req, res)=>{
        Artigo.findAll({order: [['id', 'DESC']], limit: 4}).then((artigos)=>{
            Categoria.findAll().then((categorias)=>{
                res.render("index", {artigos: artigos, categorias: categorias})
            })
        })
    })

    app.get("/:slug", (req, res)=>{
        var slug = req.params.slug
        Artigo.findOne({where: {slug: slug}}).then((artigo)=>{
            Categoria.findAll().then((categorias)=>{
                if(artigo != undefined){
                    res.render("artigos", {artigo: artigo, categorias: categorias})
                }else{
                    res.redirect("/")
                }
            })
        }).catch((err)=>{
            res.redirect("/")
        })
    })

    app.get("/categoria/:slug", (req, res)=>{
        var slug = req.params.slug
        Categoria.findOne({where: 
            {slug: slug},
            include: [{model: Artigo}]
        }).then((categoria)=>{
            if(categoria != undefined){
                Categoria.findAll().then(categorias =>{
                    res.render("index", {artigos: categoria.artigos, categorias: categorias})
                })
            }else{
                res.redirect("/")
            }
        }).catch((err)=>{
            res.redirect("/")
        })
    })

app.listen(Port, ()=>{
    console.log("Aplicação rodando na porta "+ Port)
})