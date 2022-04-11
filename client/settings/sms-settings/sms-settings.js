import {OrganisationService} from '../../js/organisation-service';
import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

Template.smssettings.onCreated(() => {
    
});

Template.smssettings.onRendered(function () {
  $('.fullScreenSpin').css('display','inline-block');

  //TODO: Get SMS Settings with API
  if (!localStorage.getItem('smsSettings')) {
    localStorage.setItem('smsSettings', JSON.stringify({
      twilioAccountId: "Your twilio account ID",
      twilioAccountToken: "Your twilio account token",
      twilioTelephoneNumber: "Your phone number",
      startAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we are on site and doing the following service [Product/Service].",
      saveAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] confirming that we are booked in to be at [Full Address] at [Booked Time] to do the following service [Product/Service]. Please reply with Yes to confirm this booking or No if you wish to cancel it.",
      stopAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we have finished doing the following service [Product/Service]."
    }));
  }
  const smsSettings = JSON.parse(localStorage.getItem('smsSettings'));

  $('#twilioAccountId').val(smsSettings.twilioAccountId);
  $('#twilioAccountToken').val(smsSettings.twilioAccountToken);
  $('#twilioTelephoneNumber').val(smsSettings.twilioTelephoneNumber);
  $('#saveAppointmentSMS').val(smsSettings.saveAppointmentSMSMessage);
  $('#startAppointmentSMS').val(smsSettings.startAppointmentSMSMessage);
  $('#stopAppointmentSMS').val(smsSettings.stopAppointmentSMSMessage);

  $('.fullScreenSpin').css('display','none');
});

Template.smssettings.events({
    'click #twilioSignUp': function() {
      window.location.href = "https://twilio.com/try-twilio";
    },
    'click #saveTwilioSettings': function() {
      $('.fullScreenSpin').css('display','inline-block');
      const accountId = $('#twilioAccountId').val();
      const accountToken = $('#twilioAccountToken').val();
      const phoneNumber = $('#twilioTelephoneNumber').val();
      const startMessage = $('#startAppointmentSMS').val();
      const stopMessage = $('#stopAppointmentSMS').val();
      const saveMessage = $('#saveAppointmentSMS').val();

      //TODO: Save SMS Settings with API
      localStorage.setItem('smsSettings', JSON.stringify({
        twilioAccountId: accountId,
        twilioAccountToken: accountToken,
        twilioTelephoneNumber: phoneNumber,
        startAppointmentSMSMessage: startMessage,
        saveAppointmentSMSMessage: saveMessage,
        stopAppointmentSMSMessage: stopMessage
      }));
      $('.fullScreenSpin').css('display','none');
      swal({
        title: 'SMS settings successfully updated!',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.value) {
          window.open('/settings','_self');
        } else if (result.dismiss === 'cancel') {}
      });
    }
});
