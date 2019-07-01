// import bm from '../../utils/baseMath.js'
// // pages/buycar/buycar.js
var app = getApp();
const Buycar = require('../../api/buycar')
// // var wx = require('../../utils/wx.js');

Page({
  data: {
    isAttrInfo: 'attrInfo',
    itemAttrInfo: '',
    foothidden: false,
    url: app.globalData.urlImages,
    countmoney: "",
    cartNum: "",
    isAllSelect: false,
    cartList: [],
    cartInvalid: [],
    cartIdsStr: '',
    chooseShopId: -1,
    deliver_fee: 0,
    shopList: []
  },

  setNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    let max = Number(e.currentTarget.dataset.max)
    this.data.cartList[index].cart_num = Number(e.detail.value) > max ? max : Number(e.detail.value)
    // console.log(this.data.cartList[index].cart_num)
    this.setData({ cartList: this.data.cartList });
    this.carnum();
    this.countmoney();
    this.addCartNum(this.data.cartList[index].cart_num, this.data.cartList[index].id);


    return;
    console.log('setNumber')
    var that = this;
    var index = e.currentTarget.dataset.item;
    var cartList = that.data.cartList;
    var num = parseInt(e.detail.value);
    var cart_num = num ? num : 1;
    if (cartList[index].productInfo.attrInfo.stock) {
      if (cart_num > cartList[index].productInfo.stock) cart_num = cartList[index].productInfo.attrInfo.stock
    } else {
      if (cart_num > cartList[index].productInfo.attrInfo.stock) cart_num = cartList[index].productInfo.stock
    }
    cartList[index].cart_num = cart_num;
    that.setData({
      cartList: cartList
    })
    wx.request({
      url: app.globalData.url + '/routine/auth_api/set_buy_cart_num?uid=' + app.globalData.uid,
      method: 'GET',
      data: {
        cartId: cartList[index].id,
        cartNum: cart_num
      },
      success: function (res) {
        if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  },
  onLoad: function (options) {
    app.setUserInfo();
    // this.carnum();
    // this.countmoney();
    // this.getList();
  },
  btntap: function (e) {
    this.setData({
      foothidden: !this.data.foothidden
    })
  },
  initShopList() {
    let valid = this.data.cartList
    let carListObj = {}
    for (let i = 0; i < valid.length; i++) {
      let shopId = valid[i].shopInfo.id
      if (carListObj[shopId]) {
        carListObj[shopId] = [...carListObj[shopId], valid[i]]
      } else {
        carListObj[shopId] = [valid[i]]
      }
    }
    let shopList = Object.keys(carListObj).map(item => {
      return carListObj[item][0].shopInfo
    })
    this.setData({
      shopList
    })
  },
  getList: function () {
    Buycar.getCartList()
      .then(res => {
        this.setData({
          cartList: res.data.data.valid,
          cartInvalid: res.data.data.invalid
        })
        this.initShopList()
      })
  },
  //加
  numAddClick: function (event) {
    var index = event.currentTarget.dataset.index;
    let max = event.currentTarget.dataset.max;
    if (this.data.cartList[index].cart_num >= max) {
      wx.showToast({
        title: '已达库存上限',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.data.cartList[index].cart_num = + this.data.cartList[index].cart_num + 1;

    // var minusStatus = this.data.cartList[index].cart_num <= 1 ? 'disabled' : 'normal';
    this.setData({ cartList: this.data.cartList });
    this.carnum();
    this.countmoney();
    this.addCartNum(this.data.cartList[index].cart_num, this.data.cartList[index].id);
  },
  //减
  numDescClick: function (event) {
    var index = event.currentTarget.dataset.index;
    this.data.cartList[index].cart_num = this.data.cartList[index].cart_num <= 1 ? 1 : +this.data.cartList[index].cart_num - 1;
    // var minusStatus = this.data.cartList[index].cart_num <= 1 ? 'disabled' : 'normal';
    this.setData({ cartList: this.data.cartList });
    this.carnum();
    this.countmoney();
    this.addCartNum(this.data.cartList[index].cart_num, this.data.cartList[index].id);
  },
  //单选；
  switchSelect: function (e) {
    // return;
    var index = e.currentTarget.dataset.index;

    // let id;
    // let _list = this.data.cartList.filter(item=>item.checked===true)
    // console.log('谁选中了',_list)
    // if(_list.length>0){
    //   id = _list[0].shopInfo.id
    //   console.log(`id是${id},要选的${this.data.cartList[index].shopInfo.id}`)
    // }
    // if(id && this.data.cartList[index].shopInfo.id !==id){
    //   console.log('不可以选')
    //   return;
    // }

    this.data.cartList[index].checked = !this.data.cartList[index].checked;

    var len = this.data.cartList.length;
    var selectnum = [];
    for (var i = 0; i < len; i++) {
      if (this.data.cartList[i].checked == true) {
        selectnum.push(true);
      }
    }
    if (selectnum.length == len) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }



    this.setData({
      cartList: this.data.cartList,
      isAllSelect: this.data.isAllSelect,
    }, () => {
      let _list = this.data.cartList.filter(item => item.checked === true)
      console.log(_list)
      let chooseShopId = -1
      if (_list.length > 0) {
        chooseShopId = _list[0].shopInfo.id
      }
      this.setData({
        chooseShopId
      })
    });
    this.carnum();
    this.countmoney();
    this.confirmOrder();
  },
  //全选
  allChecked: function (e) {
    console.log(e.currentTarget.dataset.shop)
    console.log(this.data.shopList)
    let that = this
    for (let i = 0; i < this.data.shopList.length; i++) {
      if (this.data.shopList[i].id == e.currentTarget.dataset.shop) {
        this.data.shopList[i].isAllSelect = !this.data.shopList[i].isAllSelect
        for (let j = 0; j < that.data.cartList.length; j++) {
          if (that.data.cartList[j].shopInfo.id == this.data.shopList[i].id) {
            that.data.cartList[j].checked = this.data.shopList[i].isAllSelect
          }
        }
      }
    }
    // let target = this.data.shopList.find(item=>item.id===e.currentTarget.dataset.shop)
    // if(target.isAllSelect){

    // }
    // var selectAllStatus = this.data.isAllSelect;
    // selectAllStatus = !selectAllStatus;
    // var array = this.data.cartList;
    // for (var i = 0; i < array.length; i++) {
    //   array[i].checked = selectAllStatus;
    // };
    this.setData({
      cartList: this.data.cartList,
      shopList: this.data.shopList
    }, () => {
      let _list = this.data.cartList.filter(item => item.checked === true)
      console.log(_list)
      let chooseShopId = -1
      if (_list.length > 0) {
        chooseShopId = _list[0].shopInfo.id
      }
      this.setData({
        chooseShopId
      })
    })
    this.carnum();
    this.countmoney();
    this.confirmOrder();
  },
  //数量
  carnum() {
    var carnum = 0;
    var array = this.data.cartList;
    for (var i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        carnum += parseInt(array[i].cart_num);
      }
    }
    this.setData({
      cartNum: carnum
    })
  },
  //总共价钱；
  countmoney() {
    var carmoney = 0;
    var array = this.data.cartList;
    for (var i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        if (array[i].productInfo.attrInfo) {
          carmoney += parseFloat(array[i].cart_num * array[i].productInfo.attrInfo.price);
        } else {
          carmoney += parseFloat(array[i].cart_num * array[i].productInfo.price);
        }
      }
    }
    let _list = this.data.cartList.filter(item => item.checked === true)
    let deliver_fee = _list.length > 0 ? _list[0].shopInfo.deliver_fee : 0

    this.setData({
      countmoney: carmoney.toFixed(2),
      deliver_fee
    })
  },
  confirmOrder: function () {
    var array = this.data.cartList;
    var cartIds = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        cartIds.push(array[i].id);
      }
    }
    if (cartIds.length > 0) {
      this.goConfirm(cartIds);
    } else {
      this.setData({
        cartIdsStr: ''
      })
    }
  },
  goConfirm: function (cartIds) {
    if (cartIds.length > 0) {
      this.setData({
        cartIdsStr: cartIds.join(',')
      })
    }
    // console.log(this);
  },
  addCartNum: function (cartNum, cartId) {
    Buycar.changeCartNum({
      cartNum: cartNum,
      cartId: cartId
    }).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 200
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    // return;
    // var header = {
    //   'content-type': 'application/x-www-form-urlencoded',
    // };
    // wx.request({
    //   url: app.globalData.url + '/routine/auth_api/change_cart_num?uid=' + app.globalData.uid,
    //   method: 'GET',
    //   data: {
    //     cartNum: cartNum,
    //     cartId: cartId
    //   },
    //   header: header,
    //   success: function (res) {
    //     if (res.data.code == 200) {
    //       wx.showToast({
    //         title: '成功',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },
  collectAll: function () {
    var array = this.data.cartList;
    var productIds = [];
    var that = this;
    for (var i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        productIds.push(array[i].product_id);
      }
    }
    if (productIds.length > 0) {
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/collect_product_all?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          productId: productIds.join(',')
        },
        header: header,
        success: function (res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    console.log(productIds);
  },
  cartDelAll: function () {
    var array = this.data.cartList;
    var ids = [];
    var that = this;
    for (var i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        ids.push(array[i].id);
      }
    }
    if (ids.length > 0) {
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/remove_cart?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          ids: ids.join(',')
        },
        header: header,
        success: function (res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            for (var i = 0; i < ids.length; i++) {
              for (var j = 0; j < array.length; j++) {
                if (ids[i] == array[j].id) {
                  array.splice(j, 1);
                }
              }
            }
            that.setData({
              cartList: array
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  deleteItem(e) {
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    cartList.splice(index, 1)
    this.setData({
      cartList
    })
    this.initShopList()
  },
  cartDel: function (e) {
    var that = this;
    if (e.currentTarget.dataset.id) {
      console.log(e.currentTarget.dataset.id)
      Buycar.deleteItem({
        ids: e.currentTarget.dataset.id
      }).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          var cartList = that.data.cartList;
          for (var i = 0; i < cartList.length; i++) {
            if (e.currentTarget.dataset.id == cartList[i].id) {
              cartList.splice(i, 1);
              that.setData({
                cartList
              })
            }
          }
          this.initShopList()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      return;
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/remove_cart?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          ids: e.currentTarget.dataset.id
        },
        header: header,
        success: function (res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            var cartInvalid = that.data.cartInvalid;
            for (var i = 0; i < cartInvalid.length; i++) {
              if (e.currentTarget.dataset.id == cartInvalid[i].id) {
                cartInvalid.splice(i, 1);
                that.setData({
                  cartInvalid: cartInvalid
                })
              }
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  goToOrder() {
    // console.log('cartIdsStr')
    if (this.data.cartIdsStr === '') {
      wx.showToast({
        title: '未选择商品',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let total = Number(this.data.countmoney) + Number(this.data.deliver_fee)
    let min_product_paid = Number(wx.getStorageSync('min_product_paid'))||10
    if (total < min_product_paid) {
      wx.showToast({
        title: '下单金额' + min_product_paid + '元起送',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // if()
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm?id=' + this.data.cartIdsStr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.carnum();
    this.countmoney();
    this.getList();
    this.setData({
      chooseShopId: -1,
      cartIdsStr: ''
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