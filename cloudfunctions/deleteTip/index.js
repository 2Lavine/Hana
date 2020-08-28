// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database({
  env: "wechatmini1-itxje"
})
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let id = event.id
  try {
    // 这里要写 return await。之前只是写了个await
    return await db.collection("userTips").where({
      id: id
    }).remove().then(res => {
      console.log(res);
    }).catch(res => console.log(res))
  } catch (err) {
    console.log(err)
  } finally {}
}