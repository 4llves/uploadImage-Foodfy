const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {
  index(req, res) {

    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        if (recipes.length === 0) {
          const pagination = {
            total: 1,
            page
          }

          return res.render("admin/recipes/index", { recipes, pagination, filter })
        } else {
          const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
          }

          return res.render("admin/recipes/index", { recipes, pagination, filter })
        }
      }
    }

    Recipe.paginate(params)
  },
  create(req, res) {
    Recipe.chefsSelectOptions(function (options) {
      return res.render('admin/recipes/create', { chefOptions: options })
    })
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)
      // console.log(req.body)

      for (key of keys) {
        if (req.body[key] == "") {
          return res.send('Please, fill all fields!')
        }    
      }      

      if (req.files.length == 0)
        return res.send('Please, sent at least one image')
      
      // console.log(req.files)

      let results = await Recipe.create(req.body)
      const recipe_id = results.rows[0].id

      const filesPromise = req.files.map(file => File.createFiles({
        ...file,
        path: file.path.replace(/\\/g, "/")
      }))

      await Promise.all(filesPromise).then(files => {
        for ( n=0; n < files.length; n++ ) {
          let filesArray = files[n].rows
          for (let file of filesArray) {
            File.createRecipeFiles(file.id, recipe_id)
          }
        }
      }) 

      return res.redirect(`/admin/recipes/${recipeId}`)

    } catch (err) {
      console.error(err)
    }
  },
  show(req, res) {

    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) return res.send("Recipe not found!")

      recipe.created_at = date(recipe.created_at).format

      return res.render('admin/recipes/show', { recipe })

    })
  },
  edit(req, res) {

    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) return res.send("Recipe not found!")

      recipe.created_at = date(recipe.created_at).format

      Recipe.chefsSelectOptions(function (options) {
        return res.render('admin/recipes/edit', { recipe, chefOptions: options })
      })
    })
  },
  put(req, res) {

    Recipe.update(req.body, function () {
      return res.redirect(`/admin/recipes/index/${req.body.id}`)
    })
  },
  delete(req, res) {

    Recipe.delete(req.body.id, function () {
      return res.redirect(`/admin/recipes/index`)
    })
  }
}