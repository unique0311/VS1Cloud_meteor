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
Template.reconciliationlist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.reconciliationlist.onRendered(function() {
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
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblreconciliationlist', function(error, result){
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
      $('td').each(function(){
        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
       });
    };

    templateObject.getAllReconData = function () {
      getVS1Data('TReconciliation').then(function (dataObject) {
        if(dataObject.length == 0){
          purchaseService.getAllReconcilationList().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.treconciliation.length; i++){
              let openBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].OpenBalance)|| 0.00;
              let closeBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].CloseBalance)|| 0.00;
              var dataList = {
              id: data.treconciliation[i].Id || '',
              sortdate: data.treconciliation[i].ReconciliationDate !=''? moment(data.treconciliation[i].ReconciliationDate).format("YYYY/MM/DD"): data.treconciliation[i].ReconciliationDate,
              recondate: data.treconciliation[i].ReconciliationDate !=''? moment(data.treconciliation[i].ReconciliationDate).format("DD/MM/YYYY"): data.treconciliation[i].ReconciliationDate,
              accountname:data.treconciliation[i].AccountName || '',
              statementno: data.treconciliation[i].StatementNo || '',
              department: data.treconciliation[i].DeptName|| '',
              openbalance: openBalance || 0.00,
              closebalance: closeBalance || 0.00,
              employee: data.treconciliation[i].EmployeeName || '',
              notes: data.treconciliation[i].Notes || '',
            };
              dataTableList.push(dataList);

            }
            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblreconciliationlist', function(error, result){
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
                $('#tblreconciliationlist').DataTable({
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
                         filename: "reconciliationlist_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Reconciliation',
                          filename: "reconciliationlist_"+ moment().format(),
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
                      "order": [[ 0, "desc" ],[ 4, "desc" ]],
                      action: function () {
                          $('#tblreconciliationlist').DataTable().ajax.reload();
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

              var columns = $('#tblreconciliationlist th');
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
             $('#tblreconciliationlist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
                window.open('/bankrecon?id=' + listData,'_self');
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.treconciliation;
          let lineItems = [];
      let lineItemObj = {};
      for(let i=0; i<useData.length; i++){
        let openBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.OpenBalance)|| 0.00;
        let closeBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CloseBalance)|| 0.00;
        var dataList = {
        id: useData[i].fields.ID || '',
        sortdate: useData[i].fields.ReconciliationDate !=''? moment(useData[i].fields.ReconciliationDate).format("YYYY/MM/DD"): useData[i].fields.ReconciliationDate,
        recondate: useData[i].fields.ReconciliationDate !=''? moment(useData[i].fields.ReconciliationDate).format("DD/MM/YYYY"): useData[i].fields.ReconciliationDate,
        accountname:useData[i].fields.AccountName || '',
        statementno: useData[i].fields.StatementNo || '',
        department: useData[i].fields.DeptName|| '',
        openbalance: openBalance || 0.00,
        closebalance: closeBalance || 0.00,
        employee: useData[i].fields.EmployeeName || '',
        notes: useData[i].fields.Notes || '',
      };
      if(useData[i].fields.ReconciliationDate != ''){
        dataTableList.push(dataList);
      }

      }
      templateObject.datatablerecords.set(dataTableList);

      if(templateObject.datatablerecords.get()){

        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblreconciliationlist', function(error, result){
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
          $('#tblreconciliationlist').DataTable({
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
                   filename: "reconciliationlist_"+ moment().format(),
                   orientation:'portrait',
                    exportOptions: {
                    columns: ':visible'
                  }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Reconciliation',
                    filename: "reconciliationlist_"+ moment().format(),
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
                "order": [[ 0, "desc" ],[ 4, "desc" ]],
                action: function () {
                    $('#tblreconciliationlist').DataTable().ajax.reload();
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

        var columns = $('#tblreconciliationlist th');
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
       $('#tblreconciliationlist tbody').on( 'click', 'tr', function () {
       var listData = $(this).closest('tr').attr('id');
       if(listData){
          Router.go('/bankrecon?id=' + listData);
          //window.open('/bankrecon?id=' + listData,'_self');
       }
     });

        }
        }).catch(function (err) {
          purchaseService.getAllReconcilationList().then(function (data) {

            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.treconciliation.length; i++){
              let openBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].OpenBalance)|| 0.00;
              let closeBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].CloseBalance)|| 0.00;
              var dataList = {
              id: data.treconciliation[i].Id || '',
              sortdate: data.treconciliation[i].ReconciliationDate !=''? moment(data.treconciliation[i].ReconciliationDate).format("YYYY/MM/DD"): data.treconciliation[i].ReconciliationDate,
              recondate: data.treconciliation[i].ReconciliationDate !=''? moment(data.treconciliation[i].ReconciliationDate).format("DD/MM/YYYY"): data.treconciliation[i].ReconciliationDate,
              accountname:data.treconciliation[i].AccountName || '',
              statementno: data.treconciliation[i].StatementNo || '',
              department: data.treconciliation[i].DeptName|| '',
              openbalance: openBalance || 0.00,
              closebalance: closeBalance || 0.00,
              employee: data.treconciliation[i].EmployeeName || '',
              notes: data.treconciliation[i].Notes || '',
            };
              dataTableList.push(dataList);

            }
            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblreconciliationlist', function(error, result){
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
                $('#tblreconciliationlist').DataTable({
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
                         filename: "reconciliationlist_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Reconciliation',
                          filename: "reconciliationlist_"+ moment().format(),
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
                      "order": [[ 0, "desc" ],[ 4, "desc" ]],
                      action: function () {
                          $('#tblreconciliationlist').DataTable().ajax.reload();
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

              var columns = $('#tblreconciliationlist th');
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
             $('#tblreconciliationlist tbody').on( 'click', 'tr', function () {
             var listData = $(this).closest('tr').attr('id');
             if(listData){
                window.open('/bankrecon?id=' + listData,'_self');
             }
           });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });
    }

    templateObject.getAllReconData();


});

Template.reconciliationlist.events({
    'click #btnReconcile':function(event){
      window.open('/bankrecon','_self');
    },
    'click .chkDatatable' : function(event){
      var columns = $('#tblreconciliationlist th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblreconciliationlist'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblreconciliationlist'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblreconciliationlist',published:true,
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
              PrefGroup:'salesform',PrefName:'tblreconciliationlist',published:true,
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
      var datable = $('#tblreconciliationlist').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblreconciliationlist th');
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
      var columns = $('#tblreconciliationlist th');
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
        jQuery('#tblreconciliationlist_wrapper .dt-buttons .btntabletocsv').click();
         $('.fullScreenSpin').css('display','none');

      },
      'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllTVS1BankDepositData().then(function(data) {
          addVS1Data('TVS1BankDeposit',JSON.stringify(data)).then(function (datareturn) {

          }).catch(function (err) {

          });
        }).catch(function(err) {

        });
        sideBarService.getAllReconcilationList().then(function(data) {
          addVS1Data('TReconciliation',JSON.stringify(data)).then(function (datareturn) {
            window.open('/reconciliationlist','_self');
          }).catch(function (err) {
            window.open('/reconciliationlist','_self');
          });
        }).catch(function(err) {
          window.open('/reconciliationlist','_self');
        });
      },
  'click .printConfirm' : function(event){

    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblreconciliationlist_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   }

});

Template.reconciliationlist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.recondate == 'NA') {
     return 1;
         }
     else if (b.recondate == 'NA') {
       return -1;
     }
   return (a.recondate.toUpperCase() > b.recondate.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  purchasesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblreconciliationlist'});
}

});
