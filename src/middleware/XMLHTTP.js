export function get(theUrl, callback, errorCallback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.withCredentials = true;

  xmlHttp.onload = function() {
    callback(this.responseText)
  }

  xmlHttp.onerror = function() {
    errorCallback(this.responseText);
  }

  xmlHttp.send(null);
}

function putPost(method, theUrl, formData, callback, errorCallback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(method, theUrl, true); // true for asynchronous 
  xmlHttp.withCredentials = true;
  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xmlHttp.onload = function() {
    callback(this.responseText)
  }

  xmlHttp.onerror = function() {
    errorCallback(this.responseText);
  }

  xmlHttp.send(formData);
}

export const post = (theUrl, formData, callback, errorCallback) => putPost("POST",
  theUrl, formData, callback, errorCallback);
export const put = (theUrl, formData, callback, errorCallback) => putPost("PUT",
  theUrl, formData, callback, errorCallback);