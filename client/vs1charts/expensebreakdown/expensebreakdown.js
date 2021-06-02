
import { ReactiveVar } from 'meteor/reactive-var';





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
