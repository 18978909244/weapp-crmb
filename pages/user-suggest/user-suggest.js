// pages/comment-con/comment-con.js
var app = getApp();
const API = require('../../api/user')
const Shop = require('../../api/productShop')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    xinghidden: true,
    xinghidden2: true,
    xinghidden3: true,
    url: '',
    hidden: false,
    unique: '',
    uni: '',
    dataimg: [],
    merId: null,
    mer_name: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    app.setUserInfo();
    API.getMySuggets().then(res => {
      if (res.data.code == 200) {
        this.setData({
          messages: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  selectShop() {
    let that = this
    Shop.getShopList()
      .then(res => {
        let list = res.data.data
        wx.showActionSheet({
          itemList: ['不选', ...list.map(item => item.mer_name + '')],
          success(res) {

            if (res.tapIndex > 0) {
              that.setData({
                merId: list[res.tapIndex - 1].id,
                mer_name: list[res.tapIndex - 1].mer_name,
              })
            } else {
              that.setData({
                merId: null,
                mer_name: '',
              })
            }
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      })

  },
  tapxing: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      xinghidden: false,
      xing: index
    })
  },
  tapxing2: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      xinghidden2: false,
      xing2: index
    })
  },
  tapxing3: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      xinghidden3: false,
      xing3: index
    })
  },
  delImages: function (e) {
    var that = this;
    var dataimg = that.data.dataimg;
    var index = e.currentTarget.dataset.id;
    dataimg.splice(index, 1);
    that.setData({
      dataimg: dataimg
    })

  },
  uploadpic: function (e) {
    var that = this;
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
                that.data.dataimg.push(data);
                that.setData({
                  dataimg: that.data.dataimg
                });
                var len2 = that.data.dataimg.length;
                if (len2 >= 8) {
                  that.setData({
                    hidden: true
                  });
                }
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '上传图片失败',
                icon: 'none',
                duration: 2000
              })
            }
          });
        }
      }
    });
  },
  formSubmit: function (e) {
    var that = this;
    var comment = e.detail.value.comment;
    if (comment == "") {
      wx.showToast({
        title: '请填写你的留言、投诉及建议',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({ title: "正在发布评论……" });
    let merId = this.data.merId
    let postData = merId?{
      content: comment,
      merId
    }:{
      content: comment,
    }
    API.postMySuggest(postData).then(res => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.showToast({
          title: '留言成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
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