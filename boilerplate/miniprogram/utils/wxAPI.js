var appInstance = getApp();

function wxPromisify(fn) {
  return (obj = {}) => {
    return new Promise((resolve, reject) => {
      obj.success = (resp) => {
        if (resp.statusCode !== undefined && resp.statusCode !== 200) {
          console.log("fail", resp)
          reject(resp)
        } else {
          // console.log("success", resp)
          resolve(resp);
        }
      }
      obj.fail = (resp) => {
        // console.log("fail", resp)
        reject(resp)
      }
      fn(obj)
    })
  }
}

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
}

/**
 * 微信用户登录,获取code
 */
function wxRequest() {
  return wxPromisify(wx.request)
}

function wxCheckSession(obj) {
  return wxPromisify(wx.checkSession)(obj)
}

function wxLogin(obj) {
  return wxPromisify(wx.login)(obj).then((res) => {
    appInstance.globalData.code = res.code;
    return Promise.resolve(res)
  })
}

function wxGetUserInfo(obj) {
  return wxPromisify(wx.getUserInfo)(obj).then((res) => {
    appInstance.globalData.userInfo = res.userInfo;
    return Promise.resolve(res)
  });
}

function wxShowModal(obj) {
  return wxPromisify(wx.showModal)(obj)
}

function wxUploadFile(obj) {
  return wxPromisify(wx.uploadFile)(obj)
}

function wxAuthorize(obj) {
  return wxPromisify(wx.authorize)(obj)
}

function wxGetSetting(obj) {
  return wxPromisify(wx.getSetting)(obj)
}

module.exports = {
  wxRequest: wxRequest,
  wxCheckSession: wxCheckSession,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxUploadFile: wxUploadFile,
  wxShowModal: wxShowModal,
  wxAuthorize: wxAuthorize,
  wxGetSetting: wxGetSetting
}