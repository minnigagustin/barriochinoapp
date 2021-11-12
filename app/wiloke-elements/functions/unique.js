export function getUniqueSet(list, key) {
  return [...new Set(list.map((item) => item[key]))].map((unique) => {
    return list.find((item) => item[key] === unique);
  });
}
