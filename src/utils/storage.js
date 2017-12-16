const storage = {};

storage.get = key => {
  return JSON.parse(localStorage.getItem(key));
};

storage.set = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
}

export default storage;
