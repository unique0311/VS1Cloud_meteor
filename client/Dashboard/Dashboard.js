import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from './dashboard-service';
import 'gauge-chart';
Template.dashboard.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
});

Template.dashboard.onRendered(function () {


});


Template.dashboard.helpers({
    loggedDb: function() {
        return Template.instance().loggedDb.get();
    },
    loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
   }
});

// Listen to event to update reactive variable
Template.dashboard.events({
    //to do
});
