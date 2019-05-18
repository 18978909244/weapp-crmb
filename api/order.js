import {
  post
} from './request'
const app = getApp();
export default {
  getIndexInfo(uid){
    return post(app.globalData.url + '/routine/auth_api/index?uid=' + uid)
  }
}