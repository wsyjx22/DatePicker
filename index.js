// 忽略该文件的修改
// git update-index --assume-unchanged App/index.js   添加忽略
// git update-index --no-assume-unchanged App/index.js   取消忽略

import { AppRegistry } from "react-native";

import Root from "./src/Demo";

AppRegistry.registerComponent("Wuba", () => Root);
