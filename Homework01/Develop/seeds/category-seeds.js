const { Category } = require('../models')

const categoryData = [
  {
    category_name: 'Shirts'// catagory 1
  },
  {
    category_name: 'Shorts'// catagory 2
  },
  {
    category_name: 'Music'// catagory 3
  },
  {
    category_name: 'Hats'// catagory 4
  },
  {
    category_name: 'Shoes'// catagory 5
  }
]

const seedCategories = () => Category.bulkCreate(categoryData)

module.exports = seedCategories
