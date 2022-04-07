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
  const defaultSMSSettings = {
    'twilioAccountId': 'SIENGO23IEOG0kdJIGidng',
    'twilioAccountToken': 'DINGEI305IEG49DKFO9G9DEIGN',
    'twilioTelephoneNumber': '10333333333',
    'saveAppointmentSMS': 'Hi [Customer Name], This is [Employee Name] from [Company Name] confirming that we are booked in to be at' +
      ' [Full Address] at [Booked Time] to do the following service [Product/Service]. Please reply with Yes to confirm this booking' +
      ' or No if you wish to cancel it.',
    'startAppointmentSMS': 'Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we are on site' +
      ' and doing the following service [Product/Service].',
    'stopAppointmentSMS': 'Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we have finished' + 
      ' doing the following service [Product/Service].'
  };
  $('#twilioAccountId').val(defaultSMSSettings.twilioAccountId);
  $('#twilioAccountToken').val(defaultSMSSettings.twilioAccountToken);
  $('#twilioTelephoneNumber').val(defaultSMSSettings.twilioTelephoneNumber);
  $('#saveAppointmentSMS').val(defaultSMSSettings.saveAppointmentSMS);
  $('#startAppointmentSMS').val(defaultSMSSettings.startAppointmentSMS);
  $('#stopAppointmentSMS').val(defaultSMSSettings.stopAppointmentSMS);
  $('.fullScreenSpin').css('display','none');
});

Template.smssettings.helpers({
    
});
Template.smssettings.events({
    
});
