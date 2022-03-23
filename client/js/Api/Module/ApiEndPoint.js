import ApiService from "./ApiService";

/**
 * @param {string} name
 * @param {string} endpoint
 * @param {HeadersInit} headers
 */
export default class ApiEndPoint {
  constructor({ name = null, endpoint = null, headers = null }) {
    this.name = name.toLowerCase();
    this.endpoint = endpoint;
    this.headers = headers;
  }

  /**
   *
   * @param {RequestInfo} url - If empty, it will use default endpoint
   * @param {RequestInit} options
   * @param {CallableFunction} onResponse
   */
  async fetch(url = null, options = null) {
    if (options == null) {
      options = {
        headers: this.headers,
      };
    }

    if (url == null) {
      url = this.endpoint;
    }

    try {
      const response = await fetch(url, options);
      return response;
    } catch (exception) {
      console.log(exception);
    }
  }
}
