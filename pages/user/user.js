var app = getApp();
var wxh = require('../../utils/wxh.js');
const API = require('../../api/user')
const Index = require('../../api/index')
let interval= null
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.urlImages,
    userinfo: [],
    orderStatusNum: [],
    coupon: '',
    collect: '',
    deliver: false,
    deliverList: [],
    shopImg:'',
    service_mobile:''
  },

  goTel: function (e) {
    if (this.data.service_mobile) {
      wx.makePhoneCall({
        phoneNumber: this.data.service_mobile
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: '01000000000'
      })
    }
  },
  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },
  initData() {
    console.log('initData')
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        that.setData({
          userinfo: res.data.data,
          orderStatusNum: res.data.data.orderStatusNum
        })
      }
    });
    API._getMyDeliver().then(res => {
      if (res.data.code !== 400) {
        this.setData({
          deliver: true,
          deliverList: res.data.data,
          deliverCount: {
            ing: res.data.data.filter(item => item.state === 1).length,
            wait: res.data.data.filter(item => item.state === 2).length,
            done: res.data.data.filter(item => item.state === 3).length,
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    app.setUserInfo();
    this.initData()
    Index.getIndexInfo()
      .then(res => {
        this.setData({
          shopImg: res.data.data.config_basics.about_us,
          service_mobile: res.data.data.config_basics.site_phone
        })
      })
    interval = setInterval(this.initData,10000)
  },
  onHide:function(){
    clearInterval(interval)
  },
  goNotification: function () {
    wx.navigateTo({
      url: '/pages/news-list/news-list',
    })
  },
  /**
  * 生命周期函数--我的余额
  */
  money: function () {
    wx.navigateTo({
      url: '/pages/main/main?now=' + this.data.userinfo.now_money + '&uid=' + app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 生命周期函数--我的积分
  */
  integral: function () {
    wx.navigateTo({
      url: '/pages/integral-con/integral-con?inte=' + this.data.userinfo.integral + '&uid=' + app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 生命周期函数--我的优惠卷
  */
  coupons: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 生命周期函数--我的收藏
  */
  collects: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  /**
  * 生命周期函数--我的推广人
  */
  extension: function () {
    wx.navigateTo({
      url: '/pages/feree/feree',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 生命周期函数--我的推广
  */
  myextension: function () {
    wx.navigateTo({
      url: '/pages/extension/extension',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  showImg(e){
    let img = e.currentTarget.dataset.img
    console.log(img)
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
  /**
  * 生命周期函数--我的砍价
  */
  // cut_down_the_price:function(){
  //   wx.navigateTo({
  //     url: '../../pages/feree/feree',
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // }
})