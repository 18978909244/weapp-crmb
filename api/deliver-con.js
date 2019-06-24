const post = require('./request').post
module.exports = {
  confirmDeliver: data => {
    return post('/routine/auth_api/deliverman_update_order',data)
  }
}