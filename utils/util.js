const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const needLogin = () => {
  wx.showModal({
      title: '请先登录',
      confirmText: '去登录',
      success(res) {
          if (res.confirm) {
              wx.navigateTo({
                  url: '/pages/load/load',
              })
          } else if (res.cancel) {
              console.log('用户点击取消')
          }
      }
  })
}


const needInfo = () => {
    wx.navigateTo({
        url: '/pages/info/info',
    })
}

module.exports = {
  formatTime: formatTime,
  needLogin,
  needInfo
}
