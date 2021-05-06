import {PaymentsService} from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.customerawaitingpayments.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.selectedAwaitingPayment = new ReactiveVar([]);
});

Template.customerawaitingpayments.onRendered(function() {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let paymentService = new PaymentsService();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];


  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcustomerAwaitingPayment', function(error, result){
  if(error){

  }else{
    if(result){
      //console.log(result);
      for (let i = 0; i < result.customFields.length; i++) {
        let customcolumn = result.customFields;
        let columData = customcolumn[i].label;
        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
        let hiddenColumn = customcolumn[i].hidden;
        let columnClass = columHeaderUpdate.split('.')[1];
        let columnWidth = customcolumn[i].width;
        // let columnindex = customcolumn[i].index + 1;
         $("th."+columnClass+"").html(columData);
          $("th."+columnClass+"").css('width',""+columnWidth+"px");

      }
    }

  }
  });

  function MakeNegative() {
    $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
     });
  };
  // $('#tblcustomerAwaitingPayment').DataTable();
  templateObject.getAllSupplierPaymentData = function () {
    getVS1Data('TInvoiceEx').then(function (dataObject) {
    if(dataObject.length == 0){
      paymentService.getAllAwaitingInvoiceDetails().then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        for(let i=0; i<data.tinvoiceex.length; i++){
          let amount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalAmountInc)|| 0.00;
          let applied = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalPaid) || 0.00;
          // Currency+''+data.tinvoiceex[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
          let balance = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalAmountInc)|| 0.00;
             var dataList = {
             id: data.tinvoiceex[i].Id || '',
                 sortdate: data.tinvoiceex[i].SaleDate !=''? moment(data.tinvoiceex[i].SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].SaleDate,
             paymentdate: data.tinvoiceex[i].SaleDate !=''? moment(data.tinvoiceex[i].SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].SaleDate,
             customername: data.tinvoiceex[i].CustomerName || '',
             paymentamount: amount || 0.00,
             applied: applied || 0.00,
             balance: balance || 0.00,
             originalamount: totalOrginialAmount || 0.00,
             outsandingamount: totalOutstanding || 0.00,
             // bankaccount: data.tinvoiceex[i].GLAccountName || '',
             department: data.tinvoiceex[i].SaleClassName || '',
             refno: data.tinvoiceex[i].ReferenceNo || '',
             paymentmethod: data.tinvoiceex[i].PaymentMethodName || '',
             notes: data.tinvoiceex[i].Comments || ''
           };
           if(data.tinvoiceex[i].TotalBalance != 0){
             dataTableList.push(dataList);
           }

        }
        templateObject.datatablerecords.set(dataTableList);
        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcustomerAwaitingPayment', function(error, result){
          if(error){

          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split('.')[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if(hiddenColumn == true){

                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
                }

              }
            }

          }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        setTimeout(function () {
          //$.fn.dataTable.moment('DD/MM/YY');
            $('#tblcustomerAwaitingPayment').DataTable({
                  columnDefs: [
                      { "orderable": false, "targets": 0 },
                      {type: 'date', targets: 1}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "supplierpayment_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Supplier Payment',
                      filename: "supplierpayment_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  colReorder: {
                      fixedColumnsLeft: 1
                  },
                  // bStateSave: true,
                  // rowId: 0,
                  paging: false,
                  "scrollY": "400px",
                  "scrollCollapse": true,
                  // pageLength: 25,
                  // lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 1, "desc" ]],
                  // "aaSorting": [[1,'desc']],
                  action: function () {
                      $('#tblcustomerAwaitingPayment').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },

              }).on('page', function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
              $('.fullScreenSpin').css('display','none');
          }, 0);

          var columns = $('#tblcustomerAwaitingPayment th');
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function(i,v) {
            if(v.hidden == false){
              columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
              columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            //console.log(sWidth);
            let datatablerecordObj = {
              sTitle: v.innerText || '',
              sWidth: sWidth || '',
              sIndex: v.cellIndex || '',
              sVisible: columVisible || false,
              sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
          });
        templateObject.tableheaderrecords.set(tableHeaderList);
         $('div.dataTables_filter input').addClass('form-control form-control-sm');
         $('#tblcustomerAwaitingPayment tbody').on( 'click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
         var listData = $(this).closest('tr').attr('id');
         if(listData){
           Router.go('/paymentcard?invid='+ listData);
         }
       });

      }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display','none');
          // Meteor._reload.reload();
      });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tinvoiceex;
      let lineItems = [];
