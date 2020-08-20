const express = require("express")
const router = express.Router()
const Categoria = require("../categorias/Categoria")
const Artigo = require("./Artigo")
const slugify = require("slugify")
const admin = require("../midleware")

router.get("/admin/artigos", admin, (req, res)=>{
    Artigo.findAll({
        include: [{model: Categoria}]
    }).then((artigos)=>{
        res.render("admin/artigos/artigos", {artigos: artigos})
    })
})

router.get("/admin/artigos/novo", admin, (req, res)=>{
    Categoria.findAll().then((categorias)=>{
        res.render("admin/artigos/novo", {categorias: categorias})
    })
})

router.post("/artigos/save", admin, (req, res)=>{
    var titulo = req.body.titulo
    var corpo = req.body.corpo
    var categoria = req.body.categoria

    Artigo.create({
        titulo: titulo,
        slug: slugify(titulo),
        corpo: corpo,
        categoriaId: categoria
    }).then(()=>{
        res.redirect("/admin/artigos")
    })
})


router.post("/artigos/delete", admin, (req, res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Artigo.destroy({where: {id: id}}).then(()=>{
                res.redirect("/admin/artigos")
            }).catch((err)=>{
                console.log("Erro ao deletar " +err)
                res.redirect("/admin/artigos")
            })
        }else{
            res.redirect("/admin/artigos")
        }
    }else{
        res.redirect("/admin/artigos")
    }
})

router.get("/admin/artigos/edit/:id", admin, (req, res)=>{
    var id = req.params.id
    Artigo.findByPk(id).then((artigo)=>{
        if(artigo != undefined){
            Categoria.findAll().then((categorias)=>{
                res.render("admin/artigos/edit", {categorias: categorias, artigo: artigo})
            })
        }else{
            res.redirect("/")
        }
    }).catch((err)=>{
        res.redirect("/")
    })
})

router.post("/artigos/edit", admin, (req, res)=>{
    var id = req.body.id
    var titulo = req.body.titulo
    var corpo = req.body.corpo
    var categoria = req.body.categoria

    Artigo.update({
        titulo: titulo,
        corpo: corpo,
        slug: slugify(titulo),
        categoriaId: categoria
    },{where: {id: id}}).then(()=>{
        res.redirect("/admin/artigos")
    }).catch((err)=>{
        res.redirect("/")
    })
})

router.get("/artigos/page/:num",(req, res)=>{
    var page = req.params.num
    var offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = parseInt(page -1) * 4
    }

    Artigo.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', "DESC"]]
    }).then((artigos)=>{
        var next
        if(offset + 4 > artigos.count){
            next = false
        }else{
            next = true
        }

        var resultado = {
            page: parseInt(page),
            next: next,
            artigos: artigos
        }

        Categoria.findAll().then((categorias)=>{
            res.render("admin/artigos/page", {resultado: resultado, categorias: categorias})
        })

    })
})
module.exports = router