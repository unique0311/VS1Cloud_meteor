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

Template.emailsettings.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.employeescheduledrecord = new ReactiveVar([]);
    templateObject.essentialemployeescheduledrecord = new ReactiveVar([]);
    templateObject.formsData = new ReactiveVar([]);
    templateObject.formsData.set(
        [
            {
                id: 6,
                name: "Aged Payables"
            },
            {
                id: 134,
                name: "Aged Receivables"
            },
            {
                id: 12,
                name: "Bills"
            },
            {
                id: 21,
                name: "Credits"
            },
            {
                id: 225,
                name: "General Ledger"
            },
            {
                id: 18,
                name: "Cheque"
            },
            // {
            //     id: 0,
            //     name: "Grouped Reports"
            // },
            {
                id: 61,
                name: "Customer Payments"
            },
            {
                id: 54,
                name: "Invoices"
            },
            {
                id: 177,
                name: "Print Statements"
            },
            {
                id: 1464,
                name: "Product Sales Report"
            },
            {
                id: 129,
                name: "Profit and Loss"
            },
            {
                id: 69,
                name: "Purchase Orders"
            },
            {
                id: 70,
                name: "Purchase Report"
            },
            {
                id: 1364,
                name: "Purchase Summary Report"
            },
            {
                id: 71,
                name: "Quotes"
            },
            {
                id: 74,
                name: "Refunds"
            },
            {
                id: 77,
                name: "Sakes Orders"
            },
            {
                id: 68,
                name: "Sales Report"
            },
            {
                id: 17544,
                name: "Statements"
            },
            {
                id: 94,
                name: "Supplier Payments"
            },
            {
                id: 278,
                name: "Tax Summary Report"
            },
            {
                id: 140,
                name: "Trial Balance"
            },
        ]
    );
});

