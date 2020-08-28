// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "wechatmini1-itxje"
})
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      OPENID
    } = cloud.getWXContext();
    // 在云开发数据库中存储用户订阅的课程
    const result = await db.collection('messages').add({
      data: {
        touser: OPENID, // 订阅者的openid
        page: 'pages/index/index', // 订阅消息卡片点击后会打开小程序的哪个页面
        data: event.data, // 订阅消息的数据
        templateId: event.templateId, // 订阅消息模板ID
        done: false, // 消息发送状态设置为 false
        successTime: Date.now(),
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};