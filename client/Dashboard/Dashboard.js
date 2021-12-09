import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from './dashboard-service';
import 'gauge-chart';
Template.dashboard.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
});

Template.dashboard.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get('CloudDashboardModule');
  if (isDashboard) {
      templateObject.includeDashboard.set(true);
  }
});


Template.dashboard.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    loggedDb: function() {
        return Template.instance().loggedDb.get();
    },
    loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
   }
});

// Listen to event to update reactive variable
Template.dashboard.events({
'click .btnBatchUpdate': function () {
  $('.fullScreenSpin').css('display','inline-block');
    batchUpdateCall();
},
'click .progressbarcheck': function() {
    var valeur = 0;
    $('.loadingbar').css('width', valeur + '%').attr('aria-valuenow', valeur);
    $('input:checked').each(function() {
        if ($(this).attr('value') > valeur) {
            valeur = $(this).attr('value');
        }
    });
    $('.loadingbar').css('width', valeur + '%').attr('aria-valuenow', valeur);
    $(".progressBarInner").text("Invoices "+valeur+"%");
}
});
