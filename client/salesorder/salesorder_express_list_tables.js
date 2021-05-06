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
Template.salesorderslist.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.salesorderslist.onRendered(function() {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let accountService = new AccountService();
  let salesService = new SalesBoardService();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];
  if(Router.current().params.query.success){
    $('.btnRefresh').addClass('btnRefreshAlert');
  }
  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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

    templateObject.getAllSalesOrderData = function () {
      getVS1Data('TSalesOrderEx').then(function (dataObject) {
      if(dataObject.length == 0){
        salesService.getAllSalesOrderListNonBO().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          // alert(data.tsalesordernonbackorder[1].Id);
          for(let i=0; i<data.tsalesordernonbackorder.length; i++){
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalAmount)|| 0.00;
            let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalTax) || 0.00;
            // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalAmountInc)|| 0.00;
            let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalPaid)|| 0.00;
            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalBalance)|| 0.00;
            var dataList = {
              id: data.tsalesordernonbackorder[i].Id || '',
              employee:data.tsalesordernonbackorder[i].EmployeeName || '',
              sortdate: data.tsalesordernonbackorder[i].SaleDate !=''? moment(data.tsalesordernonbackorder[i].SaleDate).format("YYYY/MM/DD"): data.tsalesordernonbackorder[i].SaleDate,
              saledate: data.tsalesordernonbackorder[i].SaleDate !=''? moment(data.tsalesordernonbackorder[i].SaleDate).format("DD/MM/YYYY"): data.tsalesordernonbackorder[i].SaleDate,
              duedate: data.tsalesordernonbackorder[i].DueDate !=''? moment(data.tsalesordernonbackorder[i].DueDate).format("DD/MM/YYYY"): data.tsalesordernonbackorder[i].DueDate,
              customername: data.tsalesordernonbackorder[i].CustomerName || '',
              totalamountex: totalAmountEx || 0.00,
              totaltax: totalTax || 0.00,
              totalamount: totalAmount || 0.00,
              totalpaid: totalPaid || 0.00,
              totaloustanding: totalOutstanding || 0.00,
              salestatus: data.tsalesordernonbackorder[i].SalesStatus || '',
              custfield1: data.tsalesordernonbackorder[i].SaleCustField1 || '',
              custfield2: data.tsalesordernonbackorder[i].SaleCustField2 || '',
              comments: data.tsalesordernonbackorder[i].Comments || '',
          };

          if(data.tsalesordernonbackorder[i].Deleted == false && data.tsalesordernonbackorder[i].CustomerName.replace(/\s/g, '') != ''){
            dataTableList.push(dataList);
          }

              //}
          }

          templateObject.datatablerecords.set(dataTableList);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
              $('#tblSalesOrderlist').DataTable({
                    columnDefs: [
                        {type: 'date', targets: 0}
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                          {
                       extend: 'excelHtml5',
                       text: '',
                       download: 'open',
                       className: "btntabletocsv hiddenColumn",
                       filename: "salesorderlist_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Sales Order List',
                        filename: "salesorderlist_"+ moment().format(),
                        exportOptions: {
                        columns: ':visible'
                      }
                    }],
                    //bStateSave: true,
                    //rowId: 0,
                    pageLength: 25,
                    lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                    info: true,
                    "order": [[ 0, "desc" ],[ 2, "desc" ]],
                    responsive: true,
                    action: function () {
                        $('#tblSalesOrderlist').DataTable().ajax.reload();
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

                // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
                $('.fullScreenSpin').css('display','none');
            }, 0);

            var columns = $('#tblSalesOrderlist th');
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
           $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
           var listData = $(this).closest('tr').attr('id');
           if(listData){
             Router.go('/salesordercard?id=' + listData);
           }
         });

        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tsalesorderex;
        let lineItems = [];
  let lineItemObj = {};
  // alert(useData[1].Id);
  for(let i=0; i<useData.length; i++){
    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmount)|| 0.00;
    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalTax) || 0.00;
    // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc)|| 0.00;
    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid)|| 0.00;
    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
    var dataList = {
      id: useData[i].fields.ID || '',
      employee:useData[i].fields.EmployeeName || '',
      sortdate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("YYYY/MM/DD"): useData[i].fields.SaleDate,
      saledate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("DD/MM/YYYY"): useData[i].fields.SaleDate,
      duedate: useData[i].fields.DueDate !=''? moment(useData[i].fields.DueDate).format("DD/MM/YYYY"): useData[i].fields.DueDate,
      customername: useData[i].fields.CustomerName || '',
      totalamountex: totalAmountEx || 0.00,
      totaltax: totalTax || 0.00,
      totalamount: totalAmount || 0.00,
      totalpaid: totalPaid || 0.00,
      totaloustanding: totalOutstanding || 0.00,
      salestatus: useData[i].fields.SalesStatus || '',
      custfield1: useData[i].fields.SaleCustField1 || '',
      custfield2: useData[i].fields.SaleCustField2 || '',
      comments: useData[i].fields.Comments || '',
  };

  if(useData[i].fields.Deleted == false && useData[i].fields.CustomerName.replace(/\s/g, '') != ''){
    dataTableList.push(dataList);
  }

      //}
  }

  templateObject.datatablerecords.set(dataTableList);

  if(templateObject.datatablerecords.get()){

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
      $('#tblSalesOrderlist').DataTable({
            columnDefs: [
                {type: 'date', targets: 0}
            ],
            select: true,
            destroy: true,
            colReorder: true,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
                  {
               extend: 'excelHtml5',
               text: '',
               download: 'open',
               className: "btntabletocsv hiddenColumn",
               filename: "salesorderlist_"+ moment().format(),
               orientation:'portrait',
                exportOptions: {
                columns: ':visible'
              }
            },{
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Sales Order List',
                filename: "salesorderlist_"+ moment().format(),
                exportOptions: {
                columns: ':visible'
              }
            }],
            //bStateSave: true,
            //rowId: 0,
            pageLength: 25,
            lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
            info: true,
            "order": [[ 0, "desc" ],[ 2, "desc" ]],
            responsive: true,
            action: function () {
                $('#tblSalesOrderlist').DataTable().ajax.reload();
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

        // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display','none');
    }, 0);

    var columns = $('#tblSalesOrderlist th');
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
   $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
   var listData = $(this).closest('tr').attr('id');
   if(listData){
     Router.go('/salesordercard?id=' + listData);
   }
 });

      }
      }).catch(function (err) {
        console.log(err);
        salesService.getAllSalesOrderListNonBO().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          // alert(data.tsalesordernonbackorder[1].Id);
          for(let i=0; i<data.tsalesordernonbackorder.length; i++){
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalAmount)|| 0.00;
            let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalTax) || 0.00;
            // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalAmountInc)|| 0.00;
            let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalPaid)|| 0.00;
            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesordernonbackorder[i].TotalBalance)|| 0.00;
            var dataList = {
              id: data.tsalesordernonbackorder[i].Id || '',
              employee:data.tsalesordernonbackorder[i].EmployeeName || '',
              sortdate: data.tsalesordernonbackorder[i].SaleDate !=''? moment(data.tsalesordernonbackorder[i].SaleDate).format("YYYY/MM/DD"): data.tsalesordernonbackorder[i].SaleDate,
              saledate: data.tsalesordernonbackorder[i].SaleDate !=''? moment(data.tsalesordernonbackorder[i].SaleDate).format("DD/MM/YYYY"): data.tsalesordernonbackorder[i].SaleDate,
              duedate: data.tsalesordernonbackorder[i].DueDate !=''? moment(data.tsalesordernonbackorder[i].DueDate).format("DD/MM/YYYY"): data.tsalesordernonbackorder[i].DueDate,
              customername: data.tsalesordernonbackorder[i].CustomerName || '',
              totalamountex: totalAmountEx || 0.00,
              totaltax: totalTax || 0.00,
              totalamount: totalAmount || 0.00,
              totalpaid: totalPaid || 0.00,
              totaloustanding: totalOutstanding || 0.00,
              salestatus: data.tsalesordernonbackorder[i].SalesStatus || '',
              custfield1: data.tsalesordernonbackorder[i].SaleCustField1 || '',
              custfield2: data.tsalesordernonbackorder[i].SaleCustField2 || '',
              comments: data.tsalesordernonbackorder[i].Comments || '',
          };

          if(data.tsalesordernonbackorder[i].Deleted == false && data.tsalesordernonbackorder[i].CustomerName.replace(/\s/g, '') != ''){
            dataTableList.push(dataList);
          }

              //}
          }

          templateObject.datatablerecords.set(dataTableList);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
              $('#tblSalesOrderlist').DataTable({
                    columnDefs: [
                        {type: 'date', targets: 0}
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                          {
                       extend: 'excelHtml5',
                       text: '',
                       download: 'open',
                       className: "btntabletocsv hiddenColumn",
                       filename: "salesorderlist_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Sales Order List',
                        filename: "salesorderlist_"+ moment().format(),
                        exportOptions: {
                        columns: ':visible'
                      }
                    }],
                    //bStateSave: true,
                    //rowId: 0,
                    pageLength: 25,
                    lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                    info: true,
                    "order": [[ 0, "desc" ],[ 2, "desc" ]],
                    responsive: true,
                    action: function () {
                        $('#tblSalesOrderlist').DataTable().ajax.reload();
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

                // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
                $('.fullScreenSpin').css('display','none');
            }, 0);

            var columns = $('#tblSalesOrderlist th');
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
           $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
           var listData = $(this).closest('tr').attr('id');
           if(listData){
             Router.go('/salesordercard?id=' + listData);
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

    $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
    //var listData = table.row( this ).id();
    var listData = $(this).closest('tr').attr('id');

    //for(let i=0 ; i<splashArray.length ;i++){
    if(listData){
      Router.go('/salesordercard?id=' + listData);
    }
    //}
  });

});


