const router = require('express').Router();
const Product = require('./Product')
const Category = require('./Category')
const Tag = require('./Tag')
const ProductTag = require('./ProductTag')

// Products belongsTo Category
Product.belongsTo(Category)
// Catagories hasMany Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})
// Products belong to many Tags (through ProductTag)
Product.belongsToMany(Tag, {
  trough: this.ProductTag,
  as: 'tags',
  foreignKey: 'product_id'
})
// Tags belong to many Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: this.ProductTag,
  as: 'products',
  foreignKey: 'tag_id' 
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag
}

