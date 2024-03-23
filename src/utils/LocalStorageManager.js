const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  
  const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  
  export { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage };
  