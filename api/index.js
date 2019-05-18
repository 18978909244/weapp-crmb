const post = require('./request').post

module.exports = {
  getIndexInfo: () => {
    return post('/routine/auth_api/index')
  },
  loadHotGoods: ({
    data
  }) => {
    return post('/routine/auth_api/get_hot_product', data)
  }
}