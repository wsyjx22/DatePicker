import {Dimensions, Platform, NativeModules} from 'react-native';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const X_DEVICE_HEIGHT = [693, 812, 844, 896, 926];

// 低版本兼容
const isIphoneXDeprecated = isIos &&
    (Array.prototype.includes.call(X_DEVICE_HEIGHT, SCREEN_HEIGHT) ||
        Array.prototype.includes.call(X_DEVICE_HEIGHT, SCREEN_WIDTH))

module.exports = {
    isIphoneX: function () {
        if (NativeModules?.WBDeviceInfo?.isIPhoneXSync) {
            return NativeModules?.WBDeviceInfo?.isIPhoneXSync?.()
        } else {
            return isIphoneXDeprecated
        }
    }
};
