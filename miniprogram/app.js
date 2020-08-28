//app.js
wx.cloud.init({
  env: 'wechatmini1-itxje'
})
const db = wx.cloud.database({
  env: "wechatmini1-itxje",
});
const _ = db.command;
App({
  onLaunch: function () {
    // 展示本地存储能力
    let dictName = wx.getStorageSync("dictName");
    dictName = dictName == "" ? "cet-4" : dictName;
    console.log(dictName, "app.js");
    this.globalData.dictName = dictName;

    let shareFlag = wx.getStorageSync("shareFlag");
    console.log(typeof (shareFlag) == "string", typeof (shareFlag), "shareFlag");

    shareFlag = typeof (shareFlag) == "string" ? false : shareFlag;

    console.log(shareFlag, "app.js222");
    this.globalData.shareFlag = shareFlag;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    shareFlag: "",
    dictName: ""
    // openid: 0
  }
})