const storage = {};

storage.get = key => {
  return localStorage.getItem(key) === 'undefined'
    ? undefined
    : JSON.parse(localStorage.getItem(key));
};

storage.set = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
}

export default storage;
