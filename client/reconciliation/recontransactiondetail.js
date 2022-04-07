import {PurchaseBoardService} from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.recontransactiondetail.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.recontransactiondetail.onRendered(function() {
    // $('.fullScreenSpin').css('display','inline-block');
    // let templateObject = Template.instance();
    // let accountService = new AccountService();
    // let purchaseService = new PurchaseBoardService();
    // const supplierList = [];
    // let billTable;
    // var splashArray = [];
    // const dataTableList = [];
    // const tableHeaderList = [];

    // if(FlowRouter.current().queryParams.success){
    //     $('.btnRefresh').addClass('btnRefreshAlert');
    // }

    // function MakeNegative() {
    //     $('td').each(function(){
    //         if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
    //     });
    // }

    // templateObject.resetData = function (dataVal) {
    //     window.open('/recontransactiondetail?page=last','_self');
    // };

    // var today = moment().format('DD/MM/YYYY');
    // var currentDate = new Date();
    // var begunDate = moment(currentDate).format("DD/MM/YYYY");
    // let fromDateMonth = (currentDate.getMonth() + 1);
    // let fromDateDay = currentDate.getDate();
    // if ((currentDate.getMonth()+1) < 10) {
    //     fromDateMonth = "0" + (currentDate.getMonth()+1);
    // }
    //
    // if (currentDate.getDate() < 10) {
    //     fromDateDay = "0" + currentDate.getDate();
    // }
    // var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    $("#date-input").datepicker({
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
    });
    //
    // $("#dateFrom").val(fromDate);
    // $("#dateTo").val(begunDate);


    // let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    // let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    // let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    // if(urlParametersDateFrom){
    //   if(urlParametersIgnoreDate == true){
    //     $('#dateFrom').attr('readonly', true);
    //     $('#dateTo').attr('readonly', true);
    //   }else{
    //
    //     $("#dateFrom").val(urlParametersDateFrom !=''? moment(urlParametersDateFrom).format("DD/MM/YYYY"): urlParametersDateFrom);
    //     $("#dateTo").val(urlParametersDateTo !=''? moment(urlParametersDateTo).format("DD/MM/YYYY"): urlParametersDateTo);
    //   }
    // }

});

