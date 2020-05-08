//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
const Index = require('../../api/index')
const Shop = require('../../api/productShop')
const Spread = require('../../api/spread')

const moment = require('../../utils/moment')
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
    hidden: false,
    hide_shop_entry: true,
    w: 'd',
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    itemNew: [],
    benefit:[]
  },
  goUrl: function(e) {
    if (e.currentTarget.dataset.url != '#') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  torday: function(e) {
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
  onLoad: function(options) {
    var that = this;
    if (options.spid) {
      app.globalData.spid = options.spid
    }
    if(options.scene){
      let spread_uid = decodeURIComponent(options.scene)
      console.log('spread_uid',spread_uid)
      wx.setStorageSync('spread_uid',spread_uid)
      if(app.globalData.uid){
        Spread.postSpreadUid({
          spread_uid
        }).then(res=>{
          console.log(res.data)
        })
      }
    }
    app.setUserInfo();
    that.getIndexInfo();
    that.getShopList()
  },
  getShopList: function() {
    Shop.getShopList()
      .then(res => {
        this.setData({
          shopList: res.data.data
        })
      })
  },
  goToShopList: function() {
    wx.navigateTo({
      url: '/pages/shopList/shopList'
    })
  },
  getIndexInfo: function() {
    let w = (moment().hour() > 7 && moment().hour() < 19) ? 'd' : 'n'
    Index.getIndexInfo()
      .then(res => {
        const showModel = (msg) =>{
          wx.showModal({
            title: '提示',
            content: res.data.data.banned_message?res.data.data.banned_message:'解除黑名单请联系平台',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                showModel(msg)
              }
            }
          })
        }

        if(res.data.data.banned===1){
          showModel(res.data.data.banned_message?res.data.data.banned_message:'解除黑名单请联系平台')
        }
        this.setData({
          imgUrls: res.data.data.banner,
          recommendLsit: res.data.data.best,
          newList: res.data.data.new,
          lovely: res.data.data.lovely,
          menus: res.data.data.menus,
          likeList: res.data.data.hot,
          benefit:res.data.data.benefit,
          hide_shop_entry: Boolean(Number(res.data.data.hide_shop_entry)),
          weather: res.data.data.weather,
          itemNew: res.data.data.config_basics.rolling_text.split('\n').map(item=>{
            return {
              info:item
            }
          }),
          w,
          text_shop:res.data.data.config_basics.text_shop,
          text_recommand:res.data.data.config_basics.text_recommand,
          text_new:res.data.data.config_basics.text_new
        })
        wx.setStorageSync('about_us', res.data.data.config_basics.about_us)
        wx.setStorageSync('min_product_paid', res.data.data.config_basics.min_product_paid)
        wx.setStorageSync('service_mobile', res.data.data.config_basics.site_phone)
        wx.setStorageSync('hide_shop_entry', Boolean(Number(res.data.data.hide_shop_entry)))
        wx.setStorageSync('ending_hour',Number(res.data.data.config_basics.ending_hour))
      })
  },
  goToSort(e) {
    let product = Number(e.currentTarget.dataset.product)
    let category = Number(e.currentTarget.dataset.category)
    let sid = Number(e.currentTarget.dataset.pid || 0)


    if (product) {
      wx.navigateTo({
        url: '../product-con/index?id=' + product,
      })
      return;
    }

    if (category) {
      app.globalData.cid = category
      app.globalData.sid = sid
      wx.switchTab({
        url: '../productSort/productSort',
      })
      return
    }

    wx.switchTab({
      url: '../productSort/productSort',
    })
  },
  onReachBottom: function(p) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var pages = getCurrentPages()    //获取加载的页面
    // var currentPage = pages[pages.length-1]    //获取当前页面的对象
    // var url = currentPage.route   
    // if(app.globalData.uid && !app.globalData.info){
    //   wx.navigateTo({
    //     url: '/pages/info/info'
    //   })
    // }
    app.infoCheckCallback = phone =>{
      if(app.globalData.uid && !phone){
        wx.navigateTo({
          url: '/pages/info/info'
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '小程序',
      path: '/pages/index/index?spid=' + app.globalData.uid,
      // imageUrl: that.data.url + that.data.product.image,
      success: function() {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})