let lineItemObj = {};
for(let i=0; i<useData.length; i++){
  let amount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc)|| 0.00;
  let applied = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid) || 0.00;
  // Currency+''+useData[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
  let balance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
  let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
  let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc)|| 0.00;
     var dataList = {
     id: useData[i].fields.ID || '',
         sortdate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("YYYY/MM/DD"): useData[i].fields.SaleDate,
     paymentdate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("DD/MM/YYYY"): useData[i].fields.SaleDate,
     customername: useData[i].fields.CustomerName || '',
     paymentamount: amount || 0.00,
     applied: applied || 0.00,
     balance: balance || 0.00,
     originalamount: totalOrginialAmount || 0.00,
     outsandingamount: totalOutstanding || 0.00,
     // bankaccount: useData[i].GLAccountName || '',
     department: useData[i].fields.SaleClassName || '',
     refno: useData[i].fields.ReferenceNo || '',
     paymentmethod: useData[i].fields.PaymentMethodName || '',
     notes: useData[i].fields.Comments || ''
   };
   if(useData[i].fields.TotalBalance != 0){
     dataTableList.push(dataList);
   }

}
templateObject.datatablerecords.set(dataTableList);
if(templateObject.datatablerecords.get()){

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcustomerAwaitingPayment', function(error, result){
  if(error){

  }else{
    if(result){
      for (let i = 0; i < result.customFields.length; i++) {
        let customcolumn = result.customFields;
        let columData = customcolumn[i].label;
        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
        let hiddenColumn = customcolumn[i].hidden;
        let columnClass = columHeaderUpdate.split('.')[1];
        let columnWidth = customcolumn[i].width;
        let columnindex = customcolumn[i].index + 1;

        if(hiddenColumn == true){

          $("."+columnClass+"").addClass('hiddenColumn');
          $("."+columnClass+"").removeClass('showColumn');
        }else if(hiddenColumn == false){
          $("."+columnClass+"").removeClass('hiddenColumn');
          $("."+columnClass+"").addClass('showColumn');
        }

      }
    }

  }
  });


  setTimeout(function () {
    MakeNegative();
  }, 100);
}

$('.fullScreenSpin').css('display','none');
setTimeout(function () {
  //$.fn.dataTable.moment('DD/MM/YY');
    $('#tblcustomerAwaitingPayment').DataTable({
          columnDefs: [
              { "orderable": false, "targets": 0 },
              {type: 'date', targets: 1}
          ],
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          buttons: [
                {
             extend: 'excelHtml5',
             text: '',
             download: 'open',
             className: "btntabletocsv hiddenColumn",
             filename: "supplierpayment_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }
          },{
              extend: 'print',
              download: 'open',
              className: "btntabletopdf hiddenColumn",
              text: '',
              title: 'Supplier Payment',
              filename: "supplierpayment_"+ moment().format(),
              exportOptions: {
              columns: ':visible'
            }
          }],
          select: true,
          destroy: true,
          colReorder: true,
          colReorder: {
              fixedColumnsLeft: 1
          },
          // bStateSave: true,
          // rowId: 0,
          paging: false,
          "scrollY": "400px",
          "scrollCollapse": true,
          // pageLength: 25,
          // lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
          info: true,
          responsive: true,
          "order": [[ 1, "desc" ]],
          // "aaSorting": [[1,'desc']],
          action: function () {
              $('#tblcustomerAwaitingPayment').DataTable().ajax.reload();
          },
          "fnDrawCallback": function (oSettings) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          },

      }).on('page', function () {
        setTimeout(function () {
          MakeNegative();
        }, 100);
          let draftRecord = templateObject.datatablerecords.get();
          templateObject.datatablerecords.set(draftRecord);
      }).on('column-reorder', function () {

      }).on( 'length.dt', function ( e, settings, len ) {
        setTimeout(function () {
          MakeNegative();
        }, 100);
      });
      $('.fullScreenSpin').css('display','none');
  }, 0);

  var columns = $('#tblcustomerAwaitingPayment th');
  let sTible = "";
  let sWidth = "";
  let sIndex = "";
  let sVisible = "";
  let columVisible = false;
  let sClass = "";
  $.each(columns, function(i,v) {
    if(v.hidden == false){
      columVisible =  true;
    }
    if((v.className.includes("hiddenColumn"))){
      columVisible = false;
    }
    sWidth = v.style.width.replace('px', "");
    //console.log(sWidth);
    let datatablerecordObj = {
      sTitle: v.innerText || '',
      sWidth: sWidth || '',
      sIndex: v.cellIndex || '',
      sVisible: columVisible || false,
      sClass: v.className || ''
    };
    tableHeaderList.push(datatablerecordObj);
  });
