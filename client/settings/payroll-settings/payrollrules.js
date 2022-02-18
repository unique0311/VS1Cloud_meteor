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
                      '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
                  $('#tblEarnings').DataTable({

                      data: splashArrayAllowanceList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                          {
                              className: "colEarningsID hiddenColumn",
                              "targets": [0]
                          },
                          {
                              className: "colEarningsNames",
                              "targets": [1]
                          },  {
                              className: "colEarningsType",
                              "targets": [2]
                          }, {
                              className: "colEarningsDsiplayName",
                              "targets": [3]
                          }, {
                              className: "colEarningsAmount  text-right",
                              "targets": [4]
                          }, {
                              className: "colEarningsAccounts",
                              "targets": [5]
                          }, {
                              className: "colEarningsAccountsID hiddenColumn",
                              "targets": [6]
                          }, {
                              className: "colEarningsPAYG hiddenColumn",
                              "targets": [7]
                          }, {
                              className: "colEarningsSuperannuation hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colEarningsReportableasW1 hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "colDeleteEarnings",
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
                          $('#tblEarnings').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblEarnings_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblEarnings_filter input').val();

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
                                                    '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                  ];

                                                  splashArrayAllowanceList.push(dataListCustomerDupp);
                                                  //}
                                              }

                                              let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                              var datatable = $('#tblEarnings').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblEarnings").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");

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
                  '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
              $('#tblEarnings').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colEarningsID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colEarningsNames",
                          "targets": [1]
                      },  {
                          className: "colEarningsType",
                          "targets": [2]
                      }, {
                          className: "colEarningsDsiplayName",
                          "targets": [3]
                      }, {
                          className: "colEarningsAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colEarningsAccounts",
                          "targets": [5]
                      }, {
                          className: "colEarningsAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colEarningsPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colEarningsSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colEarningsReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteEarnings",
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
                      $('#tblEarnings').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblEarnings_ellipsis').addClass('disabled');
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
                              let customerSearch = $('#tblEarnings_filter input').val();

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
                                                '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblEarnings').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblEarnings").dataTable().fnPageChange('last');
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
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");

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
                  '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
              $('#tblEarnings').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colEarningsID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colEarningsNames",
                          "targets": [1]
                      },  {
                          className: "colEarningsType",
                          "targets": [2]
                      }, {
                          className: "colEarningsDsiplayName",
                          "targets": [3]
                      }, {
                          className: "colEarningsAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colEarningsAccounts",
                          "targets": [5]
                      }, {
                          className: "colEarningsAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colEarningsPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colEarningsSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colEarningsReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteEarnings",
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
                      $('#tblEarnings').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblEarnings_ellipsis').addClass('disabled');
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
                              let customerSearch = $('#tblEarnings_filter input').val();

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
                                                '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblEarnings').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblEarnings").dataTable().fnPageChange('last');
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
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");

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


  $('#tblEarnings tbody').on( 'click', 'td:not(.colDeleteEarnings)', function () {
    var listData = $(this).closest('tr').find('.colEarningsID').text();
    if(listData){
      let allowanceType = $(this).closest('tr').find('.colEarningsType').text()||'';
      let earningName = $(this).closest('tr').find('.colEarningsNames').text()||'';
      let earningDisplayName = $(this).closest('tr').find('.colEarningsDsiplayName').text()||'';
      let earningAmount = $(this).closest('tr').find('.colEarningsAmount').text()||'0.00';
      let earningExpenseAccount = $(this).closest('tr').find('.colEarningsAccounts').text()||'';
      let earningExpenseAccountID = $(this).closest('tr').find('.colEarningsAccountsID').text()||'';
      let exemptPAYG = $(this).closest('tr').find('.colEarningsPAYG').text()||'false';
      let exemptSupernation = $(this).closest('tr').find('.colEarningsSuperannuation').text()||'false';
      let exemptActivityStatement = $(this).closest('tr').find('.colEarningsReportableasW1').text()||'false';

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

  $('#tblEarnings tbody').on( 'click', 'td.colDeleteEarnings', function () {
    var listData = $(this).closest('tr').find('.colEarningsID').text();
    if(listData){
      FlowRouter.go('/productview?id=' + listData+'&instock=true');
    }
  });


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
        $('#tblDeductions').DataTable({
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
                $('#tblDeductions').DataTable().ajax.reload();
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

    $(document).on('click', '.colDeleteEarnings', function() {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').find('.colEarningsID').text()||0; // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteEarningsLineModal').modal('toggle');
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

    });

    $('#edtExpenseAccountAllowance').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('');
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
           $('#selectLineID').val('');
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
    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        var table = $(this);


          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');
          $('#edtExpenseAccountAllowance').val(accountname);
          $('#edtExpenseAccountID').val(accountID);

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
});

Template.payrollrules.events({
    'click #btnEarnings': function() {
        document.getElementById("earnings").style.display = "block";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnDeductions': function() {
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "block";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnReiumbursement': function() {
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "block";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnLeave': function() {
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
    'change #edtAllowanceAmount': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }

    },
    'keydown #edtAllowanceAmount': function(event) {
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
