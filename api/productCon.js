const post = require('./request').post
const app = getApp();

module.exports = {
  getProductInfo: (id) => {
    return post('/routine/auth_api/details', {
      id
    })
  }
}