import {
  post,
  get
} from './request'
module.exports = {
  postSpreadUid: (data) => {
    return post('/routine/auth_api/spread_uid', data)
  }
}