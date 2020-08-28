const db = wx.cloud.database({
  env: 'wechatmini1-itxje'
});
const _ = db.command;
const app = getApp();
const openId = app.globalData.openid;
const $ = db.command.aggregate;

const formatDateSim = require("../../utils/dateSim");
let PAGEALLCOUNT = 1;
let pageCount = 1;
let pageCountAll = 1;
let pageCountShuffle = 1;
let time = 0;
let touchBeginY = 0;
const dictName = app.globalData.dictName;
const tabName = ["self", "all", "shuffle"];

function compareNumbers(worda, wordb) {
  return wordb.tips[0].tipsInfo - worda.tips[0].tipsInfo;
}
Page({
  data: {
    word: "abcde",
    flag: "true",
    tabPage: 0
  },
  onShow: async function (options) {
    pageCount = 1;
    pageCountAll = 1;
    pageCountShuffle = 1;
    wx.showLoading({
      title: '加载中',
    })
    await this.getResource(openId);
    wx.hideLoading({
      complete: (res) => {},
    })
  },
  deleteTip: function (e) {
    const id = e.target.dataset.id;
    wx.showModal({
      title: "警告",
      content: "删除后将无法恢复？请确认是否继续",
      success: (res) => {
        if (res.confirm) {
          this.deleteResource("tip", id);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  deleteTips: function (e) {
    wx.showModal({
      title: "警告",
      content: "删除后将无法恢复？请确认是否继续",
      success: (res) => {
        if (res.confirm) {
          this.deleteResource("tip");
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  deleteResource: function (type, id = null) {
    //当type为tip时删除 tip
    //当没有ID时删除所有的tip
    // 后面要加一下从数据库删除的
    if (type == "tip") {
      if (id) {
        //删除和id相等的tip
        //font delete
        const newUserTips = this.data.usrTips.filter((element) => {
          return element.id != id;
        });
        console.log(newUserTips);
        this.setData({
          usrTips: newUserTips,
        });
        console.log("edit", id);
        // cloud delete
        wx.cloud.callFunction({
          name: 'deleteTip',
          data: {
            id: id
          },
          success: function (res) {},
          fail: (e) => {
            console.log();
          }
        })
      } else {
        this.setData({
          usrTips: [],
        });
      }
    }
  },
  editTip: function () {
    console.log("edit");
    const url = "../add/add?word=" + this.data.word;
    wx.navigateTo({
      url: url,
    });
  },
  getResource: async function (openId) {
    let getReviewWordsUser = await wx.cloud.callFunction({
      name: "getReviewWordsUser",
      data: {
        dictName: app.globalData.dictName
      }
    });
    let getReviewWords = await wx.cloud.callFunction({
      name: "getReviewWords",
      data: {
        dictName: app.globalData.dictName
      }
    });
    let getReviewWordsShuffle = await wx.cloud.callFunction({
      name: "getReviewWordsShuffle",
      data: {
        dictName: app.globalData.dictName
      }
    });
    let UserWordInfo = getReviewWordsUser.result;
    let WordInfo = getReviewWords.result;
    let shuffleWordInfo = getReviewWordsShuffle.result;
    this.setData(UserWordInfo);
    this.setData(WordInfo);
    this.setData(shuffleWordInfo)
  },
  touchStart: function (e) {
    touchBeginY = e.touches[0].clientY; // 获取触摸时的起点
    time = e.timeStamp
  },
  touchEnd: function (e) {
    var touchEndY = e.changedTouches[0].clientY;
    time = e.timeStamp - time;
    // 向下滑动
    if (touchEndY - touchBeginY <= -40 && time < 1000) {
      switch (tabName[this.data.tabPage]) {
        case "self":
          this.getNextPage();
          break;
        case "all":
          this.getNextPageAll();
          break;
        case "shuffle":
          this.getNextPageShuffle();
          break;
      }
    }
  },
  getNextPage: function () {
    if (pageCount >= this.data.PAGEALLCOUNT) {
      if (pageCount == this.data.PAGEALLCOUNT) {
        pageCount++;
        wx.showToast({ //
          title: '到底了',
          icon: 'success',
          duration: 1000
        });
      }
    } else {
      pageCount += 1;
      console.log("next page", pageCount);
      let pageCountEnd = (pageCount * 3) <= this.data.choosedusrTips.length ? (pageCount * 3) : this.data.choosedusrTips.length;
      console.log("next page pageCountEnd", pageCountEnd);
      this.data.usrTips = [...this.data.usrTips, ...this.data.choosedusrTips.slice(pageCount * 3 - 3, pageCountEnd)]
      this.setData({
        usrTips: this.data.usrTips
      })
    }
  },
  getNextPageAll: function () {
    if (pageCountAll == this.data.ALLPAGEALLCOUNT) {
      pageCountAll++;
      wx.showToast({ //
        title: '到底了',
        icon: 'success',
        duration: 1000
      });
    } else {
      pageCountAll += 1;
      this.data.usrTipsAll = [...this.data.usrTipsAll, ...this.data.choosedusrTipsAll.slice(pageCountAll * 3 - 3, pageCountAll * 3)]
      this.setData({
        usrTipsAll: this.data.usrTipsAll
      })
    }
  },
  getNextPageShuffle: function () {
    if (pageCountShuffle == this.data.SHUFFLEPAGEALLCOUNT) {
      pageCountShuffle++;
      wx.showToast({ //
        title: '到底了',
        icon: 'success',
        duration: 1000
      });
    } else {
      pageCountShuffle += 1;
      this.data.usrTipsShuffle = [...this.data.usrTipsShuffle, ...this.data.choosedusrTipsShuffle.slice(pageCountShuffle * 3 - 3, pageCountShuffle * 3)]
      this.setData({
        usrTipsShuffle: this.data.usrTipsShuffle
      })
    }
  },
  changeTab_move: function (e) {
    // console.log(e);
    this.setData({
      tabPage: e.detail.current
    })
  },
  changeTab_tap: function (e) {
    // console.log(e);
    this.setData({
      tabPage: e.currentTarget.dataset.tab
    })
  },
  playSound: function (e) {
    // console.log(e);
    this.wordAudio = wx.createInnerAudioContext();
    this.wordAudio.src = e.currentTarget.dataset.sound;
    this.wordAudio.play();
  }
});