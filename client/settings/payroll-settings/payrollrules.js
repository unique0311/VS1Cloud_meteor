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

        }
    }).catch(function(err) {
      console.log(err);
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

      // $('#edtRateTypeAllowance').editableSelect();
      // $('#edtRateTypeAllowance').editableSelect('add','Car');

      $('#edtExpenseAccountAllowance').editableSelect();
      $('#edtDeductionAccount').editableSelect();

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

        // document.getElementById("ruleConstructOne").value = "Greater Than";
        // document.getElementById("ruleModifierTime").style.display = "inline-flex";
        // document.getElementById("ruleModifierDay").style.display = "none";
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
              Active: false
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
    }
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
