import moment from "moment";
import momentTimeZone from "moment-timezone";
import { Alert } from "react-native";

export const getTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getTodayTimeZone = (zone) => {
  const today = momentTimeZone.tz(zone).format("x");
  return today;
};

const getTimeUnixByDay = (time, zone) => {
  const today = momentTimeZone.tz(zone).format("YYYY-MM-DD");
  const todayWithTime = momentTimeZone.tz(`${today} ${time}`, zone).format("x");
  return todayWithTime;
};

const test = (time, zone) => {
  const today = momentTimeZone.tz(zone).format("YYYY-MM-DD");
  const todayWithTime = momentTimeZone.tz(`${today} ${time}`, zone).format("x");
  Alert.alert(todayWithTime + "abc");
};

const compareDate = (time1, time2, zone) => {
  const today2359 = getTimeUnixByDay("23:59:59", zone);
  const date1 = getTimeUnixByDay(time1, zone);
  const date2 = getTimeUnixByDay(time2, zone);

  if (date2 < date1 && date1 < today2359) {
    const nextDay = momentTimeZone.tz(zone).add(1, "day").format("YYYY-MM-DD");
    const date3 = momentTimeZone.tz(`${nextDay} ${time2}`, zone).format("x");


    // const testTodayTimezone = moment.tz('2020-08-26 00:30:00', zone).format('x'); // new Date('Aug 25, 2020 00:30:00 GMT+03:00').getTime()
    // console.log(nextDay);
    // console.log('Date3 is', date3);
    // console.log('Date1 is', date1);
    // console.log('Today is ', testTodayTimezone);

    // console.log(date1 < testTodayTimezone && testTodayTimezone < date3);
    // return date1 < testTodayTimezone && testTodayTimezone < date3;
    return date1 < getTodayTimeZone(zone) && getTodayTimeZone(zone) < date3;
  }
  return date1 < getTodayTimeZone(zone) && getTodayTimeZone(zone) < date2;
};

const getBusinessStatus = (data, zone) => {
  if (!data) return false;
  const today = momentTimeZone.tz(moment(), zone).format("dddd");
  const nowUnix = getTodayTimeZone(zone);
  // const nowUnix = getTimeUnixByDay("01:00:00", zone);  //1597872600000 =>  new Date('Aug 20, 2020 00:30:00 GMT+03:00').getTime()
  // console.log(zone);
  // console.log(nowUnix);

  const now7h = getTimeUnixByDay("07:00:00", zone);
  const now0h = getTimeUnixByDay("00:00:00", zone);
  return data.reduce((isOpen, item, index) => {
    let compareDay;
    console.log(now0h < nowUnix && nowUnix < now7h);
    if (now0h < nowUnix && nowUnix < now7h) {
      compareDay = momentTimeZone.tz(zone).subtract(1, "day").format("dddd");
    } else {
      compareDay = today;
    }
    if (item.dayOfWeek.toLowerCase() === compareDay.toLowerCase()) {
      // console.log(item.dayOfWeek.toLowerCase(), item);
      if (item.isOpen === "yes") {
        if (
          item.secondOpenHour === null ||
          (getTimeUnixByDay(item.firstOpenHour, zone) < nowUnix &&
            nowUnix < getTimeUnixByDay(item.firstCloseHour, zone))
        ) {
          if ((item.firstOpenHour === item.firstCloseHour) === "24:00:00") {
            return (isOpen = true);
          }
          return (isOpen = compareDate(
            item.firstOpenHour,
            item.firstCloseHour,
            zone
          ));
        }

        return (isOpen = compareDate(
          item.secondOpenHour,
          item.secondCloseHour,
          zone
        ));
        if (item.firstOpenHour === null && item.secondOpenHour === null) {
          return (isOpen = false);
        }
      } else {
        return (isOpen = "day_off");
      }
    } else {
      return isOpen;
    }
  }, false);
};

const getBusinessDay = (item, zone) => {
  const today = momentTimeZone.tz(moment(), zone).format("dddd");
  const nowUnix = getTodayTimeZone(zone);
  const now7h = getTimeUnixByDay("07:00:00", zone);
  const now0h = getTimeUnixByDay("00:00:00", zone);
  let compareDay;
  let isOpen = false;
  if (now0h < nowUnix && nowUnix < now7h) {
    compareDay = momentTimeZone
      .tz(moment().subtract(1, "day"), zone)
      .format("dddd");
  } else {
    compareDay = today;
  }
  if (item.dayOfWeek.toLowerCase() === compareDay.toLowerCase()) {
    if (item.isOpen === "yes") {
      if (
        item.secondOpenHour === null ||
        (getTimeUnixByDay(item.firstOpenHour, zone) < nowUnix &&
          nowUnix < getTimeUnixByDay(item.firstCloseHour, zone))
      ) {
        if ((item.firstOpenHour === item.firstCloseHour) === "24:00:00") {
          return (isOpen = true);
        }
        return (isOpen = compareDate(
          item.firstOpenHour,
          item.firstCloseHour,
          zone
        ));
      }

      return (isOpen = compareDate(
        item.secondOpenHour,
        item.secondCloseHour,
        zone
      ));
      if (item.firstOpenHour === null && item.secondOpenHour === null) {
        return (isOpen = false);
      }
    } else {
      return (isOpen = "day_off");
    }
  } else {
    return (isOpen = "day_off");
  }
};

export { getBusinessStatus, getBusinessDay };
