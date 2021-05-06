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
Template.billlist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.billlist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    const supplierList = [];
    let billTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if(Router.current().params.query.success){
      $('.btnRefresh').addClass('btnRefreshAlert');
    }
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblbilllist', function(error, result){
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

           $("th."+columnClass+"").html(columData);
            $("th."+columnClass+"").css('width',""+columnWidth+"px");

        }
      }

    }
    });

    function MakeNegative() {
      // TDs = document.getElementsByTagName('td');
      // for (var i=0; i<TDs.length; i++) {
      //         var temp = TDs[i];
      //         if (temp.firstChild.nodeValue.indexOf('-'+Currency) == 0){
      //           temp.className = "text-danger";
      //         }
      //     }
      $('td').each(function(){
        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
       });
    };

    templateObject.getAllBillData = function () {

      getVS1Data('TBillEx').then(function (dataObject) {
        if(dataObject.length == 0){
          purchaseService.getAllBillList().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tbill.length; i++){
              let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalAmount)|| 0.00;
              let totalTax = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalTax) || 0.00;
              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalAmountInc)|| 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalPaid)|| 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalBalance)|| 0.00;
              var dataList = {
              id: data.tbill[i].Id || '',
              employee:data.tbill[i].EmployeeName || '',
              accountname:data.tbill[i].AccountName || '',
                  sortdate: data.tbill[i].OrderDate !=''? moment(data.tbill[i].OrderDate).format("YYYY/MM/DD"): data.tbill[i].OrderDate,
              orderdate: data.tbill[i].OrderDate !=''? moment(data.tbill[i].OrderDate).format("DD/MM/YYYY"): data.tbill[i].OrderDate,
              suppliername: data.tbill[i].SupplierName || '',
              totalamountex: totalAmountEx || 0.00,
              totaltax: totalTax || 0.00,
              totalamount: totalAmount || 0.00,
              totalpaid: totalPaid || 0.00,
              totaloustanding: totalOutstanding || 0.00,
              orderstatus: data.tbill[i].OrderStatus || '',
              custfield1: '' || '',
              custfield2: '' || '',
              comments: data.tbill[i].Comments || '',
            };
              dataTableList.push(dataList);

            }
            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblbilllist', function(error, result){
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

            setTimeout(function () {
              $('.fullScreenSpin').css('display','none');
              //$.fn.dataTable.moment('DD/MM/YY');
                $('#tblbilllist').DataTable({
                      // columnDefs: [
                      //     {type: 'date', targets: 0}
                      // ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                            {
                         extend: 'excelHtml5',
                         text: '',
                         download: 'open',
                         className: "btntabletocsv hiddenColumn",
                         filename: "billlist_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Sales Overview',
                          filename: "salesoverview_"+ moment().format(),
                          exportOptions: {
                          columns: ':visible'
                        }
                      }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: 25,
                      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      action: function () {
                          $('#tblbilllist').DataTable().ajax.reload();
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

              var columns = $('#tblbilllist th');
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
             $('#tblbilllist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
              Router.go('/billcard?id=' + listData);
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tbillex;
        let lineItems = [];
let lineItemObj = {};
for(let i=0; i<useData.length; i++){
  let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmount)|| 0.00;
  let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalTax) || 0.00;
  let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc)|| 0.00;
  let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid)|| 0.00;
  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
  var dataList = {
  id: useData[i].fields.ID || '',
  employee:useData[i].fields.EmployeeName || '',
  accountname:useData[i].fields.AccountName || '',
      sortdate: useData[i].fields.OrderDate !=''? moment(useData[i].fields.OrderDate).format("YYYY/MM/DD"): useData[i].fields.OrderDate,
  orderdate: useData[i].fields.OrderDate !=''? moment(useData[i].fields.OrderDate).format("DD/MM/YYYY"): useData[i].fields.OrderDate,
  suppliername: useData[i].fields.SupplierName || '',
  totalamountex: totalAmountEx || 0.00,
  totaltax: totalTax || 0.00,
  totalamount: totalAmount || 0.00,
  totalpaid: totalPaid || 0.00,
  totaloustanding: totalOutstanding || 0.00,
  orderstatus: useData[i].fields.OrderStatus || '',
  custfield1: '' || '',
  custfield2: '' || '',
  comments: useData[i].fields.Comments || '',
};
  dataTableList.push(dataList);

}
templateObject.datatablerecords.set(dataTableList);

if(templateObject.datatablerecords.get()){

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblbilllist', function(error, result){
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

setTimeout(function () {
  $('.fullScreenSpin').css('display','none');
  //$.fn.dataTable.moment('DD/MM/YY');
    $('#tblbilllist').DataTable({
          // columnDefs: [
          //     {type: 'date', targets: 0}
          // ],
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          buttons: [
                {
             extend: 'excelHtml5',
             text: '',
             download: 'open',
             className: "btntabletocsv hiddenColumn",
             filename: "billlist_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }
          },{
              extend: 'print',
              download: 'open',
              className: "btntabletopdf hiddenColumn",
              text: '',
              title: 'Sales Overview',
              filename: "salesoverview_"+ moment().format(),
              exportOptions: {
              columns: ':visible'
            }
          }],
          select: true,
          destroy: true,
          colReorder: true,
          // bStateSave: true,
          // rowId: 0,
          pageLength: 25,
          lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
          info: true,
          responsive: true,
          "order": [[ 0, "desc" ],[ 2, "desc" ]],
          action: function () {
              $('#tblbilllist').DataTable().ajax.reload();
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

  var columns = $('#tblbilllist th');
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
 $('#tblbilllist tbody').on( 'click', 'tr', function () {
 var listData = $(this).closest('tr').attr('id');
 if(listData){
  Router.go('/billcard?id=' + listData);
 }
});

        }
        }).catch(function (err) {
          purchaseService.getAllBillList().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tbill.length; i++){
              let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalAmount)|| 0.00;
              let totalTax = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalTax) || 0.00;
              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalAmountInc)|| 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalPaid)|| 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbill[i].TotalBalance)|| 0.00;
              var dataList = {
              id: data.tbill[i].Id || '',
              employee:data.tbill[i].EmployeeName || '',
              accountname:data.tbill[i].AccountName || '',
                  sortdate: data.tbill[i].OrderDate !=''? moment(data.tbill[i].OrderDate).format("YYYY/MM/DD"): data.tbill[i].OrderDate,
              orderdate: data.tbill[i].OrderDate !=''? moment(data.tbill[i].OrderDate).format("DD/MM/YYYY"): data.tbill[i].OrderDate,
              suppliername: data.tbill[i].SupplierName || '',
              totalamountex: totalAmountEx || 0.00,
              totaltax: totalTax || 0.00,
              totalamount: totalAmount || 0.00,
              totalpaid: totalPaid || 0.00,
              totaloustanding: totalOutstanding || 0.00,
              orderstatus: data.tbill[i].OrderStatus || '',
              custfield1: '' || '',
              custfield2: '' || '',
              comments: data.tbill[i].Comments || '',
            };
              dataTableList.push(dataList);

            }
            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblbilllist', function(error, result){
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

            setTimeout(function () {
              $('.fullScreenSpin').css('display','none');
              //$.fn.dataTable.moment('DD/MM/YY');
                $('#tblbilllist').DataTable({
                      // columnDefs: [
                      //     {type: 'date', targets: 0}
                      // ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                            {
                         extend: 'excelHtml5',
                         text: '',
                         download: 'open',
                         className: "btntabletocsv hiddenColumn",
                         filename: "billlist_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Sales Overview',
                          filename: "salesoverview_"+ moment().format(),
                          exportOptions: {
                          columns: ':visible'
                        }
                      }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: 25,
                      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      action: function () {
                          $('#tblbilllist').DataTable().ajax.reload();
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

              var columns = $('#tblbilllist th');
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
             $('#tblbilllist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
              Router.go('/billcard?id=' + listData);
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });
    }

    templateObject.getAllBillData();


});

