// pages/unshop/unshop.js
var app = getApp();
var wxh = require('../../utils/wxh.js');
const API = require('../../api/productSort')

const {
  needLogin
} = require('../../utils/util')

Page({
  data: {
    attrName: '',
    num: 1,
    url: app.globalData.urlImages,
    hiddendown: true,
    currentTab: "-1",
    taber: "-1",
    active: 0,
    Arraylike: [],
    productAttr: [],
    productSelect: [{
        image: ""
      },
      {
        store_name: ""
      },
      {
        price: 0
      },
      {
        unique: ""
      },
      {
        stock: 0
      },
    ],
    productValue: [],
    total: '全部',
    animationData: {},
    cid: '',
    sid: '',
    price: '',
    sales: '',
    ficti: '',
    t: 1,
    sortyi: [],
    offset: 0,
    title: "玩命加载中...",
    hidden: false,
    show: false,
    prostatus: false,
    sorter: [],
    productid: '',
    CartCount: '',
    _num: 1
  },
  setNumber: function (e) {
    var that = this;
    var num = parseInt(e.detail.value);
    that.setData({
      num: num ? num : 1
    })
  },

  handleUnitName(name) {
    return name
    // if (name.includes('('))
    //     return name.split('(')[0]
    // if (name.includes('（'))
    //     return name.split('（')[0]
    // return name
  },
  onLoad: function (e) {
    console.log(app.globalData)
    app.setUserInfo();
    // this.setData({
    //     cid: app.globalData.cid,
    //     sid: app.globalData.sid
    // })
    // this.getCartCount();
    // this.getProductList();
  },
  onShow() {
    if (app.globalData.uid) {
      const phone = wx.getStorageSync('mobileInfo')
      if (!phone) {
        wx.navigateTo({
          url: '/pages/info/info'
        })
      }
    }
    this.setData({
      cid: app.globalData.cid,
      sid: app.globalData.sid
    })
    this.initCategory(app.globalData.cid, app.globalData.sid)
    this.getCartCount();
    this.getProductList();
  },
  initCategory(cid, sid) {
    let that = this
    console.log('cid', cid, sid)
    if (!cid) return
    API.getAllCat().then(res => {

      let all = res.data.data
      for (let i = 0; i < all.length; i++) {
        for (let j = 0; j < all[i].children.length; j++) {
          console.log('all[i].children', all[i].children)
          if (all[i].children[j].pid === cid && all[i].children[j].id === sid) {
            that.setData({
              total: all[i].children[j].cate_name
            })
          }
        }
      }
      // let list = res.data.data
      // for (let i = 0; i < list.length; i++) {
      //     API.getChildCat(list[i].id).then(res => {
      //         let _list = res.data.data
      //         console.log('_list', _list)
      //         for (let j = 0; j < _list.length; j++) {
      //             API.getChildCat(_list[j].id).then(res => {
      //                 let __list = res.data.data
      //                 for (let z = 0; z < __list.length; z++) {
      //                     console.log(__list[z].id)
      //                     if (Number(__list[z].id) == cid) {
      //                         that.setData({
      //                             total: res.data.name
      //                         })
      //                     }
      //                 }

      //             })

      //         }

      //         // if(res.data)
      //     })
      // }
    })
  },
  onHide() {
    this.setData({
      total: '全部',
      taber: "-1"
    })
    app.globalData.cid = this.data.cid
    app.globalData.sid = this.data.sid
  },
  goCart: function () {
    wx.switchTab({
      url: '/pages/buycar/buycar'
    });
  },
  product: function (e) {
    var index = e.target.dataset.num;
    console.log('tap', index)

    if (index == 1) {
      this.setData({
        _num: 2,
        num: 2
      })
    } else {
      this.setData({
        _num: 1,
        num: 1
      })
    }
  },
  sort: function (e) {
    var that = this;
    var all = this.data.hiddendown;
    this.setData({
      active: 0,
      news: ''
    });
    if (all) {
      this.setData({
        hiddendown: false
      })
    } else {
      this.setData({
        hiddendown: true
      })
    }
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_pid_cate?uid=' + app.globalData.uid,
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            sortyi: res.data.data,
          })
        } else {
          that.setData({
            sortyi: []
          })
        }
      }

    })
  },
  itemdown: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    this.animation = animation;
    var width = 50 + '%';
    animation.width(width).step();
    var id = e.target.dataset.idx;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_id_cate?uid=' + app.globalData.uid,
      data: {
        id: e.target.dataset.idx
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            currentTab: e.target.dataset.idx,
            animationData: animation.export()
          });
          that.setData({
            cid: e.target.dataset.idx,
            sorter: res.data.data,
          })
        } else {
          that.setData({
            currentTab: 0,
            animationData: {}
          });

          that.setData({
            cid: 0,
            sorter: []
          })
        }
      },

    })
  },
  itemdowner: function (e) {

    var that = this;
    var $taber = e.target.dataset.ider;
    if ($taber >= 0) {
      that.setData({
        taber: e.target.dataset.ider,
        hiddendown: true
      })
    } else {
      that.setData({
        taber: -1,
        hiddendown: true
      })
    }
    var SoerErId = 0;
    if ($taber >= 0) {
      for (var indexSoerEr in that.data.sorter) {
        if (that.data.sorter[indexSoerEr].id == $taber) {
          that.setData({
            total: that.data.sorter[indexSoerEr].cate_name
          })
          SoerErId = that.data.sorter[indexSoerEr].id;
        }
        //console.log(that.data.sorter[indexSoerEr].id);
      }
    } else that.setData({
      total: '全部'
    })
    that.setData({
      sid: SoerErId
    })
    that.getProductList();
  },
  wholeproduct: function (e) {
    var that = this;
    var $taber = e.target.dataset.ider;
    if (that.data.cid != '') {
      var cid = that.data.cid;
    } else {
      var cid = '';
    }
    var arr = that.data.sortyi;
    var len = that.data.sortyi.length;
    for (var i = 0; i < len; i++) {
      if (arr[i].id == that.data.cid) {
        that.setData({
          total: arr[i].cate_name + '/全部',
          taber: $taber
        })
      }
    }
    that.setData({
      hiddendown: true,
      news: '',
      active: 0,
      sid: 0
    })
    that.getProductList();
  },
  getCartCount: function () {
    API.getCartCount().then(res => {
      this.setData({
        CartCount: res.data.data
      })
    })
  },
  allproduct: function () {
    var that = this;
    that.setData({
      cid: '',
      sid: '',
      hiddendown: true,
      total: '全部商品',
      taber: '-1',
      news: '',
      active: 0
    })
    that.getProductList();
  },
  maskhide: function (e) {
    this.setData({
      hiddendown: true
    })
  },
  navactive: function (e) {
    var that = this;
    that.setData({
      active: e.target.dataset.act,
      hiddendown: true
    })
    var act = e.target.dataset.act;
    var priceOrder = '';
    var t = that.data.t;
    var n = t + 1;
    if (n % 2 > 0) priceOrder = 'asc';
    else priceOrder = 'desc';
    var sid = that.data.sid;
    that.setData({
      ficti: ''
    })
    that.setData({
      price: priceOrder,
      t: n,
    })
    that.getProductList();
  },
  navactive1: function (e) {
    var that = this;
    that.setData({
      active: e.target.dataset.act,
      hiddendown: true
    })
    var act = e.target.dataset.act;
    var salesOrder = '';
    var t = that.data.t;
    var n = t + 1;
    if (n % 2 > 0) salesOrder = 'asc';
    else salesOrder = 'desc';
    that.setData({
      price: ''
    })
    that.setData({
      ficti: salesOrder,
      t: n,
    })
    that.getProductList();
  },
  navactive2: function (e) {
    var that = this;
    that.setData({
      active: e.target.dataset.act,
      hiddendown: true
    })
    var act = e.target.dataset.act;
    var news = '';
    if (act == 3) news = 1;
    else news = '';
    if (that.data.news) news = '';
    that.setData({
      price: ''
    })
    that.setData({
      ficti: ''
    })
    that.setData({
      news: news
    })
    that.getProductList();
  },
  searchSubmit: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_form_id?uid=1',
      method: 'GET',
      data: {
        formId: e.detail.formId
      },
      success: function (res) {}
    })
    var $search = e.detail.value;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/store?uid=1',
      data: {
        value: $search
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            Arraylike: res.data.data
          })
        } else {
          that.setData({
            Arraylike: []
          })
        }
      }

    })
  },
  cart: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    console.log(id);
    wx.request({
      url: app.globalData.url + '/routine/auth_api/details?uid=' + app.globalData.uid,
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {
        var image = "productSelect.image";
        var store_name = "productSelect.store_name";
        var price = "productSelect.price";
        var unique = "productSelect.unique";
        var stock = "productSelect.stock";
        console.log(res.data.data);
        if (res.data.code == 200) {
          that.setData({
            productAttr: res.data.data.productAttr,
            productValue: res.data.data.productValue,
            productSelect: res.data.data.storeInfo,
            [image]: res.data.data.storeInfo.image,
            [stock]: res.data.data.storeInfo.stock,
            [store_name]: res.data.data.storeInfo.store_name,
            [price]: res.data.data.storeInfo.price,
            [unique]: '',
            productid: id,
            attrStock:null
          })
          that.detail();
        } else {
          that.setData({
            productid: ''
          })
          // that.prompts();
        }
      }

    })
  },
  detail: function () {
    var that = this;
    that.setData({
      show: true,
      prostatus: true,
    })
  },
  modelbg: function (e) {
    this.setData({
      show: false,
      prostatus: false
    })
  },
  bindMinus: function () {
    var that = this;
    wxh.carmin(that)
  },
  bindPlus: function () {
    var that = this;
    wxh.carjia(that);
  },
  tapsize: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.key;
    var attrValues = [];
    var attrName = that.data.attrName;
    var attrNameArr = attrName.split(",");
    var array = that.data.productAttr;
    for (var i in that.data.productAttr) {
      for (var j in that.data.productAttr[i]['attr_values']) {
        if (that.data.productAttr[i]['attr_values'][j] == key) {
          attrValues = that.data.productAttr[i]['attr_values'];
        }
      }
    }
    for (var ii in attrNameArr) {
      if (that.in_array(attrNameArr[ii], attrValues)) {
        attrNameArr.splice(ii, 1);
      }
    }
    attrName = attrNameArr.join(',');
    that.setData({
      attrName: e.currentTarget.dataset.key + ',' + attrName
    })
    attrNameArr = that.data.attrName.split(",");
    var attrNameArrSort = '';
    for (var jj in that.data.productAttr) {
      for (var jjj in that.data.productAttr[jj]['attr_values']) {
        if (that.in_array(that.data.productAttr[jj]['attr_values'][jjj], attrNameArr)) {
          attrNameArrSort += that.data.productAttr[jj]['attr_values'][jjj] + ',';
        }
      }
    }
    console.log(array, attrNameArr)
    for (var jj in array) {
      for (var jjj in array[jj]['attr_values']) {
        if (that.in_array(array[jj]['attr_values'][jjj], attrNameArr)) {
          array[jj]['attr_value'][jjj].check = true;
        } else {
          array[jj]['attr_value'][jjj].check = false;
        }
      }
    }
    // that.setData({
    //     productAttr: array
    // })
    console.log(that.data.productAttr)
    var attrNameArrSortArr = attrNameArrSort.split(",");
    attrNameArrSortArr.pop();
    that.setData({
      attrName: attrNameArrSortArr.join(',')
    })
    var arrAttrName = that.data.attrName.split(",");
    for (var index in that.data.productValue) {
      var strValue = that.data.productValue[index]['suk'];
      if (strValue === key) {
        console.log(`that.data.productValue[index]['unique']`, that.data.productValue[index])
        let productAttr = that.data.productAttr
        let _index = productAttr.findIndex(item => item.attr_values.includes(key))
        let _idx = productAttr[_index].attr_value.findIndex(item => item.attr === key)
        productAttr[_index].attr_value.forEach(item => item.check = false)
        productAttr[_index].attr_value[_idx].check = true
        that.setData({
          productSelect: {
            ...that.data.productSelect,
            // unique:that.data.productValue[index]['unique'],
            ...that.data.productValue[index]
          },
          productAttr,
          attrStock: that.data.productValue[index].stock
        })
        // console.log(that.data.productValue[index], that.data.productSelect)
      }
      var arrValue = strValue.split(",");
      if (that.in_array_two(arrValue, arrAttrName)) {
        var image = "productSelect.image";
        var store_name = "productSelect.store_name";
        var price = "productSelect.price";
        var unique = "productSelect.unique";
        var stock = "productSelect.stock";
        that.setData({
          [image]: that.data.productValue[index]['image'],
          [price]: that.data.productValue[index]['price'],
          [unique]: that.data.productValue[index]['unique'],
          [stock]: that.data.productValue[index]['stock'],
        })
      }
      // if (index == that.data.attrName){
      //   var image = "productSelect.image";
      //   var store_name = "productSelect.store_name";
      //   var price = "productSelect.price";
      //   var unique = "productSelect.unique";
      //   var stock = "productSelect.stock";
      //   that.setData({
      //     [image] : that.data.productValue[index]['image'],
      //     [price] : that.data.productValue[index]['price'],
      //     [unique] : that.data.productValue[index]['unique'],
      //     [stock] : that.data.productValue[index]['stock'],
      //   })
      // }
    }
    // wxh.tapsize(that, e);
  },
  in_array_two: function (arr1, arr2) {
    if (arr1.sort().toString() == arr2.sort().toString()) {
      return true;
    } else {
      return false;
    }

  },
  in_array: function (str, arr) {
    for (var f1 in arr) {
      if (arr[f1].indexOf(str) > -1) {
        return true;
      }
    }
  },
  subBuy: function () {
    var that = this;

    if (that.data.num > that.data.productSelect.stock) {
      wx.showToast({
        title: '库存不足' + that.data.num,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        num: that.data.productSelect.stock,
      })
    } else if (that.data.productAttr.length > 0 && that.data.productSelect.unique == '') {
      wx.showToast({
        title: '请选择属性',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (!app.globalData.uid) {
        needLogin()
        return
      }
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/set_cart?uid=' + app.globalData.uid,
        method: 'GET',
        data: {
          productId: that.data.productid,
          cartNum: that.data.num,
          uniqueId: that.data.productSelect.unique
        },
        header: header,
        success: function (res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '添加购物车成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              show: false,
              prostatus: false
            })
            that.getCartCount();
            // wx.setTabBarBadge({
            //     index: 2,
            //     text: '1'
            // })
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
    setTimeout(() => {
      this.setData({
        num: 1
      })
    }, 500)
  },
  prompt: function () {
    wx.showToast({
      title: this.data.productid ? "加入成功" : "加入失败",
      icon: 'success',
      duration: 800,
      mask: true
    })
  },
  prompts: function () {
    wx.showToast({
      title: '加入购物车失败！',
      icon: 'none',
      duration: 2000 //持续的时间

    })
  },
  details: function (e) {
    var that = this;
    var id = e.target.dataset.aa;
    // console.log(e.target.dataset);
    // wx.request({
    //   url: app.globalData.url + '/routine/auth_api/unique',
    //   data: { productId: id },
    //   method: 'GET',
    //   success: function (res) {
    //     // that.setData({
    //     //   Arraylike: res.data.data
    //     // })
    //   }

    // })
  },
  getProductList: function () {

    console.log('getProductList')
    var that = this;
    var news = that.data.news;
    var sid = that.data.sid;
    var cid = that.data.cid;
    var limit = 500;
    var priceOrder = that.data.price;
    var salesOrder = that.data.ficti;
    var offset = 0;
    var startpage = limit * offset;
    wx.showLoading()
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_product_list?uid=' + app.globalData.uid,
      data: {
        sid: sid,
        cid: cid,
        priceOrder: priceOrder,
        salesOrder: salesOrder,
        news: news,
        first: startpage,
        limit: limit
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {


          var len = res.data.data.length;
          var ladding = [];
          for (var i in res.data.data) {
            ladding.push(res.data.data[i]);
          }
          that.setData({
            Arraylike: ladding,
            offset: offset + 1
          })
          wx.hideLoading()
          if (len < limit) {
            that.setData({
              title: "数据已经加载完成",
              hidden: true
            });
            wx.hideLoading()
            return false;
          }
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })
  },
  onReachBottom: function (p) {
    console.log('onReachBottom')
    var that = this;
    var news = '';
    var sid = that.data.sid;
    var cid = that.data.cid;
    var limit = 500;
    var priceOrder = that.data.price;
    var salesOrder = that.data.ficti;
    var offset = that.data.offset;
    var startpage = limit * offset;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_product_list?uid=' + app.globalData.uid,
      data: {
        sid: sid,
        cid: cid,
        priceOrder: priceOrder,
        salesOrder: salesOrder,
        news: news,
        first: startpage,
        limit: limit
      },
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          // console.log(res);
          var len = res.data.data.length;
          var ladding = that.data.Arraylike;
          for (var i in res.data.data) {
            ladding.push(res.data.data[i]);
          }
          that.setData({
            Arraylike: ladding,
            offset: offset + 1
          })
          if (len < limit) {
            that.setData({
              title: "数据已经加载完成",
              hidden: true
            });
            return false;
          }
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })
  },
})