export default class ApiService {
  constructor() {
    this.erpGet = erpDb();
    this.ERPObjects = ERPObjects();

    console.log("ApiService module loaded");
  }

  /**
   * @param {string} endpoint my-endpoint
   * @returns {string}
   */
  static getBaseUrl({ endpoint = null }) {
    let url =
      URLRequest +
      erpDb().ERPIPAddress +
      ":" +
      erpDb().ERPPort +
      "/" +
      erpDb().ERPApi +
      "/";

    if (endpoint != null) {
      url = url + endpoint;
    }

    return url;
  }

  /**
   *
   * @returns {HeadersInit}
   */
  static getHeaders() {
    var headers = {
      database: erpDb().ERPDatabase,
      username: erpDb().ERPUsername,
      password: erpDb().ERPPassword,
    };
    return headers;
  }

  /**
   *
   * @returns {HeadersInit}
   */
  static getPostHeaders() {
    postHeaders = {
      database: this.erpGet.ERPDatabase,
      username: this.erpGet.ERPUsername,
      password: this.erpGet.ERPPassword,
    };

    return postHeaders;
  }


}
