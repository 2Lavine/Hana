Page({
  data: {
    keyboardword: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
    ],
    word: "",
  },
  inputchanging: function (e) {
    if (typeof this.word != "undefined")
      this.word = this.word + e.target.dataset.id;
    else {
      this.word = e.target.dataset.id;
    }
    this.setData({
      word: this.word,
    });
  },
});
