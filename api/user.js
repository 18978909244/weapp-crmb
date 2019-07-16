import {
  post,
  get
} from './request'
const app = getApp();
module.exports = {
  getIndexInfo(uid) {
    return post(app.globalData.url + '/routine/auth_api/index?uid=' + uid)
  },
  getMyDeliver: () => {
    return post('/routine/Auth_Api/deliverman_get_order_list?first=0&limit=100')
  },
  _getMyDeliver:()=>{
    return get('/routine/Auth_Api/deliverman_get_order_list_status')
  },
  getMySuggets: () => {
    return get('/routine/Auth_Api/my_suggest', )
  },
  postMySuggest: (data) => {
    return post('/routine/Auth_Api/submit_suggest', data)
  }
}