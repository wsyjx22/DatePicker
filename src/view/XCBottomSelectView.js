import React, {PureComponent} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import ProTypes from 'prop-types';
import XCButton from "./XCButton";
import ModalBox from "react-native-modalbox";
import DateListView from "./DateFlatList";

import {dayArray, hourArray, minuteArray, DATA_TYPE} from "../utils/DateUtils";
import {isIphoneX} from "../utils/DeviceUtils";

const {width, height} = Dimensions.get('window');
const closeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEUAAADa2trc3Nza2trb29vZ2dnR0dHa2tovp2deAAAACHRSTlMA/lf3Rx4L1vQG5/MAAACFSURBVCjPjZK7DYAwDEQRBb0DA4QRKBiAgglgADo2YH4sRfJDOhQlhZ34XqL40zWuYf+ezsvNPWYi/fK43SwRmm1ye5jlgMzW4hKQy3jUsgFiFxo8ElgoYEBgAYEFBBYQGBAYkIT0oj6vn9Cv1hLStLU4WkIttLYDj6qt1QH4HRMdprb1AtlWFNso/1PKAAAAAElFTkSuQmCC';
const LIST_HEIGHT = 250;

/**
 * 底部弹出单选新样式-控件
 */
export default class XCBottomSelectView extends PureComponent {

    // 组件参数
    static propTypes = {
        title: ProTypes.string, // 标题
        buttonText: ProTypes.string, // 按钮文案
        onClose: ProTypes.func, // 关闭
        data: ProTypes.array, // 数据
        onHandlerClick: ProTypes.func.isRequired, // 按钮处理事件

        selectIndex: ProTypes.number, // 默认选中日期索引
        selectHourIndex: ProTypes.number, // 默认选中小时索引
        selectMinuteIndex: ProTypes.number, // 默认选中分钟索引
        dateType: ProTypes.string,
    };

    // 默认参数值
    static defaultProps = {
        title: '请选择',
        buttonText: '确认',
        onClose: () => {
        },
        selectIndex: 0,
        selectHourIndex: 0,
        selectMinuteIndex: 0,
        dateType: DATA_TYPE.DATE_TIME, // 默认小时
    };

    // 构造函数
    constructor(props) {
        super(props);
        const {selectIndex = 0, selectHourIndex = 0, selectMinuteIndex = 0} = this.props;
        // 选中的日期数据
        this.selectDate = [];
        // 选中小时的数据
        this.selectHourData = [];
        // 选中分钟的数据
        this.selectMinuteData = [];
        // 最后选中的日期索引
        this.lastSelectDateIndex = selectIndex;
        // 最后选中的小时索引
        this.lastSelectHourIndex = selectHourIndex;
        // 最后选中的分钟索引
        this.lastSelectMinuteIndex = selectMinuteIndex;

        this.minuteListData = [];
        this.minuteFlex = 0.5;
        this.minuteWidth = width / 4;
        this.imageWidth = 80;
        if (this.props.dateType === DATA_TYPE.DATE_TIME) {
            // 默认格式，选择小时
            this.minuteListData = minuteArray;
        } else {
            // 选择上午，下午
            this.minuteFlex = 1;
            this.minuteListData = dayArray;
            this.minuteWidth = width / 2;
            this.imageWidth = 120;
        }
        this.state = {
            data: [], // 单选列表数据集
            initIndex: selectIndex, // 默认选中日期位置索引
            initHourIndex: selectHourIndex, // 默认选中小时位置索引
            initMinuteIndex: selectMinuteIndex, // 默认选中分钟位置索引
            dateType: this.props.dateType, // 选择时间样式，小时或者天
            listKey: 0,
        }
    }

    // 绘制
    render() {
        const {title = '请选择'} = this.props;
        return (
            <ModalBox
                ref={ref => this.modelBoxRef = ref}
                backdropOpacity={0.5}
                position={'bottom'}
                swipeToClose={false}
                style={styles.container}
            >
                <View style={{flex: 1}}>
                    <Text style={styles.titleTextStyle}>{title}</Text>
                    <XCButton style={styles.closeViewStyle} onPress={() => {
                        this.close()
                    }}>
                        <Image style={styles.closeImageStyle} source={{uri: closeImage}}/>
                    </XCButton>
                    {this._renderContent()}
                    {this._renderBottomBtn()}
                </View>
            </ModalBox>

        )
    }

