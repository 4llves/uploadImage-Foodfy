const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {

    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`, function(err, results) {
        if (err) throw `Database Error! ${err}`
    
        callback(results.rows)
      })

  },
  create(data, file_id) {

    const query = `
        INSERT INTO chefs (
            name,
            file_id,          
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
    `

    const values = [
      data.name,
      file_id,
      date(Date.now()).iso
    ]
    
    return db.query(query, values)

    // db.query(query, values, function(err, results){
    //   if (err) throw `Database Error! ${err}`
        
    //     callback(results.rows[0])
    // })
    
  },
  find(id, callback) {    

      return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)      
      GROUP BY chefs.id
      HAVING chefs.id = $1`, [id], function(err, results){
        if (err) throw `Database Error! ${err}`
        
        callback(results.rows[0])
    })      
    
    
  },
  chefsSelectRecipes(id, callback) { // A SOLUCAO É INSERIR UM "ID" COMO PARAMETRO
    // return db.query(`
    //   SELECT chefs.id, chefs.name AS chefname, recipes.*
    //   FROM chefs
    //   INNER JOIN recipes ON (recipes.chef_id = chefs.id)
    //   WHERE chefs.id = $1
    //   `, [id])

    return db.query(`
      SELECT recipes.*
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
    `, [id]
      
      , function(err, results){
      if (err) throw `Database Error! ${err}`

      callback(results.rows)})
  },
  findBy(filter, callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.name ILIKE '%${filter}%'
      OR chefs.services ILIKE '%${filter}%'
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`, function (err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2)        
      WHERE id = $3
    `

    const values = [
      data.name,
      data.file_id,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query(`
      DELETE FROM chefs WHERE id = $1
    `, [id], function(err, results){
      if (err) throw `Database Error! ${err}`

      return callback()
    })
  },
  paginate(params) {
    //SEM PAGINACAO
  },
  files(id) {
    // const results = await db.query(`

    return db.query(`
      SELECT files.*, files.name AS name, files.path AS path, files.id AS files_id
      FROM files
      LEFT JOIN chefs ON (chefs.file_id = files.id)
      WHERE chefs.file_id = $1
    `, [id])

    // return results.rows
  }  
}