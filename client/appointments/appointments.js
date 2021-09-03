import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from "../product/product-service";
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import 'jquery-ui-dist/external/jquery/jquery';
import { SalesBoardService } from '../js/sales-service';
import { AppointmentService } from './appointment-service';
//Calendar
import { Calendar, formatDate } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.appointments.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.appointmentrecords = new ReactiveVar([]);
    templateObject.eventdata = new ReactiveVar([]);
    templateObject.resourceAllocation = new ReactiveVar([]);
    templateObject.resourceJobs = new ReactiveVar([]);
    templateObject.resourceDates = new ReactiveVar([]);
    templateObject.weeksOfMonth = new ReactiveVar([]);
    templateObject.checkEmployee = new ReactiveVar([]);
    templateObject.calendarOptions = new ReactiveVar([]);
    templateObject.globalSettings = new ReactiveVar([]);
    templateObject.employeeOptions = new ReactiveVar([]);
    templateObject.repeatDays = new ReactiveVar([]);
    templateObject.checkRefresh = new ReactiveVar;
    templateObject.empDuration = new ReactiveVar;
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.uploadedFile = new ReactiveVar();
    //templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.checkRefresh.set(false);
    templateObject.empID = new ReactiveVar;
    let dayObj = {
        saturday: 0,
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0
    };
    templateObject.repeatDays.set(dayObj)

});

