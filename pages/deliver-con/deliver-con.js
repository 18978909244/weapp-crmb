// pages/orders-con/orders-con.js
var app = getApp();
const moment = require('../../utils/moment')
var wxh = require('../../utils/wxh.js');
const API = require('../../api/deliver-con')

var QQMapWX = require('../../qqmap-wx-jssdk.js');
var qqmapsdk;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.urlImages,
    moment,
    imgs: '',
    location: null
  },
  goToMap() {
    wx.navigateTo({
      url: `../map/map?longitude=${this.data.location.lng}&latitude=${this.data.location.lat}&rate=${this.data.address_map.similarity * 100}&address=${this.data.address_map.address_components.province}${this.data.address_map.address_components.city}${this.data.address_map.address_components.district}${this.data.address_map.title}&real_address=${this.data.ordercon.user_address}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    qqmapsdk = new QQMapWX({
      key: '2XRBZ-IOMCK-N5XJG-AVIPQ-ZBLRH-XNBKS'
    });
    app.globalData.openPages = '/pages/orders-con/orders-con?order_id=' + e.order_id;
    app.setUserInfo();
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
    var uni = e.order_id || 'wx19090313201410006';
    var that = this;
    wx.showLoading({ title: "正在加载中……" });
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_order?uid=' + app.globalData.uid,
      data: { uni: uni },
      method: 'get',
      header: header,
      success: function (res) {
        qqmapsdk.geocoder({
          address: res.data.data.user_address,
          success(res) {
            if (res.status === 0) {
              that.setData({
                location: res.result.location,
                address_map: res.result
              })
            }
          }
        })
        wx.hideLoading();
        that.setData({
          ordercon: res.data.data,
          deliver_arrive_time: moment(res.data.data.deliver_arrive_time * 1000).format('YYYY-MM-DD HH:mm'),
          deliver_expect_time: moment(res.data.data.deliver_expect_time * 1000).format('YYYY-MM-DD HH:mm'),
          imgs: JSON.parse(res.data.data.deliver_photo)
        });
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    });
  },
  preview() {
    wx.previewImage({
      current: this.data.imgs[0],
      urls: this.data.imgs
    })
  },
  getPay: function (e) {
    var that = this;
    API.getPay(e.target.dataset.id)
      .then(res => {
        console.log(res)
      })
    return;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/pay_order?uid=' + app.globalData.uid + '&uni=' + e.target.dataset.id,
      method: 'get',
      success: function (res) {
        console.log(res)
        return;
        var data = res.data.data;
        if (res.data.code == 200 && res.data.data.status == 'WECHAT_PAY') {
          var jsConfig = res.data.data.result.jsConfig;
          console.log(jsConfig);
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
                wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                  url: '/pages/orders-con/orders-con?order_id=' + data.result.order_id
                })
              }, 1200)
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'success',
                duration: 1000,
              })
              // setTimeout(function () {
              //   wx.navigateTo({
              //     url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
              //   })
              // }, 1200)
            },
            complete: function (res) {
              console.log(res);
              if (res.errMsg == 'requestPayment:cancel') {
                wx.showToast({
                  title: '取消支付',
                  icon: 'none',
                  duration: 1000,
                })
                // setTimeout(function () {
                //   wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                //     url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
                //   })
                // }, 1200)
              }
            },
          })
        } else if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
              url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
            })
          }, 1200)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
              url: '/pages/orders-con/orders-con?order_id=' + data.result.orderId
            })
          }, 1200)
        }
      },
      fail: function (res) {
        console.log('submit fail');
      }
    });
  },
  delOrder: function (e) {
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
    var uni = e.currentTarget.dataset.uni;
    var that = this;
    wx.showModal({
      title: '确认删除订单？',
      content: '订单删除后将无法查看',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/routine/auth_api/user_remove_order?uid=' + app.globalData.uid,
            data: { uni: uni },
            method: 'get',
            header: header,
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/orders-list/orders-list',
                  })
                }, 1500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              // that.setData({
              //   ordercon: that.data.ordercon
              // });
            },
            fail: function (res) {
              console.log('submit fail');
            },
            complete: function (res) {
              console.log('submit complete');
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goTel: function (e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  goJoinPink: function (e) {
    var uni = e.currentTarget.dataset.uni;
    wx.navigateTo({
      url: '/pages/join-pink/index?id=' + uni,
    })
  },
  uploadpic: function (e) {
    var that = this;
    return new Promise((resolve, reject) => {


      wx.chooseImage({
        count: 1,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          var tempFilePaths = res.tempFilePaths;
          //启动上传等待中...  
          wx.showLoading({
            title: '图片上传中',
          })
          var len = tempFilePaths.length;
          for (var i = 0; i < len; i++) {
            wx.uploadFile({
              url: app.globalData.url + '/routine/auth_api/upload?uid=' + app.globalData.uid,
              filePath: tempFilePaths[i],
              name: 'pics',
              formData: {
                'filename': 'pics'
              },
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                wx.hideLoading();
                if (res.statusCode == 403) {
                  wx.showToast({
                    title: res.data,
                    icon: 'none',
                    duration: 1500,
                  })
                } else {
                  var data = JSON.parse(res.data);
                  data.data.url = app.globalData.url + data.data.url;
                  resolve(data.data.url)
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '上传图片失败',
                  icon: 'none',
                  duration: 2000
                })
                reject()
              }
            });
          }
        }
      });
    })
  },
  confirmDeliver: function (e) {
    this.uploadpic().then(img => {
      let deliverPhoto = []
      deliverPhoto.push(img)
      let postData = {
        uni: e.currentTarget.dataset.uni,
        deliverPhoto
      }
      API.confirmDeliver(postData).then(res => {
        wx.redirectTo({
          url: '/pages/deliver-list/deliver-list'
        })
      })

    })


    return;
    API.confirmDeliver({
      deliverArriveTime: this.data.ordercon.deliver_expect_time,
      uni: e.currentTarget.dataset.uni,
      deliverPhoto: []
    })
      .then(res => {
        wx.redirectTo({
          url: '/pages/user/user'
        })
      })
    return
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
    var uni = e.currentTarget.dataset.uni;
    var that = this;
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/routine/auth_api/user_take_order?uid=' + app.globalData.uid,
            data: { uni: uni },
            method: 'get',
            header: header,
            success: function (res) {
              if (res.data.code == 200) {
                wx.navigateTo({
                  url: '/pages/orders-list/orders-list?nowstatus=4',
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              that.setData({
                ordercon: that.data.ordercon
              });
            },
            fail: function (res) {
              console.log('submit fail');
            },
            complete: function (res) {
              console.log('submit complete');
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
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