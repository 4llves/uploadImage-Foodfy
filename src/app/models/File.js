const db = require('../../config/db')

module.exports = {
  createFiles({ filename, path }) {
    const query = `
      INSERT INTO files (
        name,
        path        
      ) VALUES ($1, $2)
      RETURNING id
    `
        
    const values = [
      filename,
      path,          
    ]

    return db.query(query, values)

  },
  createRecipeFiles(data) {
    const query = `
      INSERT INTO files (
        recipe_id,
        file_id        
      ) VALUES ($1, $2)
      RETURNING id
    `
        
    const values = [
      data.recipeId,
      data.file_id,
    ]

    return db.query(query, values)    
  }
}