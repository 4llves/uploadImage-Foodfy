const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {

        Chef.all(function (chefs) {
            return res.render("admin/chefs/index", { chefs })
        })
    },
    create(req, res) {

        return res.render("admin/chefs/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/admin/chefs/index/${chef.id}`)
        })
    },
    show(req, res) {
        let id = req.params.id

        Chef.find(id, function (chef) {
            if (!chef) return res.send("Chef not found!")

            chef.created_at = date(chef.created_at).format
            
            Chef.chefsSelectRecipes(id, function (recipe) {                
                return res.render('admin/chefs/show', { chef, chefsRecipes: recipe })
            })            
        })
    },
    edit(req, res) {

        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef not found!")

            chef.created_at = date(chef.created_at).format

            return res.render('admin/chefs/edit', { chef })
        })
    },
    put(req, res) {

        Chef.update(req.body, function () {
            return res.redirect(`/admin/chefs/index/${req.body.id}`)
        })
    },
    delete(req, res) {
        
        if (req.body.totalRecipes < 1) {
            Chef.delete(req.body.id, function () {          
                return res.redirect(`/admin/chefs/index`)
            })
        } else {
            return res.send("chef with recipes cannot be excluded!")            
        }
    }
}