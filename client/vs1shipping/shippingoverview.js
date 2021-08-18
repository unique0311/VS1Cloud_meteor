import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.vs1shipping.onCreated(function(){
});

Template.vs1shipping.onRendered(function() {
});

Template.vs1shipping.events({
    'click .btnScan': function (e) {
        Router.go('/shippingdocket');
    }
});

Template.vs1shipping.helpers({
});
