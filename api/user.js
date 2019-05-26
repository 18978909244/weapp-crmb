import {
  post
} from './request'
const app = getApp();
module.exports = {
  getIndexInfo(uid) {
    return post(app.globalData.url + '/routine/auth_api/index?uid=' + uid)
  },
  getMyDeliver: () => {
    return post('/routine/Auth_Api/deliverman_get_order_list?first=0&limit=100')
  }
}