import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";

let reportService = new ReportService();
let utilityService = new UtilityService();
Template.trialbalance.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.grandrecords = new ReactiveVar();
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();
});

Template.trialbalance.onRendered(()=>{
  $('.fullScreenSpin').css('display','inline-block');
  const templateObject = Template.instance();
  let utilityService = new UtilityService();
  let salesOrderTable;
  var splashArray = new Array();
  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }

  let imageData= (localStorage.getItem("Image"));
  if(imageData)
  {
      $('#uploadedImage').attr('src', imageData);
      $('#uploadedImage').attr('width','50%');
  }

  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  // let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + ;
  var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();
  templateObject.dateAsAt.set(begunDate);
 const dataTableList = [];
 const deptrecords = [];
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
      onChangeMonthYear: function(year, month, inst){
      // Set date to picker
      $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
      // Hide (close) the picker
      // $(this).datepicker('hide');
      // // Change ttrigger the on change function
      // $(this).trigger('change');
     }
  });

   $("#dateFrom").val(fromDate);
   $("#dateTo").val(begunDate);

    templateObject.getTrialBalanceReports = function (dateFrom, dateTo, ignoreDate) {
      if(!localStorage.getItem('VS1TrialBalance_Report')){
        reportService.getTrialBalanceDetailsData(dateFrom, dateTo, ignoreDate).then(function (data) {
          let totalRecord = [];
          let grandtotalRecord = [];

        if(data.ttrialbalancereport.length){
          localStorage.setItem('VS1TrialBalance_Report', JSON.stringify(data)||'');
          let records = [];
          let allRecords = [];
          let current = [];

          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.ttrialbalancereport;
          let accountType = '';

          for (let i = 0; i < accountData.length; i++) {

            let recordObj = {};
          recordObj.Id = data.ttrialbalancereport[i].TransID;
          recordObj.type = data.ttrialbalancereport[i].Account;
          recordObj.AccountName = data.ttrialbalancereport[i].AccountName;
          recordObj.dataArr = [
              '',
              data.ttrialbalancereport[i].AccountNumber,
              data.ttrialbalancereport[i].Account,
              utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].CreditsEx) || '-',
              utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].DebitsEx) || '-',

          ];

          records.push(recordObj);



        }
        records = _.sortBy(records, 'AccountName');
        records = _.groupBy(records, 'AccountName');

        for (let key in records) {
            let obj = [{key: key}, {data: records[key]}];
            allRecords.push(obj);
        }

        let iterator = 0;
      for (let i = 0; i < allRecords.length; i++) {
          let amountduetotal = 0;
          let Currenttotal = 0;
          let creditEx = 0;
          let debitEx = 0;
          let twoMonth = 0;
          let threeMonth = 0;
          let Older = 0;
          const currencyLength = Currency.length;
          for (let k = 0; k < allRecords[i][1].data.length; k++) {

              creditEx = creditEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[3]);
              debitEx = debitEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
          }
          let val = ['Total ' + allRecords[i][0].key+'', '', '',

              utilityService.modifynegativeCurrencyFormat(creditEx),
              utilityService.modifynegativeCurrencyFormat(debitEx)];
          current.push(val);

      }

