const URLSETTING = "../settings/settings";
const URLSHOW = "../show/show";
const fetch = require("../../utils/fetch");
const formatDate = require("../../utils/date");
const app = getApp();
const lessonTmplId = "wnQ5dcO_XOLuqGeDn2Ncgq6-BWL_w5bELbIxB06QX9s";
const db = wx.cloud.database({
  env: "wechatmini1-itxje",
});
const _ = db.command;
const formatDateSim = require("../../utils/dateSim");
const SPECAILBACKGROUNDS = [3, 6, 7, 8, 9, 10, 11, 39, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
let touchBeginX = 0;
let time = 0;
const Cycle = 5;
const WORDLIMIT = 3;
let dictName = app.globalData.dictName;
// app.globalData.WORDLIMIT = 10;
Page({
  data: {
    flag: false,
    background: "https://bkimg.cdn.bcebos.com/pic/730e0cf3d7ca7bcbaff87c79b1096b63f724a8e1?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
    wordListOneTime: [],
    reviewWords: [],
    specialCards: [],
    showModal: false,
  },
  /*
      rightword: "abcde";,
      showword: "a_ _ _e",
      inputword: "",
      explain: "n.摧毁摧毁 n.摧毁摧毁n.摧毁摧毁",
      opacity: 1,
      flag: false,
      keyboardword: this.getKeyBoard(rightword)
  */
  inputchanging: function (e) {
    let inputword = this.data.inputword;
    let rightword = this.data.rightword;
    switch (e.target.dataset.id) {
      case "←":
        inputword = inputword.slice(0, inputword.length - 1);
        break;
      default:
        if (typeof inputword != "undefined") {
          if (inputword.length < rightword.length)
            inputword = inputword + e.target.dataset.id;
        } else {
          inputword = e.target.dataset.id;
        }
        break;
    }
    const flag_opacity = this.checkWord(inputword, rightword);
    this.setData({
      inputword: inputword,
      flag: flag_opacity.flag,
      opacity: flag_opacity.opacity,
    });
    if (flag_opacity.flag == true) {
      let special_flag = this.checkSpecialCard(this.data.bgId);
      if (special_flag == false) {
        setTimeout(this.getNextWord_new, 2000);
      } else {}
    }
  },
  getNextWord_new: function () {
    const length = this.data.reviewWords.length;
    this.setInfoStorage("last_success_time", formatDateSim());
    //就是index
    let count = this.data.wordId - this.data.wordIdInit + 1;
    // const limit = this.data.wordListOneTime.length;
    const limit = this.data.wordsLimit;
    if (count > limit) {
      console.log(1);
      this.data.flag_onlyGetFromReview = true;
      this.setInfoStorage("flag_onlyGetFromReview", true);
      //memory level<2  在0分10秒之前背过的单词
      this.getReviewWords(2, 0, 0, 0);
      this.getReviewWords(3, 0, 1, 0);
      this.getReviewWords(4, 0, 30, 0);
      if (this.data.reviewWords.length == 0) {
        this.getReviewWords(4, 0, 0, 0);
        if (this.data.reviewWords.length == 0) {
          wx.showToast({
            title: "complete",
          });
        } else {
          this.subscribeMessage();
        }
        this.setData({
          wordId: this.data.wordIdInit,
          flag_onlyGetFromReview: true,
        });
        this.findWordFromArray(0);
      } else {
        this.getReviewWord();
        this.setData({
          flag_onlyGetFromReview: true,
          wordIdMAX: this.data.wordId + 1,
        });
      }
    } else {
      if (length == 0 && !this.data.flag_onlyGetFromReview) {
        if (count >= limit) {
          this.data.flag_onlyGetFromReview = true;
          this.setInfoStorage("flag_onlyGetFromReview", true);
          this.setInfoStorage("wordIdMAX", this.data.wordId + 1);
          this.setData({
            wordIdMAX: this.data.wordId + 1,
          });
          //memory level<2  在0分10秒之前背过的单词
          this.getReviewWords(2, 0, 0, 0);
          this.getReviewWords(3, 0, 1, 0);
          this.getReviewWords(4, 0, 30, 0);
          if (this.data.reviewWords.length == 0) {
            this.getReviewWords(4, 0, 0, 0);
            if (this.data.reviewWords.length == 0) {
              wx.showToast({
                title: "complete",
              });
            } else {
              this.subscribeMessage();
            }
            this.setData({
              wordId: this.data.wordIdInit,
            });
            this.findWordFromArray(0);
          } else {
            this.getReviewWord();
          }
        } else if (count == 1) {
          this.getReviewWords(6, 12, 0, 0);
          this.getReviewWords(6, 36, 0, 0);
          //回顾12小时前的单词
          if (this.data.reviewWords.length == 0) {
            this.findWordFromArray(count);
          } else {
            this.getReviewWord();
          }
        } else {
          if (count % Cycle == 0) {
            this.getReviewWords(2, 0, 0, 0);
            this.getReviewWords(3, 0, 1, 0);
            this.getReviewWords(4, 0, 30, 0);
          }
          console.log("cycle === ", this.data.reviewWords);
          if (this.data.reviewWords.length == 0) {
            console.log(count);
            this.findWordFromArray(count);
          } else {
            this.getReviewWord();
          }
        }
      } else {
        {
          if (length > 0) {
            this.getReviewWord();
          } else {
            this.getReviewWords(2, 0, 0, 0);
            this.getReviewWords(3, 0, 1, 0);
            this.getReviewWords(4, 0, 30, 0);
            if (this.data.reviewWords.length == 0) {
              this.getReviewWords(4, 0, 0, 0);
              if (this.data.reviewWords.length == 0) {
                wx.showToast({
                  title: "complete",
                });
              } else {
                this.subscribeMessage();
              }
              this.setData({
                wordId: this.data.wordIdInit,
              });
              this.findWordFromArray(0);
            } else {
              this.getReviewWord();
            }
          }
        }
      }
    }
  },
  findWord: async function (wordId) {
    console.log("findwordID", wordId);

    db.collection(dictName)
      .where({
        id: wordId,
      })
      .get({
        success: (res) => {
          wx.hideLoading();
          //获取基本数据
          console.log(res, "findword");

          const data = res.data[0];
          const rightword = data.word;
          const explain = data.explain;
          const wordAudioUrl = data.sound;
          const showword = this.modifyWord(rightword);
          //将wordid存到缓存里面
          wx.setStorage({
            key: "wordId",
            data: wordId,
            success: (res) => {
              console.log("setStorage", wordId);
            },
          });
          let wordIdMAX =
            this.data.wordIdMAX > wordId ? this.data.wordIdMAX : wordId;
          //设置数据
          // wordid
          // rightword
          // showword
          // inputword
          // explain
          // background-opacity
          //  if input right=>flag
          //keyboard
          this.setData({
            wordId: wordId,
            rightword: rightword,
            showword: showword,
            explain: explain,
            curWordinfo: data,
            opacity: 1,
            flag: false,
            inputword: "",
            keyboardword: this.getKeyBoard(rightword),
            wordAudioUrl: wordAudioUrl,
            wordIdMAX: wordIdMAX,
          });
        },
      });
  },
  findWordFromArray: async function (index) {
    console.log(index);
    let data = this.data.wordListOneTime[index];
    const rightword = data.word;
    const wordId = data.id;
    const explain = data.explain;
    const wordAudioUrl = data.sound;
    const showword = this.modifyWord(rightword);
    const bgId = this.getBackgroundUrl();
    let wordIdMAX = this.data.wordIdMAX;
    wordIdMAX = wordIdMAX > wordId ? wordIdMAX : wordId;
    wx.setStorage({
      data: wordId,
      key: "wordId",
      success: (res) => {
        console.log("setStorage", wordId);
      },
    });
    this.setData({
      wordId: wordId,
      rightword: rightword,
      showword: showword,
      explain: explain,
      curWordinfo: data,
      opacity: 1,
      flag: false,
      inputword: "",
      keyboardword: this.getKeyBoard(rightword),
      wordAudioUrl: wordAudioUrl,
      bgId: bgId,
      wordIdMAX: wordIdMAX,
    });
  },
  getWords: async function (wordInitId, countResult) {
    console.log("wordInitId", wordInitId);
    console.log("countResult", countResult);
    console.log(dictName, "dictName");
    let getwords = await wx.cloud.callFunction({
      name: "getWords",
      data: {
        countResult: countResult,
        wordInitId: wordInitId,
        dictName: dictName,
      },
    });
    let wordListOneTime = await getwords.result.data;
    this.setData({
      wordListOneTime: wordListOneTime,
    });
  },
  getReviewWord: function () {
    const bgId = this.getBackgroundUrl();
    const data = this.data.reviewWords.shift();
    if (data === undefined) {
      return false;
    } else {
      const rightword = data.word;
      const explain = data.explain;
      const wordAudioUrl = data.sound;
      const showword = this.modifyWord(rightword);
      this.setData({
        rightword: rightword,
        showword: showword,
        reviewWords: this.data.reviewWords,
        explain: explain,
        curWordinfo: data,
        opacity: 1,
        flag: false,
        inputword: "",
        keyboardword: this.getKeyBoard(rightword),
        wordAudioUrl: wordAudioUrl,
        bgId: bgId,
      });
      return true;
    }
  },
  checkWord: function (inputword, rightword) {
    if (inputword === rightword) {
      this.wordAudio = wx.createInnerAudioContext();
      this.wordAudio.src = this.data.wordAudioUrl;
      this.wordAudio.play();
      this.saveWordMermoryInfo(inputword, "success");
      this.setInfoStorage("last_success_time", formatDateSim());
      return {
        flag: true,
        opacity: 0,
      };
    } else if (inputword == rightword.slice(0, inputword.length)) {
      return {
        flag: false,
        opacity: 1 - inputword.length / rightword.length,
      };
    } else {
      this.innerAudioContext.play();
      return {
        flag: false,
        opacity: 1,
      };
    }
  },
  initAudio: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = "/audio/wrong.mp3";
    this.innerAudioContext.onPlay(() => {
      console.log("开始播放");
    });
    this.innerAudioContext.onEnded(() => {
      console.log("录音播放结束");
    });
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    });
  },
  saveWordMermoryInfo: function (inputword, msg) {
    const memory = this.getWordMermoryInfo();
    const wordKey = inputword + "_";
    const wordIndex = memory.indexOf(wordKey);
    if (wordIndex != -1) {
      let newWordMemory = wx.getStorageSync(wordKey);
      if (msg == "success") newWordMemory.memory++;
      else newWordMemory.wrongTime++;
      newWordMemory.date = formatDate();
      this.setWordMemoryInfoStorage(newWordMemory, inputword);
    } else {
      let initMemoryInfo = this.data.curWordinfo;
      if (msg == "success") {
        initMemoryInfo.memory = 1;
        initMemoryInfo.wrongTime = 0;
      } else {
        initMemoryInfo.memory = 0;
        initMemoryInfo.wrongTime = 1;
      }
      initMemoryInfo.date = formatDate();
      this.setWordMemoryInfoStorage(initMemoryInfo, inputword);
    }
  },
  setWordMemoryInfoStorage: function (memoryInfo, inputword) {
    // let wordsList = wx.getStorageSync("wordsList");
    // wordsList = typeof wordsList == "string" ? [] : wordsList;
    // wordsList.push(memoryInfo);

    // this.setInfoStorage("wordsList", wordsList);
    this.setInfoStorage(inputword + "_", memoryInfo);
  },
  setInfoStorage: function (key, data) {
    wx.setStorage({
      key: key,
      data: data,
      success: (res) => {},
    });
  },
  getWordMermoryInfo: function () {
    return wx.getStorageInfoSync().keys.filter((ele) => {
      if (ele.endsWith("_")) return true;
    });
  },
  onLoad: async function () {
    wx.showLoading({
      title: "加载中",
    });
    await this.initStorage();
    console.log(2);
    this.initStartMusic();
    let wordId = wx.getStorageSync("wordId");
    let wordIdMAX = wx.getStorageSync("wordIdMAX");
    let wordIdInit = wx.getStorageSync("init_wordId");
    let specialCards = wx.getStorageSync("specialCards");
    let bgId = this.getBackgroundUrl();
    specialCards = specialCards == "" ? [] : specialCards;
    if (wordIdInit > wordId) wordId = wordIdInit;
    wordIdMAX = wordIdMAX > wordId ? wordIdMAX : wordId;
    let flag_onlyGetFromReview = wx.getStorageSync("flag_onlyGetFromReview");
    let wordsLimit = wx.getStorageSync("wordsLimit");
    this.initAudio();
    this.setData({
      flag_onlyGetFromReview: flag_onlyGetFromReview,
      wordId: wordId,
      wordIdInit: wordIdInit,
      innerAudioContext: this.innerAudioContext,
      wordsLimit: wordsLimit,
      specialCards: specialCards,
      bgId: bgId,
      wordIdMAX: wordIdMAX,
    });
    await this.findWord(wordId);
    wx.hideLoading({
      complete: (res) => {},
    });
    await this.getWords(wordIdInit - 1, wordsLimit);
    console.log(this.data.wordListOneTime, "wordslist");
  },
  onShow: async function () {
    console.log(2333);
    let new_dictName = app.globalData.dictName;
    console.log(app.globalData);
    wx.hideTabBar({
      animation: true,
    });
    if (new_dictName != dictName) {
      wx.clearStorageSync();
      this.initialization();
      this.setInfoStorage("dictName", new_dictName);
      this.setInfoStorage("avatarUrl", app.globalData.avatarUrl);
      this.setInfoStorage("nickName", app.globalData.nickName);
      this.initAudio();
      this.setData({
        flag_onlyGetFromReview: false,
        wordId: 1,
        wordIdInit: 1,
        innerAudioContext: this.innerAudioContext,
        wordsLimit: WORDLIMIT,
        specialCards: this.data.specialCards,
        bgId: 32,
        wordIdMAX: 1,
      });
      dictName = new_dictName;
      await this.findWord(1);
      await this.getWords(0, WORDLIMIT);
    } else {
      let newWordsLimit = wx.getStorageSync("wordsLimit");
      if (newWordsLimit != this.data.wordsLimit) {
        if (newWordsLimit > this.data.wordsLimit) {
          this.setInfoStorage("flag_onlyGetFromReview", false);
          await this.getWords(this.data.wordIdInit - 1, newWordsLimit);
          this.setData({
            wordsLimit: newWordsLimit,
            flag_onlyGetFromReview: false,
          });
        }
        wx.setStorageSync("wordsLimit", newWordsLimit);
        this.setData({
          wordsLimit: newWordsLimit,
        });
      }
    }

    if (this.data.rightword == this.data.inputword && this.data.rightword) {
      this.findWord(this.data.wordId);
    }
  },
  initStartMusic: function () {
    let startMusic = wx.createInnerAudioContext();
    startMusic.src = "/audio/start.mp3";
    startMusic.play();
  },
  modifyWord: function (word) {
    let wordArray = Array.from(word);
    let showWord = wordArray.reduce((words, curword, index) => {
      if (index == 0 || index == wordArray.length - 1) {
        words = words + curword;
        return words;
      } else {
        words = words + "_";
        return words;
      }
    }, "");
    return showWord;
  },
  hiddenMask: function () {
    this.saveWordMermoryInfo(this.data.rightword, "fail");
    this.wordAudio = wx.createInnerAudioContext();
    this.wordAudio.src = this.data.wordAudioUrl;
    this.wordAudio.play();
    this.setData({
        flag: true,
        opacity: 0,
      },
      setTimeout(this.getNextWord_new, 2000)
    );
  },
  getKeyBoard: function (word) {
    let wordArray = Array.from(word);
    while (wordArray.length < 14) {
      const randomLetter = ((Math.random() * 100000) % 26) + 97;
      const letter = String.fromCharCode(randomLetter);
      wordArray.push(letter);
    }

    wordArray.sort(() => {
      return 0.5 - Math.random();
    });
    wordArray.push("←");
    return wordArray;
  },
  toPersonal: function () {
    wx.switchTab({
      url: URLSETTING,
    });
  },
  showWordInfo: function () {
    // let url = URLSHOW + "?word=" + this.data.rightword;
    // wx.navigateTo({
    //   url: url,
    // });
  },
  onHide: function () {
    wx.setStorage({
      data: this.data.wordId,
      key: "wordId",
      success: (res) => {
        console.log("onUnload", this.data.wordId);
      },
    });
    this.setInfoStorage("specialCards", this.data.specialCards);
    let wordId = this.data.wordId;
    let wordIdMAX = this.data.wordIdMAX;
    wordIdMAX = wordIdMAX > wordId ? wordIdMAX : wordId;
    this.setInfoStorage("wordIdMAX", wordIdMAX);
    //这里应该是
    let last_success_time = wx.getStorageSync("last_success_time");
    if (last_success_time == formatDateSim()) {
      db.collection("wordMemory")
        .where({
          _openid: app.globalData.openid,
        })
        .get({
          success: (res) => {
            if (res.data.length == 0) {
              db.collection("wordMemory").add({
                data: {
                  last_success_time: formatDateSim(),
                  flag_onlyGetFromReview: this.data.flag_onlyGetFromReview,
                  wordId: this.data.wordId,
                  wordIdInit: this.data.wordIdInit,
                  wordsLimit: this.data.wordsLimit,
                  specialCards: this.data.specialCards,
                  wordIdMAX: wordIdMAX,
                },
              });
            } else {
              db.collection("wordMemory")
                .where({
                  _openid: app.globalData.openid,
                })
                .update({
                  data: {
                    last_success_time: formatDateSim(),
                    flag_onlyGetFromReview: this.data.flag_onlyGetFromReview,
                    wordId: this.data.wordId,
                    wordIdInit: this.data.wordIdInit,
                    wordsLimit: this.data.wordsLimit,
                    specialCards: this.data.specialCards,
                    wordIdMAX: wordIdMAX,
                    //这里要改一下，每一次重新进入要获得上一次的specialcards
                  },
                  success: (res) => {
                    console.log("on hide update success");
                  },
                });
            }
          },
          fail: (res) => {
            console.log("fail db");
          },
        });

      const memory = this.getWordMermoryInfo();
      memory.forEach((ele) => {
        db.collection("wordsInfo")
          .where({
            _openid: app.globalData.openid,
            word: ele,
          })
          .get()
          .then((res) => {
            let word = wx.getStorageSync(ele);
            if (res.data.length == 0) {
              db.collection("wordsInfo").add({
                data: {
                  word: ele,
                  wrongTime: word.wrongTime,
                  wordId: word.id,
                  successTime: formatDateSim(),
                  shareFlag: app.globalData.shareFlag,
                  dictName: app.globalData.dictName
                },
              });
            } else {
              db.collection("wordsInfo")
                .where({
                  _openid: app.globalData.openid,
                  word: ele,
                })
                .update({
                  data: {
                    wrongTime: word.wrongTime,
                    shareFlag: app.globalData.shareFlag,
                  },
                });
            }
          });
      });
    }
  },
  getBackgroundUrl: function () {
    let id = Math.ceil(Math.random() * 52);
    let fileID =
      "cloud://wechatmini1-itxje.7765-wechatmini1-itxje-1301317975/backImages/100" +
      id +
      ".jpg";
    let fileID2 =
      "cloud://wechatmini1-itxje.7765-wechatmini1-itxje-1301317975/backImages/100" +
      id +
      ".png";
    wx.cloud.downloadFile({
      fileID: fileID, // 文件 ID
      success: (res) => {
        // 返回临时文件路径
        this.setData({
          // background: `url(${res.tempFilePath})`,
          background: res.tempFilePath,
        });
      },
      fail: () => {
        wx.cloud.downloadFile({
          fileID: fileID2, // 文件 ID
          success: (res) => {
            // 返回临时文件路径
            this.setData({
              // background: `url(${res.tempFilePath})`,
              background: res.tempFilePath,
            });
          },
          fail: (res) => {
            console.log(fileID2);
            console.log(fileID);
            console.log("zhaobudaowenjian");
          },
        });
      },
    });
    return id;
    //  如果id是特殊的，且该用户没有拥有该卡片
  },
  checkSpecialCard: function (id) {
    let alreadyOwn = false;
    if (SPECAILBACKGROUNDS.indexOf(id) != -1) {
      let specialCards = this.data.specialCards;
      for (let i = 0; i < specialCards.length; i++) {
        //如果已经拥有里该卡片
        if (specialCards[i].bgId == id) {
          alreadyOwn = true;
          //次数小于3，自增
          this.ownedTime = formatDate();
          if (specialCards[i].times < 3) {
            specialCards[i].times++;
          } else {
            //大于等于3 返回false
            return false;
          }
        }
      }
      //判断用户是否拥有该卡片
      //没有
      const newSpecailCard = {
        bgId: id,
        times: 1,
        ownedTime: formatDate(),
      };
      if (alreadyOwn == false) {
        specialCards.push(newSpecailCard);
      }

      this.setData({
        showModal: true,
        flag: true,
        opacity: 0.75,
        specialCards: specialCards,
      });
      return true;
    }
    return false;
  },
  getReviewWords: function (
    memorylevel,
    TimeDiffercenH,
    TimeDiffercenM,
    TimeDiffercenS = 0
  ) {
    //单词的key
    const memory = this.getWordMermoryInfo();
    let reviewWords = this.data.reviewWords;

    let newReviewWords = memory.reduce((res, ele) => {
      let WordMemory = wx.getStorageSync(ele);
      if (
        WordMemory.memory < memorylevel &&
        this.gettimeDifference(WordMemory.date) >
        this.gettimeDifference(
          TimeDiffercenH,
          TimeDiffercenM,
          TimeDiffercenS
        ) &&
        res.findIndex((element) => element.word + "_" == ele) == -1
      ) {
        return [...res, WordMemory];
      } else {
        return [...res];
      }
    }, reviewWords);
    newReviewWords.sort(function () {
      return 0.5 - Math.random();
    });
    this.setData({
      reviewWords: newReviewWords,
    });
  },
  gettimeDifference(date1, TimeDiffercenM, TimeDiffercenS = 0) {
    if (typeof date1 == "number") {
      return (
        new Date(1970, 0, 0, date1, TimeDiffercenM, TimeDiffercenS).getTime() -
        new Date(1970, 0, 0, 0, 0, 0).getTime()
      );
    } else {
      return new Date().getTime() - new Date(date1).getTime();
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: "login",
      data: {},
      success: (res) => {
        console.log("[云函数] [login] user openid: ", res.result.openid);
        app.globalData.openid = res.result.openid;
      },
      fail: (err) => {
        console.error("[云函数] [login] 调用失败", err);
      },
    });
  },
  onGetOpenid_pro: function () {
    // 调用云函数
    return wx.cloud.callFunction({
      name: "login",
      data: {},
    });
  },
  getWordMemory: function (condition) {
    return db.collection("wordMemory").where(condition).get();
  },
  initStorage: async function () {
    let last_success_time = wx.getStorageSync("last_success_time");
    let openid_pro = await this.onGetOpenid_pro();
    app.globalData.openid = await openid_pro.result.openid;
    let condition = {
      _openid: app.globalData.openid,
    };
    console.log(last_success_time);
    let condition2 = {
      last_success_time: last_success_time,
      _openid: app.globalData.openid,
    };
    let wordMemory_pro = await this.getWordMemory(condition);
    let res = await wordMemory_pro.data;
    let wordMemory_time_id = await this.getWordMemory(condition2);
    let result = await wordMemory_time_id;

    //当时间不一致的时候，问题：云里面successtime更新到了明天但缓存里没有。
    if (last_success_time != "" && res.length != 0) {
      if (last_success_time == formatDateSim()) {
        console.log("at the same time");

        //如果是同一天的话，也要得到一些对应的量 如specialCards
        this.setInfoStorage("specialCards", result.data[0].specialCards);
        this.setInfoStorage("wordsLimit", result.data[0].wordsLimit);
        this.setInfoStorage("wordId", result.data[0].wordId);
        this.setInfoStorage("wordIdMAX", result.data[0].wordIdMAX);
      } else {
        console.log("not the same time");

        this.setInfoStorage("flag_onlyGetFromReview", false);
        console.log(result);
        this.setInfoStorage("specialCards", result.data[0].specialCards);
        this.setInfoStorage("wordsLimit", result.data[0].wordsLimit);
        this.setInfoStorage("wordIdMAX", result.data[0].wordIdMAX);
        console.log(result, 2);

        console.log("init get wordMemory", result);
        let wordsLimit = result.data[0].wordsLimit;
        console.log(Number(result.data[0].wordIdInit) + wordsLimit);
        if (result.data[0].flag_onlyGetFromReview == false) {
          this.setInfoStorage("init_wordId", Number(result.data[0].wordId));
          this.setInfoStorage("wordId", Number(result.data[0].wordId));
        } else {
          this.setInfoStorage(
            "init_wordId",
            Number(result.data[0].wordIdInit) + wordsLimit
          );
          this.setInfoStorage(
            "wordId",
            Number(result.data[0].wordIdInit) + wordsLimit
          );
        }
      }
    } else {
      this.initialization();
      //这个应该在背完一个单词后实现
    }
  },
  // syncStorage: function () {
  //   let last_success_time = wx.getStorageSync("last_success_time");
  //   if (last_success_time == "") {
  //     //如果当前这台机子没有背过单词
  //     //两种可能：1.从来没背过 2.从云端更新
  //   } else {
  //     //如果背过单词
  //     //1. 和云端比较 看哪个背的单词多，就用哪个
  //   }
  // },
  subscribeMessage: function () {
    let item = {
      thing1: {
        value: "根据记忆曲线20分钟复习，记单词更高效！",
      },
      date14: {
        value: formatDateSim(),
      },
    };
    wx.showModal({
      title: "太棒了",
      content: "你已经把单词完成了，可以选择30分钟后再回来,确定可以订阅消息哦",
      success(res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: [lessonTmplId],
            success: (res) => {
              if (res.errMsg === "requestSubscribeMessage:ok") {
                // 这里将订阅的课程信息调用云函数存入云开发数据
                wx.cloud
                  .callFunction({
                    name: "subscribe",
                    data: {
                      data: item,
                      templateId: lessonTmplId,
                    },
                  })
                  .then(() => {
                    wx.showToast({
                      title: "订阅成功",
                      icon: "success",
                      duration: 2000,
                    });
                  })
                  .catch(() => {
                    wx.showToast({
                      title: "订阅失败",
                      icon: "none",
                      duration: 2000,
                    });
                  });
              }
            },
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  touchStart: function (e) {
    touchBeginX = e.touches[0].clientX;
    time = e.timeStamp;
  },
  touchEnd: function (e) {
    var touchEndX = e.changedTouches[0].clientX;
    time = e.timeStamp - time;
    if (touchEndX - touchBeginX <= -40 && time < 1000) {
      console.log("下一页");
      wx.switchTab({
        url: URLSETTING,
      });
    }
  },
  onShareAppMessage: function () {},
  dlgCancel: function () {
    console.log(111);
    this.setData({
      showModal: false,
    });
    setTimeout(this.getNextWord_new, 500);
  },
  initialization: function () {
    this.setInfoStorage("init_wordId", 1);
    this.setInfoStorage("wordId", 1);
    this.setInfoStorage("flag_onlyGetFromReview", false);
    this.setInfoStorage("continuous_landing", 1);
    this.setInfoStorage("max_continuous_landing", 1);
    this.setInfoStorage("total_landing", 1);
    this.setInfoStorage("wordsLimit", WORDLIMIT);
    this.setInfoStorage("wordIdMAX", 1);
  },
});