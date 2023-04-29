import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {debounce} from 'lodash';
import ProTypes from "prop-types";

/**
 * 防止快速点击
 */
export default class XCButton extends PureComponent {

    static propTypes = {
        onPress: ProTypes.func.isRequired,
        waitTime: ProTypes.number,
        activeOpacity: ProTypes.number,
        style: ProTypes.any
    }

    static defaultProps = {
        waitTime: 250,
        activeOpacity: 0.85,
        style: {}
    }

    constructor(props) {
        super(props);
        this.debouncePress = this.debouncePress.bind(this);
        const {waitTime} = props;
        this.onPressBindDebounced = debounce(this.debouncePress, waitTime, {
            'leading': true,
            'trailing': false
        });
    }

    componentWillUnmount() {
        this.onPressBindDebounced.cancel()
    }

    render() {
        const {activeOpacity, style} = this.props;
        return (
            <TouchableOpacity
                style={style}
                onPress={this.onPressBindDebounced}
                activeOpacity={activeOpacity}
            >
                {this.props.children}
            </TouchableOpacity>
        )
    }

    debouncePress() {
        this.props.onPress()
    }

}
