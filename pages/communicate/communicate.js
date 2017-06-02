  
 Page({ 
    data:{
    // text:"这是一个页面"
    tip:'',
    buttonDisabled:false,
    modalHidden:true,
    show:false,
    x:"165",
    y:"250",
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    voices: [],//音频数组
  },
  showModal:function(){
    this.setData({
      modalHidden:!this.data.modalHidden
    })
  },
  modalBindaconfirm:function(){
    wx.connectSocket({
        url: "ws://192.168.3.79:9000"
    })
    wx.onSocketOpen(function() {
        // callback
        console.log("Websocket连接已打开")
    this.setData({
        modalHidden:!this.data.modalHidden,
        show:!this.data.show,
        tip:'您的当前状态：已连接',
        buttonDisabled:!this.data.buttonDisabled
        })
    })
   
  },
  modalBindcancel:function(){
       wx.onSocketClose(function() {
            // callback
            console.log("Websocket连接已关闭")
            // this.setData({
            // modalHidden:!this.data.modalHidden,
            // tip:'您的当前状态：未连接'
        })
        this.setData({
            modalHidden:!this.data.modalHidden,
            tip:'您的当前状态：未连接'
        })
  },
  touchdown: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    //开始录音
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
       
        wx.uploadFile({
          tempFilePath: tempFilePath,
          url: 'ws://192.168.3.79:9000/upload',
          filePath: res.tempFilePath,
          name: 'file',
          // header: {}, // 设置请求的 header
          formData: {'msg': 'voice'}  
        })

         //持久保存
        // wx.saveFile({
        //   tempFilePath: tempFilePath,
        //   success: function (res) {
        //   // 持久路径
        //   // 本地文件存储的大小限制为 100M
        //   var savedFilePath = res.savedFilePath
        //   console.log("savedFilePath: " + savedFilePath)
        //   }
        //   })

        wx.showToast({
          title: '录音成功',
          icon: 'success',
          duration: 1000
        })
      },

      fail: function (res) {
        //录音失败
        wx.showModal({
          title: '提示',
          content: '录音的姿势不对!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        })
      }
    })
  },
  //手指抬起
  touchup: function () {
    console.log("手指抬起了...")
    this.setData({
      isSpeaking: false,
    })
    clearInterval(this.timer)
    wx.stopRecord()
  },
  //点击播放录音
  // gotoPlay: function (e) {
  //   var filePath = e.currentTarget.dataset.key;
  //   //点击开始播放
  //   wx.showToast({
  //     title: '开始播放',
  //     icon: 'success',
  //     duration: 1000
  //   })
  //   wx.playVoice({
  //     filePath: filePath,
  //     success: function () {
  //       wx.showToast({
  //         title: '播放结束',
  //         icon: 'success',
  //         duration: 1000
  //       })
  //     }
  //   })
  // }
})
//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}
