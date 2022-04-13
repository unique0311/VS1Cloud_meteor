/**
 * @author : Dusko.
 * this is ocr service class.
 */
export class OCRService {
  constructor() {

  }

  getBaseUrl() {
    return "https://api.veryfi.com/api/v7/partner/documents/";
  }

  getPostHeaders() {
    var postHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "CLIENT-ID": "vrfT3ah0JbLfw2ZsJ2WPID5VFHdete2GeurWkm4",
      "AUTHORIZATION": "apikey goldsnake2100:a89194f57da098a992d673b1661f270d",
      "Access-Control-Allow-Origin": "*"
    };

    return postHeaders;
  }

  responseHandler(response) {
    if (response === undefined) {
      let getResponse =
        "You have lost internet connection, please log out and log back in.";
      return getResponse;
    } else {
        try {
          var content = JSON.parse(response.content);
          console.log("API Request done");

          return content;
        } catch (e) { console.log('err', e) }
    }
  }

  POST(imageData, fileName) {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
      $.ajax({
        url: that.getBaseUrl(),
        type: 'post',
        data: JSON.stringify({
          'file_data': imageData,
          'file_name': fileName,
          'boost_mode': 1
        }),
        headers: that.getPostHeaders(),
        dataType: 'json',
        success: function (data) {
          let response = that.responseHandler(data);
          resolve(response);
        },
        error: function (data){
          reject(data);        
        }
      });
    });
    return promise;
  }
}
