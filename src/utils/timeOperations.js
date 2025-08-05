import moment from "moment";
import { getActivityDetail } from "../services/reportServices/activityDetailService";
import { getActivitySummary } from "../services/reportServices/activitySummaryService";

export function dateAdd(date, interval, units) {
    if(!(date instanceof Date))
      return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(String(interval).toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return ret;
  }

export const getActivityDetailReport = (changedDateButton,selectedId,selectedPlate,distanceOfBeginDay,distanceOfEndDay) => {
    let repStartDate = new Date();
    let repEndDate = new Date();
    switch (changedDateButton) {
      case (2):
      repStartDate = dateAdd(repStartDate,'day',-1).setHours(0,0,0);
      repEndDate = dateAdd(repEndDate,'day',-1).setHours(23,59,59);
      console.log('2');
        break;
      case (3):
        let unit = repStartDate.getDay();
        repStartDate = dateAdd(repStartDate,'day',1-unit).setHours(0,0);
        break;
      case (4):
        repStartDate = distanceOfBeginDay;
        repEndDate = distanceOfEndDay;
        break;
      default:
        repStartDate.setHours(0,0,0);
        repEndDate.setHours(23,59,59);
        console.log('1');
        break;
    }
    getActivityDetail({
      beginDay: moment(repStartDate).format('MM/DD/YYYY'),
      endDay: moment(repEndDate).format('MM/DD/YYYY'),
      beginTime: moment(repStartDate).format('HH:mm'),
      endTime: moment(repEndDate).format('HH:mm'),
      selectedId: selectedId,
      plate: selectedPlate
    });
  };


export const getActivitySummaryReport = (changedDateButton,selectedId,selectedPlate,distanceOfBeginDay,distanceOfEndDay) => {
  let repStartDate = new Date();
  let repEndDate = new Date();
  switch (changedDateButton) {
    case (2):
    repStartDate = dateAdd(repStartDate,'day',-1).setHours(0,0,0);
    console.log('2');
      break;
    case (3):
      let unit = repStartDate.getDay();
      repStartDate = dateAdd(repStartDate,'day',1-unit).setHours(0,0);
      break;
    case (4):
      repStartDate = distanceOfBeginDay;
      repEndDate = distanceOfEndDay;
      break;
    default:
      repStartDate.setHours(0,0,0);
      repEndDate.setHours(23,59,59);
      console.log('1');
      break;
  }
  getActivitySummary({
    beginDay: moment(repStartDate).format('MM/DD/YYYY'),
    endDay: moment(repEndDate).format('MM/DD/YYYY'),
    beginTime: moment(repStartDate).format('HH:mm'),
    endTime: moment(repEndDate).format('HH:mm'),
    selectedId: selectedId,
    plate: selectedPlate
  });
};