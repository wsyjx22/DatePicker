import React, {PureComponent} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import ProTypes from 'prop-types';
import XCButton from "./XCButton";
import ModalBox from "react-native-modalbox";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
// import DateListView from "./DateListView";
import DateListView from "./DateFlatList";

import {dayArray, hourArray, minuteArray, DATA_TYPE} from "../utils/DateUtils";
import {isIos, isIphoneX} from "../utils/DeviceUtils";

const {width, height} = Dimensions.get('window');
const closeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEUAAADa2trc3Nza2trb29vZ2dnR0dHa2tovp2deAAAACHRSTlMA/lf3Rx4L1vQG5/MAAACFSURBVCjPjZK7DYAwDEQRBb0DA4QRKBiAgglgADo2YH4sRfJDOhQlhZ34XqL40zWuYf+ezsvNPWYi/fK43SwRmm1ye5jlgMzW4hKQy3jUsgFiFxo8ElgoYEBgAYEFBBYQGBAYkIT0oj6vn9Cv1hLStLU4WkIttLYDj6qt1QH4HRMdprb1AtlWFNso/1PKAAAAAElFTkSuQmCC';
const splitImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAECAMAAACHiEKvAAAAolBMVEUjwn0jwn0Xvmgjwnwjwnwiwnwjwn0jwn0jwn0iwnwfw3sjwnwjwn0jwn0jwn0jwnwjwn0jwn0jw30gwXsjwn0jw30jwn0iwXwcv3Iiwn0jwn0jwnwjwnwjwnwjwn0jwnwjwn0jwn0kwn0jwn0jwn0jwnwjwn0iwn0jwn0jwnwiwn0hwXsiwHkhwXsgwnsjwn0iwn0jwn0hwnwkw30kwn0AAADMb4tdAAAANnRSTlNPSQXx9jHn3Ik9EPzXyMSYk3JVFeKdhEMKK6J70s68t7Ovq6eOdm1nYl5aJyMeGn856zXAagC/KqgEAAABBklEQVQoz7XS12rDQBQEUFmr1Wo36r333ov9/7+WDQERCAnYyPflvs5hhnmwLOu6hBDDmOdpGsdh8DwI4b6uGGPHud1uDMPoet93Xds2zb2uNa2qgmBZbNsWhLJUVUVRLMv3iyLPsyxNkySOD1mWJSmKwlAUEUKmyfP8tgHAcdzH19EPANg2njdNEyFRFMMwiiRJkuXjiOMkSdMsy/Oi8H3fshRFVdWyFATBtpclCKpK07S6vjdN23Zd3+u6TkPSqI7jYLyu+w6h53nDMI7TNM+GYRDiui6lPv4G79eDwU8wOMHof7D1Ghg+C17fBf7d8JVgfDZ8MZiKqfflSZ/eE/zuhsk3+BOiAVj+5fZYNwAAAABJRU5ErkJggg==';
const ITEM_HEIGHT = 50;
const LIST_HEIGHT = 250;
const black = '#333';
const gray = '#999';

/**
 * 底部弹出单选新样式-控件 (RecyclerListView， IOS onMomentumScrollEnd 回调有些问题)
 */
export default class XCBottomDateSelectView extends PureComponent {

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

        this.dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this.hourDataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this.minuteDataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this._layoutProvider = new LayoutProvider(
            index => {
                return 0;
            },
            (type, dim, index) => {
                let temp = this.state.data[index];
                const {type: dataType = 2} = temp;
                if (dataType === 1) {
                    dim.width = width;
                    dim.height = 100;
                } else if (dataType === 2) {
                    dim.width = width;
                    dim.height = ITEM_HEIGHT;
                }
            }
        );

        this._hourLayoutProvider = new LayoutProvider(
            index => {
                return 0;
            },
            (type, dim, index) => {
                let temp = hourArray[index];
                const {type: dataType = 2} = temp;
                if (dataType === 1) {
                    dim.width = width;
                    dim.height = 100;
                } else if (dataType === 2) {
                    dim.width = width;
                    dim.height = ITEM_HEIGHT;
                }
            }
        );

        this._minuteLayoutProvider = new LayoutProvider(
            index => {
                return 0;
            },
            (type, dim, index) => {
                let temp = this.minuteListData[index];
                const {type: dataType = 2} = temp;
                if (dataType === 1) {
                    dim.width = width;
                    dim.height = 100;
                } else if (dataType === 2) {
                    dim.width = width;
                    dim.height = ITEM_HEIGHT;
                }
            }
        );

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
                {/*{this._renderDateList()}*/}
                {/*{dateType === DATA_TYPE.DATE_TIME ? this._renderHourList() : null}*/}
                {/*{dateType === DATA_TYPE.DATE ? null : this._renderMinuteList()} */}

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
        let imageWidth = dateType === DATA_TYPE.DATE_TIME ? 80 : 120;
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
            imageWidth = 80;
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