//grandtotalRecord
let grandamountduetotal = 0;
let grandCurrenttotal = 0;
let grandlessTnMonth = 0;
let grandCreditEx = 0;
let grandDebitEx = 0;
let grandthreeMonth = 0;
let grandOlder = 0;

    for (let n = 0; n < current.length; n++) {

        const grandcurrencyLength = Currency.length;

        //for (let m = 0; m < current[n].data.length; m++) {

             grandCreditEx = grandCreditEx + utilityService.convertSubstringParseFloat(current[n][3]);
             grandDebitEx = grandDebitEx + utilityService.convertSubstringParseFloat(current[n][4]);


    }

    let grandval = ['Grand Total ' +  '', '','',
        utilityService.modifynegativeCurrencyFormat(grandCreditEx),
        utilityService.modifynegativeCurrencyFormat(grandDebitEx)];

      for (let key in records) {
          let dataArr = current[iterator]
          let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
          totalRecord.push(obj);
          iterator += 1;
      }

        templateObject.records.set(totalRecord);
        templateObject.grandrecords.set(grandval);


        if(templateObject.records.get()){
        setTimeout(function () {
          $('td a').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
         $('td').each(function(){
           if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
          });

          $('td').each(function(){

            let lineValue = $(this).first().text()[0];
            if(lineValue != undefined){
              if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
            }

           });

           $('td').each(function(){
             if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
            });

            $('.fullScreenSpin').css('display','none');
        }, 100);
        }


      }else{
        let records = [];
        let recordObj = {};
        recordObj.Id = '';
        recordObj.type = '';
        recordObj.AccountName = ' ';
        recordObj.dataArr = [
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
           '-'
        ];

        records.push(recordObj);
        templateObject.records.set(records);
        templateObject.grandrecords.set('');
          $('.fullScreenSpin').css('display','none');
      }

        }).catch(function (err) {
          //Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
        });
      }else{
        let data = JSON.parse(localStorage.getItem('VS1TrialBalance_Report'));
        let totalRecord = [];
        let grandtotalRecord = [];

      if(data.ttrialbalancereport.length){
        let records = [];
        let allRecords = [];
        let current = [];

        let totalNetAssets = 0;
        let GrandTotalLiability = 0;
        let GrandTotalAsset = 0;
        let incArr = [];
        let cogsArr = [];
        let expArr = [];
        let accountData = data.ttrialbalancereport;
        let accountType = '';

        for (let i = 0; i < accountData.length; i++) {

          let recordObj = {};
        recordObj.Id = data.ttrialbalancereport[i].TransID;
        recordObj.type = data.ttrialbalancereport[i].Account;
        recordObj.AccountName = data.ttrialbalancereport[i].AccountName;
        recordObj.dataArr = [
            '',
            data.ttrialbalancereport[i].AccountNumber,
            data.ttrialbalancereport[i].Account,
            utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].CreditsEx) || '-',
            utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].DebitsEx) || '-',

        ];

        records.push(recordObj);



      }
      records = _.sortBy(records, 'AccountName');
      records = _.groupBy(records, 'AccountName');

      for (let key in records) {
          let obj = [{key: key}, {data: records[key]}];
          allRecords.push(obj);
      }

      let iterator = 0;
    for (let i = 0; i < allRecords.length; i++) {
        let amountduetotal = 0;
        let Currenttotal = 0;
        let creditEx = 0;
        let debitEx = 0;
        let twoMonth = 0;
        let threeMonth = 0;
        let Older = 0;
        const currencyLength = Currency.length;
        for (let k = 0; k < allRecords[i][1].data.length; k++) {

            creditEx = creditEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[3]);
            debitEx = debitEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
        }
        let val = ['Total ' + allRecords[i][0].key+'', '', '',

            utilityService.modifynegativeCurrencyFormat(creditEx),
            utilityService.modifynegativeCurrencyFormat(debitEx)];
        current.push(val);

    }

