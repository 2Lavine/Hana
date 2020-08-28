
module.exports = function () {
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
 
  //'yyyy-MM-dd hh:mm:ss'
  var curtime = curYear + '-' + curMonth + '-' + curDate;
  return curtime;
}