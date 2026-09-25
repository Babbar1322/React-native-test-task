/**
 * @format
 */

import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
