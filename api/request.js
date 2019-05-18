const app = getApp();
module.exports = {
  post: (url, data = {}) => {
    let header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    url = app.globalData.url+url+'?uid='+app.globalData.uid
    console.log('request:',url)
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: 'POST',
        header,
        data,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
}