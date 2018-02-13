const misc = {};

misc.lazyClone = a => JSON.parse(JSON.stringify(a));

misc.last = arr => arr[arr.length - 1];

misc.removeWhere = (arr, key, value) => arr.filter(obj => obj[key] !== value);

export default misc;
