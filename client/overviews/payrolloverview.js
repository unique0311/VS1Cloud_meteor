import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import XLSX from 'xlsx';
import { SideBarService }from '../js/sidebar-service';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.payrolloverview.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.timesheetrecords = new ReactiveVar([]);
    templateObject.jobsrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
});

Template.payrolloverview.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const timeSheetList = [];
    const tableHeaderList = [];
    const jobsList = [];
    let clockEntry = [];

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
    $("#employee_name").val(Session.get('mySessionEmployee'));
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    let currentId = FlowRouter.current().context.hash;
    if (currentId === "clockOnOff") {
        setTimeout(function () {
            $('#settingsModal').modal('show');
            //$('#btnAddNewAccounts').click();
        }, 500);

    }
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
        if (error) {}
        else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    templateObject.diff_hours = function (dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(diff);
    }

    templateObject.dateFormat = function (date) {
        var dateParts = date.split("/");
        var dateObject = dateParts[2] + '/' + ('0' + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
        return dateObject;
    }

    templateObject.getAllTimeSheetData = function () {
        contactService.getAllTimeSheetListEmp().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let sumTotalCharge = 0;
            let sumSumHour = 0;
            let sumSumHourlyRate = 0;
            for (let t = 0; t < data.ttimesheet.length; t++) {
                if (data.ttimesheet[t].fields.Logs != null) {
                    let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || 0.00;
                    let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || 0.00;
                    let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || 0.00;
                    let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || 0.00;

                    sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                    sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                    sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                    var dataList = {
                        id: data.ttimesheet[t].fields.ID || '',
                        employee: data.ttimesheet[t].fields.EmployeeName || '',
                        hourlyrate: hourlyRate,
                        hours: data.ttimesheet[t].fields.Hours || '',
                        job: data.ttimesheet[t].fields.Job || '',
                        labourcost: labourCost,
                        overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                        sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                        timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                        product: data.ttimesheet[t].fields.ServiceName || '',
                        timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                        timelog: data.ttimesheet[t].fields.Logs || '',
                        isPaused: data.ttimesheet[t].fields.InvoiceNotes || '',
                        totalamountex: totalAmount || 0.00,
                        totaladjusted: totalAdjusted || 0.00,
                        totalamountinc: totalAmountInc || 0.00,
                        overtime: 0,
                        double: 0,
                        additional: Currency + '0.00',
                        paychecktips: Currency + '0.00',
                        cashtips: Currency + '0.00',
                        notes: data.ttimesheet[t].fields.Notes || '',
                        finished: 'Not Processed',
                        color: '#f6c23e'
                    };
                    timeSheetList.push(dataList);
                }

            }
            $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
            $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
            $('.lblSumHour').text(sumSumHour);
            templateObject.timesheetrecords.set(timeSheetList);
            $('.fullScreenSpin').css('display', 'none');

        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display', 'none');
            // Meteor._reload.reload();
        });
    }

    templateObject.getAllTimeSheetData();
    templateObject.getEmployees = function () {
        getVS1Data('TEmployee').then(function (dataObject) {

            if (dataObject.length == 0) {
                sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TEmployee', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.temployee.length; i++) {
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeno: data.temployee[i].fields.EmployeeNo || '',
                            employeename: data.temployee[i].fields.EmployeeName || '',
                            firstname: data.temployee[i].fields.FirstName || '',
                            lastname: data.temployee[i].fields.LastName || '',
                            phone: data.temployee[i].fields.Phone || '',
                            mobile: data.temployee[i].fields.Mobile || '',
                            email: data.temployee[i].fields.Email || '',
                            address: data.temployee[i].fields.Street || '',
                            country: data.temployee[i].fields.Country || '',
                            department: data.temployee[i].fields.DefaultClassName || '',
                            custFld1: data.temployee[i].fields.CustFld1 || '',
                            custFld2: data.temployee[i].fields.CustFld2 || '',
                            custFld3: data.temployee[i].fields.CustFld3 || '',
                            custFld4: data.temployee[i].fields.CustFld4 || ''
                        };

                        if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                            dataTableList.push(dataList);
                        }
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                            if (error) {}
                            else {
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
                    }

                    setTimeout(function () {
                        $('#tblEmployeelist').DataTable({

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Employee List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Employee List',
                                    filename: "Employee List - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }, {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "Employee List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }

                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[0, "asc"]],
                            action: function () {
                                $('#tblEmployeelist').DataTable().ajax.reload();
                            },

                        }).on('page', function () {

                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {});

                        // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                        //$('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblEmployeelist th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
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
                    $('#tblEmployeelist tbody').on('click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            FlowRouter.go('/employeescard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    //$('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;

                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employeeno: useData[i].fields.EmployeeNo || '',
                        employeename: useData[i].fields.EmployeeName || '',
                        firstname: useData[i].fields.FirstName || '',
                        lastname: useData[i].fields.LastName || '',
                        phone: useData[i].fields.Phone || '',
                        mobile: useData[i].fields.Mobile || '',
                        email: useData[i].fields.Email || '',
                        address: useData[i].fields.Street || '',
                        country: useData[i].fields.Country || '',
                        department: useData[i].fields.DefaultClassName || '',
                        custFld1: useData[i].fields.CustFld1 || '',
                        custFld2: useData[i].fields.CustFld2 || '',
                        custFld3: useData[i].fields.CustFld3 || '',
                        custFld4: useData[i].fields.CustFld4 || ''
                    };

                    if (useData[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        dataTableList.push(dataList);
                    }
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                        if (error) {}
                        else {
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
                }

                setTimeout(function () {
                    $('#tblEmployeelist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Employee List',
                                filename: "Employee List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }, {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblEmployeelist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {

                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {});

                    // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                    //$('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblEmployeelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('#tblEmployeelist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/employeescard?id=' + listData);
                    }
                });
            }
        }).catch(function (err) {
            sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TEmployee', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.temployee.length; i++) {
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        employeeno: data.temployee[i].fields.EmployeeNo || '',
                        employeename: data.temployee[i].fields.EmployeeName || '',
                        firstname: data.temployee[i].fields.FirstName || '',
                        lastname: data.temployee[i].fields.LastName || '',
                        phone: data.temployee[i].fields.Phone || '',
                        mobile: data.temployee[i].fields.Mobile || '',
                        email: data.temployee[i].fields.Email || '',
                        address: data.temployee[i].fields.Street || '',
                        country: data.temployee[i].fields.Country || '',
                        department: data.temployee[i].fields.DefaultClassName || '',
                        custFld1: data.temployee[i].fields.CustFld1 || '',
                        custFld2: data.temployee[i].fields.CustFld2 || '',
                        custFld3: data.temployee[i].fields.CustFld3 || '',
                        custFld4: data.temployee[i].fields.CustFld4 || ''
                    };

                    if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        dataTableList.push(dataList);
                    }
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                        if (error) {}
                        else {
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
                }

                setTimeout(function () {
                    $('#tblEmployeelist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Employee List',
                                filename: "Employee List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }, {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[2, "asc"]],
                        action: function () {
                            $('#tblEmployeelist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {

                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {});

                    // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                   // $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblEmployeelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('#tblEmployeelist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/employeescard?id=' + listData);
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                //$('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    }

    templateObject.getEmployees();
    //templateObject.getEmployeeClockOnClockOff();

    templateObject.getJobs = function () {
        getVS1Data('TJobVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllJobsNameData().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    for (let i = 0; i < data.tjobvs1.length; i++) {
                        var dataListJobs = {
                            id: data.tjobvs1[i].Id || '',
                            jobname: data.tjobvs1[i].ClientName || '',
                            // employeename:data.tjobvs1[i].EmployeeName || '',

                        };

                        if (data.tjobvs1[i].ClientName.replace(/\s/g, '') != '') {
                            jobsList.push(dataListJobs);
                        }
                        //}
                    }

                    templateObject.jobsrecords.set(jobsList);

                }).catch(function (err) {
                   // $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tjobvs1;
                for (let i = 0; i < useData.length; i++) {
                    var dataListJobs = {
                        id: useData[i].fields.ID || '',
                        jobname: useData[i].fields.ClientName || '',
                        // employeename:data.tjobvs1[i].EmployeeName || '',

                    };

                    if (useData[i].fields.ClientName.replace(/\s/g, '') != '') {
                        jobsList.push(dataListJobs);
                    }
                    //}
                }
                templateObject.jobsrecords.set(jobsList);
            }
        }).catch(function (err) {
        }); ;

    }
    templateObject.getJobs();

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

                    templateObject.datatablerecords1.set(productList);

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
                templateObject.datatablerecords1.set(productList);

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
                templateObject.datatablerecords1.set(productList);

            });
        });

    }

    setTimeout(function () {
        templateObject.getAllProductData();
    }, 500);

    $('#tblEmployeelist tbody').on('click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        if (listData) {
            FlowRouter.go('/employeescard?id=' + listData);
        }

    });

});

