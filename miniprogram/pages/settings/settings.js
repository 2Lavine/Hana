const app = getApp();
const URLEDIT = "../edit/edit";
const URLINDEX = "../index/index"
const URLCARD = "../cards/cards"
let touchBeginX = 0;
let time = 0;
const db = wx.cloud.database({
  env: "wechatmini1-itxje",
});
const DICTNAME = ["wordsList", "cet-4"]
const levelarr = ["黄金", "白金", "钻石", "大师", "王者"]
const _ = db.command;
Page({
  data: {
    dict: ["英语6级", "英语4级"],
    dict_index: 0,
    hasUserInfo: false,
    shareFlag: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    avatarUrl: "/images/logo.jpg",
    nickName: "xx:",
    days: "11",
    remind: [{
        name: "已背单词",
        value: "0"
      },
      {
        name: "今天已背",
        value: "0"
      },
      {
        name: "已得卡片",
        value: "0"
      },
    ],
    settings: [{
        settingsName: "提醒时间",
        settingsValue: "21:35"
      },
      {
        settingsName: "备份与还原",
        settingsValue: "45天前"
      },
    ],
  },
  showCard: function (e) {
    console.log(e);
    wx.navigateTo({
      url: URLCARD,
    });
  },
  getUserInfo: function (e) {

  },
  toEdit: function () {
    wx.switchTab({
      url: URLEDIT,
    });
  },
  onGotUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    db.collection("userInfo").add({
      data: {
        _id: app.globalData.openid,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
      }
    });
    this.setInfoStorage("avatarUrl", e.detail.userInfo.avatarUrl);
    this.setInfoStorage("nickName", e.detail.userInfo.nickName);
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
    app.globalData.nickName = e.detail.userInfo.nickName;
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  onGetOpenid: function () {
    // 调用云函数

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onShow: function () {
    // let wordId = wx.getStorageSync("wordId");
    wx.showTabBar({
      animation: false,
    })
    let wordIdMAX = wx.getStorageSync("wordIdMAX");
    let init_wordId = wx.getStorageSync("init_wordId");
    let wordsLimit = wx.getStorageSync("wordsLimit");
    let specialCards = wx.getStorageSync("specialCards");
    let avatarUrl = wx.getStorageSync("avatarUrl");
    avatarUrl = avatarUrl == "" ? "/images/logo.jpg" : avatarUrl;
    let nickName = wx.getStorageSync("nickName");
    nickName = nickName == "" ? "点击左侧注册" : nickName;
    let alreadyWordToday

    alreadyWordToday = wordIdMAX - init_wordId;
    let alreadyWord = wordIdMAX - 1;
    this.getLevel(specialCards.length)
    let remind = [{
        name: "已背单词",
        value: alreadyWord
      },
      {
        name: "今天已背",
        value: alreadyWordToday
      },
      {
        name: "已得卡片",
        value: specialCards.length
      },
    ];
    // if(this.data.hasUserInfo)
    this.setData({
      remind: remind,
      wordsLimit: wordsLimit,
      dict_index: DICTNAME.indexOf(app.globalData.dictName),
      shareFlag: app.globalData.shareFlag,
      avatarUrl: avatarUrl,
      nickName: nickName
    })
  },
  setInfoStorage: function (key, data) {
    wx.setStorage({
      key: key,
      data: data,
      success: (res) => {
        // console.log("setWordMemoryInfoStorage", memoryInfo);
        console.log(" setInfoStorage setok");
      },
    });
  },
  changeWordsLimit: function (e) {
    const wordsLimit = Number(e.detail.value);
    this.setInfoStorage("wordsLimit", wordsLimit);
    console.log("wordsLimit", wordsLimit);

    db.collection("wordMemory").where({
      _openid: app.globalData.openid
    }).update({
      data: {
        wordsLimit: wordsLimit
      }
    })
  },
  touchStart: function (e) {
    touchBeginX = e.touches[0].clientX;
    time = e.timeStamp
  },
  touchEnd: function (e) {
    var touchEndX = e.changedTouches[0].clientX;
    time = e.timeStamp - time;
    if (touchEndX - touchBeginX >= 60 && time < 1000) {
      wx.switchTab({
        url: URLINDEX,
      })
    }
  },
  changeDict: function (e) {
    console.log(e);
    this.setData({
      dict_index: e.detail.value
    })
    app.globalData.dictName = DICTNAME[e.detail.value];
    this.setInfoStorage("dictName", DICTNAME[e.detail.value]);
  },
  shareInfo: function (e) {
    console.log(e.detail);
    app.globalData.shareFlag = e.detail.value;
    this.setInfoStorage("shareFlag", e.detail.value);
  },
  getLevel: function (specialCardsNumber) {
    let level_index = Math.floor(specialCardsNumber / 3);
    level_index = level_index > 4 ? 4 : level_index;
    this.setData({
      levelName: levelarr[level_index]
    })
  }

});