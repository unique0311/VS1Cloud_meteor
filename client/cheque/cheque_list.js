import { PurchaseBoardService } from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.chequelist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.chequelist.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    const supplierList = [];
    let billTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth()+1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth()+1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

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
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblchequelist', function(error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

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
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.resetData = function (dataVal) {
        window.open('/chequelist?page=last','_self');
    }

    templateObject.getAllChequeData = function() {
      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        getVS1Data('TChequeList').then(function(dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getAllChequeListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(data) {
                addVS1Data('TChequeList',JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  if (data.Params.IgnoreDates == true) {
                      $('#dateFrom').attr('readonly', true);
                      $('#dateTo').attr('readonly', true);
                      FlowRouter.go('/chequelist?ignoredate=true');
                  } else {
                      $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                      $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                  }
                  for (let i = 0; i < data.tchequelist.length; i++) {
                      let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmount) || 0.00;
                      let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalTax) || 0.00;
                      let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmountInc) || 0.00;
                      let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Payment) || 0.00;
                      let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Balance) || 0.00;
                      var dataList = {
                          id: data.tchequelist[i].PurchaseOrderID || '',
                          employee: data.tchequelist[i].EmployeeName || '',
                          accountname: data.tchequelist[i].Account || '',
                          sortdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("YYYY/MM/DD") : data.tchequelist[i].OrderDate,
                          orderdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("DD/MM/YYYY") : data.tchequelist[i].OrderDate,
                          suppliername: data.tchequelist[i].SupplierName || '',
                          chequeNumber: data.tchequelist[i].InvoiceNumber || '',
                          totalamountex: totalAmountEx || 0.00,
                          totaltax: totalTax || 0.00,
                          totalamount: totalAmount || 0.00,
                          totalpaid: totalPaid || 0.00,
                          totaloustanding: totalOutstanding || 0.00,
                          orderstatus: data.tchequelist[i].OrderStatus || '',
                          custfield1: '' || '',
                          custfield2: '' || '',
                          comments: data.tchequelist[i].Comments || '',
                      };
                      dataTableList.push(dataList);

                  }
                  templateObject.datatablerecords.set(dataTableList);

                  if (templateObject.datatablerecords.get()) {

                      Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblchequelist', function(error, result) {
                          if (error) {

                          } else {
                              if (result) {
                                  for (let i = 0; i < result.customFields.length; i++) {
                                      let customcolumn = result.customFields;
                                      let columData = customcolumn[i].label;
                                      let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                      let hiddenColumn = customcolumn[i].hidden;
                                      let columnClass = columHeaderUpdate.split('.')[1];
                                      let columnWidth = customcolumn[i].width;
                                      let columnindex = customcolumn[i].index + 1;

                                      if (hiddenColumn == true) {

                                          $("." + columnClass + "").addClass('hiddenColumn');
                                          $("." + columnClass + "").removeClass('showColumn');
                                      } else if (hiddenColumn == false) {
                                          $("." + columnClass + "").removeClass('hiddenColumn');
                                          $("." + columnClass + "").addClass('showColumn');
                                      }

                                  }
                              }

                          }
                      });


                      setTimeout(function() {
                          MakeNegative();
                      }, 100);
                  }

                  setTimeout(function() {
                      $('.fullScreenSpin').css('display', 'none');
                      $('#tblchequelist').DataTable({
                          "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          buttons: [{
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: chequeSpelling+" "+"List - " + moment().format(),
                              orientation: 'portrait',
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
                          }, {
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: chequeSpelling,
                              filename: chequeSpelling+" "+"List - " + moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          pageLength: initialReportDatatableLoad,
                          "bLengthChange": false,
                          lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                          info: true,
                          responsive: true,
                          "order": [
                              [0, "desc"]
                          ],
                          action: function() {
                              $('#tblchequelist').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblchequelist_ellipsis').addClass('disabled');

                            if(oSettings._iDisplayLength == -1){
                              if(oSettings.fnRecordsDisplay() > 150){
                                $('.paginate_button.page-item.previous').addClass('disabled');
                                $('.paginate_button.page-item.next').addClass('disabled');
                              }
                            }else{

                            }
                            if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }

                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                             .on('click', function(){
                               $('.fullScreenSpin').css('display','inline-block');
                               let dataLenght = oSettings._iDisplayLength;
                               var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                               var dateTo = new Date($("#dateTo").datepicker("getDate"));

                               let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                               let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                               if(checkurlIgnoreDate == 'true'){
                                 sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                   getVS1Data('TChequeList').then(function (dataObjectold) {
                                     if(dataObjectold.length == 0){

                                     }else{
                                       let dataOld = JSON.parse(dataObjectold[0].data);

                                       var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                       let objCombineData = {
                                         Params: dataOld.Params,
                                         tchequelist:thirdaryData
                                       }


                                         addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                               }else{
                               sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TChequeList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tchequelist:thirdaryData
                                     }


                                       addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                             }
                             });


                              setTimeout(function () {
                                  MakeNegative();
                              }, 100);
                          },
                          "fnInitComplete": function () {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshCheque' type='button' id='btnRefreshCheque' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblchequelist_filter");
                            $('.myvarFilterForm').appendTo(".colDateFilter");
                           },
                           "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                             let countTableData = data.Params.Count || 0; //get count from API data

                               return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                           }

                      }).on('page', function() {
                          setTimeout(function() {
                              MakeNegative();
                          }, 100);
                          let draftRecord = templateObject.datatablerecords.get();
                          templateObject.datatablerecords.set(draftRecord);
                      }).on('column-reorder', function() {

                      });
                      $('.fullScreenSpin').css('display', 'none');

                  }, 0);

                  var columns = $('#tblchequelist th');
                  let sTible = "";
                  let sWidth = "";
                  let sIndex = "";
                  let sVisible = "";
                  let columVisible = false;
                  let sClass = "";
                  $.each(columns, function(i, v) {
                      if (v.hidden == false) {
                          columVisible = true;
                      }
                      if ((v.className.includes("hiddenColumn"))) {
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
                  $('#tblchequelist tbody').on('click', 'tr', function() {
                      var listData = $(this).closest('tr').attr('id');
                      if (listData) {
                          FlowRouter.go('/chequecard?id=' + listData);
                      }
                  });

              }).catch(function(err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $('.fullScreenSpin').css('display', 'none');
                  // Meteor._reload.reload();
              });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tchequelist;
                let lineItems = [];
                let lineItemObj = {};
                if (data.Params.IgnoreDates == true) {
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    FlowRouter.go('/chequelist?ignoredate=true');
                } else {
                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }

                for (let i = 0; i < data.tchequelist.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Payment) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Balance) || 0.00;
                    var dataList = {
                        id: data.tchequelist[i].PurchaseOrderID || '',
                        employee: data.tchequelist[i].EmployeeName || '',
                        accountname: data.tchequelist[i].Account || '',
                        sortdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("YYYY/MM/DD") : data.tchequelist[i].OrderDate,
                        orderdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("DD/MM/YYYY") : data.tchequelist[i].OrderDate,
                        suppliername: data.tchequelist[i].SupplierName || '',
                        chequeNumber: data.tchequelist[i].InvoiceNumber || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        orderstatus: data.tchequelist[i].OrderStatus || '',
                        custfield1: '' || '',
                        custfield2: '' || '',
                        comments: data.tchequelist[i].Comments || '',
                    };
                    dataTableList.push(dataList);

                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblchequelist', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function() {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#tblchequelist').DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: chequeSpelling+" "+"List - " + moment().format(),
                            orientation: 'portrait',
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
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: chequeSpelling,
                            filename: chequeSpelling+" "+"List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"]
                        ],
                        action: function() {
                            $('#tblchequelist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblchequelist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;
                             var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                             var dateTo = new Date($("#dateTo").datepicker("getDate"));

                             let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                             let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                             if(checkurlIgnoreDate == 'true'){
                               sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TChequeList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tchequelist:thirdaryData
                                     }


                                       addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                             }else{
                             sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TChequeList').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                   let objCombineData = {
                                     Params: dataOld.Params,
                                     tchequelist:thirdaryData
                                   }


                                     addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                           }
                           });


                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                              this.fnPageChange('last');
                          }
                          $("<button class='btn btn-primary btnRefreshCheque' type='button' id='btnRefreshCheque' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblchequelist_filter");
                          $('.myvarFilterForm').appendTo(".colDateFilter");
                         },
                         "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                           let countTableData = data.Params.Count || 0; //get count from API data

                             return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                         }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                var columns = $('#tblchequelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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
                $('#tblchequelist tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/chequecard?id=' + listData);
                    }
                });
            }
        }).catch(function(err) {
            sideBarService.getAllChequeListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(data) {
              addVS1Data('TChequeList',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                if (data.Params.IgnoreDates == true) {
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    FlowRouter.go('/chequelist?ignoredate=true');
                } else {
                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }
                for (let i = 0; i < data.tchequelist.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Payment) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Balance) || 0.00;
                    var dataList = {
                        id: data.tchequelist[i].PurchaseOrderID || '',
                        employee: data.tchequelist[i].EmployeeName || '',
                        accountname: data.tchequelist[i].Account || '',
                        sortdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("YYYY/MM/DD") : data.tchequelist[i].OrderDate,
                        orderdate: data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("DD/MM/YYYY") : data.tchequelist[i].OrderDate,
                        suppliername: data.tchequelist[i].SupplierName || '',
                        chequeNumber: data.tchequelist[i].InvoiceNumber || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        orderstatus: data.tchequelist[i].OrderStatus || '',
                        custfield1: '' || '',
                        custfield2: '' || '',
                        comments: data.tchequelist[i].Comments || '',
                    };
                    dataTableList.push(dataList);

                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblchequelist', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function() {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#tblchequelist').DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: chequeSpelling+" "+"List - " + moment().format(),
                            orientation: 'portrait',
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
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: chequeSpelling,
                            filename: chequeSpelling+" "+"List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"]
                        ],
                        action: function() {
                            $('#tblchequelist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblchequelist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;
                             var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                             var dateTo = new Date($("#dateTo").datepicker("getDate"));

                             let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                             let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                             if(checkurlIgnoreDate == 'true'){
                               sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TChequeList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tchequelist:thirdaryData
                                     }


                                       addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                             }else{
                             sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TChequeList').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                   let objCombineData = {
                                     Params: dataOld.Params,
                                     tchequelist:thirdaryData
                                   }


                                     addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

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
                           }
                           });


                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                              this.fnPageChange('last');
                          }
                          $("<button class='btn btn-primary btnRefreshCheque' type='button' id='btnRefreshCheque' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblchequelist_filter");
                          $('.myvarFilterForm').appendTo(".colDateFilter");
                         },
                         "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                           let countTableData = data.Params.Count || 0; //get count from API data

                             return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                         }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function() {

                    });

                    $('.fullScreenSpin').css('display', 'none');
                }, 0);
                var columns = $('#tblchequelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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
                $('#tblchequelist tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/chequecard?id=' + listData);
                    }
                });

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    }

    templateObject.getAllChequeData();


    templateObject.getAllFilterChequeData = function (fromDate,toDate, ignoreDate) {
      sideBarService.getAllChequeListData(fromDate,toDate, ignoreDate,initialReportLoad,0).then(function(data) {

        addVS1Data('TChequeList',JSON.stringify(data)).then(function (datareturn) {
            window.open('/chequelist?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate='+ignoreDate,'_self');
        }).catch(function (err) {
          location.reload();
        });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                templateObject.datatablerecords.set('');
                $('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    if(urlParametersDateFrom){
      if(urlParametersIgnoreDate == true){
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
      }else{

        $("#dateFrom").val(urlParametersDateFrom !=''? moment(urlParametersDateFrom).format("DD/MM/YYYY"): urlParametersDateFrom);
        $("#dateTo").val(urlParametersDateTo !=''? moment(urlParametersDateTo).format("DD/MM/YYYY"): urlParametersDateTo);
      }
    }
});

Template.chequelist.events({
    'click #btnNewCheque': function(event) {
        FlowRouter.go('/chequecard');
    },
    'click .btnRefreshCheque': function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblchequelist_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewChequeByNameOrID(dataSearchName).then(function (data) {
              $(".btnRefreshCheque").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tchequeex.length > 0) {
                   for (let i = 0; i < data.tchequeex.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalAmount) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalTax) || 0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalBalance) || 0.00;
                        var dataList = {
                            id: data.tchequeex[i].fields.ID || '',
                            employee: data.tchequeex[i].fields.EmployeeName || '',
                            accountname: data.tchequeex[i].fields.GLAccountName || '',
                            sortdate: data.tchequeex[i].fields.OrderDate != '' ? moment(data.tchequeex[i].fields.OrderDate).format("YYYY/MM/DD") : data.tchequeex[i].fields.OrderDate,
                            orderdate: data.tchequeex[i].fields.OrderDate != '' ? moment(data.tchequeex[i].fields.OrderDate).format("DD/MM/YYYY") : data.tchequeex[i].fields.OrderDate,
                            suppliername: data.tchequeex[i].fields.SupplierName || '',
                            chequeNumber: data.tchequeex[i].fields.SupplierInvoiceNumber || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            orderstatus: data.tchequeex[i].fields.OrderStatus || '',
                            custfield1: '' || '',
                            custfield2: '' || '',
                            comments: data.tchequeex[i].fields.Comments || '',
                        };
                        if(data.tchequeex[i].fields.Deleted == false){
                        splashArrayInvoiceList.push(dataList);
                        }

                    }
                    templateObject.datatablerecords.set(splashArrayInvoiceList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (splashArrayInvoiceList) {
                        var datatable = $('#tblchequelist').DataTable();
                        $("#tblchequelist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblchequelist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colSortDate hiddenColumn">' + item[x].sortdate + '</td>' +
                                '<td contenteditable="false" class="colOrderDate" ><span style="display:none;">' + item[x].orderdate + '</span>' + item[x].orderdate + '</td>' +
                                '<td contenteditable="false" class="colChequeID">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colBankAccount" >' + item[x].accountname + '</td>' +
                                '<td contenteditable="false" class="colPurchaseNo">' + item[x].chequeNumber + '</td>' +
                                '<td contenteditable="false" class="colSupplier">' + item[x].suppliername + '</td>' +
                                '<td contenteditable="false" class="colAmountEx" style="text-align: right!important;">' + item[x].totalamountex + '</td>' +
                                '<td contenteditable="false" class="colTax" style="text-align: right!important;">' + item[x].totaltax + '</td>' +
                                '<td contenteditable="false" class="colAmount" style="text-align: right!important;">' + item[x].totalamount + '</td>' +
                                '<td contenteditable="false" class="colPaid" style="text-align: right!important;">' + item[x].totalpaid + '</td>' +
                                '<td contenteditable="false" class="colBalanceOutstanding" style="text-align: right!important;"">' + item[x].totaloustanding + '</td>' +
                                '<td contenteditable="false" class="colComments">' + item[x].comments + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.tchequeex.length + ' of ' + data.tchequeex.length + ' entries');

                    }

                } else {
                    $('.fullScreenSpin').css('display', 'none');

                    swal({
                        title: 'Question',
                        text: "Cheque does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/chequecard');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {

            $(".btnRefresh").trigger("click");
        }
    },
    'click .chkDatatable': function(event) {
        var columns = $('#tblchequelist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'keyup #tblchequelist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshCheque").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshCheque").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshCheque").trigger("click");
          }
        },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblchequelist' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
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
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblchequelist' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblchequelist',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblchequelist',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });

                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblchequelist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblchequelist th');
        $.each(datable, function(i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblchequelist th');
        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblchequelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');




        var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);
    let fromDateDay = currentBeginDate.getDate();
    if((currentBeginDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    }else{
      fromDateMonth = (currentBeginDate.getMonth()+1);
    }

    if(currentBeginDate.getDate() < 10){
        fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        sideBarService.getAllPurchaseOrderListAll(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(data) {
            addVS1Data('TbillReport',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllChequeListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(dataCheque) {
            addVS1Data('TChequeList', JSON.stringify(dataCheque)).then(function(datareturn) {
              sideBarService.getAllChequeList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCheque', JSON.stringify(data)).then(function(datareturn) {
                      window.open('/chequelist', '_self');
                  }).catch(function(err) {
                     window.open('/chequelist', '_self');
                  });
              }).catch(function(err) {
                  window.open('/chequelist', '_self');
              });
            }).catch(function(err) {
              sideBarService.getAllChequeList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCheque', JSON.stringify(data)).then(function(datareturn) {
                      window.open('/chequelist', '_self');
                  }).catch(function(err) {
                     window.open('/chequelist', '_self');
                  });
              }).catch(function(err) {
                  window.open('/chequelist', '_self');
              });
            });
        }).catch(function(err) {
            window.open('/chequelist', '_self');
        });
    },
    'change #dateTo': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
          templateObject.getAllFilterChequeData(formatDateFrom,formatDateTo, false);
        }

    },
    'change #dateFrom': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            templateObject.getAllFilterChequeData(formatDateFrom,formatDateTo, false);
        }

    },
    'click #lastMonth': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
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
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);
    },
    'click #lastQuarter': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        function getQuarter(d) {
            d = d || new Date();
            var m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }

        var quarterAdjustment = (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);

        let fromDateMonth = getQuarter(currentDate);
        var quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();

        var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);
    },
    'click #last12Months': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth()+1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth()+1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var currentDate2 = new Date();
        if ((currentDate2.getMonth()+1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);

    },
    'click #ignoreDate': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterChequeData('', '', true);
    },
    'click .printConfirm': function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblchequelist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }

});

Template.chequelist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.orderdate == 'NA') {
                return 1;
            } else if (b.orderdate == 'NA') {
                return -1;
            }
            return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    purchasesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblchequelist' });
    },
    formname: () => {
        return chequeSpelling;
    }

});
