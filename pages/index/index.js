//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
const Index = require('../../api/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.urlImages,
    imgUrls: [],
    lovely: [],
    menus: [],
    indicatorDots: true, //是否显示面板指示点;
    autoplay: true, //是否自动播放;
    interval: 3000, //动画间隔的时间;
    duration: 500, //动画播放的时长;
    indicatorColor: "rgba(51, 51, 51, .3)",
    indicatorActivecolor: "#ffffff",
    recommendLsit: [],
    newList: [],
    likeList: [],
    offset: 0,
    title: "玩命加载中...",
    hidden: false
  },
  goUrl: function (e) {
    if (e.currentTarget.dataset.url != '#') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  torday: function (e) {
    wx.switchTab({
      url: '/pages/productSort/productSort'
    });
  },
  goToProductSort(e) {
    let shipType = e.currentTarget.dataset.ship
    wx.setStorageSync('shipType', shipType)
    wx.switchTab({
      url: '/pages/productSort/productSort'
    })
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
    that.getIndexInfo();
  },
  getIndexInfo: function () {
    Index.getIndexInfo()
      .then(res => {
        this.setData({
          imgUrls: res.data.data.banner,
          recommendLsit: res.data.data.best,
          newList: res.data.data.new,
          lovely: res.data.data.lovely,
          menus: res.data.data.menus,
          likeList: res.data.data.hot
        })
      })
  },
  goToSort(e) {
    if (e.currentTarget.dataset.url) {
      let obj = JSON.parse(e.currentTarget.dataset.url)
    
      app.globalData.sid = obj.sid
      app.globalData.cid = obj.cid
      console.log(app.globalData)
    }
    wx.switchTab({
      url: '../productSort/productSort',
    })
  },
  onReachBottom: function (p) {
    return;
    var that = this;
    var limit = 20;
    var offset = that.data.offset;
    if (!offset) offset = 1;
    var startpage = limit * offset;
    Index.loadHotGoods({
      data: {
        limit: limit,
        offset: startpage
      }
    }).then(res => {
      var len = res.data.data.length;
      for (var i = 0; i < len; i++) {
        that.data.likeList.push(res.data.data[i])
      }
      that.setData({
        offset: offset + 1,
        likeList: that.data.likeList
      });
      if (len < limit) {
        that.setData({
          title: "数据已经加载完成",
          hidden: true
        });
        return false;
      }
    }).catch(console.log)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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