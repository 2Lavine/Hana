Page({
  data: {
    tagNames: ["对比", "词根", "对比", "词根"],
    chosedTag: [],
    inputTips: [
      "333333333333333333333333333333333333333333333333333333333333333",
    ],
    textareaContent: "",
  },
  onLoad: function (options) {
    if (options.hasOwnProperty("word")) {
      let word = options["word"];
      if (word) {
        this.setData({
          word: word,
        });
      }
      console.log("!current word!", word);
    } else {
      console.log("null input");
    }
  },
  getTag: function (e) {
    const index = e.detail.value;
    const tagName = this.data.tagNames[index];
    this.data.chosedTag.push(tagName);
    this.setData({
      chosedTag: this.data.chosedTag,
    });
  },
  show: function (e) {
    console.log(e);
    const chosedTag = this.data.chosedTag;
    this.data.inputTips[chosedTag.length - 1] = e.detail.value.textarea;
    this.setData({
      inputTips: this.data.inputTips,
    });
  },
  deleteTip: function (e) {
    console.log(e);

    const index = e.currentTarget.dataset.id;
    console.log(index);
    this.data.chosedTag.splice(index, 1);
    this.data.inputTips.splice(index, 1);
    this.setData({
      chosedTag: this.data.chosedTag,
      inputTips: this.data.inputTips,
      textareaContent: "",
    });
  },
  reset:function(){
    this.setData({
      chosedTag: [],
      inputTips: [],
      textareaContent: "",
    });
  }
});
