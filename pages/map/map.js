
let plugin = requirePlugin('routePlan');
let key = '2XRBZ-IOMCK-N5XJG-AVIPQ-ZBLRH-XNBKS';  //使用在腾讯位置服务申请的key
let referer = 'wxf3354325b919fd59';   //调用插件的app的名称

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    address: '',
    rate: 0,
    markers: [{
      iconPath: "../../icon/送货1.png",
      id: 0,
      latitude: null,
      longitude: null,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    real_address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { longitude, latitude, address, rate ,real_address} = options
    this.setData({
      longitude, latitude,
      address, rate,
      markers: [{
        iconPath: "../../icon/送货1.png",
        id: 0,
        longitude, latitude,
        width: 50,
        height: 50
      }],
      real_address
    })
  },
  clickRoute(){
    
    let endPoint = JSON.stringify({  //终点
      'name': this.data.address,
      'latitude': this.data.latitude,
      'longitude': this.data.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  copy(){
    wx.setClipboardData({
      data: this.data.real_address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            setTimeout(()=>{
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '复制成功，用地图APP打开',
                showCancel:false,
                confirmText:"我知道了",
                success(){
                  console.log()
                }
              })
            },200)
            
          }
        })
      }
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