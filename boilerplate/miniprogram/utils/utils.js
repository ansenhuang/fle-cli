import wxAPI from './wxAPI'
import {
  reqwest
} from '../model/fetchAPI'


// 蜗牛用于上报formId，其他产品问问后端能否跨域
export const sendFormId = function (formId) {
  let openId = wx.getStorageSync('openId')
  if (!openId || !formId) return

  console.log('formId', formId)
  if (formId === 'the formId is a mock one') {
    console.log('formId 测试提交成功')
    return
  }
  reqwest({
    url: '/minicommon/uploadFormId.json',
    method: 'GET',
    data: {
      formId,
      openId,
    }
  }).then(resp => {
    if (resp.code === 0) {
      console.log('formId上报成功')
    } else {
      wx.showToast({
        title: resp.msg,
        icon: 'none',
        duration: 3000
      })
    }
  })
}


// 蜗牛小程序登录获取token
export const weixinLogin = function (callBack) {
  wxAPI.wxLogin().then(resp => {
    let {
      code
    } = resp

    wxAPI.wxGetSetting().then(resp => {
      if (resp.authSetting['scope.userInfo']) {
        wxAPI.wxGetUserInfo({
          withCredentials: true
        }).then(resp => {
          console.log('成功获取用户信息:', resp)
          let {
            encryptedData,
            iv,
            userInfo: {
              nickName,
              avatarUrl,
              gender,
            }
          } = resp

          reqwest({
            url: '/login/miniprogram',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              code,
              encryptedData,
              iv,
              nickName,
              avatarUrl,
              gender
            },
            method: 'POST'
          }).then(resp => {
            if (resp.code === 0) {
              wx.setStorageSync('authToken', resp.authToken)
              // 用于获取模板消息
              fetchOpenId()
              // sendLoginRecord(1)
              if (needUserInfo) {
                return fetchUserInfo()
              } else {
                fetchUserInfo()
                callBack && callBack()
              }
            } else {
              wx.showToast({
                title: `登录失败`,
                icon: 'none',
                duration: 3000
              })
            }
          })
        })
      }
    })
  })
}

// 发送模板消息需要openId
export const fetchOpenId = () => {
  wxAPI.wxLogin().then(resp => {
    let {
      code
    } = resp

    return code
  }).then(code => {
    return reqwest({
      url: '/minicommon/openId',
      method: 'GET',
      data: {
        code,
      }
    })
  }).then(({
    openId
  }) => {
    wx.setStorageSync('openId', openId)
  })
}

export const sendLoginRecord = type => {
  if(getApp()){
    console.log('sendLoginRecord', type);
    reqwest({
      url: '/couple/login/record.json',
      method: 'POST',
      data: {
        type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

export const fetchUserInfo = () => {
  reqwest({
    url: '/user/info.json',
    method: 'GET'
  }).then(resp => {
    if (resp.code === 0) {
      const {user} = resp;

      wx.setStorageSync('user', user);
      if (getApp()) {
        getApp().DATracker.login(user.userId)
      }
      return Promise.resolve(user);
    } else {
      wx.showToast({
        title: resp.msg,
        icon: 'none',
        duration: 3000
      })
      return Promise.reject();
    }
  })
}

export const getUserInfo = () => {
  return new Promise(resolve => {
    const userInfo = wx.getStorageSync('user');
    if(userInfo){
      resolve(userInfo)
    }else{
      return weixinLogin(null, null, true)
    }
  })
}