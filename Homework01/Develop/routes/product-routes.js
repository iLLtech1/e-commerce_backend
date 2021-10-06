const router = require('express').Router()
// Importing the Models structure from our Models Directory to be referenced in our routes
const { Product, Category, Tag, ProductTag } = require('../models')

// The `/api/products` endpoint

// get all products
router.get('/products', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  // Take the product model and find all the products in the database
  Product.findAll({
    // Display these columns or attributes associated with the product model and display in our fetch request.
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
    ],
    // Include route to display the information for this product and the tags and categories that it is associated with
    include: [
      {
        model: Tag,
        attributes: ['tag_name'],
        through: ProductTag,
        as: 'tags'
      },
      {
        model: Category,
        attributes: [
          'id',
          'category_name'
        ]
      }
    ]
  })
  // Take the data that we just requested and display in a JSON format
  .then(dbProductData => res.json(dbProductData))
  // Standard catch for any errors with the request and 500 errors are always server errors.
  .catch(error => {
    console.log(error);
    res.status(500).json(error)
  })
})

// get one product
// Including a colon inside a parameter tells the query that this item is required for this request to work
router.get('/products/:id', (req, res) => {
  // Product.findOne will find a singular item in the database with the associated ID
  Product.findOne({
    // req = request and params = parametes; Parametes means the URL query you have requeste i.e localhost:3001/api/products/3
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'product_name',
      'price',
      'stock',
      'category_id'
    ],
    include: [
      {
        model: Category,
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


// create new product
router.post('/products', (req, res) => {
  // req.body is the data input in a JSON format inside Postman
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id
          }
        })
        return ProductTag.bulkCreate(productTagIdArr)
      }
      // if no product tags, just respond
      res.status(200).json(product)
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})

// update product
router.put('/products/:id', (req, res) => {
  // update product data
  // Not all columns or attributes need to be specified in a JSON format. One attribute will be enough for a successfull request.
  Product.update(req.body, {
    // Checking parameters for target ID
    where: {
      id: req.params.id
    }
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } })
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id)
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id
          }
        })
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id)

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags)
      ])
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err)
    })
})

router.delete('/products/:id', (req, res) => {
  // Delete the product where the ID matches the parameter
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbProductData => {
      // IF there are not products with this matching ID then respond a json error message to notify the user.
      if (!dbProductData) {
        res.status(404).json({ message: 'There are no products with this ID' });
        return;
      }
      // IF there is a product that matches then return 
      res.json(dbProductData)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })
})

module.exports = router
