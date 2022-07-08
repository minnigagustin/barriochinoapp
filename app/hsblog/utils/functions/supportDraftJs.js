import { isEmpty } from 'ramda';
export function getDraftJsResultFromTagHighlight({ value, entityMap }) {
    const ranges = entityMap.map((item, index) => ({
        ...item.range,
        key: index,
    }));
    const mentions = entityMap.map(item => item.mentions);
    if (!value) {
        return {
            blocks: [],
            entityMap: [],
        };
    }
    return {
        blocks: [
            {
                key: String(Date.now()),
                text: value,
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: ranges,
                data: {},
            },
        ],
        entityMap: Object.assign({}, ...mentions.map((mention, index) => {
            return {
                [String(index)]: {
                    type: 'mention',
                    mutability: 'SEGMENTED',
                    data: {
                        mention: mention,
                    },
                },
            };
        })),
    };
}
export function getTagHighlightValuesFromDraftJs({ entityMap, blocks }) {
    const ranges = blocks.flatMap(item => item.entityRanges);
    if (isEmpty(entityMap))
        return [];
    return ranges.map(item => {
        return {
            range: item,
            mentions: entityMap[item.key].data.mention,
        };
    });
}
// entityMap: Object.assign(
//   {},
//   ...tags.map<EntityMap>((tag, index) => {
//     return {
//       [String(index)]: {
//         type: 'mention',
//         mutability: 'SEGMENTED',
//         data: {
//           mention: {
//             id: tag.id,
//             avatar: userObj[tag?.id]?.avatar ?? '',
//             name: tag.text,
//             link: userObj[tag.id]?.link ?? '',
//             token: tag.token,
//           },
//         },
//       },
//     };
//   }),
// ),
