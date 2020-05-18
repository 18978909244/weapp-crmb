var app = getApp();
const Spread = require('../../api/spread')

Page({
  data: {
    logo: '',
    name: '',
    url: app.globalData.url,
  },
  onLoad: function (options) {
    var that = this;
    that.getEnterLogo();
  },
  getEnterLogo: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/login/get_enter_logo',
      method: 'post',
      dataType: 'json',
      success: function (res) {
        that.setData({
          logo: res.data.data.site_logo,
          name: res.data.data.site_name
        })
      }
    })
  },
  //获取用户信息并且授权
  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    userInfo.spid = app.globalData.spid;
    wx.login({
      success: function (res) {
        if (res.code) {
          userInfo.code = res.code;
          wx.request({
            url: app.globalData.url + '/routine/login/index',
            method: 'post',
            dataType: 'json',
            data: {
              info: userInfo
            },
            success: function (res) {
              wx.request({
                url: app.globalData.url + '/routine/auth_api/get_user_info?uid=' + res.data.data.uid,
                method: 'GET',
                success(res) {
                  const {
                    phone
                  } = res.data.data
                  wx.setStorageSync('userInfo', res.data.data)
                  wx.setStorageSync('mobileInfo', phone)
                  app.globalData.uid = res.data.data.uid;
                  const spread_uid = wx.getStorageSync('spread_uid')
                  app.globalData.openid = res.data.data.routine_openid;
                  if (spread_uid) {
                    Spread.postSpreadUid({
                      spread_uid
                    }).then(res => {
                      console.log(res.data)
                    })
                  }
                  if(!phone){
                    wx.reLaunch({
                      url: '/pages/info/info'
                    })
                  }else{
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                  
                  // if (!phone) {
                  //   wx.navigateTo({
                  //     url: '/pages/info/info'
                  //   })
                  // } else {
                  //   console.log('有phone', phone)
                  // }
                  // console.log('11',res.data.data)
                }
              })

              return;
              if (app.globalData.openPages != '' && app.globalData.openPages != undefined) { //跳转到指定页面
                wx.navigateTo({
                  url: app.globalData.openPages
                })
              } else { //跳转到首页
                if (res.data.data.page) {
                  wx.navigateTo({
                    url: res.data.data.page
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})