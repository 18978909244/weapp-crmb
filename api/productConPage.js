const post = require('./request').post
const app = getApp();

module.exports = {
  getProductInfo: ({
    id
  }) => {
    return post(app.globalData.url + '/routine/auth_api/details?uid=' + app.globalData.uid, {
      id
    })
  }
}