    _renderDateList() {
        const {data = [], initIndex = 0} = this.state;
        return (
            <View style={{flex: 1}}>
                <RecyclerListView
                    ref={ref => this.recyclerListView = ref}
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    rowRenderer={this._rowRenderer}
                    initialRenderIndex={initIndex}
                    dataProvider={this.dataProvider.cloneWithRows(data)}
                    layoutProvider={this._layoutProvider}
                    scrollViewProps={{
                        onScrollEndDrag: (event) => {
                            if (isIos) {
                                const {nativeEvent = {}} = event;
                                const {contentOffset = {}, velocity = {}} = nativeEvent;
                                const {y = 0} = contentOffset;
                                const {y: velocityY = 0} = velocity;
                                if (velocityY === 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectDateIndex = selectIndex;
                                    this.selectDate = data[selectIndex];
                                    this.setState({
                                        initIndex: this.lastSelectDateIndex,
                                    });
                                    this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                        },
                        onMomentumScrollEnd: (event) => {
                            // 在 ios 上缓慢滚动时，onMomentumScrollEnd 不起作用
                            const {nativeEvent = {}} = event;
                            const {contentOffset = {}, velocity = {}} = nativeEvent;
                            const {y = 0} = contentOffset;
                            const {y: velocityY = 0} = velocity;
                            if (isIos) {
                                if (velocityY > 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectDateIndex = selectIndex;
                                    this.selectDate = data[selectIndex];
                                    this.setState({
                                        initIndex: this.lastSelectDateIndex,
                                    });
                                    this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                            let selectIndex = Math.round(y / ITEM_HEIGHT);
                            this.lastSelectDateIndex = selectIndex;
                            this.selectDate = data[selectIndex];
                            this.setState({
                                initIndex: this.lastSelectDateIndex,
                            });
                            this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                        },

                    }}
                />
                <View pointerEvents={'none'} style={{
                    position: 'absolute',
                    width: width / 2,
                    height: 50,
                    top: 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}>
                    <Image style={styles.splitImageViewStyle} source={{uri: splitImage}}/>
                    <Image style={styles.splitImageViewStyle} source={{uri: splitImage}}/>
                </View>
            </View>
        )
    }

    _renderHourList() {
        const {initHourIndex = 0} = this.state;
        return (
            <View style={{flex: 0.5}}>
                <RecyclerListView
                    ref={ref => this.hourList = ref}
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    rowRenderer={this._renderHourItem}
                    initialRenderIndex={initHourIndex}
                    dataProvider={this.hourDataProvider.cloneWithRows(hourArray)}
                    layoutProvider={this._hourLayoutProvider}
                    scrollViewProps={{
                        onScrollEndDrag: (event) => {
                            if (isIos) {
                                const {nativeEvent = {}} = event;
                                const {contentOffset = {}, velocity = {}} = nativeEvent;
                                const {y = 0} = contentOffset;
                                const {y: velocityY = 0} = velocity;
                                if (velocityY === 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectHourIndex = selectIndex;
                                    this.selectHourData = hourArray[selectIndex];
                                    this.setState({
                                        initHourIndex: this.lastSelectHourIndex,
                                    });
                                    this.hourList.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                        },
                        onMomentumScrollEnd: (event) => {
                            // 在 ios 上缓慢滚动时，onMomentumScrollEnd 不起作用
                            const {nativeEvent = {}} = event;
                            const {contentOffset = {}, velocity = {}} = nativeEvent;
                            const {y = 0} = contentOffset;
                            const {y: velocityY = 0} = velocity;
                            if (isIos) {
                                if (velocityY > 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectDateIndex = selectIndex;
                                    this.selectDate = hourArray[selectIndex];
                                    this.setState({
                                        initHourIndex: this.lastSelectDateIndex,
                                    });
                                    this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                            let selectIndex = Math.round(y / ITEM_HEIGHT);
                            this.lastSelectDateIndex = selectIndex;
                            this.selectDate = hourArray[selectIndex];
                            this.setState({
                                initHourIndex: this.lastSelectDateIndex,
                            });
                            this.hourList.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                        },

                    }}
                />
                <View pointerEvents={'none'} style={{
                    position: 'absolute',
                    width: width / 4,
                    height: 50,
                    top: 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column'

                }}>
                    <Image style={[styles.splitImageViewStyle, {width: 80}]} source={{uri: splitImage}}/>
                    <Image style={[styles.splitImageViewStyle, {width: 80}]} source={{uri: splitImage}}/>
                </View>
            </View>
        )
    }


    _renderMinuteList() {
        const {initMinuteIndex = 0} = this.state;
        return (
            <View style={{flex: this.minuteFlex}}>
                <RecyclerListView
                    ref={ref => this.minuteList = ref}
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    rowRenderer={this._renderMinuteItem}
                    initialRenderIndex={initMinuteIndex}
                    dataProvider={this.minuteDataProvider.cloneWithRows(this.minuteListData)}
                    layoutProvider={this._minuteLayoutProvider}
                    scr
                    scrollViewProps={{
                        onScrollEndDrag: (event) => {
                            if (isIos) {
                                const {nativeEvent = {}} = event;
                                const {contentOffset = {}, velocity = {}} = nativeEvent;
                                const {y = 0} = contentOffset;
                                const {y: velocityY = 0} = velocity;
                                if (velocityY === 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectMinuteIndex = selectIndex;
                                    this.selectMinuteData = this.minuteListData[selectIndex];
                                    this.setState({
                                        initMinuteIndex: this.lastSelectMinuteIndex,
                                    });
                                    this.minuteList.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                        },
                        onMomentumScrollEnd: (event) => {
                            // 在 ios 上缓慢滚动时，onMomentumScrollEnd 不起作用
                            const {nativeEvent = {}} = event;
                            const {contentOffset = {}, velocity = {}} = nativeEvent;
                            const {y = 0} = contentOffset;
                            const {y: velocityY = 0} = velocity;
                            if (isIos) {
                                if (velocityY > 0) {
                                    let selectIndex = Math.round(y / ITEM_HEIGHT);
                                    this.lastSelectMinuteIndex = selectIndex;
                                    this.selectMinuteData = data[selectIndex];
                                    this.setState({
                                        initMinuteIndex: this.lastSelectMinuteIndex,
                                    });
                                    this.minuteList.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                }
                            }
                            let selectIndex = Math.round(y / ITEM_HEIGHT);
                            this.lastSelectMinuteIndex = selectIndex;
                            this.selectMinuteData = data[selectIndex];
                            this.setState({
                                initMinuteIndex: this.lastSelectMinuteIndex,
                            });
                            this.minuteList.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                        },

                    }}
                />
                <View pointerEvents={'none'} style={{
                    position: 'absolute',
                    width: this.minuteWidth,
                    height: 50,
                    top: 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column'

                }}>
                    <Image style={[styles.splitImageViewStyle, {width: this.imageWidth}]} source={{uri: splitImage}}/>
                    <Image style={[styles.splitImageViewStyle, {width: this.imageWidth}]} source={{uri: splitImage}}/>
                </View>
            </View>
        )
    }

    _rowRenderer = (type, item, index) => {
        if (type === 1) {
            return (
                <View style={{height: 100}}/>
            )
        }
        const {title = '', fontSize = 17} = item;
        const {initIndex} = this.state;
        let color = initIndex == index ? black : gray;
        return this._renderText(title, {fontSize: fontSize, color: color});
    }

    /**
     * 小时
     * @param type
     * @param item
     * @param index
     * @returns {*}
     * @private
     */
    _renderHourItem = (type, item, index) => {
        const {title = '', fontSize = 17} = item;
        const {initHourIndex} = this.state;
        let color = initHourIndex == index ? black : gray;
        return this._renderText(title, {fontSize: fontSize, color: color});
    }

    /**
     * 分钟
     * @param type
     * @param item
     * @param index
     * @returns {*}
     * @private
     */
    _renderMinuteItem = (type, item, index) => {
        const {title = '', fontSize = 17} = item;
        const {initMinuteIndex} = this.state;
        let color = initMinuteIndex === index ? black : gray;
        return this._renderText(title, {fontSize: fontSize, color: color});
    }

    /**
     * 内容
     * @param text
     * @param style
     * @returns {*}
     * @private
     */
    _renderText(text = '', style = {}) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', height: ITEM_HEIGHT}}>
                <Text numberOfLines={1} style={[styles.itemTextStyle, style]}>{text}</Text>
            </View>
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
            this.imageWidth = 80;
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
    splitImageViewStyle: {
        width: 120,
        height: 2,
    },
    itemTextStyle: {
        fontSize: 17,
        color: '#333'
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