Template.recontransactiondetail.events({

    // 'click .chkDatatable' : function(event){
    //     var columns = $('#tblrecontransactiondetail th');
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    //
    //     $.each(columns, function(i,v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];
    //
    //         if(v.innerText == columnDataValue){
    //             if($(event.target).is(':checked')){
    //                 $("."+replaceClass+"").css('display','table-cell');
    //                 $("."+replaceClass+"").css('padding','.75rem');
    //                 $("."+replaceClass+"").css('vertical-align','top');
    //             }else{
    //                 $("."+replaceClass+"").css('display','none');
    //             }
    //         }
    //     });
    // },
    // 'click .resetTable' : function(event){
    //     var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    //     if(getcurrentCloudDetails){
    //         if (getcurrentCloudDetails._id.length > 0) {
    //             var clientID = getcurrentCloudDetails._id;
    //             var clientUsername = getcurrentCloudDetails.cloudUsername;
    //             var clientEmail = getcurrentCloudDetails.cloudEmail;
    //             var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblrecontransactiondetail'});
    //             if (checkPrefDetails) {
    //                 CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
    //                     if (err) {
    //
    //                     }else{
    //                         Meteor._reload.reload();
    //                     }
    //                 });
    //
    //             }
    //         }
    //     }
    // },
    // 'click .saveTable' : function(event){
    //     let lineItems = [];
    //     $('.columnSettings').each(function (index) {
    //         var $tblrow = $(this);
    //         var colTitle = $tblrow.find(".divcolumn").text()||'';
    //         var colWidth = $tblrow.find(".custom-range").val()||0;
    //         var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
    //         var colHidden = false;
    //         colHidden = !$tblrow.find(".custom-control-input").is(':checked');
    //         let lineItemObj = {
    //             index: index,
    //             label: colTitle,
    //             hidden: colHidden,
    //             width: colWidth,
    //             thclass: colthClass
    //         };
    //
    //         lineItems.push(lineItemObj);
    //     });
    //
    //     var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    //     if(getcurrentCloudDetails){
    //         if (getcurrentCloudDetails._id.length > 0) {
    //             var clientID = getcurrentCloudDetails._id;
    //             var clientUsername = getcurrentCloudDetails.cloudUsername;
    //             var clientEmail = getcurrentCloudDetails.cloudEmail;
    //             var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblrecontransactiondetail'});
    //             if (checkPrefDetails) {
    //                 CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
    //                                                                            PrefGroup:'salesform',PrefName:'tblrecontransactiondetail',published:true,
    //                                                                            customFields:lineItems,
    //                                                                            updatedAt: new Date() }}, function(err, idTag) {
    //                     if (err) {
    //                         $('#myModal2').modal('toggle');
    //                     } else {
    //                         $('#myModal2').modal('toggle');
    //                     }
    //                 });
    //
    //             }else{
    //                 CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
    //                                         PrefGroup:'salesform',PrefName:'tblrecontransactiondetail',published:true,
    //                                         customFields:lineItems,
    //                                         createdAt: new Date() }, function(err, idTag) {
    //                     if (err) {
    //                         $('#myModal2').modal('toggle');
    //                     } else {
    //                         $('#myModal2').modal('toggle');
    //
    //                     }
    //                 });
    //
    //             }
    //         }
    //     }
    //
    // },
    // 'blur .divcolumn' : function(event){
    //     let columData = $(event.target).text();
    //     let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //     var datable = $('#tblrecontransactiondetail').DataTable();
    //     var title = datable.column( columnDatanIndex ).header();
    //     $(title).html(columData);
    //
    // },
    // 'change .rngRange' : function(event){
    //     let range = $(event.target).val();
    //     let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    //     var datable = $('#tblrecontransactiondetail th');
    //     $.each(datable, function(i,v) {
    //         if(v.innerText == columnDataValue){
    //             let className = v.className;
    //             let replaceClass = className.replace(/ /g, ".");
    //             $("."+replaceClass+"").css('width',range+'px');
    //
    //         }
    //     });
    //
    // },
    // 'click .btnOpenSettings' : function(event){
    //     let templateObject = Template.instance();
    //     var columns = $('#tblrecontransactiondetail th');
    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i,v) {
    //         if(v.hidden == false){
    //             columVisible =  true;
    //         }
    //         if((v.className.includes("hiddenColumn"))){
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");
    //
    //         let datatablerecordObj = {
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || '',
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },
    // 'click #exportbtn': function () {
    //     $('.fullScreenSpin').css('display','inline-block');
    //     jQuery('#tblrecontransactiondetail_wrapper .dt-buttons .btntabletocsv').click();
    //     $('.fullScreenSpin').css('display','none');
    //
    // },
    // 'click .btnRefresh': function () {
    //     $('.fullScreenSpin').css('display','inline-block');
    //     let templateObject = Template.instance();
    //     localStorage.setItem('statementdate', '');
    //
    //     var currentBeginDate = new Date();
    //     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //     let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //     let fromDateDay = currentBeginDate.getDate();
    //     if((currentBeginDate.getMonth()+1) < 10){
    //         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    //     }else{
    //       fromDateMonth = (currentBeginDate.getMonth()+1);
    //     }
    //
    //     if(currentBeginDate.getDate() < 10){
    //         fromDateDay = "0" + currentBeginDate.getDate();
    //     }
    //     var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //     let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
    //
    //     sideBarService.getAllTVS1BankDepositData(initialDataLoad,0).then(function(data) {
    //         addVS1Data('TVS1BankDeposit',JSON.stringify(data)).then(function (datareturn) {
    //
    //         }).catch(function (err) {
    //
    //         });
    //     }).catch(function(err) {
    //
    //     });
    //
    //     sideBarService.getAllTReconcilationListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(dataRecon) {
    //         addVS1Data('Trecontransactiondetail', JSON.stringify(dataRecon)).then(function(datareturn) {
    //           sideBarService.getAllReconcilationList(initialDataLoad,0).then(function(data) {
    //               addVS1Data('TReconciliation',JSON.stringify(data)).then(function (datareturn) {
    //                   window.open('/recontransactiondetail','_self');
    //               }).catch(function (err) {
    //                   window.open('/recontransactiondetail','_self');
    //               });
    //           }).catch(function(err) {
    //               window.open('/recontransactiondetail','_self');
    //           });
    //         }).catch(function(err) {
    //           sideBarService.getAllReconcilationList(initialDataLoad,0).then(function(data) {
    //               addVS1Data('TReconciliation',JSON.stringify(data)).then(function (datareturn) {
    //                   window.open('/recontransactiondetail','_self');
    //               }).catch(function (err) {
    //                   window.open('/recontransactiondetail','_self');
    //               });
    //           }).catch(function(err) {
    //               window.open('/recontransactiondetail','_self');
    //           });
    //         });
    //     }).catch(function(err) {
    //         window.open('/recontransactiondetail','_self');
    //     });
    //
    //
    // },
    // 'change #dateTo': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));
    //
    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //
    //     //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    //     var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
    //     //templateObject.dateAsAt.set(formatDate);
    //     if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {
    //
    //     } else {
    //       templateObject.getAllFilterReconData(formatDateFrom,formatDateTo, false);
    //     }
    //
    // },
    // 'change #dateFrom': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));
    //
    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //
    //     //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    //     var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
    //     //templateObject.dateAsAt.set(formatDate);
    //     if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {
    //
    //     } else {
    //         templateObject.getAllFilterReconData(formatDateFrom,formatDateTo, false);
    //     }
    //
    // },
    // 'click #today': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentBeginDate = new Date();
    //     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //     let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //     let fromDateDay = currentBeginDate.getDate();
    //     if((currentBeginDate.getMonth()+1) < 10){
    //         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    //     }else{
    //       fromDateMonth = (currentBeginDate.getMonth()+1);
    //     }
    //
    //     if(currentBeginDate.getDate() < 10){
    //         fromDateDay = "0" + currentBeginDate.getDate();
    //     }
    //     var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //     var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //
    //     var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //     var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //
    //     $("#dateFrom").val(toDateDisplayFrom);
    //     $("#dateTo").val(toDateDisplayTo);
    //     templateObject.getAllFilterReconData(toDateERPFrom,toDateERPTo, false);
    // },
    // 'click #lastweek': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentBeginDate = new Date();
    //     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //     let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //     let fromDateDay = currentBeginDate.getDate();
    //     if((currentBeginDate.getMonth()+1) < 10){
    //         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    //     }else{
    //       fromDateMonth = (currentBeginDate.getMonth()+1);
    //     }
    //
    //     if(currentBeginDate.getDate() < 10){
    //         fromDateDay = "0" + currentBeginDate.getDate();
    //     }
    //     var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
    //     var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //
    //     var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //     var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //
    //     $("#dateFrom").val(toDateDisplayFrom);
    //     $("#dateTo").val(toDateDisplayTo);
    //     templateObject.getAllFilterReconData(toDateERPFrom,toDateERPTo, false);
    // },
    // 'click #lastMonth': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //
    //     var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    //     var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);
    //
    //     var formatDateComponent = function(dateComponent) {
    //       return (dateComponent < 10 ? '0' : '') + dateComponent;
    //     };
    //
    //     var formatDate = function(date) {
    //       return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
    //     };
    //
    //     var formatDateERP = function(date) {
    //       return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
    //     };
    //
    //
    //     var fromDate = formatDate(prevMonthFirstDate);
    //     var toDate = formatDate(prevMonthLastDate);
    //
    //     $("#dateFrom").val(fromDate);
    //     $("#dateTo").val(toDate);
    //
    //     var getLoadDate = formatDateERP(prevMonthLastDate);
    //     let getDateFrom = formatDateERP(prevMonthFirstDate);
    //     templateObject.getAllFilterReconData(getDateFrom,getLoadDate, false);
    // },
    // 'click #lastQuarter': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //     function getQuarter(d) {
    //         d = d || new Date();
    //         var m = Math.floor(d.getMonth() / 3) + 2;
    //         return m > 4 ? m - 4 : m;
    //     }
    //
    //     var quarterAdjustment = (moment().month() % 3) + 1;
    //     var lastQuarterEndDate = moment().subtract({
    //         months: quarterAdjustment
    //     }).endOf('month');
    //     var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
    //         months: 2
    //     }).startOf('month');
    //
    //     var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
    //     var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");
    //
    //
    //     $("#dateFrom").val(lastQuarterStartDateFormat);
    //     $("#dateTo").val(lastQuarterEndDateFormat);
    //
    //     let fromDateMonth = getQuarter(currentDate);
    //     var quarterMonth = getQuarter(currentDate);
    //     let fromDateDay = currentDate.getDate();
    //
    //     var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    //     let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    //     templateObject.getAllFilterReconData(getDateFrom,getLoadDate, false);
    // },
    // 'click #last12Months': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //
    //     let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    //     let fromDateDay = currentDate.getDate();
    //     if ((currentDate.getMonth()+1) < 10) {
    //         fromDateMonth = "0" + (currentDate.getMonth()+1);
    //     }
    //     if (currentDate.getDate() < 10) {
    //         fromDateDay = "0" + currentDate.getDate();
    //     }
    //
    //     var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
    //     $("#dateFrom").val(fromDate);
    //     $("#dateTo").val(begunDate);
    //
    //     var currentDate2 = new Date();
    //     let fromDateMonth2;
    //     if ((currentDate2.getMonth()+1) < 10) {
    //         fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    //     }
    //     let fromDateDay2;
    //     if (currentDate2.getDate() < 10) {
    //         fromDateDay2 = "0" + currentDate2.getDate();
    //     }
    //     var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    //     let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
    //     templateObject.getAllFilterReconData(getDateFrom,getLoadDate, false);
    //
    // },
    // 'click #ignoreDate': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', true);
    //     $('#dateTo').attr('readonly', true);
    //     templateObject.getAllFilterReconData('', '', true);
    // },
    // 'click .printConfirm' : function(event){
    //
    //     $('.fullScreenSpin').css('display','inline-block');
    //     jQuery('#tblrecontransactiondetail_wrapper .dt-buttons .btntabletopdf').click();
    //     $('.fullScreenSpin').css('display','none');
    // }

});

Template.recontransactiondetail.helpers({
    // datatablerecords : () => {
    //     return Template.instance().datatablerecords.get().sort(function(a, b){
    //         if (a.recondate == 'NA') {
    //             return 1;
    //         }
    //         else if (b.recondate == 'NA') {
    //             return -1;
    //         }
    //         return (a.recondate.toUpperCase() > b.recondate.toUpperCase()) ? 1 : -1;
    //     });
    // },
    // tableheaderrecords: () => {
    //     return Template.instance().tableheaderrecords.get();
    // },
    // purchasesCloudPreferenceRec: () => {
    //     return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblrecontransactiondetail'});
    // }

});
