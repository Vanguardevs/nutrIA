import Home from "../pages/Main/Home.js";
import Settings from "../pages/Main/Config.js";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tabs = createBottomTabNavigator();

export default function appTab(){
    return(
    <Tabs.Navigator>
        <Tabs.Screen
            name="Home"
            component={Home}
        />
        <Tabs.Screen
            name="Settings"
            component={Settings}
        />
    </Tabs.Navigator>
    )
}