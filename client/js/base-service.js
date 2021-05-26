/**
 * @author : Shankar.
 * this is main service class. Any other service class will extend this class.
 * this provides wrapper for headers, response handler. it acts like interceptor.
 */
import {HTTP} from 'meteor/http';
export class BaseService{
    constructor() {
        this.erpGet = erpDb();
        this.ERPObjects = ERPObjects();
    }
    getHeaders(){
        var headers = {
            "database" : this.erpGet.ERPDatabase,
            "username" : this.erpGet.ERPUsername,
            "password" :  this.erpGet.ERPPassword
        };
        return headers;
    }
    getBaseUrl(){
        return URLRequest + this.erpGet.ERPIPAddress + ':' + this.erpGet.ERPPort + '/' + this.erpGet.ERPApi + '/';
    }

    getPostHeaders(){
        var postHeaders = {
            "database" : this.erpGet.ERPDatabase,
            "username" : this.erpGet.ERPUsername,
            "password" :  this.erpGet.ERPPassword
        };


        return postHeaders;
    }

    responseHandler(url, response) {
        if (response.statusCode === 200) {
            try {
              
              
              
            
            var content = JSON.parse(response.content);
            

                return content;
            }
            catch (e) {
                
            }
        } else {
            return response.headers.errormessage;
        }
    }

    GET(url){
        var that = this;
        var promise = new Promise(function(resolve, reject) {
            HTTP.get(that.getBaseUrl() + url, { headers : that.getHeaders()}, function(err, response){
                var data = that.responseHandler(url, response);
                if(err || !data){
                    reject(err);
                }
                if(data){
                    resolve(data);
                }
            });
        });
        return promise;
    }
    getList(objName, options){
        var that = this;
        let url = objName;
        function jsonToQueryString(json) {
            return '?' +
                Object.keys(json).map(function(key) {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
                }).join('&');
        }
        if(options){
            url += jsonToQueryString(options);
        }
        return that.GET(url);
    }
    getOneById(objName, id){
        let url = objName + '/' + id;
        return this.GET(url);
    }

    POST(url, data) {
        let that = this;
        let promise = new Promise(function (resolve, reject) {
            HTTP.post(that.getBaseUrl() + url, {headers: that.getPostHeaders(), data: data}, function (err, response) {
                let data = that.responseHandler(url, response);
                if(err){
                    reject(data);
                } else{
                    resolve(data);
                }
            });
        });
        return promise;
    }
}
