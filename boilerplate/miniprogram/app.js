import DATracker from './utils/DATracker'
import fundebug from './deps/fundebug.1.0.0.min.js'

App({
  onLaunch: function () {
    // 请填入哈勃的appKey
    // DATracker.init('key')
    // 用于错误检测，apikey会过期
    // fundebug.init({
    //   apikey : '5bbf66eaa6cd39ec26714e1d2ee619f452a804438c4d029b673db8b3eca150a8'
    // })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
        console.log(res)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})