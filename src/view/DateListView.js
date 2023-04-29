import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";
import ProTypes from "prop-types";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {isIos} from "../utils/DeviceUtils";

const {width, height} = Dimensions.get('window');
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
        onDataSelected: () => {}
    }

    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });
        this._layoutProvider = new LayoutProvider(
            index => {
                return 0;
            },
            (type, dim, index) => {
                if (index === 0) {
                    dim.width = width;
                    dim.height = 100 + ITEM_HEIGHT;
                } else if (index === this.state.data.length -1) {
                    dim.width = width;
                    dim.height = 50 + ITEM_HEIGHT;
                } else {
                    dim.width = width;
                    dim.height = ITEM_HEIGHT;
                }
            }
        );
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
        let offset = initIndex === 0 ? 0 : initIndex * 50;
        return (
            <View style={{flex: viewFlex}}>
                <RecyclerListView
                    ref={ref => this.recyclerListView = ref}
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    rowRenderer={this._rowRenderer}
                    initialOffset={offset}
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
                                    this.selectDate = data[selectIndex];
                                    this.setState({
                                        initIndex: selectIndex,
                                    });
                                    this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                    this.props.onDataSelected(this.selectDate, selectIndex);
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
                                    this.selectDate = data[selectIndex];
                                    this.setState({
                                        initIndex: selectIndex,
                                    });
                                    this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                                    this.props.onDataSelected(this.selectDate, selectIndex);
                                }
                            }
                            let selectIndex = Math.round(y / ITEM_HEIGHT);
                            this.selectDate = data[selectIndex];
                            this.setState({
                                initIndex: selectIndex,
                            });
                            this.recyclerListView.scrollToOffset(0, ITEM_HEIGHT * selectIndex, true);
                            this.props.onDataSelected(this.selectDate, selectIndex);
                        },
                    }}
                />
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

    _rowRenderer = (type, item, index) => {
        const {title = '', fontSize = 17} = item;
        const {initIndex, data} = this.state;
        let color = initIndex === index ? black : gray;
        if (index === 0) { // Header头占位用
            return (
                <View style={{flex: 1, paddingTop: 100}}>
                    {this._renderText(title, {fontSize: fontSize, color: color})}
                </View>
            )
        } else if (index === data.length - 1 && index > 4) {
            return (
                <View style={{flex: 1, paddingTop: 50}}>
                    {this._renderText(title, {fontSize: fontSize, color: color})}
                </View>
            )
        }
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

