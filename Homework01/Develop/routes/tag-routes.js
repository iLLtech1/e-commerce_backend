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
    ]
  })
    .then(tags => res.json(tags))
})

router.get('/tags/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
//   Tag.findOne({
//     where: {
//       id: req.params.id
//     },
//     attributes: [
//       'id',
//       'tag_name'
//     ],
//     include: [
//       {
//         model: Tag,
//         attributes: ['tag_name']
//       }
//     ]
//   })
//     .then(dbTagData => res.json(dbTagData))
//     .catch(error => {
//       console.log(error)
//       res.status(500).json(error)
//     })
})

router.post('/tags', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
    })
      .then(dbTagData => res.json(dbTagData))
      .catch(error => {
        console.log(error)
        res.status(500).json(error)
      })
  })    

router.put('/tags/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    tag_name: req.body.tag_name
  },
  {
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if(!dbTagData) {
      res.status(404).json({ message: 'There is no Tags with this ID'});
      return;
    }
    res.json(dbTagData)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error)
  })
})

router.delete('/tags/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ Message: 'There are no Tags with this ID'});
      return;
    }
    res.json(dbTagData)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error)
  })
})

module.exports = router;
