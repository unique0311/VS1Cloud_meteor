import {EmployeeProfileService} from './profile-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
Template.myAccount.onRendered(function(){
  var employeeProfileService = new EmployeeProfileService();
  getEmployeeProfiles();

  function getEmployeeProfiles () {

      employeeProfileService.getEmployeeProfile().then((dataListRet)=>{
    //var dataListRet = JSON.parse(oReq.responseText)
    for (var event in dataListRet) {
    var dataCopy = dataListRet[event];
    for (var data in dataCopy) {
    var mainData = dataCopy[data];
    var customerEmail = mainData.Email;

    if(customerEmail != ''){
      document.getElementById("useremail").innerHTML = 'Your current email address is <b>'+ customerEmail +'</b>';
    }else{
      document.getElementById("useremail").innerHTML = '<a href="/settings/user"> + Add email address</a>';
    }



    }
    }

  });
}



});
