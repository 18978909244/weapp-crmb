const post = require('./request').post

module.exports = {
  getUserOrderList: (data) => {
    return post('/routine/auth_api/get_user_order_list', data)
  }
}