Template.emailsettings.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let employeeScheduledRecord = [];
    let essentailEmployeeScheduledRecord = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'currencyLists', function (error, result) {
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
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    $("#date-input,#edtWeeklyStartDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtDailyStartDate,#edtOneTimeOnlyDate").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });
    templateObject.assignFrequency = function (frequency) {
        if (frequency == "Weekly") {
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

        if (frequency == "Daily") {
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

        if (frequency == "Monthly") {
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

    templateObject.getDayNumber = function (day) {
        day = day.toLowerCase();
        if (day == "") {
            return;
        }

        if (day == "monday") {
            return 1;
        }

        if (day == "tuesday") {
            return 2;
        }

        if (day == "wednesday") {
            return 3;
        }

        if (day == "thursday") {
            return 4;
        }

        if (day == "friday") {
            return 5;
        }

        if (day == "saturday") {
            return 6;
        }

        if (day == "sunday") {
            return 7;
        }

    }

    templateObject.getMonths = function (startDate, endDate) {
        let dateone = "";
        let datetwo = "";
        if (startDate != "") {
            dateone = moment(startDate).format('M');
        }

        if (endDate != "") {
            datetwo = parseInt(moment(endDate).format('M')) + 1;
        }

        if (dateone != "" && datetwo != "") {
            for (let x = dateone; x < datetwo; x++) {
                if (x == 1) {
                    $("#formCheck-january").prop('checked', true);
                }

                if (x == 2) {
                    $("#formCheck-february").prop('checked', true);
                }

                if (x == 3) {
                    $("#formCheck-march").prop('checked', true);
                }

                if (x == 4) {
                    $("#formCheck-april").prop('checked', true);
                }

                if (x == 5) {
                    $("#formCheck-may").prop('checked', true);
                }

                if (x == 6) {
                    $("#formCheck-june").prop('checked', true);
                }

                if (x == 7) {
                    $("#formCheck-july").prop('checked', true);
                }

                if (x == 8) {
                    $("#formCheck-august").prop('checked', true);
                }

                if (x == 9) {
                    $("#formCheck-september").prop('checked', true);
                }

                if (x == 10) {
                    $("#formCheck-october").prop('checked', true);
                }

                if (x == 11) {
                    $("#formCheck-november").prop('checked', true);
                }

                if (x == 12) {
                    $("#formCheck-december").prop('checked', true);
                }
            }
        }

        if (dateone == "") {
            $("#formCheck-january").prop('checked', true);
        }

    }





    templateObject.getDayName = function (day) {
        if (day == 1 || day == 0) {
            $("#formCheck-monday").prop('checked', true);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 2) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', true);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 3) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', true);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 4) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', true);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 5) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', true);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 6) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', true);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 7) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', true);
        }

    }
    templateObject.assignSettings = function (setting) {
        if (setting == "W") {
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyWeekly').trigger('click');
        }

        if (setting == "D") {
            $("#frequencyDaily").trigger('click');
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
        }

        if (setting == "M") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyMonthly').prop('checked', false);
        }

        if (setting == "T") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").trigger('click');
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyMonthly').prop('checked', false);
        }

        if (setting == "E") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").trigger('click');
            $('#frequencyMonthly').prop('checked', false);
        }

    }
    templateObject.getScheduleInfo = function () {
        taxRateService.getScheduleSettings().then(function (data) {
            console.log(data);
            let empData = data.treportschedules;
            var employeeID = Session.get('mySessionEmployeeLoggedID');
            var empDataCurr = '';
            $.grep(templateObject.formsData.get(), function (n) {
                for (let i = 0; i < empData.length; i++) {
                    if (n.id == empData[i].fields.FormID) {
                        empDataCurr = {
                            fromdate: empData[i].fields.BeginFromOption || '',
                            employeeid: empData[i].fields.EmployeeId || '',
                            endDate: empData[i].fields.EndDate.split(' ')[0] || '' || '',
                            every: empData[i].fields.Every || '',
                            formID: empData[i].fields.FormID || '',
                            formname: n.name || '',
                            employeeName: empData[i].fields.Employeename || '',
                            frequency: empData[i].fields.Frequency || '',
                            id: empData[i].fields.ID || '',
                            monthDays: empData[i].fields.MonthDays || '',
                            nextDueDate: empData[i].fields.NextDueDate || '',
                            satAction: empData[i].fields.SatAction || '',
                            startDate: empData[i].fields.StartDate.split(' ')[0] || '',
                            startTime: empData[i].fields.StartDate.split(' ')[1] || '',
                            sunAction: empData[i].fields.SunAction || '',
                            weekDay: empData[i].fields.WeekDay || '',
                            globalRef: empData[i].fields.GlobalRef || ''
                        };
                        if (employeeID == empData[i].fields.EmployeeId) {
                            employeeScheduledRecord.push(empDataCurr);
                        }
                    }
                }
                empDataCurr = {
                    fromdate: '',
                    employeeid: '',
                    endDate: '',
                    every: '',
                    formID: n.id || '',
                    formname: n.name || '',
                    frequency: '',
                    monthDays: '',
                    nextDueDate: '',
                    satAction: '',
                    startDate: '',
                    startTime: '',
                    sunAction: '',
                    weekDay: '',
                    global: ''
                }

                let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                if (!found) {
                    employeeScheduledRecord.push(empDataCurr);
                }

            });
            console.log(employeeScheduledRecord);
            $('.fullScreenSpin').css('display', 'none');
            templateObject.employeescheduledrecord.set(employeeScheduledRecord);

            if (templateObject.employeescheduledrecord.get()) {
                // setTimeout(function () {
                //     $('#tblAutomatedEmails').DataTable({
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [{
                //             extend: 'excelHtml5',
                //             text: '',
                //             download: 'open',
                //             className: "btntabletocsv hiddenColumn",
                //             filename: "taxratelist_" + moment().format(),
                //             orientation: 'portrait',
                //             exportOptions: {
                //                 columns: ':visible'
                //             }
                //         }, {
                //             extend: 'print',
                //             download: 'open',
                //             className: "btntabletopdf hiddenColumn",
                //             text: '',
                //             title: 'Tax Rate List',
                //             filename: "taxratelist_" + moment().format(),
                //             exportOptions: {
                //                 columns: ':visible'
                //             }
                //         }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         colReorder: {
                //             fixedColumnsRight: 1
                //         },
                //         lengthMenu: [
                //             [50, -1],
                //             [50, "All"]
                //         ],
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: true,
                //         info: true,
                //         responsive: true,
                //         "order": [
                //             [0, "asc"]
                //         ],
                //         action: function () {
                //             $('#currencyLists').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function (oSettings) {
                //             setTimeout(function () {
                //                 MakeNegative();
                //             }, 100);
                //         },

                //     }).on('page', function () {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.employeescheduledrecord.get();
                //         templateObject.employeescheduledrecord.set(draftRecord);
                //     }).on('column-reorder', function () {

                //     }).on('length.dt', function (e, settings, len) {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //     });

                //     // $('#currencyLists').DataTable().column( 0 ).visible( true );
                //     // $('.fullScreenSpin').css('display', 'none');
                // }, 500);
                // setTimeout(function () {
                //     $('#tblEssentialAutomatedEmails').DataTable({
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [{
                //             extend: 'excelHtml5',
                //             text: '',
                //             download: 'open',
                //             className: "btntabletocsv hiddenColumn",
                //             filename: "taxratelist_" + moment().format(),
                //             orientation: 'portrait',
                //             exportOptions: {
                //                 columns: ':visible'
                //             }
                //         }, {
                //             extend: 'print',
                //             download: 'open',
                //             className: "btntabletopdf hiddenColumn",
                //             text: '',
                //             title: 'Tax Rate List',
                //             filename: "taxratelist_" + moment().format(),
                //             exportOptions: {
                //                 columns: ':visible'
                //             }
                //         }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         colReorder: {
                //             fixedColumnsRight: 1
                //         },
                //         lengthMenu: [
                //             [50, -1],
                //             [50, "All"]
                //         ],
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: false,
                //         info: false,
                //         responsive: true,
                //         searching: false,
                //         "order": [
                //             [0, "asc"]
                //         ],
                //         action: function () {
                //             $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function (oSettings) {
                //             setTimeout(function () {
                //                 MakeNegative();
                //             }, 100);
                //         },

                //     }).on('page', function () {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.employeescheduledrecord.get();
                //         templateObject.employeescheduledrecord.set(draftRecord);
                //     }).on('column-reorder', function () {

                //     }).on('length.dt', function (e, settings, len) {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //     });

                //     // $('#currencyLists').DataTable().column( 0 ).visible( true );
                //     // $('.fullScreenSpin').css('display', 'none');
                // }, 500);
            }
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
                } else if (result.dismiss === 'cancel') { }
            });
            $('.fullScreenSpin').css('display', 'none');

        });
    }

    templateObject.getScheduleInfo();

    $('#tblContactlist tbody').on('click', 'td:not(.chkBox)', function () {
        //var tableCustomer = $(this);
        let selectDataID = $('#customerSelectLineID').val() || '';
        var listData = $(this).closest('tr').find('.colEmail').text() || "";
        $('#customerListModal').modal('toggle');

        $('#' + selectDataID).val(listData);
        //$('#'+selectLineID+" .lineAccountName").val('');
    });

    templateObject.saveSchedules = async function(settings) {
        return new Promise((resolve, reject) => {
            let i = 0;
            settings.each(async function() {
                i++;
                const formID = $(this).attr('data-id');
                console.log(formID);
                const frequencyEl = $(this).find('#edtFrequency');
                const sendEl = $(this).find('#edtBasedOn');
                const recipients = $(this).find('input.edtRecipients').val();
                const starttime = frequencyEl.attr('data-starttime');
                const startdate = frequencyEl.attr('data-startdate');
                const convertedStartDate = startdate ? startdate.split('/')[2] + '-' + startdate.split('/')[1] + '-' + startdate.split('/')[0] : '';
                const sDate = startdate ? moment( convertedStartDate + ' ' + starttime).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss");

                const frequencyName = frequencyEl.text();
                const oldSettings = templateObject.employeescheduledrecord.get();
                const oldSetting = oldSettings.filter((setting) => setting.formID === parseInt(formID));
                console.log(oldSetting);
                let objDetail = {
                    type: "TReportSchedules",
                    fields: {
                        Active: true,
                        ContinueIndefinitely: true,
                        EmployeeId: Session.get('mySessionEmployeeLoggedID'),
                        Every: 1,
                        FormID: parseInt(formID),
                        KeyStringFieldName: frequencyName,
                        KeyValue: recipients,
                        LastEmaileddate: "",
                        MonthDays: 0,
                        StartDate: sDate,
                        WeekDay: 0,
                    }
                };

                if (oldSetting[0].id) objDetail.fields.ID = oldSetting[0].id; // Confirm if this setting is inserted or updated
                
                if (frequencyName === "Monthly") {
                    const monthDate = frequencyEl.attr('data-monthdate') ? parseInt(frequencyEl.attr('data-monthdate').replace('day', '')) : 0;
                    const ofMonths = frequencyEl.attr('data-ofMonths');
                    objDetail.fields.KeyValue = ofMonths;
                    objDetail.fields.MonthDays = monthDate;
                } else if (frequencyName === "Weekly") {
                    const selectdays = frequencyEl.attr("data-selectdays");
                    const everyweeks = frequencyEl.attr("data-everyweeks");
                    objDetail.fields.KeyValue = selectdays;
                    if (everyweeks) objDetail.fields.Every = parseInt(everyweeks);
                } else if (frequencyName === "Daily") {
                    const dailyradiooption = frequencyEl.attr("data-dailyradiooption");
                    const everydays = frequencyEl.attr("data-everydays");
                    objDetail.fields.KeyValue = dailyradiooption;
                    if (everydays) objDetail.fields.Every = parseInt(everydays);
                } else if (frequencyName === "One Time Only") {
                } else if (frequencyName === "On Event") {
                    const eventType = frequencyEl.attr("data-eventtype");
                    objDetail.fields.KeyValue = eventType;
                } else {
                    objDetail.fields.Active = false;
                }

                const sendName = sendEl.text();
                const sendTime = sendEl.attr("data-time");
                objDetail.fields.MsUpdateSiteCode = sendName;
                if (sendTime) objDetail.fields.MsTimeStamp = sendTime;

                console.log(objDetail);
                try {
                    const saveResult = await taxRateService.saveScheduleSettings(objDetail);
                    console.log(saveResult);
                    $('.fullScreenSpin').css('display', 'none');
                } catch (e) {
                    console.log(e);
                    resolve(false);
                }
            });
            if (i === settings.length) resolve(true);
        });
    }
});

