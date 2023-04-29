import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import ProTypes from "prop-types";
import {isIos} from "../utils/DeviceUtils";

const splitImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAECAMAAACHiEKvAAAAolBMVEUjwn0jwn0Xvmgjwnwjwnwiwnwjwn0jwn0jwn0iwnwfw3sjwnwjwn0jwn0jwn0jwnwjwn0jwn0jw30gwXsjwn0jw30jwn0iwXwcv3Iiwn0jwn0jwnwjwnwjwnwjwn0jwnwjwn0jwn0kwn0jwn0jwn0jwnwjwn0iwn0jwn0jwnwiwn0hwXsiwHkhwXsgwnsjwn0iwn0jwn0hwnwkw30kwn0AAADMb4tdAAAANnRSTlNPSQXx9jHn3Ik9EPzXyMSYk3JVFeKdhEMKK6J70s68t7Ovq6eOdm1nYl5aJyMeGn856zXAagC/KqgEAAABBklEQVQoz7XS12rDQBQEUFmr1Wo36r333ov9/7+WDQERCAnYyPflvs5hhnmwLOu6hBDDmOdpGsdh8DwI4b6uGGPHud1uDMPoet93Xds2zb2uNa2qgmBZbNsWhLJUVUVRLMv3iyLPsyxNkySOD1mWJSmKwlAUEUKmyfP8tgHAcdzH19EPANg2njdNEyFRFMMwiiRJkuXjiOMkSdMsy/Oi8H3fshRFVdWyFATBtpclCKpK07S6vjdN23Zd3+u6TkPSqI7jYLyu+w6h53nDMI7TNM+GYRDiui6lPv4G79eDwU8wOMHof7D1Ghg+C17fBf7d8JVgfDZ8MZiKqfflSZ/eE/zuhsk3+BOiAVj+5fZYNwAAAABJRU5ErkJggg==';
const ITEM_HEIGHT = 50;
const black = '#333';
const gray = '#999';

/**
 * 时间列表
 */
export default class DateListView extends Component {

    static propTypes = {
        data: ProTypes.array.isRequired,
        initIndex: ProTypes.number,
        style: ProTypes.shape({
            viewFlex: ProTypes.number,
            imageWidth: ProTypes.number,
            imageViewWidth: ProTypes.number,
        }),
        onDataSelected: ProTypes.func,
    }

    static defaultProps = {
        data: [],
        initIndex: 0,
        style: {},
        onDataSelected: () => {
        }
    }

    constructor(props) {
        super(props);
        this.selectDate = {}; // 选中的item数据
        this.state = {
            data: this.props.data,
            initIndex: this.props.initIndex,
            style: this.props.style,
        };
    }

    render() {
        return (
            this._renderDateList()
        )
    }

    _renderDateList() {
        let {data = [], initIndex = 0, style = {}} = this.state;
        const {viewFlex = 1, imageViewWidth, imageWidth} = style;
        return (
            <View style={{flex: viewFlex}}>
                <FlatList
                    ref={ref => this.flatListRef = ref}
                    style={{flex: 1}}
                    ListHeaderComponent={this._renderHeaderFooterView}
                    ListFooterComponent={this._renderHeaderFooterView}
                    keyExtractor={item => `${item.id}`}
                    initialScrollIndex={initIndex}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    onScrollEndDrag={(e) => {
                        if (isIos) {
                            const {nativeEvent = {}} = e;
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
                                this.flatListRef.scrollToOffset({animated: true, offset: ITEM_HEIGHT * selectIndex});
                                this.props.onDataSelected(this.selectDate, selectIndex);
                            }
                        }
                    }}
                    onMomentumScrollEnd={(e) => {
                        // 在 ios 上缓慢滚动时，onMomentumScrollEnd 不起作用
                        const {nativeEvent = {}} = e;
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
                                this.flatListRef.scrollToOffset({animated: true, offset: ITEM_HEIGHT * selectIndex});
                                this.props.onDataSelected(this.selectDate, selectIndex);
                            }
                        }
                        let selectIndex = Math.round(y / ITEM_HEIGHT);
                        this.lastSelectDateIndex = selectIndex;
                        this.selectDate = data[selectIndex];
                        this.setState({
                            initIndex: this.lastSelectDateIndex,
                        });
                        this.flatListRef.scrollToOffset({animated: true, offset: ITEM_HEIGHT * selectIndex});
                        this.props.onDataSelected(this.selectDate, selectIndex);
                    }}
                    getItemLayout={(data, index) => {
                        return {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                    }}
                    renderItem={this._renderItem}/>
                <View pointerEvents={'none'} style={{
                    position: 'absolute',
                    width: imageViewWidth,
                    height: 50,
                    top: 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}>
                    <Image style={[styles.splitImageViewStyle, {width: imageWidth}]} source={{uri: splitImage}}/>
                    <Image style={[styles.splitImageViewStyle, {width: imageWidth}]} source={{uri: splitImage}}/>
                </View>
            </View>
        )
    }

    /**
     * Header和Footer用于占位
     * @returns {JSX.Element}
     * @private
     */
    _renderHeaderFooterView = () => {
        return (
            <View style={{height: 100}}/>
        )
    }

    /**
     * 日期
     * @returns {*}
     * @private
     */
    _renderItem = ({item, index}) => {
        const {title = '', fontSize = 17} = item;
        const {initIndex} = this.state;
        let color = initIndex === index ? black : gray;
        return this._renderText(title, {fontSize: fontSize, color: color});
    }

    /**
     * 内容
     * @param text
     * @param style
     * @returns {JSX.Element}
     * @private
     */
    _renderText(text = '', style = {}) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', height: ITEM_HEIGHT}}>
                <Text numberOfLines={1} style={[styles.itemTextStyle, style]}>{text}</Text>
            </View>
        )
    }

}
// 样式
const styles = StyleSheet.create({
    splitImageViewStyle: {
        width: 120,
        height: 2,
    },
    itemTextStyle: {
        fontSize: 17,
        color: '#333'
    },
});

