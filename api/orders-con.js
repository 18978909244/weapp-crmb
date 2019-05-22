const get = require('./request').get
module.exports = {
  getPay: id  => {
    return get('/routine/auth_api/pay_order?uni=' + id)
  }
}