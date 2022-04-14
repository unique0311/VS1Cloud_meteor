/**
 * @author : Dusko.
 * this is ocr service class.
 */
export class OCRService {
  constructor() {

  }

  POST(imageData, fileName) {
    let promise = new Promise(function (resolve, reject) {
      Meteor.call("getOcrResultFromVerifi", imageData, fileName, function(error, results) {
        if (error) {
          reject(error);
        } else {
          if (results.statusCode == 201) {
            resolve(JSON.parse(results.content));
          } else {
            reject(results);
          }          
        }
      });
    });
    return promise;
  }
}
