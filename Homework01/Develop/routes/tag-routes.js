const router = require('express').Router()
const { Tag, Product, ProductTag } = require('../models')

// The `/api/tags` endpoint

router.get('/tags', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Tag,
        attributes: ['tag_name'],
        through: Product,
        as: 'tags'
      },
      {
        model: Tag,
        attributes: [
          'id',
          'category_name'
        ]
      }
    ]
})

router.get('/tags/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Tag,
        attributes: ['category_name']
      }
    ]
  })
    .then(dbProductData => res.json(dbProductData))
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })
})

router.post('/tags', (req, res) => {
  // create a new tag
})

router.put('/tags/:id', (req, res) => {
  // update a tag's name by its `id` value
})

router.delete('/tags/:id', (req, res) => {
  // delete on tag by its `id` value
})

module.exports = router