Template.billlist.events({
    'click #btnNewBill':function(event){
        Router.go('/billcard');
    },
    'click .chkDatatable' : function(event){
      var columns = $('#tblbilllist th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblbilllist'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblbilllist'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblbilllist',published:true,
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
              PrefGroup:'salesform',PrefName:'tblbilllist',published:true,
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
      var datable = $('#tblbilllist').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblbilllist th');
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
      var columns = $('#tblbilllist th');
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
        jQuery('#tblbilllist_wrapper .dt-buttons .btntabletocsv').click();
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
      // getVS1Data('TBillEx').then(function (dataObject) {
      //   if(dataObject.length == 0){
      //     sideBarService.getAllBillExList().then(function(data) {
      //       addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
      //       window.open('/billlist','_self');
      //       }).catch(function (err) {
      //       window.open('/billlist','_self');
      //       });
      //     }).catch(function(err) {
      //       window.open('/billlist','_self');
      //     });
      //   }else{
      //     let data = JSON.parse(dataObject[0].data);
      //     let useData = data.tbillex;
      //     if(useData[0].Id){
      //       sideBarService.getAllBillExList().then(function(data) {
      //         addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
      //           window.open('/billlist','_self');
      //         }).catch(function (err) {
      //         window.open('/billlist','_self');
      //         });
      //       }).catch(function(err) {
      //         window.open('/billlist','_self');
      //       });
      //     }else{
      //     let getTimeStamp = dataObject[0].timestamp;
      //     if(getTimeStamp){
      //         if(getTimeStamp[0] != currenctTodayDate){
      //           sideBarService.getAllBillExList(getTimeStamp).then(function(dataUpdate) {
      //             let newDataObject = [];
      //             if(dataUpdate.tbillex.length === 0){
      //               sideBarService.getAllBillExList().then(function(data) {
      //                 addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
      //                   window.open('/billlist','_self');
      //                 }).catch(function (err) {
      //                 window.open('/billlist','_self');
      //                 });
      //               }).catch(function(err) {
      //               window.open('/billlist','_self');
      //               });
      //             }else{
      //               let dataOld = JSON.parse(dataObject[0].data);
      //               let oldObjectData = dataOld.tbillex;
      //
      //               let dataNew = dataUpdate;
      //               let newObjectData = dataNew.tbillex;
      //               let index = '';
      //               let index2 = '';
      //
      //               var resultArray = []
      //
      //               oldObjectData.forEach(function(destObj) {
      //                   var addedcheck=false;
      //                   newObjectData.some(function(origObj) {
      //                     if(origObj.fields.ID == destObj.fields.ID) {
      //                       addedcheck = true;
      //                       index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
      //                       destObj = origObj;
      //                       resultArray.push(destObj);
      //
      //                     }
      //                   });
      //                   if(!addedcheck) {
      //                         resultArray.push(destObj)
      //                   }
      //
      //                 });
      //                 newObjectData.forEach(function(origObj) {
      //                   var addedcheck=false;
      //                   oldObjectData.some(function(destObj) {
      //                     if(origObj.fields.ID == destObj.fields.ID) {
      //                       addedcheck = true;
      //                       index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
      //                       destObj = origObj;
      //                       resultArray.push(destObj);
      //
      //                     }
      //                   });
      //                   if(!addedcheck) {
      //                         resultArray.push(origObj)
      //                   }
      //
      //                 });
      //             var resultGetData = [];
      //             $.each(resultArray, function (i, e) {
      //               var matchingItems = $.grep(resultGetData, function (item) {
      //                  return item.fields.ID === e.fields.ID;
      //               });
      //               if (matchingItems.length === 0){
      //                   resultGetData.push(e);
      //               }
      //           });
      //
      //           let dataToAdd = {
      //               tbillex: resultGetData
      //           };
      //             addVS1Data('TBillEx',JSON.stringify(dataToAdd)).then(function (datareturn) {
      //               window.open('/billlist','_self');
      //             }).catch(function (err) {
      //               window.open('/billlist','_self');
      //             });
      //             }
      //
      //           }).catch(function(err) {
      //             addVS1Data('TBillEx',dataObject[0].data).then(function (datareturn) {
      //               window.open('/billlist','_self');
      //             }).catch(function (err) {
      //               window.open('/billlist','_self');
      //             });
      //           });
      //         }
      //
      //     }
      //   }
      //   }
      // }).catch(function (err) {
      //
      // });


      sideBarService.getAllPurchaseOrderListAll().then(function(data) {
        addVS1Data('TbillReport',JSON.stringify(data)).then(function (datareturn) {
          sideBarService.getAllBillExList().then(function(data) {
            addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
              window.open('/billlist','_self');
            }).catch(function (err) {
            window.open('/billlist','_self');
            });
          }).catch(function(err) {
            window.open('/billlist','_self');
          });
        }).catch(function (err) {
          sideBarService.getAllBillExList().then(function(data) {
            addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
              window.open('/billlist','_self');
            }).catch(function (err) {
            window.open('/billlist','_self');
            });
          }).catch(function(err) {
            window.open('/billlist','_self');
          });
        });
      }).catch(function(err) {
        sideBarService.getAllBillExList().then(function(data) {
          addVS1Data('TBillEx',JSON.stringify(data)).then(function (datareturn) {
            window.open('/billlist','_self');
          }).catch(function (err) {
          window.open('/billlist','_self');
          });
        }).catch(function(err) {
          window.open('/billlist','_self');
        });
      });
      },
  'click .printConfirm' : function(event){

    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblbilllist_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   }

});

Template.billlist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.orderdate == 'NA') {
     return 1;
         }
     else if (b.orderdate == 'NA') {
       return -1;
     }
   return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  purchasesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblbilllist'});
}

});
