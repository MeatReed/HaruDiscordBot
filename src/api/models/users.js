let userModel = {}

userModel.getUserById = (req, callback, id) => {
  const user = req.client.users.cache.get(id)
  if (user) {
    callback(null, user)
  } else {
    callback(null, null)
  }
}

module.exports = userModel
