const HttpClient = require("./index");
const axios = require("axios");


class Axios extends HttpClient {
  constructor() {
    super(process.env.SHIPROCKET_API_BASE_URL);
    this._initializeRequestInterceptor();
  }


  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this._handleRequest);
  };

  _handleRequest = async (config) => {
    let payload = { email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD };
    let res = await axios.post(process.env.SHIPROCKET_API_BASE_URL + "auth/login", payload);
    if (res?.data?.token)
    config.headers.Authorization = "Bearer " + res?.data?.token;
    return config;
  };

  callApi(url, options) {
    return this.instance({
      method: options.method,
      url: url,
      headers: options?.header ? options?.header : {},
      data: options?.body ? options?.body : undefined,
      onUploadProgress: options?.onUploadProgress ? options?.onUploadProgress : undefined
    });
  };
}

module.exports = Axios

