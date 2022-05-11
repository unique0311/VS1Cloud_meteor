import '../lib/global/indexdbstorage.js';
import {SideBarService} from '../js/sidebar-service';
import { UtilityService } from "../utility-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.earningRateSettings.onCreated(function() {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.datatableallowancerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.countryData = new ReactiveVar();
  templateObject.Ratetypes = new ReactiveVar([]);
  templateObject.imageFileData=new ReactiveVar();
  // templateObject.Accounts = new ReactiveVar([]);   
});

Template.earningRateSettings.onRendered(function() {

  const templateObject = Template.instance();
  var splashArrayEarningList = new Array();

  function MakeNegative() {
    $('td').each(function() {
        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    });
  };

  templateObject.getOrderdinaryEarning = function(){
    getVS1Data('TOrdinaryTimeEarnings').then(function(dataObject) {
    if (dataObject.length == 0) {
      sideBarService.getOrdinarytimeEarning(initialBaseDataLoad, 0).then(function (data) {
      addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(data));
      let lineItems = [];
      let lineItemObj = {};
      for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
        
          var dataListAllowance = [
              data.tordinarytimeearnings[i].fields.ID || '',
              data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
              'Ordinary Time Earning',
              data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
              '100',
              data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
            
            //   '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
          ];

          splashArrayEarningList.push(dataListAllowance);
      }




      setTimeout(function () {
          MakeNegative();
      }, 100);
      setTimeout(function () {
          $('#tblEarnings').DataTable({

              data: splashArrayEarningList,
              "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              columnDefs: [                              
                
                {
                    className: "colEarningsID hiddenColumn",
                    "targets": [0]
                  },
                  {
                    className: "colEarningsNames",
                    "targets": [1]
                  },  
                  {
                    className: "colEarningsType",
                    "targets": [2]
                  },      
                  {
                  className: "colEarningsDisplayName",
                  "targets": [3]
                  },  
                  {
                  className: "colEarningsAmount",
                  "targets": [4]
                  },  
                  {
                  className: "colEarningsAccounts",
                  "targets": [5]
                  },  
                  {
                  className: "colEarningsAccountsID hiddenColumn",
                  "targets": [6]
                  },   
                  {
                  className: "colEarningsPAYG hiddenColumn"  ,
                  "targets": [7]
                  },  
                  {
                  className: "colEarningsSuperannuation hiddenColumn",
                  "targets": [8]
                  },  
                  {
                  className: "colEarningsReportableasW1 hiddenColumn",
                  "targets": [9]
                  },                   
                //   {
                //     className: "colDeleteEarnings",
                //     "orderable": false,
                //     "targets": -1
                //   }
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
                          var splashArrayReisumentDupp = new Array();
                          let dataLenght = oSettings._iDisplayLength;
                          let customerSearch = $('#tblEarnings_filter input').val();

                          sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {

                            for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
        
                                var dataListAllowance = [
                                    data.tordinarytimeearnings[i].fields.ID || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
                                    'Ordinary Time Earning',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
                                    '100',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
                                  
                                    // '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                ];
              
                                splashArrayEarningList.push(dataListAllowance);
                            }
              

                                      let uniqueChars = [...new Set(splashArrayEarningList)];
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
                //   $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
                //   $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#ttblPayCalendars_filter");

              }

          }).on('page', function () {
              setTimeout(function () {
                  MakeNegative();
              }, 100);

          }).on('column-reorder', function () {

          }).on('length.dt', function (e, settings, len) {
            //$('.fullScreenSpin').css('display', 'inline-block');
            let dataLenght = settings._iDisplayLength;
            splashArrayReisument = [];
            if (dataLenght == -1) {
              $('.fullScreenSpin').css('display', 'none');

            } else {
                if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                    $('.fullScreenSpin').css('display', 'none');
                } else {
                    sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {

                        addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    for (let i = 0; i < data.Tordinarytimeearnings.length; i++) {
        
    var dataListAllowance = [
        data.Tordinarytimeearnings[i].fields.ID || '',
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
        'Ordinary Time Earning',
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
        '100',
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || 0,
        data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || 0,
      
        // '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
    ];

    splashArrayEarningList.push(dataListAllowance);
    }



    setTimeout(function () {
      MakeNegative();
    }, 100);
    setTimeout(function () {
      $('#tblEarnings').DataTable({

          data: splashArrayEarningList,
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          columnDefs: [                              
                
              {
                  className: "colEarningsID hiddenColumn",
                  "targets": [0]
                },
                {
                  className: "colEarningsNames",
                  "targets": [1]
                },  
                {
                  className: "colEarningsType",
                  "targets": [2]
                },      
                {
                className: "colEarningsDisplayName",
                "targets": [3]
                },  
                {
                className: "colEarningsAmount",
                "targets": [4]
                },  
                {
                className: "colEarningsAccounts",
                "targets": [5]
                },  
                {
                className: "colEarningsAccountsID hiddenColumn",
                "targets": [6]
                },   
                {
                className: "colEarningsPAYG hiddenColumn"  ,
                "targets": [7]
                },  
                {
                className: "colEarningsSuperannuation hiddenColumn",
                "targets": [8]
                },  
                {
                className: "colEarningsReportableasW1 hiddenColumn",
                "targets": [9]
                },                   
                // {
                //   className: "colDeleteEarnings",
                //   "orderable": false,
                //   "targets": -1
                // }
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
                      var splashArrayEarningListDupp = new Array();
                      let dataLenght = oSettings._iDisplayLength;
                      let customerSearch = $('#tblEarnings_filter input').val();

                      sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {

                        for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
        
                            var dataListAllowance = [
                                data.tordinarytimeearnings[i].fields.ID || '',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                                'Ordinary Time Earning',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                                '100',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
                              
                                // '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                            ];
          
                            splashArrayEarningList.push(dataListAllowance);
                        }

                                  let uniqueChars = [...new Set(splashArrayEarningList)];
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
              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
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
        splashArrayEarningList = [];
        if (dataLenght == -1) {
          $('.fullScreenSpin').css('display', 'none');

        } else {
            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                $('.fullScreenSpin').css('display', 'none');
            } else {
                sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {

                    addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

    sideBarService.getOrdinarytimeEarning(initialBaseDataLoad, 0).then(function (data) {
      addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(data));
        let lineItems = [];
        let lineItemObj = {};
        
      for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
          
            
        var dataListAllowance = [
            data.tordinarytimeearnings[i].fields.ID || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
            'Ordinary Time Earning',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
            '100',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
          
            // '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
        ];
              
          
              splashArrayEarningList.push(dataListAllowance);
            }

      

      

        setTimeout(function () {
            MakeNegative();
        }, 100);
        setTimeout(function () {
            
            $('#tblEarnings').DataTable({

                data: splashArrayEarningList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [                                                        
                    {
                    className: "colEarningsID hiddenColumn",
                    "targets": [0]
                    },
                    {
                        className: "colEarningsNames",
                        "targets": [1]
                    },  
                    {
                        className: "colEarningsType",
                        "targets": [2]
                    },      
                    {
                    className: "colEarningsDisplayName",
                    "targets": [3]
                    },  
                    {
                    className: "colEarningsAmount",
                    "targets": [4]
                    },  
                    {
                    className: "colEarningsAccounts",
                    "targets": [5]
                    },  
                    {
                    className: "colEarningsAccountsID hiddenColumn",
                    "targets": [6]
                    },   
                    {
                    className: "colEarningsPAYG hiddenColumn"  ,
                    "targets": [7]
                    },  
                    {
                    className: "colEarningsSuperannuation hiddenColumn",
                    "targets": [8]
                    },  
                    {
                    className: "colEarningsReportableasW1 hiddenColumn",
                    "targets": [9]
                    },                   
                    // {
                    //     className: "colDeleteEarnings",
                    //     "orderable": false,
                    //     "targets": -1
                    // }
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
                            var splashArrayReisumentDupp = new Array();
                            let dataLenght = oSettings._iDisplayLength;
                            let customerSearch = $('#tblEarnings_filter input').val();

                            sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {

                                for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
                
                                    var dataListAllowance = [
                                        data.tordinarytimeearnings[i].fields.ID || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                                        'Ordinary Time Earning',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                                        '100',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
                                      
                                        // '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                    ];
                
                                    splashArrayEarningList.push(dataListAllowance);
                                }

                                    let uniqueChars = [...new Set(splashArrayEarningList)];
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
                    //   $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                    //   $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                }

            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);

            }).on('column-reorder', function () {

            }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayEarningList = [];
                if (dataLenght == -1) {
                $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

  templateObject.getOrderdinaryEarning();

});

Template.payrollrules.events({
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
    
                // if(Session.get('ExemptReportable'))
                // {
                //     let output  = Session.get('ExemptReportable');
                //     objDetails = {
                //         type: "TOrdinaryTimeEarnings",
                //         fields: {
                //             ID: 5999899,
                //             PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
                //             PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
                //             PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
                //             PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                //             PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                //             PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //             PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                //             PayItemsEarningsOrdinaryTimeEarningsActive:true     
                //         }
                //     };
    
                //     output.push(objDetails);
                //     Session.set('ExemptReportable',output);
    
                // }
                // else
                // {
                //     let object_array = [];
                //     objDetails = {
                //         type: "TOrdinaryTimeEarnings",
                //         fields: {
                //             ID: 89599895,
                //             PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
                //             PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
                //             PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
                //             PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                //             PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                //             PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //             PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                //             PayItemsEarningsOrdinaryTimeEarningsActive:true     
                //         }
                //     };
    
                //     object_array.push(objDetails);
                //     Session.set('ExemptReportable',object_array);
    
                // }
    
    
                // let output  = Session.get('ExemptReportable');
                // $('.fullScreenSpin').css('display','inline-block')
                // swal({
                //           title: 'Success',
                //           text: 'success',
                //           type: 'success',
                //           showCancelButton: false,
                //           confirmButtonText: 'Done'
    
                //      }).then((result) => {
                //           if (result.value) {
                //             Meteor._reload.reload();
                //           } else if (result.dismiss === 'cancel') {
            
                //           }
                //           });
                          
                //           $('.fullScreenSpin').css('display','none');
           
                $('.fullScreenSpin').css('display','inline-block');
                taxRateService.checkordinaryEarningByName(edtEarningsName).then(function (data) {
                    console.log(data);
                    earningid = data.tordinarytimeearnings[0].Id;
                    objDetails = {
                   type: "TOrdinaryTimeEarnings",
                    fields: {
                       ID: parseInt(earningid),
                       OrdinaryTimeEarningsName:edtEarningsName,
                       OrdinaryTimeEarningsDisplayName:edtDisplayName,
                       OrdinaryTimeEarningsRateType:edtRateType,
                       OrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                       OrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                       OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       OrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                       OrdinaryTimeEarningsActive:true     
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
                        OrdinaryTimeEarningsName:edtEarningsName,
                        OrdinaryTimeEarningsDisplayName:edtDisplayName,
                        OrdinaryTimeEarningsRateType:edtRateType,
                        OrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                        OrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                        OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        OrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                        OrdinaryTimeEarningsActive:true           
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
    
            // if(Session.get('ExemptReportableOvertime'))
            // {
            //     let output  = Session.get('ExemptReportableOvertime');
            //     objDetails = {
            //         type: "TOvertimeEarnigns",
            //         fields: {
            //             ID: 897979867565,
            //             PayItemsEarningsOvertimeEarningsName:edtEarningsName,
            //             PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
            //             PayItemsEarningsOvertimeEarningsRateType:edtRateType,
            //             PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
            //             PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
            //             PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
            //             PayItemsEarningsOvertimeEarningsActive:true     
            //         }
            //     };
                
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableOvertime',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TOvertimeEarnigns",
            //         fields: {
            //             ID: 897979867565,
            //             PayItemsEarningsOvertimeEarningsName:edtEarningsName,
            //             PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
            //             PayItemsEarningsOvertimeEarningsRateType:edtRateType,
            //             PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
            //             PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
            //             PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
            //             PayItemsEarningsOvertimeEarningsActive:true     
            //         }
            //     };
    
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableOvertime',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableOvertime');
            // $('.fullScreenSpin').css('display','inline-block')
            //             swal({
            //                       title: 'Success',
            //                       text: 'success',
            //                       type: 'success',
            //                       showCancelButton: false,
            //                       confirmButtonText: 'Done'
    
            //                  }).then((result) => {
            //                       if (result.value) {
            //                         Meteor._reload.reload();
            //                       } else if (result.dismiss === 'cancel') {
                    
            //                       }
            //                       });
                                  
            //                       $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableOvertime(edtEarningsName).then(function (data) {
                earningid = data.tovertimeEarnigns[0].Id;
                objDetails = {
                   type: "Tovertimeearnings",
                   fields: {
                       ID: parseInt(earningid),
                       OverTimeEarningsName:edtEarningsName,
                       OverTimeEarningsDisplayName:edtDisplayName,
                       OverTimeEarningsRateType:edtRateType,
                       OverTimeEarningsExpenseAccount:edtExpenseAccount,
                       OverTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                       OverTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       OverTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                       OverTimeEarningsActive:true     
                   }
               };
    
              taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                    addVS1Data('TOverTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
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
                    type: "Tovertimeearnings",
                    fields: {
                        OverTimeEarningsName:edtEarningsName,
                        OverTimeEarningsDisplayName:edtDisplayName,
                        OverTimeEarningsRateType:edtRateType,
                        OverTimeEarningsExpenseAccount:edtExpenseAccount,
                        OverTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                        OverTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        OverTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                        OverTimeEarningsActive:true            
                   }
                };
    
                taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
                sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                    addVS1Data('TOverTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
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

            // if(Session.get('ExemptReportableTermnination'))
            // {
            //     let output  = Session.get('ExemptReportableTermnination');
            //     objDetails = {
            //         type: "TEmployeeTerminations",
            //         fields: {
            //              ID: 9809987787897,
            //              EmployeeTerminationPaymentsName:edtEarningsName,
            //              EmployeeTerminationPaymentsDisplayName:edtDisplayName,
            //              EmployeeTerminationPaymentsRateType:edtRateType,
            //              EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
            //              EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
            //              EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
            //              EmployeeTerminationPaymentsActive:true        
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableTermnination',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TEmployeeTerminations",
            //         fields: {
            //              ID: 9809987787897,
            //              EmployeeTerminationPaymentsName:edtEarningsName,
            //              EmployeeTerminationPaymentsDisplayName:edtDisplayName,
            //              EmployeeTerminationPaymentsRateType:edtRateType,
            //              EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
            //              EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
            //              EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
            //              EmployeeTerminationPaymentsActive:true        
            //         }
            //     };
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableTermnination',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableTermnination');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //                   title: 'Success',
            //                   text: 'success',
            //                   type: 'success',
            //                   showCancelButton: false,
            //                   confirmButtonText: 'Done'

            // }).then((result) => {
            //         if (result.value) {
            //              Meteor._reload.reload();
            //         } else if (result.dismiss === 'cancel') {
                
            //         }
            //  });
                              
            // $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableTermnination(edtEarningsName).then(function (data) {
                earningid = data.tterminationimple[0].Id;
                objDetails = {
                   type: "TTerminationSimple",
                   fields: {
                        ID: parseInt(earningid),
                        EmployeeTerminationPaymentsName:edtEarningsName,
                        EmployeeTerminationPaymentsDisplayName:edtDisplayName,
                        EmployeeTerminationPaymentsRateType:edtRateType,
                        EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
                        EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
                        EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
                        EmployeeTerminationPaymentsActive:true,
                      
                   }
               };
    
              taxRateService.saveExemptReportableTermnination(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableTermnination().then(function(dataReload) {
                    addVS1Data('TTerminationSimple',JSON.stringify(dataReload)).then(function (datareturn) {
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
                    type: "TTerminationSimple",
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
                    addVS1Data('TTerminationSimple',JSON.stringify(dataReload)).then(function (datareturn) {
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


            // if(Session.get('ExemptReportableLumpSumE'))
            // {
            //     let output  = Session.get('ExemptReportableLumpSumE');
            //     objDetails = {
            //         type: "TLumpSumE",
            //         fields: {
            //              ID: 15995945889,
            //              LumpSumEName:edtEarningsName,
            //              LumpSumEDisplayName:edtDisplayName,
            //              LumpSumERateType:edtRateType,
            //              LumpSumEExpenseAccount:edtExpenseAccount,
            //              LumpSumEExemptPaygWithholding:ExemptPAYGp,
            //              LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              LumpSumEReportableW1onActivityStatement:ExemptReportable,
            //              LumpSumEActive:true        
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableLumpSumE',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TLumpSumE",
            //         fields: {
            //              ID: 15995945889,
            //              LumpSumEName:edtEarningsName,
            //              LumpSumEDisplayName:edtDisplayName,
            //              LumpSumERateType:edtRateType,
            //              LumpSumEExpenseAccount:edtExpenseAccount,
            //              LumpSumEExemptPaygWithholding:ExemptPAYGp,
            //              LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              LumpSumEReportableW1onActivityStatement:ExemptReportable,
            //              LumpSumEActive:true        
            //         }
            //     };
    
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableLumpSumE',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableLumpSumE');
            // $('.fullScreenSpin').css('display','inline-block')
            //         swal({
            //                   title: 'Success',
            //                   text: 'success',
            //                   type: 'success',
            //                   showCancelButton: false,
            //                   confirmButtonText: 'Done'

            //              }).then((result) => {
            //                   if (result.value) {
            //                     Meteor._reload.reload();
            //                   } else if (result.dismiss === 'cancel') {
                
            //                   }
            //                   });
                              
            //                   $('.fullScreenSpin').css('display','none');


           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableLumpSumE(edtEarningsName).then(function (data) {
                earningid = data.tlumpsume[0].Id;
                objDetails = {
                   type: "Tlumpsume",
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
                    type: "Tlumpsume",
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
    
            // if(Session.get('ExemptReportableBonusesCommissions'))
            // {
            //     let output  = Session.get('ExemptReportableBonusesCommissions');
            //     objDetails = {
            //         type: "TEarningsBonusesCommissions",
            //         fields: {
            //             ID: 9685565999,
            //             EarningsBonusesCommissionsName:edtEarningsName,
            //             EarningsBonusesCommissionsDisplayName:edtDisplayName,
            //             EarningsBonusesCommissionsRateType:edtRateType,
            //             EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
            //             EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
            //             EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
            //             EarningsBonusesCommissionsActive:true     
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableBonusesCommissions',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TEarningsBonusesCommissions",
            //         fields: {
            //             ID: 9685565999,
            //             EarningsBonusesCommissionsName:edtEarningsName,
            //             EarningsBonusesCommissionsDisplayName:edtDisplayName,
            //             EarningsBonusesCommissionsRateType:edtRateType,
            //             EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
            //             EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
            //             EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
            //             EarningsBonusesCommissionsActive:true     
            //         }
            //     };
    
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableBonusesCommissions',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableBonusesCommissions');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'
    
            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //           $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkSuperannuationBonusesCommissions(edtEarningsName).then(function (data) {
                earningid = data.tearningsbonusescommissions[0].Id;
                objDetails = {
                   type: "Tearningsbonusescommissions",
                   fields: {
                       ID: parseInt(earningid),
                       EarningBonusesCommisionsName:edtEarningsName,
                       EarningBonusesCommisionsDisplayName:edtDisplayName,
                       EarningBonusesCommisionsRateType:edtRateType,
                       EarningBonusesCommisionsExpenseAccount:edtExpenseAccount,
                       EarningBonusesCommisionsExemptPaygWithholding:ExemptPAYGp,
                       EarningBonusesCommisionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       EarningBonusesCommisionsReportableW1onActivityStatement:ExemptReportable,
                       EarningBonusesCommisionsActive:true     
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
                    type: "Tearningsbonusescommissions",
                    fields: {
                        EarningBonusesCommisionsName:edtEarningsName,
                        EarningBonusesCommisionsDisplayName:edtDisplayName,
                        EarningBonusesCommisionsRateType:edtRateType,
                        EarningBonusesCommisionsExpenseAccount:edtExpenseAccount,
                        EarningBonusesCommisionsExemptPaygWithholding:ExemptPAYGp,
                        EarningBonusesCommisionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EarningBonusesCommisionsReportableW1onActivityStatement:ExemptReportable,
                        EarningBonusesCommisionsActive:true          
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
    
    
                // if(Session.get('LumpSumW'))
                // {
                //     let output  = Session.get('LumpSumW');
                //      objDetails = {
                //        type: "TLumpSumW",
                //        fields: {
                //            ID: 7956992945455,
                //            LumpSumWName:edtEarningsName,
                //            LumpSumWDisplayName:edtDisplayName,
                //            LumpSumWRateType:edtRateType,
                //            LumpSumWExpenseAccount:edtExpenseAccount,
                //            LumpSumWExemptPaygWithholding:ExemptPAYGp,
                //            LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //            LumpSumWReportableW1onActivityStatement:ExemptReportable,
                //            LumpSumWActive:true     
                //        }
                //    };
        
                //     output.push(objDetails);
                //     Session.set('LumpSumW',output);
        
                // }
                // else
                // {
                //     let object_array = [];
                //     objDetails = {
                //         type: "TLumpSumW",
                //         fields: {
                //             ID: 7956992945455,
                //             LumpSumWName:edtEarningsName,
                //             LumpSumWDisplayName:edtDisplayName,
                //             LumpSumWRateType:edtRateType,
                //             LumpSumWExpenseAccount:edtExpenseAccount,
                //             LumpSumWExemptPaygWithholding:ExemptPAYGp,
                //             LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //             LumpSumWReportableW1onActivityStatement:ExemptReportable,
                //             LumpSumWActive:true     
                //         }
                //     };
                //     object_array.push(objDetails);
                //     Session.set('LumpSumW',object_array);
        
                // }
        
        
                // let output  = Session.get('LumpSumW');
                // $('.fullScreenSpin').css('display','inline-block')
                // swal({
                //           title: 'Success',
                //           text: 'success',
                //           type: 'success',
                //           showCancelButton: false,
                //           confirmButtonText: 'Done'
    
                //      }).then((result) => {
                //           if (result.value) {
                //             Meteor._reload.reload();
                //           } else if (result.dismiss === 'cancel') {
            
                //           }
                //           });
                          
                //           $('.fullScreenSpin').css('display','none');
               
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
    
                // if(Session.get('DirectorFeesaveDirectorFee'))
                // {
                //     let output  = Session.get('DirectorFeesaveDirectorFee');
                //     objDetails = {
                //         type: "TDirectorsFees",
                //         fields: {
                //             ID: 365989559959,
                //             DirectorsFeesName:edtEarningsName,
                //             DirectorsFeesDisplayName:edtDisplayName,
                //             DirectorsFeesRateType:edtRateType,
                //             DirectorsFeesExpenseAccount:edtExpenseAccount,
                //             DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                //             DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //             DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                //             DirectorsFeesActive:true     
                //         }
                //     };
        
                //     output.push(objDetails);
                //     Session.set('DirectorFeesaveDirectorFee',output);
        
                // }
                // else
                // {
                //     let object_array = [];
                //     objDetails = {
                //         type: "TDirectorsFees",
                //         fields: {
                //             ID: 365989559959,
                //             DirectorsFeesName:edtEarningsName,
                //             DirectorsFeesDisplayName:edtDisplayName,
                //             DirectorsFeesRateType:edtRateType,
                //             DirectorsFeesExpenseAccount:edtExpenseAccount,
                //             DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                //             DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                //             DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                //             DirectorsFeesActive:true     
                //         }
                //     };
                //     object_array.push(objDetails);
                //     Session.set('DirectorFeesaveDirectorFee',object_array);
        
                // }
        
        
                // let output  = Session.get('DirectorFeesaveDirectorFee');
                // $('.fullScreenSpin').css('display','inline-block')
                // swal({
                //           title: 'Success',
                //           text: 'success',
                //           type: 'success',
                //           showCancelButton: false,
                //           confirmButtonText: 'Done'
    
                //      }).then((result) => {
                //           if (result.value) {
                //             Meteor._reload.reload();
                //           } else if (result.dismiss === 'cancel') {
            
                //           }
                //           });
                          
                //  $('.fullScreenSpin').css('display','none');
               
                $('.fullScreenSpin').css('display','inline-block');
                taxRateService.checkDirectorFee(edtEarningsName).then(function (data) {
                    earningid = data.tdirectorsfees[0].Id;
                    objDetails = {
                       type: "Tdirectorsfees",
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
                        type: "Tdirectorsfees",
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

});