Template.salesorderslist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblSalesOrderlist'});
}
});

Template.salesorderslist.events({
    'click #btnNewSalesOrder':function(event){
        Router.go('/salesordercard');
    },
    'click .chkDatatable' : function(event){
      var columns = $('#tblSalesOrderlist th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOrderlist'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOrderlist'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblSalesOrderlist',published:true,
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
              PrefGroup:'salesform',PrefName:'tblSalesOrderlist',published:true,
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
      var datable = $('#tblSalesOrderlist').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblSalesOrderlist th');
      $.each(datable, function(i,v) {
        console.log(datable);
      if(v.innerText == columnDataValue){
          let className = v.className;
          let replaceClass = className.replace(/ /g, ".");
        $("."+replaceClass+"").css('width',range+'px');

      }
      });

    },
    'click .btnOpenSettings' : function(event){
      let templateObject = Template.instance();
      var columns = $('#tblSalesOrderlist th');
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
        console.log(sWidth);
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
    jQuery('#tblSalesOrderlist_wrapper .dt-buttons .btntabletocsv').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .printConfirm' : function(event){

    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblSalesOrderlist_wrapper .dt-buttons .btntabletopdf').click();
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

  if(currentDate.getMonth() < 10){
    month = "0" + (currentDate.getMonth()+1);
  }

  if(currentDate.getDate() < 10){
    days = "0" + currentDate.getDate();
  }
  let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days + " "+ hours+ ":"+ minutes+ ":"+ seconds;
  let templateObject = Template.instance();
  getVS1Data('TSalesOrderEx').then(function (dataObject) {
    if(dataObject.length == 0){
      sideBarService.getAllSalesOrderList().then(function(data) {
        addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {
        window.open('/salesorderslist','_self');
        }).catch(function (err) {
        window.open('/salesorderslist','_self');
        });
      }).catch(function(err) {
        window.open('/salesorderslist','_self');
      });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tsalesorderex;
      if(useData[0].Id){
        sideBarService.getAllSalesOrderList().then(function(data) {
          addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {
            window.open('/salesorderslist','_self');
          }).catch(function (err) {
          window.open('/salesorderslist','_self');
          });
        }).catch(function(err) {
          window.open('/salesorderslist','_self');
        });
      }else{
      let getTimeStamp = dataObject[0].timestamp;
      if(getTimeStamp){
          if(getTimeStamp[0] != currenctTodayDate){
            sideBarService.getAllSalesOrderList(getTimeStamp).then(function(dataUpdate) {
              let newDataObject = [];
              if(dataUpdate.tsalesorderex.length === 0){
                sideBarService.getAllSalesOrderList().then(function(data) {
                  addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {
                    window.open('/salesorderslist','_self');
                  }).catch(function (err) {
                  window.open('/salesorderslist','_self');
                  });
                }).catch(function(err) {
                window.open('/salesorderslist','_self');
                });
              }else{
                let dataOld = JSON.parse(dataObject[0].data);
                let oldObjectData = dataOld.tsalesorderex;

                let dataNew = dataUpdate;
                let newObjectData = dataNew.tsalesorderex;
                let index = '';
                let index2 = '';

                var resultArray = []

                oldObjectData.forEach(function(destObj) {
                    var addedcheck=false;
                    newObjectData.some(function(origObj) {
                      if(origObj.fields.ID == destObj.fields.ID) {
                        addedcheck = true;
                        index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
                        destObj = origObj;
                        resultArray.push(destObj);

                      }
                    });
                    if(!addedcheck) {
                          resultArray.push(destObj)
                    }

                  });
                  newObjectData.forEach(function(origObj) {
                    var addedcheck=false;
                    oldObjectData.some(function(destObj) {
                      if(origObj.fields.ID == destObj.fields.ID) {
                        addedcheck = true;
                        index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
                        destObj = origObj;
                        resultArray.push(destObj);

                      }
                    });
                    if(!addedcheck) {
                          resultArray.push(origObj)
                    }

                  });
              var resultGetData = [];
              $.each(resultArray, function (i, e) {
                var matchingItems = $.grep(resultGetData, function (item) {
                   return item.fields.ID === e.fields.ID;
                });
                if (matchingItems.length === 0){
                    resultGetData.push(e);
                }
            });

            let dataToAdd = {
                tsalesorderex: resultGetData
            };
              addVS1Data('TSalesOrderEx',JSON.stringify(dataToAdd)).then(function (datareturn) {
                window.open('/salesorderslist','_self');
              }).catch(function (err) {
                window.open('/salesorderslist','_self');
              });
              }

            }).catch(function(err) {
              addVS1Data('TSalesOrderEx',dataObject[0].data).then(function (datareturn) {
                window.open('/salesorderslist','_self');
              }).catch(function (err) {
                window.open('/salesorderslist','_self');
              });
            });
          }

      }
    }
    }
  }).catch(function (err) {
    sideBarService.getAllSalesOrderList().then(function(data) {
      addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {
        window.open('/salesorderslist','_self');
      }).catch(function (err) {
      window.open('/salesorderslist','_self');
      });
    }).catch(function(err) {
      window.open('/salesorderslist','_self');
    });
  });
  }



});
