import React, { memo } from 'react';
import BackButton from "../BackButton/BackButton";
import { HeaderBase, Input, Icons } from "../../shared";
import i18n from "../../utils/functions/i18n";
import { styles } from './styles';
function HeaderSearch({ backButtonEnabled = false, onSearch = () => { } }) {
    const _handleChangeText = value => {
        onSearch(value);
    };
    return (<>
      <HeaderBase Left={backButtonEnabled && <BackButton tachyons={['pa1', 'nl2', 'mr2']}/>} Right={<Input placeholder={i18n.t('search')} placeholderTextColor="#999" borderColor="transparent" backgroundColor="gray2" clearButtonMode="while-editing" autoCorrect={false} Left={<Icons.Feather name="search" size={20} color="dark3" style={{ marginHorizontal: 10 }}/>} onChangeText={_handleChangeText} onClearText={_handleChangeText} containerStyle={backButtonEnabled ? styles.input : {}}/>}/>
    </>);
}
export default memo(HeaderSearch);
