import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {CountryService} from '../../js/country-service';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import { AccountService } from "../../accounts/account-service";
import '../../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { Random } from 'meteor/random';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.payrollrules.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatableallowancerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.Ratetypes = new ReactiveVar([]);
   // templateObject.Accounts = new ReactiveVar([]);
    
   
});

Template.payrollrules.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    var splashArrayAllowanceList = new Array();
    var splashArrayDeductionList = new Array();

    var countryService = new CountryService();
    let countries = [];

    $("#date-input,#edtStartDate,#edtFirstPaymentDate,#edtHolidayDate").datepicker({
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

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.resetData = function (dataVal) {
        location.reload();
    }

    templateObject.Ratetypes = function() {
        getVS1Data('TPayRateType').then(function(dataObject) {
            
            if (dataObject.length == 0) {
                sideBarService.getRateListVS1().then(function(data) {
                    let records = [];
                    let inventoryData = [];
                   
                    addVS1Data('TPayRateType',JSON.stringify(data));
                    for (let i = 0; i < data.tpayratetype.length; i++) {
                       
                         $('#edtRateTypeOvertime').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeTermnination').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeLumpSumE').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeBonusesCommissions').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeLumpSumW').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeDirectorsFees').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateType').editableSelect('add',data.tpayratetype[i].fields.Description);
                    }
                  
                });
            } else {

                
                let data = JSON.parse(dataObject[0].data);

                let useData = data;               
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    
                         $('#edtRateTypeOvertime').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeTermnination').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeLumpSumE').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeBonusesCommissions').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeLumpSumW').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateTypeDirectorsFees').editableSelect('add',data.tpayratetype[i].fields.Description);
                         $('#edtRateType').editableSelect('add',data.tpayratetype[i].fields.Description);
                }
             
           
            }
        }).catch(function(err) {
            sideBarService.getRateListVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tpayratetype.length; i++) {
                   
                    $('#edtRateTypeOvertime').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateTypeTermnination').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateTypeLumpSumE').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateTypeBonusesCommissions').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateTypeLumpSumW').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateTypeDirectorsFees').editableSelect('add',data.tpayratetype[i].fields.Description);
                    $('#edtRateType').editableSelect('add',data.tpayratetype[i].fields.Description);  
                }
                          
            });
        });
    };

    templateObject.Ratetypes();

    templateObject.getAllAllowance = function() {
    getVS1Data('TAllowance').then(function(dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getAllowance(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TAllowance', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tallowance.length; i++) {
                  let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

                  var dataListAllowance = [
                      data.tallowance[i].fields.ID || 0,
                      data.tallowance[i].fields.Description || '-',
                      data.tallowance[i].fields.AllowanceType || '',
                      data.tallowance[i].fields.DisplayIn || '',
                      allowanceAmount || 0.00,
                      data.tallowance[i].fields.Accountname || '',
                      data.tallowance[i].fields.Accountid || 0,
                      data.tallowance[i].fields.Payrolltaxexempt || false,
                      data.tallowance[i].fields.Superinc || false,
                      data.tallowance[i].fields.Workcoverexempt || false,
                      '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];

                  splashArrayAllowanceList.push(dataListAllowance);
              }

              function MakeNegative() {
                  $('td').each(function () {
                      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                  });
              };


              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblAlowances').DataTable({

                      data: splashArrayAllowanceList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                          {
                              className: "colAlowancesID hiddenColumn",
                              "targets": [0]
                          },
                          {
                              className: "colAllowancesNames",
                              "targets": [1]
                          },  {
                              className: "colAllowancesType",
                              "targets": [2]
                          }, {
                              className: "colAllowancesDisplayName",
                              "targets": [3]
                          }, {
                              className: "colAllowancesAmount  text-right",
                              "targets": [4]
                          }, {
                              className: "colAllowancesAccounts",
                              "targets": [5]
                          }, {
                              className: "colAllowancesAccountsID hiddenColumn",
                              "targets": [6]
                          }, {
                              className: "colAllowancesPAYG hiddenColumn",
                              "targets": [7]
                          }, {
                              className: "colAllowancesSuperannuation hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colAllowancesReportableasW1 hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "colDeleteAllowances",
                              "orderable": false,
                              "targets": -1
                          }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[0, "asc"]],
                      action: function () {
                          $('#tblAlowances').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblAlowances_ellipsis').addClass('disabled');
                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {

                              }
                          } else {

                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {
                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  var splashArrayAllowanceListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblAlowances_filter input').val();

                                  sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                              for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                                  let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                                  var dataListCustomerDupp = [
                                                    dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                    dataObjectnew.tallowance[i].fields.Description || '-',
                                                    dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                    dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                    allowanceAmount || 0.00,
                                                    dataObjectnew.tallowance[i].fields.Accountname || '',
                                                    dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                    dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                    dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                    dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                    '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                  ];

                                                  splashArrayAllowanceList.push(dataListCustomerDupp);
                                                  //}
                                              }

                                              let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                              var datatable = $('#tblAlowances').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblAlowances").dataTable().fnPageChange('last');
                                              }, 400);

                                              $('.fullScreenSpin').css('display', 'none');


                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });

                              });
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      },
                      "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                      }

                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);

                  }).on('column-reorder', function () {

                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayAllowanceList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');

                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                                addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                    templateObject.resetData(dataNonBo);
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  });


              }, 0);

              $('div.dataTables_filter input').addClass('form-control form-control-sm');

              $('.fullScreenSpin').css('display', 'none');
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{

          let data = JSON.parse(dataObject[0].data);

          let useData = data;
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tallowance.length; i++) {
              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

              var dataListAllowance = [
                  data.tallowance[i].fields.ID || 0,
                  data.tallowance[i].fields.Description || '-',
                  data.tallowance[i].fields.AllowanceType || '',
                  data.tallowance[i].fields.DisplayIn || '',
                  allowanceAmount || 0.00,
                  data.tallowance[i].fields.Accountname || '',
                  data.tallowance[i].fields.Accountid || 0,
                  data.tallowance[i].fields.Payrolltaxexempt || false,
                  data.tallowance[i].fields.Superinc || false,
                  data.tallowance[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayAllowanceList.push(dataListAllowance);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblAlowances').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colAlowancesID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colAllowancesNames",
                          "targets": [1]
                      },  {
                          className: "colAllowancesType",
                          "targets": [2]
                      }, {
                          className: "colAllowancesDisplayName",
                          "targets": [3]
                      }, {
                          className: "colAllowancesAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colAllowancesAccounts",
                          "targets": [5]
                      }, {
                          className: "colAllowancesAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colAllowancesPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colAllowancesSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colAllowancesReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteAllowances",
                          "orderable": false,
                          "targets": -1
                      }
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[0, "asc"]],
                  action: function () {
                      $('#tblAlowances').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblAlowances_ellipsis').addClass('disabled');
                      if (oSettings._iDisplayLength == -1) {
                          if (oSettings.fnRecordsDisplay() > 150) {

                          }
                      } else {

                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                          $('.paginate_button.page-item.next').addClass('disabled');
                      }

                      $('.paginate_button.next:not(.disabled)', this.api().table().container())
                          .on('click', function () {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              var splashArrayAllowanceListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblAlowances_filter input').val();

                              sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                dataObjectnew.tallowance[i].fields.Description || '-',
                                                dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tallowance[i].fields.Accountname || '',
                                                dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblAlowances').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblAlowances").dataTable().fnPageChange('last');
                                          }, 400);

                                          $('.fullScreenSpin').css('display', 'none');


                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });

                          });
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  },
                  "fnInitComplete": function () {
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayAllowanceList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                templateObject.resetData(dataNonBo);
                                $('.fullScreenSpin').css('display', 'none');
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              });


          }, 0);

          $('div.dataTables_filter input').addClass('form-control form-control-sm');
          $('.fullScreenSpin').css('display', 'none');

        }
    }).catch(function(err) {
      sideBarService.getAllowance(initialBaseDataLoad, 0).then(function (data) {
          addVS1Data('TAllowance', JSON.stringify(data));
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tallowance.length; i++) {
              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

              var dataListAllowance = [
                  data.tallowance[i].fields.ID || 0,
                  data.tallowance[i].fields.Description || '-',
                  data.tallowance[i].fields.AllowanceType || '',
                  data.tallowance[i].fields.DisplayIn || '',
                  allowanceAmount || 0.00,
                  data.tallowance[i].fields.Accountname || '',
                  data.tallowance[i].fields.Accountid || 0,
                  data.tallowance[i].fields.Payrolltaxexempt || false,
                  data.tallowance[i].fields.Superinc || false,
                  data.tallowance[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayAllowanceList.push(dataListAllowance);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblAlowances').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colAlowancesID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colAllowancesNames",
                          "targets": [1]
                      },  {
                          className: "colAllowancesType",
                          "targets": [2]
                      }, {
                          className: "colAllowancesDisplayName",
                          "targets": [3]
                      }, {
                          className: "colAllowancesAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colAllowancesAccounts",
                          "targets": [5]
                      }, {
                          className: "colAllowancesAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colAllowancesPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colAllowancesSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colAllowancesReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteAllowances",
                          "orderable": false,
                          "targets": -1
                      }
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[0, "asc"]],
                  action: function () {
                      $('#tblAlowances').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblAlowances_ellipsis').addClass('disabled');
                      if (oSettings._iDisplayLength == -1) {
                          if (oSettings.fnRecordsDisplay() > 150) {

                          }
                      } else {

                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                          $('.paginate_button.page-item.next').addClass('disabled');
                      }

                      $('.paginate_button.next:not(.disabled)', this.api().table().container())
                          .on('click', function () {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              var splashArrayAllowanceListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblAlowances_filter input').val();

                              sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                dataObjectnew.tallowance[i].fields.Description || '-',
                                                dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tallowance[i].fields.Accountname || '',
                                                dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblAlowances').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblAlowances").dataTable().fnPageChange('last');
                                          }, 400);

                                          $('.fullScreenSpin').css('display', 'none');


                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });

                          });
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  },
                  "fnInitComplete": function () {
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayAllowanceList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                templateObject.resetData(dataNonBo);
                                $('.fullScreenSpin').css('display', 'none');
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              });


          }, 0);

          $('div.dataTables_filter input').addClass('form-control form-control-sm');

          $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    });
    };
    templateObject.getAllAllowance();

    templateObject.getAllDeductions = function() {
    getVS1Data('TDeduction').then(function(dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getDeduction(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TDeduction', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              let deductionTypeVal = 'None';
              for (let i = 0; i < data.tdeduction.length; i++) {
                  let deductionAmount = utilityService.modifynegativeCurrencyFormat(data.tdeduction[i].fields.Amount) || 0.00;
                  if(data.tdeduction[i].fields.Taxexempt == true){
                    deductionTypeVal = 'None';
                  }else{
                    if(data.tdeduction[i].fields.IsWorkPlacegiving == true){
                      deductionTypeVal = 'Workplace Giving';
                    }

                    if(data.tdeduction[i].fields.Unionfees == true){
                      deductionTypeVal = 'Union / Association Fees';
                    }
                  }
                  var dataListDeduction = [
                      data.tdeduction[i].fields.ID || 0,
                      data.tdeduction[i].fields.Description || '-',
                      deductionTypeVal || 'None',
                      data.tdeduction[i].fields.Displayin || '',
                      deductionAmount || 0.00,
                      data.tdeduction[i].fields.Accountname || '',
                      data.tdeduction[i].fields.Accountid || 0,
                      data.tdeduction[i].fields.Payrolltaxexempt || false,
                      data.tdeduction[i].fields.Superinc || false,
                      data.tdeduction[i].fields.Workcoverexempt || false,
                      '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];

                  splashArrayDeductionList.push(dataListDeduction);
              }

              function MakeNegative() {
                  $('td').each(function () {
                      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                  });
              };


              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblDeductions').DataTable({

                      data: splashArrayDeductionList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                          {
                              className: "colDeductionsID hiddenColumn",
                              "targets": [0]
                          },
                          {
                              className: "colDeductionsNames",
                              "targets": [1]
                          },  {
                              className: "colDeductionsType",
                              "targets": [2]
                          }, {
                              className: "colDeductionsDisplayName",
                              "targets": [3]
                          }, {
                              className: "colDeductionsAmount  text-right",
                              "targets": [4]
                          }, {
                              className: "colDeductionsAccounts",
                              "targets": [5]
                          }, {
                              className: "colDeductionsAccountsID hiddenColumn",
                              "targets": [6]
                          }, {
                              className: "colDeductionsPAYG hiddenColumn",
                              "targets": [7]
                          }, {
                              className: "colDeductionsSuperannuation hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colDeductionsReportableasW1 hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "colDeleteDeductions",
                              "orderable": false,
                              "targets": -1
                          }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[0, "asc"]],
                      action: function () {
                          $('#tblDeductions').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblDeductions_ellipsis').addClass('disabled');
                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {

                              }
                          } else {

                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {
                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  var splashArrayDeductionListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblDeductions_filter input').val();

                                  sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                              for (let j = 0; j < dataObjectnew.tdeduction.length; j++) {

                                                  let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tdeduction[j].fields.Amount) || 0.00;

                                                  var dataListCustomerDupp = [
                                                    dataObjectnewdataObjectnew.tdeduction[i].fields.ID || 0,
                                                    dataObjectnew.tdeduction[i].fields.Description || '-',
                                                    dataObjectnew.tdeduction[i].fields.DeductionType || '',
                                                    dataObjectnew.tdeduction[i].fields.DisplayIn || '',
                                                    allowanceAmount || 0.00,
                                                    dataObjectnew.tdeduction[i].fields.Accountname || '',
                                                    dataObjectnew.tdeduction[i].fields.Accountid || 0,
                                                    dataObjectnew.tdeduction[i].fields.Payrolltaxexempt || false,
                                                    dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc || false,
                                                    dataObjectnew.tdeduction[i].fields.Workcoverexempt || false,
                                                    '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                  ];

                                                  splashArrayDeductionList.push(dataListCustomerDupp);
                                                  //}
                                              }

                                              let uniqueChars = [...new Set(splashArrayDeductionList)];
                                              var datatable = $('#tblDeductions').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblDeductions").dataTable().fnPageChange('last');
                                              }, 400);

                                              $('.fullScreenSpin').css('display', 'none');


                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });

                              });
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      },
                      "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal'  type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                          $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

                      }

                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);

                  }).on('column-reorder', function () {

                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayDeductionList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');

                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getDeduction(dataLenght, 0).then(function (dataNonBo) {

                                addVS1Data('TDeduction', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                    templateObject.resetData(dataNonBo);
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  });


              }, 0);

              $('div.dataTables_filter input').addClass('form-control form-control-sm');

              $('.fullScreenSpin').css('display', 'none');
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{

          let data = JSON.parse(dataObject[0].data);
          let useData = data;
          let lineItems = [];
          let lineItemObj = {};
          let deductionTypeVal = 'None';
          for (let i = 0; i < data.tdeduction.length; i++) {
              let deductionAmount = utilityService.modifynegativeCurrencyFormat(data.tdeduction[i].fields.Amount) || 0.00;
              if(data.tdeduction[i].fields.Taxexempt == true){
                deductionTypeVal = 'None';
              }else{
                if(data.tdeduction[i].fields.IsWorkPlacegiving == true){
                  deductionTypeVal = 'Workplace Giving';
                }

                if(data.tdeduction[i].fields.Unionfees == true){
                  deductionTypeVal = 'Union / Association Fees';
                }
              }
              var dataListDeduction = [
                  data.tdeduction[i].fields.ID || 0,
                  data.tdeduction[i].fields.Description || '-',
                  deductionTypeVal || 'None',
                  data.tdeduction[i].fields.Displayin || '',
                  deductionAmount || 0.00,
                  data.tdeduction[i].fields.Accountname || '',
                  data.tdeduction[i].fields.Accountid || 0,
                  data.tdeduction[i].fields.Payrolltaxexempt || false,
                  data.tdeduction[i].fields.Superinc || false,
                  data.tdeduction[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayDeductionList.push(dataListDeduction);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblDeductions').DataTable({

                  data: splashArrayDeductionList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colDeductionsID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colDeductionsNames",
                          "targets": [1]
                      },  {
                          className: "colDeductionsType",
                          "targets": [2]
                      }, {
                          className: "colDeductionsDisplayName",
                          "targets": [3]
                      }, {
                          className: "colDeductionsAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colDeductionsAccounts",
                          "targets": [5]
                      }, {
                          className: "colDeductionsAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colDeductionsPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colDeductionsSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colDeductionsReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteDeductions",
                          "orderable": false,
                          "targets": -1
                      }
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[0, "asc"]],
                  action: function () {
                      $('#tblDeductions').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblDeductions_ellipsis').addClass('disabled');
                      if (oSettings._iDisplayLength == -1) {
                          if (oSettings.fnRecordsDisplay() > 150) {

                          }
                      } else {

                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                          $('.paginate_button.page-item.next').addClass('disabled');
                      }

                      $('.paginate_button.next:not(.disabled)', this.api().table().container())
                          .on('click', function () {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              var splashArrayDeductionListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblDeductions_filter input').val();

                              sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tdeduction.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tdeduction[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tdeduction[i].fields.ID || 0,
                                                dataObjectnew.tdeduction[i].fields.Description || '-',
                                                dataObjectnew.tdeduction[i].fields.DeductionType || '',
                                                dataObjectnew.tdeduction[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tdeduction[i].fields.Accountname || '',
                                                dataObjectnew.tdeduction[i].fields.Accountid || 0,
                                                dataObjectnew.tdeduction[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc || false,
                                                dataObjectnew.tdeduction[i].fields.Workcoverexempt || false,
                                                alldata = dataObjectnew.tdeduction[i].fields.Description+','
                                                          +dataObjectnew.tdeduction[i].fields.DeductionType
                                                          +','+dataObjectnew.tdeduction[i].fields.DisplayIn
                                                          +','+allowanceAmount+','
                                                          +dataObjectnew.tdeduction[i].fields.Accountname+','+dataObjectnew.tdeduction[i].fields.Accountid
                                                          +','+dataObjectnew.tdeduction[i].fields.Payrolltaxexempt+
                                                          ','+dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc+','
                                                          +dataObjectnew.tdeduction[i].fields.Workcoverexempt,
                                                '<td contenteditable="false" class="colDeleteDeductions"><span class="alldataget" style="display:none;">'+alldata+'</span><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayDeductionList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayDeductionList)];
                                          var datatable = $('#tblDeductions').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblDeductions").dataTable().fnPageChange('last');
                                          }, 400);

                                          $('.fullScreenSpin').css('display', 'none');


                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });

                          });
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  },
                  "fnInitComplete": function () {
                      $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal'  type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                      $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayDeductionList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getDeduction(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TDeduction', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                templateObject.resetData(dataNonBo);
                                $('.fullScreenSpin').css('display', 'none');
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              });


          }, 0);

          $('div.dataTables_filter input').addClass('form-control form-control-sm');
          $('.fullScreenSpin').css('display', 'none');

        }
    }).catch(function(err) {
      sideBarService.getDeduction(initialBaseDataLoad, 0).then(function (data) {
          addVS1Data('TDeduction', JSON.stringify(data));
          let lineItems = [];
          let lineItemObj = {};
          let deductionTypeVal = 'None';
          for (let i = 0; i < data.tdeduction.length; i++) {
              let deductionAmount = utilityService.modifynegativeCurrencyFormat(data.tdeduction[i].fields.Amount) || 0.00;
              if(data.tdeduction[i].fields.Taxexempt == true){
                deductionTypeVal = 'None';
              }else{
                if(data.tdeduction[i].fields.IsWorkPlacegiving == true){
                  deductionTypeVal = 'Workplace Giving';
                }

                if(data.tdeduction[i].fields.Unionfees == true){
                  deductionTypeVal = 'Union / Association Fees';
                }
              }
              var dataListDeduction = [
                  data.tdeduction[i].fields.ID || 0,
                  data.tdeduction[i].fields.Description || '-',
                  deductionTypeVal || 'None',
                  data.tdeduction[i].fields.Displayin || '',
                  deductionAmount || 0.00,
                  data.tdeduction[i].fields.Accountname || '',
                  data.tdeduction[i].fields.Accountid || 0,
                  data.tdeduction[i].fields.Payrolltaxexempt || false,
                  data.tdeduction[i].fields.Superinc || false,
                  data.tdeduction[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayDeductionList.push(dataListDeduction);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblDeductions').DataTable({

                  data: splashArrayDeductionList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colDeductionsID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colDeductionsNames",
                          "targets": [1]
                      },  {
                          className: "colDeductionsType",
                          "targets": [2]
                      }, {
                          className: "colDeductionsDisplayName",
                          "targets": [3]
                      }, {
                          className: "colDeductionsAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colDeductionsAccounts",
                          "targets": [5]
                      }, {
                          className: "colDeductionsAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colDeductionsPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colDeductionsSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colDeductionsReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteDeductions",
                          "orderable": false,
                          "targets": -1
                      }
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[0, "asc"]],
                  action: function () {
                      $('#tblDeductions').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblDeductions_ellipsis').addClass('disabled');
                      if (oSettings._iDisplayLength == -1) {
                          if (oSettings.fnRecordsDisplay() > 150) {

                          }
                      } else {

                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                          $('.paginate_button.page-item.next').addClass('disabled');
                      }

                      $('.paginate_button.next:not(.disabled)', this.api().table().container())
                          .on('click', function () {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              var splashArrayDeductionListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblDeductions_filter input').val();

                              sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tdeduction.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tdeduction[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tdeduction[i].fields.ID || 0,
                                                dataObjectnew.tdeduction[i].fields.Description || '-',
                                                dataObjectnew.tdeduction[i].fields.DeductionType || '',
                                                dataObjectnew.tdeduction[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tdeduction[i].fields.Accountname || '',
                                                dataObjectnew.tdeduction[i].fields.Accountid || 0,
                                                dataObjectnew.tdeduction[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc || false,
                                                dataObjectnew.tdeduction[i].fields.Workcoverexempt || false,
                                                '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayDeductionList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayDeductionList)];
                                          var datatable = $('#tblDeductions').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblDeductions").dataTable().fnPageChange('last');
                                          }, 400);

                                          $('.fullScreenSpin').css('display', 'none');


                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });

                          });
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  },
                  "fnInitComplete": function () {
                      $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                      $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayDeductionList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getDeduction(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TDeduction', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                templateObject.resetData(dataNonBo);
                                $('.fullScreenSpin').css('display', 'none');
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              });


          }, 0);

          $('div.dataTables_filter input').addClass('form-control form-control-sm');

          $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    });
    };

    templateObject.getAllDeductions();

    $('#tblAlowances tbody').on( 'click', 'td:not(.colDeleteAllowances)', function () {
     
    var listData = $(this).closest('tr').find('.colAlowancesID').text();
      if(listData){
      let allowanceType = $(this).closest('tr').find('.colAllowancesType').text()||'';
      let earningName = $(this).closest('tr').find('.colAllowancesNames').text()||'';
      let earningDisplayName = $(this).closest('tr').find('.colAllowancesDisplayName').text()||'';
      let earningAmount = $(this).closest('tr').find('.colAllowancesAmount').text()||'0.00';
      let earningExpenseAccount = $(this).closest('tr').find('.colAllowancesAccounts').text()||'';
      let earningExpenseAccountID = $(this).closest('tr').find('.colAllowancesAccountsID').text()||'';
      let exemptPAYG = $(this).closest('tr').find('.colAllowancesPAYG').text()||'false';
      let exemptSupernation = $(this).closest('tr').find('.colAllowancesSuperannuation').text()||'false';
      let exemptActivityStatement = $(this).closest('tr').find('.colAllowancesReportableasW1').text()||'false';

      $('#edtAllowanceID').val(listData);
      $('#edtAllowanceType').val(allowanceType);
      $('#edtEarningsNameAllowance').val(earningName);
      $('#edtDisplayNameAllowance').val(earningDisplayName);
      $('#edtAllowanceAmount').val(earningAmount);
      $('#edtExpenseAccountAllowance').val(earningExpenseAccount);

      $('#editbankaccount').val(earningExpenseAccount);
      $('#edtReimbursementAccount').val(earningExpenseAccount);
      $('#editpaygbankaccount').val(earningExpenseAccount);
      $('#editwagesexpbankaccount').val(earningExpenseAccount);
      $('#editwagespaybankaccount').val(earningExpenseAccount);
      $('#editsuperliabbankaccount').val(earningExpenseAccount);
      $('#editsuperexpbankaccount').val(earningExpenseAccount); 

      $('#edtExpenseAccountDirectorsFees').val(earningExpenseAccount);
      $('#edtExpenseAccountTermnination').val(earningExpenseAccount);
      $('#edtExpenseAccount').val(earningExpenseAccount);
      $('#edtExpenseAccountOvertime').val(earningExpenseAccount);
      $('#edtExpenseAccountLumpSumE').val(earningExpenseAccount);
      $('#edtExpenseAccountBonusesCommissions').val(earningExpenseAccount);
      $('#edtExpenseAccountLumpSumW').val(earningExpenseAccount);



      $('#edtExpenseAccountID').val(earningExpenseAccountID);

      if(exemptPAYG == 'true'){
          $('#formCheck-ExemptPAYGAllowance').prop('checked', true);
      }else{
        $('#formCheck-ExemptPAYGAllowance').prop('checked', false);
      }

      if(exemptSupernation == 'true'){
          $('#formCheck-ExemptSuperannuationAllowance').prop('checked', true);
      }else{
        $('#formCheck-ExemptSuperannuationAllowance').prop('checked', false);
      }

      if(exemptActivityStatement == 'true'){
          $('#formCheck-ExemptReportableAllowance').prop('checked', true);
      }else{
        $('#formCheck-ExemptReportableAllowance').prop('checked', false);
      }

      $('#allowanceModal').modal('toggle');

    }
    });

    $('#tblDeductions tbody').on( 'click', 'td:not(.colDeleteDeductions)', function () {
    var listData = $(this).closest('tr').find('.colDeductionsID').text();
    if(listData){
      let deductionType = $(this).closest('tr').find('.colDeductionsType').text()||'';
      let deductionName = $(this).closest('tr').find('.colDeductionsNames').text()||'';
      let deductionDisplayName = $(this).closest('tr').find('.colDeductionsDisplayName').text()||'';
      let deductionAmount = $(this).closest('tr').find('.colDeductionsAmount').text()||'0.00';
      let deductionAccount = $(this).closest('tr').find('.colDeductionsAccounts').text()||'';
      let deductionAccountID = $(this).closest('tr').find('.colDeductionsAccountsID').text()||'';
      let deductionexemptPAYG = $(this).closest('tr').find('.colDeductionsPAYG').text()||'false';
      let deductionexemptSupernation = $(this).closest('tr').find('.colDeductionsSuperannuation').text()||'false';
      let deductionexemptActivityStatement = $(this).closest('tr').find('.colDeductionsReportableasW1').text()||'false';

      $('#edtDeductionID').val(listData);
      //$('#edtAllowanceType').val(allowanceType);
      $('#edtDeductionName').val(deductionName);
      //$('#edtDisplayNameAllowance').val(earningDisplayName);
      $('#edtDeductionAmount').val(deductionAmount);
      $('#edtDeductionAccount').val(deductionAccount);
      $('#edtDeductionAccountID').val(deductionAccountID);
        if(deductionType == 'None'){
            $('#noneLabel').html('None');
            $('#edtDeductionTitle').val('None');
        }
        if(deductionType == 'Workplace Giving'){
          $('#noneLabel').html('Workplace Giving');
          $('#edtDeductionTitle').val('WorkplaceGiving');
        }
        if(deductionType == 'Union / Association Fees'){
          $('#noneLabel').html('Union / Association Fees');
          $('#edtDeductionTitle').val('UnionAssociationFees');
        }



      // if(exemptPAYG == 'true'){
      //     $('#formCheck-ExemptPAYGAllowance').prop('checked', true);
      // }else{
      //   $('#formCheck-ExemptPAYGAllowance').prop('checked', false);
      // }
      //
      // if(exemptSupernation == 'true'){
      //     $('#formCheck-ExemptSuperannuationAllowance').prop('checked', true);
      // }else{
      //   $('#formCheck-ExemptSuperannuationAllowance').prop('checked', false);
      // }
      //
      // if(exemptActivityStatement == 'true'){
      //     $('#formCheck-ExemptReportableAllowance').prop('checked', true);
      // }else{
      //   $('#formCheck-ExemptReportableAllowance').prop('checked', false);
      // }

      $('#deductionModal').modal('toggle');

    }
    });

    // $('#tblAlowances tbody').on( 'click', 'td.colDeleteAllowances', function () {
    //   var listData = $(this).closest('tr').find('.colAlowancesID').text();
    //   if(listData){
    //     // FlowRouter.go('/productview?id=' + listData+'&instock=true');
    //   }
    // });


    setTimeout(function() {
        $('#tblHolidays').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayCalendars').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

    setTimeout(function() {
        $('#tblPayCalendars').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayCalendars').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

    setTimeout(function() {
        $('#tblPayRollRulesList').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayRollRulesList').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

    setTimeout(function() {
        $('#tblSuperannuation').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblSuperannuation').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

    setTimeout(function() {
        $('#tblReimbursements').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblReimbursements').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

   setTimeout(function() {
        $('#tblLeave').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblLeave').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

   setTimeout(function() {

        $('#tblEarnings').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblLeave').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

   $(document).on('click', '.colDeleteAllowances', function() {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').find('.colAlowancesID').text()||0; // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteAllowanceLineModal').modal('toggle');
    });

    $(document).on('click', '.colDeleteDeductions', function() {
        event.stopPropagation();
        var listData = $(this).closest('tr').find('.colDeductionsID').text();
        var targetID = $(event.target).closest('tr').find('.colDeleteDeductions').text()||0; // table row ID
        var listData = $(this).closest('tr').find('.colDeductionsID').text();
        let deductionType = $(this).closest('tr').find('.colDeductionsType').text()||'';
        let deductionName = $(this).closest('tr').find('.colDeductionsNames').text()||'';
        let deductionDisplayName = $(this).closest('tr').find('.colDeductionsDisplayName').text()||'';
        let deductionAmount = $(this).closest('tr').find('.colDeductionsAmount').text()||'0.00';
        let deductionAccount = $(this).closest('tr').find('.colDeductionsAccounts').text()||'';
        let deductionAccountID = $(this).closest('tr').find('.colDeductionsAccountsID').text()||'';
        let deductionexemptPAYG = $(this).closest('tr').find('.colDeductionsPAYG').text()||'false';
        let deductionexemptSupernation = $(this).closest('tr').find('.colDeductionsSuperannuation').text()||'false';
        let deductionexemptActivityStatement = $(this).closest('tr').find('.colDeductionsReportableasW1').text()||'false';
        
    
        $('#selectDeleteLineID').val(listData);     
        $('#selectAccountid').val(deductionAccountID);
        $('#selectAccountname').val(deductionAccount);  
        $('#selectdeductionAmount').val(deductionAmount);
        $('#selectideductionName').val(deductionName);
        $('#selectdisplayName').val(deductionDisplayName);
        $('#deleteDeductionLineModal').modal('toggle');
    });

    $(document).ready(function() {
      $('#edtAllowanceType').editableSelect();
      $('#edtAllowanceType').editableSelect('add','Car');
      $('#edtAllowanceType').editableSelect('add','JobKeeper');
      $('#edtAllowanceType').editableSelect('add','Laundry');
      $('#edtAllowanceType').editableSelect('add','Meals');
      $('#edtAllowanceType').editableSelect('add','Qualifications');
      $('#edtAllowanceType').editableSelect('add','Tasks');
      $('#edtAllowanceType').editableSelect('add','Tools');
      $('#edtAllowanceType').editableSelect('add','Transport');
      $('#edtAllowanceType').editableSelect('add','Travel');
      $('#edtAllowanceType').editableSelect('add','Other');

      $('#employegroup').editableSelect('add','None');
      $('#employegroup').editableSelect('add','Region');
      $('#timesheetcat').editableSelect('add','None');
      $('#timesheetcat').editableSelect('add','Region');

      $('#payperiod').editableSelect('add','Weekly');
      $('#payperiod').editableSelect('add','Fortnightly');
      $('#payperiod').editableSelect('add','Twice Monthly');
      $('#payperiod').editableSelect('add','Four Weekly');
      $('#payperiod').editableSelect('add','Monthly');
      $('#payperiod').editableSelect('add','Quarterly');

      $('#edtRateType').editableSelect('add',"Fixed Amount");
      $('#edtRateType').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateType').editableSelect('add',"Rate Per unit");

      $('#edtRateTypeOvertime').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeOvertime').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeOvertime').editableSelect('add',"Rate Per unit");

      $('#edtRateTypeTermnination').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeTermnination').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeTermnination').editableSelect('add',"Rate Per unit");
      
      $('#edtRateTypeLumpSumE').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeLumpSumE').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeLumpSumE').editableSelect('add',"Rate Per unit");


      $('#edtRateTypeBonusesCommissions').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeBonusesCommissions').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeBonusesCommissions').editableSelect('add',"Rate Per unit");

      $('#edtRateTypeLumpSumW').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeLumpSumW').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeLumpSumW').editableSelect('add',"Rate Per unit");

      $('#edtRateTypeDirectorsFees').editableSelect('add',"Fixed Amount");
      $('#edtRateTypeDirectorsFees').editableSelect('add',"Multiple of employee's ordinary earnings rate");
      $('#edtRateTypeDirectorsFees').editableSelect('add',"Rate Per unit");

      $('#edtTypeOfUnits').editableSelect('add','Hours');
      $('#edtTypeOfUnits').editableSelect('add','Days');
      $('#edtTypeOfUnits').editableSelect('add','Weeks');
      $('#edtTypeOfUnits').editableSelect('add','Monthly');

      $('#edtUnpaidTypeOfUnits').editableSelect('add','Hours');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Days');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Weeks');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Monthly');

      $('#edtExpenseAccountAllowance').editableSelect();

      $('#editbankaccount').editableSelect();
      $('#editpaygbankaccount').editableSelect();
      $('#edtReimbursementAccount').editableSelect();
      $('#editwagesexpbankaccount').editableSelect();
      $('#editwagespaybankaccount').editableSelect();
      $('#editsuperliabbankaccount').editableSelect();
      $('#editsuperexpbankaccount').editableSelect();

      $('#edtExpenseAccountDirectorsFees').editableSelect();
      $('#edtExpenseAccountTermnination').editableSelect();
      $('#edtExpenseAccount').editableSelect();
      $('#edtExpenseAccountOvertime').editableSelect();
      $('#edtExpenseAccountLumpSumE').editableSelect();
      $('#edtExpenseAccountBonusesCommissions').editableSelect();
      $('#edtExpenseAccountLumpSumW').editableSelect();

      $('#edtDeductionAccount').editableSelect();

    });

    $('#editbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('BANK');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('BANK');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
     $('#editpaygbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editpaygbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('LTLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editpaygbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('LTLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtReimbursementAccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtReimbursementAccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('LTLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtReimbursementAccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('LTLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });


     $('#editwagesexpbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editwagesexpbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editwagesexpbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#editwagespaybankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editwagespaybankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('AP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editwagespaybankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('AP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
     $('#editsuperliabbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editsuperliabbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('OCLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editsuperliabbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('OCLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#editsuperexpbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editsuperexpbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editsuperexpbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#edtExpenseAccountAllowance').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('edtExpenseAccountAllowance');
        $('#accountListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('EXP');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(accountDataName.replace(/\s/g, '') != ''){
           getVS1Data('TAccountVS1').then(function (dataObject) {
               if (dataObject.length == 0) {
                 accountService.getOneAccountByName(accountDataName).then(function (data) {
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   if (accountTypeList) {
                       for (var h = 0; h < accountTypeList.length; h++) {

                           if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                               fullAccountTypeName = accountTypeList[h].description || '';

                           }
                       }

                   }

                    var accountid = data.taccountvs1[0].fields.ID || '';
                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                   var cardcvc = data.taccountvs1[0].fields.CVC || '';
                   var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                    if ((accounttype === "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }else if ((accounttype === "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                    } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }

                    $('#edtAccountID').val(accountid);
                    $('#sltAccountType').val(accounttype);
                    $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                    $('#edtAccountName').val(accountname);
                    $('#edtAccountNo').val(accountno);
                    $('#sltTaxCode').val(taxcode);
                    $('#txaAccountDescription').val(accountdesc);
                    $('#edtBankAccountName').val(bankaccountname);
                    $('#edtBSB').val(bankbsb);
                    $('#edtBankAccountNo').val(bankacountno);
                    $('#swiftCode').val(swiftCode);
                    $('#routingNo').val(routingNo);
                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                    $('#edtCardNumber').val(cardnumber);
                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                    $('#edtCvc').val(cardcvc);

                    if(showTrans == 'true'){
                        $('.showOnTransactions').prop('checked', true);
                    }else{
                      $('.showOnTransactions').prop('checked', false);
                    }

                    setTimeout(function () {
                        $('#addNewAccount').modal('show');
                    }, 500);

                 }).catch(function (err) {
                     $('.fullScreenSpin').css('display','none');
                 });
               } else {
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.taccountvs1;
                     var added=false;
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   for (let a = 0; a < data.taccountvs1.length; a++) {

                     if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                       added = true;
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }



                var accountid = data.taccountvs1[a].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                var accountname = data.taccountvs1[a].fields.AccountName || '';
                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[a].fields.Description || '';
                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                var routingNo = data.taccountvs1[a].BankCode || '';

                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

                     }
                   }
                   if(!added) {
                     accountService.getOneAccountByName(accountDataName).then(function (data) {
                       let lineItems = [];
                       let lineItemObj = {};
                       let fullAccountTypeName = '';
                       let accBalance = '';
                       $('#add-account-title').text('Edit Account Details');
                       $('#edtAccountName').attr('readonly', true);
                       $('#sltAccountType').attr('readonly', true);
                       $('#sltAccountType').attr('disabled', 'disabled');
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                       var cardcvc = data.taccountvs1[0].fields.CVC || '';
                       var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                     }).catch(function (err) {
                         $('.fullScreenSpin').css('display','none');
                     });
                   }

               }
           }).catch(function (err) {
             accountService.getOneAccountByName(accountDataName).then(function (data) {
               let lineItems = [];
               let lineItemObj = {};
               let fullAccountTypeName = '';
               let accBalance = '';
               $('#add-account-title').text('Edit Account Details');
               $('#edtAccountName').attr('readonly', true);
               $('#sltAccountType').attr('readonly', true);
               $('#sltAccountType').attr('disabled', 'disabled');
               if (accountTypeList) {
                   for (var h = 0; h < accountTypeList.length; h++) {

                       if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                           fullAccountTypeName = accountTypeList[h].description || '';

                       }
                   }

               }

                var accountid = data.taccountvs1[0].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                var accountname = data.taccountvs1[0].fields.AccountName || '';
                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[0].fields.Description || '';
                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[0].fields.CVC || '';
               var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

             }).catch(function (err) {
                 $('.fullScreenSpin').css('display','none');
             });

           });
           $('#addAccountModal').modal('toggle');
         }else{
           $('#selectLineID').val('edtExpenseAccountAllowance');
           $('#accountListModal').modal();
           setTimeout(function () {
             $('#tblAccount_filter .form-control-sm').focus();
             $('#tblAccount_filter .form-control-sm').val('EXP');
             $('#tblAccount_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblAccount_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


     });

    $('#edtExpenseAccountDirectorsFees').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
           $('#selectLineID').val('edtExpenseAccountDirectorsFees');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountDirectorsFees');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
    $('#edtExpenseAccountTermnination').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
           $('#selectLineID').val('edtExpenseAccountTermnination');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountTermnination');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountOvertime').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountOvertime');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountOvertime');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountLumpSumE').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountLumpSumE');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountLumpSumE');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountBonusesCommissions').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountBonusesCommissions');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountBonusesCommissions');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountLumpSumW').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountLumpSumW');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountLumpSumW');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });


    $('#edtDeductionAccount').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('edtDeductionAccount');
        $('#accountListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(accountDataName.replace(/\s/g, '') != ''){
           getVS1Data('TAccountVS1').then(function (dataObject) {
               if (dataObject.length == 0) {
                 accountService.getOneAccountByName(accountDataName).then(function (data) {
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   if (accountTypeList) {
                       for (var h = 0; h < accountTypeList.length; h++) {

                           if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                               fullAccountTypeName = accountTypeList[h].description || '';

                           }
                       }

                   }

                    var accountid = data.taccountvs1[0].fields.ID || '';
                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                    var cardcvc = data.taccountvs1[0].fields.CVC || '';
                    var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                    if ((accounttype === "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }else if ((accounttype === "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                    } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }

                    $('#edtAccountID').val(accountid);
                    $('#sltAccountType').val(accounttype);
                    $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                    $('#edtAccountName').val(accountname);
                    $('#edtAccountNo').val(accountno);
                    $('#sltTaxCode').val(taxcode);
                    $('#txaAccountDescription').val(accountdesc);
                    $('#edtBankAccountName').val(bankaccountname);
                    $('#edtBSB').val(bankbsb);
                    $('#edtBankAccountNo').val(bankacountno);
                    $('#swiftCode').val(swiftCode);
                    $('#routingNo').val(routingNo);
                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                    $('#edtCardNumber').val(cardnumber);
                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                    $('#edtCvc').val(cardcvc);

                    if(showTrans == 'true'){
                        $('.showOnTransactions').prop('checked', true);
                    }else{
                      $('.showOnTransactions').prop('checked', false);
                    }

                    setTimeout(function () {
                        $('#addNewAccount').modal('show');
                    }, 500);

                 }).catch(function (err) {
                     $('.fullScreenSpin').css('display','none');
                 });
               } else {
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.taccountvs1;
                     var added=false;
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   for (let a = 0; a < data.taccountvs1.length; a++) {

                     if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                       added = true;
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }



                var accountid = data.taccountvs1[a].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                var accountname = data.taccountvs1[a].fields.AccountName || '';
                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[a].fields.Description || '';
                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                var routingNo = data.taccountvs1[a].BankCode || '';

                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

                     }
                   }
                   if(!added) {
                     accountService.getOneAccountByName(accountDataName).then(function (data) {
                       let lineItems = [];
                       let lineItemObj = {};
                       let fullAccountTypeName = '';
                       let accBalance = '';
                       $('#add-account-title').text('Edit Account Details');
                       $('#edtAccountName').attr('readonly', true);
                       $('#sltAccountType').attr('readonly', true);
                       $('#sltAccountType').attr('disabled', 'disabled');
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                       var cardcvc = data.taccountvs1[0].fields.CVC || '';
                       var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                     }).catch(function (err) {
                         $('.fullScreenSpin').css('display','none');
                     });
                   }

               }
           }).catch(function (err) {
             accountService.getOneAccountByName(accountDataName).then(function (data) {
               let lineItems = [];
               let lineItemObj = {};
               let fullAccountTypeName = '';
               let accBalance = '';
               $('#add-account-title').text('Edit Account Details');
               $('#edtAccountName').attr('readonly', true);
               $('#sltAccountType').attr('readonly', true);
               $('#sltAccountType').attr('disabled', 'disabled');
               if (accountTypeList) {
                   for (var h = 0; h < accountTypeList.length; h++) {

                       if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                           fullAccountTypeName = accountTypeList[h].description || '';

                       }
                   }

               }

                var accountid = data.taccountvs1[0].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                var accountname = data.taccountvs1[0].fields.AccountName || '';
                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[0].fields.Description || '';
                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[0].fields.CVC || '';
               var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

             }).catch(function (err) {
                 $('.fullScreenSpin').css('display','none');
             });

           });
           $('#addAccountModal').modal('toggle');
         }else{
            $('#selectLineID').val('edtDeductionAccount');
           $('#accountListModal').modal();
           setTimeout(function () {
             $('#tblAccount_filter .form-control-sm').focus();
             $('#tblAccount_filter .form-control-sm').val('');
             $('#tblAccount_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblAccount_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountAllowance';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountAllowance'){
          $('#edtExpenseAccountAllowance').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountDirectorsFees';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountDirectorsFees'){
          $('#edtExpenseAccountDirectorsFees').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountTermnination';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountTermnination'){
          $('#edtExpenseAccountTermnination').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccount'){
          $('#edtExpenseAccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountOvertime';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountOvertime'){
          $('#edtExpenseAccountOvertime').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountLumpSumE';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountLumpSumE'){
          $('#edtExpenseAccountLumpSumE').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountBonusesCommissions';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountBonusesCommissions'){
          $('#edtExpenseAccountBonusesCommissions').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountLumpSumW';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountLumpSumW'){
          $('#edtExpenseAccountLumpSumW').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editbankaccount'){
          $('#editbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editpaygbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editpaygbankaccount'){
          $('#editpaygbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtReimbursementAccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtReimbursementAccount'){
          $('#edtReimbursementAccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editwagesexpbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editwagesexpbankaccount'){
          $('#editwagesexpbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editwagespaybankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editwagespaybankaccount'){
          $('#editwagespaybankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editsuperliabbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editsuperliabbankaccount'){
          $('#editsuperliabbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editsuperexpbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editsuperexpbankaccount'){
          $('#editsuperexpbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

  
});

Template.payrollrules.events({
    'click #btnEarnings': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "block";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnAllowances': function() {
        document.getElementById("allowances").style.display = "block";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnDeductions': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "block";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnReiumbursement': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "block";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnLeave': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "block";
    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    },
    'change #ruleModifierInitial': function(event) {
        var optionSelected = $(event.target).val();

        if (optionSelected == "greaterthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "lessthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "dayoftheweek") {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "inline-flex";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").removeClass("noradiusright");

        }


    },
    'click #ruleLessThan': function() {
        document.getElementById("ruleConstructOne").value = "Less Than";
        document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
        document.getElementById("ruleModifierDay").style.display = "none";
    },
    'click #ruleSpecificDay': function() {
        document.getElementById("ruleConstructOne").value = "Specific Day";
        document.getElementById("ruleModifierTime").style.display = "none";
        document.getElementById("ruleModifierDay").style.display = "inline-flex";
    },

    'click .btnSaveAllowance': function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let earningName = $('#edtEarningsNameAllowance').val()||'';
        let taxRateService = new TaxRateService();

        let allowanceID = $('#edtAllowanceID').val()||'';
        let allowanceType = $('#edtAllowanceType').val()||'';
        let displayName = $('#edtDisplayNameAllowance').val();
        let expensesAccount = $('#edtExpenseAccountAllowance').val();
        let diexpensesAccount = $('#edtExpenseAccountDirectorsFees').val();
        let termexpensesAccount = $('#edtExpenseAccountTermnination').val();
        let epexpensesAccount = $('#edtExpenseAccount').val();
        let overexpensesAccount = $('#edtExpenseAccountOvertime').val();
        let lumpexpensesAccount = $('#edtExpenseAccountLumpSumE').val();
        let bonusesexpensesAccount = $('#edtExpenseAccountBonusesCommissions').val();
        let lumpshumwexpensesAccount = $('#edtExpenseAccountLumpSumW').val();

        let lumpeditbankaccount = $('#editbankaccount').val();
        let lumpeditpaygbankaccount = $('#editpaygbankaccount').val();
        let lumpeditedtReimbursementAccount = $('#edtReimbursementAccount').val();
        let lumpeditwagesexpbankaccount = $('#editwagesexpbankaccount').val();
        let lumpeditwagespaybankaccount = $('#editwagespaybankaccount').val();
        let lumpeditsuperliabbankaccount = $('#editsuperliabbankaccount').val();
        let lumpeditsuperexpbankaccount = $('#editsuperexpbankaccount').val();

        let expensesAccountID = $('#edtExpenseAccountID').val()||0;

        let allowanceAmount = $('#edtAllowanceAmount').val()||0;

        let exemptFromPAYG = false;
        let exemptFromSupernation = false;
        let reportableW1ActivityStatement = false;

        if($('#formCheck-ExemptPAYGAllowance').is(':checked')){
          exemptFromPAYG = true;
        }else{
          exemptFromPAYG = false;
        }

        if($('#formCheck-ExemptSuperannuationAllowance').is(':checked')){
          exemptFromSupernation = true;
        }else{
          exemptFromSupernation = false;
        }

        if($('#formCheck-ExemptReportableAllowance').is(':checked')){
          reportableW1ActivityStatement = true;
        }else{
          reportableW1ActivityStatement = false;
        }


        if (earningName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earning has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');

          if(allowanceID == ""){
            taxRateService.checkAllowanceByName(earningName).then(function (data) {
              allowanceID = data.tallowance[0].Id;
              objDetails = {
                 type: "TAllowance",
                 fields: {
                     ID: parseInt(allowanceID),
                     Active: true,
                     Accountid: expensesAccountID,
                     Accountname: expensesAccount,
                     Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     AllowanceType: allowanceType,
                     Description: earningName,
                     DisplayIn: displayName,
                     Superinc: exemptFromSupernation,
                     Workcoverexempt: reportableW1ActivityStatement,
                     Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveAllowance(objDetails).then(function (objDetails) {
               sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
              objDetails = {
                 type: "TAllowance",
                 fields: {
                     Active: true,
                     Accountid: expensesAccountID,
                     Accountname: expensesAccount,
                     Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     AllowanceType: allowanceType,
                     Description: earningName,
                     DisplayIn: displayName,
                     Superinc: exemptFromSupernation,
                     Workcoverexempt: reportableW1ActivityStatement,
                     Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveAllowance(objDetails).then(function (objDetails) {
               sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
           objDetails = {
              type: "TAllowance",
              fields: {
                  ID: parseInt(allowanceID),
                  Accountid: expensesAccountID,
                  Accountname: expensesAccount,
                  Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                  Basedonid:1,
                  AllowanceType: allowanceType,
                  Description: earningName,
                  DisplayIn: displayName,
                  Superinc: exemptFromSupernation,
                  Workcoverexempt: reportableW1ActivityStatement,
                  Payrolltaxexempt: exemptFromPAYG
              }
          };

          taxRateService.saveAllowance(objDetails).then(function (objDetails) {
            sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }
    },

    'click .btnSaveDeduction': function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let deductionName = $('#edtDeductionName').val()||'';
        let taxRateService = new TaxRateService();

        let deductionID = $('#edtDeductionID').val()||'';

        let deductionType = $('#edtDeductionTitle').val()||'None';
        let isTaxexempt = false;
        let isIsWorkPlacegiving = false;
        let isUnionfees = false;
        if(deductionType == 'None'){
          isTaxexempt = true;
        }else if(deductionType == 'WorkplaceGiving'){
          isIsWorkPlacegiving = true;
        }else if(deductionType == 'UnionAssociationFees'){
          isUnionfees = true;
        }
        let displayName = 'Deductions';
        let deductionAccount = $('#edtDeductionAccount').val();
        let deductionAccountID = $('#edtDeductionAccountID').val()||0;

        let deductionAmount = $('#edtDeductionAmount').val()||0;

        let exemptFromPAYG = false;
        let exemptFromSupernation = false;
        let reportableW1ActivityStatement = false;

        if($('#formCheck-ReducesPAYGDeduction').is(':checked')){
          exemptFromPAYG = true;
        }else{
          exemptFromPAYG = false;
        }

        if($('#formCheck-ReducesSuperannuationDeduction').is(':checked')){
          exemptFromSupernation = true;
        }else{
          exemptFromSupernation = false;
        }

        if($('#formCheck-ExcludedDeduction').is(':checked')){
          reportableW1ActivityStatement = true;
        }else{
          reportableW1ActivityStatement = false;
        }


        if (deductionName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Deduction has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');

          if(deductionID == ""){
            taxRateService.checkDeductionByName(deductionName).then(function (data) {
              deductionID = data.tdeduction[0].Id;
              objDetails = {
                 type: "TDeduction",
                 fields: {
                     ID: parseInt(deductionID),
                     Active: true,
                     Accountid: deductionAccountID,
                     Accountname: deductionAccount,
                     IsWorkPlacegiving:isIsWorkPlacegiving,
                     Taxexempt:isTaxexempt,
                     Unionfees:isUnionfees,
                     Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     //AllowanceType: allowanceType,
                     Description: deductionName,
                     DisplayIn: displayName,
                     // Superinc: exemptFromSupernation,
                     // Workcoverexempt: reportableW1ActivityStatement,
                     // Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveDeduction(objDetails).then(function (objDetails) {
               sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
              objDetails = {
                 type: "TDeduction",
                 fields: {
                     Active: true,
                     Active: true,
                     Accountid: deductionAccountID,
                     Accountname: deductionAccount,
                     IsWorkPlacegiving:isIsWorkPlacegiving,
                     Taxexempt:isTaxexempt,
                     Unionfees:isUnionfees,
                     Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     //AllowanceType: allowanceType,
                     Description: deductionName,
                     DisplayIn: displayName,
                 }
             };

             taxRateService.saveDeduction(objDetails).then(function (objDetails) {
               sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
           objDetails = {
              type: "TDeduction",
              fields: {
                  ID: parseInt(deductionID),
                  Active: true,
                  Accountid: deductionAccountID,
                  Accountname: deductionAccount,
                  IsWorkPlacegiving:isIsWorkPlacegiving,
                  Taxexempt:isTaxexempt,
                  Unionfees:isUnionfees,
                  Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                  Basedonid:1,
                  //AllowanceType: allowanceType,
                  Description: deductionName,
                  DisplayIn: displayName,
              }
          };

          taxRateService.saveDeduction(objDetails).then(function (objDetails) {
            sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }
    },
    

   'click .savenewcalender': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let payperiod = $('#payperiod').val() || '';
        let calender_name = $('#calender_name').val() || '';
        let startdate = $('#edtStartDate').val() || '';
        let FirstPaymentDate = $('#edtFirstPaymentDate').val() || '';
      
        if (payperiod === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Pay period has not been selected!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkCalenderName(calender_name).then(function (data) {
                calenderID = data.tpayrollcalendars[0].Id;
                objDetails = {
                   type: "TPayrollCalendars",
                   fields: {
                       ID: parseInt(calenderID),
                       PayrollCalendarPayPeriod:payperiod,
                       PayrollCalendarName:calender_name,
                       PayrollCalendarStartDate:startdate,
                       PayrollCalendarFirstPaymentDate:FirstPaymentDate,
                       PayrollCalendarActive :true,              
                   }
               };
  
              taxRateService.saveCalender(objDetails).then(function (objDetails) {
                 sideBarService.getCalender().then(function(dataReload) {
                    addVS1Data('TPayrollCalendars',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TPayrollCalendars",
                    fields: {
                        PayrollCalendarPayPeriod:payperiod,
                        PayrollCalendarName:calender_name,
                        PayrollCalendarStartDate:startdate,
                        PayrollCalendarFirstPaymentDate:FirstPaymentDate,
                        PayrollCalendarActive :true, 
                   }
                };
  
                taxRateService.saveCalender(objDetails).then(function (objDetails) {
                 sideBarService.getCalender().then(function(dataReload) {
                    addVS1Data('TPayrollCalendars',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




    },

   'click .saveSuperannuation': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let fundType = $('#edtFundType').val() || '';
        let fundName = $('#edtFundName').val() || '';
        let employeNumber = $('#edtEmployerNumber').val() || '';
         
        if (fundName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Fund Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkSuperannuationName(fundName).then(function (data) {
                supperannuationId = data.tsuperannuation[0].Id;
                objDetails = {
                   type: "TSuperannuation",
                   fields: {
                       ID: parseInt(supperannuationId),
                       SuperannuationType:fundType,
                       SuperannuationName:fundName,
                       SuperannuationEmployerNumber:employeNumber,
                       SuperannuationSpin:'',
                       SuperannuationsUsi :'',     
                       SuperannuationsAutoMigratedFund:true,
                       SuperannuationActive:true,         
                   }
               };
  
              taxRateService.saveSuperannuation(objDetails).then(function (objDetails) {
                 sideBarService.getSuperannuation().then(function(dataReload) {
                    addVS1Data('TSuperannuation',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TSuperannuation",
                    fields: {
                        SuperannuationType:fundType,
                        SuperannuationName:fundName,
                        SuperannuationEmployerNumber:employeNumber,
                        SuperannuationSpin:'',
                        SuperannuationsUsi :'',     
                        SuperannuationsAutoMigratedFund:true,
                        SuperannuationActive:true,   
                   }
                };
  
                taxRateService.saveSuperannuation(objDetails).then(function (objDetails) {
                 sideBarService.getSuperannuation().then(function(dataReload) {
                    addVS1Data('TSuperannuation',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




    },

   'click .newreiumbursement': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let reimbursementname = $('#edtReimbursementName').val() || '';
        let account = $('#edtReimbursementAccount').val() || '';     
        
        if (reimbursementname === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Reimbursement name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkReimbursementByName(reimbursementname).then(function (data) {
                TReimbursementid = data.treimbursement[0].Id;
                objDetails = {
                   type: "TReimbursement",
                   fields: {
                       ID: parseInt(TReimbursementid),
                       PayItemsReiumbursementName:reimbursementname,
                       PayItemsReiumbursementAccount:account,
                       PayItemsReiumbursementActive:true,         
                   }
               };
  
              taxRateService.saveReimbursement(objDetails).then(function (objDetails) {
                 sideBarService.getReimbursement().then(function(dataReload) {
                    addVS1Data('TReimbursement',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TReimbursement",
                    fields: {
                        PayItemsReiumbursementName:reimbursementname,
                        PayItemsReiumbursementAccount:account,
                        PayItemsReiumbursementActive:true,     
                   }
                };
  
                taxRateService.saveReimbursement(objDetails).then(function (objDetails) {
                sideBarService.getSupgetReimbursementerannuation().then(function(dataReload) {
                    addVS1Data('TReimbursement',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




     },

   'click .savePaidLeave':function(){
     
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let Leavename = $('#edtLeaveName').val() || '';
        let Typeofunit = $('#edtTypeOfUnits').val() || '';     
        let edtLeaveLoadingRate = $('#edtLeaveLoadingRate').val() || '';
        let edtNormalEntitlement = $('#edtNormalEntitlement').val() || '';
        let payonslip = false;

        if($('#formCheck-ShowBalance').is(':checked')){
            payonslip = true;
        }else{
            payonslip = false;
        }



        if (Leavename === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Leave name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkPaidLeaveByName(Leavename).then(function (data) {
                paidleaveid = data.tpaidleave[0].Id;
                objDetails = {
                   type: "TPaidLeave",
                   fields: {
                       ID: parseInt(paidleaveid),
                       PayItemsLeavePaidName:Leavename,
                       PayItemsLeavePaidUnits:Typeofunit,
                       PayItemsLeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
                       PayItemsLeavePaidNormalEntitlement:edtNormalEntitlement,
                       PayItemsLeavePaidShowBalanceOnPayslip:payonslip,
                       PayItemsLeavePaidActive:true,        
                   }
               };
  
              taxRateService.savePaidLeave(objDetails).then(function (objDetails) {
                 sideBarService.getPaidLeave().then(function(dataReload) {
                    addVS1Data('TPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TPaidLeave",
                    fields: {
                        PayItemsLeavePaidName:Leavename,
                        PayItemsLeavePaidUnits:Typeofunit,
                        PayItemsLeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
                        PayItemsLeavePaidNormalEntitlement:edtNormalEntitlement,
                        PayItemsLeavePaidShowBalanceOnPayslip:payonslip,
                        PayItemsLeavePaidActive:true,    
                   }
                };
  
                taxRateService.savePaidLeave(objDetails).then(function (objDetails) {
                sideBarService.getPaidLeave().then(function(dataReload) {
                    addVS1Data('TPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




     },

   'click .saveUnpaidLeave':function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let Leavename = $('#edtUnpaidLeaveName').val() || '';
        let Typeofunit = $('#edtUnpaidTypeOfUnits').val() || '';     
        let edtLeaveLoadingRate = $('#edtUnpaidLeaveLoadingRate').val() || '';
        let edtNormalEntitlement = $('#edtUnpaidNormalEntitlement').val() || '';
        let payonslip = false;

        if($('#formCheck-UnpaidShowBalance').is(':checked')){
            payonslip = true;
        }else{
            payonslip = false;
        }



        if (Leavename === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Leave name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkunPaidLeaveByName(Leavename).then(function (data) {
                paidleaveid = data.tunpaidleave[0].Id;
                objDetails = {
                   type: "TUnpaidLeave",
                   fields: {
                       ID: parseInt(paidleaveid),
                       PayItemsLeaveUnpaidName:Leavename,
                       PayItemsLeaveUnpaidUnits:Typeofunit,
                       PayItemsLeaveUnpaidLeaveLoadingRate:edtLeaveLoadingRate,
                       PayItemsLeaveUnpaidNormalEntitlement:edtNormalEntitlement,
                       PayItemsLeaveUnpaidShowBalanceOnPayslip:payonslip,
                       PayItemsLeaveUnpaidActive:true,        
                   }
               };
  
              taxRateService.saveUnPaidLeave(objDetails).then(function (objDetails) {
                 sideBarService.getUnPaidLeave().then(function(dataReload) {
                    addVS1Data('TUnpaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TUnpaidLeave",
                    fields: {
                        PayItemsLeaveUnpaidName:Leavename,
                        PayItemsLeaveUnpaidUnits:Typeofunit,
                        PayItemsLeaveUnpaidLeaveLoadingRate:edtLeaveLoadingRate,
                        PayItemsLeaveUnpaidNormalEntitlement:edtNormalEntitlement,
                        PayItemsLeaveUnpaidShowBalanceOnPayslip:payonslip,
                        PayItemsLeaveUnpaidActive:true,        
                   }
                };
  
                taxRateService.saveUnPaidLeave(objDetails).then(function (objDetails) {
                sideBarService.getUnPaidLeave().then(function(dataReload) {
                    addVS1Data('TUnpaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }





     },
   
   'click .saveExemptReportable':function(){
      
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsName').val() || '';
    let edtDisplayName = $('#edtDisplayName').val() || '';     
    let edtRateType = $('#edtRateType').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccount').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#formCheck-ExemptPAYG').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuation').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportable').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {
       
        $('.fullScreenSpin').css('display','inline-block');
        taxRateService.checkordinaryEarningByName(edtEarningsName).then(function (data) {
            earningid = data.tordinarytimeearnings[0].Id;
            objDetails = {
               type: "TOrdinaryTimeEarnings",
               fields: {
                   ID: parseInt(earningid),
                   PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
                   PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
                   PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
                   PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                   PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                   PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                   PayItemsEarningsOrdinaryTimeEarningsActive:true     
               }
           };

          taxRateService.saveordinaryEarningByName(objDetails).then(function (objDetails) {
             sideBarService.getordinaryEarningByName().then(function(dataReload) {
                addVS1Data('TOrdinaryTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "TOrdinaryTimeEarnings",
                fields: {
                    PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
                    PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
                    PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
                    PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                    PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                    PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                    PayItemsEarningsOrdinaryTimeEarningsActive:true         
               }
            };

            taxRateService.saveordinaryEarningByName(objDetails).then(function (objDetails) {
            sideBarService.getordinaryEarningByName().then(function(dataReload) {
                addVS1Data('TOrdinaryTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
         


     }




    },

   'click .saveExemptReportableOvertime':function(){
       
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsNameOvertime').val() || '';
    let edtDisplayName = $('#edtDisplayNameOvertime').val() || '';     
    let edtRateType = $('#edtRateTypeOvertime').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccountOvertime').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#formCheck-ExemptPAYGOvertime').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuationOvertime').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportableOvertime').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {
       
        $('.fullScreenSpin').css('display','inline-block');
        taxRateService.checkExemptReportableOvertime(edtEarningsName).then(function (data) {
            earningid = data.tovertimeEarnigns[0].Id;
            objDetails = {
               type: "TOvertimeEarnigns",
               fields: {
                   ID: parseInt(earningid),
                   PayItemsEarningsOvertimeEarningsName:edtEarningsName,
                   PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
                   PayItemsEarningsOvertimeEarningsRateType:edtRateType,
                   PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
                   PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
                   PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
                   PayItemsEarningsOvertimeEarningsActive:true     
               }
           };

          taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
             sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                addVS1Data('TOvertimeEarnigns',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "TOvertimeEarnigns",
                fields: {
                    PayItemsEarningsOvertimeEarningsName:edtEarningsName,
                    PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
                    PayItemsEarningsOvertimeEarningsRateType:edtRateType,
                    PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
                    PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
                    PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
                    PayItemsEarningsOvertimeEarningsActive:true           
               }
            };

            taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
            sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                addVS1Data('TOvertimeEarnigns',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
         


     }

    },

   'click .saveSuperannuationBonusesCommissions':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsNameBonusesCommissions').val() || '';
    let edtDisplayName = $('#edtDisplayNameBonusesCommissions').val() || '';     
    let edtRateType = $('#edtRateTypeBonusesCommissions').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccountBonusesCommissions').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#ormCheck-ExemptPAYGBonusesCommissions').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuationBonusesCommissions').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportableBonusesCommissions').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {
       
        $('.fullScreenSpin').css('display','inline-block');
        taxRateService.checkSuperannuationBonusesCommissions(edtEarningsName).then(function (data) {
            earningid = data.tearningsbonusescommissions[0].Id;
            objDetails = {
               type: "TEarningsBonusesCommissions",
               fields: {
                   ID: parseInt(earningid),
                   EarningsBonusesCommissionsName:edtEarningsName,
                   EarningsBonusesCommissionsDisplayName:edtDisplayName,
                   EarningsBonusesCommissionsRateType:edtRateType,
                   EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
                   EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
                   EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
                   EarningsBonusesCommissionsActive:true     
               }
           };

          taxRateService.saveSuperannuationBonusesCommissions(objDetails).then(function (objDetails) {
             sideBarService.getsuperannuationBonusesCommissions().then(function(dataReload) {
                addVS1Data('TEarningsBonusesCommissions',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "TEarningsBonusesCommissions",
                fields: {
                    EarningsBonusesCommissionsName:edtEarningsName,
                    EarningsBonusesCommissionsDisplayName:edtDisplayName,
                    EarningsBonusesCommissionsRateType:edtRateType,
                    EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
                    EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
                    EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
                    EarningsBonusesCommissionsActive:true            
               }
            };

            taxRateService.saveSuperannuationBonusesCommissions(objDetails).then(function (objDetails) {
            sideBarService.getsuperannuationBonusesCommissions().then(function(dataReload) {
                addVS1Data('TEarningsBonusesCommissions',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
     }
    },

   'click .saveExemptReportableLumpSumE':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameLumpSumE').val() || '';
        let edtDisplayName = $('#edtDisplayNameLumpSumE').val() || '';     
        let edtRateType = $('#edtRateTypeLumpSumE').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountLumpSumE').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGLumpSumE').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationLumpSumE').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#ormCheck-ExemptReportableLumpSumE').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableLumpSumE(edtEarningsName).then(function (data) {
                earningid = data.tlumpsume[0].Id;
                objDetails = {
                   type: "TLumpSumE",
                   fields: {
                       ID: parseInt(earningid),
                        LumpSumEName:edtEarningsName,
                        LumpSumEDisplayName:edtDisplayName,
                        LumpSumERateType:edtRateType,
                        LumpSumEExpenseAccount:edtExpenseAccount,
                        LumpSumEExemptPaygWithholding:ExemptPAYGp,
                        LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumEReportableW1onActivityStatement:ExemptReportable,
                        LumpSumEActive:true        
                   }
               };
    
              taxRateService.saveExemptReportableLumpSumE(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableLumpSumE().then(function(dataReload) {
                    addVS1Data('TLumpSumE',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TLumpSumE",
                    fields: {
                        LumpSumEName:edtEarningsName,
                        LumpSumEDisplayName:edtDisplayName,
                        LumpSumERateType:edtRateType,
                        LumpSumEExpenseAccount:edtExpenseAccount,
                        LumpSumEExemptPaygWithholding:ExemptPAYGp,
                        LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumEReportableW1onActivityStatement:ExemptReportable,
                        LumpSumEActive:true         
                   }
                };
    
                taxRateService.saveExemptReportableLumpSumE(objDetails).then(function (objDetails) {
                sideBarService.getExemptReportableLumpSumE().then(function(dataReload) {
                    addVS1Data('TLumpSumE',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

   'click .saveExemptReportableTermnination':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameTermnination').val() || '';
        let edtDisplayName = $('#edtDisplayNameTermnination').val() || '';     
        let edtRateType = $('#edtRateTypeTermnination').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountTermnination').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGTermnination').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationTermnination').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableTermnination').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableTermnination(edtEarningsName).then(function (data) {
                earningid = data.temployeeterminations[0].Id;
                objDetails = {
                   type: "TEmployeeTerminations",
                   fields: {
                        ID: parseInt(earningid),
                        EmployeeTerminationPaymentsName:edtEarningsName,
                        EmployeeTerminationPaymentsDisplayName:edtDisplayName,
                        EmployeeTerminationPaymentsRateType:edtRateType,
                        EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
                        EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
                        EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
                        EmployeeTerminationPaymentsActive:true        
                   }
               };
    
              taxRateService.saveExemptReportableTermnination(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableTermnination().then(function(dataReload) {
                    addVS1Data('TEmployeeTerminations',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TEmployeeTerminations",
                    fields: {
                        EmployeeTerminationPaymentsName:edtEarningsName,
                        EmployeeTerminationPaymentsDisplayName:edtDisplayName,
                        EmployeeTerminationPaymentsRateType:edtRateType,
                        EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
                        EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
                        EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
                        EmployeeTerminationPaymentsActive:true         
                   }
                };
    
                taxRateService.saveExemptReportableTermnination(objDetails).then(function (objDetails) {
                sideBarService.getExemptReportableTermnination().then(function(dataReload) {
                    addVS1Data('TEmployeeTerminations',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    



    },

    'click .saveDirectorFee':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameDirectorsFees').val() || '';
        let edtDisplayName = $('#edtDisplayNameDirectorsFees').val() || '';     
        let edtRateType = $('#edtRateTypeDirectorsFees').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountDirectorsFees').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGDirectorsFees').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationDirectorsFees').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableDirectorsFees').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkDirectorFeesaveDirectorFee(edtEarningsName).then(function (data) {
                earningid = data.tdirectorsfees[0].Id;
                objDetails = {
                   type: "TDirectorsFees",
                   fields: {
                       ID: parseInt(earningid),
                       DirectorsFeesName:edtEarningsName,
                       DirectorsFeesDisplayName:edtDisplayName,
                       DirectorsFeesRateType:edtRateType,
                       DirectorsFeesExpenseAccount:edtExpenseAccount,
                       DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                       DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                       DirectorsFeesActive:true     
                   }
               };
    
              taxRateService.saveDirectorFee(objDetails).then(function (objDetails) {
                 sideBarService.getDirectorFee().then(function(dataReload) {
                    addVS1Data('TDirectorsFees',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TDirectorsFees",
                    fields: {
                        DirectorsFeesName:edtEarningsName,
                        DirectorsFeesDisplayName:edtDisplayName,
                        DirectorsFeesRateType:edtRateType,
                        DirectorsFeesExpenseAccount:edtExpenseAccount,
                        DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                        DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                        DirectorsFeesActive:true          
                   }
                };
    
                taxRateService.saveDirectorFee(objDetails).then(function (objDetails) {
                sideBarService.getDirectorFee().then(function(dataReload) {
                    addVS1Data('TDirectorsFees',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

    'click .saveLumpSumW':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameLumpSumW').val() || '';
        let edtDisplayName = $('#edtDisplayNameLumpSumW').val() || '';     
        let edtRateType = $('#edtRateTypeLumpSumW').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountLumpSumW').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGLumpSumW').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationLumpSumW').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableLumpSumW').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkLumpSumW(edtEarningsName).then(function (data) {
                earningid = data.tlumpsumw[0].Id;
                objDetails = {
                   type: "TLumpSumW",
                   fields: {
                       ID: parseInt(earningid),
                       LumpSumWName:edtEarningsName,
                       LumpSumWDisplayName:edtDisplayName,
                       LumpSumWRateType:edtRateType,
                       LumpSumWExpenseAccount:edtExpenseAccount,
                       LumpSumWExemptPaygWithholding:ExemptPAYGp,
                       LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       LumpSumWReportableW1onActivityStatement:ExemptReportable,
                       LumpSumWActive:true     
                   }
               };
    
              taxRateService.saveLumpSumW(objDetails).then(function (objDetails) {
                 sideBarService.getLumpSumW().then(function(dataReload) {
                    addVS1Data('TLumpSumW',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TLumpSumW",
                    fields: {
                        LumpSumWName:edtEarningsName,
                        LumpSumWDisplayName:edtDisplayName,
                        LumpSumWRateType:edtRateType,
                        LumpSumWExpenseAccount:edtExpenseAccount,
                        LumpSumWExemptPaygWithholding:ExemptPAYGp,
                        LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumWReportableW1onActivityStatement:ExemptReportable,
                        LumpSumWActive:true         
                   }
                };
    
                taxRateService.saveLumpSumW(objDetails).then(function (objDetails) {
                sideBarService.getLumpSumW().then(function(dataReload) {
                    addVS1Data('TLumpSumW',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

    'change #edtAllowanceAmount, change #edtDeductionAmount': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }

    },
    'keydown #edtAllowanceAmount, keydown #edtDeductionAmount': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

            (event.keyCode >= 35 && event.keyCode <= 40)) {

            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnDeleteAllowance': function () {
      let taxRateService = new TaxRateService();
      let allowanceId = $('#selectDeleteLineID').val()||0;
      $('.fullScreenSpin').css('display','inline-block');

      let objDetails = {
          type: "TAllowance",
          fields: {
              Id: parseInt(allowanceId),
              Active: false,
              DisplayIn: "Allowances",

          }
      };

      taxRateService.saveAllowance(objDetails).then(function (objDetails) {
        $('.fullScreenSpin').css('display','none');
        sideBarService.getAllowance().then(function(dataReload) {
           addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
             Meteor._reload.reload();
           }).catch(function (err) {
             Meteor._reload.reload();
           });
         }).catch(function(err) {
           Meteor._reload.reload();
         });
      }).catch(function (err) {
        swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
        }).then((result) => {
        if (result.value) {
         Meteor._reload.reload();
        } else if (result.dismiss === 'cancel') {

        }
        });
          $('.fullScreenSpin').css('display','none');
      });

    },

    'click .btnDeleteDeduction': function () {

        let taxRateService = new TaxRateService();
        let deductionID = $('#selectDeleteLineID').val()||0;
        let deductionAccountID = $('#selectAccountid').val()||0;
        let deductionAccount = $('#selectAccountname').val()||0;
        let isIsWorkPlacegiving = $('#selectIsWorkPlacegiving').val()||0;
        let isTaxexempt = $('#selectisTaxexempt').val()||0;
        let isUnionfees = $('#selectisUnionfees').val()||0;
        let deductionAmount = $('#selectdeductionAmount').val()||0;
        let deductionName = $('#selectideductionName').val()||0;
        let displayName = $('#selectdisplayName').val()||0;

    

        $('.fullScreenSpin').css('display','inline-block');
  
        let objDetails = {
            type: "TDeduction",
            fields: {
                Id: parseInt(deductionID),
                Active: false,    
               
                Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                Basedonid:1,
                Description: deductionName,
                DisplayIn: displayName,        
  
            }
        };
  
        taxRateService.saveDeduction(objDetails).then(function (objDetails) {
          $('.fullScreenSpin').css('display','none');
          sideBarService.getDeduction().then(function(dataReload) {
             addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
               Meteor._reload.reload();
             }).catch(function (err) {
               Meteor._reload.reload();
             });
           }).catch(function(err) {
             Meteor._reload.reload();
           });
        }).catch(function (err) {
          swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
           Meteor._reload.reload();
          }else if (result.dismiss === 'cancel') {
  
          }
          });
            $('.fullScreenSpin').css('display','none');
        });
  
      },
    'click .btnAddNewDeduction': function(event) {
        $('.btnAddNewDeduction').attr("data-toggle", "modal");
        $('.btnAddNewDeduction').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("None");
        $('#edtDeductionTitle').val("None");
    },
    'click .noneModal': function(event) {
        $('.noneModal').attr("data-toggle", "modal");
        $('.noneModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("None");
        $('#edtDeductionTitle').val("None");
    },
    'click .workplaceGivingModal': function(event) {
        $('.workplaceGivingModal').attr("data-toggle", "modal");
        $('.workplaceGivingModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("Workplace Giving");
        $('#edtDeductionTitle').val("WorkplaceGiving");
    },
    'click .unionAssociationFeesModal': function(event) {
        $('.unionAssociationFeesModal').attr("data-toggle", "modal");
        $('.unionAssociationFeesModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("Union / Association Fees");
        $('#edtDeductionTitle').val("UnionAssociationFees");
    },
    
    'click .btnUploadFile':function(event){
        // $('#attachment-upload').val('');
        // $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#fileInput').trigger('click');
    
        },
     
    


});

Template.payrollrules.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.code == 'NA') {
                return 1;
            } else if (b.code == 'NA') {
                return -1;
            }
            return (a.code.toUpperCase() > b.code.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    }
});
