import { PaymentsService } from '../../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { EmployeeProfileService } from "../../js/profile-service";
import { AccountService } from "../../accounts/account-service";
import { UtilityService } from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.tasklist.onCreated(function() {

});

Template.tasklist.onRendered(function() {

});

Template.tasklist.events({
    'click .newProject': function(event) {
    }
});

Template.tasklist.helpers({

});
