const ameClient = require('amethyste-api')

module.exports = {
  init: () => {
    const ameApi = new ameClient(process.env.AMETHYSTE_API)
    return ameApi
  },
}