//grandtotalRecord
let grandamountduetotal = 0;
let grandCurrenttotal = 0;
let grandlessTnMonth = 0;
let grandCreditEx = 0;
let grandDebitEx = 0;
let grandthreeMonth = 0;
let grandOlder = 0;

  for (let n = 0; n < current.length; n++) {

      const grandcurrencyLength = Currency.length;

      //for (let m = 0; m < current[n].data.length; m++) {

           grandCreditEx = grandCreditEx + utilityService.convertSubstringParseFloat(current[n][3]);
           grandDebitEx = grandDebitEx + utilityService.convertSubstringParseFloat(current[n][4]);


  }

  let grandval = ['Grand Total ' +  '', '','',
      utilityService.modifynegativeCurrencyFormat(grandCreditEx),
      utilityService.modifynegativeCurrencyFormat(grandDebitEx)];

    for (let key in records) {
        let dataArr = current[iterator]
        let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
        totalRecord.push(obj);
        iterator += 1;
    }

      templateObject.records.set(totalRecord);
      templateObject.grandrecords.set(grandval);


      if(templateObject.records.get()){
      setTimeout(function () {
        $('td a').each(function(){
          if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
           });
       $('td').each(function(){
         if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });

        $('td').each(function(){

          let lineValue = $(this).first().text()[0];
          if(lineValue != undefined){
            if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
          }

         });

         $('td').each(function(){
           if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
          });

          $('.fullScreenSpin').css('display','none');
      }, 100);
      }


    }else{
      let records = [];
      let recordObj = {};
      recordObj.Id = '';
      recordObj.type = '';
      recordObj.AccountName = ' ';
      recordObj.dataArr = [
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
         '-'
      ];

      records.push(recordObj);
      templateObject.records.set(records);
      templateObject.grandrecords.set('');
        $('.fullScreenSpin').css('display','none');
    }
      }
    };

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");

    let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();

    templateObject.getTrialBalanceReports(getDateFrom,getLoadDate,false);

    templateObject.getDepartments = function(){
      reportService.getDepartment().then(function(data){
        for(let i in data.tdeptclass){

          let deptrecordObj = {
            id: data.tdeptclass[i].Id || ' ',
            department: data.tdeptclass[i].DeptClassName || ' ',
          };

          deptrecords.push(deptrecordObj);
          templateObject.deptrecords.set(deptrecords);

        }
    });

    }
    // templateObject.getAllProductData();
    templateObject.getDepartments();
  });

  Template.trialbalance.events({
    'click td a':function (event) {
        let id= $(event.target).closest('tr').attr('id').split("item-value-");
        var accountName =$(event.target).closest('tr').attr('class');

        var fromDate = new Date($("#dateFrom").datepicker("getDate"));
        var toDate = new Date($("#dateTo").datepicker("getDate"));

        // let toDate = dateFrom.getFullYear() + "/" + (dateFrom.getMonth()+1) + "/" + dateFrom.getDate();
        // let fromDate = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();
        window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'change #dateTo':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();


        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getTrialBalanceReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getTrialBalanceReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);
    },
    'change #dateFrom':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();


        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getTrialBalanceReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getTrialBalanceReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);
    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1TrialBalance_Report', '');
      Meteor._reload.reload();
    },
    'click .btnPrintReport':function (event) {
      document.title = 'Trial Balance Report';
      $(".printReport").print({
          title   :  document.title +" | Trial Balance | "+loggedCompany,
          noPrintSelector : ".addSummaryEditor",
      })
    },
    'click .btnExportReport':function() {
      $('.fullScreenSpin').css('display','inline-block');
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        const filename = loggedCompany + '-Trial Balance' + '.csv';
        utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
        let rows = [];
        // reportService.getTrialBalanceDetailsData(formatDateFrom,formatDateTo,false).then(function (data) {
        //     if(data.ttrialbalancereport){
        //         rows[0] = ['Account Name', 'Account No.', 'Account', 'Credit (Ex)', 'Debit (Ex)'];
        //         data.ttrialbalancereport.forEach(function (e, i) {
        //             rows.push([
        //               data.ttrialbalancereport[i].AccountName,
        //               data.ttrialbalancereport[i].AccountNumber,
        //               data.ttrialbalancereport[i].Account,
        //
        //               utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].CreditsEx) || '0.00',
        //               utilityService.modifynegativeCurrencyFormat(data.ttrialbalancereport[i].DebitsEx) || '0.00']);
        //         });
        //         setTimeout(function () {
        //             utilityService.exportReportToCsv(rows, filename, 'xls');
        //             $('.fullScreenSpin').css('display','none');
        //         }, 1000);
        //     }
        //
        // });
    },
    'click #lastMonth':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        localStorage.setItem('VS1Sales_Report', '');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function(dateComponent) {
          return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
          return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
          return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        var getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getTrialBalanceReports(getDateFrom,getLoadDate,false);

    },
    'click #lastQuarter':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        localStorage.setItem('VS1Sales_Report', '');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        function getQuarter(d) {
          d = d || new Date();
          var m = Math.floor(d.getMonth()/3) + 2;
          return m > 4? m - 4 : m;
        }

        var quarterAdjustment= (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 2 }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");

        templateObject.dateAsAt.set(lastQuarterStartDateFormat);
        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);


        let fromDateMonth = getQuarter(currentDate);
        var quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();

        var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getTrialBalanceReports(getDateFrom,getLoadDate,false);

    },
    'click #last12Months':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1Sales_Report', '');
      $('#dateFrom').attr('readonly', false);
      $('#dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      let fromDateMonth = Math.floor(currentDate.getMonth()+1);
      let fromDateDay = currentDate.getDate();
      if((currentDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentDate.getMonth()+1);
      }
      if(currentDate.getDate() < 10){
      fromDateDay = "0" + currentDate.getDate();
      }

      var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() -1);
      templateObject.dateAsAt.set(begunDate);
      $("#dateFrom").val(fromDate);
      $("#dateTo").val(begunDate);

      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      let getDateFrom = Math.floor(currentDate2.getFullYear()-1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate() ;
      templateObject.getTrialBalanceReports(getDateFrom,getLoadDate,false);


    },
    'click #ignoreDate':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1Sales_Report', '');
      $('#dateFrom').attr('readonly', true);
      $('#dateTo').attr('readonly', true);
      templateObject.dateAsAt.set('Current Date');
      templateObject.getTrialBalanceReports('','',true);

    },
    'keyup #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    },
    'blur #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    }

  });
  Template.trialbalance.helpers({
    records : () => {
       return Template.instance().records.get();
    },

    grandrecords: () => {
       return Template.instance().grandrecords.get();
   },
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    companyname: () =>{
        return loggedCompany;
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
          if (a.department == 'NA') {
        return 1;
            }
        else if (b.department == 'NA') {
          return -1;
        }
      return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
      });
    }
  });
  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });

  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });

  Template.registerHelper('containsequals', function (a, b) {
      return (a.indexOf(b) >= 0 );
  });
