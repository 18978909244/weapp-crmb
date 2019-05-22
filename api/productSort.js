const post = require('./request').post

module.exports = {
  getCartCount: () => {
    return post('/routine/auth_api/get_cart_num')
  }
}