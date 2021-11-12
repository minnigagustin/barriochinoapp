import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { isEmpty, includes } from 'ramda';
import { toAlphabetLowerCase } from './utils';
function ListUser({ users = [], containerStyle = {}, readonly = false, renderUserItem, keyExtractor, hideUserMentioned, keyForMention, search, entityMap, onItemPress, }) {
    const getMentions = () => {
        return entityMap.map(item => item.mentions);
    };
    return (<ScrollView style={containerStyle} keyboardShouldPersistTaps="handled">
      {!isEmpty(users) &&
        !readonly &&
        users.map((user, index) => {
            const mentions = getMentions();
            const at = search.charAt(0);
            const searchNotAt = search.replace(new RegExp(`^${at}`, 'g'), '');
            const checkHideUserMentioned = hideUserMentioned && includes(user, mentions);
            const atOnly = at && !searchNotAt;
            const userHasSearch = toAlphabetLowerCase(user[keyForMention]).includes(toAlphabetLowerCase(searchNotAt) || '*');
            if (checkHideUserMentioned || (!atOnly && !userHasSearch)) {
                return null;
            }
            return (<TouchableOpacity key={keyExtractor(user, index)} activeOpacity={1} onPress={() => {
                onItemPress?.(user);
            }}>
              {renderUserItem?.(user, index)}
            </TouchableOpacity>);
        })}
    </ScrollView>);
}
export default ListUser;
