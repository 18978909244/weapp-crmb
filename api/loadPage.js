const post = require('./request').post

module.exports = {
  codeToUser: (data) => {
    return post('/routine/login/index', data)
  }
}