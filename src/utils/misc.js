const misc = {};

misc.lazyClone = a => JSON.parse(JSON.stringify(a));

misc.last = arr => arr[arr.length - 1];

export default misc;
