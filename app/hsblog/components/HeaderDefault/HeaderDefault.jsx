import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { sizeBase } from "../../utils/constants/base";
import { Icons, HeaderBase, View, Text } from "../../shared";
import { Animated, TouchableOpacity } from 'react-native';
import { onOpenModalLogin } from 'components/ModalLogin/ModalLogin';
import Logo from "../Logo/Logo";
import useHeaderAnimated from "../../shared/hooks/useAnimation";
import { Link } from "../../navigation";
import { userAvatarSelector, isLoggedInSelector, userNameSelector } from 'containers/Auth/selectors';
import { tabNavigatorSelector, tabNavigatorHasSearchSelector } from 'containers/AppContent/selectors';
import { withNavigation } from 'react-navigation';
import BackButton from "../BackButton/BackButton";
import Avatar from "../Avatar/Avatar";
const HeaderDefault = ({ title = '', backButtonEnabled = false, navigation }) => {
    const avatar = useSelector(userAvatarSelector);
    const isLoggedIn = useSelector(isLoggedInSelector);
    const name = useSelector(userNameSelector);
    const { opacityText } = useHeaderAnimated();
    const tabNavigator = useSelector(tabNavigatorSelector);
    const tabNavigatorHasSearch = useSelector(tabNavigatorHasSearchSelector);
    const parentRouteName = !!navigation ? navigation.dangerouslyGetParent()?.state.routeName ?? '' : '';
    const _title = !!title ? title : !!navigation ? tabNavigator.data.find(item => item.name === parentRouteName)?.label : '';
    const handleOpenModal = () => {
        onOpenModalLogin();
    };
    return (<>
      <HeaderBase Left={[
        backButtonEnabled && <BackButton key="item1" tachyons={['pa1', 'nl2', 'mr2']}/>,
        !!_title && parentRouteName !== 'home' ? (<Text key="item2" type="h4">
              {_title}
            </Text>) : (<Animated.View key="item2" style={{ opacity: opacityText }}>
              <Logo />
            </Animated.View>),
    ]} Right={[
        <View key="item1" tachyons="mr2">
            {!tabNavigatorHasSearch && (<Link to="SearchScreen" params={{ backButtonEnabled: true }} activeOpacity={0.7} tachyons="pa1">
                <Icons.Feather name="search" size={sizeBase * 1.5} color="dark2"/>
              </Link>)}
          </View>,
        isLoggedIn ? (<Link key="item2" to="ProfileScreen" activeOpacity={0.8} style={{ width: 32 }}>
              <Avatar uri={avatar} size={30} name={name}/>
            </Link>) : (<TouchableOpacity key="item2" onPress={handleOpenModal}>
              <View justifyContent="center" alignItems="center" tachyons={['w2', 'h2']}>
                <Icons.Feather name="user" size={sizeBase * 1.5} color="dark2"/>
              </View>
            </TouchableOpacity>),
    ]}/>
    </>);
};
export default memo(withNavigation(HeaderDefault));
