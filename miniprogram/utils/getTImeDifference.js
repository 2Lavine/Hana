module.exports = function (date1, TimeDiffercenM, TimeDiffercenS = 0) {
  if (typeof date1 == "number") {
    return (
      new Date(1970, 0, 0, date1, TimeDiffercenM, TimeDiffercenS).getTime() -
      new Date(1970, 0, 0, 0, 0, 0).getTime()
    );
  } else {
    return new Date().getTime() - new Date(date1).getTime();
  }
}