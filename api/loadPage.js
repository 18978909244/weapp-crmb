const post = require('./request').post
const app = getApp();

module.exports = {
  codeToUser: (data) => {
    console.log('1')
    return post(app.globalData.url + '/routine/login/index', data)
  }
}