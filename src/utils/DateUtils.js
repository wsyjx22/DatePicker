import moment from "moment";

export function getCurrentDate(format = 'YYYYMMDDHHmmss') {
    return moment().format(format);
}

/**
 * 时间转换，RN Date 不支持字符串 直接转化成 对应的时间
 * @param date
 * @returns {null|Date}
 */
export function parseDate(date) {
    // 2021-07-01 15:48:05
    try {
        let time = date.split(' ');
        let head = time[0].split('-');
        let end = time[1].split(':');
        return new Date(head[0], head[1] - 1, head[2], end[0], end[1], end[2]);
    } catch (e) {
        return null;
    }
}

/**
 * 对照周文案
 * @type {string[]}
 */
export const weekArray = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

/**
 * 小时
 * @type {[{id: number, title: string}]}
 */
export const hourArray = [
    {title: '00', id: 'hour_0'},
    {title: '01', id: 'hour_1'},
    {title: '02', id: 'hour_2'},
    {title: '03', id: 'hour_3'},
    {title: '04', id: 'hour_4'},
    {title: '05', id: 'hour_5'},
    {title: '06', id: 'hour_6'},
    {title: '07', id: 'hour_7'},
    {title: '08', id: 'hour_8'},
    {title: '09', id: 'hour_9'},
    {title: '10', id: 'hour_10'},
    {title: '11', id: 'hour_11'},
    {title: '12', id: 'hour_12'},
    {title: '13', id: 'hour_13'},
    {title: '14', id: 'hour_14'},
    {title: '15', id: 'hour_15'},
    {title: '16', id: 'hour_16'},
    {title: '17', id: 'hour_17'},
    {title: '18', id: 'hour_18'},
    {title: '19', id: 'hour_19'},
    {title: '20', id: 'hour_20'},
    {title: '21', id: 'hour_21'},
    {title: '22', id: 'hour_22'},
    {title: '23', id: 'hour_23'},
];

/**
 * 分
 * @type {[{id: number, title: string}]}
 */
export const minuteArray = [{title: '00', id: 'minute_0'}, {title: '30', id: 'minute_30'}];

/**
 * 天-时段 上午，下午
 * @type {[{id: string, title: string}]}
 */
export const dayArray = [{title: '上午', id: 'day_0'}, {title: '下午', id: 'day_1'},];


/**
 * 申请请假 选择时间 格式 dateTime 为小时，date 为 上午下午
 * @type {{}}
 */
export const DATA_TYPE = {
    DATE: 'date', // 只有日期
    DATE_TIME: 'dateTime', // 年月日时分
    DATE_DAY: 'dateDay', // 年月日 上午下午
}

/**
 * 返回指定时间 格式化 本年 M月D日周几，跨年 YYYY年M月D日周几
 * @param nowMoment 今年
 * @param giveDateMoment 指定日期
 */
export const getGiveDateWithWeek = (nowMoment, giveDateMoment) => {
    // 是否跨年
    let isSameYear = giveDateMoment.isSame(nowMoment, 'year');
    let formatStr = isSameYear ? 'M月D日' : 'YYYY年M月D日';
    let tempDateStr = giveDateMoment.format(formatStr);
    let nowWeek = weekArray[giveDateMoment.weekday()];
    return {date: tempDateStr, dateWeek: `${tempDateStr}${nowWeek}`, fontSize: isSameYear ? 17 : 12};
}

/**
 * 获取请假时间 本年 MM月DD日周几，跨年 YYYY年MM月DD日周几
 * @param minDate
 * @param maxDate
 */
export const getAssForLeaveDate = (minDate = '20221114', maxDate = '20250513') => {
    // 当天
    let now = moment();
    // 开始日期
    let start = moment(minDate);
    // 开始时间到今天间隔多少天
    let index = moment().diff(start, 'days');
    let hour = moment().hour()
    // 开始时间到截止时间间隔多长
    let diffCount = moment(maxDate).diff(moment(minDate), 'days');
    // 总时间条数
    let array = [];
    for (let i = 0; i < diffCount; i++) {
        let start = moment(minDate);
        let tempDate = start.add(i, 'days');
        let temp = '';
        if (i !== 0) {
            temp = getGiveDateWithWeek(now, tempDate);
        } else {
            temp = getGiveDateWithWeek(now, start);
        }
        const {date = '', dateWeek = '', fontSize = 17} = temp;
        array.push({title: dateWeek, value: date, id: i, fontSize: fontSize})
    }
    return {dateIndex: index, hourIndex: hour, data: array}
}
