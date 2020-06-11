let botModel = {}

botModel.botinfo = (req, callback) => {
  const user = req.client.users.cache.get(req.client.user.id)
  if (user) {
    callback(null, user)
  } else {
    callback(null, null)
  }
}

module.exports = botModel
