import React, { useState, useRef } from 'react';
import { View, Keyboard } from 'react-native';
import { Button, Icons, useMount, Text, TextInputMentions, useTheme } from "../../shared";
import { getDraftJsResultFromTagHighlight } from "../../utils/functions/supportDraftJs";
import { isEmpty } from 'ramda';
import Avatar from "../../components/Avatar/Avatar";
import { useSelector } from 'react-redux';
import { isLoggedInSelector } from 'containers/Auth/selectors';
import i18n from "../../utils/functions/i18n";
import { onOpenModalLogin } from 'components/ModalLogin/ModalLogin';
import isIOS from "../../shared/utils/isIOS";
import styles from './styles';
import { alertAuthentication } from './notify';
const KeyBoardComments = ({ usersTag = [], onComment, onEdit }) => {
    const [comment, setComment] = useState('');
    const [entityMap, setEntityMap] = useState([]);
    const inputRef = useRef(null);
    const resultDefault = { blocks: [], entityMap: {} };
    const result = useRef(resultDefault);
    const isLoggedIn = useSelector(isLoggedInSelector);
    const { colors } = useTheme();
    useMount(() => {
        onEdit(({ values, entityMap }) => {
            console.log({ values });
            setComment(values);
            setEntityMap(entityMap);
            inputRef.current?.focus();
        });
    });
    // useEffect(() => {
    //   const resultExist = !isEmpty(result.current.blocks);
    //   if (!resultExist) {
    //     setComment('');
    //   }
    // }, [comment]);
    return (<View>
      <View style={[styles.textInputView, { backgroundColor: colors.light, borderTopColor: colors.gray1 }]} renderToHardwareTextureAndroid>
        <TextInputMentions users={usersTag} hideUserMentioned placeholder={i18n.t('writeComment')} inputRef={inputRef} keyExtractor={item => String(item.id)} inputStyle={!isIOS ? styles.inputAndroid : {}} keyForMention="displayName" renderUserItem={item => {
        return (<View style={styles.userItem}>
                <Avatar uri={item.avatar} name={!!item.displayName ? item.displayName : 'Wiloke'} size={40}/>
                <Text color="dark2" style={styles.userName}>
                  {item.displayName}
                </Text>
              </View>);
    }} value={comment} entityMap={entityMap} inputContainerStyle={[styles.input, { borderColor: colors.gray1 }]} containerStyle={styles.containerInput} mentionStyle={{
        backgroundColor: colors.gray3,
        color: colors.primary,
    }} userContainerStyle={comment.includes('@') ? styles.mentionView : {}} onChange={({ value, entityMap }) => {
        const draftRes = getDraftJsResultFromTagHighlight({ value, entityMap });
        setComment(value);
        if (!value) {
            result.current = resultDefault;
        }
        else {
            result.current = draftRes;
        }
    }}/>
        <Button size="extra-small" backgroundColor="transparent" onPress={() => {
        if (!isLoggedIn) {
            alertAuthentication(onOpenModalLogin);
            return;
        }
        const resultExist = !isEmpty(result.current.blocks);
        if (resultExist) {
            onComment(result.current);
            Keyboard.dismiss();
            setComment('');
        }
        // setComment('');
        // queueMicrotask(() => {
        //   if (resultExist) {
        //     onComment(result.current);
        //     Keyboard.dismiss();
        //   }
        //   setComment('');
        // });
    }}>
          <Icons.MaterialCommunityIcons name="send" size={25} color="primary"/>
        </Button>
      </View>
    </View>);
};
export default KeyBoardComments;
