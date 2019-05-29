const get = require('./request').get
module.exports = {
  confirmDeliver: uni => {
    return get('/routine/auth_api/deliverman_update_order?uni=' + uni + '&toStatus=2')
  }
}