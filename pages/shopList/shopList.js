//index.js
//获取应用实例
var app = getApp();
const Shop = require('../../api/productShop')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.spid) {
      app.globalData.spid = options.spid
    }
    app.setUserInfo();
    that.getShopList()
  },
  getShopList:function(){
    Shop.getShopList()
      .then(res=>{
        this.setData({
          shopList:res.data.data.filter((item,index)=>index<4)
        })
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '小程序',
      path: '/pages/index/index?spid=' + app.globalData.uid,
      // imageUrl: that.data.url + that.data.product.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})