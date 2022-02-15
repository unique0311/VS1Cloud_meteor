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
    templateObject.employeescheduledrecord = new ReactiveVar([]);
});

Template.emailsettings.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let employeeScheduledRecord = [];
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
    templateObject.assignFrequency = function(frequency) {
        if(frequency == "W") {
            $("#frequencyWeekly").prop('checked', true);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if(frequency == "D") {
            $("#frequencyDaily").prop('checked', true);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if(frequency == "M") {
            $("#frequencyMonthly").prop('checked', true);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

    }

    templateObject.getDayNumber = function(day) {
        day = day.toLowerCase();
        if(day == ""){
            return;
        }

        if(day == "monday") {
            return 1;
        }

        if(day == "tuesday") {
            return 2;
        }

        if(day == "wednesday") {
            return 3;
        }

        if(day == "thursday") {
            return 4;
        }

        if(day == "friday") {
            return 5;
        }

        if(day == "saturday") {
            return 6;
        }

        if(day == "sunday") {
            return 7;
        }

    }

    templateObject.getDayName = function(day) {
        if(day == 1 || day == 0) {
            $("#formCheck-monday").prop('checked', true);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 2) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', true);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 3) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', true);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 4) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', true);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 5) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', true);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 6) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', true);
            $("#formCheck-sunday").prop('checked', false);
        }

        if(day == 7) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', true);
        }

    }
     templateObject.assignSettings = function(setting) {
        if(setting == "W") {
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyWeekly').trigger('click');
        }

        if(setting == "D") {
            $("#frequencyDaily").prop('checked', true);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
        }

        if(setting == "M") {
            $("#frequencyMonthly").prop('checked', true);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyMonthly').trigger('click');
        }

    }
     templateObject.getScheduleInfo = function() {
        taxRateService.getScheduleSettings().then(function(data) {
          let empData = data.treportschedules;
                  var employeeID = Session.get('mySessionEmployeeLoggedID');
                  for (let i = 0; i < empData.length; i++) {
                    if (empData[i].fields.EmployeeId == employeeID) {
                        var empDataCurr = {
                            fromdate: empData[i].fields.BeginFromOption || '',
                            employeeid: empData[i].fields.EmployeeId || '',
                            enddate: empData[i].fields.EndDate || '',
                            every: empData[i].fields.Every || '',
                            formID: empData[i].fields.FormID || '',
                            frequency:empData[i].fields.Frequency || '',
                            id:empData[i].fields.ID || '',
                            monthDays: empData[i].fields.MonthDays || '',
                            nextDueDate: empData[i].fields.NextDueDate || '',
                            satAction: empData[i].fields.SatAction || '',
                            startDate: empData[i].fields.StartDate.split(' ')[0] || '',
                            startTime: empData[i].fields.StartDate.split(' ')[1] || '',
                            sunAction: empData[i].fields.SunAction || '',
                            weekDay: empData[i].fields.WeekDay || '',
                    };
                    templateObject.employeescheduledrecord.set(empDataCurr);
                       // $('#blncSheets #edtFrequency').html("Daily");
                        $(".dailySettings").show();
                        $('.monthlySettings').hide();
                        templateObject.assignFrequency(empDataCurr.frequency);
                        $('#frequencyid').val(empDataCurr.id);
                        if(empDataCurr.frequency == "M") {
                            $('#sltDayOccurence').val(empDataCurr.every);
                            $('#sltDayOfWeek').val(empDataCurr.monthDays);
                             $('#edtMonthlyStartTime').val(empDataCurr.startTime);
                            $('#edtMonthlyStartDate').val(empDataCurr.startDate);
                             $('#edtFrequency').text("Monthly");
                        }

                        if(empDataCurr.frequency == "W") {
                            setTimeout(function () {
                            $('#weeklyEveryXWeeks').val(empDataCurr.every);
                            $('#edtWeeklyStartTime').val(empDataCurr.startTime);
                            $('#edtWeeklyStartDate').val(empDataCurr.startDate);
                            templateObject.getDayName(empDataCurr.weekDay);
                            $('#edtFrequency').text("Weekly");
                            }, 500);
                        }
                        
                        if(empDataCurr.frequency == "D") {
                            setTimeout(function () {
                            $('#dailyEveryXDays').val(empDataCurr.every);
                            $('#edtDailyStartTime').val(empDataCurr.startTime);
                            $('#edtDailyStartDate').val(empDataCurr.startDate);
                            $('#edtFrequency').text("Daily");
                            }, 500);
                        }
                        $('.fullScreenSpin').css('display', 'none');
                        
                        // setTimeout(function () {
                        //     $('#edtWeeklyStartTime').val(empDataCurr.StartDate);
                        //     $('#edtWeeklyStartDate').val(empDataCurr.StartTime);
                        // }, 500);
                }
            }
        })
     }

     templateObject.getScheduleInfo();

    //  function onlyOne(checkbox) {
    //     var checkboxes = document.getElementsByName('chkBox')
    //     checkboxes.forEach((item) => {
    //         console.log(item);
    //         if (item !== checkbox) {
    //             item.checked = false
    //         }
    //     });
    // }


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
        // $('.fullScreenSpin').css('display', 'none');
    }, 0);
});

