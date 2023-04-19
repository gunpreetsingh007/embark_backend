const axios = require('axios');

class HttpClient {

  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  _handleResponse = (data) => data;

  _handleError = async ({ response, config }) => {
    //const originalRequest = config;
    // if (response?.status === 401 && !originalRequest._retry) {
    //   // call refresh token
    //   localStorage.clear();
    //   window.location.href = '/sign-in'
    // }
    return Promise.resolve(response);
  };
}

module.exports = HttpClient