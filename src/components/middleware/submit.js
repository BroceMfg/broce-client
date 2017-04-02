import request from './request';

const supportedHTTPMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
];

/**
 * Submit a form, using one of our predefined http POST, PUT, or DELETE methods
 * @param {*} e - Either the html form itself or a string containing
 * key/value pairs of form data
 * @param {string} path - The path to be submitted to (will be appended to apiUrl)
 * @param {function} successCb - Success callback, gets passed the response obj
 * @param {string} httpMethod - The desired http method (default: 'POST')
 */
module.exports = function submit(
  e,
  path,
  successCb,
  httpMethod = 'POST'
) {
  e.preventDefault();
  this.setStateVal({ generalLoading: true });
  const data = {};
  if (typeof e === 'string') {
    // handle catchall case where we pass name/vals as string
    e.split('&').forEach((pair) => {
      const x = pair.split('=');
      data[x[0]] = x[1];
    });
  } else {
    // const selects = e.target.querySelectorAll('select[name]');
    // Object.keys(selects).forEach((key) => {
    //   data[selects[key].name] = selects[key].value;
    // });
    // find all inputs within the form passed to the function (e)
    // and add their key/value pair to the "data" Object
    const inputs = e.target.querySelectorAll('input[name]');
    Object.keys(inputs).forEach((key) => {
      data[inputs[key].name] = inputs[key].value;
    });
  }

  const handleSuccess = (resp) => {
    // response comes in as a string, needs to be parsed to JSON
    this.setStateVal({ generalLoading: false });
    const r = JSON.parse(resp);
    if (r.error) {
      if (typeof r.error === 'string' &&
        r.error.toLowerCase().includes('invalid auth')) {
        this.signOut();
      } else {
        this.setStateVal({ errMsg: r.error || 'Internal Server Error' });
      }
    } else {
      successCb(r);
    }
  };

  request(
    supportedHTTPMethods.includes(httpMethod) ? httpMethod : 'POST',
    this.state.apiUrl + path,
    data,
    handleSuccess,
    (err) => {
      this.setStateVal({ generalLoading: false });
      this.setStateVal({ errMsg: err || 'Internal Server Error' });
    }
  );
};
