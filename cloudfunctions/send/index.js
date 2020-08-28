// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "wechatmini1-itxje"
})
const _ = db.command;

getTimeDifference = function (date1, TimeDiffercenM, TimeDiffercenS = 0) {
  if (typeof date1 == "number") {
    return (
      new Date(1970, 0, 0, date1, TimeDiffercenM, TimeDiffercenS).getTime() -
      new Date(1970, 0, 0, 0, 0, 0).getTime()
    );
  } else {
    return new Date().getTime() - new Date(date1).getTime();
  }
};
date = function () {
  var date = new Date();
  var curYear = date.getFullYear();
  var curMonth = date.getMonth() + 1;
  var curDate = date.getDate();
  var curSeconds = date.getSeconds();
  var curMinutes = date.getMinutes();
  var curHours = date.getHours();
  if (curMonth < 10) {
    curMonth = '0' + curMonth;
  }
  if (curDate < 10) {
    curDate = '0' + curDate;
  }
  if (curHours < 10) {
    curHours = '0' + curHours;
  }
  if (curMinutes < 10) {
    curMinutes = '0' + curMinutes;
  }
  if (curSeconds < 10) {
    curSeconds = '0' + curSeconds;
  }

  //'yyyy-MM-dd hh:mm:ss'
  var curtime = curYear + '-' + curMonth + '-' + curDate + 'T' + curHours + ':' + curMinutes + ':' + curSeconds;
  return curtime;
}


exports.main = async (event, context) => {
  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        //20分钟前的时间
        successTime: _.lt(Date.now()),
        done: false,
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};