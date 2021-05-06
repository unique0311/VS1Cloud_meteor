// import {PurchaseBoardService} from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
// import { CoreService } from '../js/core-service';
// import {EmployeeProfileService} from "../js/profile-service";
// import {AccountService} from "../accounts/account-service";
// import {UtilityService} from "../utility-service";
// import {PaymentsService} from '../payments/payments-service';
// let utilityService = new UtilityService();
Template.expensebreakdown.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.creditperc = new ReactiveVar();
  templateObject.billperc = new ReactiveVar();
  templateObject.poperc = new ReactiveVar();
  templateObject.billpercTotal = new ReactiveVar();
  templateObject.creditpercTotal = new ReactiveVar();
  templateObject.popercTotal = new ReactiveVar();
});


Template.expensebreakdown.onRendered(function() {

});
