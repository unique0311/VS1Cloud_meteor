import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.invoicelist.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.invoicelist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let salesService = new SalesBoardService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if(FlowRouter.current().queryParams.success){
      $('.btnRefresh').addClass('btnRefreshAlert');
    }
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelist', function(error, result){
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

    templateObject.resetData = function (dataVal) {
      window.open('/invoicelist?page=last','_self');
    }


    templateObject.getAllSalesOrderData = function () {

      getVS1Data('TInvoiceEx').then(function (dataObject) {
        if(dataObject.length == 0){
          sideBarService.getAllInvoiceList(initialDataLoad,0).then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
            for(let i=0; i<data.tinvoiceex.length; i++){
              let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmount)|| 0.00;
              let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalTax) || 0.00;
              // Currency+''+data.tinvoiceex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmountInc)|| 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalPaid)|| 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalBalance)|| 0.00;
                 var dataList = {
                   id: data.tinvoiceex[i].fields.ID || '',
                   employee:data.tinvoiceex[i].fields.EmployeeName || '',
                   sortdate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].fields.SaleDate,
                   saledate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.SaleDate,
                   duedate: data.tinvoiceex[i].fields.DueDate !=''? moment(data.tinvoiceex[i].fields.DueDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.DueDate,
                   customername: data.tinvoiceex[i].fields.CustomerName || '',
                   totalamountex: totalAmountEx || 0.00,
                   totaltax: totalTax || 0.00,
                   totalamount: totalAmount || 0.00,
                   totalpaid: totalPaid || 0.00,
                   totaloustanding: totalOutstanding || 0.00,
                   salestatus: data.tinvoiceex[i].fields.SalesStatus || '',
                   custfield1: data.tinvoiceex[i].fields.SaleCustField1 || '',
                   custfield2: data.tinvoiceex[i].fields.SaleCustField2 || '',
                   comments: data.tinvoiceex[i].fields.Comments || '',
                   // shipdate:data.tinvoiceex[i].fields.ShipDate !=''? moment(data.tinvoiceex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.ShipDate,

               };

               if(data.tinvoiceex[i].fields.Deleted == false && data.tinvoiceex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                 dataTableList.push(dataList);
               }

                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelist', function(error, result){
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
                $('#tblInvoicelist').DataTable({
                  columnDefs: [
                      {type: 'date', targets: 0}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "invoicelist_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Invoice List',
                      filename: "invoicelist_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: 100,
                      lengthMenu: [ [100, -1], [100, "All"] ],
                      info: false,
                      responsive: true,
                      searching: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      action: function () {
                          $('#tblInvoicelist').DataTable().ajax.reload();
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

                  // $('#tblInvoicelist').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#tblInvoicelist th');
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
             $('div.dataTables_filter input').addClass('form-control form-control-sm');
             $('#tblInvoicelist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
               FlowRouter.go('/invoicecard?id=' + listData);
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
          let data = JSON.parse(dataObject[0].data);

          let useData = data;
          let lineItems = [];
let lineItemObj = {};

for(let i=0; i<data.tinvoiceex.length; i++){
              let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmount)|| 0.00;
              let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalTax) || 0.00;
              // Currency+''+data.tinvoiceex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmountInc)|| 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalPaid)|| 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalBalance)|| 0.00;
                 var dataList = {
                   id: data.tinvoiceex[i].fields.ID || '',
                   employee:data.tinvoiceex[i].fields.EmployeeName || '',
                   sortdate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].fields.SaleDate,
                   saledate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.SaleDate,
                   duedate: data.tinvoiceex[i].fields.DueDate !=''? moment(data.tinvoiceex[i].fields.DueDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.DueDate,
                   customername: data.tinvoiceex[i].fields.CustomerName || '',
                   totalamountex: totalAmountEx || 0.00,
                   totaltax: totalTax || 0.00,
                   totalamount: totalAmount || 0.00,
                   totalpaid: totalPaid || 0.00,
                   totaloustanding: totalOutstanding || 0.00,
                   salestatus: data.tinvoiceex[i].fields.SalesStatus || '',
                   custfield1: data.tinvoiceex[i].fields.SaleCustField1 || '',
                   custfield2: data.tinvoiceex[i].fields.SaleCustField2 || '',
                   comments: data.tinvoiceex[i].fields.Comments || '',
                   // shipdate:data.tinvoiceex[i].fields.ShipDate !=''? moment(data.tinvoiceex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.ShipDate,

               };

               if(data.tinvoiceex[i].fields.Deleted == false && data.tinvoiceex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                 dataTableList.push(dataList);
               }

                //}
            }

templateObject.datatablerecords.set(dataTableList);

if(templateObject.datatablerecords.get()){

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelist', function(error, result){
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
  tableAll = $('#tblInvoicelist').DataTable({
      columnDefs: [
          {type: 'date', targets: 0}
      ],
      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
            {
         extend: 'excelHtml5',
         text: '',
         download: 'open',
         className: "btntabletocsv hiddenColumn",
         filename: "invoicelist_"+ moment().format(),
         orientation:'portrait',
          exportOptions: {
          columns: ':visible'
        }
      },{
          extend: 'print',
          download: 'open',
          className: "btntabletopdf hiddenColumn",
          text: '',
          title: 'Invoice List',
          filename: "invoicelist_"+ moment().format(),
          exportOptions: {
          columns: ':visible'
        }
      }],
          select: true,
          destroy: true,
          colReorder: true,
          paging: true,
          // "lengthChange": true,
          // "scrollY": "800px",
          // "scrollCollapse": true,
          info: true,
          searching: true,
          responsive: true,
          lengthMenu: [ [25,-1], [25,"All"] ],
          "order": [[ 0, "desc" ],[ 2, "desc" ]],
          action: function () {
            tableDraft.ajax.reload();
              $('#tblInvoicelist').DataTable().ajax.reload();
          },
          "fnDrawCallback": function (oSettings) {
            $('.paginate_button.page-item').removeClass('disabled');
            $('#tblInvoicelist_ellipsis').addClass('disabled');
            $('.dataTables_paginate').css('display','none');
            if(oSettings._iDisplayLength == -1){
              if(oSettings.fnRecordsDisplay() > 150){
                $('.paginate_button.page-item.previous').addClass('disabled');
                $('.paginate_button.page-item.next').addClass('disabled');
              }
            }else{

            }
            if(oSettings.fnRecordsDisplay() < 25){
                $('.paginate_button.page-item.next').addClass('disabled');
            }
            $('.paginate_button.next:not(.disabled)', this.api().table().container())
             .on('click', function(){
               $('.fullScreenSpin').css('display','inline-block');
               let dataLenght = oSettings._iDisplayLength;

               sideBarService.getAllInvoiceList(25,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                 getVS1Data('TInvoiceEx').then(function (dataObjectold) {
                   if(dataObjectold.length == 0){

                   }else{
                     let dataOld = JSON.parse(dataObjectold[0].data);

                     var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoiceex), dataOld.tinvoiceex);
                     let objCombineData = {
                       tinvoiceex:thirdaryData
                     }


                       addVS1Data('TInvoiceEx',JSON.stringify(objCombineData)).then(function (datareturn) {
                         templateObject.resetData(objCombineData);
                       $('.fullScreenSpin').css('display','none');
                       }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                       });

                   }
                  }).catch(function (err) {

                  });

               }).catch(function(err) {
                 $('.fullScreenSpin').css('display','none');
               });

             });
            setTimeout(function () {
              MakeNegative();
            }, 100);
          },
          "fnInitComplete": function () {
            let urlParametersPage = FlowRouter.current().queryParams.page;
            if(urlParametersPage){
              this.fnPageChange('last');
            }

           }
      }).on('page', function () {
        setTimeout(function () {
          MakeNegative();
        }, 100);
          let draftRecord = templateObject.datatablerecords.get();
          templateObject.datatablerecords.set(draftRecord);
      }).on('search.dt', function (eventSearch, searchdata) {


        if(searchdata.fnRecordsDisplay() > 0){

        }else{
          // swal({
          // title: 'Oooops...',
          // text: "No data found! [Coming Soon] - Search API for data.",
          // type: 'info',
          // showCancelButton: false,
          // confirmButtonText: 'Try Again'
          // }).then((result) => {
          // if (result.value) {
          //   //$('input[type=search]').val('').trigger('change');
          //  //Meteor._reload.reload();
          // } else if (result.dismiss === 'cancel') {
          //   //$('input[type=search]').val('').trigger('change');
          // }
          // });
        }
        //alert("search");
      }).on( 'length.dt', function ( e, settings, len ) {
        $('.fullScreenSpin').css('display','inline-block');
        let dataLenght = settings._iDisplayLength;
        if(dataLenght == -1){
          sideBarService.getAllInvoiceList('All',1).then(function(data) {
            let lineItems = [];
             let lineItemObj = {};

            for(let i=0; i<data.tinvoiceex.length; i++){
                let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmount)|| 0.00;
                let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalTax) || 0.00;
                // Currency+''+data.tinvoiceex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmountInc)|| 0.00;
                let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalPaid)|| 0.00;
                let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalBalance)|| 0.00;
                   var dataList = {
                     id: data.tinvoiceex[i].fields.ID || '',
                     employee:data.tinvoiceex[i].fields.EmployeeName || '',
                     sortdate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].fields.SaleDate,
                     saledate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.SaleDate,
                     duedate: data.tinvoiceex[i].fields.DueDate !=''? moment(data.tinvoiceex[i].fields.DueDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.DueDate,
                     customername: data.tinvoiceex[i].fields.CustomerName || '',
                     totalamountex: totalAmountEx || 0.00,
                     totaltax: totalTax || 0.00,
                     totalamount: totalAmount || 0.00,
                     totalpaid: totalPaid || 0.00,
                     totaloustanding: totalOutstanding || 0.00,
                     salestatus: data.tinvoiceex[i].fields.SalesStatus || '',
                     custfield1: data.tinvoiceex[i].fields.SaleCustField1 || '',
                     custfield2: data.tinvoiceex[i].fields.SaleCustField2 || '',
                     comments: data.tinvoiceex[i].fields.Comments || '',
                     // shipdate:data.tinvoiceex[i].fields.ShipDate !=''? moment(data.tinvoiceex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.ShipDate,

                 };

                 if(data.tinvoiceex[i].fields.Deleted == false && data.tinvoiceex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                   dataTableList.push(dataList);
                 }

                  //}
              }

                templateObject.datatablerecords.set(dataTableList);
                $('.dataTables_info').html('Showing 1 to '+data.tinvoiceex.length+ ' of ' +data.tinvoiceex.length+ ' entries');
                $('.fullScreenSpin').css('display','none');
            // addVS1Data('TInvoiceEx',JSON.stringify(dataNonBo)).then(function (datareturn) {
            //   templateObject.resetData(dataNonBo);
            // $('.fullScreenSpin').css('display','none');
            // }).catch(function (err) {
            // $('.fullScreenSpin').css('display','none');
            // });
          }).catch(function(err) {
            $('.fullScreenSpin').css('display','none');
          });
         //}
        }else{
          if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
            $('.fullScreenSpin').css('display','none');
          }else{
            sideBarService.getAllInvoiceList(dataLenght,0).then(function(dataNonBo) {

              addVS1Data('TInvoiceEx',JSON.stringify(dataNonBo)).then(function (datareturn) {
              templateObject.resetData(dataNonBo);
              }).catch(function (err) {
              $('.fullScreenSpin').css('display','none');
              });
            }).catch(function(err) {
              $('.fullScreenSpin').css('display','none');
            });
          }
        }

        setTimeout(function () {
          MakeNegative();
        }, 100);
      }).on('column-reorder', function () {

      });

      // $('#tblInvoicelist').DataTable().column( 0 ).visible( true );

  }, 0);

  var columns = $('#tblInvoicelist th');
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
 $('div.dataTables_filter input').addClass('form-control form-control-sm');
 $('#tblInvoicelist tbody').on( 'click', 'tr', function () {
 var listData = $(this).closest('tr').attr('id');
 if(listData){
   FlowRouter.go('/invoicecard?id=' + listData);
 }
});

        }
        }).catch(function (err) {
          sideBarService.getAllInvoiceList(initialDataLoad,0).then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
            for(let i=0; i<data.tinvoiceex.length; i++){
              let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmount)|| 0.00;
              let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalTax) || 0.00;
              // Currency+''+data.tinvoiceex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalAmountInc)|| 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalPaid)|| 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoiceex[i].fields.TotalBalance)|| 0.00;
                 var dataList = {
                   id: data.tinvoiceex[i].fields.ID || '',
                   employee:data.tinvoiceex[i].fields.EmployeeName || '',
                  sortdate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tinvoiceex[i].fields.SaleDate,
                   saledate: data.tinvoiceex[i].fields.SaleDate !=''? moment(data.tinvoiceex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.SaleDate,
                   duedate: data.tinvoiceex[i].fields.DueDate !=''? moment(data.tinvoiceex[i].fields.DueDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.DueDate,
                   customername: data.tinvoiceex[i].fields.CustomerName || '',
                   totalamountex: totalAmountEx || 0.00,
                   totaltax: totalTax || 0.00,
                   totalamount: totalAmount || 0.00,
                   totalpaid: totalPaid || 0.00,
                   totaloustanding: totalOutstanding || 0.00,
                   salestatus: data.tinvoiceex[i].fields.SalesStatus || '',
                   custfield1: data.tinvoiceex[i].fields.SaleCustField1 || '',
                   custfield2: data.tinvoiceex[i].fields.SaleCustField2 || '',
                   comments: data.tinvoiceex[i].fields.Comments || '',
                   // shipdate:data.tinvoiceex[i].fields.ShipDate !=''? moment(data.tinvoiceex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.ShipDate,

               };

               if(data.tinvoiceex[i].fields.Deleted == false && data.tinvoiceex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                 dataTableList.push(dataList);
               }

                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelist', function(error, result){
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
                $('#tblInvoicelist').DataTable({
                  columnDefs: [
                      {type: 'date', targets: 0}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "invoicelist_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Invoice List',
                      filename: "invoicelist_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: 100,
                      lengthMenu: [ [100,-1], [100, "All"] ],
                      info: false,
                      responsive: true,
                      searching: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      action: function () {
                          $('#tblInvoicelist').DataTable().ajax.reload();
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

                  // $('#tblInvoicelist').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#tblInvoicelist th');
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
             $('div.dataTables_filter input').addClass('form-control form-control-sm');
             $('#tblInvoicelist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
               FlowRouter.go('/invoicecard?id=' + listData);
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });
    }

    templateObject.getAllSalesOrderData();

    $('#tblInvoicelist tbody').on( 'click', 'tr', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      FlowRouter.go('/invoicecard?id=' + listData);
    }

  });


});


Template.invoicelist.events({
    'click #btnNewInvoice':function(event){
        FlowRouter.go('/invoicecard');
    },
    'click #btnInvoiceBOList':function(event){
        FlowRouter.go('/invoicelistBO');
    },
    'click .chkDatatable' : function(event){
      var columns = $('#tblInvoicelist th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInvoicelist'});
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

      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInvoicelist'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblInvoicelist',published:true,
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
              PrefGroup:'salesform',PrefName:'tblInvoicelist',published:true,
              customFields:lineItems,
              createdAt: new Date() }, function(err, idTag) {
              if (err) {
                $('#myModal2').modal('toggle');
              } else {
                $('#myModal2').modal('toggle');

              }
            });
          }
        }
      }

    },
    'blur .divcolumn' : function(event){
      let columData = $(event.target).text();

      let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
      var datable = $('#tblInvoicelist').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblInvoicelist th');
      $.each(datable, function(i,v) {

      if(v.innerText == columnDataValue){
          let className = v.className;
          let replaceClass = className.replace(/ /g, ".");
        $("."+replaceClass+"").css('width',range+'px');

      }
      });

    },
    'click .btnOpenSettings' : function(event){
      let templateObject = Template.instance();
      var columns = $('#tblInvoicelist th');

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
    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblInvoicelist_wrapper .dt-buttons .btntabletocsv').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    let currentDate = new Date();
    let hours = currentDate.getHours(); //returns 0-23
    let minutes = currentDate.getMinutes(); //returns 0-59
    let seconds = currentDate.getSeconds(); //returns 0-59
    let month = (currentDate.getMonth()+1);
    let days = currentDate.getDate();

    sideBarService.getAllInvoiceList(initialDataLoad,0).then(function(data) {
      addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {
      window.open('/invoicelist','_self');
      }).catch(function (err) {
      window.open('/invoicelist','_self');
      });
    }).catch(function(err) {
      window.open('/invoicelist','_self');
    });

  },
  'click .printConfirm' : function(event){

    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblInvoicelist_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   }


});

Template.invoicelist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.saledate == 'NA') {
     return 1;
         }
     else if (b.saledate == 'NA') {
       return -1;
     }
   return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
   // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblInvoicelist'});
}
});
