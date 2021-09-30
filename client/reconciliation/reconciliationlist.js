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

    if(FlowRouter.current().queryParams.success){
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

    templateObject.resetData = function (dataVal) {
        window.open('/reconciliationlist?page=last','_self');
    }

    templateObject.getAllReconData = function () {
        getVS1Data('TReconciliation').then(function (dataObject) {
            if(dataObject.length == 0){
              sideBarService.getAllReconcilationList(initialDataLoad,0).then(function (data) {
                addVS1Data('TReconciliation',JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for(let i=0; i<data.treconciliation.length; i++){
                      let openBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.OpenBalance)|| 0.00;
                      let closeBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.CloseBalance)|| 0.00;
                      var dataList = {
                          id: data.treconciliation[i].fields.ID || '',
                          sortdate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("YYYY/MM/DD"): data.treconciliation[i].fields.ReconciliationDate,
                          recondate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("DD/MM/YYYY"): data.treconciliation[i].fields.ReconciliationDate,
                          accountname:data.treconciliation[i].fields.AccountName || '',
                          statementno: data.treconciliation[i].fields.StatementNo || '',
                          department: data.treconciliation[i].fields.DeptName|| '',
                          openbalance: openBalance || 0.00,
                          closebalance: closeBalance || 0.00,
                          employee: data.treconciliation[i].fields.EmployeeName || '',
                          notes: data.treconciliation[i].fields.Notes || '',
                          onhold: data.treconciliation[i].fields.OnHold || false,
                      };
                      if(data.treconciliation[i].fields.ReconciliationDate != ''){
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
                                  filename: "Reconciliation List - "+ moment().format(),
                                  orientation:'portrait',
                                  exportOptions: {
                                      columns: ':visible',
                                      format: {
                                          body: function ( data, row, column ) {
                                              if(data.includes("</span>")){
                                                  var res = data.split("</span>");
                                                  data = res[1];
                                              }

                                              return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                          }
                                      }
                                  }
                              },{
                                  extend: 'print',
                                  download: 'open',
                                  className: "btntabletopdf hiddenColumn",
                                  text: '',
                                  title: 'Reconciliation',
                                  filename: "Reconciliation List - "+ moment().format(),
                                  exportOptions: {
                                      columns: ':visible',
                                      stripHtml: false
                                  }
                              }],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          // bStateSave: true,
                          // rowId: 0,
                          pageLength: initialDatatableLoad,
                          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
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
                for(let i=0; i<data.treconciliation.length; i++){
                    let openBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.OpenBalance)|| 0.00;
                    let closeBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.CloseBalance)|| 0.00;
                    var dataList = {
                        id: data.treconciliation[i].fields.ID || '',
                        sortdate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("YYYY/MM/DD"): data.treconciliation[i].fields.ReconciliationDate,
                        recondate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("DD/MM/YYYY"): data.treconciliation[i].fields.ReconciliationDate,
                        accountname:data.treconciliation[i].fields.AccountName || '',
                        statementno: data.treconciliation[i].fields.StatementNo || '',
                        department: data.treconciliation[i].fields.DeptName|| '',
                        openbalance: openBalance || 0.00,
                        closebalance: closeBalance || 0.00,
                        employee: data.treconciliation[i].fields.EmployeeName || '',
                        notes: data.treconciliation[i].fields.Notes || '',
                        onhold: data.treconciliation[i].fields.OnHold || false,
                    };
                    if(data.treconciliation[i].fields.ReconciliationDate != ''){
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
                                filename: "Reconciliation List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function ( data, row, column ) {
                                            if(data.includes("</span>")){
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }

                                            return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                        }
                                    }
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Reconciliation',
                                filename: "Reconciliation List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 4, "desc" ]],
                        action: function () {
                            $('#tblreconciliationlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblreconciliationlist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < 100){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;

                             sideBarService.getAllReconcilationList(100,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TReconciliation').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.treconciliation), dataOld.treconciliation);
                                   let objCombineData = {
                                     treconciliation:thirdaryData
                                   }


                                     addVS1Data('TReconciliation',JSON.stringify(objCombineData)).then(function (datareturn) {
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
                    }).on('column-reorder', function () {

                    }).on( 'length.dt', function ( e, settings, len ) {
                      $('.fullScreenSpin').css('display','inline-block');
                      let dataLenght = settings._iDisplayLength;
                      if(dataLenght == -1){
                        if(settings.fnRecordsDisplay() > 150){
                          $('.paginate_button.page-item.next').addClass('disabled');
                          $('.fullScreenSpin').css('display','none');
                        }else{
                        sideBarService.getAllReconcilationList('All',1).then(function(dataNonBo) {

                          addVS1Data('TReconciliation',JSON.stringify(dataNonBo)).then(function (datareturn) {
                            templateObject.resetData(dataNonBo);
                          $('.fullScreenSpin').css('display','none');
                          }).catch(function (err) {
                          $('.fullScreenSpin').css('display','none');
                          });
                        }).catch(function(err) {
                          $('.fullScreenSpin').css('display','none');
                        });
                       }
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display','none');
                        }else{
                          sideBarService.getAllReconcilationList(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('TReconciliation',JSON.stringify(dataNonBo)).then(function (datareturn) {
                              templateObject.resetData(dataNonBo);
                            $('.fullScreenSpin').css('display','none');
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
                        FlowRouter.go('/bankrecon?id=' + listData);
                        //window.open('/bankrecon?id=' + listData,'_self');
                    }
                });

            }
        }).catch(function (err) {
            sideBarService.getAllReconcilationList(initialDataLoad,0).then(function (data) {
              addVS1Data('TReconciliation',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<data.treconciliation.length; i++){
                    let openBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.OpenBalance)|| 0.00;
                    let closeBalance = utilityService.modifynegativeCurrencyFormat(data.treconciliation[i].fields.CloseBalance)|| 0.00;
                    var dataList = {
                        id: data.treconciliation[i].fields.ID || '',
                        sortdate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("YYYY/MM/DD"): data.treconciliation[i].fields.ReconciliationDate,
                        recondate: data.treconciliation[i].fields.ReconciliationDate !=''? moment(data.treconciliation[i].fields.ReconciliationDate).format("DD/MM/YYYY"): data.treconciliation[i].fields.ReconciliationDate,
                        accountname:data.treconciliation[i].fields.AccountName || '',
                        statementno: data.treconciliation[i].fields.StatementNo || '',
                        department: data.treconciliation[i].fields.DeptName|| '',
                        openbalance: openBalance || 0.00,
                        closebalance: closeBalance || 0.00,
                        employee: data.treconciliation[i].fields.EmployeeName || '',
                        notes: data.treconciliation[i].fields.Notes || '',
                        onhold: data.treconciliation[i].fields.OnHold || false,
                    };
                    if(data.treconciliation[i].fields.ReconciliationDate != ''){
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
                                filename: "Reconciliation List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function ( data, row, column ) {
                                            if(data.includes("</span>")){
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }

                                            return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                        }
                                    }
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Reconciliation',
                                filename: "Reconciliation List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
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
        sideBarService.getAllTVS1BankDepositData(initialDataLoad,0).then(function(data) {
            addVS1Data('TVS1BankDeposit',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });
        sideBarService.getAllReconcilationList(initialDataLoad,0).then(function(data) {
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
