const db = wx.cloud.database({
  env: "wechatmini1-itxje",
});
const app = getApp();
const _ = db.command;

Page({
  data: {},
  onLoad: async function () {
    wx.showLoading({
      title: '加载中'
    })
    await this.getData();
  },
  getCards: function (specialCards) {
    let photo = [];
    let tasks = [];
    for (let i = 0; i < specialCards.length; i++) {
      let id = specialCards[i].bgId;

      let fileID =
        "cloud://wechatmini1-itxje.7765-wechatmini1-itxje-1301317975/backImages/100" +
        id +
        ".jpg";
      // let fileID2 =
      //   "cloud://wechatmini1-itxje.7765-wechatmini1-itxje-1301317975/backImages/100" +
      //   id +
      //   ".png";
      let p1 = wx.cloud.downloadFile({
        fileID: fileID, // 文件 ID
      });
      tasks.push(p1);
    }

    Promise.all(tasks).then(res => {
      console.log("promise", res);
      wx.hideLoading({
        complete: (res) => {},
      })
      specialCards.forEach((ele, index) => {
        specialCards[index].filePath = res[index].tempFilePath
      })
      this.setData({
        specialCards: specialCards
      });
    })


  },
  getData: async function () {
    db.collection("wordMemory")
      .where({
        _openid: app.globalData.openid,
      })
      .get({
        success: (res) => {
          this.getCards(res.data[0].specialCards)
        },
        fail: (res) => {
          console.log(
            "getCatds get wordMemory !WRONG!",
            "error is",
            res
          );
        },
        complete: () => {
        }
      });

  },
  downloadImage: function (e) {
    console.log(e);
    let filePath = e.currentTarget.dataset.filepath;
    let curId = e.currentTarget.dataset.bgid;
    this.setData({
      curId: curId
    })
    console.log(filePath);
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success(res) {
                  wx.showToast({
                    title: '保存图片成功！',
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: '保存图片失败！',
                    icon: "none"
                  })
                  console.log(res);
                }
              })
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success(res) {
              wx.showToast({
                title: '保存图片成功！',
              })
            },
            fail(res) {
              wx.showToast({
                title: '保存图片失败！',
                icon: "none"
              })
              console.log(res);
            }
          })
        }
      }
    })

  }
})