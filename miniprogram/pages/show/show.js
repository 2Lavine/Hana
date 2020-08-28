const fetch = require("../../utils/fetch");
Page({
  data: {
    word: "abcde",
    flag: true,
    lastTapTime: 0,
    usrTips: [
      {
        id: 1,
        userName: "xx:",
        liked: "13",
        flag: false,
        tips: [
          {
            tipsName: "词根",
            tipsInfo: "abc,表示开始",
          },
          {
            tipsName: "对比",
            tipsInfo: ">abc,表示开始",
          },
          {
            tipsName: "例句",
            tipsInfo: ">abc,表示开始",
          },
        ],
      },
      {
        id: 2,
        userName: "abxx:",
        liked: "1344k",
        flag: true,
        tips: [
          {
            tipsName: "词根",
            tipsInfo: "abc,表示开始",
          },
          {
            tipsName: "对比",
            tipsInfo: "同义词:abcdee \n 反义词:edcba",
          },
          {
            tipsName: "例句",
            tipsInfo: ">abc,表示开始",
          },
        ],
      },
      {
        id: 3,
        userName: "abxx:",
        liked: "1344k",
        flag: true,
        tips: [
          {
            tipsName: "词根",
            tipsInfo: "abc,表示开始",
          },
          {
            tipsName: "对比",
            tipsInfo: "同义词:abcdee \n 反义词:edcba",
          },
          {
            tipsName: "例句",
            tipsInfo: ">abc,表示开始",
          },
        ],
      },
      {
        id: 4,
        userName: "abxx:",
        liked: "1344k",
        flag: true,
        tips: [
          {
            tipsName: "词根",
            tipsInfo: "abc,表示开始",
          },
          {
            tipsName: "对比",
            tipsInfo: "同义词:abcdee \n 反义词:edcba",
          },
          {
            tipsName: "例句",
            tipsInfo: ">abc,表示开始",
          },
        ],
      },
    ],
  },
  onLoad: function (options) {
    let word = options["word"];
    console.log(word);

    //test 用 之后删除
    word = "abcde";
    console.log(word);
    if (word) {
      this.getResource(word);
      this.setData({
        word: word,
      });
    }
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
    if (type == "tip") {
      if (id) {
        const newUserTips = this.data.usrTips.filter((element) => {
          return element.id != id;
        });
        console.log(newUserTips);
        this.setData({
          usrTips: newUserTips,
        });
        wx.reLaunch(
          {
            url: "/" + this.route,
          },
          console.log(123)
        );
      } else {
        this.setData({
          usrTips: [],
        });
      }
    }
  },
  doubleClick: function (e) {
    var curTime = e.timeStamp;
    var lastTime = e.currentTarget.dataset.time;
    const id = e.currentTarget.dataset.id;
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        this.changeLiked(id);
      }
    }
    this.setData({
      lastTapTime: curTime,
    });
  },
  changeLiked: function (id) {
    const newUserTips = this.data.usrTips.map((element) => {
      if (element.id == id) {
        element.flag = !element.flag;
      }
      return element;
    });
    this.setData({
      usrTips: newUserTips,
    });
  },
  changeLiked_tap: function (e) {
    const id = e.currentTarget.dataset.id;
    this.changeLiked(id);
  },
  getResource: function (word, userkey = null) {
    const querydata = {
      word: word,
    };
    fetch("gettips", querydata).then((res) => {
      this.setData({ usrTips: res.data });
    });
  },
});
