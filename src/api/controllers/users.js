const { Router } = require('express')
const userModel = require('../models/users')
const router = Router()

/* GET user by ID. */
router.get('/user/getUserById/:id', function (req, res, next) {
  const id = req.params.id
  userModel.getUserById(
    req,
    (err, data) => {
      res.status(200).json(data)
    },
    id
  )
})

module.exports = router
