// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'wechatmini1-itxje'
});
const $ = db.command.aggregate
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const dictName = event.dictName;
  let resultData;
  await db.collection('wordsInfo')
    .aggregate()
    .match({
      _openid: wxContext.OPENID,
      dictName: dictName
    })
    .group({
      _id: '$wordId',
      wrongTime: $.sum('$wrongTime')
    })
    .sort({
      wrongTime: -1
    })
    .lookup({
      from: dictName,
      localField: '_id',
      foreignField: 'id',
      as: 'wordInfo',
    })
    .end().then(res => {
      console.log(res, "second");
      let wordsList = res.list;
      let new_wordsList = [];
      for (let i = 0; i < wordsList.length; i++) {
        let wordInfo = wordsList[i].wordInfo[0];
        let ele = wordsList[i];

        let a = {
          word: wordInfo.word,
          sound: wordInfo.sound,
          tips: [{
              tipsName: "错误次数",
              tipsInfo: ele.wrongTime,
            },
            {
              tipsName: "解释",
              tipsInfo: wordInfo.explain,
            },
          ]
        }
        new_wordsList.push(a);
        console.log(a);

      }
      console.log(new_wordsList, "newscone");
      let PAGEALLCOUNT = Math.ceil(new_wordsList.length / 3);
      console.log(PAGEALLCOUNT);
      resultData = {
        PAGEALLCOUNT: PAGEALLCOUNT,
        choosedusrTips: new_wordsList,
        usrTips: new_wordsList.slice(0, 3)
      }
      console.log(resultData, "xsxsxsxsx");

    })

  return resultData;
}