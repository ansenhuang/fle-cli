import DATracker from './utils/DATracker'

App({
  onLaunch: function () {
    // 请填入哈勃的appKey
    // DATracker.init('key')
    
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