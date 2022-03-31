import {BaseService} from "../js/base-service";
export class EmployeePayrollService extends BaseService {
  
  getAllEmployeePaySettings(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TEmployeepaysettings, options);
  }
  
  saveTEmployeepaysettings(data) {
    return this.POST(this.ERPObjects.TEmployeepaysettings, data);
  }
}