Template.appointments.onRendered(function () {
    let seeOwnAppointments = Session.get('CloudAppointmentSeeOwnAppointmentsOnly') || false;
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    let clientsService = new SalesBoardService();
    let appointmentService = new AppointmentService();
    let productList = [];
    const clientList = [];
    let eventData = [];
    let resourceChat = [];
    let resourceJob = [];
    let appointmentList = [];
    let allEmployees = [];
    let updateCalendarData = [];
    let calendarSettings = [];
    let prefObject = {};
    let globalSet = {};
    let launchAllocations = Session.get('CloudAppointmentAllocationLaunch');
    let currentId = FlowRouter.current().context.hash;
    if ((currentId === "allocationModal")) {
        setTimeout(function () {
            $('#allocationModal').modal('show');
        }, 500);

    } else if (launchAllocations == true) {
        setTimeout(function () {
            $('#allocationModal').modal('show');
        }, 500);
    }

    getVS1Data('TERPPreference').then(function (dataObject) {
        if (dataObject.length == 0) {
            appointmentService.getGlobalSettings().then(function (data) {
                templateObject.getAllAppointmentListData();
                appEndTimeDataToLoad = '19:00';
                globalSet.defaultProduct = "";
                globalSet.id = "";
                for (let g = 0; g < data.terppreference.length; g++) {
                    if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                        if (data.terppreference[g].Fieldvalue == "F") {
                            globalSet.showSun = false;
                        } else if (data.terppreference[g].Fieldvalue == "T") {
                            globalSet.showSun = true;
                        } else {
                            globalSet.showSun = false;
                        }
                    } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                        if (data.terppreference[g].Fieldvalue == "F") {
                            globalSet.showSat = false;
                        } else if (data.terppreference[g].Fieldvalue == "T") {
                            globalSet.showSat = true;
                        } else {
                            globalSet.showSat = false;
                        }

                    } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                        globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
                    } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                        if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                            globalSet.apptEndTime = "17:00";
                            let timeSplit = globalSet.apptEndTime.split(':');
                            let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                            let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                            globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                        } else {
                            globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                            let timeSplit = globalSet.apptEndTime.split(':');
                            let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                            let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                            globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                            globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                        }
                    } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                        if (data.terppreference[g].Fieldvalue == "120") {
                            globalSet.DefaultApptDuration = 2;
                        } else {
                            globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                        }
                    } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                        globalSet.productID = data.terppreference[g].Fieldvalue;
                    } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                        if (data.terppreference[g].Fieldvalue == "60") {
                            globalSet.showApptDurationin = 1;
                        } else {
                            globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                        }

                    } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                        globalSet.chargeTime = data.terppreference[g].Fieldvalue;
                    } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                        globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                    } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                        globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                    }
                }

                $("#showSaturday").prop('checked', globalSet.showSat);
                $("#showSunday").prop('checked', globalSet.showSun);
                if (globalSet.showSat === false) {
                    hideSat = "hidesaturday";
                }

                if (globalSet.showSun === false) {
                    hideSun = "hidesunday";
                }

                if (globalSet.chargeTime) {
                    $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
                }

                if (globalSet.showApptDurationin) {
                    $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
                }

                if (globalSet.DefaultApptDuration) {
                    $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
                }

                if (globalSet.apptStartTime) {
                    $('#hoursFrom').val(globalSet.apptStartTime);
                }

                if (globalSet.apptEndTime) {
                    $('#hoursTo').val(globalSet.apptEndTime);
                }
                templateObject.globalSettings.set(globalSet);

                if (globalSet.productID != "") {
                    appointmentService.getGlobalSettingsExtra().then(function (data) {
                        for (let p = 0; p < data.terppreferenceextra.length; p++) {
                            if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                            }

                            $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                            $("#productlist")[0].options[0].selected = true;
                        }
                        templateObject.globalSettings.set(globalSet);
                    })
                } else {
                    globalSet.defaultProduct = "";
                    globalSet.id = "";
                }
            }).catch(function (err) {});
        } else {
            let data = JSON.parse(dataObject[0].data);
            templateObject.getAllAppointmentListData();
            appEndTimeDataToLoad = '19:00';
            globalSet.defaultProduct = "";
            globalSet.id = "";
            for (let g = 0; g < data.terppreference.length; g++) {
                if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSun = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSun = true;
                    } else {
                        globalSet.showSun = false;
                    }
                } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSat = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSat = true;
                    } else {
                        globalSet.showSat = false;
                    }

                } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                    globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
                } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                    if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                        globalSet.apptEndTime = "17:00";
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                    } else {
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                    }
                } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                    if (data.terppreference[g].Fieldvalue == "120") {
                        globalSet.DefaultApptDuration = 2;
                    } else {
                        globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                    }
                } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                    globalSet.productID = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                    if (data.terppreference[g].Fieldvalue == "60") {
                        globalSet.showApptDurationin = 1;
                    } else {
                        globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                    }

                } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                    globalSet.chargeTime = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                }
            }

            $("#showSaturday").prop('checked', globalSet.showSat);
            $("#showSunday").prop('checked', globalSet.showSun);
            if (globalSet.showSat === false) {
                hideSat = "hidesaturday";
            }

            if (globalSet.showSun === false) {
                hideSun = "hidesunday";
            }

            if (globalSet.chargeTime) {
                $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
            }

            if (globalSet.showApptDurationin) {
                $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
            }

            if (globalSet.DefaultApptDuration) {
                $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
            }

            if (globalSet.apptStartTime) {
                $('#hoursFrom').val(globalSet.apptStartTime);
            }

            if (globalSet.apptEndTime) {
                $('#hoursTo').val(globalSet.apptEndTime);
            }
            templateObject.globalSettings.set(globalSet);

            if (globalSet.productID != "") {
                getVS1Data('TERPPreferenceExtra').then(function (dataObjectExtra) {
                    if (dataObjectExtra.length == 0) {
                        appointmentService.getGlobalSettingsExtra().then(function (data) {
                            for (let p = 0; p < data.terppreferenceextra.length; p++) {
                                if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                    globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                                }

                                $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                                $("#productlist")[0].options[0].selected = true;
                            }
                            templateObject.globalSettings.set(globalSet);
                        })
                    } else {
                        let dataExtra = JSON.parse(dataObjectExtra[0].data);
                        for (let p = 0; p < dataExtra.terppreferenceextra.length; p++) {
                            if (dataExtra.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                globalSet.defaultProduct = dataExtra.terppreferenceextra[p].fieldValue
                            }

                            $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                            $("#productlist")[0].options[0].selected = true;
                        }
                        templateObject.globalSettings.set(globalSet);
                    }

                }).catch(function (err) {

                    appointmentService.getGlobalSettingsExtra().then(function (data) {
                        for (let p = 0; p < data.terppreferenceextra.length; p++) {
                            if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                            }

                            $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                            $("#productlist")[0].options[0].selected = true;
                        }
                        templateObject.globalSettings.set(globalSet);
                    })

                })
            } else {
                globalSet.defaultProduct = "";
                globalSet.id = "";
            }
        }

    }).catch(function (err) {
        appointmentService.getGlobalSettings().then(function (data) {
            templateObject.getAllAppointmentListData();
            appEndTimeDataToLoad = '19:00';
            globalSet.defaultProduct = "";
            globalSet.id = "";
            for (let g = 0; g < data.terppreference.length; g++) {
                if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSun = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSun = true;
                    } else {
                        globalSet.showSun = false;
                    }
                } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSat = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSat = true;
                    } else {
                        globalSet.showSat = false;
                    }

                } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                    globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
                } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                    if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                        globalSet.apptEndTime = "17:00";
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                    } else {
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                    }
                } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                    if (data.terppreference[g].Fieldvalue == "120") {
                        globalSet.DefaultApptDuration = 2;
                    } else {
                        globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                    }
                } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                    globalSet.productID = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                    if (data.terppreference[g].Fieldvalue == "60") {
                        globalSet.showApptDurationin = 1;
                    } else {
                        globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                    }

                } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                    globalSet.chargeTime = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                }
            }

            $("#showSaturday").prop('checked', globalSet.showSat);
            $("#showSunday").prop('checked', globalSet.showSun);
            if (globalSet.showSat === false) {
                hideSat = "hidesaturday";
            }

            if (globalSet.showSun === false) {
                hideSun = "hidesunday";
            }

            if (globalSet.chargeTime) {
                $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
            }

            if (globalSet.showApptDurationin) {
                $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
            }

            if (globalSet.DefaultApptDuration) {
                $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
            }

            if (globalSet.apptStartTime) {
                $('#hoursFrom').val(globalSet.apptStartTime);
            }

            if (globalSet.apptEndTime) {
                $('#hoursTo').val(globalSet.apptEndTime);
            }
            templateObject.globalSettings.set(globalSet);

            if (globalSet.productID != "") {
                appointmentService.getGlobalSettingsExtra().then(function (data) {
                    for (let p = 0; p < data.terppreferenceextra.length; p++) {
                        if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                        }

                        $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                })
            } else {
                globalSet.defaultProduct = "";
                globalSet.id = "";
            }
        }).catch(function (err) {});

    });
    $('.fullScreenSpin').css('display', 'inline-block');

    templateObject.renderCalendar = function (slotMin, slotMax, hideDays) {
        let calendarSet = templateObject.globalSettings.get();
        var calendarEl = document.getElementById('calendar');
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("YYYY-MM-DD");
        var calendar = new Calendar(calendarEl, {
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
            themeSystem: 'bootstrap',
            initialView: 'timeGridWeek',
            hiddenDays: hideDays, // hide Sunday and Saturday
            longPressDelay: 100,
            customButtons: {
                appointments: {
                    text: 'Appointment List',
                    click: function () {
                        //window.open('/appointmentlist', '_self');
                        FlowRouter.go('/appointmentlist');
                    }
                },
                allocation: {
                    text: 'Allocations',
                    click: function () {
                        $('#allocationModal').modal();
                    }
                }
            },
            headerToolbar: {
                left: 'prev,next today appointments allocation',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotMinTime: slotMin,
            slotMaxTime: slotMax,
            initialDate: begunDate,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            dayHeaderFormat: function (date) {
                if (LoggedCountry == "United States") {
                    return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                } else {
                    return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                }

            },
            select: function (info) {
                $('#frmAppointment')[0].reset();
                templateObject.getAllProductData();
                $(".paused").hide();
                let dateStart = new Date(info.start);
                $(".paused").hide();
                let dateEnd = new Date(info.end);
                let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                dateEnd.setHours(dateEnd.getHours() + calendarSet.DefaultApptDuration || "02:00");
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                document.getElementById("dtSODate").value = startDate;
                document.getElementById("dtSODate2").value = endDate;
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
                document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                if (calendarSet.DefaultApptDuration) {
                    document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                } else {
                    document.getElementById("txtBookedHoursSpent").value = templateObject.diff_hours(dateStart, dateEnd);
                }
                templateObject.attachmentCount.set('');
                templateObject.uploadedFiles.set('');
                templateObject.uploadedFile.set('')
                $('#customerListModal').modal();
            },
            eventClick: function (info) {
                $('#frmAppointment')[0].reset();
                $("#btnHold").prop("disabled", false);
                $("#btnStartActualTime").prop("disabled", false);
                $("#btnEndActualTime").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                let googleLink = "";
                var hours = '0';
                var id = info.event.id;
                var appointmentData = templateObject.appointmentrecords.get();

                var result = appointmentData.filter(apmt => {
                    return apmt.id == id
                });
                if (result.length > 0) {
                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartActualTime").prop("disabled", true);
                        $("#btnEndActualTime").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartActualTime").prop("disabled", true);
                        $("#btnEndActualTime").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    templateObject.getAllProductData();
                    if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                        var startTime = moment(result[0].aStartDate + ' ' + result[0].aStartTime);
                        var endTime = moment(result[0].aEndDate + ' ' + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }
                    document.getElementById("aStartDate").value = result[0].aStartDate || '';
                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                    document.getElementById("state").value = result[0].state;
                    document.getElementById("address").value = result[0].street;
                    if (Session.get('CloudAppointmentNotes') == true) {
                        document.getElementById("txtNotes").value = result[0].notes;
                    }
                    document.getElementById("suburb").value = result[0].suburb;
                    document.getElementById("zip").value = result[0].zip;
                    document.getElementById("country").value = result[0].country;
                    if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                        googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                        $("#googleLink").attr("href", googleLink).attr('target', '_blank');
                    }

                    if (result[0].product.replace(/\s/g, '') != "") {
                        $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                    } else {
                        $('#product-list').prop('selectedIndex', -1);
                    }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';
                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    } else {
                        templateObject.attachmentCount.set('');
                        templateObject.uploadedFiles.set('');
                        templateObject.uploadedFile.set('')
                    }
                    $('#event-modal').modal();
                    // this.$body.addClass('modal-open');
                }
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dayMaxEvents: true, // allow "more" link when too many events
            //Triggers modal once event is moved to another date within the calendar.
            eventDrop: function (info) {
                if (info.event._def.publicId != "") {
                    let appointmentData = templateObject.appointmentrecords.get();
                    let resourceData = templateObject.resourceAllocation.get();
                    let eventDropID = info.event._def.publicId || '0';
                    let dateStart = new Date(info.event.start);
                    let dateEnd = new Date(info.event.end);
                    let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                    let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                    let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                    let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                    let index = appointmentData.map(function (e) {
                        return e.id;
                    }).indexOf(parseInt(eventDropID));
                    let resourceIndex = resourceData.map(function (e) {
                        return e.employeeName;
                    }).indexOf(appointmentData[index].employeename);
                    var result = appointmentData.filter(apmt => {
                        return apmt.id == eventDropID
                    });
                    if (result.length > 0) {
                        objectData = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(eventDropID) || 0,
                                StartTime: startDate + ' ' + startTime + ":00" || '',
                                EndTime: endDate + ' ' + endTime + ":00" || '',
                            }
                        }
                        let nameid = appointmentData[index].employeename.replace(' ', '-');

                        $('#allocationTable tbody tr').each(function () {
                            if (this.id == appointmentData[index].employeename) {
                                $(this).attr('id', $('#allocationTable tbody tr').attr('id').replace(' ', '-'));
                            }
                        });
                        let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';
                        let day = moment(startDate).format('dddd').toLowerCase();
                        appointmentService.saveAppointment(objectData).then(function (data) {
                            appointmentData[index].startDate = startDate + ' ' + startTime;
                            appointmentData[index].endDate = endDate + ' ' + endTime;
                            templateObject.appointmentrecords.set(appointmentData);
                            $('.droppable #' + eventDropID).remove();
                            $('#' + nameid + ' .' + day + ' .droppable').append(job);
                            $('#allocationTable tbody tr').each(function () {
                                if (this.id == nameid) {
                                    $(this).attr('id', $('#allocationTable tbody tr').attr('id').replace('-', ' '));
                                }
                            })
                            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataUpdate) {
                                addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {}).catch(function (err) {});
                            }).catch(function (err) {
                                //window.open('/appointments', '_self');
                            });
                        }).catch(function (err) {
                            //window.open('/appointments', '_self');
                        });
                    }
                }

            },
            //Triggers modal once external object is dropped to calender.
            drop: function (event) {
                let draggedEmployeeID = templateObject.empID.get();
                let calendarData = templateObject.employeeOptions.get();
                let calendarSet = templateObject.globalSettings.get();
                let employees = templateObject.employeerecords.get();
                let overridesettings = employees.filter(employeeData => {
                    return employeeData.id == parseInt(draggedEmployeeID)
                });

                let empData = calendarData.filter(calendarOpt => {
                    return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                });
                document.getElementById("frmAppointment").reset();
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                $("#btnStartActualTime").prop("disabled", false);
                $("#btnEndActualTime").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, '');
                var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                document.getElementById("dtSODate").value = start;
                document.getElementById("dtSODate2").value = start
                    var startTime = moment(event.dateStr).format("HH:mm");
                document.getElementById("startTime").value = startTime;
                if (overridesettings[0].override == "false") {
                    if (calendarSet.DefaultApptDuration) {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(calendarSet.DefaultApptDuration), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }
                    $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                    $("#product-list")[0].options[0].selected = true;
                } else if (overridesettings[0].override == "true") {
                    if (templateObject.empDuration.get() != "") {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }
                    if (empData.length > 0) {
                        $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    } else {
                        $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    }
                } else {
                    if (templateObject.empDuration.get() != "") {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }

                    if (empData.length > 0) {
                        $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    } else {
                        $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    }

                }
                templateObject.attachmentCount.set('');
                templateObject.uploadedFiles.set('')
                templateObject.uploadedFile.set('')

                var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                $('#customerListModal').modal();
            },

            events: templateObject.eventdata.get(),
            eventDidMount: function (info) {},
            eventContent: function (event) {
                let title = document.createElement('p');
                if (event.event.title) {
                    title.innerHTML = event.timeText + ' ' + event.event.title;
                    title.style.backgroundColor = event.backgroundColor;
                    title.style.color = "#ffffff";
                } else {
                    title.innerHTML = event.timeText + ' ' + event.event.title;
                }

                let arrayOfDomNodes = [title]
                return {
                    domNodes: arrayOfDomNodes
                }
            }

        });
        calendar.render();
    }

    templateObject.renderNormalCalendar = function () {
        let calendarSet = templateObject.globalSettings.get();
        let hideDays = '';
        let slotMin = "06:00:00";
        let slotMax = "21:00:00";
        if (calendarSet.showSat == false) {
            hideDays = [6];
        }

        if (calendarSet.apptStartTime) {
            slotMin = calendarSet.apptStartTime;
        }

        if (calendarSet.apptEndTime) {
            slotMax = calendarSet.apptEndTimeCal;
        }

        if (calendarSet.showSun == false) {
            hideDays = [0];
        }

        if (calendarSet.showSat == false && calendarSet.showSun == false) {
            hideDays = [0, 6];
        }

        var calendarEl = document.getElementById('calendar');
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("YYYY-MM-DD");
        var calendar = new Calendar(calendarEl, {
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
            themeSystem: 'bootstrap',
            initialView: 'timeGridWeek',
            hiddenDays: hideDays, // hide Sunday and Saturday
            longPressDelay: 100,
            customButtons: {
                appointments: {
                    text: 'Appointment List',
                    click: function () {
                        //window.open('/appointmentlist', '_self');
                        FlowRouter.go('/appointmentlist');
                    }
                },
                allocation: {
                    text: 'Allocations',
                    click: function () {
                        $('#allocationModal').modal();
                    }
                }
            },
            headerToolbar: {
                left: 'prev,next today appointments allocation',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotMinTime: slotMin,
            slotMaxTime: slotMax,
            initialDate: begunDate,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            dayHeaderFormat: function (date) {
                if (LoggedCountry == "United States") {
                    return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                } else {
                    return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                }

            },
            select: function (info) {
                $('#frmAppointment')[0].reset();
                $(".paused").hide();
                templateObject.getAllProductData();
                let dateStart = new Date(info.start);
                let dateEnd = new Date(info.end);
                let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                dateEnd.setHours(dateEnd.getHours() + calendarSet.DefaultApptDuration || "02:00");
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                document.getElementById("dtSODate").value = startDate;
                document.getElementById("dtSODate2").value = endDate;
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
                document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                if (calendarSet.DefaultApptDuration) {
                    document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                } else {
                    document.getElementById("txtBookedHoursSpent").value = templateObject.diff_hours(dateStart, dateEnd);
                }
                templateObject.attachmentCount.set('');
                templateObject.uploadedFiles.set('');
                templateObject.uploadedFile.set('')
                $('#customerListModal').modal();
            },
            eventClick: function (info) {
                $('#frmAppointment')[0].reset();
                $("#btnHold").prop("disabled", false);
                $("#btnStartActualTime").prop("disabled", false);
                $("#btnEndActualTime").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                let googleLink = "";
                var hours = '0';
                var id = info.event.id;
                var appointmentData = templateObject.appointmentrecords.get();

                var result = appointmentData.filter(apmt => {
                    return apmt.id == id
                });

                if (result.length > 0) {
                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartActualTime").prop("disabled", true);
                        $("#btnEndActualTime").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartActualTime").prop("disabled", true);
                        $("#btnEndActualTime").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    templateObject.getAllProductData();
                    if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                        var startTime = moment(result[0].aStartDate + ' ' + result[0].aStartTime);
                        var endTime = moment(result[0].aEndDate + ' ' + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }

                    document.getElementById("aStartDate").value = result[0].aStartDate || '';
                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                    document.getElementById("state").value = result[0].state;
                    document.getElementById("address").value = result[0].street;
                    if (Session.get('CloudAppointmentNotes') == true) {
                        document.getElementById("txtNotes").value = result[0].notes;
                    }
                    document.getElementById("suburb").value = result[0].suburb;
                    document.getElementById("zip").value = result[0].zip;
                    document.getElementById("country").value = result[0].country;
                    if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                        googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                        $("#googleLink").attr("href", googleLink).attr('target', '_blank');
                    }

                    if (result[0].product.replace(/\s/g, '') != "") {
                        $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                    } else {
                        $('#product-list').prop('selectedIndex', -1);
                    }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';
                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    } else {
                        templateObject.attachmentCount.set('');
                        templateObject.uploadedFiles.set('');
                        templateObject.uploadedFile.set('');
                    }
                    $('#event-modal').modal();
                    // this.$body.addClass('modal-open');
                }
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dayMaxEvents: true, // allow "more" link when too many events
            //Triggers modal once event is moved to another date within the calendar.
            eventDrop: function (info) {
                if (info.event._def.publicId != "") {
                    let appointmentData = templateObject.appointmentrecords.get();
                    let resourceData = templateObject.resourceAllocation.get();
                    let eventDropID = info.event._def.publicId || '0';
                    let dateStart = new Date(info.event.start);
                    let dateEnd = new Date(info.event.end);
                    let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                    let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                    let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                    let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                    let index = appointmentData.map(function (e) {
                        return e.id;
                    }).indexOf(parseInt(eventDropID));
                    let resourceIndex = resourceData.map(function (e) {
                        return e.employeeName;
                    }).indexOf(appointmentData[index].employeename);
                    var result = appointmentData.filter(apmt => {
                        return apmt.id == eventDropID
                    });
                    if (result.length > 0) {
                        objectData = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(eventDropID) || 0,
                                StartTime: startDate + ' ' + startTime + ":00" || '',
                                EndTime: endDate + ' ' + endTime + ":00" || '',
                            }
                        }
                        let nameid = appointmentData[index].employeename.replace(' ', '-');
                        $('#allocationTable tbody tr').each(function () {
                            if (this.id == appointmentData[index].employeename) {
                                $(this).attr('id', $(this).attr('id').replace(' ', '-'));
                            }
                        });
                        let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';
                        let day = moment(startDate).format('dddd').toLowerCase();
                        appointmentService.saveAppointment(objectData).then(function (data) {
                            appointmentData[index].startDate = startDate + ' ' + startTime;
                            appointmentData[index].endDate = endDate + ' ' + endTime;
                            templateObject.appointmentrecords.set(appointmentData);
                            $('.droppable #' + eventDropID).remove();
                            $('#' + nameid + ' .' + day + ' .droppable').append(job);
                            $('#allocationTable tbody tr').each(function () {
                                if (this.id == nameid) {
                                    $(this).attr('id', $(this).attr('id').replace('-', ' '));
                                }
                            })
                            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataUpdate) {
                                addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {}).catch(function (err) {});
                            }).catch(function (err) {
                                //window.open('/appointments', '_self');
                            });
                        }).catch(function (err) {
                            //window.open('/appointments', '_self');
                        });
                    }
                }

            },
            //Triggers modal once external object is dropped to calender.
            drop: function (event) {
                let draggedEmployeeID = templateObject.empID.get();
                let calendarData = templateObject.employeeOptions.get();
                let calendarSet = templateObject.globalSettings.get();
                let employees = templateObject.employeerecords.get();
                let overridesettings = employees.filter(employeeData => {
                    return employeeData.id == parseInt(draggedEmployeeID)
                });

                let empData = calendarData.filter(calendarOpt => {
                    return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                });

                document.getElementById("frmAppointment").reset();
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                $("#btnStartActualTime").prop("disabled", false);
                $("#btnEndActualTime").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, '');
                var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                document.getElementById("dtSODate").value = start;
                document.getElementById("dtSODate2").value = start
                    var startTime = moment(event.dateStr).format("HH:mm");
                document.getElementById("startTime").value = startTime;
                if (overridesettings[0].override == "false") {
                    if (calendarSet.DefaultApptDuration) {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(calendarSet.DefaultApptDuration), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }
                    $('#product-list').prepend('<option value="' + calendarSet.id + '" selected>' + calendarSet.defaultProduct + '</option>');
                    $("#product-list")[0].options[0].selected = true;
                } else if (overridesettings[0].override == "true") {
                    if (templateObject.empDuration.get() != "") {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }
                    if (empData.length > 0) {
                        $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    } else {
                        $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    }
                } else {
                    if (templateObject.empDuration.get() != "") {
                        var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                    } else {
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                    }
                    if (empData.length > 0) {
                        $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    } else {
                        $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        $("#product-list")[0].options[0].selected = true;
                    }
                }

                var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                templateObject.attachmentCount.set('');
                templateObject.uploadedFiles.set('')
                templateObject.uploadedFile.set('')
                $('#customerListModal').modal();
            },

            events: templateObject.eventdata.get(),
            eventDidMount: function (info) {
                if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    $(".fc-event-main p").css({
                        'font-size': '8px'
                    });
                    //     $(info.el).tooltip({
                    //         title: info.event.title.replaceAll('<br>', "\n"),
                    //         placement: "top",
                    //         trigger: "hover",
                    //         container: "body"

                    //     });
                }
            },
            eventContent: function (event) {
                let title = document.createElement('p');
                if (event.event.title) {
                    title.innerHTML = event.timeText + ' ' + event.event.title;
                    title.style.backgroundColor = event.backgroundColor;
                    title.style.color = "#ffffff";
                } else {
                    title.innerHTML = event.timeText + ' ' + event.event.title;
                }

                let arrayOfDomNodes = [title]
                return {
                    domNodes: arrayOfDomNodes
                }
            }

        });
        calendar.render();
        let draggableEl = document.getElementById('external-events-list');
        new Draggable(draggableEl, {
            itemSelector: '.fc-event',
            eventData: function (eventEl) {
                $('#updateID').val("");
                let employee = eventEl.textContent;
                let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, '');
                let employeeID = empInit.replace(/\D/g, '');
                templateObject.empID.set(employeeID);
                return {
                    title: eventEl.innerText,
                    duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                };
            }
        });
    }

    getWeeksInMonth = function (year, month) {
        const weeks = [];
        firstDate = new Date(year, month, 1);
        lastDate = new Date(year, month + 1, 0);
        numDays = lastDate.getDate();

        let dayOfWeekCounter = firstDate.getDay();

        for (let date = 1; date <= numDays; date++) {
            if (dayOfWeekCounter === 0 || weeks.length === 0) {
                weeks.push([]);
            }
            weeks[weeks.length - 1].push(date);
            dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
        }

        results = weeks
            .filter((w) => !!w.length)
            .map((w) => ({
                    start: w[0],
                    end: w[w.length - 1],
                    dates: w,
                }));

        if (results[0].dates.length < 7) {
            let lastDay = new Date(year, month, 0);
            let addDays = lastDay.getDate();
            let count = results[0].dates.length;
            while (count < 7) {
                results[0].dates.unshift(addDays);
                count++;
                addDays--;
            }

            results[0].start = results[0].dates[0];
            results[0].end = results[0].dates[6];
        }

        if (results[results.length - 1].dates.length < 7) {
            let addDays = 1;
            let count = results[results.length - 1].dates.length;
            while (count < 7) {
                results[results.length - 1].dates.push(addDays);
                count++;
                addDays++;
            }
            results[results.length - 1].start = results[results.length - 1].dates[0];
            results[results.length - 1].end = results[results.length - 1].dates[6];
        }

        return results;
    }

    templateObject.diff_hours = function (dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(diff);
    }

    document.getElementById('currentDate').value = moment().format('YYYY-MM-DD');
    changeColumnColor = function (day) {
        let dayOfWeek = moment(day).format('dddd');
        let dayInDigit = moment(day).format('DD');
        let dd = moment(document.getElementById('currentDate').value).format('DD');
        if (dayOfWeek == moment().format('dddd') && dayInDigit == dd) {
            $(document).on('DOMNodeInserted', function (e) {
                $("#allocationTable").find('tbody tr td.' + dayOfWeek.toLowerCase() + '').addClass("currentDay");
            });
        } else {
            $("#allocationTable tbody tr td." + dayOfWeek.toLocaleLowerCase()).removeClass("currentDay");
            $("#allocationTabletbody tr td." + dayOfWeek.toLocaleLowerCase()).css('background-color', '#fff');

        }
    }

    templateObject.dateFormat = function (date) {
        var dateParts = date.split("/");
        var dateObject = dateParts[2] + '/' + ('0' + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
        return dateObject;
    }

    templateObject.getEmployeesList = function () {
        getVS1Data('TEmployee').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllEmployeeSideData().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let totalUser = 0;
                    let totAmount = 0;
                    let totAmountOverDue = 0;

                    for (let i = 0; i < data.temployee.length; i++) {
                        let randomColor = Math.floor(Math.random() * 16777215).toString(16);

                        if (randomColor.length < 6) {
                            randomColor = randomColor + '6';
                        }
                        let selectedColor = '#' + randomColor;
                        if (seeOwnAppointments == true) {
                            if (data.temployee[i].fields.EmployeeName == Session.get('mySessionEmployee')) {
                                var dataList = {
                                    id: data.temployee[i].fields.ID || '',
                                    employeeName: data.temployee[i].fields.EmployeeName || '',
                                    color: data.temployee[i].fields.CustFld6 || selectedColor,
                                    priority: data.temployee[i].fields.CustFld5 || "0",
                                    override: data.temployee[i].fields.CustFld14 || "false"
                                };
                                lineItems.push(dataList);
                                allEmployees.push(dataList);
                            }
                        } else {
                            var dataList = {
                                id: data.temployee[i].fields.ID || '',
                                employeeName: data.temployee[i].fields.EmployeeName || '',
                                color: data.temployee[i].fields.CustFld6 || selectedColor,
                                priority: data.temployee[i].fields.CustFld5 || "0",
                                override: data.temployee[i].fields.CustFld14 || "false"
                            };
                            lineItems.push(dataList);
                            allEmployees.push(dataList);
                        }

                    }
                    lineItems.sort(function (a, b) {
                        if (a.employeeName == 'NA') {
                            return 1;
                        } else if (b.employeeName == 'NA') {
                            return -1;
                        }
                        return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
                    });
                    templateObject.employeerecords.set(lineItems);

                    if (templateObject.employeerecords.get()) {
                        setTimeout(function () {
                            $('.counter').text(lineItems.length + ' items');
                        }, 100);
                    }

                }).catch(function (err) {});
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;
                let lineItems = [];
                let lineItemObj = {};
                let totalUser = 0;

                let totAmount = 0;
                let totAmountOverDue = 0;
                for (let i = 0; i < useData.length; i++) {
                    let randomColor = Math.floor(Math.random() * 16777215).toString(16);

                    if (randomColor.length < 6) {
                        randomColor = randomColor + '6';
                    }
                    let selectedColor = '#' + randomColor;
                    if (useData[i].fields.CustFld6 == "") {
                        objDetails = {
                            type: "TEmployeeEx",
                            fields: {
                                ID: useData[i].fields.ID,
                                CustFld6: selectedColor,
                                Email: useData[i].fields.Email || useData[i].fields.FirstName.toLowerCase() + "@gmail.com",
                                Sex: useData[i].fields.Sex || "M",
                                DateStarted: useData[i].fields.DateStarted || moment().format('YYYY-MM-DD'),
                                DOB: useData[i].fields.DOB || moment('2018-07-01').format('YYYY-MM-DD')
                            }
                        };

                        contactService.saveEmployeeEx(objDetails).then(function (data) {});
                    }

                    if (seeOwnAppointments == true) {
                        if (useData[i].fields.EmployeeName == Session.get('mySessionEmployee')) {
                            var dataList = {
                                id: useData[i].fields.ID || '',
                                employeeName: useData[i].fields.EmployeeName || '',
                                color: useData[i].fields.CustFld6 || selectedColor,
                                priority: useData[i].fields.CustFld5 || "0",
                                override: useData[i].fields.CustFld14 || "false"
                            };
                            lineItems.push(dataList);
                        }
                    } else {
                        var dataList = {
                            id: useData[i].fields.ID || '',
                            employeeName: useData[i].fields.EmployeeName || '',
                            color: useData[i].fields.CustFld6 || selectedColor,
                            priority: useData[i].fields.CustFld5 || "0",
                            override: useData[i].fields.CustFld14 || "false"
                        };
                        lineItems.push(dataList);
                    }

                }
                lineItems.sort(function (a, b) {
                    if (a.employeeName == 'NA') {
                        return 1;
                    } else if (b.employeeName == 'NA') {
                        return -1;
                    }
                    return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
                });
                templateObject.employeerecords.set(lineItems);

                if (templateObject.employeerecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }
        }).catch(function (err) {
            contactService.getAllEmployeeSideData().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let totalUser = 0;

                let totAmount = 0;
                let totAmountOverDue = 0;
                for (let i = 0; i < data.temployee.length; i++) {
                    let randomColor = Math.floor(Math.random() * 16777215).toString(16);

                    if (randomColor.length < 6) {
                        randomColor = randomColor + '6';
                    }
                    let selectedColor = '#' + randomColor;
                    if (seeOwnAppointments == true) {
                        if (data.temployee[i].fields.EmployeeName == Session.get('mySessionEmployee')) {
                            var dataList = {
                                id: data.temployee[i].fields.ID || '',
                                employeeName: data.temployee[i].fields.EmployeeName || '',
                                color: data.temployee[i].fields.CustFld6 || selectedColor,
                                priority: data.temployee[i].fields.CustFld5 || "0",
                                override: data.temployee[i].fields.CustFld14 || "false"
                            };
                            lineItems.push(dataList);
                        }
                    } else {
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeName: data.temployee[i].fields.EmployeeName || '',
                            color: data.temployee[i].fields.CustFld6 || selectedColor,
                            priority: data.temployee[i].fields.CustFld5 || "0",
                            override: data.temployee[i].fields.CustFld14 || "false"
                        };
                        lineItems.push(dataList);
                    }

                }
                lineItems.sort(function (a, b) {
                    if (a.employeeName == 'NA') {
                        return 1;
                    } else if (b.employeeName == 'NA') {
                        return -1;
                    }
                    return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
                });
                templateObject.employeerecords.set(lineItems);

                if (templateObject.employeerecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }).catch(function (err) {});
        });
    }

    templateObject.getAllProductData = function () {
        productList = [];
        getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function (data) {
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].Id || '',
                            productname: data.tproductvs1[i].ProductName || ''
                        }
                        if (data.tproductvs1[i].ProductType != 'INV') {
                            productList.push(dataList);
                        }

                    }

                    templateObject.datatablerecords.set(productList);

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var dataList = {};
                for (let i = 0; i < useData.length; i++) {
                    dataList = {
                        id: useData[i].fields.ID || '',
                        productname: useData[i].fields.ProductName || ''
                    }
                    if (useData[i].fields.ProductType != 'INV') {
                        productList.push(dataList);
                    }
                }
                templateObject.datatablerecords.set(productList);

            }
        }).catch(function (err) {
            productService.getNewProductListVS1().then(function (data) {

                var dataList = {};
                for (let i = 0; i < data.tproductvs1.length; i++) {
                    dataList = {
                        id: data.tproductvs1[i].Id || '',
                        productname: data.tproductvs1[i].ProductName || ''
                    }
                    if (data.tproductvs1[i].ProductType != 'INV') {
                        productList.push(dataList);
                    }

                }
                templateObject.datatablerecords.set(productList);

            });
        });

    }

    let hideSun = '';
    let hideSat = '';
    templateObject.getEmployeesList();
    templateObject.getAllProductData();
    getVS1Data('TAppointmentPreferences').then(function (dataObject) {
        let employeeSettings = [];
        if (dataObject.length == 0) {
            appointmentService.getCalendarsettings().then(function (data) {

                if (data.tappointmentpreferences.length > 0) {
                    templateObject.employeeOptions.set(data.tappointmentpreferences);
                }

            }).catch(function (err) {});
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tappointmentpreferences;
            templateObject.employeeOptions.set(useData);
        }
    }).catch(function (err) {
        appointmentService.getCalendarsettings().then(function (data) {
            templateObject.employeeOptions.set(data.tappointmentpreferences);
        }).catch(function (err) {});
    });

    templateObject.getAllAppointmentListData = function () {
        getVS1Data('TAppointment').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                  addVS1Data('TAppointment',JSON.stringify(data));
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let appColor = '';
                    let dataColor = '';
                    let allEmp = templateObject.employeerecords.get();

                    for (let i = 0; i < data.tappointmentex.length; i++) {

                        var employeeColor = allEmp.filter(apmt => {
                            return apmt.employeeName == data.tappointmentex[i].fields.TrainerName;
                        });

                        if (employeeColor.length > 0) {
                            appColor = employeeColor[0].color || '#00a3d3';
                        } else {
                            appColor = '#00a3d3';
                        }
                        var appointment = {
                            id: data.tappointmentex[i].fields.ID || '',
                            sortdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                            appointmentdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                            accountname: data.tappointmentex[i].fields.ClientName || '',
                            statementno: data.tappointmentex[i].fields.TrainerName || '',
                            employeename: data.tappointmentex[i].fields.TrainerName || '',
                            department: data.tappointmentex[i].fields.DeptClassName || '',
                            phone: data.tappointmentex[i].fields.Phone || '',
                            mobile: data.tappointmentex[i].fields.Mobile || '',
                            suburb: data.tappointmentex[i].fields.Suburb || '',
                            street: data.tappointmentex[i].fields.Street || '',
                            state: data.tappointmentex[i].fields.State || '',
                            country: data.tappointmentex[i].fields.Country || '',
                            zip: data.tappointmentex[i].fields.Postcode || '',
                            startTime: data.tappointmentex[i].fields.StartTime.split(' ')[1] || '',
                            totalHours: data.tappointmentex[i].fields.TotalHours || 0,
                            endTime: data.tappointmentex[i].fields.EndTime.split(' ')[1] || '',
                            startDate: data.tappointmentex[i].fields.StartTime || '',
                            endDate: data.tappointmentex[i].fields.EndTime || '',
                            fromDate: data.tappointmentex[i].fields.Actual_EndTime ? moment(data.tappointmentex[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                            openbalance: data.tappointmentex[i].fields.Actual_EndTime || '',
                            aStartTime: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[1] || '',
                            aEndTime: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[1] || '',
                            aStartDate: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[0] || '',
                            aEndTDate: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[0] || '',
                            actualHours: '',
                            closebalance: '',
                            rate: data.tappointmentex[i].fields.Rate || 1,
                            product: data.tappointmentex[i].fields.ProductDesc || '',
                            finished: data.tappointmentex[i].fields.Status || '',
                            //employee: data.tappointmentex[i].EndTime != '' ? moment(data.tappointmentex[i].EndTime).format("DD/MM/YYYY") : data.tappointmentex[i].EndTime,
                            notes: data.tappointmentex[i].fields.Notes || '',
                            attachments: data.tappointmentex[i].fields.Attachments || '',
                            isPaused: data.tappointmentex[i].fields.Othertxt || ''
                        };

                        let surbub = data.tappointmentex[i].fields.Suburb || '';
                        let zip = data.tappointmentex[i].fields.Postcode || '';
                        let street = data.tappointmentex[i].fields.Street || '';
                        let state = data.tappointmentex[i].fields.State || '';
                        let getAddress = data.tappointmentex[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                        var dataList = {
                            id: data.tappointmentex[i].fields.ID.toString() || '',
                            title: data.tappointmentex[i].fields.TrainerName + '<br>' + data.tappointmentex[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                            start: data.tappointmentex[i].fields.StartTime || '',
                            end: data.tappointmentex[i].fields.EndTime || '',
                            description: data.tappointmentex[i].fields.Notes || '',
                            color: appColor
                        };
                        if (seeOwnAppointments == true) {
                            if (data.tappointmentex[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                                eventData.push(dataList);
                                appointmentList.push(appointment)
                            }
                        } else {
                            eventData.push(dataList);
                            appointmentList.push(appointment)
                        }

                    }
                    templateObject.appointmentrecords.set(appointmentList);
                    templateObject.eventdata.set(eventData);

                    updateCalendarData = eventData
                        let url = window.location.href;
                    if (url.indexOf('?id') > 1) {
                        url1 = new URL(window.location.href);
                        let appID = url1.searchParams.get("id");
                        $('#frmAppointment')[0].reset();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartActualTime").prop("disabled", false);
                        $("#btnEndActualTime").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        let googleLink = "";
                        var hours = '0';
                        var appointmentData = appointmentList;

                        var result = appointmentData.filter(apmt => {
                            return apmt.id == appID
                        });

                        if (result.length > 0) {
                            templateObject.getAllProductData();
                            if (result[0].isPaused == "Paused") {
                                $(".paused").show();
                                $("#btnHold").prop("disabled", true);
                            } else {
                                $(".paused").hide();
                                $("#btnHold").prop("disabled", false);
                            }

                            if (result[0].aEndTime != "") {
                                $("#btnHold").prop("disabled", true);
                                $("#btnStartActualTime").prop("disabled", true);
                                $("#btnEndActualTime").prop("disabled", true);
                                $("#startTime").prop("disabled", true);
                                $("#endTime").prop("disabled", true);
                                $("#tActualStartTime").prop("disabled", true);
                                $("#tActualEndTime").prop("disabled", true);
                                $("#txtActualHoursSpent").prop("disabled", true);
                            }
                            if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                                var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                                var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                                var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                                hours = duration.asHours();
                            }

                            document.getElementById("updateID").value = result[0].id || 0;
                            document.getElementById("appID").value = result[0].id;
                            document.getElementById("customer").value = result[0].accountname;
                            document.getElementById("phone").value = result[0].phone;
                            document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            document.getElementById("state").value = result[0].state;
                            document.getElementById("address").value = result[0].street;
                            if (Session.get('CloudAppointmentNotes') == true) {
                                document.getElementById("txtNotes").value = result[0].notes;
                            }
                            document.getElementById("suburb").value = result[0].suburb;
                            document.getElementById("zip").value = result[0].zip;
                            document.getElementById("country").value = result[0].country;
                            if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                $("#googleLink").attr("href", googleLink).attr('target', '_blank');
                            }

                            if (result[0].product.replace(/\s/g, '') != "") {
                                $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                            } else {
                                $('#product-list').prop('selectedIndex', -1);
                            }
                            document.getElementById("employee_name").value = result[0].employeename;
                            document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                            document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                            document.getElementById("startTime").value = result[0].startTime;
                            document.getElementById("endTime").value = result[0].endTime;
                            document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            document.getElementById("tActualEndTime").value = result[0].aEndTime;
                            document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                            templateObject.attachmentCount.set(0);
                            if (result[0].attachments) {
                                if (result.length) {
                                    templateObject.attachmentCount.set(result[0].attachments.length);
                                    templateObject.uploadedFiles.set(result[0].attachments);
                                }
                            }
                            $('#event-modal').modal();
                            // this.$body.addClass('modal-open');
                        }
                    }
                    $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                    $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                    $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                    $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                    if (templateObject.eventdata.get()) {
                        templateObject.renderNormalCalendar();
                    }

                    var currentDate = moment();
                    var dateCurrent = new Date();
                    var weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
                    var weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
                    var days = [];

                    let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
                    var weekResults = weeksOfCurrentMonth.filter(week => {
                        return week.dates.includes(parseInt(moment(weekStart).format('DD')));
                    });
                    let currentDay = moment().format('dddd');
                    let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                    $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
                    $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
                    $('#here_table thead tr').append('<th class="employeeName"></th>');

                    for (let w = 0; w < daysOfTheWeek.length; w++) {
                        if (daysOfTheWeek[w] === "Sunday") {
                            if ($('#showSunday').is(":checked")) {
                                $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                            } else {
                                $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                            }

                        } else if (daysOfTheWeek[w] === "Saturday") {
                            if ($('#showSaturday').is(":checked")) {
                                $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                            } else {
                                $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                            }
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                        }
                    }

                    $('#here_table').append('</tr ></thead >');
                    for (i = 0; i <= weekResults[0].dates.length; i++) {
                        days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                    }
                    $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
                    $('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
                    $('.monday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
                    $('.tuesday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
                    $('.wednesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
                    $('.thursday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
                    $('.friday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
                    $('.saturday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

                    if (LoggedCountry == "United States") {
                        $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                        $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                        $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                        $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                        $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                        $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                        $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
                    } else {
                        $(".dateMon").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                        $(".dateTue").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                        $(".dateWed").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                        $(".dateThu").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                        $(".dateFri").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                        $(".dateSat").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                        $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
                    }

                    if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                        });

                    }

                    if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                        });

                    }

                    if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                        });

                    }

                    if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                        });
                    }

                    if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                        });

                    }

                    if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                        });

                    }

                    if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                        $(document).on('DOMNodeInserted', function (e) {
                            $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                        });

                    }

                    templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

                    startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

                    endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

                    //$('.fullScreenSpin').css('display', 'none');
                    //if (allEmployees.length > 0) {
                    for (let t = 0; t < data.tappointmentex.length; t++) {
                        let date = new Date(data.tappointmentex[t].fields.StartTime.split(' ')[0]);
                        weekDay = moment(data.tappointmentex[t].fields.StartTime.split(' ')[0]).format('dddd');

                        if (resourceChat.length > 0) {
                            if (date >= startWeek && date <= endWeek) {
                                if (seeOwnAppointments == true) {
                                    if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                        let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                        if (!found) {
                                            resourceColor = templateObject.employeerecords.get();

                                            var result = resourceColor.filter(apmtColor => {
                                                return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                            });
                                            let employeeColo = "'#00a3d3'";

                                            if (result.length > 0) {
                                                employeeColor = result[0].color;
                                            }

                                            var dataList = {
                                                id: data.tappointmentex[t].fields.ID,
                                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                                color: employeeColor
                                            };
                                            resourceChat.push(dataList);
                                            allEmp.push(dataList);
                                        }
                                        var jobs = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            job: data.tappointmentex[t].fields.ClientName,
                                            street: data.tappointmentex[t].fields.Street,
                                            city: data.tappointmentex[t].fields.Surbub,
                                            zip: data.tappointmentex[t].fields.Postcode,
                                            day: weekDay,
                                            date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                        }

                                        resourceJob.push(jobs)
                                    }
                                } else {
                                    let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                    if (!found) {
                                        resourceColor = templateObject.employeerecords.get();

                                        var result = resourceColor.filter(apmtColor => {
                                            return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                        });
                                        let employeeColo = "'#00a3d3'";

                                        if (result.length > 0) {
                                            employeeColor = result[0].color;
                                        }

                                        var dataList = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            color: employeeColor
                                        };
                                        resourceChat.push(dataList);
                                        allEmp.push(dataList);
                                    }
                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }

                                    resourceJob.push(jobs)

                                }
                            }
                        } else {
                            if (date >= startWeek && date <= endWeek) {
                                if (seeOwnAppointments == true) {
                                    if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                        resourceColor = resourceColor = templateObject.employeerecords.get();

                                        var result = resourceColor.filter(apmtColor => {
                                            return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                        });
                                        let employeeColor = '#00a3d3';
                                        if (result.length > 0) {
                                            employeeColor = result[0].color || '';
                                        }

                                        var dataList = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            color: employeeColor
                                        };

                                        var jobs = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            job: data.tappointmentex[t].fields.ClientName,
                                            street: data.tappointmentex[t].fields.Street,
                                            city: data.tappointmentex[t].fields.Surbub,
                                            zip: data.tappointmentex[t].fields.Postcode,
                                            day: weekDay,
                                            date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                        }
                                        resourceJob.push(jobs)
                                        resourceChat.push(dataList);
                                        allEmp.push(dataList);
                                    }
                                } else {
                                    resourceColor = resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }
                                    resourceJob.push(jobs)
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                            }
                        }

                    }

                    setTimeout(function () {
                        let allEmployeesData = templateObject.employeerecords.get();
                        for (let e = 0; e < allEmployeesData.length; e++) {
                            let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                            if (!found) {
                                var dataList = {
                                    id: allEmployeesData[e].id,
                                    employeeName: allEmployeesData[e].employeeName,
                                    color: allEmployeesData[e].color
                                };

                                resourceChat.push(dataList);
                                //allEmp.push(dataList);
                            }
                        }

                        let tableRowData = [];
                        let sundayRowData = [];
                        let mondayRowData = [];
                        var splashArrayMonday = new Array();
                        let tuesdayRowData = [];
                        let wednesdayRowData = [];
                        let thursdayRowData = [];
                        let fridayRowData = [];
                        let saturdayRowData = [];
                        let sundayRow = '';
                        let mondayRow = '';
                        let tuesdayRow = '';
                        let wednesdayRow = '';
                        let thursdayRow = '';
                        let fridayRow = '';
                        let saturdayRow = '';
                        let tableRow = '';
                        let saturdayStatus = '';
                        let sundayStatus = '';
                        for (let r = 0; r < resourceChat.length; r++) {

                            sundayRowData = [];
                            mondayRowData = [];
                            tuesdayRowData = [];
                            wednesdayRowData = [];
                            thursdayRowData = [];
                            fridayRowData = [];
                            saturdayRowData = [];
                            for (let j = 0; j < resourceJob.length; j++) {

                                if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';
                                    sundayRowData.push(sundayRow);
                                }
                                if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    mondayRowData.push(mondayRow);
                                }

                                if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    tuesdayRowData.push(tuesdayRow);
                                }

                                if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    wednesdayRowData.push(wednesdayRow);
                                }

                                if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    thursdayRowData.push(thursdayRow);
                                }

                                if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    fridayRowData.push(fridayRow);
                                }

                                if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                    saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';

                                    saturdayRowData.push(saturdayRow);
                                }

                            }

                            if ($('#showSaturday').is(":checked")) {
                                saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                            } else {
                                saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                            }

                            if ($('#showSunday').is(":checked")) {
                                sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                            } else {
                                sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                            }

                            tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                                '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                                sundayStatus + '' +
                                '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                                '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                                '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                                '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                                '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                                saturdayStatus + '' +
                                '</tr>';
                            tableRowData.push(tableRow);

                        }
                        $('#here_table table').append(tableRowData);
                        //templateObject.employeerecords.set(allEmp);
                        templateObject.resourceAllocation.set(resourceChat);
                        templateObject.resourceJobs.set(resourceJob);
                        templateObject.resourceDates.set(days);
                        $('.fullScreenSpin').css('display', 'none');
                    }, 500);

                }).catch(function (err) {
                    $('.fullScreenSpin').css('display', 'none');
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    $("#allocationTable .sunday").addClass("hidesunday");
                    $("#allocationTable .saturday").addClass("hidesaturday");
                    $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                    $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                    $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                    $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");

                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [0, 6], // hide Sunday and Saturday
                        customButtons: {
                            appointments: {
                                text: 'Appointment List',
                                click: function () {
                                    //window.open('/appointmentlist', '_self');
                                    FlowRouter.go('/appointmentlist');
                                }
                            },
                            allocation: {
                                text: 'Allocations',
                                click: function () {
                                    $('#allocationModal').modal();
                                }
                            }
                        },
                        headerToolbar: {
                            left: 'prev,next today allocation',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        },
                        initialDate: begunDate,
                        navLinks: true, // can click day/week names to navigate views
                        selectable: true,
                        selectMirror: true,
                        eventClick: function (arg) {
                            employeeName = arg.event._def.title;
                            populateEmployDetails(employeeName);
                            $('#event-modal').modal();
                        },
                        editable: true,
                        droppable: true, // this allows things to be dropped onto the calendar
                        dayMaxEvents: true, // allow "more" link when too many events
                        //Triggers modal once event is moved to another date within the calendar.
                        dayHeaderFormat: function (date) {
                            if (LoggedCountry == "United States") {
                                return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                            } else {
                                return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                            }

                        },
                        select: function (info) {
                            $('#frmAppointment')[0].reset();
                            $(".paused").hide();
                            templateObject.getAllProductData();
                            let dateStart = new Date(info.start);
                            let dateEnd = new Date(info.end);
                            let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                            let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                            dateEnd.setHours(dateEnd.getHours() + calendarSet.DefaultApptDuration || "02:00");
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                            document.getElementById("dtSODate").value = startDate;
                            document.getElementById("dtSODate2").value = endDate;
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                            if (calendarSet.DefaultApptDuration) {
                                document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                            } else {
                                document.getElementById("txtBookedHoursSpent").value = templateObject.diff_hours(dateStart, dateEnd);
                            }
                            templateObject.attachmentCount.set('');
                            templateObject.uploadedFiles.set('');
                            templateObject.uploadedFile.set('')
                            $('#customerListModal').modal();
                        },
                        eventDrop: function (info) {
                            if (info.event._def.publicId != "") {
                                let appointmentData = templateObject.appointmentrecords.get();
                                let resourceData = templateObject.resourceAllocation.get();
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let index = appointmentData.map(function (e) {
                                    return e.id;
                                }).indexOf(parseInt(eventDropID));
                                let resourceIndex = resourceData.map(function (e) {
                                    return e.employeeName;
                                }).indexOf(appointmentData[index].employeename);
                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointmentEx",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }
                                    let nameid = appointmentData[index].employeename.replace(' ', '-');
                                    $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace(' ', '-'));
                                    let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                        '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + '' +
                                        '</div>' + '' +
                                        '</div>';
                                    let day = moment(startDate).format('dddd').toLowerCase();
                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        appointmentData[index].startDate = startDate + ' ' + startTime;
                                        appointmentData[index].endDate = endDate + ' ' + endTime;
                                        templateObject.appointmentrecords.set(appointmentData);

                                        $('#' + nameid + ' .' + day + ' .droppable').append(job);
                                        $('#' + eventDropID).remove();
                                        $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace('-', ' '));
                                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {}).catch(function (err) {});
                                        }).catch(function (err) {
                                            //window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }
                            }

                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            let draggedEmployeeID = templateObject.empID.get();
                            let calendarData = templateObject.employeeOptions.get();
                            let calendarSet = templateObject.globalSettings.get();
                            let employees = templateObject.employeerecords.get();
                            let overridesettings = employees.filter(employeeData => {
                                return employeeData.id == parseInt(draggedEmployeeID)
                            });

                            let empData = calendarData.filter(calendarOpt => {
                                return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                            });
                            document.getElementById("frmAppointment").reset();
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, '');
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                                var startTime = moment(event.dateStr).format("HH:mm");
                            document.getElementById("startTime").value = startTime;
                            if (overridesettings[0].override == "false") {
                                if (calendarSet.defaultApptDuration) {
                                    var endTime = moment(startTime, 'HH:mm').add(parseInt(calendarSet.defaultApptDuration), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    document.getElementById("txtBookedHoursSpent").value = calendarSet.defaultApptDuration;
                                } else {
                                    var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                    var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                    document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                                }
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            } else if (overridesettings[0].override == "true") {
                                if (templateObject.empDuration.get() != "") {
                                    var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                                } else {
                                    var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                    var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                    document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                                }
                                if (empData.length > 0) {
                                    $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                    $("#product-list")[0].options[0].selected = true;
                                } else {
                                    $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                    $("#product-list")[0].options[0].selected = true;
                                }
                            } else {
                                if (templateObject.empDuration.get() != "") {
                                    var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                                } else {
                                    var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                    var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                    document.getElementById("endTime").value = endTime;
                                    var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                    document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                                }
                                if (empData.length > 0) {
                                    $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                    $("#product-list")[0].options[0].selected = true;
                                } else {
                                    $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                    $("#product-list")[0].options[0].selected = true;
                                }
                            }

                            var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                            var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                            $('#customerListModal').modal();
                        },

                        events: [],
                        eventDidMount: function () {}
                    });
                    calendar.render();

                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            $('#updateID').val("");
                            let employee = eventEl.textContent;
                            let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, '');
                            let employeeID = empInit.replace(/\D/g, '');
                            templateObject.empID.set(employeeID);
                            return {
                                title: eventEl.innerText,
                                duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                            };
                        }
                    });
                    //}


                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tappointmentex;
                $('.fullScreenSpin').css('display', 'none');
                let appColor = '#00a3d3';
                let dataColor = '';
                let allEmp = templateObject.employeerecords.get();
                for (let i = 0; i < useData.length; i++) {
                    var employeeColor = allEmp.filter(apmt => {
                        //appointmentList.employeename = employeeName;
                        return apmt.employeeName == useData[i].fields.TrainerName;
                    });

                    if (employeeColor.length > 0) {
                        appColor = employeeColor[0].color || '#00a3d3';
                    } else {
                        appColor = '#00a3d3';
                    }
                    var appointment = {
                        id: useData[i].fields.ID || '',
                        sortdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                        appointmentdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                        accountname: useData[i].fields.ClientName || '',
                        statementno: useData[i].fields.TrainerName || '',
                        employeename: useData[i].fields.TrainerName || '',
                        department: useData[i].fields.DeptClassName || '',
                        phone: useData[i].fields.Phone || '',
                        mobile: useData[i].fields.Mobile || '',
                        suburb: useData[i].fields.Suburb || '',
                        street: useData[i].fields.Street || '',
                        state: useData[i].fields.State || '',
                        country: useData[i].fields.Country || '',
                        zip: useData[i].fields.Postcode || '',
                        timelog: useData[i].fields.AppointmentsTimeLog || '',
                        startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                        totalHours: useData[i].fields.TotalHours || 0,
                        endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                        startDate: useData[i].fields.StartTime || '',
                        endDate: useData[i].fields.EndTime || '',
                        fromDate: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        openbalance: useData[i].fields.Actual_EndTime || '',
                        aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                        aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                        aStartDate: useData[i].fields.Actual_StartTime.split(' ')[0] || '',
                        aEndDate: useData[i].fields.Actual_EndTime.split(' ')[0] || '',
                        actualHours: '',
                        closebalance: '',
                        rate: useData[i].fields.Rate || 1,
                        product: useData[i].fields.ProductDesc || '',
                        finished: useData[i].fields.Status || '',
                        //employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                        attachments: useData[i].fields.Attachments || '',
                        notes: useData[i].fields.Notes || '',
                        isPaused: useData[i].fields.Othertxt || ''
                    };

                    let surbub = useData[i].fields.Suburb || '';
                    let zip = useData[i].fields.Postcode || '';
                    let street = useData[i].fields.Street || '';
                    let state = useData[i].fields.State || '';
                    let getAddress = useData[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                    var dataList = {
                        id: useData[i].fields.ID.toString() || '',
                        title: useData[i].fields.TrainerName + '<br>' + useData[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                        start: useData[i].fields.StartTime || '',
                        end: useData[i].fields.EndTime || '',
                        description: useData[i].fields.Notes || '',
                        color: appColor
                    };
                    if ( seeOwnAppointments == true) {
                        if (useData[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                            eventData.push(dataList);
                            appointmentList.push(appointment)
                        }
                    } else {
                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }
                }
                templateObject.appointmentrecords.set(appointmentList);
                templateObject.eventdata.set(eventData);
                updateCalendarData = eventData
                    let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(window.location.href);
                    let appID = url1.searchParams.get("id");
                    $('#frmAppointment')[0].reset();
                    $("#btnHold").prop("disabled", false);
                    $("#btnStartActualTime").prop("disabled", false);
                    $("#btnEndActualTime").prop("disabled", false);
                    $("#startTime").prop("disabled", false);
                    $("#endTime").prop("disabled", false);
                    $("#tActualStartTime").prop("disabled", false);
                    $("#tActualEndTime").prop("disabled", false);
                    $("#txtActualHoursSpent").prop("disabled", false);
                    let googleLink = "";
                    var hours = '0';
                    var appointmentData = appointmentList;

                    var result = appointmentData.filter(apmt => {
                        return apmt.id == appID
                    });

                    if (result.length > 0) {
                        templateObject.getAllProductData();
                        if (result[0].isPaused == "Paused") {
                            $(".paused").show();
                            $("#btnHold").prop("disabled", true);
                        } else {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                        }

                        if (result[0].aEndTime != "") {
                            $("#btnHold").prop("disabled", true);
                            $("#btnStartActualTime").prop("disabled", true);
                            $("#btnEndActualTime").prop("disabled", true);
                            $("#startTime").prop("disabled", true);
                            $("#endTime").prop("disabled", true);
                            $("#tActualStartTime").prop("disabled", true);
                            $("#tActualEndTime").prop("disabled", true);
                            $("#txtActualHoursSpent").prop("disabled", true);
                        }
                        if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                            var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                            var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                            hours = duration.asHours();
                        }

                        document.getElementById("updateID").value = result[0].id || 0;
                        document.getElementById("appID").value = result[0].id;
                        document.getElementById("customer").value = result[0].accountname;
                        document.getElementById("phone").value = result[0].phone;
                        document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                        document.getElementById("state").value = result[0].state;
                        document.getElementById("address").value = result[0].street;
                        if (Session.get('CloudAppointmentNotes') == true) {
                            document.getElementById("txtNotes").value = result[0].notes;
                        }
                        document.getElementById("suburb").value = result[0].suburb;
                        document.getElementById("zip").value = result[0].zip;
                        document.getElementById("country").value = result[0].country;
                        if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            $("#googleLink").attr("href", googleLink).attr('target', '_blank');
                        }

                        if (result[0].product.replace(/\s/g, '') != "") {
                            $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                        } else {
                            $('#product-list').prop('selectedIndex', -1);
                        }
                        document.getElementById("employee_name").value = result[0].employeename;
                        document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("startTime").value = result[0].startTime;
                        document.getElementById("endTime").value = result[0].endTime;
                        document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                        document.getElementById("tActualStartTime").value = result[0].aStartTime;
                        document.getElementById("tActualEndTime").value = result[0].aEndTime;
                        document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                        templateObject.attachmentCount.set(0);
                        if (result[0].attachments) {
                            if (result.length) {
                                templateObject.attachmentCount.set(result[0].attachments.length);
                                templateObject.uploadedFiles.set(result[0].attachments);
                            }
                        }
                        $('#event-modal').modal();
                        // this.$body.addClass('modal-open');
                    }
                }

                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                templateObject.renderNormalCalendar();
                var currentDate = moment();
                var dateCurrent = new Date();
                var weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
                var weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
                var days = [];

                let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
                var weekResults = weeksOfCurrentMonth.filter(week => {
                    return week.dates.includes(parseInt(moment(weekStart).format('DD')));
                });
                let currentDay = moment().format('dddd');
                let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
                $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
                $('#here_table thead tr').append('<th class="employeeName"></th>');

                for (let w = 0; w < daysOfTheWeek.length; w++) {
                    if (daysOfTheWeek[w] === "Sunday") {
                        if ($('#showSunday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        }

                    } else if (daysOfTheWeek[w] === "Saturday") {
                        if ($('#showSaturday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        }
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                    }

                }
                $('#here_table').append('</tr ></thead >');
                for (i = 0; i <= weekResults[0].dates.length; i++) {
                    days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                }
                $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
                $('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
                $('.monday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
                $('.tuesday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
                $('.wednesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
                $('.thursday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
                $('.friday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
                $('.saturday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

                if (LoggedCountry == "United States") {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
                } else {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
                }

                if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                    });

                }

                if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                    });
                }

                if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                    });

                }

                if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                    });

                }

                if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                    });

                }

                templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

                startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

                endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

                //$('.fullScreenSpin').css('display', 'none');
                //if (allEmployees.length > 0) {

                for (let t = 0; t < useData.length; t++) {
                    let date = new Date(useData[t].fields.StartTime.split(' ')[0]);
                    weekDay = moment(useData[t].fields.StartTime.split(' ')[0]).format('dddd');
                    if (resourceChat.length > 0) {
                        if (date >= startWeek && date <= endWeek) {
                            if ( seeOwnAppointments == true) {
                                if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    let found = resourceChat.some(emp => emp.employeeName == useData[t].fields.TrainerName);
                                    if (!found) {
                                        resourceColor = templateObject.employeerecords.get();

                                        var result = resourceColor.filter(apmtColor => {
                                            return apmtColor.employeeName == useData[t].fields.TrainerName
                                        });
                                        let employeeColor = '#00a3d3';
                                        if (result.length > 0) {
                                            employeeColor = result[0].color || '';
                                        }

                                        var dataList = {
                                            id: useData[t].fields.ID,
                                            employeeName: useData[t].fields.TrainerName,
                                            color: employeeColor
                                        };

                                        resourceChat.push(dataList);
                                        allEmp.push(dataList);
                                    }
                                    var jobs = {
                                        id: useData[t].fields.ID,
                                        employeeName: useData[t].fields.TrainerName,
                                        job: useData[t].fields.ClientName,
                                        street: useData[t].fields.Street,
                                        city: useData[t].fields.Surbub,
                                        zip: useData[t].fields.Postcode,
                                        day: weekDay,
                                        date: useData[t].fields.StartTime.split(' ')[0],
                                    }

                                    resourceJob.push(jobs)
                                }
                            } else {
                                let found = resourceChat.some(emp => emp.employeeName == useData[t].fields.TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == useData[t].fields.TrainerName
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }

                                    var dataList = {
                                        id: useData[t].fields.ID,
                                        employeeName: useData[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    job: useData[t].fields.ClientName,
                                    street: useData[t].fields.Street,
                                    city: useData[t].fields.Surbub,
                                    zip: useData[t].fields.Postcode,
                                    day: weekDay,
                                    date: useData[t].fields.StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)

                            }
                        }

                    } else {

                        if (date >= startWeek && date <= endWeek) {
                            if ( seeOwnAppointments == true) {
                                if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    resourceColor = resourceColor = templateObject.employeerecords.get();
                                    let employeeColor = '#00a3d3';
                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == useData[t].fields.TrainerName
                                    });
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }
                                    var dataList = {
                                        id: useData[t].fields.ID,
                                        employeeName: useData[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    var jobs = {
                                        id: useData[t].fields.ID,
                                        employeeName: useData[t].fields.TrainerName,
                                        job: useData[t].fields.ClientName,
                                        street: useData[t].fields.Street,
                                        city: useData[t].fields.Surbub,
                                        zip: useData[t].fields.Postcode,
                                        day: weekDay,
                                        date: useData[t].fields.StartTime.split(' ')[0],
                                    }
                                    resourceJob.push(jobs)
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                            } else {
                                resourceColor = resourceColor = templateObject.employeerecords.get();
                                let employeeColor = '#00a3d3';
                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == useData[t].fields.TrainerName
                                });
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }
                                var dataList = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    job: useData[t].fields.ClientName,
                                    street: useData[t].fields.Street,
                                    city: useData[t].fields.Surbub,
                                    zip: useData[t].fields.Postcode,
                                    day: weekDay,
                                    date: useData[t].fields.StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                        }
                    }

                }

                setTimeout(function () {
                    let allEmployeesData = templateObject.employeerecords.get();
                    for (let e = 0; e < allEmployeesData.length; e++) {
                        let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                        if (!found) {
                            var dataList = {
                                id: allEmployeesData[e].id,
                                employeeName: allEmployeesData[e].employeeName,
                                color: allEmployeesData[e].color
                            };
                            resourceChat.push(dataList);
                            //allEmp.push(dataList);
                        }
                    }

                    let tableRowData = [];
                    let sundayRowData = [];
                    let mondayRowData = [];
                    var splashArrayMonday = new Array();
                    let tuesdayRowData = [];
                    let wednesdayRowData = [];
                    let thursdayRowData = [];
                    let fridayRowData = [];
                    let saturdayRowData = [];
                    let sundayRow = '';
                    let mondayRow = '';
                    let tuesdayRow = '';
                    let wednesdayRow = '';
                    let thursdayRow = '';
                    let fridayRow = '';
                    let saturdayRow = '';
                    let tableRow = '';
                    let saturdayStatus = '';
                    let sundayStatus = '';
                    for (let r = 0; r < resourceChat.length; r++) {

                        sundayRowData = [];
                        mondayRowData = [];
                        tuesdayRowData = [];
                        wednesdayRowData = [];
                        thursdayRowData = [];
                        fridayRowData = [];
                        saturdayRowData = [];
                        for (let j = 0; j < resourceJob.length; j++) {

                            if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                sundayRowData.push(sundayRow);
                            }
                            if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                mondayRowData.push(mondayRow);
                            }

                            if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                tuesdayRowData.push(tuesdayRow);
                            }

                            if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                wednesdayRowData.push(wednesdayRow);
                            }

                            if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                thursdayRowData.push(thursdayRow);
                            }

                            if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                fridayRowData.push(fridayRow);
                            }

                            if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                                saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                saturdayRowData.push(saturdayRow);
                            }

                        }

                        if ($('#showSaturday').is(":checked")) {
                            saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        } else {
                            saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        }

                        if ($('#showSunday').is(":checked")) {
                            sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        } else {
                            sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        }

                        tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                            '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                            sundayStatus + '' +
                            '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                            saturdayStatus + '' +
                            '</tr>';

                        tableRowData.push(tableRow);

                    }
                    $('#here_table table').append(tableRowData);
                    //templateObject.employeerecords.set(allEmp);
                    templateObject.resourceAllocation.set(resourceChat);
                    templateObject.resourceJobs.set(resourceJob);
                    templateObject.resourceDates.set(days);
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

            }
        }).catch(function (err) {
            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
              addVS1Data('TAppointment',JSON.stringify(data));
                $('.fullScreenSpin').css('display', 'inline-block');
                let appColor = '';
                let dataColor = '';
                let allEmp = templateObject.employeerecords.get();

                for (let i = 0; i < data.tappointmentex.length; i++) {

                    var employeeColor = allEmp.filter(apmt => {
                        return apmt.employeeName == data.tappointmentex[i].fields.TrainerName;
                    });

                    if (employeeColor.length > 0) {
                        appColor = employeeColor[0].color || '#00a3d3';
                    } else {
                        appColor = '#00a3d3';
                    }
                    var appointment = {
                        id: data.tappointmentex[i].fields.ID || '',
                        sortdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                        appointmentdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                        accountname: data.tappointmentex[i].fields.ClientName || '',
                        statementno: data.tappointmentex[i].fields.TrainerName || '',
                        employeename: data.tappointmentex[i].fields.TrainerName || '',
                        department: data.tappointmentex[i].fields.DeptClassName || '',
                        phone: data.tappointmentex[i].fields.Phone || '',
                        mobile: data.tappointmentex[i].fields.Mobile || '',
                        suburb: data.tappointmentex[i].fields.Suburb || '',
                        street: data.tappointmentex[i].fields.Street || '',
                        state: data.tappointmentex[i].fields.State || '',
                        country: data.tappointmentex[i].fields.Country || '',
                        zip: data.tappointmentex[i].fields.Postcode || '',
                        startTime: data.tappointmentex[i].fields.StartTime.split(' ')[1] || '',
                        totalHours: data.tappointmentex[i].fields.TotalHours || 0,
                        endTime: data.tappointmentex[i].fields.EndTime.split(' ')[1] || '',
                        startDate: data.tappointmentex[i].fields.StartTime || '',
                        endDate: data.tappointmentex[i].fields.EndTime || '',
                        fromDate: data.tappointmentex[i].fields.Actual_EndTime ? moment(data.tappointmentex[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        openbalance: data.tappointmentex[i].fields.Actual_EndTime || '',
                        aStartTime: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[1] || '',
                        aEndTime: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[1] || '',
                        aStartDate: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[0] || '',
                        aEndTDate: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[0] || '',
                        actualHours: '',
                        closebalance: '',
                        rate: data.tappointmentex[i].fields.Rate || 1,
                        product: data.tappointmentex[i].fields.ProductDesc || '',
                        finished: data.tappointmentex[i].fields.Status || '',
                        //employee: data.tappointmentex[i].EndTime != '' ? moment(data.tappointmentex[i].EndTime).format("DD/MM/YYYY") : data.tappointmentex[i].EndTime,
                        notes: data.tappointmentex[i].fields.Notes || '',
                        attachments: data.tappointmentex[i].fields.Attachments || '',
                        isPaused: data.tappointmentex[i].fields.Othertxt || ''
                    };

                    let surbub = data.tappointmentex[i].fields.Suburb || '';
                    let zip = data.tappointmentex[i].fields.Postcode || '';
                    let street = data.tappointmentex[i].fields.Street || '';
                    let state = data.tappointmentex[i].fields.State || '';
                    let getAddress = data.tappointmentex[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                    var dataList = {
                        id: data.tappointmentex[i].fields.ID.toString() || '',
                        title: data.tappointmentex[i].fields.TrainerName + '<br>' + data.tappointmentex[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                        start: data.tappointmentex[i].fields.StartTime || '',
                        end: data.tappointmentex[i].fields.EndTime || '',
                        description: data.tappointmentex[i].fields.Notes || '',
                        color: appColor
                    };
                    if ( seeOwnAppointments == true) {
                        if (data.tappointmentex[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                            eventData.push(dataList);
                            appointmentList.push(appointment)
                        }
                    } else {
                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }

                }
                templateObject.appointmentrecords.set(appointmentList);
                templateObject.eventdata.set(eventData);

                updateCalendarData = eventData
                    let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(window.location.href);
                    let appID = url1.searchParams.get("id");
                    $('#frmAppointment')[0].reset();
                    $("#btnHold").prop("disabled", false);
                    $("#btnStartActualTime").prop("disabled", false);
                    $("#btnEndActualTime").prop("disabled", false);
                    $("#startTime").prop("disabled", false);
                    $("#endTime").prop("disabled", false);
                    $("#tActualStartTime").prop("disabled", false);
                    $("#tActualEndTime").prop("disabled", false);
                    $("#txtActualHoursSpent").prop("disabled", false);
                    let googleLink = "";
                    var hours = '0';
                    var appointmentData = appointmentList;

                    var result = appointmentData.filter(apmt => {
                        return apmt.id == appID
                    });

                    if (result.length > 0) {
                        templateObject.getAllProductData();
                        if (result[0].isPaused == "Paused") {
                            $(".paused").show();
                            $("#btnHold").prop("disabled", true);
                        } else {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                        }

                        if (result[0].aEndTime != "") {
                            $("#btnHold").prop("disabled", true);
                            $("#btnStartActualTime").prop("disabled", true);
                            $("#btnEndActualTime").prop("disabled", true);
                            $("#startTime").prop("disabled", true);
                            $("#endTime").prop("disabled", true);
                            $("#tActualStartTime").prop("disabled", true);
                            $("#tActualEndTime").prop("disabled", true);
                            $("#txtActualHoursSpent").prop("disabled", true);
                        }
                        if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                            var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                            var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                            hours = duration.asHours();
                        }

                        document.getElementById("updateID").value = result[0].id || 0;
                        document.getElementById("appID").value = result[0].id;
                        document.getElementById("customer").value = result[0].accountname;
                        document.getElementById("phone").value = result[0].phone;
                        document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                        document.getElementById("state").value = result[0].state;
                        document.getElementById("address").value = result[0].street;
                        if (Session.get('CloudAppointmentNotes') == true) {
                            document.getElementById("txtNotes").value = result[0].notes;
                        }
                        document.getElementById("suburb").value = result[0].suburb;
                        document.getElementById("zip").value = result[0].zip;
                        document.getElementById("country").value = result[0].country;
                        if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            $("#googleLink").attr("href", googleLink).attr('target', '_blank');
                        }

                        if (result[0].product.replace(/\s/g, '') != "") {
                            $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                        } else {
                            $('#product-list').prop('selectedIndex', -1);
                        }
                        document.getElementById("employee_name").value = result[0].employeename;
                        document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("startTime").value = result[0].startTime;
                        document.getElementById("endTime").value = result[0].endTime;
                        document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                        document.getElementById("tActualStartTime").value = result[0].aStartTime;
                        document.getElementById("tActualEndTime").value = result[0].aEndTime;
                        document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                        templateObject.attachmentCount.set(0);
                        if (result[0].attachments) {
                            if (result.length) {
                                templateObject.attachmentCount.set(result[0].attachments.length);
                                templateObject.uploadedFiles.set(result[0].attachments);
                            }
                        }
                        $('#event-modal').modal();
                        // this.$body.addClass('modal-open');
                    }
                }
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                if (templateObject.eventdata.get()) {
                    templateObject.renderNormalCalendar();
                }

                var currentDate = moment();
                var dateCurrent = new Date();
                var weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
                var weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
                var days = [];

                let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
                var weekResults = weeksOfCurrentMonth.filter(week => {
                    return week.dates.includes(parseInt(moment(weekStart).format('DD')));
                });
                let currentDay = moment().format('dddd');
                let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
                $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
                $('#here_table thead tr').append('<th class="employeeName"></th>');

                for (let w = 0; w < daysOfTheWeek.length; w++) {
                    if (daysOfTheWeek[w] === "Sunday") {
                        if ($('#showSunday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        }

                    } else if (daysOfTheWeek[w] === "Saturday") {
                        if ($('#showSaturday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        }
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                    }
                }

                $('#here_table').append('</tr ></thead >');
                for (i = 0; i <= weekResults[0].dates.length; i++) {
                    days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                }
                $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
                $('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
                $('.monday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
                $('.tuesday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
                $('.wednesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
                $('.thursday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
                $('.friday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
                $('.saturday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

                if (LoggedCountry == "United States") {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
                } else {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
                }

                if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                    });

                }

                if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                    });
                }

                if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                    });

                }

                if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                    });

                }

                if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                    });

                }

                templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

                startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

                endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

                //$('.fullScreenSpin').css('display', 'none');
                //if (allEmployees.length > 0) {
                for (let t = 0; t < data.tappointmentex.length; t++) {
                    let date = new Date(data.tappointmentex[t].fields.StartTime.split(' ')[0]);
                    weekDay = moment(data.tappointmentex[t].fields.StartTime.split(' ')[0]).format('dddd');

                    if (resourceChat.length > 0) {
                        if (date >= startWeek && date <= endWeek) {
                            if ( seeOwnAppointments == true) {
                                if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                    if (!found) {
                                        resourceColor = templateObject.employeerecords.get();

                                        var result = resourceColor.filter(apmtColor => {
                                            return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                        });
                                        let employeeColo = "'#00a3d3'";

                                        if (result.length > 0) {
                                            employeeColor = result[0].color;
                                        }

                                        var dataList = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            color: employeeColor
                                        };
                                        resourceChat.push(dataList);
                                        allEmp.push(dataList);
                                    }
                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }

                                    resourceJob.push(jobs)
                                }
                            } else {
                                let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColo = "'#00a3d3'";

                                    if (result.length > 0) {
                                        employeeColor = result[0].color;
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)

                            }
                        }
                    } else {
                        if (date >= startWeek && date <= endWeek) {
                            if ( seeOwnAppointments == true) {
                                if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    resourceColor = resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }
                                    resourceJob.push(jobs)
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                            } else {
                                resourceColor = resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }

                                var dataList = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                        }
                    }

                }

                setTimeout(function () {
                    let allEmployeesData = templateObject.employeerecords.get();
                    for (let e = 0; e < allEmployeesData.length; e++) {
                        let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                        if (!found) {
                            var dataList = {
                                id: allEmployeesData[e].id,
                                employeeName: allEmployeesData[e].employeeName,
                                color: allEmployeesData[e].color
                            };

                            resourceChat.push(dataList);
                            //allEmp.push(dataList);
                        }
                    }

                    let tableRowData = [];
                    let sundayRowData = [];
                    let mondayRowData = [];
                    var splashArrayMonday = new Array();
                    let tuesdayRowData = [];
                    let wednesdayRowData = [];
                    let thursdayRowData = [];
                    let fridayRowData = [];
                    let saturdayRowData = [];
                    let sundayRow = '';
                    let mondayRow = '';
                    let tuesdayRow = '';
                    let wednesdayRow = '';
                    let thursdayRow = '';
                    let fridayRow = '';
                    let saturdayRow = '';
                    let tableRow = '';
                    let saturdayStatus = '';
                    let sundayStatus = '';
                    for (let r = 0; r < resourceChat.length; r++) {

                        sundayRowData = [];
                        mondayRowData = [];
                        tuesdayRowData = [];
                        wednesdayRowData = [];
                        thursdayRowData = [];
                        fridayRowData = [];
                        saturdayRowData = [];
                        for (let j = 0; j < resourceJob.length; j++) {

                            if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                sundayRowData.push(sundayRow);
                            }
                            if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                mondayRowData.push(mondayRow);
                            }

                            if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                tuesdayRowData.push(tuesdayRow);
                            }

                            if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                wednesdayRowData.push(wednesdayRow);
                            }

                            if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                thursdayRowData.push(thursdayRow);
                            }

                            if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                fridayRowData.push(fridayRow);
                            }

                            if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                saturdayRowData.push(saturdayRow);
                            }

                        }

                        if ($('#showSaturday').is(":checked")) {
                            saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        } else {
                            saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        }

                        if ($('#showSunday').is(":checked")) {
                            sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        } else {
                            sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        }

                        tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                            '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                            sundayStatus + '' +
                            '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                            saturdayStatus + '' +
                            '</tr>';
                        tableRowData.push(tableRow);

                    }
                    $('#here_table table').append(tableRowData);
                    //templateObject.employeerecords.set(allEmp);
                    templateObject.resourceAllocation.set(resourceChat);
                    templateObject.resourceJobs.set(resourceJob);
                    templateObject.resourceDates.set(days);
                    $('.fullScreenSpin').css('display', 'none');
                }, 500);

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
                var calendarEl = document.getElementById('calendar');
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("YYYY-MM-DD");
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");

                //if(eventData.length > 0){
                var calendar = new Calendar(calendarEl, {
                    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                    themeSystem: 'bootstrap',
                    initialView: 'timeGridWeek',
                    hiddenDays: [0, 6], // hide Sunday and Saturday
                    customButtons: {
                        appointments: {
                            text: 'Appointment List',
                            click: function () {
                                //window.open('/appointmentlist', '_self');
                                FlowRouter.go('/appointmentlist');
                            }
                        },
                        allocation: {
                            text: 'Allocations',
                            click: function () {
                                $('#allocationModal').modal();
                            }
                        }
                    },
                    headerToolbar: {
                        left: 'prev,next today allocation',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    initialDate: begunDate,
                    navLinks: true, // can click day/week names to navigate views
                    selectable: true,
                    selectMirror: true,
                    eventClick: function (arg) {
                        employeeName = arg.event._def.title;
                        populateEmployDetails(employeeName);
                        $('#event-modal').modal();
                    },
                    editable: true,
                    droppable: true, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    dayHeaderFormat: function (date) {
                        if (LoggedCountry == "United States") {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                        } else {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                        }

                    },
                    select: function (info) {
                        $('#frmAppointment')[0].reset();
                        $(".paused").hide();
                        templateObject.getAllProductData();
                        let dateStart = new Date(info.start);
                        let dateEnd = new Date(info.end);
                        let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                        let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                        dateEnd.setHours(dateEnd.getHours() + calendarSet.DefaultApptDuration || "02:00");
                        let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                        let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                        document.getElementById("dtSODate").value = startDate;
                        document.getElementById("dtSODate2").value = endDate;
                        document.getElementById("startTime").value = startTime;
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                        if (calendarSet.DefaultApptDuration) {
                            document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                        } else {
                            document.getElementById("txtBookedHoursSpent").value = templateObject.diff_hours(dateStart, dateEnd);
                        }
                        templateObject.attachmentCount.set('');
                        templateObject.uploadedFiles.set('');
                        templateObject.uploadedFile.set('')
                        $('#customerListModal').modal();
                    },
                    eventDrop: function (info) {
                        if (info.event._def.publicId != "") {
                            let appointmentData = templateObject.appointmentrecords.get();
                            let resourceData = templateObject.resourceAllocation.get();
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let index = appointmentData.map(function (e) {
                                return e.id;
                            }).indexOf(parseInt(eventDropID));
                            let resourceIndex = resourceData.map(function (e) {
                                return e.employeeName;
                            }).indexOf(appointmentData[index].employeename);
                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointmentEx",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }
                                let nameid = appointmentData[index].employeename.replace(' ', '-');
                                $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace(' ', '-'));
                                let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                let day = moment(startDate).format('dddd').toLowerCase();
                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    appointmentData[index].startDate = startDate + ' ' + startTime;
                                    appointmentData[index].endDate = endDate + ' ' + endTime;
                                    templateObject.appointmentrecords.set(appointmentData);

                                    $('#' + nameid + ' .' + day + ' .droppable').append(job);
                                    $('#' + eventDropID).remove();
                                    $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace('-', ' '));
                                    sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {}).catch(function (err) {});
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    //window.open('/appointments', '_self');
                                });
                            }
                        }

                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
                        let draggedEmployeeID = templateObject.empID.get();
                        let calendarData = templateObject.employeeOptions.get();
                        let calendarSet = templateObject.globalSettings.get();
                        let employees = templateObject.employeerecords.get();
                        let overridesettings = employees.filter(employeeData => {
                            return employeeData.id == parseInt(draggedEmployeeID)
                        });

                        let empData = calendarData.filter(calendarOpt => {
                            return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                        });
                        document.getElementById("frmAppointment").reset();
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartActualTime").prop("disabled", false);
                        $("#btnEndActualTime").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, '');
                        var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                        document.getElementById("dtSODate").value = start;
                        document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                        document.getElementById("startTime").value = startTime;
                        if (overridesettings[0].override == "false") {
                            if (calendarSet.defaultApptDuration) {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(calendarSet.defaultApptDuration), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = calendarSet.defaultApptDuration;
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                            $("#product-list")[0].options[0].selected = true;
                        } else if (overridesettings[0].override == "true") {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            if (empData.length > 0) {
                                $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            } else {
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            }
                        } else {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            if (empData.length > 0) {
                                $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            } else {
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            }
                        }

                        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        $('#customerListModal').modal();
                    },

                    events: [],
                    eventDidMount: function () {}
                });
                calendar.render();

                let draggableEl = document.getElementById('external-events-list');
                new Draggable(draggableEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl) {
                        $('#updateID').val("");
                        let employee = eventEl.textContent;
                        let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, '');
                        let employeeID = empInit.replace(/\D/g, '');
                        templateObject.empID.set(employeeID);
                        return {
                            title: eventEl.innerText,
                            duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                        };
                    }
                });
                //}


            });
        });

    };

    templateObject.getAllClients = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function (data) {
                    for (let i in data.tcustomervs1) {

                        let customerrecordObj = {
                            customerid: data.tcustomervs1[i].Id || ' ',
                            customername: data.tcustomervs1[i].ClientName || ' ',
                            customeremail: data.tcustomervs1[i].Email || ' ',
                            street: data.tcustomervs1[i].Street.replace(/(?:\r\n|\r|\n)/g, ', ') || ' ',
                            street2: data.tcustomervs1[i].Street2 || ' ',
                            street3: data.tcustomervs1[i].Street3 || ' ',
                            suburb: data.tcustomervs1[i].Suburb || data.tcustomervs1[i].Street2,
                            phone: data.tcustomervs1[i].Phone || ' ',
                            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                            country: data.tcustomervs1[i].Country || ' ',
                            termsName: data.tcustomervs1[i].TermsName || ''
                        };
                        //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                        clientList.push(customerrecordObj);

                        //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                    }
                    templateObject.clientrecords.set(clientList);
                    templateObject.clientrecords.set(clientList.sort(function (a, b) {
                            if (a.customername == 'NA') {
                                return 1;
                            } else if (b.customername == 'NA') {
                                return -1;
                            }
                            return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                        }));

                    for (var i = 0; i < clientList.length; i++) {
                        $('#customer').editableSelect('add', clientList[i].customername);
                    }

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                for (let i in useData) {

                    let customerrecordObj = {
                        customerid: useData[i].fields.ID || ' ',
                        customername: useData[i].fields.ClientName || ' ',
                        customeremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street.replace(/(?:\r\n|\r|\n)/g, ', ') || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || data.tcustomervs1[i].Street2,
                        phone: useData[i].fields.Phone || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || ''
                    };
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                }
                templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                for (var i = 0; i < clientList.length; i++) {
                    $('#customer').editableSelect('add', clientList[i].customername);
                }

            }
        }).catch(function (err) {
            clientsService.getClientVS1().then(function (data) {
                for (let i in data.tcustomervs1) {

                    let customerrecordObj = {
                        customerid: data.tcustomervs1[i].Id || ' ',
                        customername: data.tcustomervs1[i].ClientName || ' ',
                        customeremail: data.tcustomervs1[i].Email || ' ',
                        street: data.tcustomervs1[i].Street.replace(/(?:\r\n|\r|\n)/g, ', ') || ' ',
                        street2: data.tcustomervs1[i].Street2 || ' ',
                        street3: data.tcustomervs1[i].Street3 || ' ',
                        suburb: data.tcustomervs1[i].Suburb || data.tcustomervs1[i].Street2,
                        phone: data.tcustomervs1[i].Phone || ' ',
                        statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                        country: data.tcustomervs1[i].Country || ' ',
                        termsName: data.tcustomervs1[i].TermsName || ''
                    };
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                }
                templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                for (var i = 0; i < clientList.length; i++) {
                    $('#customer').editableSelect('add', clientList[i].customername);
                }

            });
        });

    };
    templateObject.getAllClients();
    //get employee data to auto fill data on new appointment
    function populateEmployDetails(employeeName) {
        document.getElementById("employee_name").value = employeeName;
    }

    $('#customer').editableSelect()
    .on('select.editable-select', function (e, li) {
        //let selectedCustomer = li.text();
        var custName = li.text();
        var newJob = clientList.filter(function (customer) {
            return customer.customername == custName;
        });

        document.getElementById("customer").value = newJob[0].customername || '';
        document.getElementById("phone").value = newJob[0].phone || '';
        document.getElementById("mobile").value = newJob[0].phone || '';
        document.getElementById("state").value = newJob[0].country || '';
        document.getElementById("address").value = newJob[0].street || '';
        // document.getElementById("txtNotes").value = $(this).find(".colNotes").text();
        document.getElementById("suburb").value = newJob[0].suburb || '';
        document.getElementById("zip").value = newJob[0].statecode || '0';
    });

    getHours = function (start, end) {
        var hour = 0;
        hour = parseInt(start.split(':')[0]) - parseInt(end.split(':')[0]);
        var min = parseInt(start.split(':')[1]) + parseInt(end.split(':')[1]);
        var checkmin = parseInt(start.split(':')[1]) - parseInt(end.split(':')[1]);
        if (parseInt(start.split(':')[1]) > parseInt(end.split(':')[1])) {
            checkmin = parseInt(start.split(':')[1]) - parseInt(end.split(':')[1]);
        } else if (parseInt(end.split(':')[1]) > parseInt(start.split(':')[1])) {
            checkmin = parseInt(end.split(':')[1]) - parseInt(start.split(':')[1])
        }

        if (checkmin == 0) {
            hour += 1;
        } else if (checkmin > 0) {
            hour += 1;
        } else if (min == 60) {
            hour += 1;
        }
        return hour
    }

    // BEGIN DATE CODE
    $(".formClassDate").datepicker({
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
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    $('.formClassDate').val(begunDate);

    $(document).on("dblclick", "#tblEmployeeSideList tbody tr", function () {
        var listData = this.id;
        if (listData) {
            FlowRouter.go('/employeescard?id=' + listData);
        }
    });

    $(document).on("mouseenter", "#tblEmployeeSideList tbody tr", function () {
        let calOptions = templateObject.globalSettings.get();
        let draggedEmployeeID = templateObject.empID.get();
        let employee = templateObject.employeerecords.get();
        let overridesettings = employee.filter(employeeData => {
            return employeeData.id == parseInt(this.id);
        });

        let empData = templateObject.employeeOptions.get().filter(emp => {
            return emp.EmployeeID == parseInt(this.id);
        });

        if (overridesettings[0].override == "" || overridesettings[0].override == "false") {
            templateObject.empDuration.set(calOptions.DefaultApptDuration);
        } else {
            templateObject.empDuration.set(empData[empData.length - 1].DefaultApptDuration || '1');
        }
    });

    $(document).on("click", ".appointmentCustomer #tblCustomerlist tbody tr", function (e) {
        document.getElementById("customer").value = $(this).find(".colCompany").text();
        document.getElementById("phone").value = $(this).find(".colPhone").text();
        document.getElementById("mobile").value = $(this).find(".colPhone").text();
        document.getElementById("state").value = $(this).find(".colState").text();
        document.getElementById("country").value = $(this).find(".colCountry").text();
        document.getElementById("address").value = $(this).find(".colStreetAddress").text().replace(/(?:\r\n|\r|\n)/g, ', ');
        if (Session.get('CloudAppointmentNotes') == true) {
            document.getElementById("txtNotes").value = $(this).find(".colNotes").text();
        }
        document.getElementById("suburb").value = $(this).find(".colCity").text();
        document.getElementById("zip").value = $(this).find(".colZipCode").text();
        let appointmentService = new AppointmentService();
        appointmentService.getAllAppointmentListCount().then(function (data) {
            if (data.tappointmentex.length > 0) {
                let max = 1;
                for (let i = 0; i < data.tappointmentex.length; i++) {
                    if (data.tappointmentex[i].Id > max) {
                        max = data.tappointmentex[i].Id;
                    }
                }
                document.getElementById("appID").value = max + 1;

            } else {
                document.getElementById("appID").value = 1;
            }
        });
        templateObject.getAllProductData();
        $('#customerListModal').modal('hide');
        $('#event-modal').modal();
    });

    $(document).on("click", ".btnoptionsmodal", function (e) {
        templateObject.getAllProductData();
        $('#settingsModal').modal('toggle');
    });

    var dragged;
    var draggedTd;
    var draggedTr;
    /* events fired on the draggable target */
    document.addEventListener("drag", function (event) {
        //event.dataTransfer.setData('text/plain', event.target.id);
    }, false);

    document.addEventListener("dragstart", function (event) {
        // store a ref. on the dragged elem
        dragged = event.target;

        event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", function (event) {
        // reset the transparency
        event.target.style.opacity = "";
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", function (event) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function (event) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "#99ccff";
        }

    }, false);

    document.addEventListener("dragleave", function (event) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "";
        }

    }, false);

    document.addEventListener("drop", function (event) {
        let appointmentService = new AppointmentService();
        event.preventDefault();
        draggedTd = $(event.target).closest('td');
        draggedTr = $(event.target).closest('tr');
        let getTdClass = $(event.target).closest('td').attr('class').toLowerCase();
        let allocDate = '';
        //$('#allocationTable').find('th').eq(draggedTd.index()).attr('id');
        if (getTdClass.includes('sunday')) {
            allocDate = $('#allocationTable').find('th.sunday').attr('id');
        } else if (getTdClass.includes('monday')) {
            allocDate = $('#allocationTable').find('th.monday').attr('id');
        } else if (getTdClass.includes('tuesday')) {
            allocDate = $('#allocationTable').find('th.tuesday').attr('id');
        } else if (getTdClass.includes('wednesday')) {
            allocDate = $('#allocationTable').find('th.wednesday').attr('id');
        } else if (getTdClass.includes('thursday')) {
            allocDate = $('#allocationTable').find('th.thursday').attr('id');
        } else if (getTdClass.includes('friday')) {
            allocDate = $('#allocationTable').find('th.friday').attr('id');
        } else if (getTdClass.includes('saturday')) {
            allocDate = $('#allocationTable').find('th.saturday').attr('id');
        }
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "";
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
        }
        var id = dragged.id;

        let employeeName = draggedTr.attr('id');
        var appointmentData = templateObject.appointmentrecords.get();

        var updateData = appointmentData.filter(apmt => {
            return apmt.id == id;
        });

        let index = appointmentData.map(function (e) {
            return e.id;
        }).indexOf(parseInt(id));
        let calendarSet = templateObject.globalSettings.get();
        let hideDays = '';
        let slotMin = "06:00:00";
        let slotMax = "21:00:00";
        if (calendarSet.showSat == false) {
            hideDays = [6];
        }

        if (calendarSet.apptStartTime) {
            slotMin = calendarSet.apptStartTime;
        }

        if (calendarSet.apptEndTime) {
            slotMax = calendarSet.apptEndTimeCal;
        }

        if (calendarSet.showSun == false) {
            hideDays = [0];
        }

        if (calendarSet.showSat == false && calendarSet.showSun == false) {
            hideDays = [0, 6];
        }

        if (updateData.length > 0) {

            objectData = {
                type: "TAppointmentEx",
                fields: {
                    Id: parseInt(id) || 0,
                    StartTime: allocDate + ' ' + updateData[0].startDate.split(' ')[1] || '',
                    EndTime: allocDate + ' ' + updateData[0].endDate.split(' ')[1] || '',
                    TrainerName: employeeName || '',

                }
            }

            appointmentService.saveAppointment(objectData).then(function (data) {
                let calendarSet = templateObject.calendarOptions.get();
                appointmentList[index].employeename = employeeName;
                let eventIndex = updateCalendarData.map(function (e) {
                    return e.id;
                }).indexOf(id);
                updateCalendarData[eventIndex].start = allocDate + ' ' + updateCalendarData[eventIndex].start.split(' ')[1];
                updateCalendarData[eventIndex].end = allocDate + ' ' + updateCalendarData[eventIndex].end.split(' ')[1];
                appointmentData[index].startDate = allocDate + ' ' + updateCalendarData[eventIndex].start.split(' ')[1];
                appointmentData[index].endDate = allocDate + ' ' + updateCalendarData[eventIndex].end.split(' ')[1];
                templateObject.appointmentrecords.get(appointmentData);
                var calendarEl = document.getElementById('calendar');
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("YYYY-MM-DD");
                //if(eventData.length > 0){
                var calendar = new Calendar(calendarEl, {
                    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                    themeSystem: 'bootstrap',
                    initialView: 'timeGridWeek',
                    hiddenDays: hideDays, // hide Sunday and Saturday
                    customButtons: {
                        appointments: {
                            text: 'Appointment List',
                            click: function () {
                                //window.open('/appointmentlist', '_self');
                                FlowRouter.go('/appointmentlist');
                            }
                        },
                        allocation: {
                            text: 'Allocations',
                            click: function () {
                                $('#allocationModal').modal();
                            }
                        }
                    },
                    headerToolbar: {
                        left: 'prev,next today appointments allocation',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    slotMinTime: slotMin,
                    slotMaxTime: slotMax,
                    initialDate: begunDate,
                    navLinks: true, // can click day/week names to navigate views
                    selectable: true,
                    selectMirror: true,
                    dayHeaderFormat: function (date) {
                        if (LoggedCountry == "United States") {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                        } else {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                        }
                    },
                    select: function (info) {
                        $('#frmAppointment')[0].reset();
                        $(".paused").hide();
                        templateObject.getAllProductData();
                        let dateStart = new Date(info.start);
                        let dateEnd = new Date(info.end);
                        let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                        let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                        dateEnd.setHours(dateEnd.getHours() + calendarSet.DefaultApptDuration || "02:00");
                        let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                        let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                        document.getElementById("dtSODate").value = startDate;
                        document.getElementById("dtSODate2").value = endDate;
                        document.getElementById("startTime").value = startTime;
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                        if (calendarSet.DefaultApptDuration) {
                            document.getElementById("txtBookedHoursSpent").value = calendarSet.DefaultApptDuration;
                        } else {
                            document.getElementById("txtBookedHoursSpent").value = templateObject.diff_hours(dateStart, dateEnd);
                        }
                        templateObject.attachmentCount.set('');
                        templateObject.uploadedFiles.set('');
                        templateObject.uploadedFile.set('')
                        $('#customerListModal').modal();
                    },
                    eventClick: function (info) {
                        document.getElementById("frmAppointment").reset();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartActualTime").prop("disabled", false);
                        $("#btnEndActualTime").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        var hours = '0';
                        var id = info.event.id;
                        var appointmentData = appointmentList;

                        var result = appointmentData.filter(apmt => {
                            return apmt.id == id
                        });
                        if (result.length > 0) {
                            templateObject.getAllProductData();
                            if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                                var startTime = moment(result[0].aStartDate + ' ' + result[0].aStartTime);
                                var endTime = moment(result[0].aEndDate + ' ' + result[0].aEndTime);
                                var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                                hours = duration.asHours();
                            }
                            if (result[0].isPaused == "Paused") {
                                $(".paused").show();
                                $("#btnHold").prop("disabled", true);
                            } else {
                                $(".paused").hide();
                                $("#btnHold").prop("disabled", false);
                            }
                            if (result[0].aEndTime != "") {
                                $("#btnHold").prop("disabled", true);
                                $("#btnStartActualTime").prop("disabled", true);
                                $("#btnEndActualTime").prop("disabled", true);
                                $("#startTime").prop("disabled", true);
                                $("#endTime").prop("disabled", true);
                                $("#tActualStartTime").prop("disabled", true);
                                $("#tActualEndTime").prop("disabled", true);
                                $("#txtActualHoursSpent").prop("disabled", true);
                            }
                            document.getElementById("aStartDate").value = result[0].aStartDate || '';
                            document.getElementById("updateID").value = result[0].id || 0;
                            document.getElementById("appID").value = result[0].id;
                            document.getElementById("customer").value = result[0].accountname;
                            document.getElementById("phone").value = result[0].phone;
                            document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            document.getElementById("state").value = result[0].state;
                            document.getElementById("address").value = result[0].street;
                            if (Session.get('CloudAppointmentNotes') == true) {
                                document.getElementById("txtNotes").value = result[0].notes;
                            }
                            document.getElementById("suburb").value = result[0].suburb;
                            document.getElementById("zip").value = result[0].zip;
                            document.getElementById("country").value = result[0].country;
                            $('#product-list').prepend('<option value="' + result[0].product + '">' + result[0].product + '</option>');
                            document.getElementById("employee_name").value = result[0].employeename;
                            document.getElementById("dtSODate").value = result[0].startDate.split(' ')[0];
                            document.getElementById("dtSODate2").value = result[0].endDate.split(' ')[0];
                            document.getElementById("startTime").value = result[0].startTime;
                            document.getElementById("endTime").value = result[0].endTime;
                            document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            document.getElementById("tActualEndTime").value = result[0].aEndTime;
                            document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                            templateObject.attachmentCount.set(0);
                            if (result[0].attachments) {
                                if (result.length) {
                                    templateObject.attachmentCount.set(result[0].attachments.length);
                                    templateObject.uploadedFiles.set(result[0].attachments);
                                }
                            }
                            $('#event-modal').modal();
                            // this.$body.addClass('modal-open');
                        }
                    },
                    editable: true,
                    droppable: true, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    eventDrop: function (info) {
                        if (info.event._def.publicId != "") {
                            let appointmentData = templateObject.appointmentrecords.get();
                            let resourceData = templateObject.resourceAllocation.get();
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let index = appointmentData.map(function (e) {
                                return e.id;
                            }).indexOf(parseInt(eventDropID));
                            let resourceIndex = resourceData.map(function (e) {
                                return e.employeeName;
                            }).indexOf(appointmentData[index].employeename);
                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointmentEx",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }
                                let nameid = appointmentData[index].employeename.replace(' ', '-');
                                $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace(' ', '-'));
                                let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                let day = moment(startDate).format('dddd').toLowerCase();
                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    appointmentData[index].startDate = startDate + ' ' + startTime;
                                    appointmentData[index].endDate = endDate + ' ' + endTime;
                                    templateObject.appointmentrecords.set(appointmentData);

                                    $('#' + nameid + ' .' + day + ' .droppable').append(job);
                                    $('#' + eventDropID).remove();
                                    $('#allocationTable tbody tr').attr('id', $('#allocationTable tbody tr').attr('id').replace('-', ' '));
                                    sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {}).catch(function (err) {});
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    //window.open('/appointments', '_self');
                                });
                            }
                        }

                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
                        let draggedEmployeeID = templateObject.empID.get();
                        let calendarData = templateObject.employeeOptions.get();
                        let calendarSet = templateObject.globalSettings.get();
                        let employees = templateObject.employeerecords.get();
                        let overridesettings = employees.filter(employeeData => {
                            return employeeData.id == parseInt(draggedEmployeeID)
                        });

                        let empData = calendarData.filter(calendarOpt => {
                            return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                        });
                        document.getElementById("frmAppointment").reset();
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartActualTime").prop("disabled", false);
                        $("#btnEndActualTime").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, '');
                        var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                        document.getElementById("dtSODate").value = start;
                        document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                        document.getElementById("startTime").value = startTime;
                        if (overridesettings[0].override == "false") {
                            if (calendarSet.defaultApptDuration) {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(calendarSet.defaultApptDuration), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = calendarSet.defaultApptDuration;
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                            $("#product-list")[0].options[0].selected = true;
                        } else if (overridesettings[0].override == "true") {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            if (empData.length > 0) {
                                $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            } else {
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            }
                        } else {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, 'HH:mm').add(parseInt(templateObject.empDuration.get()), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                document.getElementById("txtBookedHoursSpent").value = templateObject.empDuration.get();
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                                var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                                document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            }
                            if (empData.length > 0) {
                                $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[0].DefaultServiceProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            } else {
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                $("#product-list")[0].options[0].selected = true;
                            }
                        }

                        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        $('#customerListModal').modal();
                    },

                    events: eventData,
                    eventDidMount: function (event) {},
                    eventContent: function (event) {
                        let title = document.createElement('p');
                        if (event.event.title) {
                            title.innerHTML = event.timeText + ' ' + event.event.title;
                            title.style.backgroundColor = event.backgroundColor;
                            title.style.color = "#ffffff";
                        } else {
                            title.innerHTML = event.timeText + ' ' + event.event.title;
                        }

                        let arrayOfDomNodes = [title]
                        return {
                            domNodes: arrayOfDomNodes
                        }
                    }

                });
                calendar.render();

                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {}).catch(function (err) {});
                }).catch(function (err) {});
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {}

    }, false);

    $(document).on("click", "#check-all", function () {
        var checkbox = document.querySelector("#check-all");
        if (checkbox.checked) {
            $(".notevent").prop('checked', true);
        } else {
            $(".notevent").prop('checked', false);
        }
    })

    $(document).ready(function () {
        $("#showSaturday").change(function () {
            var checkbox = document.querySelector("#showSunday");
            var checkboxSaturday = document.querySelector("#showSaturday");
            let calendarSet2 = templateObject.globalSettings.get();
            let slotMin = "06:00:00";
            let slotMax = "21:00:00";

            if (calendarSet2.apptStartTime) {
                slotMin = calendarSet2.apptStartTime;
            }

            if (calendarSet2.apptEndTime) {
                slotMax = calendarSet2.apptEndTimeCal;
            }
            if (checkbox.checked && (checkboxSaturday.checked)) {
                let hideDays = '';
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                $("#allocationTable > thead > tr> th").addClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").addClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");

                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkbox.checked) {
                let hideDays = [6];
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenSundayOrSaturday");
                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);

                }, 50);
            } else if (checkboxSaturday.checked) {
                let hideDays = [0];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenSundayOrSaturday");
                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);

                }, 50);
            } else {
                let hideDays = [0, 6];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").addClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").addClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");

                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);

                }, 50);
            }
        });
        $("#showSunday").change(function () {
            var checkbox = document.querySelector("#showSunday");
            var checkboxSaturday = document.querySelector("#showSaturday");
            let calendarSet2 = templateObject.globalSettings.get();
            let slotMin = "06:00:00";
            let slotMax = "21:00:00";

            if (calendarSet2.apptStartTime) {
                slotMin = calendarSet2.apptStartTime;
            }

            if (calendarSet2.apptEndTime) {
                slotMax = calendarSet2.apptEndTimeCal;
            }

            if (checkbox.checked && (checkboxSaturday.checked)) {
                let hideDays = '';
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                $("#allocationTable > thead > tr> th").addClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").addClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");

                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkbox.checked) {
                let hideDays = [6];
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenSundayOrSaturday");
                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkboxSaturday.checked) {
                let hideDays = [0];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenSundayOrSaturday");
                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else {
                let hideDays = [0, 6];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").addClass("fullWeek");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
                $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td").addClass("fullWeek");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

                $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
                $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");

                setTimeout(function () {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            }
        });

    });

});

