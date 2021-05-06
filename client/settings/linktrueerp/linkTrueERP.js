import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import 'colresizable/colResizable-1.6.min';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');

Template.linktrueerp.onRendered(function(){
  var erpGet = erpDb();
  let objDetailsUser = {
      Name: "VS1_DbConnectTest",
      Params: {
        ServerName: erpGet.ERPIPAddress,
        Databasename:erpGet.ERPDatabase,
        VS1UserName: erpGet.ERPUsername,
        VS1Password: erpGet.ERPPassword,
        APIPort:erpGet.ERPPort,
        IsHttps:erpGet.ERPUseSSL
    }
  };
    var oPost = new XMLHttpRequest();
    oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_DbConnectTest"', true);
    oPost.setRequestHeader("database",vs1loggedDatatbase);
    oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
    //var myString = JSON.stringify(objDetailsUser);

     oPost.send(myString);

  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {
    $('.led-red').css('display','none');
    $('.led-green').css('display','block');
  }else if(oPost.readyState == 4 && oPost.status == 403){
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');
  }else if(oPost.readyState == 4 && oPost.status == 406){
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');

  }else if(oPost.readyState == '') {
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');
  }
  }

});
Template.linktrueerp.events({
'click .btnSave': function () {
  var erpGet = erpDb();
  let firstName = $('.edtFirstName').val();
  let lastName = $('.edtLastName').val();
  let phoneNumber = $('.edtPhone').val();

  let serverName = $('.edtServerName').val();
  let databaseName = $('.edtDatabaseName').val();
  let portNo = $('.edtPortNo').val();
  let erpUsername = $('.edtERPUsername').val();
  let erpPassword = $('.edtERPPassword').val();

  var currentDate = new Date();
  var begunDate = moment(currentDate).format("YYYY-MM-DD");

  let objDetailsUser = {
      Name: "VS1_ChangeDatabase",
      Params: {
        ServerName: serverName,
        Databasename:databaseName,
        DatabasenameToChange: erpGet.ERPDatabase,
        VS1UserName: erpGet.ERPUsername,
        VS1Password: erpGet.ERPPassword,
        APIPort:portNo,
        IsHttps:false,
        EmployeeDetails:{
         FirstName:firstName,
         LastName:lastName,
         DateStarted:begunDate|| '',
         DOB:begunDate|| '',
         Sex:"M",
         Email:erpGet.ERPUsername,
         EmailsFromEmployeeAddress:true,
         Phone:phoneNumber
       },
       EmployeeDetails:{
         ERPUserName : erpUsername,
         ERPPassword : erpPassword
       }
    }
  };
    var oPost = new XMLHttpRequest();
    oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_ChangeDatabase"', true);
    oPost.setRequestHeader("database",vs1loggedDatatbase);
    oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    //var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
    var myString = JSON.stringify(objDetailsUser);

     oPost.send(myString);

  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {

      $('.fullScreenSpin').css('display','none');
      var myArrResponse = JSON.parse(oPost.responseText);
      if(myArrResponse.ProcessLog.Error){
        swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
      }else{
        swal({
        title: 'Database Successfully Linked to VS1',
        text: "Please log out to activate your changes.",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
        }).then((result) => {
          let getLasTDatabase = erpGet.ERPDatabase;
           if(getLasTDatabase){
             deleteStoreDatabase(getLasTDatabase).then(function(data) {
               window.open('/','_self');
               }).catch(function (err) {
                 window.open('/','_self');
               });
           }else{
             window.open('/','_self');
           }
        });

      }

  }else if(oPost.readyState == 4 && oPost.status == 403){
  $('.fullScreenSpin').css('display','none');
  swal({
  title: 'Something went wrong',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
  // Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
  });
  }else if(oPost.readyState == 4 && oPost.status == 406){
    $('.fullScreenSpin').css('display','none');
    var ErrorResponse = oPost.getResponseHeader('errormessage');
    var segError = ErrorResponse.split(':');

  if((segError[1]) == ' "Unable to lock object'){

    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

  }else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
  }
  }
},
'click .btnBack':function(event){
  event.preventDefault();
  history.back();
},
'keydown .edtPortNo': function(event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (event.keyCode >= 35 && event.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }

    if (event.shiftKey == true) {
        event.preventDefault();
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 ||
        event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
        event.preventDefault();
    }
}
});
