import {EmployeeProfileService} from './profile-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
Template.emailSettings.onRendered(function(){

  var employeeProfileService = new EmployeeProfileService();
  getEmployeeProfiles();

  function getEmployeeProfiles () {

      employeeProfileService.getEmployeeProfile().then((dataListRet)=>{
    //var dataListRet = JSON.parse(oReq.responseText)
    for (var event in dataListRet) {
    var dataCopy = dataListRet[event];
    for (var data in dataCopy) {
    var mainData = dataCopy[data];
    var userEmail = mainData.Email;

    if(userEmail != ""){
      //markusjones041@gmail.com
      document.getElementById("loggeduseremail").innerHTML = '&lt;'+userEmail+'&gt;';
      document.getElementById("loggeduseremailEdit").innerHTML = '&lt;'+userEmail+'&gt;';
      $('#sltnew_email').append($('<option>', {value:userEmail, text:userEmail}));

    }else{
      //document.getElementById("loggedUserJobTitle").innerHTML = '<a href="/settings/user"> + Add Job Title</a>';
    }



    }
    }

  });
}


var LoggedUser = localStorage.getItem('mySession');
document.getElementById("loggedusername").innerHTML = LoggedUser;
document.getElementById("loggedusernameEdit").innerHTML = LoggedUser;

});
