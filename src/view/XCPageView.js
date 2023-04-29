import React, {Component} from "react";
import {StatusBar, StyleSheet, View} from "react-native";
import {isIphoneX, isIos} from '../utils/DeviceUtils';
import ProTypes from "prop-types";

//StatusBar默认属性
const defaultBarStyle = {
    barStyle: 'dark-content',
    backgroundColor: 'white'
}

export default class XCPageView extends Component {
    static propTypes = {
        /**
         * 页面背景颜色
         */
        bgColor: ProTypes.string,
        /**
         * 状态栏style
         */
        statusBarStyle: ProTypes.object,
    }
    static defaultProps = {
        bgColor: '#ffffff',
        statusBarStyle: defaultBarStyle,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {bgColor = '#ffffff'} = this.props
        return <View style={[styles.container, {backgroundColor: bgColor}]}>
            {this._renderStatusBar()}
            {this.props.children}
        </View>
    }

    /**
     * 状态栏设置
     * @returns {JSX.Element|null}
     * @private
     */
    _renderStatusBar() {
        if (isIos) return null;
        const {statusBarStyle = defaultBarStyle} = this.props
        return (
            <StatusBar {...statusBarStyle}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: isIphoneX() ? 34 : 0
    }
})
