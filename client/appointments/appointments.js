import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from "../product/product-service";
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import 'jquery-ui-dist/external/jquery/jquery';
//import 'jquery-ui-dist/jquery-ui';
import { SalesBoardService } from '../js/sales-service';
import { AppointmentService } from './appointment-service';
//Calendar
import { Calendar, formatDate } from '@fullcalendar/core';
// import interactionPlugin from '@fullcalendar/interaction';
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
    templateObject.resourceAllocation = new ReactiveVar([]);
    templateObject.resourceJobs = new ReactiveVar([]);
    templateObject.resourceDates = new ReactiveVar([]);
    templateObject.weeksOfMonth = new ReactiveVar([]);
    templateObject.checkEmployee = new ReactiveVar([]);
    templateObject.calendarOptions = new ReactiveVar([]);
    templateObject.checkRefresh = new ReactiveVar;
    templateObject.checkRefresh.set(false);

});

Template.appointments.onRendered(function () {
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



    let currentId = Router.current().params.hash;
    if ((currentId === "allocationModal")) {
        setTimeout(function () {
            $('#allocationModal').modal('show');
        }, 500);

    }

    $('.fullScreenSpin').css('display', 'inline-block');
    //getEventData = function () {



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

                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeName: data.temployee[i].fields.EmployeeName || '',
                            color: data.temployee[i].fields.CustFld6 || selectedColor,
                            priority: data.temployee[i].fields.CustFld5 || "0"
                        };

                        lineItems.push(dataList);
                        allEmployees.push(dataList);
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

                }).catch(function (err) {


                });
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

                        contactService.saveEmployeeEx(objDetails).then(function (data) {

                        });
                    }


                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employeeName: useData[i].fields.EmployeeName || '',
                        color: useData[i].fields.CustFld6 || selectedColor,
                        priority: data.temployee[i].fields.CustFld5 || "0"
                    };

                    lineItems.push(dataList);
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
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        employeeName: data.temployee[i].fields.EmployeeName || '',
                        color: data.temployee[i].fields.CustFld6 || selectedColor
                    };

                    lineItems.push(dataList);
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

            }).catch(function (err) {


            });
        });
    }
    templateObject.getEmployeesList();
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

    getVS1Data('TAppointmentPreferences').then(function (dataObject) {
        if (dataObject.length == 0) {
            appointmentService.getCalendarsettings(Session.get('mySessionEmployeeLoggedID')).then(function (data) {
                templateObject.getAllAppointmentListData();
                // let date = new Date('2021-03-25 ' + data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime || '17:00');
                // data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime =  (('0'+ (date.getHours() - 1)).slice(-2) +':'+('0'+ date.getMinutes()).slice(-2));
                if (data.tappointmentpreferences.length > 0) {
                    prefObject = {
                        id: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].Id || '',
                        defaultProduct: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProduct || '',
                        defaultProductID: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProductID || '',
                        showSat: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSaturdayinApptCalendar || false,
                        showSun: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSundayinApptCalendar || false,
                        showApptDurationin: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowApptDurationin || '1',
                        defaultApptDuration: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultApptDuration || '2',
                        apptStartTime: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptStartTime || '08:00',
                        apptEndTime: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime || '17:00'

                    }
                    $("#showSaturday").prop('checked', prefObject.showSat);
                    $("#showSunday").prop('checked', prefObject.showSun);
                    if (prefObject.showSat === false) {
                        hideSat = "hidesaturday";
                    }

                    if (prefObject.showSun === false) {
                        hideSun = "hidesunday";
                    }

                    if (prefObject.defaultProduct) {
                        $('#productlist').prepend('<option value=' + prefObject.id + '>' + prefObject.defaultProduct + '</option>');
                    }

                    if (prefObject.showApptDurationin) {
                        $('#showTimeIn').prepend('<option selected>' + prefObject.showApptDurationin + ' Hour</option>');
                    }


                    if (prefObject.defaultApptDuration) {
                        $('#defaultTime').prepend('<option selected>' + prefObject.defaultApptDuration + ' Hour</option>');
                    }

                    if (prefObject.apptStartTime) {
                        $('#hoursFrom').val(prefObject.apptStartTime);
                    }

                    if (prefObject.apptEndTime) {
                        $('#hoursTo').val(prefObject.apptEndTime);
                    }

                }


                templateObject.calendarOptions.set(prefObject);
            }).catch(function (err) {
                templateObject.getAllAppointmentListData();
            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tappointmentpreferences;
            for (let i = 0; i < useData.length; i++) {
                if (useData[i].EmployeeID == Session.get('mySessionEmployeeLoggedID')) {
                    // let date = new Date('2021-03-25 ' + useData[i].ApptEndtime || '17:00');
                    // useData[i].ApptEndtime = (('0'+ (date.getHours() - 1)).slice(-2) +':'+('0'+ date.getMinutes()).slice(-2));
                    prefObject = {
                        id: useData[i].Id || '',
                        defaultProduct: useData[i].EmployeeID.DefaultServiceProduct || '',
                        defaultProductID: useData[i].DefaultServiceProductID || '',
                        showSat: useData[i].ShowSaturdayinApptCalendar || false,
                        showSun: useData[i].ShowSundayinApptCalendar || false,
                        showApptDurationin: useData[i].ShowApptDurationin || '1',
                        defaultApptDuration: useData[i].DefaultApptDuration || '2',
                        apptStartTime: useData[i].ApptStartTime || '08:00',
                        apptEndTime: useData[i].ApptEndtime || '17:00'

                    }
                    $("#showSaturday").prop('checked', prefObject.showSat);
                    $("#showSunday").prop('checked', prefObject.showSun);
                    if (prefObject.showSat === false) {
                        hideSat = "hidesaturday";
                    }

                    if (prefObject.showSun === false) {
                        hideSun = "hidesunday";
                    }

                    if (prefObject.defaultProduct) {
                        $('#productlist').prepend('<option value=' + prefObject.id + '>' + prefObject.defaultProduct + '</option>');
                    }

                    if (prefObject.showApptDurationin) {
                        $('#showTimeIn').prepend('<option selected>' + prefObject.showApptDurationin + ' Hour</option>');
                    }


                    if (prefObject.defaultApptDuration) {
                        $('#defaultTime').prepend('<option selected>' + prefObject.defaultApptDuration + ' Hour</option>');
                    }

                    if (prefObject.apptStartTime) {
                        $('#hoursFrom').val(prefObject.apptStartTime);
                    }

                    if (prefObject.apptEndTime) {
                        $('#hoursTo').val(prefObject.apptEndTime);
                    }

                    templateObject.calendarOptions.set(prefObject);


                }
            }
            templateObject.getAllAppointmentListData();

        }
    }).catch(function (err) {
        console.log(err);
        appointmentService.getCalendarsettings(Session.get('mySessionEmployeeLoggedID')).then(function (data) {
            templateObject.getAllAppointmentListData();
            // let date = new Date('2021-03-25 ' + data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime || '17:00');
            // data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime =  (('0'+ (date.getHours() - 1)).slice(-2) +':'+('0'+ date.getMinutes()).slice(-2));
            if (data.tappointmentpreferences.length > 0) {
                prefObject = {
                    id: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].Id || '',
                    defaultProduct: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProduct || '',
                    defaultProductID: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProductID || '',
                    showSat: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSaturdayinApptCalendar || false,
                    showSun: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSundayinApptCalendar || false,
                    showApptDurationin: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowApptDurationin || '',
                    defaultApptDuration: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultApptDuration || '',
                    apptStartTime: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptStartTime || '',
                    apptEndTime: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ApptEndtime || ''

                }
                $("#showSaturday").prop('checked', prefObject.showSat);
                $("#showSunday").prop('checked', prefObject.showSun);
                if (prefObject.showSat === false) {
                    hideSat = "hidesaturday";
                }

                if (prefObject.showSun === false) {
                    hideSun = "hidesunday";
                }

                if (prefObject.defaultProduct) {
                    $('#productlist').prepend('<option value=' + prefObject.id + '>' + prefObject.defaultProduct + '</option>');
                }

                if (prefObject.showApptDurationin) {
                    $('#showTimeIn').prepend('<option selected>' + prefObject.showApptDurationin + ' Hour</option>');
                }


                if (prefObject.defaultApptDuration) {
                    $('#defaultTime').prepend('<option selected>' + prefObject.defaultApptDuration + ' Hour</option>');
                }

                if (prefObject.apptStartTime) {
                    $('#hoursFrom').val(prefObject.apptStartTime);
                }

                if (prefObject.apptEndTime) {
                    $('#hoursTo').val(prefObject.apptEndTime);
                }

            }


            templateObject.calendarOptions.set(prefObject);
        }).catch(function (err) {
            templateObject.getAllAppointmentListData();
        });
    });



    templateObject.getAllAppointmentListData = function () {
        getVS1Data('TAppointment').then(function (dataObject) {
            if (dataObject.length == 0) {
                appointmentService.getAllAppointmentList().then(function (data) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let calendarSet = templateObject.calendarOptions.get();
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
                        slotMax = calendarSet.apptEndTime;
                    }

                    if (calendarSet.showSun == false) {
                        hideDays = [0];
                    }

                    if (calendarSet.showSat == false && calendarSet.showSun == false) {
                        hideDays = [0, 6];
                    }
                    let appColor = '';
                    let dataColor = '';
                    let allEmp = templateObject.employeerecords.get();
                    for (let i = 0; i < data.tappointment.length; i++) {
                        // if (data.tappointment[i].Status === "Not Converted") {
                        //     appColor = '#00a3d3';
                        // } else if (data.tappointment[i].Status === "Converted") {
                        //     appColor = '#1cc88a';
                        // } else if (data.tappointment[i].Status === "Waiting") {
                        //     appColor = '#00a3d3';
                        // } else if (data.tappointment[i].Status === "Completed") {
                        //     appColor = '#1cc88a';
                        // }



                        var employeeColor = allEmp.filter(apmt => {
                            //appointmentList.employeename = employeeName;
                            return apmt.employeeName == data.tappointment[i].TrainerName;
                        });

                        appColor = employeeColor[0].color;



                        var appointment = {
                            id: data.tappointment[i].Id || '',
                            sortdate: data.tappointment[i].CreationDate ? moment(data.tappointment[i].CreationDate).format("YYYY/MM/DD") : "",
                            appointmentdate: data.tappointment[i].CreationDate ? moment(data.tappointment[i].CreationDate).format("DD/MM/YYYY") : "",
                            accountname: data.tappointment[i].ClientName || '',
                            statementno: data.tappointment[i].TrainerName || '',
                            employeename: data.tappointment[i].TrainerName || '',
                            department: data.tappointment[i].DeptClassName || '',
                            phone: data.tappointment[i].Phone || '',
                            mobile: data.tappointment[i].Mobile || '',
                            suburb: data.tappointment[i].Suburb || '',
                            street: data.tappointment[i].Street || '',
                            state: data.tappointment[i].State || '',
                            country: data.tappointment[i].Country || '',
                            zip: data.tappointment[i].Postcode || '',
                            startTime: data.tappointment[i].StartTime.split(' ')[1] || '',
                            totalHours: data.tappointment[i].TotalHours || 0,
                            endTime: data.tappointment[i].EndTime.split(' ')[1] || '',
                            startDate: data.tappointment[i].StartTime || '',
                            endDate: data.tappointment[i].EndTime || '',
                            fromDate: data.tappointment[i].Actual_EndTime ? moment(data.tappointment[i].Actual_EndTime).format("DD/MM/YYYY") : "",
                            openbalance: data.tappointment[i].Actual_EndTime || '',
                            aStartTime: data.tappointment[i].Actual_StartTime.split(' ')[1] || '',
                            aEndTime: data.tappointment[i].Actual_EndTime.split(' ')[1] || '',
                            actualHours: '',
                            closebalance: '',
                            product: data.tappointment[i].ProductDesc || '',
                            finished: data.tappointment[i].Status || '',
                            //employee: data.tappointment[i].EndTime != '' ? moment(data.tappointment[i].EndTime).format("DD/MM/YYYY") : data.tappointment[i].EndTime,
                            notes: data.tappointment[i].Notes || '',
                            isPaused: data.tappointment[i].Othertxt || ''
                        };

                        let surbub = data.tappointment[i].Suburb || '';
                        let zip = data.tappointment[i].Postcode || '';
                        let street = data.tappointment[i].Street || '';
                        let state = data.tappointment[i].State || '';
                        let getAddress = data.tappointment[i].ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                        var dataList = {
                            id: data.tappointment[i].Id.toString() || '',
                            title: data.tappointment[i].TrainerName + '<br>' + data.tappointment[i].ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                            start: data.tappointment[i].StartTime || '',
                            end: data.tappointment[i].EndTime || '',
                            description: data.tappointment[i].Notes || '',
                            color: appColor
                        };

                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }
                    templateObject.appointmentrecords.set(appointmentList);
                    updateCalendarData = eventData
                    let url = window.location.href;
                    if (url.indexOf('?id') > 1) {
                        url1 = new URL(url);
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
                            document.getElementById("txtNotes").value = result[0].notes;
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
                            $('#event-modal').modal();
                            // this.$body.addClass('modal-open');
                        }
                    }
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){

                    $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                    $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                    $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                    $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                    $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: hideDays, // hide Sunday and Saturday
                        longPressDelay: 0,
                        customButtons: {
                            appointments: {
                                text: 'Appointment List',
                                click: function () {
                                    //window.open('/appointmentlist', '_self');
                                    Router.go('/appointmentlist');
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
                        select: function (info) {
                            $('#frmAppointment')[0].reset();
                            $('#customerListModal').modal();
                            templateObject.getAllProductData();
                            let dateStart = new Date(info.start);
                            let dateEnd = new Date(info.end);
                            let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                            let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                            dateEnd.setHours(dateEnd.getHours() + calendarSet.defaultApptDuration || "02:00");
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            document.getElementById("dtSODate").value = startDate;
                            document.getElementById("dtSODate2").value = endDate;
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                            if (calendarSet.defaultApptDuration) {
                                document.getElementById("txtBookedHoursSpent").value = calendarSet.defaultApptDuration;
                            } else {
                                document.getElementById("txtBookedHoursSpent").value = diff_hours(dateStart, dateEnd);
                            }
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
                            var appointmentData = appointmentList;

                            var result = appointmentData.filter(apmt => {
                                return apmt.id == id
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
                                document.getElementById("txtNotes").value = result[0].notes;
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
                                $('#event-modal').modal();
                                // this.$body.addClass('modal-open');
                            }
                        },
                        editable: true,
                        droppable: true, // this allows things to be dropped onto the calendar
                        dayMaxEvents: true, // allow "more" link when too many events
                        //Triggers modal once event is moved to another date within the calendar.
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                //window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            //window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
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

                            if (calendarSet.defaultProduct) {
                                $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                            }
                            var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                            var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                            // if (moment(startTime).isAfter(endTime)) {
                            //     console.log("Start time cant be greater than end time");
                            // } else {
                            //     var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                            //     var hours = duration.asHours();
                            //     document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);
                            // }
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

                        },
                        eventContent: function (event) {
                            let title = document.createElement('p');
                            if (event.event.title) {
                                title.innerHTML = event.timeText + ' ' + event.event.title;
                                title.background = event.event.color;
                            } else {
                                title.innerHTML = event.timeText + ' ' + event.event.title;
                            }


                            let arrayOfDomNodes = [title]
                            return { domNodes: arrayOfDomNodes }
                        }

                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: "0" + calendarSet.defaultApptDuration + ":00" || '02:00'
                            };
                        }
                    });
                    //}
                    //}, 0);
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
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSun + '" >' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        } else if (daysOfTheWeek[w] === "Saturday") {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSat + '" >' + daysOfTheWeek[w].substring(0, 3) + '<span class="dateSat"></span></th>');
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

                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));

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
                    for (let t = 0; t < data.tappointment.length; t++) {
                        let date = new Date(data.tappointment[t].StartTime.split(' ')[0]);
                        weekDay = moment(data.tappointment[t].StartTime.split(' ')[0]).format('dddd');

                        if (resourceChat.length > 0) {
                            if (date >= startWeek && date <= endWeek) {
                                let found = resourceChat.some(emp => emp.employeeName == data.tappointment[t].TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointment[t].TrainerName
                                    });

                                    let employeeColor = result[0].color;
                                    var dataList = {
                                        id: data.tappointment[t].Id,
                                        employeeName: data.tappointment[t].TrainerName,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: data.tappointment[t].Id,
                                    employeeName: data.tappointment[t].TrainerName,
                                    job: data.tappointment[t].ClientName,
                                    street: data.tappointment[t].Street,
                                    city: data.tappointment[t].Surbub,
                                    zip: data.tappointment[t].Postcode,
                                    day: weekDay,
                                    date: data.tappointment[t].StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)
                            }

                        } else {
                            if (date >= startWeek && date <= endWeek) {
                                resourceColor = resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointment[t].TrainerName
                                });

                                let employeeColor = result[0].color;
                                var dataList = {
                                    id: data.tappointment[t].Id,
                                    employeeName: data.tappointment[t].TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: data.tappointment[t].Id,
                                    employeeName: data.tappointment[t].TrainerName,
                                    job: data.tappointment[t].ClientName,
                                    street: data.tappointment[t].Street,
                                    city: data.tappointment[t].Surbub,
                                    zip: data.tappointment[t].Postcode,
                                    day: weekDay,
                                    date: data.tappointment[t].StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
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


                        // resourceChat.sort(function(a, b) {
                        //     return a["one"] - b["one"] || a["two"] - b["two"];
                        // });



                        // for (let f = 0; f < allEmployeesData.length; f++) {
                        //     var result = resourceChat.filter(emdt => {
                        //         return emdt.employeeName == allEmployeesData[f].employeeName;
                        //     });

                        //     if (result.length > 0) {
                        //         var empList = {
                        //             id: result[0].id || '',
                        //             employeeName: result[0].employeeName || '',
                        //             color: result[0].color || ''
                        //         };
                        //         allEmp.push(empList);
                        //     }
                        // }
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

                            tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                                '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                                '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>' + '' +
                                '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                                '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                                '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                                '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                                '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                                'td class="fullWeek saturday hidesaturday" style="padding: 0px;><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>' + '' +
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
                        eventDrop: function (event) {
                            //alert($(this).date.format());
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {
                                                templateObject.getAllAppointmentListData();
                                            }).catch(function (err) {
                                                // window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            // window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            $(".paused").hide();
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: [],
                        eventRender: function () {

                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}


                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tappointment;
                $('.fullScreenSpin').css('display', 'none');
                let calendarSet = templateObject.calendarOptions.get();
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
                    slotMax = calendarSet.apptEndTime;
                }

                if (calendarSet.showSun == false) {
                    hideDays = [0];
                }

                if (calendarSet.showSat == false && calendarSet.showSun == false) {
                    hideDays = [0, 6];
                }
                let appColor = '';
                let dataColor = '';
                let allEmp = templateObject.employeerecords.get();
                for (let i = 0; i < useData.length; i++) {

                    var employeeColor = allEmp.filter(apmt => {
                        //appointmentList.employeename = employeeName;
                        return apmt.employeeName == useData[i].fields.TrainerName;
                    });

                    appColor = employeeColor[0].color;


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
                        actualHours: '',
                        closebalance: '',
                        product: useData[i].fields.ProductDesc || '',
                        finished: useData[i].fields.Status || '',
                        //employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
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

                    eventData.push(dataList);
                    appointmentList.push(appointment)
                }
                templateObject.appointmentrecords.set(appointmentList);
                updateCalendarData = eventData
                let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(url);
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
                        document.getElementById("txtNotes").value = result[0].notes;
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
                        $('#event-modal').modal();
                        // this.$body.addClass('modal-open');
                    }
                }
                var calendarEl = document.getElementById('calendar');
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("YYYY-MM-DD");
                //if(eventData.length > 0){

                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                var calendar = new Calendar(calendarEl, {
                    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                    themeSystem: 'bootstrap',
                    initialView: 'timeGridWeek',
                    hiddenDays: hideDays, // hide Sunday and Saturday
                    longPressDelay: 2000,
                    customButtons: {
                        appointments: {
                            text: 'Appointment List',
                            click: function () {
                                //window.open('/appointmentlist', '_self');
                                Router.go('/appointmentlist');
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
                    select: function (info) {
                        $('#frmAppointment')[0].reset();
                        templateObject.getAllProductData();
                        let dateStart = new Date(info.start);
                        let dateEnd = new Date(info.end);
                        let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                        let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                        dateEnd.setHours(dateEnd.getHours() + calendarSet.defaultApptDuration || "02:00");
                        let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                        let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                        document.getElementById("dtSODate").value = startDate;
                        document.getElementById("dtSODate2").value = endDate;
                        document.getElementById("startTime").value = startTime;
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("employee_name").value = Session.get('mySessionEmployee');
                        if (calendarSet.defaultApptDuration) {
                            document.getElementById("txtBookedHoursSpent").value = calendarSet.defaultApptDuration;
                        } else {
                            document.getElementById("txtBookedHoursSpent").value = diff_hours(dateStart, dateEnd);
                        }
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
                            document.getElementById("txtNotes").value = result[0].notes;
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
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointment",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }

                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                            //window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        //window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    //window.open('/appointments', '_self');
                                });
                            }
                            //     if (result.length > 0) {
                            //         templateObject.getAllProductData();
                            //         document.getElementById("updateID").value = result[0].id || 0;
                            //         document.getElementById("appID").value = result[0].id;
                            //         document.getElementById("customer").value = result[0].accountname;
                            //         document.getElementById("phone").value = result[0].phone;
                            //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            //         document.getElementById("state").value = result[0].state;
                            //         document.getElementById("address").value = result[0].street;
                            //         document.getElementById("txtNotes").value = result[0].notes;
                            //         document.getElementById("suburb").value = result[0].suburb;
                            //         document.getElementById("zip").value = result[0].zip;
                            //         document.getElementById("country").value = result[0].country;
                            //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            //             $("#googleLink").attr("href", googleLink);
                            //         }

                            //         if (result[0].product.replace(/\s/g, '') != "") {
                            //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                            //         } else {
                            //             $('#product-list').prop('selectedIndex', -1);
                            //         }
                            //         document.getElementById("employee_name").value = result[0].employeename;
                            //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                            //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                            //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                            //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                            //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            //         document.getElementById("tActualEndTime").value = result.aEndTime;
                            //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                            //         $('#event-modal').modal();
                            //     }
                            // } else {

                            // }
                        }
                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
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

                        if (calendarSet.defaultProduct) {
                            $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        }
                        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        // if (moment(startTime).isAfter(endTime)) {
                        //     console.log("Start time cant be greater than end time");
                        // } else {
                        //     var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        //     var hours = duration.asHours();
                        //     document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);
                        // }
                        $('#customerListModal').modal();
                    },

                    events: eventData,
                    eventDidMount: function (event) {

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
                        return { domNodes: arrayOfDomNodes }
                    }

                });
                calendar.render();


                let draggableEl = document.getElementById('external-events-list');
                new Draggable(draggableEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl) {
                        let employee = eventEl.textContent;
                        let employeeID = employee.replace(/\D/g, '');
                        populateEmployDetails(eventEl.innerText)
                        return {
                            title: eventEl.innerText,
                            duration: "0" + calendarSet.defaultApptDuration + ":00" || '02:00'
                        };
                    }
                });
                //}
                //}, 0);
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
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSun + '" >' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else if (daysOfTheWeek[w] === "Saturday") {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSat + '" >' + daysOfTheWeek[w].substring(0, 3) + '<span class="dateSat"></span></th>');
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

                $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));

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
                            let found = resourceChat.some(emp => emp.employeeName == useData[t].fields.TrainerName);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == useData[t].fields.TrainerName
                                });

                                let employeeColor = result[0].color;
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
                        if (date >= startWeek && date <= endWeek) {
                            resourceColor = resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == useData[t].fields.TrainerName
                            });

                            let employeeColor = result[0].color;
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

                        tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                            '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                            '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                            'td class="fullWeek saturday hidesaturday" style="padding: 0px;><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>' + '' +
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
            console.log(err);
            appointmentService.getAllAppointmentList().then(function (data) {
                $('.fullScreenSpin').css('display', 'inline-block');
                let calendarSet = templateObject.calendarOptions.get();
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
                    slotMax = calendarSet.apptEndTime;
                }

                if (calendarSet.showSun == false) {
                    hideDays = [0];
                }

                if (calendarSet.showSat == false && calendarSet.showSun == false) {
                    hideDays = [0, 6];
                }
                let appColor = '';
                let dataColor = '';
                let allEmp = templateObject.employeerecords.get();
                for (let i = 0; i < data.tappointment.length; i++) {
                    // if (data.tappointment[i].Status === "Not Converted") {
                    //     appColor = '#00a3d3';
                    // } else if (data.tappointment[i].Status === "Converted") {
                    //     appColor = '#1cc88a';
                    // } else if (data.tappointment[i].Status === "Waiting") {
                    //     appColor = '#00a3d3';
                    // } else if (data.tappointment[i].Status === "Completed") {
                    //     appColor = '#1cc88a';
                    // }



                    var employeeColor = allEmp.filter(apmt => {
                        //appointmentList.employeename = employeeName;
                        return apmt.employeeName == data.tappointment[i].TrainerName;
                    });

                    appColor = employeeColor[0].color;



                    var appointment = {
                        id: data.tappointment[i].Id || '',
                        sortdate: data.tappointment[i].CreationDate ? moment(data.tappointment[i].CreationDate).format("YYYY/MM/DD") : "",
                        appointmentdate: data.tappointment[i].CreationDate ? moment(data.tappointment[i].CreationDate).format("DD/MM/YYYY") : "",
                        accountname: data.tappointment[i].ClientName || '',
                        statementno: data.tappointment[i].TrainerName || '',
                        employeename: data.tappointment[i].TrainerName || '',
                        department: data.tappointment[i].DeptClassName || '',
                        phone: data.tappointment[i].Phone || '',
                        mobile: data.tappointment[i].Mobile || '',
                        suburb: data.tappointment[i].Suburb || '',
                        street: data.tappointment[i].Street || '',
                        state: data.tappointment[i].State || '',
                        country: data.tappointment[i].Country || '',
                        zip: data.tappointment[i].Postcode || '',
                        startTime: data.tappointment[i].StartTime.split(' ')[1] || '',
                        totalHours: data.tappointment[i].TotalHours || 0,
                        endTime: data.tappointment[i].EndTime.split(' ')[1] || '',
                        startDate: data.tappointment[i].StartTime || '',
                        endDate: data.tappointment[i].EndTime || '',
                        fromDate: data.tappointment[i].Actual_EndTime ? moment(data.tappointment[i].Actual_EndTime).format("DD/MM/YYYY") : "",
                        openbalance: data.tappointment[i].Actual_EndTime || '',
                        aStartTime: data.tappointment[i].Actual_StartTime.split(' ')[1] || '',
                        aEndTime: data.tappointment[i].Actual_EndTime.split(' ')[1] || '',
                        actualHours: '',
                        closebalance: '',
                        product: data.tappointment[i].ProductDesc || '',
                        finished: data.tappointment[i].Status || '',
                        //employee: data.tappointment[i].EndTime != '' ? moment(data.tappointment[i].EndTime).format("DD/MM/YYYY") : data.tappointment[i].EndTime,
                        notes: data.tappointment[i].Notes || ''
                    };

                    let surbub = data.tappointment[i].Suburb || '';
                    let zip = data.tappointment[i].Postcode || '';
                    let street = data.tappointment[i].Street || '';
                    let state = data.tappointment[i].State || '';
                    let getAddress = data.tappointment[i].ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                    var dataList = {
                        id: data.tappointment[i].Id.toString() || '',
                        title: data.tappointment[i].TrainerName + '<br>' + data.tappointment[i].ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                        start: data.tappointment[i].StartTime || '',
                        end: data.tappointment[i].EndTime || '',
                        description: data.tappointment[i].Notes || '',
                        color: appColor
                    };

                    eventData.push(dataList);
                    appointmentList.push(appointment)
                }
                templateObject.appointmentrecords.set(appointmentList);
                updateCalendarData = eventData
                let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(url);
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
                        document.getElementById("txtNotes").value = result[0].notes;
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
                        $('#event-modal').modal();
                        // this.$body.addClass('modal-open');
                    }
                }
                var calendarEl = document.getElementById('calendar');
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("YYYY-MM-DD");
                //if(eventData.length > 0){

                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
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
                                Router.go('/appointmentlist');
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
                        var appointmentData = appointmentList;

                        var result = appointmentData.filter(apmt => {
                            return apmt.id == id
                        });
                        if (result.length > 0) {
                            templateObject.getAllProductData();
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
                            document.getElementById("updateID").value = result[0].id || 0;
                            document.getElementById("appID").value = result[0].id;
                            document.getElementById("customer").value = result[0].accountname;
                            document.getElementById("phone").value = result[0].phone;
                            document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            document.getElementById("state").value = result[0].state;
                            document.getElementById("address").value = result[0].street;
                            document.getElementById("txtNotes").value = result[0].notes;
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
                            $('#event-modal').modal();
                            // this.$body.addClass('modal-open');
                        }
                    },
                    editable: true,
                    droppable: true, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    eventDrop: function (event) {
                        if (info.event._def.publicId != "") {
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointment",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }

                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                });
                            }
                            //     if (result.length > 0) {
                            //         templateObject.getAllProductData();
                            //         document.getElementById("updateID").value = result[0].id || 0;
                            //         document.getElementById("appID").value = result[0].id;
                            //         document.getElementById("customer").value = result[0].accountname;
                            //         document.getElementById("phone").value = result[0].phone;
                            //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            //         document.getElementById("state").value = result[0].state;
                            //         document.getElementById("address").value = result[0].street;
                            //         document.getElementById("txtNotes").value = result[0].notes;
                            //         document.getElementById("suburb").value = result[0].suburb;
                            //         document.getElementById("zip").value = result[0].zip;
                            //         document.getElementById("country").value = result[0].country;
                            //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            //             $("#googleLink").attr("href", googleLink);
                            //         }

                            //         if (result[0].product.replace(/\s/g, '') != "") {
                            //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                            //         } else {
                            //             $('#product-list').prop('selectedIndex', -1);
                            //         }
                            //         document.getElementById("employee_name").value = result[0].employeename;
                            //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                            //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                            //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                            //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                            //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            //         document.getElementById("tActualEndTime").value = result.aEndTime;
                            //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                            //         $('#event-modal').modal();
                            //     }
                            // } else {

                            // }
                        }
                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
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

                        if (calendarSet.defaultProduct) {
                            $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        }
                        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        // if (moment(startTime).isAfter(endTime)) {
                        //     console.log("Start time cant be greater than end time");
                        // } else {
                        //     var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        //     var hours = duration.asHours();
                        //     document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);
                        // }
                        $('#customerListModal').modal();
                    },

                    events: eventData,
                    eventDidMount: function (event) {

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
                        return { domNodes: arrayOfDomNodes }
                    }

                });
                calendar.render();


                let draggableEl = document.getElementById('external-events-list');
                new Draggable(draggableEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl) {
                        let employee = eventEl.textContent;
                        let employeeID = employee.replace(/\D/g, '');
                        populateEmployDetails(eventEl.innerText)
                        return {
                            title: eventEl.innerText,
                            duration: "0" + calendarSet.defaultApptDuration + ":00" || '02:00'
                        };
                    }
                });
                //}
                //}, 0);
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
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSun + '" >' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else if (daysOfTheWeek[w] === "Saturday") {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' ' + hideSat + '" >' + daysOfTheWeek[w].substring(0, 3) + '<span class="dateSat"></span></th>');
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

                $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));

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
                for (let t = 0; t < data.tappointment.length; t++) {
                    let date = new Date(data.tappointment[t].StartTime.split(' ')[0]);
                    weekDay = moment(data.tappointment[t].StartTime.split(' ')[0]).format('dddd');

                    if (resourceChat.length > 0) {
                        if (date >= startWeek && date <= endWeek) {
                            let found = resourceChat.some(emp => emp.employeeName == data.tappointment[t].TrainerName);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointment[t].TrainerName
                                });

                                let employeeColor = result[0].color;
                                var dataList = {
                                    id: data.tappointment[t].Id,
                                    employeeName: data.tappointment[t].TrainerName,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                            var jobs = {
                                id: data.tappointment[t].Id,
                                employeeName: data.tappointment[t].TrainerName,
                                job: data.tappointment[t].ClientName,
                                street: data.tappointment[t].Street,
                                city: data.tappointment[t].Surbub,
                                zip: data.tappointment[t].Postcode,
                                day: weekDay,
                                date: data.tappointment[t].StartTime.split(' ')[0],
                            }

                            resourceJob.push(jobs)
                        }

                    } else {
                        if (date >= startWeek && date <= endWeek) {
                            resourceColor = resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == data.tappointment[t].TrainerName
                            });

                            let employeeColor = result[0].color;
                            var dataList = {
                                id: data.tappointment[t].Id,
                                employeeName: data.tappointment[t].TrainerName,
                                color: employeeColor
                            };

                            var jobs = {
                                id: data.tappointment[t].Id,
                                employeeName: data.tappointment[t].TrainerName,
                                job: data.tappointment[t].ClientName,
                                street: data.tappointment[t].Street,
                                city: data.tappointment[t].Surbub,
                                zip: data.tappointment[t].Postcode,
                                day: weekDay,
                                date: data.tappointment[t].StartTime.split(' ')[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                            allEmp.push(dataList);
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


                    // resourceChat.sort(function(a, b) {
                    //     return a["one"] - b["one"] || a["two"] - b["two"];
                    // });



                    // for (let f = 0; f < allEmployeesData.length; f++) {
                    //     var result = resourceChat.filter(emdt => {
                    //         return emdt.employeeName == allEmployeesData[f].employeeName;
                    //     });

                    //     if (result.length > 0) {
                    //         var empList = {
                    //             id: result[0].id || '',
                    //             employeeName: result[0].employeeName || '',
                    //             color: result[0].color || ''
                    //         };
                    //         allEmp.push(empList);
                    //     }
                    // }
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

                        tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                            '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                            '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                            'td class="fullWeek saturday hidesaturday" style="padding: 0px;><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>' + '' +
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
                    eventDrop: function (event) {
                        if (info.event._def.publicId != "") {
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointment",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }

                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                });
                            }
                            //     if (result.length > 0) {
                            //         templateObject.getAllProductData();
                            //         document.getElementById("updateID").value = result[0].id || 0;
                            //         document.getElementById("appID").value = result[0].id;
                            //         document.getElementById("customer").value = result[0].accountname;
                            //         document.getElementById("phone").value = result[0].phone;
                            //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            //         document.getElementById("state").value = result[0].state;
                            //         document.getElementById("address").value = result[0].street;
                            //         document.getElementById("txtNotes").value = result[0].notes;
                            //         document.getElementById("suburb").value = result[0].suburb;
                            //         document.getElementById("zip").value = result[0].zip;
                            //         document.getElementById("country").value = result[0].country;
                            //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            //             $("#googleLink").attr("href", googleLink);
                            //         }

                            //         if (result[0].product.replace(/\s/g, '') != "") {
                            //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                            //         } else {
                            //             $('#product-list').prop('selectedIndex', -1);
                            //         }
                            //         document.getElementById("employee_name").value = result[0].employeename;
                            //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                            //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                            //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                            //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                            //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            //         document.getElementById("tActualEndTime").value = result.aEndTime;
                            //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                            //         $('#event-modal').modal();
                            //     }
                            // } else {

                            // }
                        }
                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartActualTime").prop("disabled", false);
                        $("#btnEndActualTime").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                        document.getElementById("dtSODate").value = start;
                        document.getElementById("dtSODate2").value = start
                        var startTime = moment(event.dateStr).format("HH:mm");
                        var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                        var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                        document.getElementById("startTime").value = startTime;
                        document.getElementById("endTime").value = endTime;
                        var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                        document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                        $('#customerListModal').modal();
                    },

                    events: [],
                    eventRender: function () {

                    }
                });
                calendar.render();


                let draggableEl = document.getElementById('external-events-list');
                new Draggable(draggableEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl) {
                        let employee = eventEl.textContent;
                        let employeeID = employee.replace(/\D/g, '');
                        populateEmployDetails(eventEl.innerText)
                        return {
                            title: eventEl.innerText,
                            duration: '02:00'
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
                            suburb: data.tcustomervs1[i].Suburb || ' ',
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
                    // console.log(useData[i].fields.Street.replace('\n', ','));
                    let customerrecordObj = {
                        customerid: useData[i].fields.ID || ' ',
                        customername: useData[i].fields.ClientName || ' ',
                        customeremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street.replace(/(?:\r\n|\r|\n)/g, ', ') || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
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
                        suburb: data.tcustomervs1[i].Suburb || ' ',
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

        // if (min > 60) {
        //     var extraHours = min / 60;
        //     var num = String(extraHours).charAt(0);
        //     hour += parseInt(num);
        //     if (min % 60 > 0) {
        //         hour += 1;
        //     }
        // }
        return hour
    }

    // function getStartTime(str) {
    //     var time = str.split('T')[0];
    //     var startTime = time.substring(0, time.IndexOf('+'));

    // }






    // let eventDataValue = templateObject.appointmentrecords.get();





    //setTimeout(function () {

    //},1000);

    //resourceView.render();




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
            Router.go('/employeescard?id=' + listData);
        }
    });

    $(document).on("click", "#tblCustomerlist tbody tr", function (e) {
        document.getElementById("customer").value = $(this).find(".colCompany").text();
        document.getElementById("phone").value = $(this).find(".colPhone").text();
        document.getElementById("mobile").value = $(this).find(".colPhone").text();
        document.getElementById("state").value = $(this).find(".colState").text();
        document.getElementById("country").value = $(this).find(".colCountry").text();
        document.getElementById("address").value = $(this).find(".colStreetAddress").text().replace(/(?:\r\n|\r|\n)/g, ', ');
        document.getElementById("txtNotes").value = $(this).find(".colNotes").text();
        document.getElementById("suburb").value = $(this).find(".colCity").text();
        document.getElementById("zip").value = $(this).find(".colZipCode").text();
        let appointmentService = new AppointmentService();
        appointmentService.getAllAppointmentListCount().then(function (data) {
            if (data.tappointment.length > 0) {
                let max = 1;
                for (let i = 0; i < data.tappointment.length; i++) {
                    if (data.tappointment[i].Id > max) {
                        max = data.tappointment[i].Id;
                    }
                }
                document.getElementById("appID").value = max + 1;
                // Math.max.apply(Math, data.tappointment.map(function (max) {
                //     //alert(max.id);
                //     if (max.id > 0) {
                //         let appID = max.id + 1;
                //         document.getElementById("appID").value = appID;
                //     } else {
                //         document.getElementById("appID").value = 1;
                //     }
                // }));
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
        var appointmentData = appointmentList;


        var updateData = appointmentData.filter(apmt => {
            //appointmentList.employeename = employeeName;
            return apmt.id == id;
        });
        let index = appointmentList.map(function (e) { return e.id; }).indexOf(parseInt(id));
        let calendarSet = templateObject.calendarOptions.get();
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
            slotMax = calendarSet.apptEndTime;
        }

        if (calendarSet.showSun == false) {
            hideDays = [0];
        }

        if (calendarSet.showSat == false && calendarSet.showSun == false) {
            hideDays = [0, 6];
        }

        if (updateData.length > 0) {

            objectData = {
                type: "TAppointment",
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
                let eventIndex = updateCalendarData.map(function (e) { return e.id; }).indexOf(id);
                updateCalendarData[eventIndex].start = allocDate + ' ' + updateCalendarData[eventIndex].start.split(' ')[1];
                updateCalendarData[eventIndex].end = allocDate + ' ' + updateCalendarData[eventIndex].end.split(' ')[1];
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
                                Router.go('/appointmentlist');
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
                            document.getElementById("updateID").value = result[0].id || 0;
                            document.getElementById("appID").value = result[0].id;
                            document.getElementById("customer").value = result[0].accountname;
                            document.getElementById("phone").value = result[0].phone;
                            document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            document.getElementById("state").value = result[0].state;
                            document.getElementById("address").value = result[0].street;
                            document.getElementById("txtNotes").value = result[0].notes;
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
                            $('#event-modal').modal();
                            // this.$body.addClass('modal-open');
                        }
                    },
                    editable: true,
                    droppable: true, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    eventDrop: function (event) {
                        if (info.event._def.publicId != "") {
                            let eventDropID = info.event._def.publicId || '0';
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                            if (result.length > 0) {
                                objectData = {
                                    type: "TAppointment",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + ' ' + startTime + ":00" || '',
                                        EndTime: endDate + ' ' + endTime + ":00" || '',
                                    }
                                }

                                appointmentService.saveAppointment(objectData).then(function (data) {
                                    sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/appointments', '_self');
                                });
                            }
                            //     if (result.length > 0) {
                            //         templateObject.getAllProductData();
                            //         document.getElementById("updateID").value = result[0].id || 0;
                            //         document.getElementById("appID").value = result[0].id;
                            //         document.getElementById("customer").value = result[0].accountname;
                            //         document.getElementById("phone").value = result[0].phone;
                            //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                            //         document.getElementById("state").value = result[0].state;
                            //         document.getElementById("address").value = result[0].street;
                            //         document.getElementById("txtNotes").value = result[0].notes;
                            //         document.getElementById("suburb").value = result[0].suburb;
                            //         document.getElementById("zip").value = result[0].zip;
                            //         document.getElementById("country").value = result[0].country;
                            //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                            //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                            //             $("#googleLink").attr("href", googleLink);
                            //         }

                            //         if (result[0].product.replace(/\s/g, '') != "") {
                            //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                            //         } else {
                            //             $('#product-list').prop('selectedIndex', -1);
                            //         }
                            //         document.getElementById("employee_name").value = result[0].employeename;
                            //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                            //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                            //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                            //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                            //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                            //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            //         document.getElementById("tActualEndTime").value = result.aEndTime;
                            //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                            //         $('#event-modal').modal();
                            //     }
                            // } else {

                            // }
                        }
                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function (event) {
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

                        if (calendarSet.defaultProduct) {
                            $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        }
                        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        // if (moment(startTime).isAfter(endTime)) {
                        //     console.log("Start time cant be greater than end time");
                        // } else {
                        //     var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        //     var hours = duration.asHours();
                        //     document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);
                        // }
                        $('#customerListModal').modal();
                    },

                    events: eventData,
                    eventDidMount: function (event) {

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
                        return { domNodes: arrayOfDomNodes }
                    }

                });
                calendar.render();

                sideBarService.getAllAppointmentList().then(function (data) {
                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {

                    }).catch(function (err) {

                    });
                }).catch(function (err) {

                });
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {

        }

    }, false);

    $(document).on("click", "#check-all", function () {
        var checkbox = document.querySelector("#check-all");
        if (checkbox.checked) {
            $(".notevent").prop('checked', true);
        } else {
            $(".notevent").prop('checked', false);
        }
    })

    $(document).on("click", ".card", function () {
        document.getElementById("frmAppointment").reset();
        var id = $(this).attr('id');
        var appointmentData = appointmentList;
        var result = appointmentData.filter(apmt => {
            return apmt.id == id
        });

        templateObject.getAllProductData();
        document.getElementById("updateID").value = result[0].id || 0;
        document.getElementById("appID").value = result[0].id;
        document.getElementById("customer").value = result[0].accountname;
        document.getElementById("phone").value = result[0].phone;
        document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
        document.getElementById("state").value = result[0].state;
        document.getElementById("address").value = result[0].street;
        document.getElementById("txtNotes").value = result[0].notes;
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
        document.getElementById("tActualEndTime").value = result.aEndTime;
        document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
        $('#event-modal').modal();
    });

    $(document).ready(function () {

        $("#showSaturday").change(function () {
            var checkbox = document.querySelector("#showSunday");
            var checkboxSaturday = document.querySelector("#showSaturday");
            if (checkbox.checked && (checkboxSaturday.checked)) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            employeeName = arg.event._def.title.innerText.replace(/[0-9]/g, '');
                            populateEmployDetails(employeeName);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("YYYY/MM/DD") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else if (checkbox.checked) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [6], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else if (checkboxSaturday.checked) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [0], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else {
                setTimeout(function () {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [0, 6], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            }
        });

        $("#showSunday").change(function () {
            var checkbox = document.querySelector("#showSunday");
            var checkboxSaturday = document.querySelector("#showSaturday");
            if (checkbox.checked && (checkboxSaturday.checked)) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else if (checkbox.checked) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [6], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else if (checkboxSaturday.checked) {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [0], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            } else {
                setTimeout(function () {
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
                    var calendarEl = document.getElementById('calendar');
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("YYYY-MM-DD");
                    //if(eventData.length > 0){
                    var calendar = new Calendar(calendarEl, {
                        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                        themeSystem: 'bootstrap',
                        initialView: 'timeGridWeek',
                        hiddenDays: [0, 6], // hide Sunday and Saturday
                        customButtons: {
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
                        eventDrop: function (event) {
                            //alert($(this).date.format());
                            if (info.event._def.publicId != "") {
                                let eventDropID = info.event._def.publicId || '0';
                                let dateStart = new Date(info.event.start);
                                let dateEnd = new Date(info.event.end);
                                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);
                                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ':' + ("0" + dateStart.getMinutes()).toString().slice(-2);

                                if (result.length > 0) {
                                    objectData = {
                                        type: "TAppointment",
                                        fields: {
                                            Id: parseInt(eventDropID) || 0,
                                            StartTime: startDate + ' ' + startTime + ":00" || '',
                                            EndTime: endDate + ' ' + endTime + ":00" || '',
                                        }
                                    }

                                    appointmentService.saveAppointment(objectData).then(function (data) {
                                        sideBarService.getAllAppointmentList().then(function (dataUpdate) {
                                            addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) { }).catch(function (err) {
                                                window.open('/appointments', '_self');
                                            });
                                        }).catch(function (err) {
                                            window.open('/appointments', '_self');
                                        });
                                    }).catch(function (err) {
                                        window.open('/appointments', '_self');
                                    });
                                }
                                //     if (result.length > 0) {
                                //         templateObject.getAllProductData();
                                //         document.getElementById("updateID").value = result[0].id || 0;
                                //         document.getElementById("appID").value = result[0].id;
                                //         document.getElementById("customer").value = result[0].accountname;
                                //         document.getElementById("phone").value = result[0].phone;
                                //         document.getElementById("mobile").value = result[0].mobile || result[0].phone || '';
                                //         document.getElementById("state").value = result[0].state;
                                //         document.getElementById("address").value = result[0].street;
                                //         document.getElementById("txtNotes").value = result[0].notes;
                                //         document.getElementById("suburb").value = result[0].suburb;
                                //         document.getElementById("zip").value = result[0].zip;
                                //         document.getElementById("country").value = result[0].country;
                                //         if (result[0].street != '' && result[0].state != '' && result[0].country != '' && result[0].suburb != '') {
                                //             googleLink = "https://maps.google.com/?q=" + result[0].street + "," + result[0].state + "," + result[0].country + ',' + result[0].zip;
                                //             $("#googleLink").attr("href", googleLink);
                                //         }

                                //         if (result[0].product.replace(/\s/g, '') != "") {
                                //             $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');

                                //         } else {
                                //             $('#product-list').prop('selectedIndex', -1);
                                //         }
                                //         document.getElementById("employee_name").value = result[0].employeename;
                                //         document.getElementById("dtSODate").value = moment(event.event.start).format('DD/MM/YYYY');
                                //         document.getElementById("dtSODate2").value = moment(event.event.end).format('DD/MM/YYYY');;
                                //         document.getElementById("startTime").value = moment(event.event.start).format('HH:mm');
                                //         document.getElementById("endTime").value = moment(event.event.end).format('HH:mm');
                                //         document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                                //         document.getElementById("tActualStartTime").value = result[0].aStartTime;
                                //         document.getElementById("tActualEndTime").value = result.aEndTime;
                                //         document.getElementById("txtActualHoursSpent").value = result[0].actualHours;
                                //         $('#event-modal').modal();
                                //     }
                                // } else {

                                // }
                            }
                        },
                        //Triggers modal once external object is dropped to calender.
                        drop: function (event) {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                            $("#btnStartActualTime").prop("disabled", false);
                            $("#btnEndActualTime").prop("disabled", false);
                            $("#startTime").prop("disabled", false);
                            $("#endTime").prop("disabled", false);
                            $("#tActualStartTime").prop("disabled", false);
                            $("#tActualEndTime").prop("disabled", false);
                            $("#txtActualHoursSpent").prop("disabled", false);
                            var start = event.dateStr != '' ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                            document.getElementById("dtSODate").value = start;
                            document.getElementById("dtSODate2").value = start
                            var startTime = moment(event.dateStr).format("HH:mm");
                            var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), 'HH:mm').format('HH:mm');
                            var endTime = moment(startTime, 'HH:mm').add(appointmentHours.substr(0, 2), 'hours').format('HH:mm');
                            document.getElementById("startTime").value = startTime;
                            document.getElementById("endTime").value = endTime;
                            var hoursSpent = moment(appointmentHours, 'hours').format('HH');
                            document.getElementById("txtBookedHoursSpent").value = hoursSpent.replace(/^0+/, '');
                            $('#customerListModal').modal();
                        },

                        events: eventData,
                        eventDidMount: function (event) {

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
                            return { domNodes: arrayOfDomNodes }
                        }
                    });
                    calendar.render();


                    let draggableEl = document.getElementById('external-events-list');
                    new Draggable(draggableEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl) {
                            let employee = eventEl.textContent;
                            let employeeID = employee.replace(/\D/g, '');
                            populateEmployDetails(eventEl.innerText)
                            return {
                                title: eventEl.innerText,
                                duration: '02:00'
                            };
                        }
                    });
                    //}
                }, 50);
            }
        });
    });
});

