const app = getApp();
module.exports = {
  get:(url)=>{
    let split = url.indexOf('?')>-1?'&':'?'
    url = app.globalData.url+url+split+'uid='+app.globalData.uid
    console.log('request:',url)
    return new Promise((resolve,reject)=>{
      wx.request({
        url,
        method:'GET',
        success(res){
          resolve(res)
        },
        fail(e){
          reject(e)
        }
      })
    })
  },
  post: (url, data = {}) => {
    let header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    let split = url.indexOf('?')>-1?'&':'?'
    url = app.globalData.url+url+split+'uid='+app.globalData.uid
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