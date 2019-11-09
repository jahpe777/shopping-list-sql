require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByItemName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByItemName('dogs')

function paginateProducts(pageNumber) {
    const limit = 6
    const offset = limit * (pageNumber - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(limit)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
  
paginateProducts(3)

function addedAfterDate(daysAgo) {
knexInstance
    .select('id', 'name', 'category', 'checked', 'date_added', 'price')
    .from('shopping_list')
    .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
    .then(result => {
        console.log(result)
    })
}

addedAfterDate(3)

function totalCost() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
  }

totalCost()