Template.appointments.events({
    'click #deleteAll': function () {
        var erpGet = erpDb();
        swal({
            title: 'Delete Appointment',
            text: "Are you sure you want to Delete this Appointment & the following Appointments??",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                if ($("#updateID").val() != "") {
                    $('.fullScreenSpin').css('display', 'block');
                    let id = $("#updateID").val();
                    let data = {
                        Name: "VS1_DeleteAllAppts",
                        Params: {
                            AppointID: parseInt(id)
                        }
                    }
                    var myString = '"JsonIn"' + ':' + JSON.stringify(data);
                    var oPost = new XMLHttpRequest();
                    oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_DeleteAllAppts"', true);
                    oPost.setRequestHeader("database", erpGet.ERPDatabase);
                    oPost.setRequestHeader("username", erpGet.ERPUsername);
                    oPost.setRequestHeader("password", erpGet.ERPPassword);
                    oPost.setRequestHeader("Accept", "application/json");
                    oPost.setRequestHeader("Accept", "application/html");
                    oPost.setRequestHeader("Content-type", "application/json");
                    // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
                    oPost.send(myString);

                    oPost.onreadystatechange = function () {

                        if (oPost.readyState == 4 && oPost.status == 200) {
                            var myArrResponse = JSON.parse(oPost.responseText);
                            if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                        window.open('/appointments', '_self');
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                });
                            } else {
                                $('.modal-backdrop').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oooops...',
                                    text: myArrResponse.ProcessLog.ResponseStatus,
                                    type: 'warning',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
                                });
                            }

                        } else if (oPost.readyState == 4 && oPost.status == 403) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                        } else if (oPost.readyState == 4 && oPost.status == 406) {
                            $('.fullScreenSpin').css('display', 'none');
                            var ErrorResponse = oPost.getResponseHeader('errormessage');
                            var segError = ErrorResponse.split(':');

                            if ((segError[1]) == ' "Unable to lock object') {

                                swal({
                                    title: 'Oooops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
                                });
                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oooops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
                                });
                            }

                        } else if (oPost.readyState == '') {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                        }

                    }
                } else {
                    swal({
                        title: 'Oooops...',
                        text: "Appointment Does Not Exist",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });

                }
            }
        })
    },
    'click .droppable': function (event) {
        let templateObject = Template.instance();
        let calOptions = templateObject.globalSettings.get();
        $('#frmAppointment')[0].reset();
        let element = $(event.target);
        if (element.is("p") || element.is(".card-body")) {
            var id = parseInt($(event.target).closest('.card').attr('id'));
            var appointmentData = templateObject.appointmentrecords.get();
            var result = appointmentData.filter(apmt => {
                return apmt.id == id
            });
            let hours = 0;
            if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                hours = duration.asHours();
            }

            if (result[0].isPaused == "Paused") {
                $(".paused").show();
                $("#btnHold").prop("disabled", true);
            } else {
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
            }
            $(".paused").hide();
            $("#btnHold").prop("disabled", false);
            $("#btnStartActualTime").prop("disabled", false)
            $("#btnEndActualTime").prop("disabled", false);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#tActualStartTime").prop("disabled", false);
            $("#tActualEndTime").prop("disabled", false);
            $("#txtActualHoursSpent").prop("disabled", false);
            if (result[0].aEndTime != "") {
                $("#btnHold").prop("disabled", true);
                $("#btnStartActualTime").prop("disabled", true);
                $("#btnEndActualTime").prop("disabled", true);
                $("#startTime").prop("disabled", true)
                $("#endTime").prop("disabled", true);
                $("#tActualStartTime").prop("disabled", true);
                $("#tActualEndTime").prop("disabled", true);
                $("#txtActualHoursSpent").prop("disabled", true);
            }
            templateObject.getAllProductData();
            document.getElementById("aStartDate").value = result[0].aStartDate || 0;
            document.getElementById("updateID").value = result[0].id || 0;
            document.getElementById("appID").value = result[0].id;
            document.getElementById("customer").value = result[0].accountname;
            document.getElementById("phone").value = result[0].phone;
            document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
            document.getElementById("state").value = result[0].state;
            document.getElementById("address").value = result[0].street;
            if (Session.get('CloudAppointmentNotes') == true) {
                document.getElementById("txtNotes").value = result[0].notes;
            }
            document.getElementById("suburb").value = result[0].suburb;
            document.getElementById("zip").value = result[0].zip;
            document.getElementById("country").value = result[0].country;
            $('#product-list').prepend('<option value="' + result[0].product + '">' + result[0].product + '</option>');
            document.getElementById("employee_name").value = result[0].employeename;
            document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
            document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
            document.getElementById("startTime").value = result[0].startTime;
            document.getElementById("endTime").value = result[0].endTime;
            document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
            document.getElementById("tActualStartTime").value = result[0].aStartTime;
            document.getElementById("tActualEndTime").value = result[0].aEndTime;
            document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';
            $('#event-modal').modal();
        } else {
            let bookingDate = new Date();
            let startTime = ("0" + bookingDate.getHours()).slice(-2) + ":" + ("0" + bookingDate.getMinutes()).slice(-2);
            let defaultDuration = parseInt(calOptions.DefaultApptDuration) || 2;
            bookingDate.setHours(bookingDate.getHours() + defaultDuration);
            let endTime = ("0" + bookingDate.getHours()).slice(-2) + ":" + ("0" + bookingDate.getMinutes()).slice(-2);
            let name = $(event.target).closest('tr').attr('id');
            var date = $(event.target).closest('#allocationTable').find('th').eq($(event.target).closest('td').index()).attr('id');
            $("#dtSODate").val(moment(date).format('DD/MM/YYYY'))
            $("#dtSODate2").val(moment(date).format('DD/MM/YYYY'))
            $("#txtBookedHoursSpent").val(defaultDuration);
            $("#startTime").val(startTime);
            $("#endTime").val(endTime);
            $("#employee_name").val(name);
            if (calOptions.defaultProduct != "") {
                $('#product-list').prepend('<option value="' + calOptions.productID + '" selected>' + calOptions.defaultProduct + '</option>');

            } else {
                $('#product-list').prop('selectedIndex', -1);
            }
            $(".paused").hide();
            $("#btnHold").prop("disabled", false);
            $("#btnStartActualTime").prop("disabled", false)
            $("#btnEndActualTime").prop("disabled", false);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#tActualStartTime").prop("disabled", false);
            $("#tActualEndTime").prop("disabled", false);
            $("#txtActualHoursSpent").prop("disabled", false);
            $('#customerListModal').modal();
        }

    },
    'click .img_new_attachment_btn': function (event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get() || [];
        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .file-name': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .closeModal': function (event) {
        $('#myModalAttachment').modal('hide');
    },
    'click .closeView': function (event) {
        $('#files_view').modal('hide');
    },
    'click .calendar .days li': function (event) {
        FlowRouter.go('/newappointments');
    },
    'change #frequency': function () {
        let templateObject = Template.instance();
        let period = $('#period').val();
        let frequency = parseInt($('#frequency').val());

        var date = new Date();
        // $('#occurrences').val(frequency);
        if (!isNaN(frequency)) {
            if (period.toLowerCase() == "days") {
                let dayObj = {
                    saturday: 0,
                    sunday: 0,
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0
                };
                templateObject.repeatDays.set(dayObj)
                $('.radioLabel').removeClass("day-active");
                $('.radioLabel').addClass("normal-day");
                $('.select-size').hide();
                $('.repeatOn').hide();
                date.setDate(date.getDate() + frequency);
                let newDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "weeks") {
                $('.select-size').show();
                $('.repeatOn').show();
                let days = frequency * 7;
                date.setDate(date.getDate() + days);
                let newDate = ("0" + (date.getDate())).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "months") {
                $('.select-size').show();
                $('.repeatOn').show();
                date.setDate(date.getMonth() + frequency);
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            }
        }

    },
    'change #period': function () {
        let templateObject = Template.instance();
        let period = $('#period').val();
        let frequency = parseInt($('#frequency').val());
        var date = new Date();
        if (!isNaN(frequency)) {
            if (period.toLowerCase() == "days") {
                $('#occurrences').val(frequency);
                let dayObj = {
                    saturday: 0,
                    sunday: 0,
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0
                };
                templateObject.repeatDays.set(dayObj)
                $('.radioLabel').removeClass("day-active");
                $('.radioLabel').addClass("normal-day");
                $('.select-size').hide();
                $('.repeatOn').hide();
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "weeks") {
                $('.select-size').show();
                $('.repeatOn').show();
                days = frequency * 7;
                date.setDate(date.getDate() + days);
                let newDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "months") {
                $('.select-size').show();
                $('.repeatOn').show();
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + (1 + frequency))).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            }
        }
    },
    'click #btn_Attachment': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
            $(".attchment-tooltip").show();
        }
    },
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get() || [];
        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
                'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .confirm-delete-attachment': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'change #formCheck-on': function () {
        if ($('#formCheck-on').is(":checked")) {
            $("#formCheck-after").prop("checked", false);
        }
    },
    'change #formCheck-after': function () {
        if ($('#formCheck-after').is(":checked")) {
            $("#formCheck-on").prop("checked", false);
        }
    },
    'click #copyappointment': function (event) {
        let date = new Date();
        $("#startDate").val(("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear());
        $("#endDate").val(("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear())
        $('#frmNewDate').modal();
        $('#frmOptions').modal('hide');
    },
    'click .radioLabel': function (event) {
        let templateObject = Template.instance();
        let daysObj = templateObject.repeatDays.get();
        let id = $(event.target).attr('for');
        let check = $(event.target).hasClass("day-active");
        if (check == true) {
            $(event.target).removeClass("day-active");
            $(event.target).addClass("normal-day");
            if (id == 'monday') {
                daysObj.monday = 0;
            } else if (id == 'tuesday') {
                daysObj.tuesday = 0;
            } else if (id == 'wednesday') {
                daysObj.wednesday = 0;
            } else if (id == 'thursday') {
                daysObj.thursday = 0;
            } else if (id == 'friday') {
                daysObj.friday = 0;
            } else if (id == 'saturday') {
                daysObj.saturday = 0;
            } else if (id == 'sunday') {
                daysObj.sunday = 0;
            }
            templateObject.repeatDays.set(daysObj);

        } else {
            $(event.target).removeClass("normal-day");
            $(event.target).addClass("day-active");
            if (id == 'monday') {
                daysObj.monday = 1;
            } else if (id == 'tuesday') {
                daysObj.tuesday = 1;
            } else if (id == 'wednesday') {
                daysObj.wednesday = 1;
            } else if (id == 'thursday') {
                daysObj.thursday = 1;
            } else if (id == 'friday') {
                daysObj.friday = 1;
            } else if (id == 'saturday') {
                daysObj.saturday = 1;
            } else if (id == 'sunday') {
                daysObj.sunday = 1;
            }
            templateObject.repeatDays.set(daysObj);
        }

    },
    'click #btnSaveRepeat': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let repeatDays = templateObject.repeatDays.get();
        let appointmentService = new AppointmentService();
        let days = [];
        week_day = "";
        let frequency = parseInt($('#frequency').val()) || 1;
        let period = $('#period').val();
        if (period.toLowerCase() == "days") {
            period = 0;
        } else if (period.toLowerCase() == "weeks") {
            period = 1;
        } else if (period.toLowerCase() == "months") {
            period = 2;
        }

        if (repeatDays.sunday == 1) {
            days.push(0);
        }

        if (repeatDays.monday == 1) {
            days.push(1);
        }

        if (repeatDays.tuesday == 1) {
            days.push(2);
        }

        if (repeatDays.wednesday == 1) {
            days.push(3);
        }

        if (repeatDays.thursday == 1) {
            days.push(4);
        }

        if (repeatDays.friday == 1) {
            days.push(5);
        }

        if (repeatDays.saturday == 1) {
            days.push(6);
        }

        // if(days.length > 1){
        //     week_day = days;
        // } else if(days.length == 1){
        //     week_day = parseInt(days[0].toString());
        // } else{
        //         week_day = 0;
        // }
        let id = $('#updateID').val() || 0;
        var endDateGet = new Date($("#finalDate").datepicker("getDate"));
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
        let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
        var erpGet = erpDb();
        if (days.length > 0) {
            for (let x = 0; x < days.length; x++) {
                let dayObj = {
                    Name: "VS1_RepeatAppointment",
                    Params: {
                        CloudUserName: erpGet.ERPUsername,
                        CloudPassword: erpGet.ERPPassword,
                        AppointID: parseInt(id),
                        Repeat_Frequency: frequency,
                        Repeat_Period: period,
                        Repeat_BaseDate: startDate,
                        Repeat_finalDateDate: endDate,
                        Repeat_Saturday: repeatDays.saturday,
                        Repeat_sunday: repeatDays.sunday,
                        Repeat_Monday: repeatDays.monday,
                        Repeat_Tuesday: repeatDays.tuesday,
                        Repeat_Wednesday: repeatDays.wednesday,
                        Repeat_Thursday: repeatDays.thursday,
                        Repeat_Friday: repeatDays.friday,
                        Repeat_holiday: 0,
                        Repeat_Weekday: parseInt(days[x].toString()),
                        Repeat_MonthOffset: 0

                    }
                };
                var myString = '"JsonIn"' + ':' + JSON.stringify(dayObj);
                var oPost = new XMLHttpRequest();
                oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"', true);
                oPost.setRequestHeader("database", erpGet.ERPDatabase);
                oPost.setRequestHeader("username", erpGet.ERPUsername);
                oPost.setRequestHeader("password", erpGet.ERPPassword);
                oPost.setRequestHeader("Accept", "application/json");
                oPost.setRequestHeader("Accept", "application/html");
                oPost.setRequestHeader("Content-type", "application/json");
                oPost.send(myString);

                oPost.onreadystatechange = function () {

                    if (oPost.readyState == 4 && oPost.status == 200) {
                        var myArrResponse = JSON.parse(oPost.responseText);
                        if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                            if (x == (days.length - 1)) {
                                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                        window.open('/appointments', '_self');
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                });
                            }
                        } else {
                            $('.modal-backdrop').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oooops...',
                                text: myArrResponse.ProcessLog.ResponseStatus,
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                        }

                    } else if (oPost.readyState == 4 && oPost.status == 403) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    } else if (oPost.readyState == 4 && oPost.status == 406) {
                        $('.fullScreenSpin').css('display', 'none');
                        var ErrorResponse = oPost.getResponseHeader('errormessage');
                        var segError = ErrorResponse.split(':');

                        if ((segError[1]) == ' "Unable to lock object') {

                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                        }

                    } else if (oPost.readyState == '') {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    }

                }
            }
        } else {
            let dayObj = {
                Name: "VS1_RepeatAppointment",
                Params: {
                    CloudUserName: erpGet.ERPUsername,
                    CloudPassword: erpGet.ERPPassword,
                    AppointID: parseInt(id),
                    Repeat_Frequency: frequency,
                    Repeat_Period: period,
                    Repeat_BaseDate: startDate,
                    Repeat_finalDateDate: endDate,
                    Repeat_Saturday: repeatDays.saturday,
                    Repeat_sunday: repeatDays.sunday,
                    Repeat_Monday: repeatDays.monday,
                    Repeat_Tuesday: repeatDays.tuesday,
                    Repeat_Wednesday: repeatDays.wednesday,
                    Repeat_Thursday: repeatDays.thursday,
                    Repeat_Friday: repeatDays.friday,
                    Repeat_holiday: 0,
                    Repeat_Weekday: 0,
                    Repeat_MonthOffset: 0

                }
            };
            var myString = '"JsonIn"' + ':' + JSON.stringify(dayObj);
            var oPost = new XMLHttpRequest();
            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"', true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
            oPost.send(myString);

            oPost.onreadystatechange = function () {

                if (oPost.readyState == 4 && oPost.status == 200) {
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                window.open('/appointments', '_self');
                            }).catch(function (err) {
                                window.open('/appointments', '_self');
                            });
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        });
                    } else {
                        $('.modal-backdrop').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');

                    if ((segError[1]) == ' "Unable to lock object') {

                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == '') {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                }

            }
        }

    },
    'click #createInvoice': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        const templateObject = Template.instance();
        let id = $('#updateID').val();
        if (id == "") {
            swal('Please Save Appointment Before Creating an Invoice For it', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
        } else {
            let obj = {
                AppointID: parseInt(id)
            }
            JsonIn = {
                Params: {
                    AppointIDs: [obj]
                }
            };
            let appointmentService = new AppointmentService();
            var erpGet = erpDb();
            var oPost = new XMLHttpRequest();
            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"', true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
            oPost.send(JSON.stringify(JsonIn));

            oPost.onreadystatechange = function () {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    $('.fullScreenSpin').css('display', 'none');
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        let objectDataConverted = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(id),
                                Status: "Converted"
                            }
                        };
                        appointmentService.saveAppointment(objectDataConverted).then(function (data) {
                            $('.modal-backdrop').css('display', 'none');
                            FlowRouter.go('/invoicelist?success=true');
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                        templateObject.getAllAppointmentDataOnConvert();

                    } else {
                        $('.modal-backdrop').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');

                    if ((segError[1]) == ' "Unable to lock object') {

                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == '') {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                }

            }
        }

    },
    'click .btnAppointmentList': function (event) {
        $('.modal-backdrop').css('display', 'none');
        let id = $('#updateID').val();
        if (id) {
            FlowRouter.go('/appointmenttimelist?id=' + id);
        } else {
            swal({
                title: 'Appointment does not exist, create one first to view Appointment Timelist',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            });
        }
    },
    'click #prev': function () {
        let templateObject = Template.instance();
        changeAppointmentView = templateObject.appointmentrecords.get();
        let seeOwnAllocations = Session.get('CloudAppointmentSeeOwnAllocationsOnly') || false;
        let seeOwnAppointments = Session.get('CloudAppointmentSeeOwnAppointmentsOnly') || false;
        //get current week monday date to use it to search week in month
        let weekDate = moment($('.saturday').attr('id')).format("YYYY/MM/DD");

        //get weeks of the month from a template object
        weeksOfThisMonth = templateObject.weeksOfMonth.get();
        //Since we have all weeks of the month we query the weeks of the month object for data to get current week
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });

        let selectedWeekEnd = getSelectedWeek[0].end;
        if (getSelectedWeek.length < 2) {}
        else {
            selectedWeekEnd = getSelectedWeek[1].end;
        }

        //we then get index of the week in resource view so that we can use it to query the previous week
        let index = weeksOfThisMonth.map(function (e) {
            return e.end;
        }).indexOf(selectedWeekEnd);
        if (index === 0) {
            $('.btnPrev').attr('disabled', 'disabled');
        } else {
            $('.btnNext').removeAttr('disabled');
            let dayOfWeek = weeksOfThisMonth[index - 1].dates[0];
            let dayOfWeekEnd = weeksOfThisMonth[index - 1].dates[weeksOfThisMonth[index - 1].dates.length - 1];
            if (dayOfWeek < 10) {
                dayOfWeek = '0' + dayOfWeek;
            }
            let dayPrev = [];

            let getDate = new Date();
            let weekendStart = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + dayOfWeek).format('YYYY-MM-DD');
            let weekendStartListener = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth())).slice(-2) + '-' + dayOfWeek).format('YYYY-MM-DD');
            let startWeek = new Date(weekendStart);
            if (index == 1 && moment(weekendStart).format("DD") != "01") {
                startWeek = new Date(weekendStartListener);
            }
            let weekendEnd = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + dayOfWeekEnd).format('YYYY-MM-DD');
            for (let i = 0; i <= weeksOfThisMonth[index - 1].dates.length; i++) {
                if (index == 1 && moment(weekendStart).format("DD") != "01") {
                    for (let t = 0; t < weeksOfThisMonth[index - 1].dates.length; t++) {
                        if (weeksOfThisMonth[index - 1].dates[0] != 1) {
                            dayPrev.push(moment(weekendStartListener).add(t, 'days').format("YYYY-MM-DD"));
                        } else {
                            dayPrev.push(moment(weekendStart).add(t, 'days').format("YYYY-MM-DD"));
                        }
                    }
                    i = weeksOfThisMonth[index - 1].dates.length;
                } else {
                    dayPrev.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
                }

            }
            let currentDay = moment().format('YYYY-MM-DD');
            templateObject.resourceDates.set(dayPrev);
            //fix the week day

            let endWeek = new Date(weekendEnd);
            let resourceChat = [];
            let resourceJob = [];
            for (let a = 0; a < changeAppointmentView.length; a++) {
                weekDay = moment(changeAppointmentView[a].startDate.split(' ')[0]).format('dddd');
                let date = new Date(changeAppointmentView[a].startDate.split(' ')[0]);
                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if ( seeOwnAppointments == true) {
                            if (changeAppointmentView[a].employeename == Session.get('mySessionEmployee')) {
                                let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == changeAppointmentView[a].employeename
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '#00a3d3';
                                    }

                                    var dataList = {
                                        id: changeAppointmentView[a].id,
                                        employeeName: changeAppointmentView[a].employeename,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                }
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(' ')[0],
                                }

                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }

                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                            }
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(' ')[0],
                            }

                            resourceJob.push(jobs)
                        }
                    }
                } else {
                    if (date >= startWeek && date <= endWeek) {
                        if ( seeOwnAppointments == true) {
                            if (changeAppointmentView[a].employeename == Session.get('mySessionEmployee')) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });

                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }

                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                            }
                        } else {
                            resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });

                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || '#00a3d3';
                            }

                            var dataList = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                color: employeeColor
                            };
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(' ')[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);

                        }
                    }
                }
            }

            let allEmployeesData = templateObject.employeerecords.get();
            for (let e = 0; e < allEmployeesData.length; e++) {
                let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                if (!found) {
                    var dataList = {
                        id: '',
                        employeeName: allEmployeesData[e].employeeName,
                        color: ''
                    };
                    resourceChat.push(dataList);
                }
            }

            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').empty().append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
            $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
            $('#here_table thead tr').append('<th class="employeeName"></th>');

            for (let w = 0; w < daysOfTheWeek.length; w++) {
                if (daysOfTheWeek[w] === "Sunday") {
                    if ($('#showSunday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    }

                } else if (daysOfTheWeek[w] === "Saturday") {
                    if ($('#showSaturday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    }
                } else {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                }

            }

            let tableRowData = [];
            let sundayRowData = [];
            let mondayRowData = [];
            var splashArrayMonday = new Array();
            let tuesdayRowData = [];
            let wednesdayRowData = [];
            let thursdayRowData = [];
            let fridayRowData = [];
            let saturdayRowData = [];
            let sundayRow = '';
            let mondayRow = '';
            let tuesdayRow = '';
            let wednesdayRow = '';
            let thursdayRow = '';
            let fridayRow = '';
            let saturdayRow = '';
            let tableRow = '';
            let saturdayStatus = '';
            let sundayStatus = '';
            for (let r = 0; r < resourceChat.length; r++) {

                sundayRowData = [];
                mondayRowData = [];
                tuesdayRowData = [];
                wednesdayRowData = [];
                thursdayRowData = [];
                fridayRowData = [];
                saturdayRowData = [];
                for (let j = 0; j < resourceJob.length; j++) {

                    if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';
                        sundayRowData.push(sundayRow);
                    }
                    if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        mondayRowData.push(mondayRow);
                    }

                    if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        tuesdayRowData.push(tuesdayRow);
                    }

                    if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        wednesdayRowData.push(wednesdayRow);
                    }

                    if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        thursdayRowData.push(thursdayRow);
                    }

                    if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        fridayRowData.push(fridayRow);
                    }

                    if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        saturdayRowData.push(saturdayRow);
                    }

                }

                if ($('#showSaturday').is(":checked")) {
                    saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                } else {
                    saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                }

                if ($('#showSunday').is(":checked")) {
                    sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                } else {
                    sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                }

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                    sundayStatus + '' +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                    saturdayStatus + '' +
                    '</tr>';
                tableRowData.push(tableRow);

            }
            $('#here_table table').append(tableRowData);

            $('.sunday').attr('id', dayPrev[0]);
            $('.monday').attr('id', dayPrev[1]);
            $('.tuesday').attr('id', dayPrev[2]);
            $('.wednesday').attr('id', dayPrev[3]);
            $('.thursday').attr('id', dayPrev[4]);
            $('.friday').attr('id', dayPrev[5]);
            $('.saturday').attr('id', dayPrev[6]);

            $(".dateMon").text(moment(dayPrev[1]).format("MM/DD"));
            $(".dateTue").text(moment(dayPrev[2]).format("MM/DD"));
            $(".dateWed").text(moment(dayPrev[3]).format("MM/DD"));
            $(".dateThu").text(moment(dayPrev[4]).format("MM/DD"));
            $(".dateFri").text(moment(dayPrev[5]).format("MM/DD"));
            $(".dateSat").text(moment(dayPrev[6]).format("MM/DD"));
            $(".dateSun").text(moment(dayPrev[0]).format("MM/DD"));
            $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(dayPrev[1]).format('DD') + ' - ' + moment(dayPrev[5]).format('DD') + ', ' + moment().format('YYYY'));

            let day = moment().format('dddd');
            let resourceDate = $('thead tr th.' + day.toLowerCase()).attr('id');
            changeColumnColor(resourceDate);

        }

    },
    'click #next': function () {
        let templateObject = Template.instance();
        let seeOwnAllocations = Session.get('CloudAppointmentSeeOwnAllocationsOnly') || false;
        let seeOwnAppointments = Session.get('CloudAppointmentSeeOwnAppointmentsOnly') || false;
        let weekDate = moment($('.monday').attr('id')).format("YYYY/MM/DD");
        weeksOfThisMonth = templateObject.weeksOfMonth.get();
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });
        let index = weeksOfThisMonth.map(function (e) {
            return e.end;
        }).indexOf(getSelectedWeek[0].end);
        if (((index) === (weeksOfThisMonth.length - 1))) {
            $('.btnNext').attr('disabled', 'disabled');

        } else {
            $('.btnPrev').removeAttr('disabled');
            let dayOfWeek = weeksOfThisMonth[index + 1].dates[0];

            let dayOfWeekEnd = weeksOfThisMonth[index + 1].dates[weeksOfThisMonth[index + 1].dates.length - 1];
            if (dayOfWeek < 10) {
                dayOfWeek = '0' + dayOfWeek;
            }

            //let dayOfWeekListerner ="01";
            let dayNext = [];
            let getDate = new Date();
            let weekendStart = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + dayOfWeek).format('YYYY-MM-DD');
            weekendEnd = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + dayOfWeekEnd).format('YYYY-MM-DD');
            let weekendEndListener = moment(getDate.getFullYear() + '-' + ("0" + (getDate.getMonth() + 2)).slice(-2) + '-' + dayOfWeekEnd).format('YYYY-MM-DD');
            let endWeek = new Date(weekendEnd);

            if ((index) === (weeksOfThisMonth.length - 2) && weeksOfThisMonth[index + 1].dates.includes(1)) {
                endWeek = new Date(weekendEndListener);
            }

            for (let i = 0; i <= weeksOfThisMonth[index + 1].dates.length; i++) {
                if ((index) === (weeksOfThisMonth.length - 2) && weeksOfThisMonth[index + 1].dates.includes(1)) {
                    for (let t = 0; t < weeksOfThisMonth[index + 1].dates.length; t++) {
                        dayNext.push(moment(weekendStart).add(t, 'days').format("YYYY-MM-DD"));
                    }
                    i = weeksOfThisMonth[index + 1].dates.length;
                } else {
                    dayNext.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
                }

            }

            // for (i = 0; i <= weeksOfThisMonth[index + 1].dates.length; i++) {
            //     dayNext.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
            // }
            changeAppointmentView = templateObject.appointmentrecords.get();

            //fix the week day
            let startWeek = new Date(weekendStart);
            resourceChat = [];
            resourceJob = [];
            for (let a = 0; a < changeAppointmentView.length; a++) {
                weekDay = moment(changeAppointmentView[a].startDate.split(' ')[0]).format('dddd');
                let date = new Date(changeAppointmentView[a].startDate.split(' ')[0]);

                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if ( seeOwnAppointments == true) {
                            if (changeAppointmentView[a].employeename == Session.get('mySessionEmployee')) {
                                let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == changeAppointmentView[a].employeename
                                    });

                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '#00a3d3';
                                    }
                                    var dataList = {
                                        id: changeAppointmentView[a].id,
                                        employeeName: changeAppointmentView[a].employeename,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                }
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(' ')[0],
                                }

                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });

                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }
                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                            }
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(' ')[0],
                            }

                            resourceJob.push(jobs)

                        }
                    }

                } else {
                    if (date >= startWeek && date <= endWeek) {

                        if ( seeOwnAppointments == true) {
                            if (changeAppointmentView[a].employeename == Session.get('mySessionEmployee')) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });

                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }

                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                            }
                        } else {
                            resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });

                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || '#00a3d3';
                            }

                            var dataList = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                color: employeeColor
                            };
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(' ')[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                        }
                    }
                }
            }

            let allEmployeesData = templateObject.employeerecords.get();
            for (let e = 0; e < allEmployeesData.length; e++) {
                let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                if (!found) {
                    var dataList = {
                        id: '',
                        employeeName: allEmployeesData[e].employeeName,
                        color: ''
                    };
                    resourceChat.push(dataList);
                }
            }

            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').empty().append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
            $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
            $('#here_table thead tr').append('<th class="employeeName"></th>');

            for (let w = 0; w < daysOfTheWeek.length; w++) {
                if (daysOfTheWeek[w] === "Sunday") {
                    if ($('#showSunday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    }

                } else if (daysOfTheWeek[w] === "Saturday") {
                    if ($('#showSaturday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    }
                } else {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                }

            }

            let tableRowData = [];
            let sundayRowData = [];
            let mondayRowData = [];
            var splashArrayMonday = new Array();
            let tuesdayRowData = [];
            let wednesdayRowData = [];
            let thursdayRowData = [];
            let fridayRowData = [];
            let saturdayRowData = [];
            let sundayRow = '';
            let mondayRow = '';
            let tuesdayRow = '';
            let wednesdayRow = '';
            let thursdayRow = '';
            let fridayRow = '';
            let saturdayRow = '';
            let tableRow = '';
            let saturdayStatus = '';
            let sundayStatus = '';
            for (let r = 0; r < resourceChat.length; r++) {

                sundayRowData = [];
                mondayRowData = [];
                tuesdayRowData = [];
                wednesdayRowData = [];
                thursdayRowData = [];
                fridayRowData = [];
                saturdayRowData = [];
                for (let j = 0; j < resourceJob.length; j++) {

                    if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';
                        sundayRowData.push(sundayRow);
                    }
                    if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        mondayRowData.push(mondayRow);
                    }

                    if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        tuesdayRowData.push(tuesdayRow);
                    }

                    if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        wednesdayRowData.push(wednesdayRow);
                    }

                    if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        thursdayRowData.push(thursdayRow);
                    }

                    if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        fridayRowData.push(fridayRow);
                    }

                    if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                            '</div>' + '' +
                            '</div>';

                        saturdayRowData.push(saturdayRow);
                    }

                }

                if ($('#showSaturday').is(":checked")) {
                    saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                } else {
                    saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                }

                if ($('#showSunday').is(":checked")) {
                    sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                } else {
                    sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                }

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                    sundayStatus + '' +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                    saturdayStatus + '' +
                    '</tr>';
                tableRowData.push(tableRow);

            }
            $('#here_table table').append(tableRowData);

            $('.sunday').attr('id', dayNext[0]);
            $('.monday').attr('id', dayNext[1]);
            $('.tuesday').attr('id', dayNext[2]);
            $('.wednesday').attr('id', dayNext[3]);
            $('.thursday').attr('id', dayNext[4]);
            $('.friday').attr('id', dayNext[5]);
            $('.saturday').attr('id', dayNext[6]);

            $(".dateMon").text(moment(dayNext[1]).format("MM/DD"));
            $(".dateTue").text(moment(dayNext[2]).format("MM/DD"));
            $(".dateWed").text(moment(dayNext[3]).format("MM/DD"));
            $(".dateThu").text(moment(dayNext[4]).format("MM/DD"));
            $(".dateFri").text(moment(dayNext[5]).format("MM/DD"));
            $(".dateSat").text(moment(dayNext[6]).format("MM/DD"));
            $(".dateSun").text(moment(dayNext[0]).format("MM/DD"));
            $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(dayNext[1]).format('DD') + ' - ' + moment(dayNext[5]).format('DD') + ', ' + moment().format('YYYY'));

            let day = moment().format('dddd');
            let resourceDate = $('thead tr th.' + day.toLowerCase()).attr('id');
            changeColumnColor(resourceDate);

        }
    },
    'click .checkclose': function () {
        const templateObject = Template.instance();
        if (templateObject.checkRefresh.get() == true || $('#updateID').val() == "") {
            window.open('/appointments', '_self');
        }

    },
    'click btnDeleteAppointment': function () {
        const templateObject = Template.instance();
        if (templateObject.checkRefresh.get() == true) {
            window.open('/appointments', '_self');
        }

    },
    'click #btnStartActualTime': function () {
        let toUpdateID = "";
        const templateObject = Template.instance();
        var appointmentData = templateObject.appointmentrecords.get();
        let appointmentService = new AppointmentService();
        let id = $('#updateID').val();
        var result = appointmentData.filter(apmt => {
            return apmt.id == id
        });
        let desc = "Job Continued";
        if (result.length > 0) {
            if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
            } else {
                if (result[0].timelog != "") {
                    toUpdateID = result[0].timelog.fields.ID;
                } else {
                    desc = "Job Start";
                }

            }

            date = new Date();
            if ($('#tActualStartTime').val() != "" && result[0].isPaused == "Paused") {
                $('.fullScreenSpin').css('display', 'inline-block');
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                let endTime = '';

                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj)
                } else {
                    timeLog = '';
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: obj.Description
                    }
                }

                appointmentService.saveTimeLog(objectData).then(function (data) {
                    let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    objectData1 = {
                        type: "TAppointmentEx",
                        fields: {
                            Id: parseInt(result[0].id),
                            Othertxt: ""
                        }
                    };
                    if (toUpdateID != "") {
                        objectData = {
                            type: "TAppointmentsTimeLog",
                            fields: {
                                ID: toUpdateID,
                                EndDatetime: endTime1,
                            }
                        }
                        if (result[0].timelog != "") {
                            appointmentService.saveTimeLog(objectData).then(function (data) {
                                appointmentService.saveAppointment(objectData1).then(function (data1) {
                                    let index = appointmentData.map(function (e) {
                                        return e.id;
                                    }).indexOf(parseInt(result[0].id));
                                    appointmentData[index].isPaused = '';
                                    templateObject.appointmentrecords.set(appointmentData);
                                    sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                        addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                            $('.fullScreenSpin').css('display', 'none');
                                            swal({
                                                title: 'Job Started',
                                                text: "Job Has Been Started",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'Ok'
                                            }).then((result) => {
                                                if (result.value) {
                                                    // window.open('/appointments', '_self');
                                                } else {
                                                    // window.open('/appointments', '_self');
                                                }
                                            });
                                            templateObject.checkRefresh.set(true);
                                        }).catch(function (err) {
                                            swal({
                                                title: 'Oooops...',
                                                text: err,
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {}
                                                else if (result.dismiss === 'cancel') {}
                                            });
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {}
                                            else if (result.dismiss === 'cancel') {}
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {}
                                        else if (result.dismiss === 'cancel') {}
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            })
                        } else {
                            appointmentService.saveAppointment(objectData1).then(function (data1) {
                                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                        $('.fullScreenSpin').css('display', 'none');
                                        swal({
                                            title: 'Job Started',
                                            text: "Job Has Been Started",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'Ok'
                                        }).then((result) => {
                                            if (result.value) {
                                                // window.open('/appointments', '_self');
                                            } else {
                                                // window.open('/appointments', '_self');
                                            }
                                        });
                                        templateObject.checkRefresh.set(true);
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {}
                                            else if (result.dismiss === 'cancel') {}
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {}
                                        else if (result.dismiss === 'cancel') {}
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                    window.open('/appointments', '_self');
                                });
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }

                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else if (result[0].aStartTime == "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                document.getElementById("tActualStartTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                let endTime = '';

                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj)
                } else {
                    timeLog = '';
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: obj.Description
                    }
                }

                appointmentService.saveTimeLog(objectData).then(function (data) {
                    let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    objectData1 = {
                        type: "TAppointmentEx",
                        fields: {
                            Id: parseInt(result[0].id),
                            Actual_StartTime: startTime,
                            Othertxt: ""
                        }
                    };

                    appointmentService.saveAppointment(objectData1).then(function (data1) {
                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Job Started',
                                    text: "Job Has Been Started",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'Ok'
                                }).then((result) => {
                                    if (result.value) {
                                        // window.open('/appointments', '_self');
                                    } else {
                                        // window.open('/appointments', '_self');
                                    }
                                });
                                templateObject.checkRefresh.set(true);
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                            window.open('/appointments', '_self');
                        });
                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });

                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

            }
        } else {
            $('.fullScreenSpin').css('display', 'block');
            $("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
            var frmAppointment = $('#frmAppointment')[0];
            templateObject = Template.instance();
            let updateID = $('#updateID').val() || 0;
            let paused = "";
            let result = "";

            event.preventDefault();
            var formData = new FormData(frmAppointment);
            let aStartDate = '';
            let aEndDate = '';
            let savedStartDate = $('#aStartDate').val() || moment().format("YYYY-MM-DD");
            let clientname = formData.get('customer') || '';
            let clientmobile = formData.get('mobile') || '0';
            let contact = formData.get('phone') || '0';
            let startTime = $('#startTime').val() + ':00' || '';
            let endTime = $('#endTime').val() + ':00' || '';
            let aStartTime = $('#tActualStartTime').val() || '';
            let aEndTime = $('#tActualEndTime').val() || '';
            let state = formData.get('state') || '';
            let country = formData.get('country') || '';
            let street = formData.get('address') || '';
            let zip = formData.get('zip') || '';
            let suburb = formData.get('suburb') || '';
            var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
            var endDateGet = new Date($("#dtSODate2").datepicker("getDate"));
            let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
            let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
            let employeeName = formData.get('employee_name').trim() || '';
            let id = formData.get('updateID') || '0';
            let notes = formData.get('txtNotes') || ' ';
            let selectedProduct = $('#product-list').children("option:selected").text() || '';
            let status = "Not Converted";
            let uploadedItems = templateObject.uploadedFiles.get();
            if (aStartTime != '') {
                aStartDate = savedStartDate + ' ' + aStartTime;
            } else {
                aStartDate = ''
            }

            if (aEndTime != '') {
                aEndDate = moment().format("YYYY-MM-DD") + ' ' + aEndTime;
            } else {
                aEndDate = '';
            }
            // if (aStartTime != "" && aEndDate == "") {
            //     aEndDate = aStartDate;
            // }
            let obj = {};
            let date = new Date();
            if (updateID) {
                result = appointmentData.filter(apmt => {
                    return apmt.id == $('#updateID').val()
                });

                if (result[0].aStartTime == "" && $('#tActualStartTime').val() != "") {
                    obj = {
                        type: "TAppointmentsTimeLog",
                        fields: {
                            appointID: updateID,
                            StartDatetime: aStartDate,
                            EndDatetime: '',
                            Description: 'Job Started'
                        }
                    };
                } else if (result[0].aStartTime != "" && result[0].aEndTime == "" && $('#tActualEndTime').val() != "") {
                    let startTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    obj = {
                        type: "TAppointmentsTimeLog",
                        fields: {
                            appointID: updateID,
                            StartDatetime: aStartDate,
                            EndDatetime: aEndDate,
                            Description: 'Job Completed'
                        }
                    };
                } else if (result[0].aEndTime != "") {
                    aEndDate = moment().format("YYYY-MM-DD") + ' ' + aEndTime;
                }
            } else {
                if ($('#tActualStartTime').val() != "") {
                    obj = {
                        type: "TAppointmentsTimeLog",
                        fields: {
                            appointID: '',
                            StartDatetime: aStartDate,
                            EndDatetime: '',
                            Description: 'Job Started'
                        }
                    };
                } else if ($('#tActualStartTime').val() != "" && $('#tActualEndTime').val() != "") {
                    obj = {
                        type: "TAppointmentsTimeLog",
                        fields: {
                            appointID: '',
                            StartDatetime: aStartDate,
                            EndDatetime: aEndDate,
                            Description: 'Job Started & Completed Same Time'
                        }
                    };
                }
            }

            let objectData = "";
            if (id == '0') {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + ' ' + startTime,
                        EndTime: endDate + ' ' + endTime,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        Actual_StartTime: aStartDate,
                        Actual_EndTime: aEndDate,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        Attachments: uploadedItems,
                        Status: status
                    }
                };
            } else {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        Id: parseInt(id),
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + ' ' + startTime,
                        EndTime: endDate + ' ' + endTime,
                        FeedbackNotes: notes,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        Actual_StartTime: aStartDate,
                        Actual_EndTime: aEndDate,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        Attachments: uploadedItems,
                        Status: status
                    }
                };
            }

            appointmentService.saveAppointment(objectData).then(function (data) {
                let id = data.fields.ID;
                if (Object.keys(obj).length > 0) {
                    obj.fields.appointID = id;
                    appointmentService.saveTimeLog(obj).then(function (data1) {
                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                window.open('/appointments', '_self');
                            }).catch(function (err) {
                                window.open('/appointments', '_self');
                            })
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        })
                    }).catch(function () {})
                } else {
                    sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                        addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                            window.open('/appointments', '_self');
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        })
                    }).catch(function (err) {
                        window.open('/appointments', '_self');
                    })
                }
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                })
            });

        }
    },
    'click #btnEndActualTime': function () {
        const templateObject = Template.instance();
        var appointmentData = templateObject.appointmentrecords.get();
        let id = $('#updateID').val();
        var result = appointmentData.filter(apmt => {
            return apmt.id == id
        });

        let paused = result[0].isPaused || ''
            if (paused == "Paused") {
                swal({
                    title: 'Cant Stop Job',
                    text: 'This Job is Currently Paused, click "OK" to go back and click "Start" to Continue the Job',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ok'
                })
            } else {
                if (document.getElementById("tActualStartTime").value == "") {}
                else {
                    document.getElementById("tActualEndTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                    swal({
                        title: 'Stop Appointment',
                        text: "Once an appointment has ended, it cannot be restarted",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'End Appointment'
                    }).then((result) => {
                        if (result.value) {
                            let date1 = document.getElementById("dtSODate").value;
                            let date2 = document.getElementById("dtSODate2").value;
                            date1 = templateObject.dateFormat(date1);
                            date2 = templateObject.dateFormat(date2);
                            var endTime = new Date(date2 + ' ' + document.getElementById("tActualEndTime").value + ':00');
                            var startTime = new Date(date1 + ' ' + document.getElementById("tActualStartTime").value + ':00');
                            document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                            $("#btnSaveAppointment").trigger("click");
                            let id = document.getElementById("updateID");
                        } else if (result.dismiss === 'cancel') {
                            document.getElementById('tActualEndTime').value = '';
                            document.getElementById('txtActualHoursSpent').value = '0';
                        } else {
                            document.getElementById('tActualEndTime').value = '';
                            document.getElementById('txtActualHoursSpent').value = '0';
                        }
                    });

                }
            }
    },
    'click #btnHold': function (event) {
        if ($('#updateID').val() == "") {
            swal({
                title: 'Oooops...',
                text: "This Appointment hasn't been started. Please Save and then Start your Appointment before continuing.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
            })
        } else {
            $('#frmOnHoldModal').modal();
        }

    },
    'click #btnOptions': function (event) {
        if ($('#updateID').val() == "") {
            swal({
                title: 'Oooops...',
                text: "This Appointment hasn't been saved. Please Save Appointment to use the 'Option' features",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
            })
        } else {
            $('#frmOptions').modal();
        }

    },
    'click #btnRepeatApp': function (event) {
        const templateObject = Template.instance();
        let dayObj = {
            saturday: 0,
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0
        };
        templateObject.repeatDays.set(dayObj)
        $('.select-size').hide();
        $('.repeatOn').hide();
        $('#myModal2').modal();
    },
    'click #btnAppOptionsModal': function (event) {
        $('#frmOptions').modal('show');
    },
    'change #showSaturday1': function () {
        var checkbox = document.querySelector("#showSaturday");
        if (checkbox.checked) {}
        else {}

    },
    'change #showSunday1': function () {
        var checkbox = document.querySelector("#showSunday");
        if (checkbox.checked) {}
        else {}

    },
    'click #btnDelete': function (event) {
        let appointmentService = new AppointmentService();
        let id = document.getElementById('updateID').value || '0';
        swal({
            title: 'Delete Appointment',
            text: "Are you sure you want to delete Appointment?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display', 'inline-block');
                if (id == '0' || id == null) {
                    swal({
                        title: 'Cant delete appointment, it does not exist',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    });
                } else {
                    objectData = {
                        type: "TAppointmentEx",
                        fields: {
                            Id: parseInt(id),
                            Active: false
                        }
                    }

                    appointmentService.saveAppointment(objectData).then(function (data) {
                        $('#event-modal').modal('hide');
                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (dataList) {
                            addVS1Data('TAppointment', JSON.stringify(dataList)).then(function (datareturn) {
                                window.open('/appointments', '_self');
                            }).catch(function (err) {
                                window.open('/appointments', '_self');
                            })
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        })

                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            } else if (result.dismiss === 'cancel') {}
            else {}
        });

    },
    'change #startTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (date2 != "" && endTime > startTime) {
            document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'change #endTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'change #tActualStartTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + ' ' + document.getElementById("tActualEndTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("tActualStartTime").value + ':00');
        if (date2 != "" && endTime > startTime) {
            document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'change #tActualEndTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + ' ' + document.getElementById("tActualEndTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("tActualStartTime").value + ':00');
        if (endTime > startTime) {
            document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'submit #appointmentOptions': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        event.preventDefault();

        let showSat = "F";
        let showSun = "F";
        if ($('#showSaturday').is(':checked')) {
            showSat = "T";
        }

        if ($('#showSunday').is(':checked')) {
            showSun = "T";
        }
        let settingID = '';
        let templateObject = Template.instance();
        var erpGet = erpDb();
        let showTimeFrom = $('#hoursFrom').val() || '08:00';
        let showTimeTo = $('#hoursTo').val() || '17:00';
        let defaultTime = $('#defaultTime').val().split(' ')[0] || '2';
        let showTimeIn = $('#showTimeIn').val().split(' ')[0] || '1';
        let defaultProduct = $('#productlist').children("option:selected").text() || '';
        let defaultProductID = $('#productlist').children("option:selected").val() || '';
        let date = new Date('2021-03-25 ' + showTimeTo);
        let chargeTime = $('#chargeTime').val().split(' ')[0];
        showTimeTo = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
        let appointmentService = new AppointmentService();

        let objectData = "";
        objectData = {
            Name: "VS1_UpdateCompPref",
            Params: {
                CloudUserName: erpGet.ERPUsername,
                CloudPassword: erpGet.ERPPassword,
                CompanyPreferenceList: [{
                        "Name": "ShowSaturdayinApptCalendar",
                        "FieldValue": showSat
                    }, {
                        "Name": "ShowSundayinApptCalendar",
                        "FieldValue": showSun
                    }, {
                        "Name": "ApptStartTime",
                        "FieldValue": showTimeFrom
                    }, {
                        "Name": "ApptEndTime",
                        "FieldValue": showTimeTo
                    }, {
                        "Name": "DefaultApptDuration",
                        "FieldValue": defaultTime
                    }, {
                        "Name": "ShowApptDurationin",
                        "FieldValue": showTimeIn
                    }, {
                        "Name": "DefaultServiceProductID",
                        "FieldValue": defaultProductID
                    }, {
                        "Name": "DefaultServiceProduct",
                        "FieldValue": defaultProduct
                    }, {
                        "Name": "MinimumChargeAppointmentTime",
                        "FieldValue": chargeTime
                    }
                ]
            }
        };

        var myString = '"JsonIn"' + ':' + JSON.stringify(objectData);
        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_UpdateCompPref"', true);
        oPost.setRequestHeader("database", erpGet.ERPDatabase);
        oPost.setRequestHeader("username", erpGet.ERPUsername);
        oPost.setRequestHeader("password", erpGet.ERPPassword);
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");
        // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
        oPost.send(myString);

        oPost.onreadystatechange = function () {
            if (oPost.readyState == 4 && oPost.status == 200) {
                var myArrResponse = JSON.parse(oPost.responseText);
                if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                    sideBarService.getGlobalSettings().then(function (dataAppointmentExtra) {
                        addVS1Data('TERPPreferenceExtra', JSON.stringify(dataAppointmentExtra)).then(function (datareturn) {
                            //window.open('/appointments', '_self');
                        }).catch(function (err) {
                            //window.open('/appointments', '_self');
                        });
                    }).catch(function (err) {
                        //window.open('/appointments', '_self');
                    });

                    sideBarService.getGlobalSettings().then(function (dataAppointment) {
                        addVS1Data('TERPPreference', JSON.stringify(dataAppointment)).then(function (datareturn) {
                            window.open('/appointments', '_self');
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        });
                    }).catch(function (err) {
                        window.open('/appointments', '_self');
                    });

                } else {
                    $('.modal-backdrop').css('display', 'none');
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: myArrResponse.ProcessLog.ResponseStatus,
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                }

            } else if (oPost.readyState == 4 && oPost.status == 403) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
            } else if (oPost.readyState == 4 && oPost.status == 406) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');

                if ((segError[1]) == ' "Unable to lock object') {

                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                }

            } else if (oPost.readyState == '') {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
            }

        }
        // appointmentService.saveAppointmentPreferences(objectData).then(function (data) {
        //     $('.fullScreenSpin').css('display', 'none');
        //     //window.open('/appointments', '_self');
        //     sideBarService.getAllAppointmentPredList().then(function (data) {
        //         addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {
        //             window.open('/appointments', '_self');
        //         }).catch(function (err) {
        //             window.open('/appointments', '_self');
        //         });
        //     }).catch(function (err) {
        //         window.open('/appointments', '_self');
        //     });
        // }).catch(function (err) {
        //     $('.fullScreenSpin').css('display', 'none');
        // });


    },
    'click .btnPauseJob': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        var appointmentData = templateObject.appointmentrecords.get();
        var result = appointmentData.filter(apmt => {
            return apmt.id == $('#updateID').val()
        });
        let toUpdateID = '';
        if (result.length > 0) {
            let type = "Break";
            if ($('#break').is(":checked")) {
                type = $('#break').val();
            } else if ($('#lunch').is(":checked")) {
                type = $('#lunch').val();
            } else if ($('#purchase').is(":checked")) {
                type = $('#purchase').val();
            } else {
                swal({
                    title: 'Please Select Option',
                    text: 'Please select Break, Lunch or Purchase Option',
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((results) => {
                    if (results.value) {}
                    else if (results.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
                return false;
            }
            let date = new Date();
            let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
            let endTime = '';
            let startTime1 = result[0].aStartTime;
            let desc = $('#txtpause-notes').val() || '';
            if (startTime1 == "") {
                swal("Please note", "You can't pause a job that hasn't been started", 'info');
                $('.fullScreenSpin').css('display', 'none');
            } else if (startTime != "") {
                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj)
                } else {
                    timeLog = '';
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: type + ':' + obj.Description
                    }
                }

                appointmentService.saveTimeLog(objectData).then(function (data) {
                    if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                        toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
                    } else {
                        toUpdateID = result[0].timelog.fields.ID;
                    }
                    let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    if (toUpdateID != "") {
                        objectData = {
                            type: "TAppointmentsTimeLog",
                            fields: {
                                ID: toUpdateID,
                                EndDatetime: endTime1,
                            }
                        }

                        objectData1 = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(result[0].id),
                                Othertxt: "Paused"
                            }
                        };

                        appointmentService.saveTimeLog(objectData).then(function (data) {
                            appointmentService.saveAppointment(objectData1).then(function (data1) {
                                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                        window.open('/appointments', '_self');
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    })
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                })
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });

                        }).catch(function (err) {

                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {}
                                else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        swal("Please note", "You can't pause a job that has been ended, start the Job again to pause it.", 'info');
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: "This Appointment hasn't been started. Please Save and then Start your Appointment before continuing.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            })
        }
    },
    'change #lunch': function (event) {
        $('#break').prop('checked', false);
        $('#purchase').prop('checked', false);
    },
    'change #break': function (event) {
        $('#lunch').prop('checked', false);
        $('#purchase').prop('checked', false);
    },
    'change #purchase': function (event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
    },
    'click #btnCopyAppointment': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var frmAppointment = $('#frmAppointment')[0];
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        var appointmentData = templateObject.appointmentrecords.get();
        let updateID = $('#updateID').val() || 0;

        event.preventDefault();
        if (updateID != 0) {
            let aStartDate = '';
            let aEndDate = '';
            let clientname = $('#customer').val() || '';
            let clientmobile = $('#mobile').val() || '0';
            let contact = $('#phone').val() || '0';
            let startTime = $('#startTime').val() || '';
            let endTime = $('#endTime').val() || '';
            let state = $('#state').val() || '';
            let country = $('#country').val() || '';
            let street = $('#address').val() || '';
            let zip = $('#zip').val() || '';
            let suburb = $('#suburb').val() || '';
            var endDateGet = new Date($("#startDate").datepicker("getDate"));
            var startdateGet = new Date($("#startDate").datepicker("getDate"));
            let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
            let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
            let employeeName = $('#employee_name').val().trim() || '';
            let id = '0';
            let notes = $('#txtNotes').val() || ' ';
            let selectedProduct = $('#product-list').children("option:selected").text() || '';
            let status = "Not Converted";
            // if (aStartTime != "" && aEndDate == "") {
            //     aEndDate = aStartDate;
            // }
            let obj = {};
            let date = new Date();
            let objectData = "";
            if (id == '0') {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + ' ' + startTime,
                        EndTime: endDate + ' ' + endTime,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        Status: status
                    }
                };

                appointmentService.saveAppointment(objectData).then(function (data) {
                    sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                        addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                            window.open('/appointments', '_self');
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        });
                    }).catch(function (err) {
                        window.open('/appointments', '_self');
                    });
                }).catch(function (err) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    })
                });
            }
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Invalid Appointment',
                text: "You Can't Copy An Invalid Appointment, Create a New One Instead",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
            })
        }

    },
    'submit #frmAppointment': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var frmAppointment = $('#frmAppointment')[0];
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        let contactService = new ContactService();
        var appointmentData = templateObject.appointmentrecords.get();
        let updateID = $('#updateID').val() || 0;
        let paused = "";
        let result = "";

        event.preventDefault();
        var formData = new FormData(frmAppointment);
        let aStartDate = '';
        let aEndDate = '';
        let savedStartDate = $('#aStartDate').val() || moment().format("YYYY-MM-DD");
        let clientname = formData.get('customer') || '';
        let clientmobile = formData.get('mobile') || '0';
        let contact = formData.get('phone') || '0';
        let startTime = $('#startTime').val() + ':00' || '';
        let endTime = $('#endTime').val() + ':00' || '';
        let aStartTime = $('#tActualStartTime').val() || '';
        let aEndTime = $('#tActualEndTime').val() || '';
        let state = formData.get('state') || '';
        let country = formData.get('country') || '';
        let street = formData.get('address') || '';
        let zip = formData.get('zip') || '';
        let suburb = formData.get('suburb') || '';
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        var endDateGet = new Date($("#dtSODate2").datepicker("getDate"));
        let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
        let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
        let employeeName = formData.get('employee_name').trim() || '';
        let id = formData.get('updateID') || '0';
        let notes = formData.get('txtNotes') || ' ';
        let selectedProduct = $('#product-list').children("option:selected").text() || '';
        let hourlyRate = '';
        let status = "Not Converted";
        let uploadedItems = templateObject.uploadedFiles.get();
        if (aStartTime != '') {
            aStartDate = savedStartDate + ' ' + aStartTime;
        } else {
            aStartDate = ''
        }

        if (aEndTime != '') {
            aEndDate = moment().format("YYYY-MM-DD") + ' ' + aEndTime;
        } else {
            aEndDate = '';
        }
        // if (aStartTime != "" && aEndDate == "") {
        //     aEndDate = aStartDate;
        // }
        let obj = {};
        let date = new Date();
        if (updateID) {
            result = appointmentData.filter(apmt => {
                return apmt.id == $('#updateID').val()
            });

            hourlyRate = result[0].rate;

            if (result[0].aStartTime == "" && $('#tActualStartTime').val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: updateID,
                        StartDatetime: aStartDate,
                        EndDatetime: '',
                        Description: 'Job Started'
                    }
                };
            } else if (result[0].aStartTime != "" && result[0].aEndTime == "" && $('#tActualEndTime').val() != "") {
                let startTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: updateID,
                        StartDatetime: aStartDate,
                        EndDatetime: aEndDate,
                        Description: 'Job Completed'
                    }
                };
            } else if (result[0].aEndTime != "") {
                aEndDate = moment().format("YYYY-MM-DD") + ' ' + aEndTime;
            }
        } else {
            if ($('#tActualStartTime').val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: '',
                        StartDatetime: aStartDate,
                        EndDatetime: '',
                        Description: 'Job Started'
                    }
                };
            } else if ($('#tActualStartTime').val() != "" && $('#tActualEndTime').val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: '',
                        StartDatetime: aStartDate,
                        EndDatetime: aEndDate,
                        Description: 'Job Started & Completed Same Time'
                    }
                };
            }
        }

        let objectData = "";
        if (id == '0') {
            objectData = {
                type: "TAppointmentEx",
                fields: {
                    ClientName: clientname,
                    Mobile: clientmobile,
                    Phone: contact,
                    StartTime: startDate + ' ' + startTime,
                    EndTime: endDate + ' ' + endTime,
                    Street: street,
                    Suburb: suburb,
                    State: state,
                    Postcode: zip,
                    Country: country,
                    Actual_StartTime: aStartDate,
                    Actual_EndTime: aEndDate,
                    TrainerName: employeeName,
                    Notes: notes,
                    ProductDesc: selectedProduct,
                    Attachments: uploadedItems,
                    Status: status
                }
            };
        } else {
            objectData = {
                type: "TAppointmentEx",
                fields: {
                    Id: parseInt(id),
                    ClientName: clientname,
                    Mobile: clientmobile,
                    Phone: contact,
                    StartTime: startDate + ' ' + startTime,
                    EndTime: endDate + ' ' + endTime,
                    FeedbackNotes: notes,
                    Street: street,
                    Suburb: suburb,
                    State: state,
                    Postcode: zip,
                    Country: country,
                    Actual_StartTime: aStartDate,
                    Actual_EndTime: aEndDate,
                    TrainerName: employeeName,
                    Notes: notes,
                    ProductDesc: selectedProduct,
                    Attachments: uploadedItems,
                    Status: status
                }
            };
        }

        appointmentService.saveAppointment(objectData).then(function (data) {
            let id = data.fields.ID;
            let toUpdateID = "";
            let updateData = "";
            if (Object.keys(obj).length > 0) {
                obj.fields.appointID = id;
                appointmentService.saveTimeLog(obj).then(function (data1) {
                    if (obj.fields.Description == "Job Completed") {
                        let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + ' ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                        if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                            toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
                        } else {
                            toUpdateID = result[0].timelog.fields.ID;
                        }

                        if (toUpdateID != "") {
                            updateData = {
                                type: "TAppointmentsTimeLog",
                                fields: {
                                    ID: toUpdateID,
                                    EndDatetime: endTime1,
                                }
                            }
                        }

                        appointmentService.saveTimeLog(updateData).then(function (data) {
                            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                                addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                    let data = '';
                                    data = {
                                        type: "TTimeSheetEntry",
                                        fields: {
                                            // "EntryDate":"2020-10-12 12:39:14",
                                            TimeSheet: [{
                                                    type: "TTimeSheet",
                                                    fields: {
                                                        EmployeeName: employeeName || '',
                                                        // HourlyRate:50,
                                                        LabourCost: parseFloat(hourlyRate) || 1,
                                                        Allowedit: true,
                                                        // ChargeRate: 100,
                                                        Hours: parseFloat($('#txtActualHoursSpent').val()) || 1,
                                                        // OverheadRate: 90,
                                                        Job: clientname || '',
                                                        // ServiceName: "Test"|| '',
                                                        TimeSheetClassName: "Default" || '',
                                                        Notes: notes || ''
                                                        // EntryDate: accountdesc|| ''
                                                    }
                                                }
                                            ],
                                            "TypeName": "Payroll",
                                            "WhoEntered": Session.get('mySessionEmployee') || ""
                                        }
                                    };
                                    contactService.saveTimeSheet(data).then(function (dataObj) {
                                        window.open('/appointments', '_self');
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    })
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                })

                            }).catch(function (err) {
                                window.open('/appointments', '_self');
                            });
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        });

                    } else {
                        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                window.open('/appointments', '_self');
                            }).catch(function (err) {
                                window.open('/appointments', '_self');
                            })
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        })
                    }
                }).catch(function (err) {
                    window.open('/appointments', '_self');
                })
            } else {
                sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                        window.open('/appointments', '_self');
                    }).catch(function (err) {
                        window.open('/appointments', '_self');
                    });
                }).catch(function (err) {
                    window.open('/appointments', '_self');
                });
            }
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            })
        });

    },
    'keyup .search': function (event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if (jobCount == '0') {
            $('.no-result').show();
        } else {
            $('.no-result').hide();
        }
        if (searchTerm === "") {
            $(".results tbody tr").each(function (e) {
                $(this).attr('visible', 'true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }

    }
});

Template.appointments.helpers({
    employeerecords: () => {
        return Template.instance().employeerecords.get()
        .sort(function (a, b) {
            if (a.employeeName == 'NA') {
                return 1;
            } else if (b.employeeName == 'NA') {
                return -1;
            }
            return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
        }).sort(function (a, b) {
            // return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase());
            if (a.priority == "" || a.priority == "0") {
                return 1;
            } else if (b.priority == "" || b.priority == "0") {
                return -1;
            }

            return (parseInt(a.priority) > parseInt(b.priority)) ? 1 : -1;

        });

    },
    calendarOptions: () => {
        return Template.instance().calendarOptions.get();
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    clientrecords: () => {
        return Template.instance().clientrecords.get();
    },
    resourceAllocation: () => {
        return Template.instance().resourceAllocation.get();
    },
    resourceJobs: () => {
        return Template.instance().resourceJobs.get();
    },
    resourceDates: () => {
        return Template.instance().resourceDates.get();
    },
    appointmentrecords: () => {
        return Template.instance().appointmentrecords.get();
    },
    accessOnHold: () => {
        return Session.get('CloudAppointmentStartStopAccessLevel') || false;
    },
    addAttachment: () => {
        return Session.get('CloudAppointmentAddAttachment') || false;
    },
    addNotes: () => {
        return Session.get('CloudAppointmentNotes') || false;
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    isMobileDevices: () => {
        var isMobile = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('and', (a, b) => {
    return a && b;
});
