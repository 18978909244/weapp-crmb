const post = require('./request').post

module.exports = {
  getCartList: () => {
    return post('/routine/auth_api/get_cart_list')
  },
  changeCartNum: (data) => {
    return post('/routine/auth_api/change_cart_num',data)
  },
  deleteItem:(data)=>{
    return post('/routine/auth_api/remove_cart',data)
  }
}