Template.emailsettings.events({
    'click .btnSelectContact': async function (event) {
        let templateObject = Template.instance();
        let selectDataID = $('#customerSelectLineID').val() || '';


        var tblContactService = $(".tblContactlist").dataTable();

        let datacontactList = [];
        $(".chkServiceCard:checked", tblContactService.fnGetNodes()).each(function () {
            let contactEmail = $(this).closest('tr').find('.colEmail').text() || '';
            if (contactEmail.replace(/\s/g, '') != '') {
                datacontactList.push(contactEmail);
            }
        });
        $('#' + selectDataID).val(datacontactList.join("; "));
        $('#customerListModal').modal('toggle');

        localStorage.setItem('emailsetting-recepients', JSON.stringify(datacontactList));
    },
    'click #swtAllCustomers': function () {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllCustomers').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden') )  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click #swtAllEmployees': function () {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllEmployees').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden'))  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click #swtAllSuppliers': function () {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllSuppliers').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden'))  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click .btnSaveFrequency': function () {
        // let taxRateService = new TaxRateService();
        // let templateObject = Template.instance();
        // let startTime = "";
        // let startDate = "";
        // let date = "";
        // let frequency = ""
        // let every = 0;
        // let monthDays = 0;
        // let weekDay = 0;
        // let id = $('#frequencyid').val() || '';
        // let employeeID = Session.get('mySessionEmployeeLoggedID');
        let formId = parseInt($("#formid").val());
        let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
        
        if (radioFrequency == "frequencyMonthly") {
            const monthDate = $("#sltDay").val();
            const ofMonths = '';
            let isFirst = true;
            $(".ofMonthList input[type=checkbox]:checked").each(function() {
                ofMonths += isFirst ? $(this).val() : ',' + $(this).val();
                isFirst = false;
            });
            console.log(ofMonths);
            const startTime = $('#edtMonthlyStartTime').val();
            const startDate = $('#edtMonthlyStartDate').val();

            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').html("Monthly");
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-monthDate', monthDate);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-ofMonths', ofMonths);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyWeekly") {
            const everyWeeks = $("#weeklyEveryXWeeks").val();
            const selectDays = $(".selectDays input[type=checkbox]:checked").val();
            console.log(selectDays);
            const startTime = $('#edtWeeklyStartTime').val();
            const startDate = $('#edtWeeklyStartDate').val();
            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-selectDays', selectDays);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everyWeeks', everyWeeks);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').html("Weekly");
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyDaily") {
            const dailyRadioOption = $('#dailySettings input[type=radio]:checked').attr('id');
            const everyDays = $("#dailyEveryXDays").val();
            const startTime = $('#edtDailyStartTime').val();
            const startDate = $('#edtDailyStartDate').val();
            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').html("Daily");
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-dailyRadioOption', dailyRadioOption);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everydays', everyDays);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyOnetimeonly") {
            const startTime = $('#edtOneTimeOnlyTime').val();
            const startDate = $('#edtOneTimeOnlyDate').val();
            if (startDate && startTime) {
                $('#edtOneTimeOnlyTimeError').css('display', 'none');
                $('#edtOneTimeOnlyDateError').css('display', 'none');
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').html("One Time Only");
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else {
                $('#edtOneTimeOnlyTimeError').css('display', 'block');
                $('#edtOneTimeOnlyDateError').css('display', 'block');
            }
        } else if (radioFrequency == "frequencyOnevent") {
            const eventType = $("#onEventSettings input[type=radio]:checked").attr("id");
            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').html("On Event");
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-eventtype', eventType);
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else {
            $("#frequencyModal").modal('toggle');
        }

        // var startdateTimeMonthly = new Date($("#edtMonthlyStartDate").datepicker("getDate"));
        // var startdateTimeWeekly = new Date($("#edtWeeklyStartDate").datepicker("getDate"));
        // var startdateTimeDaily = new Date($("#edtDailyStartDate").datepicker("getDate"));
        // var startdateTimeOneTime = new Date($("#edtOneTimeOnlyDate").datepicker("getDate"));

        // if ($('#frequencyMonthly').is(":checked")) {
        //     startTime = $('#edtMonthlyStartTime').val();
        //     startDate = startdateTimeMonthly.getFullYear() + "-" + (startdateTimeMonthly.getMonth() + 1) + "-" + startdateTimeMonthly.getDate() || '';
        //     every = $('#sltDayOccurence').val();
        //     frequency = "M";
        //     monthDays = $('#sltDayOfWeek').val();
        //     date = startDate + ' ' + startTime;
        // }


        // if ($('#frequencyWeekly').is(":checked")) {
        //     startTime = $('#edtWeeklyStartTime').val();
        //     startDate = startdateTimeWeekly.getFullYear() + "-" + (startdateTimeWeekly.getMonth() + 1) + "-" + startdateTimeWeekly.getDate() || '';
        //     every = $('#weeklyEveryXWeeks').val();
        //     frequency = "W";
        //     date = startDate + ' ' + startTime;

        //     var checkboxes = document.querySelectorAll('.chkBoxDays');
        //     checkboxes.forEach((item) => {
        //         if (item.checked) {
        //             weekDay = templateObject.getDayNumber(item.value);
        //         }
        //     });
        // }

        // if ($('#frequencyDaily').is(":checked")) {
        //     startTime = $('#edtDailyStartTime').val();
        //     startDate = startdateTimeDaily.getFullYear() + "-" + (startdateTimeDaily.getMonth() + 1) + "-" + startdateTimeDaily.getDate() || '';
        //     every = $('#dailyEveryXDays').val() || 1;
        //     frequency = "D";
        //     date = startDate + ' ' + startTime;
        // }

        // if ($('#frequencyOnetimeonly').is(":checked")) {
        //     startTime = $('#edtOneTimeOnlyTime').val();
        //     startDate = startdateTimeOneTime.getFullYear() + "-" + (startdateTimeOneTime.getMonth() + 1) + "-" + startdateTimeOneTime.getDate() || '';
        //     every = 1;
        //     frequency = "D";
        //     date = startDate + ' ' + startTime;
        // }

        // if (id == "") {
        //     objDetails = {
        //         type: "TReportSchedules",
        //         fields: {
        //             EmployeeId: employeeID,
        //             StartDate: date,
        //             Every: parseInt(every) || 0,
        //             Frequency: frequency,
        //             FormID: formId,
        //             MonthDays: monthDays,
        //             //NextDueDate: "2022-02-15 00:00:00",
        //             // SatAction: "D",
        //             //StartDate: date,
        //             // SunAction: "A",
        //             WeekDay: weekDay,
        //         }
        //     };
        // } else {
        //     objDetails = {
        //         type: "TReportSchedules",
        //         fields: {
        //             ID: parseInt(id) || 0,
        //             EmployeeId: employeeID,
        //             StartDate: date,
        //             Every: parseInt(every) || 0,
        //             Frequency: frequency,
        //             FormID: formId,
        //             MonthDays: monthDays,
        //             //NextDueDate: "2022-02-15 00:00:00",
        //             // SatAction: "D",
        //             //StartDate: date,
        //             // SunAction: "A",
        //             WeekDay: weekDay,
        //         }
        //     };

        // }

        // localStorage.setItem('emailsetting-frequency', JSON.stringify(objDetails));

        // taxRateService.saveScheduleSettings(objDetails).then(function (data) {
        //     // Meteor._reload.reload();    // No reload required here after save frequency.
        //     $('#frequencyModal').modal('toggle');
        //     $('.fullScreenSpin').css('display', 'none');
        // }).catch(function (err) {
        //     swal({
        //         title: 'Oooops...',
        //         text: err,
        //         type: 'error',
        //         showCancelButton: false,
        //         confirmButtonText: 'Try Again'
        //     }).then((result) => {
        //         if (result.value) {
        //             // Meteor._reload.reload();    // No reload required here after save frequency.
        //         } else if (result.dismiss === 'cancel') { }
        //     });
        //     $('.fullScreenSpin').css('display', 'none');
        // });
    },
    'click .dnd-moved': (e) => {
        localStorage.setItem('transactiontype', e.currentTarget.getAttribute('id'));
    },
    'click #emailsetting-essential': async function () {
        const templateObject = Template.instance();
        const essentialSettings = $('#tblEssentialAutomatedEmails tbody tr');
        $('.fullScreenSpin').css('display', 'inline-block');

        const saveResult = await templateObject.saveSchedules(essentialSettings);

        if (saveResult)
            swal({
                title: 'Success',
                text: "Automated Email Settings (Essentials) were scheduled successfully",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        else 
            swal({
                title: 'Oooops...',
                text: e,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        $('.fullScreenSpin').css('display', 'none');

        // if (id == "") {
        //     objDetails = {
        //         type: "TReportSchedules",
        //         fields: {
        //             EmployeeId: employeeID,
        //             StartDate: date,
        //             Every: parseInt(every) || 0,
        //             Frequency: frequency,
        //             FormID: formId,
        //             MonthDays: monthDays,
        //             //NextDueDate: "2022-02-15 00:00:00",
        //             // SatAction: "D",
        //             //StartDate: date,
        //             // SunAction: "A",
        //             WeekDay: weekDay,
        //         }
        //     };
        // } else {
        //     objDetails = {
        //         type: "TReportSchedules",
        //         fields: {
        //             ID: parseInt(id) || 0,
        //             EmployeeId: employeeID,
        //             StartDate: date,
        //             Every: parseInt(every) || 0,
        //             Frequency: frequency,
        //             FormID: formId,
        //             MonthDays: monthDays,
        //             //NextDueDate: "2022-02-15 00:00:00",
        //             // SatAction: "D",
        //             //StartDate: date,
        //             // SunAction: "A",
        //             WeekDay: weekDay,
        //         }
        //     };

        // }

        // localStorage.setItem('emailsetting-frequency', JSON.stringify(objDetails));

        // taxRateService.saveScheduleSettings(objDetails).then(function (data) {
        //     // Meteor._reload.reload();    // No reload required here after save frequency.
        //     $('#frequencyModal').modal('toggle');
        //     $('.fullScreenSpin').css('display', 'none');
        // }).catch(function (err) {
        //     swal({
        //         title: 'Oooops...',
        //         text: err,
        //         type: 'error',
        //         showCancelButton: false,
        //         confirmButtonText: 'Try Again'
        //     }).then((result) => {
        //         if (result.value) {
        //             // Meteor._reload.reload();    // No reload required here after save frequency.
        //         } else if (result.dismiss === 'cancel') { }
        //     });
        //     $('.fullScreenSpin').css('display', 'none');
        // });

        // let tempContainer = [];
        // Meteor.call('readAllEmailSettings', (error, result) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         result.forEach(elem => (tempContainer.push(elem)));
        //         console.log(tempContainer);
        //     }
        // });
        // let taxRateService = new TaxRateService();
        // taxRateService.getScheduleSettings().then(function (data) {
        //     let empData = data.treportschedules;
        //     console.log(empData);
        // })
        // This is for test. Not required
        // Meteor.call('deleteAllEmailSettings', (error, result) => {

        // });

    },
    'click .chkBoxDays': function (event) {
        var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item !== event.target) {
                item.checked = false
            }
        });
    },
    'click #edtFrequency': function (event) {
        let templateObject = Template.instance();
        let scheduleData = templateObject.employeescheduledrecord.get();
        let formId = $(event.target).closest("tr").attr("data-id");


        $("#formid").val(formId);
        // var result = scheduleData.filter(data => {
        //     return data.formID == formId
        // });
        // if (result.length > 0) {
        //     let startDateVal = result[0].startDate != '' ? moment(result[0].startDate).format("DD/MM/YYYY") : result[0].startDate;
        //     templateObject.assignFrequency(result[0].frequency);
        //     templateObject.getMonths(result[0].startDate, result[0].endDate);
        //     $('#frequencyid').val(result[0].id);
        //     if (result[0].frequency == "Monthly") {
        //         $('#sltDayOccurence').val(result[0].every);
        //         $('#sltDayOfWeek').val(result[0].monthDays);
        //         $('#edtMonthlyStartTime').val(result[0].startTime);
        //         $('#edtMonthlyStartDate').val(startDateVal);
        //         $('#edtFrequency').text("Monthly");
        //     }

        //     if (result[0].frequency == "Weekly") {
        //         setTimeout(function () {
        //             $('#weeklyEveryXWeeks').val(result[0].every);
        //             $('#edtWeeklyStartTime').val(result[0].startTime);
        //             $('#edtWeeklyStartDate').val(startDateVal);
        //             templateObject.getDayName(result[0].weekDay);
        //             $('#edtFrequency').text("Weekly");
        //         }, 500);
        //     }

        //     if (result[0].frequency == "Daily") {
        //         setTimeout(function () {
        //             $('#dailyEveryXDays').val(result[0].every);
        //             $('#edtDailyStartTime').val(result[0].startTime);
        //             $('#edtDailyStartDate').val(startDateVal);
        //             $('#edtFrequency').text("Daily");
        //         }, 500);
        //     }
        // }

        $("#frequencyModal").modal('toggle');
    },
    'click #blncSheets #edtFrequency': function () {
        $("#frequencyModal").modal('toggle');

    },
    'click .edtRecipients': function () {
        let recipientsID = event.target.id || '';
        $('#customerSelectLineID').val(recipientsID);
        $("#customerListModal").modal('toggle');

    },
    'click #groupedReports': function () {
        $("#groupedReportsModal").modal('toggle');

    },
    'click input[name="frequencyRadio"]': function () {
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
    'click input[name="settingsMonthlyRadio"]': function () {
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
    'click input[name="dailyRadio"]': function () {
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
    'click #edtBasedOn': function () {
        localStorage.setItem('selected_editBasedOn_id', event.target.closest('tr').dataset.id);
        $("#basedOnModal").modal('toggle');
    },
    'click input[name="basedOnRadio"]': function () {
        if (event.target.id == "basedOnPrint") {
            $('#edtBasedOnDate').attr('disabled', true);
            $('#edtBasedOnDate').attr('required', false);
        } else if (event.target.id == "basedOnSave") {
            $('#edtBasedOnDate').attr('disabled', true);
            $('#edtBasedOnDate').attr('required', false);
        } else if (event.target.id == "basedOnTransactionDate") {
            $('#edtBasedOnDate').attr('disabled', true);
            $('#edtBasedOnDate').attr('required', false);
        } else if (event.target.id == "basedOnDueDate") {
            $('#edtBasedOnDate').attr('disabled', true);
            $('#edtBasedOnDate').attr('required', false);
        } else if (event.target.id == "basedOnDate") {
            $('#edtBasedOnDate').attr('disabled', false);
            $('#edtBasedOnDate').attr('required', true);
        } else if (event.target.id == "basedOnOutstanding") {
            $('#edtBasedOnDate').attr('disabled', true);
            $('#edtBasedOnDate').attr('required', false);
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnSaveBasedOn': function () {
        event.preventDefault();
        let radioBasedOn = $('input[type=radio][name=basedOnRadio]:checked').attr('id');
        const selectedBasedOnId = localStorage.getItem('selected_editBasedOn_id');

        if (radioBasedOn == "basedOnPrint") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Print");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnSave") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Save");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnTransactionDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Transaction Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDueDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Due Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDate") {
            const dateValue = $('#edtBasedOnDate').val();
            if (dateValue) {
                $('#edtBasedOnDateRequiredText').css('display', 'none');
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Date");
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr("data-time", dateValue);
                    $("#basedOnModal").modal('toggle');
                }, 100);
            } else {
                $('#edtBasedOnDateRequiredText').css('display', 'block');
            }
        } else if (radioBasedOn == "basedOnOutstanding") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("If Outstanding");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else {
            $("#basedOnModal").modal('toggle');
        }

        localStorage.setItem('emailsetting-send', radioBasedOn);
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    }
});

Template.emailsettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
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
    reportTypeData: () => {
        return Template.instance().formsData.get();
    },
    checkIfEssentials: (typeId) => {
        return typeId == 0 || typeId == 54 || typeId == 129 || typeId == 177;
    }
});
