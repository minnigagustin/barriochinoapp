// export default function getUnique<ItemT extends {}>(list: ItemT[], condition: string) {
//   return list
//     .map(item => item[condition])
//     .map((item, index, final) => final.indexOf(item) === index && index)
//     .filter(e => list[e])
//     .map(e => list[e]);
// }
export default function getUnique(list, condition) {
    return Object.values(list.reduceRight((obj, item) => {
        return {
            ...obj,
            [item[condition]]: item,
        };
    }, {}));
}
// export function getUniqueSet<ItemT extends ItemDefault>(list: ItemT[], key: string) {
//   return [...new Set(list.map(item => item[key]))].map<ItemT>(key => list.find(item => item[key] === key) ?? []);
// }
export function getUniqueSet(list, key) {
    return [...new Set(list.map(item => item[key]))].map(unique => {
        return list.find(item => item[key] === unique);
    });
}
