const router = require('express').Router()
const { Category, Product } = require('../models')

// The `/api/categories` endpoint

router.get('/categories', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    attributes: [
      'id',
      'category_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name']
      }
    ]
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(error=> {
    console.log(error)
    res.status(500).json(error)
  })
})

router.get('/categories/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'category_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name']
      }
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })

}) 

router.post('/categories', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })
})

router.put('/categories/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    category_name: req.body.category_name
  },
  {
    where: {
      id: req.params.id
    }
  })
  .then(dbCategoryData => {
    if(!dbCategoryData) {
      res.status(404).json({message: 'There are no categories with this ID'});
      return;
    }
    res.json(dbCategoryData)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error)
  })
})

router.delete('/categories/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'There are no categories with this ID' });
        return;
      }
      res.json(dbCategoryData)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })
})

module.exports = router
