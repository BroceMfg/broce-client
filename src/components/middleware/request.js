const parseJSONtoFormData = (json) => {
  let formData = '';
  Object.keys(json).forEach((key) => {
    const value = json[key];
    if (value) {
      formData += `${key}=${json[key]}&`;
    }
  });
  return formData;
};

const request = (method, theUrl, data = {}, callback, errorCallback) => {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open(method, theUrl, true); // true for asynchronous
  xmlHttp.withCredentials = true;
  let formData = null;
  if (method !== 'GET') {
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    formData = parseJSONtoFormData(data);
  }
  xmlHttp.onload = function onLoad() {
    return callback(this.responseText);
  };
  xmlHttp.onerror = function onError() {
    return errorCallback(this.responseText);
  };
  xmlHttp.send(formData);
};

export default request;
