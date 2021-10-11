const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS chefName
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)      
      `, function(err, results) {
      if (err) throw `Database Error! ${err}`
  
      callback(results.rows)
    })
  },
  create(data, callback) {

    const query = `
      INSERT INTO recipes (        
          title,
          chef_id,
          ingredients,
          preparation,
          information,
          created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const values = [
      data.title,
      data.chef_id,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
  ]

    // return db.query(query, values)
    // console.log(values)
    
    return db.query(query, values)    
  },
  find(id, callback) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chefName
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id])
      
    //   , function(err, results){
    //     if (err) throw `Database Error! ${err}`
        
    //     callback(results.rows[0])
    // })
  },
  findBy(filter, callback) {

    db.query(`
      SELECT recipes.*, chefs.name AS chefname
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      `, function(err, results) {
      if (err) throw `Database Error! ${err}`
  
      callback(results.rows)
    })

  },
  update(data) {
    const query = `
      UPDATE recipes SET        
        chef_id=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5),        
      WHERE id = $6
    `

    const values = [      
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,      
    ]

    // db.query(query, values, function(err, results) {
    //   if (err) throw `Database Error! ${err}`

    //   callback()
    // })


    return db.query(query, values)
  },
  delete(id, callback) {    
      db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
        if (err) throw `Database Error! ${err}`
  
        return callback()
      })   
  },  
  chefsSelectOptions(callback) {
    db.query(`SELECT name, id FROM chefs`, function(err, results){
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params
    //console.log(params)

    let query = "",
        filterQuery = "",
        totalQuery = `(
          SELECT count(*) FROM recipes
        ) AS total
        `    

    if ( filter ) {
      filterQuery = `
      WHERE recipes.title ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total
      `
    }

    query = `
      SELECT recipes.*, ${totalQuery}, chefs.name AS chefname
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      GROUP BY recipes.id, chefs.name LIMIT $1 OFFSET $2
    `
    
    db.query(query, [limit, offset], function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })

  },
  files(id) {
    // const results = await db.query(`

    return db.query(`
      SELECT recipe_files.*,
      files.name AS name, files.path AS path, files.id AS files_id
      FROM recipe_files
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = $1
    `, [id])

    // return results.rows
  }  
}