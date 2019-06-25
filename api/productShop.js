const post = require('./request').post

module.exports = {
  getCartCount: () => {
    return post('/routine/auth_api/get_cart_num')
  },
  payToShop:(data)=>{
    return post('/routine/auth_api/merchant_wechat_charge',data)
  },
  getShopInfo:(data)=>{
    return post('/routine/auth_api/get_merchant_info',data)
  },
  getShopList:()=>{
    return post('/routine/auth_api/get_merchant_list')
  }
}