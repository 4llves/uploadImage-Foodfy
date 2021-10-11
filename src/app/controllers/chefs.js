const Chef = require('../models/Chef')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {
  async index(req, res) {
    let id = req.params.id
    results = await Chef.files(id)
    
    Chef.all(function (chefs) {

      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render("admin/chefs/index", { chefs, files })
    })
  },
  create(req, res) {

    return res.render("admin/chefs/create")
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (key of keys) { //verificar campos vazios
        if (req.body[key] == "") {
          return res.send('Please, fill all fields!')
        }
      }

      if (req.files.length == 0) //verificar se existe imagem
        return res.send('Please, sent at least one image')
      // console.log(req.files)

      const filePromise = req.files.map(file => File.create({
        ...file
      }))
      
      let results = await filePromise[0]
      
      const file_id = results.rows[0].id

      results = await Chef.create(req.body, file_id)
      const chefId = results.rows[0].id

      return res.redirect(`/admin/chefs/index/${chefId}`)


      // const results = await Chef.create(req.body)

      // const recipe_id = results.rows[0].id
      // // console.log(recipe_id)

      // const filesPromise = req.files.map(file => File.create({
      //   ...file,
      //   filename: file.filename,
      //   path: file.path
      // }))

      // const filesResults = await Promise.all(filesPromise)

      // const recipeFiles = filesResults.map(file => {
      //   const file_id = file.rows[0].id
      //   RecipeFile.create({
      //     ...file,
      //     file_id,
      //     recipe_id
      //   })
      // })

      // await Promise.all(recipeFiles)

      // return res.redirect(`/admin/chefs/index`)

    } catch (err) {
      console.error(err)
    }

  },
  async show(req, res) {    
    try {
    
      let id = req.params.id
      results = await Chef.files(id)
    
      Chef.find(id,function (chef) {
        if (!chef) return res.send("ta sem chef aqui")        

        chef.created_at = date(chef.created_at).format

        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        Chef.chefsSelectRecipes(id, function (recipe) {
          return res.render('admin/chefs/show', { id, chef, chefsRecipes: recipe, files })
        })
      })      

    } catch (err) {
      console.error(err)
    }

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