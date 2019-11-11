const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'First',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '13.20',
            category: 'Main',
        },
        {
            id: 2,
            name: 'Second',
            date_added: new Date('2100-01-22T16:28:32.615Z'),
            price: '1.20',
            category: 'Lunch',
            
        },
        {
            id: 3,
            name: 'Third',
            date_added: new Date('2019-01-22T16:28:32.615Z'),
            price: '3.20',
            category: 'Breakfast',
        },
        {
            id: 4,
            name: 'Fourth',
            date_added: new Date('2049-01-22T16:28:32.615Z'),
            price: '7.20',
            category: 'Snack',
        },
    ]

        before (() => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DB_URL,
            })
        })

        before(() => db('shopping_list').truncate())

        afterEach(() => db('shopping_list').truncate())

        after(() => db.destroy())

    describe(`getAllItems()`, () => {
    context(`Given 'shopping_list' has data`, () => {
            beforeEach(() => {
                return db
                .into('shopping_list')
                .insert(testItems)
            })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                expect(actual).to.eql(testItems.map(item => ({
                    ...item,
                    checked: false
                })))
            })
        })
        
        context(`Given 'blogful_articles' has no data`, () => {
            it(`getAllArticles() resolves an empty array`, () => {
                return ArticlesService.getAllArticles(db)
                    .then(actual => {
                     expect(actual).to.eql([])
                    })
                })

        it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
            const newArticle = {
                    title: 'Test new title',
                    content: 'Test new content',
                    date_published: new Date('2020-01-01T00:00:00.000Z'),
                    }
                    return ArticlesService.insertArticle(db, newArticle)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: 1,
                            title: newArticle.title,
                            content: newArticle.content,
                            date_published: newArticle.date_published,
                        })
                    })
                })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                expect(actual).to.eql({
                    id: thirdId,
                    name: thirdTestItem.name,
                    date_added: thirdTestItem.date_added,
                    price: thirdTestItem.price,
                    category: thirdTestItem.category,
                    checked: false,
                    })
                })
            })

        it(`deleteArticle() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(allItems => {
                // copy the test articles array without the "deleted" article
                const expected = testItems.filter(item => item.id !== itemId)
                .map(item => ({
                    ...item,
                    checked: false,
                }))
                expect(allItems).to.eql(expected)
            })
        })
        
        it(`updateItem() updates an articles from the 'shopping_list table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            }
            const OriginalItem = testItems[idOfItemToUpdate -1]
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...OriginalItem,
                        ...newItemData,
                })
            })
        }) 
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })

        it(`insertItem() inserts an article and resolves the article with an 'id'`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            }
            return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
              expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: newItem.date_added,
                checked: newItem.checked,
                category: newItem.category,
                    })
                })
            })  
        })
    })
})