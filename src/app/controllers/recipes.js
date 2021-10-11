const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')
const { date } = require('../../lib/utils')


module.exports = {
  async index(req, res) {
    try {
      
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
      
    } catch (err) {
      console.error(err)      
    }    
    
  },
  create(req, res) {
    Recipe.chefsSelectOptions(function (options) {
      return res.render('admin/recipes/create', { chefOptions: options })
    })
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)      
      // console.log(keys)

      for (key of keys) { //verificar campos vazios
        if (req.body[key] == "") {
          return res.send('Please, fill all fields!')
        }    
      }

      if (req.files.length == 0) //verificar se existe imagem
        return res.send('Please, sent at least one image')            
      // console.log(req.files)     

      const results = await Recipe.create(req.body)
      const recipe_id = results.rows[0].id
      // console.log(recipe_id)

      const filesPromise = req.files.map(file => File.create ({        
        ...file,
        filename: file.filename,
        path: file.path
      }))

      const filesResults = await Promise.all(filesPromise)

      const recipeFiles = filesResults.map(file => {             
        const file_id = file.rows[0].id
        RecipeFile.create({
          ...file,
          file_id,
          recipe_id
        })
      })

      await Promise.all(recipeFiles)
      
      return res.redirect(`/admin/recipes/index/${recipe_id}`)

    } catch (err) {
      console.error(err)
    }
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]


    if(!recipe) return res.send("Recipe Not Found!")

    results = await Recipe.files(recipe.id)
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))


    return res.render('admin/recipes/show', { recipe, files })
  },
  async edit(req, res) {
    
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]
    
    if(!recipe) return res.send("Product not found!")

    //get images
    results = await Recipe.files(recipe.id)
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    // console.log(req.params.id)   

    Recipe.chefsSelectOptions(function (options) {
      return res.render("admin/recipes/edit", { recipe, chefOptions: options, files })
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