import React, {PureComponent} from "react";
import {NativeModules, StyleSheet, Text} from "react-native";
import XCPageView from "./view/XCPageView";
import XCButton from "./view/XCButton";
import {DATA_TYPE, getAssForLeaveDate} from "./utils/DateUtils";
import XCBottomDateSelectView from "./view/XCBottomSelectView";
import moment from "moment";

/**
 * 底部弹出时间选择
 */
export default class Demo extends PureComponent {

    constructor(props) {
        super(props);
        this.minDate = moment().subtract(1, 'y').startOf('year').format('yyyyMMDD');
        this.maxDate = moment().add(1, 'y').endOf('year').format('yyyyMMDD');
        console.log(this.minDate, '===>1')
        console.log(this.maxDate, '===>2')
        const {dateIndex, hourIndex, data} = getAssForLeaveDate(this.minDate, this.maxDate);
        console.log(dateIndex, '===>')
        this.state = {
            dateIndex: dateIndex,
            hourIndex: hourIndex,
            minuteIndex: 0,
            data: data,
            result: '',
        }
    }

    componentDidMount() {
        if (NativeModules.JXTTitleBarControl) {
            NativeModules.JXTTitleBarControl.hide();
        }
    }

    render() {
        const {result = '', dateIndex = 0, hourIndex = 0, minuteIndex = 0, data = []} = this.state;
        return (
            <XCPageView>
                <XCButton style={styles.btnStyle} onPress={() => {
                    this.selectedCarTypeRef.open(DATA_TYPE.DATE, data, dateIndex, hourIndex, minuteIndex)
                }}>
                    <Text style={{color: '#fff'}}>选择时间</Text>
                </XCButton>
                <Text style={{
                    fontSize: 18,
                    color: '#333',
                    flex: 1,
                    height: 25,
                    textAlign: 'center',
                    marginTop: 20
                }}>{result}</Text>
                {this._renderBottomView()}
            </XCPageView>

        )
    }

    /**
     * 选择时间
     * @returns {Element}
     * @private
     */
    _renderBottomView = () => {
        return (
            <XCBottomDateSelectView ref={ref => this.selectedCarTypeRef = ref}
                                    title={'请选择日期'}
                                    buttonText={'确定'}
                                    onHandlerClick={(data = {}, indexMap = {}) => {
                                        const {
                                            selectDate = {},
                                            selectHourData = {},
                                            selectMinuteData = {},
                                        } = data;
                                        const {
                                            dateIndex = 0,
                                            hourIndex = 0,
                                            minuteIndex = 0,
                                        } = indexMap;
                                        const {value = ''} = selectDate;
                                        const {title: hourStr = ''} = selectHourData;
                                        const {title: minuteStr = ''} = selectMinuteData;
                                        // alert(`${value}, ${title}, ${hourStr}, ${minuteStr}`);
                                        let temp = `${value} ${hourStr}:${minuteStr}`;
                                        let selectIndex = moment(value, 'M月DD日').diff(this.minDate, 'days');
                                        // alert(selectIndex)
                                        let startTime = moment(temp, 'M月DD日 HH:mm').format('YYYY-MM-DD HH:mm')
                                        // alert(startTime)
                                        this.setState({
                                            result: `选择时间结果为：${value} ${hourStr}:${minuteStr}`,
                                            dateIndex: dateIndex,
                                            hourIndex: hourIndex,
                                            minuteIndex: minuteIndex,
                                        })
                                    }}/>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    btnStyle: {
        width: 200,
        height: 44,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 10,
    }
});