templateObject.tableheaderrecords.set(tableHeaderList);
 $('div.dataTables_filter input').addClass('form-control form-control-sm');
 $('#tblcustomerAwaitingPayment tbody').on( 'click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
 var listData = $(this).closest('tr').attr('id');
 if(listData){
   Router.go('/paymentcard?invid='+ listData);
 }
});

    }
    }).catch(function (err) {
      paymentService.getAllAwaitingInvoiceDetails().then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        for(let i=0; i<data.tinvoiceex.length; i++){
          let amount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalAmountInc)|| 0.00;
          let applied = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalPaid) || 0.00;
          // Currency+''+data.tinvoiceex[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
          let balance = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalBalance)|| 0.00;
          let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].TotalAmountInc)|| 0.00;
             var dataList = {
             id: data.tinvoiceex[i].Id || '',
                 sortdate: data.tinvoiceex[i].SaleDate !=''? moment(data.tinvoiceex[i].SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].SaleDate,
             paymentdate: data.tinvoiceex[i].SaleDate !=''? moment(data.tinvoiceex[i].SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].SaleDate,
             customername: data.tinvoiceex[i].CustomerName || '',
             paymentamount: amount || 0.00,
             applied: applied || 0.00,
             balance: balance || 0.00,
             originalamount: totalOrginialAmount || 0.00,
             outsandingamount: totalOutstanding || 0.00,
             // bankaccount: data.tinvoiceex[i].GLAccountName || '',
             department: data.tinvoiceex[i].SaleClassName || '',
             refno: data.tinvoiceex[i].ReferenceNo || '',
             paymentmethod: data.tinvoiceex[i].PaymentMethodName || '',
             notes: data.tinvoiceex[i].Comments || ''
           };
           if(data.tinvoiceex[i].TotalBalance != 0){
             dataTableList.push(dataList);
           }

        }
        templateObject.datatablerecords.set(dataTableList);
        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcustomerAwaitingPayment', function(error, result){
          if(error){

          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split('.')[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if(hiddenColumn == true){

                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
                }

              }
            }

          }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        setTimeout(function () {
          //$.fn.dataTable.moment('DD/MM/YY');
            $('#tblcustomerAwaitingPayment').DataTable({
                  columnDefs: [
                      { "orderable": false, "targets": 0 },
                      {type: 'date', targets: 1}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "supplierpayment_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Supplier Payment',
                      filename: "supplierpayment_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  colReorder: {
                      fixedColumnsLeft: 1
                  },
                  // bStateSave: true,
                  // rowId: 0,
                  paging: false,
                  "scrollY": "400px",
                  "scrollCollapse": true,
                  // pageLength: 25,
                  // lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 1, "desc" ]],
                  // "aaSorting": [[1,'desc']],
                  action: function () {
                      $('#tblcustomerAwaitingPayment').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },

              }).on('page', function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
              $('.fullScreenSpin').css('display','none');
          }, 0);

          var columns = $('#tblcustomerAwaitingPayment th');
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function(i,v) {
            if(v.hidden == false){
              columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
              columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            //console.log(sWidth);
            let datatablerecordObj = {
              sTitle: v.innerText || '',
              sWidth: sWidth || '',
              sIndex: v.cellIndex || '',
              sVisible: columVisible || false,
              sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
          });
        templateObject.tableheaderrecords.set(tableHeaderList);
         $('div.dataTables_filter input').addClass('form-control form-control-sm');
         $('#tblcustomerAwaitingPayment tbody').on( 'click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
         var listData = $(this).closest('tr').attr('id');
         if(listData){
           Router.go('/paymentcard?invid='+ listData);
         }
       });

      }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display','none');
          // Meteor._reload.reload();
      });
    });
  }

  templateObject.getAllSupplierPaymentData();

});

