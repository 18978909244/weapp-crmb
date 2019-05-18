const post = require('./request').post
const app = getApp();

module.exports = {
  getIndexInfo: ({
    uid
  }) => {
    return post(app.globalData.url + '/routine/auth_api/index?uid=' + uid)
  },
  loadHotGoods: ({
    uid,
    data
  }) => {
    return post(app.globalData.url + '/routine/auth_api/get_hot_product?uid=' + uid, data)
  }
}