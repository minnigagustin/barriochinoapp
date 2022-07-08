import { createStackNavigator } from 'react-navigation-stack';
export default function handleTabNavigator(source, checkScreen, renderTabItem) {
    return source.reduce((acc, item) => {
        if (!item.enable || !checkScreen[item.screen]) {
            return acc;
        }
        const newValue = {
            screen: createStackNavigator(checkScreen[item.screen], { headerMode: 'none' }),
            navigationOptions: renderTabItem({
                tabBarLabel: item.label,
                iconName: item.iconName,
                screen: item.screen,
            }),
        };
        return {
            ...acc,
            [item.name]: newValue,
        };
    }, {});
}