    _renderContent() {
        const {dateType = DATA_TYPE.DATE_TIME} = this.state;
        return (
            <View style={{height: LIST_HEIGHT, flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                {this._renderDateListNew()}
                {dateType === DATA_TYPE.DATE_TIME ? this._renderHourListNew() : null}
                {dateType === DATA_TYPE.DATE ? null : this._renderMinuteListNew()}
            </View>
        );
    }

    _renderDateListNew() {
        const {dateType = DATA_TYPE.DATE_TIME, data = [], initIndex} = this.state;
        let imageViewWidth = dateType === DATA_TYPE.DATE ? width : width / 2;
        return (
            <DateListView
                data={data}
                initIndex={initIndex}
                style={{
                    viewFlex: 1, imageWidth: 120, imageViewWidth: imageViewWidth,
                }}
                onDataSelected={(data, index) => {
                    this.lastSelectDateIndex = index;
                    this.selectDate = data;
                }}
            />
        )
    }

    _renderHourListNew() {
        const {dateType = DATA_TYPE.DATE_TIME, initHourIndex} = this.state;
        let imageViewWidth = dateType === DATA_TYPE.DATE ? width : width / 4;
        let viewFlex = dateType === DATA_TYPE.DATE_TIME ? 0.5 : 1;
        let imageWidth = dateType === DATA_TYPE.DATE_TIME ? 60 : 120;
        return (
            <DateListView
                data={hourArray}
                initIndex={initHourIndex}
                style={{
                    viewFlex: viewFlex, imageWidth: imageWidth, imageViewWidth: imageViewWidth,
                }}
                onDataSelected={(data, index) => {
                    this.lastSelectHourIndex = index;
                    this.selectHourData = data;
                }}
            />
        )
    }

    _renderMinuteListNew() {
        const {dateType = DATA_TYPE.DATE_TIME, initMinuteIndex} = this.state;
        let viewFlex = 1;
        let imageViewWidth = width / 2;
        let imageWidth = 120;
        if (dateType === DATA_TYPE.DATE_TIME) {
            imageViewWidth = width / 4;
            viewFlex = 0.5;
            imageWidth = 60;
        }
        return (
            <DateListView
                data={this.minuteListData}
                initIndex={initMinuteIndex}
                style={{
                    viewFlex: viewFlex, imageWidth: imageWidth, imageViewWidth: imageViewWidth,
                }}
                onDataSelected={(data, index) => {
                    this.lastSelectMinuteIndex = index;
                    this.selectMinuteData = data;
                }}
            />
        )
    }

    /**
     * 底部按钮
     * @private
     */
    _renderBottomBtn = () => {
        const {
            onHandlerClick = () => {
            }, buttonText = '确认'
        } = this.props;
        return (
            <XCButton style={styles.buttonViewStyle} onPress={() => {
                this.close();
                let data = {
                    selectDate: this.selectDate,
                    selectHourData: this.selectHourData,
                    selectMinuteData: this.selectMinuteData,
                }
                let indexMap = {
                    dateIndex: this.lastSelectDateIndex,
                    hourIndex: this.lastSelectHourIndex,
                    minuteIndex: this.lastSelectMinuteIndex,
                }
                onHandlerClick(data, indexMap);
            }}>
                <Text style={styles.buttonTextStyle}>{buttonText}</Text>
            </XCButton>
        )
    }

    /**
     * 开启弹框
     */
    open = (dateType = DATA_TYPE.DATE_TIME, data = [], dateIndex = 0, hourIndex = 0, minuteIndex = 0) => {
        this.selectDate = data[dateIndex];
        this.selectHourData = hourArray[hourIndex];
        this.changeProps(dateType);
        this.selectMinuteData = this.minuteListData[minuteIndex];
        this.setState({
            dateType: dateType,
            data: data,
            initIndex: dateIndex,
            initHourIndex: hourIndex,
            initMinuteIndex: minuteIndex,
        }, () => {
            this.modelBoxRef.open()
        })
    }

    /**
     * 修改组件属性
     * @param dateType
     */
    changeProps(dateType = DATA_TYPE.DATE_TIME) {
        if (dateType === DATA_TYPE.DATE_TIME) {
            // 默认格式，选择小时
            this.minuteListData = minuteArray;
            this.minuteFlex = 0.5;
            this.minuteWidth = width / 4;
            this.imageWidth = 60;
        } else {
            // 选择上午，下午
            this.minuteFlex = 1;
            this.minuteListData = dayArray;
            this.minuteWidth = width / 2;
            this.imageWidth = 120;
        }
    }

    /**
     * 关闭弹框，重置数据
     */
    close = () => {
        this.modelBoxRef.close()
    }

}

// 样式
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopStartRadius: 16,
        borderTopEndRadius: 16,
        height: isIphoneX() ? 386 : 342
    },
    titleTextStyle: {
        fontSize: 20,
        color: '#333',
        marginTop: 19,
        width: width,
        textAlign: 'center'
    },
    closeViewStyle: {
        position: 'absolute',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        top: 13,
        right: 4
    },
    closeImageStyle: {
        height: 18,
        width: 18
    },
    buttonViewStyle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#24C27D',
        height: 50,
        marginBottom: isIphoneX() ? 50 : 16,
        width: width - 16 * 2,
        left: 16,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle: {
        fontSize: 18,
        color: '#fff'
    }
});
