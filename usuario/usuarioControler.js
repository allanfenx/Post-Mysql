const express = require("express")
const router = express.Router()
const Usuario = require("./Usuario")
const bcrypt = require("bcryptjs")

router.get("/admin/usuarios", (req, res)=>{
    Usuario.findAll().then((usuarios)=>{
        res.render("admin/usuarios/lista", {usuarios: usuarios})
    })
})

router.get("/admin/usuarios/novo", (req, res)=>{
    res.render("admin/usuarios/novo")
})

router.post("/usuarios/novo", (req, res)=>{
    var email = req.body.email
    var password = req.body.password

    

    Usuario.findOne({where: {email: email}}).then((usuario)=>{
        if(usuario == undefined){

            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            Usuario.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect("/")
            }).catch((err)=>{
                res.redirect("/admin/usuarios/novo")
                console.log("Falha ao criar usuario " + err)
            })
        }else{
            res.redirect("/admin/usuarios/novo")
        }
    })

})

router.get("/login", (req, res) =>{
    res.render("admin/usuarios/login")
})

router.post("/autenticacao", (req, res)=>{
    var email = req.body.email
    var password = req.body.password

    Usuario.findOne({where: {email: email}}).then((usuario)=>{
        if(usuario != undefined){
            var correct = bcrypt.compareSync(password, usuario.password)

            if(correct){
                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                }
                res.redirect("/")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res)=>{
    req.session.usuario = undefined
    res.redirect("/")
})
module.exports = router