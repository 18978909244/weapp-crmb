var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    real_name:'',
    shop_name:'',
    shop_address:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  input(e){
    const type = e.currentTarget.dataset.type
    this.setData({
      [type]:e.detail.value
    })
  },
  submit(){
    let that = this
    wx.request({
      url: app.globalData.url + '/routine/auth_api/edit_user_data?uid=' + app.globalData.uid,
      method: 'POST',
      data: {
        phone: this.data.phone,
        real_name: this.data.real_name,
        shop_name: this.data.shop_name,
        shop_address: this.data.shop_address
      },
      success: function (res) {
        if (res.data.code == 200) {
          app.globalData.info = that.data.phone
          wx.navigateBack()
        }
      }
    });

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