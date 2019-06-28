const post = require('./request').post

module.exports = {
  getAddressList: () => {
    return post('/routine/auth_api/user_address_list')
  }
}