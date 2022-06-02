import { ReportService } from "../report-service";
import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";

let reportService = new ReportService();
let utilityService = new UtilityService();

Template.jobprofitabilityreport.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.dateAsAt = new ReactiveVar();
});

Template.jobprofitabilityreport.onRendered(() => {

    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    templateObject.dateAsAt.set(begunDate);

    $("#date-input,#dateTo,#dateFrom").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
        onChangeMonthYear: function(year, month, inst) {
            $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

});

Template.jobprofitabilityreport.events({
});

Template.jobprofitabilityreport.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function(a, b) {
    return a != b;
});

Template.registerHelper('containsequals', function(a, b) {
    return (a.indexOf(b) >= 0);
});