Template.payrolloverview.events({
'click .isPaused': function (event) {
        if ($('#btnHoldOne').prop('disabled')) {
            swal({
                title: 'Continue Timesheet',
                text: 'This Timesheet is currently "On Hold" do you want to "Continue" it',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    $("#btnClockOn").trigger("click");
                }

            });

        }
    },
    'click .clockOn': function (event) {
        if ($('#btnClockOn').prop('disabled')) {
            swal({
                title: 'New Timesheet',
                text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    $('#btnClockOn').prop('disabled', false);
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    let fromDateMonth = currentDate.getMonth();
                    let fromDateDay = currentDate.getDate();
                    if (currentDate.getMonth() < 10) {
                        fromDateMonth = "0" + currentDate.getMonth();
                    }

                    if (currentDate.getDate() < 10) {
                        fromDateDay = "0" + currentDate.getDate();
                    }
                    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

                    $('#dtSODate').val(fromDate);
                    $('#updateID').val("");
                    $('#startTime').val("");
                    $('#endTime').val("");
                    $("#btnClockOn").trigger("click");
                }

            });

        }
    },
    'click #btnNewEmployee': function (event) {
        FlowRouter.go('/employeescard');
    },
    'click #btnTimesheet': function (event) {
        FlowRouter.go('/timesheet');
    },
       'click #btnClockOnOff': function (event) {
        const templateObject = Template.instance();
        $("#employee_name").val(Session.get('mySessionEmployee'));
        $('#sltJob').val("");
        $('#product-list').val("");
        $('#updateID').val("");
        $('#startTime').val("");
        $('#endTime').val("");
        $('#txtBookedHoursSpent').val("");
        $('#startTime').prop('disabled', false);
        $('#endTime').prop('disabled', false);
        var curretDate = moment().format('DD/MM/YYYY');
        setTimeout(function () {
            $("#dtSODate").val(curretDate);
        }, 100);
        let clockList = templateObject.timesheetrecords.get();
        clockList = clockList.filter(clkList => {
            return clkList.employee == $('#employee_name').val();
        });

        if (clockList.length > 0) {

            if (clockList[clockList.length - 1].isPaused == "paused") {
                $('.btnHold').prop('disabled', true);
            } else {
                $('.btnHold').prop('disabled', false);
            }

            if (clockList[clockList.length - 1].isPaused == "paused") {
                $(".paused").show();
                $("#btnHold").prop("disabled", true);
                $("#btnHold").addClass("mt-32");
            } else {
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                $("#btnHold").removeClass("mt-32");
            }

            if (Array.isArray(clockList[clockList.length - 1].timelog) && clockList[clockList.length - 1].isPaused != "completed") {
                let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                let date = clockList[clockList.length - 1].timesheetdate;
                if (startTime != "") {
                    $('#startTime').val(startTime.split(' ')[1]);
                    $('#dtSODate').val(date);
                    $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hours);
                    $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                    $('#updateID').val(clockList[clockList.length - 1].id);
                    $('#txtNotes').val(clockList[clockList.length - 1].notes);
                    $('#sltJob').val(clockList[clockList.length - 1].job);
                    $('#product-list').val(clockList[clockList.length - 1].product);
                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                    $('#startTime').prop('disabled', true);
                }
            } else if (clockList[clockList.length - 1].isPaused != "completed") {
                if (clockList[clockList.length - 1].timelog.fields.EndDatetime == "") {
                    let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                    let date = clockList[clockList.length - 1].timesheetdate;
                    if (startTime != "") {
                        $('#startTime').val(startTime);
                        $('#dtSODate').val(date);
                        $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hours);
                        $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                        $('#updateID').val(clockList[clockList.length - 1].id);
                        $('#txtNotes').val(clockList[clockList.length - 1].notes);
                        $('#sltJob').val(clockList[clockList.length - 1].job);
                        $('#product-list').val(clockList[clockList.length - 1].product);
                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                        $('#startTime').prop('disabled', true);
                    }
                }
            }
        } else {
            $(".paused").hide();
            $("#btnHold").prop("disabled", false);
        }
        $('#settingsModal').modal('show');
    },
    'click #btnClockOn': function () {
        const templateObject = Template.instance();
        let clockList = templateObject.timesheetrecords.get();
         clockList = clockList.filter(clkList => {
                return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
        });
        let contactService = new ContactService();
        let updateID = $("#updateID").val() || "";
        let checkStatus = "";
        let checkStartTime = "";
        let checkEndTime = "";
        let latestTimeLogId = "";
        let toUpdate = {};
        let newEntry = {};
        let date = new Date();
        if (clockList.length > 0) {

            if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
            } else {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
            }
        }
        // if (checkStatus == "paused") {
        //     return false;
        // }
        if (checkStatus == "completed") {
            $("#updateID").val("");
            $("#txtBookedHoursSpent").val(1);
            $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
            let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
            var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
            var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
            if (endTime > startTime) {
                document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            } else if (document.getElementById("endTime").value == "") {
                endTime = "";
            }
            $("#btnSaveTimeSheet").trigger("click");
        } else {
            $('.fullScreenSpin').css('display', 'inline-block');
            if (checkStartTime != "" && checkEndTime == "" && $('#btnHold').prop('disabled') == true) {
                let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                let endTime = $('#endTime').val() || ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                let startTime = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                toUpdate = {
                    type: "TTimeLog",
                    fields: {
                        ID: latestTimeLogId,
                        EndDatetime: date1 + ' ' + endTime
                    }
                }

                newEntry = {
                    type: "TTimeLog",
                    fields: {
                        TimeSheetID: updateID,
                        StartDatetime: date1 + ' ' + startTime,
                        Description: "Job Continued"
                    }
                }

                let updateTimeSheet = {
                    type: "TTimeSheet",
                    fields: {
                        ID: updateID,
                        InvoiceNotes: ""
                    }
                }

                contactService.saveTimeSheetLog(newEntry).then(function (savedData) {
                    contactService.saveTimeSheetLog(toUpdate).then(function (savedData1) {
                        contactService.saveClockTimeSheet(updateTimeSheet).then(function (savedTimesheetData) {
                            window.open("/timesheet", '_self');
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function (err) {});
                        // contactService.saveClockonClockOff(toUpdate).then(function (data) {

                        // })
                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
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
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else if(clockList.length < 1){
                $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                 $("#btnSaveTimeSheet").trigger("click");
            } else {
                $('.fullScreenSpin').css('display', 'none');
                return false;
                // $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                // let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                // var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
                // var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
                // if (endTime > startTime) {
                //     document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                // } else if (document.getElementById("endTime").value == "") {
                //     endTime = "";
                // }
                // $("#btnSaveTimeSheet").trigger("click");

            }
        }
    },
    'click #btnClockOff': function () {
        let templateObject = Template.instance();
        let clockList = templateObject.timesheetrecords.get();
        let contactService = new ContactService();
        let updateID = $("#updateID").val() || "";
        let startTime = $("#startTime").val() || "";
        let checkStatus = "";
        let checkStartTime = "";
        let checkEndTime = "";
        let latestTimeLogId = "";
        let toUpdate = {};
        let date = new Date();
        if (clockList.length > 0) {
            if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
            } else {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
            }
        }
        if (startTime == "") {
            swal({
                title: 'Oooops...',
                text: "Please Clock In before you can Clock Off",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        } else if (checkStatus == "paused") {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Cant End Timesheet',
                text: 'This Timesheet is Currently "On Hold", Do you want to "Continue" it? ',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    $("#btnClockOn").trigger("click");
                }

            });
        } else {
            swal({
                title: 'End Timesheet',
                text: "Are you sure you want to Clock Off",
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                    let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
                    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
                    document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                    $("#btnSaveTimeSheet").trigger("click");
                }

            });

        }
    },
    'click #btnHold': function (event) {
        $('#frmOnHoldModal').modal('show');
    },
    'click .btnSaveTimeSheet': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
         let templateObject = Template.instance();
        let checkStatus = "";
        let checkStartTime = "";
        let checkEndTime = "";
        let TimeSheetHours = 0;
        let updateID = $("#updateID").val() || "";
        let contactService = new ContactService();

        let clockList = templateObject.timesheetrecords.get();
        clockList = clockList.filter(clkList => {
                return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
        });
        if (clockList.length > 0) {
            if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                TimeSheetHours: clockList[clockList.length - 1].hours || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
            } else {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                TimeSheetHours: clockList[clockList.length - 1].hours || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
            }
        }

        var employeeName = $('.employee_name').val();
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        let date = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
        var startTime = $('#startTime').val() || '';
        var endTime = $('#endTime').val() || '';
        var edthour = $('#txtBookedHoursSpent').val() || 0.01;
        var techNotes = $('#txtNotes').val() || '';
        var product = $('#product-list').children("option:selected").text() || '';
        var jobName = $('#sltJob').val() || '';
        let isPaused = checkStatus;
        let toUpdate = {};
        let obj = {};
        let data = '';
        if (startTime != "") {
            startTime = date + ' ' + startTime;
        }

        if (endTime != "") {
            endTime = date + ' ' + endTime;
        }

        if ($('#txtBookedHoursSpent1').val() != 0.01) {
             edthour = parseFloat(edthour) + parseFloat($('#txtBookedHoursSpent1').val());
        }



        if (checkStartTime == "" && endTime != "") {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: "You can't clock off, because you haven't clocked in",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            return false;
        }

        if (checkStartTime == "" && startTime == "") {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: "You can't save this entry with no start time",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            return false;
        }

        if (updateID != "") {
            result = clockList.filter(Timesheet => {
                return Timesheet.id == updateID
            });

            if (result.length > 0) {
                if (result[0].timelog == null) {
                    obj = {
                        type: "TTimeLog",
                        fields: {
                            TimeSheetID: updateID,
                            EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                            StartDatetime: startTime,
                            EndDatetime: endTime,
                            Description: 'Timesheet Started',
                            EnteredBy: Session.get('mySessionEmployeeLoggedID')
                        }
                    };
                } else if ($('#startTime').val() != "" && $('#endTime').val() != "" && checkStatus != "completed") {
                    let startTime1 = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + (startdateGet.getDate())).slice(-2) + ' ' + ("0" + startdateGet.getHours()).slice(-2) + ":" + ("0" + startdateGet.getMinutes()).slice(-2);
                    obj = {
                        type: "TTimeLog",
                        fields: {
                            TimeSheetID: updateID,
                            EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                            StartDatetime: checkStartTime,
                            EndDatetime: endTime,
                            Description: 'Timesheet Completed',
                            EnteredBy: Session.get('mySessionEmployeeLoggedID')
                        }
                    };
                    isPaused = "completed";
                } else if (checkEndTime != "") {
                    aEndDate = moment().format("YYYY-MM-DD") + ' ' + endTime;
                }
            } else {
                obj = {
                    type: "TTimeLog",
                    fields: {
                        TimeSheetID: updateID,
                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                        StartDatetime: startTime,
                        EndDatetime: endTime,
                        Description: 'Timesheet Started',
                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                    }
                };
            }
        }
        if (updateID == "") {
            if ($('#tActualStartTime').val() != "") {
                obj = {
                    type: "TTimeLog",
                    fields: {
                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                        StartDatetime: startTime,
                        EndDatetime: endTime,
                        Description: 'Timesheet Started',
                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                    }
                };
            } else if ($('#tActualStartTime').val() != "" && $('#tActualEndTime').val() != "") {
                obj = {
                    type: "TTimeLog",
                    fields: {
                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                        StartDatetime: startTime,
                        EndDatetime: endTime,
                        Description: 'Timesheet Started & Completed Same Time',
                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                    }
                };

                isPaused = "completed";
            }
            data = {
                type: "TTimeSheetEntry",
                fields: {
                    // "EntryDate":"2020-10-12 12:39:14",
                    TimeSheet: [{
                            type: "TTimeSheet",
                            fields: {
                                EmployeeName: employeeName || '',
                                ServiceName: product || '',
                                LabourCost: 1,
                                Allowedit: true,
                                Logs: obj,
                                Hours: parseFloat(edthour) || 0.01,
                                // OverheadRate: 90,
                                Job: jobName || '',
                                // ServiceName: "Test"|| '',
                                TimeSheetClassName: "Default" || '',
                                Notes: techNotes || '',
                                InvoiceNotes: ""
                                // EntryDate: accountdesc|| ''
                            }
                        }
                    ],
                    "TypeName": "Payroll",
                    "WhoEntered": Session.get('mySessionEmployee') || ""
                }
            };
            contactService.saveTimeSheet(data).then(function (data) {
                window.open('/timesheet', '_self');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });

        } else {
            data = {
                type: "TTimeSheet",
                fields: {
                    ID: updateID,
                    EmployeeName: employeeName || '',
                    ServiceName: product || '',
                    LabourCost: 1,
                    Allowedit: true,
                    Hours: parseFloat(edthour) || 0.01,
                    // OverheadRate: 90,
                    Job: jobName || '',
                    // ServiceName: "Test"|| '',
                    TimeSheetClassName: "Default" || '',
                    Notes: techNotes || '',
                    InvoiceNotes: isPaused
                    // EntryDate: accountdesc|| ''
                }

            };

            contactService.saveClockTimeSheet(data).then(function (data) {
                if (Object.keys(obj).length > 0) {
                    if (obj.fields.Description == "Timesheet Completed") {
                        let endTime1 = endTime;
                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            toUpdateID = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID;
                        } else {
                            toUpdateID = clockList[clockList.length - 1].timelog.fields.ID;
                        }

                        if (toUpdateID != "") {
                            updateData = {
                                type: "TTimeLog",
                                fields: {
                                    ID: toUpdateID,
                                    EndDatetime: endTime1,
                                }
                            }
                        }
                        contactService.saveTimeSheetLog(obj).then(function (data) {
                            contactService.saveTimeSheetLog(updateData).then(function (data) {
                                window.open('/timesheet', '_self');
                            }).catch(function (err) {})
                        }).catch(function (err) {})
                    } else if (obj.fields.Description == "Timesheet Started") {
                        contactService.saveTimeSheetLog(obj).then(function (data) {
                            window.open('/timesheet', '_self');
                        }).catch(function (err) {})
                    }
                } else {
                    window.open('/timesheet', '_self');
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
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'change #startTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date = new Date();
        if (date1 == "") {
            date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
        } else {
            date1 = templateObject.dateFormat(date1);
        }
        var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'change #endTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date = new Date();
        if (date1 == "") {
            date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
        } else {
            date1 = templateObject.dateFormat(date1);
        }
        var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        } else {}
    },
    'click .btnTimesheetList': function (event) {
        $('.modal-backdrop').css('display', 'none');
        let id = $('#updateID').val();
        if (id) {
            FlowRouter.go('/timesheettimelog?id=' + id);
        } else {
            FlowRouter.go('/timesheettimelog');
        }
    },
    'click .btnAddVS1User': function (event) {
        swal({
            title: 'Is this an existing Employee?',
            text: '',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                swal("Please select the employee from the list below.", "", "info");
                $('#employeeListModal').modal('toggle');
                // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            } else if (result.dismiss === 'cancel') {
                FlowRouter.go('/employeescard?addvs1user=true');
            }
        })
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblEmployeelist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function (i, v) {
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
    'click .resetTable': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblEmployeelist'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {}
                        else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
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

        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblEmployeelist'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblEmployeelist',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
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
                        PrefName: 'tblEmployeelist',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblEmployeelist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblEmployeelist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblEmployeelist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
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
    'click #btnHold': function (event) {
        $('#frmOnHoldModal').modal('show');
    },
       'click .btnPauseJob': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        let contactService = new ContactService();
        let checkStatus = "";
        let checkStartTime = "";
        let checkEndTime = "";
        let updateID = $("#updateID").val() || "";
        let notes = $("#txtpause-notes").val() || "";
        let latestTimeLogId = '';
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

        if (updateID == "") {
            swal({
                title: 'Oooops...',
                text: 'Please save this entry before Pausing it',
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

        let clockList = templateObject.timesheetrecords.get();
        clockList = clockList.filter(clkList => {
            return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
        });
        if (clockList.length > 0) {
            if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
            } else {
                checkStatus = clockList[clockList.length - 1].isPaused || "";
                latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
            }
        }

        var employeeName = $('.employee_name').val();
        var startdateGet = new Date();
        let date = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
        var startTime = $('#startTime').val() || ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
        var endTime = $('#endTime').val() || ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
        let toUpdate = {};
        let data = '';
        if (startTime != "") {
            startTime = date + ' ' + startTime;
        }

        // if (checkStatus == "paused") {
        //     swal({
        //         title: 'Oooops...',
        //         text: 'You cant Pause entry that has been completed',
        //         type: 'info',
        //         showCancelButton: false,
        //         confirmButtonText: 'Try Again'
        //     }).then((results) => {
        //         if (results.value) {}
        //         else if (results.dismiss === 'cancel') {}
        //     });
        //     $('.fullScreenSpin').css('display', 'none');
        //     return false;
        // }

        toUpdate = {
            type: "TTimeLog",
            fields: {
                ID: latestTimeLogId,
                EndDatetime: date + ' ' + endTime
            }
        }

        data = {
            type: "TTimeLog",
            fields: {
                TimeSheetID: updateID,
                Description: type + ": " + notes || '',
                EmployeeName: employeeName,
                StartDatetime: startTime,
            }
        }

        contactService.saveTimeSheetLog(data).then(function (savedData) {
            let updateTimeSheet = {
                type: "TTimeSheet",
                fields: {
                    ID: updateID,
                    InvoiceNotes: "paused",
                    EmployeeName: employeeName,
                }
            }
            contactService.saveClockTimeSheet(updateTimeSheet).then(function (savedTimesheetData) {

                contactService.saveTimeSheetLog(toUpdate).then(function (data) {
                    window.open('/timesheet', '_self');
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
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
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });

            // contactService.saveClockonClockOff(toUpdate).then(function (data) {
            //     FlowRouter.go('/employeetimeclock');
            // })
        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });

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
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {

        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllAppointmentPredList().then(function (data) {
            addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {}).catch(function (err) {});
        }).catch(function (err) {});
        sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
            addVS1Data('TEmployee', JSON.stringify(data)).then(function (datareturn) {
                window.open('/payrolloverview', '_self');
            }).catch(function (err) {
                window.open('/payrolloverview', '_self');
            });
        }).catch(function (err) {
            window.open('/payrolloverview', '_self');
        });
    },
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleEmployee' + '.csv';
        rows[0] = ['First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'City/Suburb', 'State', 'Post Code', 'Country', 'Gender'];
        rows[1] = ['John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'M'];
        rows[1] = ['Jane', 'Smith', '9995551213', '9995551213', 'janesmith@email.com', 'janesmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'F'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleEmployee.xlsx';
    },
    'click .btnUploadFile': function (event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length)
                        result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }

    },
    'click .btnImport': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        var saledateTime = new Date();
        //let empStartDate = new Date().format("YYYY-MM-DD");
        var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "First Name")
                         && (results.data[0][1] == "Last Name") && (results.data[0][2] == "Phone")
                         && (results.data[0][3] == "Mobile") && (results.data[0][4] == "Email")
                         && (results.data[0][5] == "Skype") && (results.data[0][6] == "Street")
                         && ((results.data[0][7] == "Street2") || (results.data[0][7] == "City/Suburb")) && (results.data[0][8] == "State")
                         && (results.data[0][9] == "Post Code") && (results.data[0][10] == "Country")
                         && (results.data[0][11] == "Gender")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            //Meteor._reload.reload();
                            window.open('/employeelist?success=true', '_self');
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TEmployee",
                                fields: {
                                    FirstName: results.data[i + 1][0],
                                    LastName: results.data[i + 1][1],
                                    Phone: results.data[i + 1][2],
                                    Mobile: results.data[i + 1][3],
                                    DateStarted: empStartDate,
                                    DOB: empStartDate,
                                    Sex: results.data[i + 1][11] || "F",
                                    Email: results.data[i + 1][4],
                                    SkypeName: results.data[i + 1][5],
                                    Street: results.data[i + 1][6],
                                    Street2: results.data[i + 1][7],
                                    Suburb: results.data[i + 1][7],
                                    State: results.data[i + 1][8],
                                    PostCode: results.data[i + 1][9],
                                    Country: results.data[i + 1][10]

                                    // BillStreet: results.data[i+1][6],
                                    // BillStreet2: results.data[i+1][7],
                                    // BillState: results.data[i+1][8],
                                    // BillPostCode:results.data[i+1][9],
                                    // Billcountry:results.data[i+1][10]
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveEmployee(objDetails).then(function (data) {
                                        ///$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    });
                                }
                            }
                        }
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }

});

Template.payrolloverview.helpers({
    jobsrecords: () => {
        return Template.instance().jobsrecords.get().sort(function (a, b) {
            if (a.jobname == 'NA') {
                return 1;
            } else if (b.jobname == 'NA') {
                return -1;
            }
            return (a.jobname.toUpperCase() > b.jobname.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords1: () => {
        return Template.instance().datatablerecords1.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    edithours: () => {
        return Session.get('CloudEditTimesheetHours') || false;
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblEmployeelist'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