Template.customerawaitingpayments.events({

  'click .chkDatatable' : function(event){
    var columns = $('#tblcustomerAwaitingPayment th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function(i,v) {
      let className = v.classList;
      let replaceClass = className[1];

    if(v.innerText == columnDataValue){
    if($(event.target).is(':checked')){
      $("."+replaceClass+"").css('display','table-cell');
      $("."+replaceClass+"").css('padding','.75rem');
      $("."+replaceClass+"").css('vertical-align','top');
    }else{
      $("."+replaceClass+"").css('display','none');
    }
    }
    });
  },
  'click .resetTable' : function(event){
    var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    if(getcurrentCloudDetails){
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblcustomerAwaitingPayment'});
        if (checkPrefDetails) {
          CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
          if (err) {

          }else{
            Meteor._reload.reload();
          }
          });

        }
      }
    }
  },
  'click .saveTable' : function(event){
    let lineItems = [];
    //let datatable =$('#tblcustomerAwaitingPayment').DataTable();
    $('.columnSettings').each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text()||'';
      var colWidth = $tblrow.find(".custom-range").val()||0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
      var colHidden = false;
      if($tblrow.find(".custom-control-input").is(':checked')){
        colHidden = false;
      }else{
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      }

      lineItems.push(lineItemObj);
    });
    //datatable.state.save();
    var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    if(getcurrentCloudDetails){
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblcustomerAwaitingPayment'});
        if (checkPrefDetails) {
          CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
            PrefGroup:'salesform',PrefName:'tblcustomerAwaitingPayment',published:true,
            customFields:lineItems,
            updatedAt: new Date() }}, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');
            }
          });

        }else{
          CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
            PrefGroup:'salesform',PrefName:'tblcustomerAwaitingPayment',published:true,
            customFields:lineItems,
            createdAt: new Date() }, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');

            }
          });
           // console.log(checkPrefDetails);
        }
      }
    }

    //Meteor._reload.reload();
  },
  'blur .divcolumn' : function(event){
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //alert(columnDataValue);
    var datable = $('#tblcustomerAwaitingPayment').DataTable();
    var title = datable.column( columnDatanIndex ).header();
    $(title).html(columData);

  },
  'change .rngRange' : function(event){
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblcustomerAwaitingPayment th');
    $.each(datable, function(i,v) {
      //console.log(datable);
    if(v.innerText == columnDataValue){
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
      $("."+replaceClass+"").css('width',range+'px');

    }
    });

  },
  'click .btnOpenSettings' : function(event){
    let templateObject = Template.instance();
    var columns = $('#tblcustomerAwaitingPayment th');
    // console.log(columns);
    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function(i,v) {
      if(v.hidden == false){
        columVisible =  true;
      }
      if((v.className.includes("hiddenColumn"))){
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");

      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || '',
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
    'click #exportbtn': function () {
      // alert('here');
      $('.fullScreenSpin').css('display','inline-block');
      jQuery('#tblcustomerAwaitingPayment_wrapper .dt-buttons .btntabletocsv').click();
       $('.fullScreenSpin').css('display','none');

    },
    'click .btnRefresh': function () {

            $('.fullScreenSpin').css('display','inline-block');
            let templateObject = Template.instance();
            sideBarService.getAllInvoiceList().then(function(data) {
              addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {
                location.reload(true);
              }).catch(function (err) {
                location.reload(true);
              });
            }).catch(function(err) {
              location.reload(true);
            });
    },
  'click .printConfirm' : function(event){
    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblcustomerAwaitingPayment_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   },
   'click .chkBoxAll': function () {
     if($(event.target).is(':checked')){
       $(".chkBox"). prop("checked", true);
     }else{
       $(".chkBox"). prop("checked", false);
     }
   },
   'click .chkPaymentCard': function () {
         var listData = $(this).closest('tr').attr('id');
         var selectedClient = $(event.target).closest("tr").find(".colCustomerName").text();
         const templateObject = Template.instance();
         const selectedAwaitingPayment = [];
         const selectedAwaitingPayment2 = [];
         $('.chkPaymentCard:checkbox:checked').each(function(){
             var chkIdLine = $(this).closest('tr').attr('id');
             var customername = $(this).closest('.colCustomerName');
             let paymentTransObj = {
                 awaitingId : chkIdLine,
                 type : "inv",
                 clientname : $('#colCustomerName'+chkIdLine).text()
             };
             if (selectedAwaitingPayment.length > 0) {
              var checkClient = selectedAwaitingPayment.filter(slctdAwtngPyment => {
                return slctdAwtngPyment.clientname == $('#colCustomerName' + chkIdLine).text();
              });

              if (checkClient.length > 0) {
                selectedAwaitingPayment.push(paymentTransObj);
              } else {
                swal('WARNING','You have selected multiple Customers,  a seperate payment will be created for each', 'error');
                $(this).prop("checked", false);
              }
            } else {
             selectedAwaitingPayment.push(paymentTransObj);
            }
         });
     templateObject.selectedAwaitingPayment.set(selectedAwaitingPayment);

   },
   'click .btnCustPayment': function () {
     const templateObject = Template.instance();
     let selectClient = templateObject.selectedAwaitingPayment.get();
     //Click Payment and check if not empty.
     if(selectClient.length === 0){
       swal('Please select Customer to pay for!', '', 'info');
     }else{
       var result = [];
         $.each(selectClient, function( k, v ) {
            result.push(v.awaitingId);
          });
        Router.go('/paymentcard?selectcust='+ result);
     }

   }


  });
  Template.customerawaitingpayments.helpers({
    datatablerecords : () => {
       return Template.instance().datatablerecords.get().sort(function(a, b){
         if (a.paymentdate == 'NA') {
       return 1;
           }
       else if (b.paymentdate == 'NA') {
         return -1;
       }
     return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
     });
    },
    tableheaderrecords: () => {
       return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblcustomerAwaitingPayment'});
  }
  });
