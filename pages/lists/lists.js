//list.js
//获取应用实例
var app = getApp()
Page({
  data: {
    img:'../../images/higo.png',
    address:"上海市杨浦区军工路516号",
    email:"Lydia_LXH@126.com"
  },
  //事件处理函数
  products: function() {
    wx.navigateTo({
      url: '../products/products'
    })
  },
   team: function() {
    wx.navigateTo({
      url: '../team/team'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
