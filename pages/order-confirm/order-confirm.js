// pages/order-confirm/order-confirm.js
const moment = require('../../utils/moment')
var app = getApp();
const API = require('../../api/order-confirm')
const Address = require('../../api/address')

let hour = moment().hour()
let min = moment().minutes()
let firstColumn = ['明天', '后天'];
let _second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
let thirdColumn = [0, 15, 30, 45]



let data = {
  '0': [['今天','明天'], _second.filter(i => {
    if (min > 45) {
      return i > hour + 1
    }
    return i > hour
  }).map(item => item + '时'),
  min < 45 ? thirdColumn.filter(i => {
    return i > min
  }).map(item => item + '分') : thirdColumn.map(item => item + '分')],
  '1': [['明天', '后天'], _second.map(item => item + '时'), thirdColumn.map(item => item + '分')]
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressEmpty: false,
    cartArr: [
      { "name": "微信", "icon": "icon-weixinzhifu", value: 'weixin' },
      { "name": "余额支付", "icon": "icon-yuezhifu", value: 'yue' },
      // { "name": "线下付款", "icon": "icon-wallet", value: 'offline' },
      // { "name": "到店自提", "icon": "icon-dianpu", value: 'ziti'  },
    ],
    cartInfo: [],
    cartId: '',
    priceGroup: [],
    orderKey: '',
    seckillId: 0,
    BargainId: 0,
    combinationId: 0,
    pinkId: 0,
    offlinePostage: 0,
    integralRatio: 1,
    usableCoupon: [],
    userInfo: [],
    url: app.globalData.urlImages,
    addressId: 0,
    couponId: 0,
    couponPrice: '',
    couponInfo: [],
    addressInfo: [],
    mark: '',
    payType: 'weixin',
    useIntegral: '',
    shipType: 1,
    userExpectTime: 0,
    multiIndex: [0, 0, 0],
    multiArray: [],
    onlyDateShip: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUserInfo();
    var that = this;
    if (options.pinkId) {
      that.setData({
        pinkId: options.pinkId || '277,278'
      })
    }
    if (options.addressId) {
      that.setData({
        addressId: options.addressId
      });
    }
    if (options.couponId) {
      that.setData({
        couponId: options.couponId
      });
    }
    if (options.id == '') {
      wx.showToast({
        title: '请选择要购买的商品',
        icon: 'none',
        duration: 1000,
      })
      setTimeout(function () {
        that.toBuy();
      }, 1100)
    } else {
      this.getConfirm(options.id);
    }
    // that.getaddressInfo();
    // that.getCouponRope();
    // that.initAddress()
  },
  initAddress() {
    let that = this
    Address.getAddressList()
      .then(res => {

        if (res.data.data.length === 0) {
          that.setData({
            addressEmpty: true
          })
        } else {
          let defaultAddress = res.data.data.find(i => i.is_default === 1)
          console.log(defaultAddress)
          if (defaultAddress) {
            that.setData({
              addressId: defaultAddress.id,
              addressInfo: defaultAddress
            })
            that.getaddressInfo();
          }
        }
      })
  },
  bindHideKeyboard: function (e) {
    this.setData({
      mark: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      payType: e.detail.value
    })
  },
  radioChangeShip(e) {
    console.log('点击了')
    // console.log(e.detail.value)
    // let multiArray = this.data.multiArray

    // if(e.detail.value===0){
    //   multiArray[0]  = ['今天']
    // }else{
    //   multiArray[0]  = ['今天','明天']
    // }
    // console.log(multiArray)
    this.setData({
      shipType: e.detail.value,
      userExpectTime: e.detail.value === 0 ? 0 : this.data.userExpectTime,
      multiArray: data[e.detail.value],
      multiIndex: [0, 0, 0]
    })
  },
  subOrder: function (e) {
    var that = this;
    // var header = {
    //   'content-type': 'application/x-www-form-urlencoded'
    // };
    // if (that.data.payType == 'weixin') {
    //   wx.showToast({
    //     title: '微信支付还未申请成功，暂不支持',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    //   return;
    // }
    if (that.data.payType == '') {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none',
        duration: 1000,
      })
      return;
    }

    if (!that.data.addressId) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    if (that.data.userExpectTime == 0) {
      wx.showToast({
        title: '请选择配送时间',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    let formData = {
      addressId: that.data.addressId,
      formId: e.detail.formId,
      couponId: that.data.couponId,
      payType: that.data.payType,
      useIntegral: that.data.useIntegral,
      bargainId: that.data.BargainId,
      combinationId: that.data.combinationId,
      pinkId: that.data.pinkId,
      seckill_id: that.data.seckillId,
      mark: that.data.mark,
      userExpectTime: that.data.userExpectTime > 0 ? that.data.userExpectTime : 0
    }

    console.log(formData)
    return;
    API.createOrder(that.data.orderKey)(formData)
      .then(res => {
        console.log('res', res)
        var data = res.data.data;
        if (res.data.code == 200 && res.data.data.status == 'SUCCESS') {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
            })
          }, 1200)
        } else if (res.data.code == 200 && res.data.data.status == 'ORDER_EXIST') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
            })
          }, 1200)
        } else if (res.data.code == 200 && res.data.data.status == 'EXTEND_ORDER') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
            })
          }, 1200)
        } else if (res.data.code == 200 && res.data.data.status == 'WECHAT_PAY') {
          var jsConfig = res.data.data.result.jsConfig;
          wx.requestPayment({
            timeStamp: jsConfig.timeStamp,
            nonceStr: jsConfig.nonceStr,
            package: jsConfig.package,
            signType: jsConfig.signType,
            paySign: jsConfig.paySign,
            success: function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
                })
              }, 1200)
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1000,
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
                })
              }, 1200)
            },
            complete: function (res) {
              if (res.errMsg == 'requestPayment:cancel') {
                wx.showToast({
                  title: '取消支付',
                  icon: 'none',
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                    url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
                  })
                }, 1200)
              }
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
  getCouponRope: function () {
    var that = this;
    if (that.data.couponId) {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_coupon_rope?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          couponId: that.data.couponId
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              couponInfo: res.data.data,
              couponPrice: '-' + res.data.data.coupon_price
            })
          } else {
            that.setData({
              couponInfo: [],
              couponPrice: ''
            })
          }
        }
      })
    }
  },
  getaddressInfo: function () {

    var that = this;
    if (that.data.addressId) {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_user_address?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          addressId: that.data.addressId
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              addressInfo: res.data.data
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/user_default_address?uid=' + app.globalData.uid,
        method: 'GET',
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              addressInfo: res.data.data,
              addressId: res.data.data.id
            })
          }
        }
      })
    }
  },
  getAddress: function () {
    var that = this;
    if (this.data.addressEmpty) {
      wx.navigateTo({
        url: '/pages/addaddress/addaddress?cartId=' + that.data.cartId + '&pinkId=' + that.data.pinkId + '&couponId=' + that.data.couponId
      })
      return;
    }
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/user_address_list?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
            url: '/pages/address/address?cartId=' + that.data.cartId + '&pinkId=' + that.data.pinkId + '&couponId=' + that.data.couponId
          })
        }
      }
    })
  },
  getCoupon: function () {
    var that = this;
    wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '/pages/coupon-status/coupon-status?cartId=' + that.data.cartId + '&totalPrice=' + that.data.priceGroup.totalPrice + '&pinkId=' + that.data.pinkId + '&addressId=' + that.data.addressId
    })
  },
  toBuy: function () {
    wx.switchTab({
      url: '/pages/buycar/buycar'
    });
  },
  toAddress: function () {
    var that = this;
    wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '/pages/addaddress/addaddress?cartId=' + that.data.cartId + '&pinkId=' + that.data.pinkId + '&couponId=' + that.data.couponId
    })
  },
  getConfirm: function (cartIdsStr) {
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/confirm_order?uid=' + app.globalData.uid,
      method: 'POST',
      data: {
        cartId: cartIdsStr
      },
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            userInfo: res.data.data.userInfo,
            cartInfo: res.data.data.cartInfo,
            integralRatio: res.data.data.integralRatio,
            offlinePostage: res.data.data.offlinePostage,
            orderKey: res.data.data.orderKey,
            priceGroup: res.data.data.priceGroup,
            cartId: res.data.data.cartId,
            seckillId: res.data.data.seckill_id,
            usableCoupon: res.data.data.usableCoupon
          })
          that.getBargainId();
        }
      }
    })
  },
  getBargainId: function () {
    var that = this;
    var cartINfo = that.data.cartInfo;
    var BargainId = 0;
    var combinationId = 0;
    cartINfo.forEach(function (value, index, cartINfo) {
      BargainId = cartINfo[index].bargain_id,
        combinationId = cartINfo[index].combination_id
    })
    that.setData({
      BargainId: BargainId,
      combinationId: combinationId
    })
    console.log(that.data.BargainId);
    console.log(that.data.seckillId);
    console.log(that.data.combinationId);
  },
  createMulti() {
    // secondColumn = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => item + '时')
    // // if(firstColumn[this.data.multiIndex[0]]!=='今天'){
    // //   console.log('不是今天')
    // //   secondColumn = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => item + '时')
    // // }else{
    // //   console.log('是今天')
    // //   secondColumn = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].filter(item => item > hour + 1).map(item => item + '时')
    // // }
    // this.setData({
    //   multiArray: [firstColumn, secondColumn,thirdColumn],
    // })
  },
  bindMultiPickerColumnChange(e) {
    console.log(e)
    let multiArray = this.data.multiArray
    if (e.detail.column === 1 && e.detail.value > 0) {
      multiArray[2] = thirdColumn.map(i => i + '分')
      this.setData({
        multiArray
      })
    } else if (e.detail.column === 1 && e.detail.value === 0) {
      multiArray[2] = min < 45 ? thirdColumn.filter(i => {
        // if (min > 45) {
        //   return i
        // }
        return i > min
        // return i>min
      }).map(i => i + '分') : thirdColumn.map(i => i + '分')
      this.setData({
        multiArray
      })
    }else if(e.detail.column===0 && e.detail.value===1){
      multiArray[1] = [0,1,2].map(item=>item+'时')
      this.setData({
        multiArray
      })
    }else if(e.detail.column===0 && e.detail.value===0){
      multiArray[1] = _second.filter(i => {
        if (min > 45) {
          return i > hour + 1
        }
        return i > hour
      }).map(item => item + '时')
      this.setData({
        multiArray
      })
    }

    // let column = e.detail.column
    // let value = e.detail.value
    // // console.log('改变列')
    // console.log(multiArray)
    // console.log(column, value)
    // console.log(firstColumn)
    // // if(column===0 && firstColumn[value])
    // if (column === 0) {
    //   if (firstColumn[value] !== '今天') {
    //     multiArray[1] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => item + '时')
    //   } else {
    //     multiArray[1] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].filter(item => item > hour + 1).map(item => item + '时')
    //   }
    //   this.setData({
    //     multiArray
    //   })
    // }
  },
  bindMultiPickerChange(e) {
    console.log('改变了')
    console.log(e.detail.value)

    let day = this.data.multiArray[0][e.detail.value[0]]
    let time = this.data.multiArray[1][e.detail.value[1]]
    let mins = this.data.multiArray[2][e.detail.value[2]]
    console.log(day, time, mins)
    let _day
    let _time
    switch (day) {
      case '今天':
        _day = moment(moment(new Date()).add(0, 'days')._d).format('YYYY-MM-DD');
        console.log(_day)
        _time = moment(`${_day} ${Number(time.split('时')[0]) < 10 ? '0' + Number(time.split('时')[0]) : Number(time.split('时')[0])}:${mins.split('分')[0]}:00`).valueOf();
        console.log(_time)
        break;
      case '明天':
        _day = moment(moment(new Date()).add(1, 'days')._d).format('YYYY-MM-DD');
        console.log('明天', _day, `${_day} ${Number(time.split('时')[0]) < 10 ? '0' + Number(time.split('时')[0]) : Number(time.split('时')[0])}:${mins.split('分')[0]}:00`)
        _time = moment(`${_day} ${Number(time.split('时')[0]) < 10 ? '0' + Number(time.split('时')[0]) : Number(time.split('时')[0])}:${mins.split('分')[0] < 10 ? '0' + mins.split('分')[0] : mins.split('分')[0]}:00`).valueOf();
        console.log('明天', _time)
        break;
      case '后天':
        _day = moment(moment(new Date()).add(2, 'days')._d).format('YYYY-MM-DD');
        _time = moment(`${_day} ${Number(time.split('时')[0]) < 10 ? '0' + Number(time.split('时')[0]) : Number(time.split('时')[0])}:${mins.split('分')[0] < 10 ? '0' + mins.split('分')[0] : mins.split('分')[0]}:00`).valueOf();
        break;
    }
    let userExpectTime = _time / 1000
    console.log('userExpectTime', userExpectTime)
    this.setData({
      multiIndex: e.detail.value,
      userExpectTime
    })
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
    this.getaddressInfo();
    this.getCouponRope();
    this.initAddress()
    let shipType = wx.getStorageSync('shipType') ? Number(wx.getStorageSync('shipType')) :1
    console.log('hour',hour)
    if (hour >= 23 || hour>22 && min>=45) {
      wx.showModal({
        title: '提示',
        content: '当前时间过晚，只能预约配送'
      })
      shipType = 1
      this.setData({
        onlyDateShip: true
      })
    }
    this.setData({
      multiArray: data[shipType],
      shipType
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})