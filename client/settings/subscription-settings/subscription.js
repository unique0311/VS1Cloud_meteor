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
             window.open('https://phpstack-473757-1915640.cloudwaysapps.com/vs1subscription/cancelsubscription.php?email='+loggeduserEmail+'','_self');
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
  }
});
