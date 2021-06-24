import {OrganisationService} from '../../js/organisation-service';
import {CountryService} from '../../js/country-service';
import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();


Template.subscriptionSettings.onCreated(() => {

});

Template.subscriptionSettings.onRendered(function () {
  var erpGet = erpDb();
  var oReq = new XMLHttpRequest();
  oReq.open("GET",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/TVS1_Clients_Simple?ListType="Detail"&select=[Databasename]="'+erpGet.ERPDatabase+'"', true);
  oReq.setRequestHeader("database",vs1loggedDatatbase);
  oReq.setRequestHeader("username",'VS1_Cloud_Admin');
  oReq.setRequestHeader("password",'DptfGw83mFl1j&9');
  oReq.send();
   oReq.onreadystatechange = function() {
   if(oReq.readyState == 4 && oReq.status == 200) {
     var data = JSON.parse(oReq.responseText);
     $('#txtCardID').val(data.tvs1_clients_simple[0].fields.ID||'');
     $('#txtCardNo').val(data.tvs1_clients_simple[0].fields.CreditCardNumber||'');
     $('#txtExpireDate').val(data.tvs1_clients_simple[0].fields.CreditCardExpiryMonth+'/'+data.tvs1_clients_simple[0].fields.CreditCardExpiryYear);
     $('#txtCVC').val(data.tvs1_clients_simple[0].fields.CreditCardCVC||'');
   }
 }
});

Template.subscriptionSettings.events({
  'click .btnBack':function(event){
    event.preventDefault();
    history.back();
  },
  'click .btnAddVS1User':function(event){
    swal({
      title: 'Is this an existing Employee?',
      text: '',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        swal("Please select the employee from the list below.", "", "info");
        $('#employeeListModal').modal('toggle');
      // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === 'cancel') {
        Router.go('/employeescard?addvs1user=true');
      }
    })
  },
  'click .btnCancelSub': function (event) {
    let loggeduserEmail = localStorage.getItem('mySession');
    swal({
      title: 'Are you sure you want to cancel this subscription?',
      text: '',
      type: 'question',
      showCancelButton: true,
      // cancelButtonClass: "btn-success",
      cancelButtonClass: "btn-danger",
      confirmButtonText: 'No',
      cancelButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {

      } else if (result.dismiss === 'cancel') {

        swal({
          title: 'Reason For Cancellation?',
          text: "Sorry to see you go, please comment below the reason you want to go.",
          input: 'textarea',
          inputAttributes: {
            id: 'edtFeedback',
            name: 'edtFeedback'
          },
          showCancelButton: true,
          confirmButtonText: 'OK',
          showLoaderOnConfirm: true
        }).then((inputValue) => {
          if (inputValue.value === "") {
            swal({
            title: 'Successfully Cancel Your Subscription',
            text: '',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             window.open('https://www.depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email='+loggeduserEmail+'','_self');
            } else if (result.dismiss === 'cancel') {

            }
            });
          }else if (inputValue.value != "") {
            Meteor.call('sendEmail', {
                from: "VS1 Cloud <info@vs1cloud.com>",
                to: 'info@vs1cloud.com',
                subject: loggeduserEmail+': Reason For Cancellation',
                text: inputValue.value,
                html:''
            }, function (error, result) {

            });

            swal({
            title: 'Successfully Cancel Your Subscription',
            text: 'Thank you for the Feedback, We will work on solving the issue',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             window.open('https://www.depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email='+loggeduserEmail+'','_self');
            } else if (result.dismiss === 'cancel') {

            }
            });

          }else{

          }




      });



       }
    });
  },
  'click .btnSaveCreditCard': function (event) {
    let lineID = $('#txtCardID').val();
    $('.fullScreenSpin').css('display', 'inline-block');
    let objDetails = {
        type: "TVS1_Clients_Simple",
        fields: {
          ID: parseInt(lineID)||0,
          CreditCardCVC:$('#txtCVC').val(),
          CreditCardNumber: $('#txtCardNo').val()
          // VS1UserName: erpGet.ERPUsername,
          // VS1Password: erpGet.ERPPassword,
          // APIPort:parseFloat(portNo)||0
      }
    };
      var oPost = new XMLHttpRequest();
      oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/TVS1_Clients_Simple', true);
      oPost.setRequestHeader("database",vs1loggedDatatbase);
      oPost.setRequestHeader("username",'VS1_Cloud_Admin');
      oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
      oPost.setRequestHeader("Accept", "application/json");
      oPost.setRequestHeader("Accept", "application/html");
      oPost.setRequestHeader("Content-type", "application/json");
      //var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
      var myString = JSON.stringify(objDetails);
      if(lineID != ''){
       oPost.send(myString);

       oPost.onreadystatechange = function() {
    if(oPost.readyState == 4 && oPost.status == 200) {

        $('.fullScreenSpin').css('display','none');
      window.open('/subscriptionSettings','_self');

    }else if(oPost.readyState == 4 && oPost.status == 403){
    $('.fullScreenSpin').css('display','none');
    swal({
    title: 'Oooops...',
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
      }else{
        window.open('/subscriptionSettings','_self');
      }
  }
});
