import React from 'react';
import _ from 'lodash';

const misc = {};

misc.lazyClone = a => JSON.parse(JSON.stringify(a));

misc.last = arr => arr[arr.length - 1];

misc.removeWhere = (arr, key, value) => arr.filter(obj => obj[key] !== value);

misc.updateState = function (obj, cb) {
  this.setState(obj, cb);
};

misc.contains = (arr1, arr2, comparator = _.isEqual) => _.differenceWith(arr2, arr1, comparator).length === 0;

misc.escape = str => str.replace(/\n/, "\\n").replace(/\r/, "\\r").replace(/\t/, "\\t");

misc.changeKey = (obj, from, to) => {
  obj[to] = obj[from];
  delete obj[from];
};

misc.range = (min, max) => {
  let arr = [];

  for (let i = min; i < max; i++) {
    arr.push(i);
  }

  return arr;
};

export default misc;
