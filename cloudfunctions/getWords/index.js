// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "wechatmini1-itxje"
})
// 云函数入口函数
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = Number(event.countResult);
  const wordInitId = Number(event.wordInitId);
  const dictName = event.dictName;
  const MAX_LIMIT = 100;
  const tasks = []
  const promise = db.collection(dictName).skip(wordInitId).limit(countResult).get()
  tasks.push(promise)
  
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}