Template.emailsettings.events({
  'click .btnSaveFrequency': function(){
    $('.fullScreenSpin').css('display', 'inline-block');
      let taxRateService = new TaxRateService();
      let templateObject = Template.instance();
      let startTime = "";
      let startDate = "";
      let date = "";
      let frequency = ""
      let every = 0;
      let monthDays = 0;
      let weekDay = 0;
      let id =  $('#frequencyid').val() || '';
      let employeeID = Session.get('mySessionEmployeeLoggedID');

      if($('#frequencyMonthly').is(":checked")) {
        startTime = $('#edtMonthlyStartTime').val();
        startDate = moment($('#edtMonthlyStartDate').val()).format('YYYY-MM-DD');
        every = $('#sltDayOccurence').val();
        frequency = "M";
        monthDays = $('#sltDayOfWeek').val();
        date = startDate+' '+startTime;
      }


      if($('#frequencyWeekly').is(":checked")) {
        startTime = $('#edtWeeklyStartTime').val();
        startDate = moment($('#edtWeeklyStartDate').val()).format('YYYY-MM-DD');
        every = $('#weeklyEveryXWeeks').val();
        frequency = "W";
        date = startDate+' '+startTime;

        var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item.checked) {
                weekDay = templateObject.getDayNumber(item.value);
            }
        });
      }

      if($('#frequencyDaily').is(":checked")) {
        startTime = $('#edtDailyStartTime').val();
        startDate = moment($('#edtDailyStartDate').val()).format('YYYY-MM-DD');
        every = $('#dailyEveryXDays').val();
        frequency = "D";
        date = startDate+' '+startTime;
      }
      
      if(id == "") {
         objDetails = {
          type: "TReportSchedules",
          fields: {
              EmployeeId:employeeID,
              StartDate: date,
              Every: every,
              Frequency:frequency,
              //FormID: 139,
              MonthDays: monthDays,
              //NextDueDate: "2022-02-15 00:00:00",
              // SatAction: "D",
              StartDate: date,
              // SunAction: "A",
              WeekDay: weekDay,
          }
      };
      } else {
         objDetails = {
          type: "TReportSchedules",
          fields: {
              ID: id,
              EmployeeId:employeeID,
              StartDate: date,
              Every: every,
              Frequency:frequency,
              //FormID: 139,
              MonthDays: monthDays,
              //NextDueDate: "2022-02-15 00:00:00",
              // SatAction: "D",
              StartDate: date,
              // SunAction: "A",
              WeekDay: weekDay,
          }
      };

      }
     

       taxRateService.saveScheduleSettings(objDetails).then(function(data) {
           Meteor._reload.reload();
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
   'click .chkBoxDays': function(event){
   var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item !== event.target) {
                item.checked = false
            }
        });
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
    employeescheduledrecord: () => {
        return Template.instance().employeescheduledrecord.get();
    },
});
