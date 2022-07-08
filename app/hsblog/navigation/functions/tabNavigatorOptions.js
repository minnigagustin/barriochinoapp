import configureApp from "../../utils/constants/configureApp";
import BottomTabBar from "../components/BottomTabBar";
const tabNavigatorOptions = {
    backBehavior: 'history',
    tabBarComponent: BottomTabBar,
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        inactiveTintColor: 'transparent',
        style: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
        },
        labelStyle: {
            borderRadius: 100,
            fontSize: 10,
            fontWeight: '500',
            padding: 0,
            paddingLeft: 3,
            paddingRight: 3,
            paddingBottom: 2,
            margin: 0,
        },
    },
};
export default tabNavigatorOptions;
