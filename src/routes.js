const express = require('express') // Importando o 'express"
const routes = express.Router() // Metodo do Express para deixar responsavel pelas rotas
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const home = require('./app/controllers/home')

routes.get('/', function (req, res) {
  return res.redirect("/site/index")
})


//SITE-HOME
routes.get("/site/index", home.index); // Mostrar a pagina inicial
routes.get("/site/chefs", home.indexChef); // Mostrar a lista de chefs para users
routes.get("/site/recipes", home.indexRecipe); // Mostrar a lista de receitas para users
routes.get("/site/show/:id", home.showRecipes); // Mostrar detalhes da receita

//ADMIN-RECIPES
routes.get("/admin/recipes/index", recipes.index); // Mostrar a lista de receitas (admin)
routes.get("/admin/recipes/create", multer.array('photos', 6), recipes.create); // Mostrar formulário de nova receita (admin)
routes.get("/admin/recipes/index/:id", recipes.show); // Exibir detalhes de uma receita (admin)
routes.get("/admin/recipes/index/:id/edit", recipes.edit); // Mostrar formulário de edição de receita (admin)

routes.post("/admin/recipes/index", recipes.post); // Cadastrar nova receita (admin)
routes.put("/admin/recipes/index/:id", recipes.put); // Editar uma receita (admin)
routes.delete("/admin/recipes/index", recipes.delete); // Deletar uma receita (admin)

//ADMIN-CHEFS
routes.get("/admin/chefs/index", chefs.index); // Mostrar a lista de chefs (admin)
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de novo chef (admin)
routes.get("/admin/chefs/index/:id", chefs.show); // Exibir detalhes de um chef (admin)
routes.get("/admin/chefs/index/:id/edit", chefs.edit); // Mostrar formulário de edição de chef (admin)

routes.post("/admin/chefs/index", chefs.post); // Cadastrar novo chef (admin)
routes.put("/admin/chefs/index/:id", chefs.put); // Editar um chef (admin)
routes.delete("/admin/chefs/index", chefs.delete); // Deletar um chef (admin)


module.exports = routes