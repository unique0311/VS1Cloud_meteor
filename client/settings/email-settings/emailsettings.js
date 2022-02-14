import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CountryService
} from '../../js/country-service';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.emailsettings.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.empSchedRec = new ReactiveVar([]);
});

Template.emailsettings.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let empSchedRec = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'currencyLists', function(error, result) {
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
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

     templateObject.getScheduleInfo = function() {
        taxRateService.getScheduleSettings().then(function(data) {
          let empData = data.treportschedules;


          // data.tReportSchedules.Every = 3;
          // let schList =
          // schList = "3";
            // data.treportschedules[1]['fields']['Every'] = "4";


            // data.treportschedules[0]['fields'].push(data);
                  var empIDSes = Session.get('mySessionEmployeeLoggedID');

                  for (let i = 0; i < empData.length; i++) {

                    if (empData[i].fields.EmployeeId == empIDSes) {
                    // empDataCurr = empData[i].fields.Active;

                    var empDataCurr = {
                      Active: empData[i].fields.Active,
                      BeginFromOption: empData[i].fields.BeginFromOption,
                      EmployeeId: empData[i].fields.EmployeeId,
                      EndDate: empData[i].fields.EndDate,
                      Every: empData[i].fields.Every,
                      FormID: empData[i].fields.FormID,
                      Frequency:empData[i].fields.Frequency,
                      ID:empData[i].fields.ID,
                      ISEmpty: empData[i].fields.ISEmpty,
                      MonthDays: empData[i].fields.MonthDays,
                      NextDueDate: empData[i].fields.NextDueDate,
                      Recno: empData[i].fields.Recno,
                      SatAction: empData[i].fields.SatAction,
                      StartDate: empData[i].fields.StartDate.split(' ')[0],
                      StartTime: empData[i].fields.StartDate.split(' ')[1],
                      SunAction: empData[i].fields.SunAction,
                      WeekDay: empData[i].fields.WeekDay,
                    };

                    empSchedRec.push(empDataCurr);
                    templateObject.empSchedRec.set(empDataCurr);
                    console.log(empDataCurr);

                    // var strtDate = empDataCurr.StartDate;
                    // strtDate = strtDate.substr(0,11);
                    if (empDataCurr.FormID = "139"){
                    if (empDataCurr.Frequency = "D"){
                     $('#blncSheets #edtFrequency').html("Daily");
                    $("#frequencyDaily").prop('checked', true);
                    // $("#dailyEvery").trigger('click');
                    $("#dailyEvery").prop('checked', true);
                    $(".dailySettings").show();
                    $('.monthlySettings').hide();
                    $('.dailyEveryXDays').attr('disabled', false);
                    $('.dailyEveryXDays').val(empDataCurr.Every);
                    setTimeout(function () {
                      $('#edtDailyStartDate').val(empDataCurr.StartDate);
                      $('#edtDailyStartTime').val(empDataCurr.StartTime);
                    }, 500);

                      }
                    }
                    }

                  }

          })
     }

     templateObject.getScheduleInfo();


    setTimeout(function() {
        $('#tblAutomatedEmails').DataTable({
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
                [50, -1],
                [50, "All"]
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
                $('#currencyLists').DataTable().ajax.reload();
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
});

Template.emailsettings.events({
  'click .btnSaveFrequency': function(){
        let taxRateService = new TaxRateService();
alert('im a problem');
      var startTime = $('#edtDailyStartTime').val();
      var startDate = $('#edtDailyStartDate').val();
      let date = startDate+' '+startTime;
      var dayFreq = $('#dailyEveryXDays').val();
      var empIDSes = Session.get('mySessionEmployeeLoggedID');
      // let freqD = $(#frequencyDaily);
      objDetails = {
          type: "TReportSchedules",
          fields: {
              Active: true,
              BeginFromOption:"E",
              EmployeeId:empIDSes,
              EndDate: "2022-03-09 10:01:14",
              Every: dayFreq,
              Frequency:"D",
              FormID: 139,
              ISEmpty: false,
              MonthDays: 0,
              NextDueDate: "2022-02-15 00:00:00",
              Recno: 2,
              SatAction: "D",
              StartDate: date,
              SunAction: "A",
              WeekDay: 0,
          }
      };
      if (($('#frequencyDaily').is(':checked'))&&($('#dailyEvery').is(':checked'))) {

       taxRateService.saveScheduleSettings(objDetails).then(function(data) {
         // data.tReportSchedules.Every = 3;
         // let schList =
         // schList = "3";
           // data.treportschedules[0]['fields']['Every'] = "3";

           console.log(data);
           // data.treportschedules[0]['fields'].push(data);
         }).catch(function (err) {
            console.log(err);
             //Bert.alert('<strong>' + err + '</strong>!', 'danger');
             $('.fullScreenSpin').css('display', 'none');
         });
       }
  },
    'click #edtFrequency': function() {
        $("#frequencyModal").modal('toggle');
    },
    'click #blncSheets #edtFrequency': function() {

        $("#frequencyModal").modal('toggle');

    },
    'click input[name="frequencyRadio"]': function() {
        if (event.target.id == "frequencyMonthly") {
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyWeekly") {
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyDaily") {
        document.getElementById("dailySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyOnetimeonly") {
        document.getElementById("oneTimeOnlySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyOnevent") {
        document.getElementById("onEventSettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function() {
        if (event.target.id == "settingsMonthlyEvery") {
            $('.settingsMonthlyEveryOccurence').attr('disabled', false);
            $('.settingsMonthlyDayOfWeek').attr('disabled', false);
            $('.settingsMonthlySpecDay').attr('disabled', true);
        } else if (event.target.id == "settingsMonthlyDay") {
            $('.settingsMonthlySpecDay').attr('disabled', false);
            $('.settingsMonthlyEveryOccurence').attr('disabled', true);
            $('.settingsMonthlyDayOfWeek').attr('disabled', true);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="dailyRadio"]': function() {
        if (event.target.id == "dailyEveryDay") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyWeekdays") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyEvery") {
            $('.dailyEveryXDays').attr('disabled', false);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    // 'click .btnSaveFrequency': function() {
    //     let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
    //
    //     if (radioFrequency == "frequencyMonthly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Monthly");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyWeekly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Weekly");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyDaily") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Daily");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyOnetimeonly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("One Time Only");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyOnevent") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("On Event");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else {
    //         $("#frequencyModal").modal('toggle');
    //     }
    // },
    'click #edtBasedOn': function() {
        $("#basedOnModal").modal('toggle');
    },
    'click input[name="basedOnRadio"]': function() {
        if (event.target.id == "basedOnPrint") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnSave") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnTransactionDate") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnDueDate") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnDate") {
            $('#edtBasedOnDate').attr('disabled', false);
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnSaveBasedOn': function() {
        let radioFrequency = $('input[type=radio][name=basedOnRadio]:checked').attr('id');

        if (radioFrequency == "basedOnPrint") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Print");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnSave") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Save");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnTransactionDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Transaction Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnDueDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Due Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    }
});

Template.emailsettings.helpers({
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
    },
    empSchedRec: () => {
        return Template.instance().empSchedRec.get();
    },
});
