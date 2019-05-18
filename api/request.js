module.exports = {
  post: (url, data = {}) => {
    let header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
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