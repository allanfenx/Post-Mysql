const express = require("express")
const router = express.Router()
const Categoria = require("./Categoria")
const slugify = require("slugify")
const admin = require("../midleware")


router.get("/admin/categorias/nova", admin, (req, res)=>{
    res.render("admin/categorias/novo")
})

router.post("/categorias/save", admin, (req, res)=>{
    var titulo = req.body.titulo
    if(typeof titulo != undefined){
        Categoria.create({
            titulo: titulo,
            slug: slugify(titulo)
        }).then(()=>{
            res.redirect("/admin/categorias")
        })
    }else{
        res.redirect("/admin/categorias/nova")
    }
})

router.get("/admin/categorias/", admin, (req, res)=>{
    Categoria.findAll().then((categorias)=>{
        res.render("admin/categorias/index", {categorias: categorias})
    })  
})

router.post("/categorias/delete", admin, (req, res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Categoria.destroy({where: {id: id}}).then(()=>{
                res.redirect("/admin/categorias")
            }).catch((err)=>{
                console.log("Erro ao deletar " +err)
                res.redirect("/admin/categorias")
            })
        }else{
            res.redirect("/admin/categorias")
        }
    }else{
        res.redirect("/admin/categorias")
    }
})

router.get("/admin/categorias/edit/:id", admin, (req, res)=>{
    var id = req.params.id
    Categoria.findByPk(id).then(categoria =>{
        if(categoria != undefined){
            res.render("admin/categorias/edit", {categoria: categoria})
        }else{
            res.redirect("/admin/categorias")
        }
    }).catch(err => {
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", admin, (req, res)=>{
    var id = req.body.id
    var titulo = req.body.titulo
    Categoria.update({titulo: titulo, slug: slugify(titulo)},{where: {id: id}}).then(()=>{
        res.redirect("/admin/categorias")
    })
})
module.exports = router