Template.appointments.events({
    'click .calendar .days li': function (event) {
        Router.go('/newappointments');
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
                            type: "TAppointment",
                            fields: {
                                Id: parseInt(id),
                                Status: "Converted"
                            }
                        };
                        appointmentService.saveAppointment(objectDataConverted).then(function (data) {
                            $('.modal-backdrop').css('display', 'none');
                            Router.go('/invoicelist?success=true');
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
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }

                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Something went wrong',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');

                    if ((segError[1]) == ' "Unable to lock object') {

                        swal({
                            title: 'Something went wrong',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Something went wrong',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }

                } else if (oPost.readyState == '') {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Something went wrong',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                }

            }
        }

    },
    'click .btnAppointmentList': function (event) {
        $('.modal-backdrop').css('display', 'none');
        let id = $('#updateID').val();
        if (id) {
            Router.go('/appointmenttimelist?id=' + id);
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
        //get current week monday date to use it to search week in month
        let weekDate = moment($('.saturday').attr('id')).format("YYYY/MM/DD");

        //get weeks of the month from a template object
        weeksOfThisMonth = templateObject.weeksOfMonth.get();
        //Since we have all weeks of the month we query the weeks of the month object for data to get current week
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });

        let selectedWeekEnd = getSelectedWeek[0].end;
        if (getSelectedWeek.length < 2) {

        } else {
            selectedWeekEnd = getSelectedWeek[1].end;
        }

        //we then get index of the week in resource view so that we can use it to query the previous week
        let index = weeksOfThisMonth.map(function (e) { return e.end; }).indexOf(selectedWeekEnd);
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
                        let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                        if (!found) {
                            resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });

                            let employeeColor = result[0].color;
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
                    if (date >= startWeek && date <= endWeek) {

                        resourceColor = templateObject.employeerecords.get();

                        var result = resourceColor.filter(apmtColor => {
                            return apmtColor.employeeName == changeAppointmentView[a].employeename
                        });
                        let employeeColor = result[0].color;
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
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                } else if (daysOfTheWeek[w] === "Saturday") {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + '<span class="dateSat"></span></th>');
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

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                    '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                    'td class="fullWeek saturday hidesaturday" style="padding: 0px;><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>' + '' +
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
        let weekDate = moment($('.monday').attr('id')).format("YYYY/MM/DD");
        weeksOfThisMonth = templateObject.weeksOfMonth.get();
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });
        let index = weeksOfThisMonth.map(function (e) { return e.end; }).indexOf(getSelectedWeek[0].end);
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
                        let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                        if (!found) {
                            resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });

                            let employeeColor = result[0].color;
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
                    if (date >= startWeek && date <= endWeek) {
                        resourceColor = templateObject.employeerecords.get();

                        var result = resourceColor.filter(apmtColor => {
                            return apmtColor.employeeName == changeAppointmentView[a].employeename
                        });

                        let employeeColor = result[0].color;
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
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                } else if (daysOfTheWeek[w] === "Saturday") {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + '<span class="dateSun"></span></th>');
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

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                    '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                    'td class="fullWeek saturday hidesaturday" style="padding: 0px;><div class="droppable" style="height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>' + '' +
                    '</tr>';
                tableRowData.push(tableRow);

            }
            $('#here_table table').append(tableRowData);
            // templateObject.resourceAllocation.set(resourceChat.sort(function (a, b) {
            //     if (a.employeeName.toLowerCase() == 'NA') {
            //         return 1;
            //     }
            //     else if (b.employeeName.toLowerCase() == 'NA') {
            //         return -1;
            //     }
            //     return (a.employeeName.toLowerCase() > b.employeeName.toLowerCase()) ? 1 : -1;
            // }));
            // templateObject.resourceJobs.set(resourceJob);
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
    'click .close': function () {
        const templateObject = Template.instance();
        if (templateObject.checkRefresh.get() == true) {
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
                if(result[0].timelog !=""){
                    toUpdateID = result[0].timelog.fields.ID;
                } else{
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
                        type: "TAppointment",
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
                        if(result[0].timelog !=""){
                            appointmentService.saveTimeLog(objectData).then(function (data) {
                                appointmentService.saveAppointment(objectData1).then(function (data1) {
                                    sideBarService.getAllAppointmentList().then(function (data) {
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
                                                title: 'Something went wrong',
                                                text: err,
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
    
                                                } else if (result.dismiss === 'cancel') {
    
                                                }
                                            });
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Something went wrong',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
    
                                            } else if (result.dismiss === 'cancel') {
    
                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Something went wrong',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
    
                                        } else if (result.dismiss === 'cancel') {
    
                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            })
                        } else {
                            appointmentService.saveAppointment(objectData1).then(function (data1) {
                                sideBarService.getAllAppointmentList().then(function (data) {
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
                                            title: 'Something went wrong',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {

                                            } else if (result.dismiss === 'cancel') {

                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Something went wrong',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {

                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                    window.open('/appointments', '_self');
                                });
                            }).catch(function (err) {
                                swal({
                                    title: 'Something went wrong',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {

                                    } else if (result.dismiss === 'cancel') {

                                    }
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                        
                    }


                }).catch(function (err) {
                    swal({
                        title: 'Something went wrong',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {

                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else if ($('#tActualStartTime').val() != "" && result[0].aStartTime == "") {
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
                        type: "TAppointment",
                        fields: {
                            Id: parseInt(result[0].id),
                            Othertxt: ""
                        }
                    };
                       
                        if(result[0].timelog !=""){
                                appointmentService.saveAppointment(objectData1).then(function (data1) {
                                    sideBarService.getAllAppointmentList().then(function (data) {
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
                                                title: 'Something went wrong',
                                                text: err,
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
    
                                                } else if (result.dismiss === 'cancel') {
    
                                                }
                                            });
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Something went wrong',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
    
                                            } else if (result.dismiss === 'cancel') {
    
                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Something went wrong',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
    
                                        } else if (result.dismiss === 'cancel') {
    
                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                        
                        } else {
                            appointmentService.saveAppointment(objectData1).then(function (data1) {
                                sideBarService.getAllAppointmentList().then(function (data) {
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
                                            title: 'Something went wrong',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {

                                            } else if (result.dismiss === 'cancel') {

                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Something went wrong',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {

                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                    window.open('/appointments', '_self');
                                });
                            }).catch(function (err) {
                                swal({
                                    title: 'Something went wrong',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {

                                    } else if (result.dismiss === 'cancel') {

                                    }
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                        
                    


                }).catch(function (err) {
                    swal({
                        title: 'Something went wrong',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {

                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });


            } else {
                $("#tActualStartTime").val(("tActualStartTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
            }
        } else {
            $("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
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
                text: "You cannot Stop a job that is already paused. Please click Start to continue the job before trying to Stop it",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok'
            })
        } else {
            if (document.getElementById("tActualStartTime").value == "") { } else {
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
                        if (endTime > startTime) {
                            document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                            $("#btnSaveAppointment").trigger("click");
                        } else {
                            swal({
                                title: 'Something went wrong',
                                text: "Start time cannot be greater than End time",
                                type: 'error',
                                showCancelButton: true,
                                confirmButtonText: 'Ok'
                            })
                            document.getElementById('tActualEndTime').value = '';
                            document.getElementById('txtActualHoursSpent').value = '0';

                        }
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
        $('#frmOnHoldModal').modal();
    },
    'click #btnOptions': function (event) {
        $('#frmOptions').modal();
    },
    'click #btnRepeatApp': function (event) {
        $('#frmOptions').modal('hide');
    },
    'change #showSaturday1': function () {
        var checkbox = document.querySelector("#showSaturday");
        if (checkbox.checked) {

        } else {

        }

    },
    'change #showSunday1': function () {
        var checkbox = document.querySelector("#showSunday");
        if (checkbox.checked) {

        } else {

        }

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
                        type: "TAppointment",
                        fields: {
                            Id: parseInt(id),
                            Active: false
                        }
                    }

                    appointmentService.saveAppointment(objectData).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        $('#event-modal').modal('hide');
                        sideBarService.getAllAppointmentList().then(function (data) {
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
                    });
                }
            } else if (result.dismiss === 'cancel') {
                window.open('/appointmentlist', "_self");
            } else {

            }
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
        } else {
            console.log("Enter end time above start time to calculate total hours");
        }
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
        } else {
            console.log("End time must be greater than start time");
        }
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
        } else {
            console.log("Enter end time above actual start time to calculate total hours");
        }
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
        } else {
            console.log("End time must be greater than start time");
        }
    },
    'submit #appointmentOptions': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        event.preventDefault();

        let showSat = false;
        let showSun = false;
        if ($('#showSaturday').is(':checked')) {
            showSat = true;
        }

        if ($('#showSunday').is(':checked')) {
            showSun = true;
        }
        let settingID = '';
        let templateObject = Template.instance();
        let calOptions = templateObject.calendarOptions.get();
        if (calOptions) {
            settingID = calOptions.id;
        }

        let showTimeFrom = $('#hoursFrom').val() || '08:00';
        let showTimeTo = $('#hoursTo').val() || '17:00';
        let defaultTime = parseInt($('#defaultTime').val().split(' ')[0]) || '2';
        let showTimeIn = $('#showTimeIn').val().split(' ')[0] || '1';
        let defaultProduct = $('#productlist').children("option:selected").text() || '';
        let defaultProductID = $('#productlist').children("option:selected").val() || '';
        let date = new Date('2021-03-25 ' + showTimeTo);
        showTimeTo = date.getHours() + 2 + ':' + ('0' + date.getMinutes()).slice(-2);
        let appointmentService = new AppointmentService();

        let objectData = "";
        objectData = {
            type: "TAppointmentPreferences",
            fields: {
                ID: settingID,
                EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                ApptStartTime: showTimeFrom,
                ApptEndTime: showTimeTo,
                DefaultApptDuration: defaultTime,
                ShowApptDurationin: showTimeIn,
                DefaultServiceProductID: defaultProductID,
                DefaultServiceProduct: defaultProduct,
                ShowSaturdayinApptCalendar: showSat,
                ShowSundayinApptCalendar: showSun
            }
        };

        appointmentService.saveAppointmentPreferences(objectData).then(function (data) {
            $('.fullScreenSpin').css('display', 'none');
            //window.open('/appointments', '_self');
            sideBarService.getAllAppointmentPredList().then(function (data) {
                addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {
                    window.open('/appointments', '_self');
                }).catch(function (err) {
                    window.open('/appointments', '_self');
                });
            }).catch(function (err) {
                window.open('/appointments', '_self');
            });
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });


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
                    if (results.value) {

                    } else if (results.dismiss === 'cancel') {

                    }
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
                            type: "TAppointment",
                            fields: {
                                Id: parseInt(result[0].id),
                                Othertxt: "Paused"
                            }
                        };

                        appointmentService.saveTimeLog(objectData).then(function (data) {
                            appointmentService.saveAppointment(objectData1).then(function (data1) {
                                sideBarService.getAllAppointmentList().then(function (data) {
                                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                                        $('.fullScreenSpin').css('display', 'none');
                                        window.open('/appointments', '_self');
                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                        window.open('/appointments', '_self');
                                    });
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                    window.open('/appointments', '_self');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });

                        }).catch(function (err) {
                            console.log(err);
                            swal({
                                title: 'Something went wrong',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {

                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        swal("Please note", "You can't pause a job that has been ended, start the Job again to pause it.", 'info');
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Something went wrong',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {

                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
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
    'submit #frmAppointment': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var frmAppointment = $('#frmAppointment')[0];
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        var appointmentData = templateObject.appointmentrecords.get();
        let updateID = $('#updateID').val() || 0;
        let paused = "";
        let result = "";

        event.preventDefault();
        var formData = new FormData(frmAppointment);
        let aStartDate = '';
        let aEndDate = '';
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
        if (aStartTime != '') {
            aStartDate = moment().format("YYYY-MM-DD") + ' ' + aStartTime;
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
                type: "TAppointment",
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
                    Status: status
                }
            };
        } else {
            objectData = {
                type: "TAppointment",
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
                    Status: status
                }
            };
        }

        appointmentService.saveAppointment(objectData).then(function (data) {
            let id = data.fields.ID;
            if (Object.keys(obj).length > 0) {
                obj.fields.appointID = id;
                appointmentService.saveTimeLog(obj).then(function (data1) {
                    sideBarService.getAllAppointmentList().then(function (data) {
                        addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                            window.open('/appointments', '_self');
                        }).catch(function (err) {
                            window.open('/appointments', '_self');
                        });
                    }).catch(function (err) {
                        window.open('/appointments', '_self');
                    });
                }).catch(function () {

                })
            } else {
                sideBarService.getAllAppointmentList().then(function (data) {
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
                title: 'Something went wrong',
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

        if (jobCount == '0') { $('.no-result').show(); } else {
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
    }
});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('and', (a, b) => {
    return a && b;
});
