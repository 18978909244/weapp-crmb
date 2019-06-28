//app.js
var app = getApp();
// var wxh = require('../../utils/wxh.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // that.getRoutineStyle();
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if(userInfo){
      console.log(userInfo.uid)
      // this.globalData.uid = 15
      this.globalData.uid = userInfo.uid
    }
  },
  globalData: {
    routineStyle:'#9bd040',
    uid: null,
    openPages:'',
    spid:0,
    urlImages: '',
    url: 'https://fresh.kuashou.com',
    priceStart:0.02,
    sid:'',
    cid:''
  },
  getRoutineStyle:function(){
    var that = this;
    wx.request({
      url: that.globalData.url + '/routine/login/get_routine_style',
      method: 'post',
      dataType  : 'json',
      success: function (res) {
        that.globalData.routineStyle = res.data.data.routine_style;
        that.setBarColor();
      }
    })
  },
  setBarColor:function(){
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: that.globalData.routineStyle,
    })
  },
  setUserInfo : function(){
    var that = this;
    if (that.globalData.uid == null) {//是否存在用户信息，如果不存在跳转到首页
      wx.showToast({
        title: '用户信息获取失败',
        icon: 'none',
        duration: 1500,
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/load/load',
        })
      }, 1500)
    }
  },
})