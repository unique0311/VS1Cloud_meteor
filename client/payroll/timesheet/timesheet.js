import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
import { ProductService } from "../../product/product-service";
import { SideBarService } from '../../js/sidebar-service';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.timesheet.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.productsdatatablerecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.jobsrecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedTimesheet = new ReactiveVar([]);
    templateObject.timesheetrecords = new ReactiveVar([]);
    templateObject.selectedTimesheetID = new ReactiveVar();
    templateObject.selectedFile = new ReactiveVar();

});

Template.timesheet.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    const employeeList = [];
    const jobsList = [];
    const timesheetList = [];
    const timeSheetList = [];
    const dataTableList = [];
    const tableHeaderList = [];

    var today = moment().format('DD/MM/YYYY');
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

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };
    // templateObject.dateAsAt.set(begunDate);

    $("#date-input,#dateTo,#dtSODate,#dateFrom").datepicker({
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

    $("#employee_name").val(Session.get('mySessionEmployee'));

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);
    $("#dtSODate").val(begunDate);

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

    templateObject.timeToDecimal = function (time) {
        var arr = time.split(':');
        var dec = parseInt((arr[1] / 6) * 10, 10);

        return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec);
    }

    templateObject.timeFormat = function (hours) {
        let decimalTimeString = hours || 0;
        let date = new Date(0, 0);
        date.setSeconds(+decimalTimeString * 60 * 60);
        let hour = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let time = hour + ":" + minutes;
        return time;
    }

    templateObject.getAllTimeSheetData = function () {
        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};

                    let sumTotalCharge = 0;
                    let sumSumHour = 0;
                    let sumSumHourlyRate = 0;
                    for (let t = 0; t < data.ttimesheet.length; t++) {
                        let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || 0.00;
                        let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || 0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || 0.00;
                        let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || 0.00;
                        let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || 0.00;
                        sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                        sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                        sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                        let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                        var dataList = {
                            id: data.ttimesheet[t].fields.ID || '',
                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                            hourlyrate: hourlyRate,
                            hours: data.ttimesheet[t].fields.Hours || '',
                            hourFormat: hoursFormatted,
                            job: data.ttimesheet[t].fields.Job || '',
                            product: data.ttimesheet[t].fields.ServiceName || '',
                            labourcost: labourCost,
                            overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                            // suppliername: data.ttimesheet[t].SupplierName || '',
                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                            totalamountex: totalAmount || 0.00,
                            totaladjusted: totalAdjusted || 0.00,
                            totalamountinc: totalAmountInc || 0.00,
                            overtime: 0,
                            double: 0,
                            status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                            additional: Currency + '0.00',
                            paychecktips: Currency + '0.00',
                            cashtips: Currency + '0.00',
                            // totaloustanding: totalOutstanding || 0.00,
                            // orderstatus: data.ttimesheet[t].OrderStatus || '',
                            // custfield1: '' || '',
                            // custfield2: '' || '',
                            // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                            notes: data.ttimesheet[t].fields.Notes || '',
                            finished: 'Not Processed',
                            color: '#f6c23e'
                        };
                        dataTableList.push(dataList);

                    }
                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                    $('.lblSumHour').text(sumSumHour.toFixed(2));
                    templateObject.datatablerecords.set(dataTableList);
                    templateObject.datatablerecords1.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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

                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    setTimeout(function () {
                        $('.fullScreenSpin').css('display', 'none');
                        // //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblTimeSheet').DataTable({
                            columnDefs: [
                                // {type: 'date', targets: 0},
                                {
                                    "orderable": false,
                                    "targets": 0
                                }, {
                                    targets: 'sorting_disabled',
                                    orderable: false
                                }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "timesheetist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: [':visible :not(:last-child)'],
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Time Sheet',
                                    filename: "timesheetist_" + moment().format(),
                                    exportOptions: {
                                        columns: [':visible :not(:last-child)'],
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: {
                                fixedColumnsRight: 1,
                                fixedColumnsLeft: 1
                            },
                            // colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            // "scrollY": "500px",
                            // "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [[1, "desc"]],
                            action: function () {
                                $('#tblTimeSheet').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                                let urlParametersPage = FlowRouter.current().queryParams.page;
                                if (urlParametersPage) {
                                    this.fnPageChange('last');
                                }
                                $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                                $('.myvarFilterForm').appendTo(".colDateFilter");
                            }

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblTimeSheet th');
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
                    $('div.dataTables_filter input').addClass('form-control');
                    $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            var employeeName = $(event.target).closest("tr").find(".colName").attr('empname') || '';
                            var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                            var productName = $(event.target).closest("tr").find(".colProduct").text() || '';
                            var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                            var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';
                            $('#edtTimesheetID').val(listData);
                            $('#add-timesheet-title').text('Edit TimeSheet');
                            $('.sltEmployee').val(employeeName);
                            $('.sltJob').val(jobName);
                            $('#product-list').val(productName);
                            $('.lineEditHour').val(regHour);
                            $('.lineEditTechNotes').val(techNotes);
                            // window.open('/billcard?id=' + listData,'_self');
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });

            } else {
                $('.fullScreenSpin').css('display', 'none');
                let data = JSON.parse(dataObject[0].data);
                let lineItems = [];
                let lineItemObj = {};

                let sumTotalCharge = 0;
                let sumSumHour = 0;
                let sumSumHourlyRate = 0;
                for (let t = 0; t < data.ttimesheet.length; t++) {
                    let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || 0.00;
                    let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || 0.00;
                    let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || 0.00;
                    let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || 0.00;
                    sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                    sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                    sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                    let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                    var dataList = {
                        id: data.ttimesheet[t].fields.ID || '',
                        employee: data.ttimesheet[t].fields.EmployeeName || '',
                        hourlyrate: hourlyRate,
                        hours: data.ttimesheet[t].fields.Hours || '',
                        hourFormat: hoursFormatted,
                        job: data.ttimesheet[t].fields.Job || '',
                        product: data.ttimesheet[t].fields.ServiceName || '',
                        labourcost: labourCost,
                        overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                        sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                        timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                        // suppliername: data.ttimesheet[t].SupplierName || '',
                        timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                        totalamountex: totalAmount || 0.00,
                        totaladjusted: totalAdjusted || 0.00,
                        totalamountinc: totalAmountInc || 0.00,
                        status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                        overtime: 0,
                        double: 0,
                        additional: Currency + '0.00',
                        paychecktips: Currency + '0.00',
                        cashtips: Currency + '0.00',
                        // totaloustanding: totalOutstanding || 0.00,
                        // orderstatus: data.ttimesheet[t].OrderStatus || '',
                        // custfield1: '' || '',
                        // custfield2: '' || '',
                        // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                        notes: data.ttimesheet[t].fields.Notes || '',
                        finished: 'Not Processed',
                        color: '#f6c23e'
                    };
                    dataTableList.push(dataList);

                }




                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                $('.lblSumHour').text(sumSumHour.toFixed(2));
                templateObject.datatablerecords.set(dataTableList);
                templateObject.datatablerecords1.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    // //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTimeSheet').DataTable({
                        columnDefs: [
                            // {type: 'date', targets: 0},
                            {
                                "orderable": false,
                                "targets": 0
                            }, {
                                targets: 'sorting_disabled',
                                orderable: false
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "timesheetist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: [':visible :not(:last-child)'],
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Time Sheet',
                                filename: "timesheetist_" + moment().format(),
                                exportOptions: {
                                    columns: [':visible :not(:last-child)'],
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: {
                            fixedColumnsRight: 1,
                            fixedColumnsLeft: 1
                        },
                        // colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        // "scrollY": "500px",
                        // "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [[1, "desc"]],
                        action: function () {
                            $('#tblTimeSheet').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblTimeSheet th');
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
                $('div.dataTables_filter input').addClass('form-control');
                $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        var employeeName = $(event.target).closest("tr").find(".colName").attr('empname') || '';
                        var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                        var productName = $(event.target).closest("tr").find(".colProduct").text() || '';
                        var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                        var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';
                        $('#edtTimesheetID').val(listData);
                        $('#add-timesheet-title').text('Edit TimeSheet');
                        $('.sltEmployee').val(employeeName);
                        $('.sltJob').val(jobName);
                        $('#product-list').val(productName);
                        $('.lineEditHour').val(regHour);
                        $('.lineEditTechNotes').val(techNotes);
                        // window.open('/billcard?id=' + listData,'_self');
                    }
                });
            }

        });
    }

    templateObject.getAllTimeSheetData();

    templateObject.getAllTimeSheetDataClock = function () {
        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
                sideBarService.getAllTimeSheetList().then(function (data) {
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
                            let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                            var dataList = {
                                id: data.ttimesheet[t].fields.ID || '',
                                employee: data.ttimesheet[t].fields.EmployeeName || '',
                                hourlyrate: hourlyRate,
                                hours: data.ttimesheet[t].fields.Hours || '',
                                hourFormat: hoursFormatted,
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
                                status: data.ttimesheet[t].fields.Status || 'Unprocessed',
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

                    if(clockList.length > 0){
                   if(clockList[clockList.length - 1].isPaused == "completed") {
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusOnHold');
                     $('#employeeStatusField').addClass('statusClockedOff').text('Clocked Off');
                   } else if(clockList[clockList.length - 1].isPaused == "paused") {
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusClockedOff');
                     $('#employeeStatusField').addClass('statusOnHold').text('On Hold');
                   } else if(clockList[clockList.length - 1].isPaused == "") {
                     $('#employeeStatusField').removeClass('statusOnHold');
                     $('#employeeStatusField').removeClass('statusClockedOff');
                     $('#employeeStatusField').addClass('statusClockedOn').text('Clocked On');
                   }

                } else{
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusOnHold');
                     $('#employeeStatusField').addClass('statusClockedOn').text('Clocked Off');

                }

                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                    $('.lblSumHour').text(sumSumHour.toFixed(2));
                    templateObject.timesheetrecords.set(timeSheetList);
                    let url = window.location.href;
                    if (url.indexOf('?id') > 1) {
                        url1 = new URL(window.location.href);
                        let timesheetID = url1.searchParams.get("id");
                        let clockList = templateObject.timesheetrecords.get();
                        var clockList = clockList.filter(timesheetInfo => {
                            return timesheetInfo.id == timesheetID
                        });

                        if (clockList.length > 0) {
                            $('#sltJobOne').val("");
                            $('#product-listone').val("");
                            $('#updateID').val("");
                            $('#startTime').val("");
                            $('#endTime').val("");
                            $('#txtBookedHoursSpent').val("");
                            $('#startTime').prop('disabled', false);
                            $('#endTime').prop('disabled', false);
                            $('#btnClockOn').prop('disabled', false);
                            $('#btnHoldOne').prop('disabled', false);
                            $('#btnClockOff').prop('disabled', false);
                            $('.processTimesheet').prop('disabled', false);

                            if (clockList[clockList.length - 1].isPaused == "paused") {
                                $('.btnHoldOne').prop('disabled', true);
                            } else {
                                $('.btnHoldOne').prop('disabled', false);
                            }

                            if (clockList[clockList.length - 1].isPaused == "paused") {
                                $(".paused").show();
                                $("#btnHoldOne").prop("disabled", true);
                                $("#btnHoldOne").addClass("mt-32");
                            } else {
                                $(".paused").hide();
                                $("#btnHoldOne").prop("disabled", false);
                                $("#btnHoldOne").removeClass("mt-32");
                            }

                            if (clockList[clockList.length - 1].status == "Processed") {
                                $('.processTimesheet').prop('disabled', true);
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
                                    $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                    $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                    $('#product-listone').val(clockList[clockList.length - 1].product);
                                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                                    $('#startTime').prop('disabled', true);
                                    if (clockList[clockList.length - 1].isPaused == "completed") {
                                        $('#endTime').val(endTime);
                                        $('#endTime').prop('disabled', true);
                                        $('#btnClockOn').prop('disabled', true);
                                        $('#btnHoldOne').prop('disabled', true);
                                        $('#btnClockOff').prop('disabled', true);
                                    }
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
                                        $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                        $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                        $('#product-listone').val(clockList[clockList.length - 1].product);
                                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                                        $('#startTime').prop('disabled', true);
                                        if (clockList[clockList.length - 1].isPaused == "completed") {
                                            $('#endTime').val(endTime);
                                            $('#endTime').prop('disabled', true);
                                            $('#btnClockOn').prop('disabled', true);
                                            $('#btnHoldOne').prop('disabled', true);
                                            $('#btnClockOff').prop('disabled', true);
                                        }
                                    }
                                }
                            }

                        }
                        $('#settingsModal').modal('show');

                    }
                    $('.fullScreenSpin').css('display', 'none');

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
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
                        let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                        var dataList = {
                            id: data.ttimesheet[t].fields.ID || '',
                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                            hourlyrate: hourlyRate,
                            hours: data.ttimesheet[t].fields.Hours || '',
                            hourFormat: hoursFormatted,
                            job: data.ttimesheet[t].fields.Job || '',
                            labourcost: labourCost,
                            overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                            product: data.ttimesheet[t].fields.ServiceName || '',
                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                            timelog: data.ttimesheet[t].fields.Logs || '',
                            isPaused: data.ttimesheet[t].fields.InvoiceNotes || '',
                            status: data.ttimesheet[t].fields.Status || '',
                            totalamountex: totalAmount || 0.00,
                            totaladjusted: totalAdjusted || 0.00,
                            totalamountinc: totalAmountInc || 0.00,
                            overtime: 0,
                            double: 0,
                            status: data.ttimesheet[t].fields.Status || 'Unprocessed',
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
                 clockList = timeSheetList.filter(clkList => {
                    return clkList.employee == Session.get('mySessionEmployee');
                });

                if(clockList.length > 0){
                   if(clockList[clockList.length - 1].isPaused == "completed") {
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusOnHold');
                     $('#employeeStatusField').addClass('statusClockedOff').text('Clocked Off');
                   } else if(clockList[clockList.length - 1].isPaused == "paused") {
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusClockedOff');
                     $('#employeeStatusField').addClass('statusOnHold').text('On Hold');
                   } else if(clockList[clockList.length - 1].isPaused == "") {
                      $('#employeeStatusField').removeClass('statusOnHold');
                     $('#employeeStatusField').removeClass('statusClockedOff');
                     $('#employeeStatusField').addClass('statusClockedOn').text('Clocked On');
                   }

                } else{
                     $('#employeeStatusField').removeClass('statusClockedOn');
                     $('#employeeStatusField').removeClass('statusClockedOff');
                     $('#employeeStatusField').addClass('statusClockedOn').text('Clocked Off');

                }
                
                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                $('.lblSumHour').text(sumSumHour.toFixed(2));
                templateObject.timesheetrecords.set(timeSheetList);
                let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(window.location.href);
                    let timesheetID = url1.searchParams.get("id");
                    let clockList = templateObject.timesheetrecords.get();
                    var clockList = clockList.filter(timesheetInfo => {
                        return timesheetInfo.id == timesheetID
                    });

                    if (clockList.length > 0) {
                        $('#sltJobOne').val("");
                        $('#product-listone').val("");
                        $('#updateID').val("");
                        $('#startTime').val("");
                        $('#endTime').val("");
                        $('#txtBookedHoursSpent').val("");
                        $('#startTime').prop('disabled', false);
                        $('#endTime').prop('disabled', false);
                        $('#btnClockOn').prop('disabled', false);
                        $('#btnHoldOne').prop('disabled', false);
                        $('#btnClockOff').prop('disabled', false);
                        $('.processTimesheet').prop('disabled', false);

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $('.btnHoldOne').prop('disabled', true);
                        } else {
                            $('.btnHoldOne').prop('disabled', false);
                        }

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $(".paused").show();
                            $("#btnHoldOne").prop("disabled", true);
                            $("#btnHoldOne").addClass("mt-32");
                        } else {
                            $(".paused").hide();
                            $("#btnHoldOne").prop("disabled", false);
                            $("#btnHoldOne").removeClass("mt-32");
                        }

                        if (clockList[clockList.length - 1].status == "Processed") {
                            $('.processTimesheet').prop('disabled', true);
                        }

                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                            let endTime = clockList[clockList.length - 1].timelog[0].fields.EndDatetime || '';
                            let date = clockList[clockList.length - 1].timesheetdate;

                            if (startTime != "") {
                                $('#startTime').val(startTime.split(' ')[1]);
                                $('#dtSODate').val(date);
                                $('#txtBookedHoursSpent').val(templateObject.timeFormat(clockList[clockList.length - 1].hours));
                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                $('#updateID').val(clockList[clockList.length - 1].id);
                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                                $('#startTime').prop('disabled', true);
                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                    $('#endTime').val(endTime.split(' ')[1]);
                                    $('#endTime').prop('disabled', true);
                                    $('#btnClockOn').prop('disabled', true);
                                    $('#btnHoldOne').prop('disabled', true);
                                    $('#btnClockOff').prop('disabled', true);
                                }
                            }
                        } else {
                            let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                            let endTime = clockList[clockList.length - 1].timelog.fields.EndDatetime.split(' ')[1] || '';
                            let date = clockList[clockList.length - 1].timesheetdate;
                            if (startTime != "") {
                                $('#startTime').val(startTime);
                                $('#dtSODate').val(date);
                                $('#txtBookedHoursSpent').val(templateObject.timeFormat(clockList[clockList.length - 1].hours));
                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                $('#updateID').val(clockList[clockList.length - 1].id);
                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                                $('#startTime').prop('disabled', true);
                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                    $('#endTime').val(endTime);
                                    $('#endTime').prop('disabled', true);
                                    $('#btnClockOn').prop('disabled', true);
                                    $('#btnHoldOne').prop('disabled', true);
                                    $('#btnClockOff').prop('disabled', true);
                                }
                            }
                        }

                    }
                    $('#settingsModal').modal('show');

                }
                $('.fullScreenSpin').css('display', 'none');
            }
        })

    }

    templateObject.getAllTimeSheetDataClock();

    templateObject.getEmployees = function () {
        contactService.getAllEmployeesData().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            $('.fullScreenSpin').css('display', 'none');
            for (let i = 0; i < data.temployee.length; i++) {
                var dataList = {
                    id: data.temployee[i].Id || '',
                    employeeno: data.temployee[i].EmployeeNo || '',
                    employeename: data.temployee[i].EmployeeName || '',
                    firstname: data.temployee[i].FirstName || '',
                    lastname: data.temployee[i].LastName || '',
                    phone: data.temployee[i].Phone || '',
                    mobile: data.temployee[i].Mobile || '',
                    email: data.temployee[i].Email || '',
                    address: data.temployee[i].Street || '',
                    country: data.temployee[i].Country || '',
                    department: data.temployee[i].DefaultClassName || '',
                    custFld1: data.temployee[i].CustFld1 || '',
                    custFld2: data.temployee[i].CustFld2 || '',
                    custFld3: data.temployee[i].CustFld3 || '',
                    custFld4: data.temployee[i].CustFld4 || ''
                };

                if (data.temployee[i].EmployeeName.replace(/\s/g, '') != '') {
                    employeeList.push(dataList);
                }
                //}
            }

            templateObject.employeerecords.set(employeeList);

        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    }

    templateObject.getEmployees();
    templateObject.getJobs = function () {
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
            $('.fullScreenSpin').css('display', 'none');
        });
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

                    templateObject.productsdatatablerecords.set(productList);

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
                templateObject.productsdatatablerecords.set(productList);

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
                templateObject.productsdatatablerecords.set(productList);

            });
        });

    }

    setTimeout(function () {
        templateObject.getAllProductData();
    }, 500);

    $(document).ready(function () {
        //$('#tblTimeSheet tbody').on('click', 'tr td:not(:first-child)', function (event) {
        $('#tblTimeSheet tbody').on('click', 'tr .colName, tr .colDate, tr .colJob, tr .colProduct, tr .colRegHours, tr .colNotes, tr .colStatus', function () {
            event.preventDefault();
            var curretDate = moment().format('DD/MM/YYYY');
            setTimeout(function () {
                $("#dtSODate").val(curretDate);
            }, 100);
            let productCheck = templateObject.productsdatatablerecords.get();
            productCheck = productCheck.filter(pdctList => {
                return pdctList.productname == $(event.target).closest("tr").find('.colProduct').text();
            });
            if (productCheck.length > 0) {
                $('#product-listone').val($(event.target).closest("tr").find('.colProduct').text());
            } else {
                $('#product-listone').prepend('<option>' + $(event.target).closest("tr").find('.colProduct').text() + '</option>');
            }
            $('#txtBookedHoursSpent').val("")
            $('#txtBookedHoursSpent1').val("");
            $('#employee_name').val($(event.target).closest("tr").find('.colName').text());
            $('#sltJobOne').val($(event.target).closest("tr").find('.colJob').text());
            $('#product-listone').val($(event.target).closest("tr").find('.colProduct').text());
            $('#txtNotesOne').val($(event.target).closest("tr").find('.colNotes').text());
            $('#updateID').val($(event.target).closest("tr").find('.colID').text());
            $('#timesheetID').text($(event.target).closest("tr").find('.colID').text());
            $('#txtBookedHoursSpent').val($(event.target).closest("tr").find('.colRegHoursOne').val())
            $('#txtBookedHoursSpent1').val($(event.target).closest("tr").find('.colRegHours ').text());
            $('#endTime').val(""); ;
            $('#startTime').prop('disabled', false);
            $('#endTime').prop('disabled', false);
            $('#btnClockOn').prop('disabled', false);
            $('#btnHoldOne').prop('disabled', false);
            $('#btnClockOff').prop('disabled', false);
            $('.processTimesheet').prop('disabled', false);
            $('#startTime').val("");
            $('#dtSODate').val("");
            $('#txtNotesOne').val("");
            $('#hourly_rate').val("");
            let clockList = templateObject.timesheetrecords.get();
            clockList = clockList.filter(clkList => {
                return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
            });
            if (clockList.length > 0) {
                if (clockList[clockList.length - 1].isPaused == "paused") {
                    $('.btnHoldOne').prop('disabled', true);
                } else {
                    $('.btnHoldOne').prop('disabled', false);
                }

                if (clockList[clockList.length - 1].isPaused == "paused") {
                    $(".paused").show();
                    $("#btnHoldOne").prop("disabled", true);
                    $("#btnHoldOne").addClass("mt-32");
                } else {
                    $(".paused").hide();
                    $("#btnHoldOne").prop("disabled", false);
                    $("#btnHoldOne").removeClass("mt-32");
                }

                if (clockList[clockList.length - 1].status == "Processed") {
                    $('.processTimesheet').prop('disabled', true);
                }

                if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                    let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime.split(' ')[1] || '';
                    let endTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime.split(' ')[1] || '';
                    let date = clockList[clockList.length - 1].timesheetdate;
                    if (startTime != "") {
                        $('#startTime').val(startTime);
                        $('#dtSODate').val(date);
                        $('#updateID').val(clockList[clockList.length - 1].id);
                        $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                        $('#sltJobOne').val(clockList[clockList.length - 1].job);
                        $('#product-listone').val(clockList[clockList.length - 1].product);
                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                        $('#startTime').prop('disabled', true);
                        if (clockList[clockList.length - 1].isPaused == "completed") {
                            $('#endTime').val(endTime);
                            $('#endTime').prop('disabled', true);
                            $('#btnClockOn').prop('disabled', true);
                            $('#btnHoldOne').prop('disabled', true);
                            $('#btnClockOff').prop('disabled', true);
                        }
                    }

                } else {
                    let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1] || '';
                    let endTime = clockList[clockList.length - 1].timelog.fields.EndDatetime.split(' ')[1] || '';
                    let date = clockList[clockList.length - 1].timesheetdate;
                    $('#startTime').val(startTime);
                    $('#dtSODate').val(date);
                    $('#updateID').val(clockList[clockList.length - 1].id);
                    $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                    $('#sltJobOne').val(clockList[clockList.length - 1].job);
                    $('#product-listone').val(clockList[clockList.length - 1].product);
                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                    $('#startTime').prop('disabled', true);
                    if (clockList[clockList.length - 1].isPaused == "completed") {
                        $('#endTime').val(startTime);
                        $('#endTime').prop('disabled', true);
                        $('#btnClockOn').prop('disabled', true);
                        $('#btnHoldOne').prop('disabled', true);
                        $('#btnClockOff').prop('disabled', true);
                    }
                }
            } else {
                $(".paused").hide();
                $("#btnHoldOne").prop("disabled", false);
            }
            $('#settingsModal').modal('show');
        });

        var table = $('#example').DataTable({
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            drawCallback: function (settings) {
                var api = this.api();
                // Initialize custom control
                initDataTableCtrl(api.table().container());
            },
            responsive: {
                details: {
                    renderer: function (api, rowIdx, columns) {
                        var $row_details = $.fn.DataTable.Responsive.defaults.details.renderer(api, rowIdx, columns);

                        // Initialize custom control
                        initDataTableCtrl($row_details);

                        return $row_details;
                    }
                }
            },
            columnDefs: [{
                    targets: [1, 2, 3, 4, 5],
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            var api = new $.fn.dataTable.Api(meta.settings);

                            var $el = $('input, select, textarea', api.cell({
                                        row: meta.row,
                                        column: meta.col
                                    }).node());

                            var $html = $(data).wrap('<div/>').parent();

                            if ($el.prop('tagName') === 'INPUT') {
                                $('input', $html).attr('value', $el.val());
                                if ($el.prop('checked')) {
                                    $('input', $html).attr('checked', 'checked');
                                }
                            } else if ($el.prop('tagName') === 'TEXTAREA') {
                                $('textarea', $html).html($el.val());

                            } else if ($el.prop('tagName') === 'SELECT') {
                                $('option:selected', $html).removeAttr('selected');
                                $('option', $html).filter(function () {
                                    return ($(this).attr('value') === $el.val());
                                }).attr('selected', 'selected');
                            }

                            data = $html.html();
                        }

                        return data;
                    }
                }
            ]
        });

        // Update original input/select on change in child row
        $('#example tbody').on('keyup change', '.child input, .child select, .child textarea', function (e) {
            var $el = $(this);
            var rowIdx = $el.closest('ul').data('dtr-index');
            var colIdx = $el.closest('li').data('dtr-index');
            var cell = table.cell({
                row: rowIdx,
                column: colIdx
            }).node();

            // NOTE: trigger('change') is needed to make custom controls (such as Select2)
            // aware of the value change
            $('input, select, textarea', cell).val($el.val()).trigger('change');

            if ($el.is(':checked')) {
                $('input', cell).prop('checked', true);
            }
        });
    });

      $("#scanBarcode").click(function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        } else {
            Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'danger', 'fixed-top', 'fa-frown-o');
        }
    });

    //
    // Initializes jQuery Raty control
    //
    function initDataTableCtrl(container) {
        $('select', container).select2();
    }
});

Template.timesheet.events({
    'click .isPaused': function (event) {
        const templateObject = Template.instance();
        let timesheetID = $("#updateID").val() || '';

        let clockList = templateObject.timesheetrecords.get();
        clockList = clockList.filter(clkList => {
            return clkList.id == timesheetID;
        });
        if (clockList.length > 0) {
            let checkPause = clockList[0].isPaused;
            if ($('#btnHoldOne').prop('disabled') && checkPause == "paused") {
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

            } else if ($('#btnHoldOne').prop('disabled') && checkPause == "completed") {
                swal({
                    title: 'New Timesheet',
                    text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        $('#btnClockOn').prop('disabled', false);
                        $('#startTime').prop('disabled', false);
                        $('#endTime').prop('disabled', false);
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
                        $('#txtBookedHoursSpent').val("");
                        $('#txtBookedHoursSpent1').val("");
                        $('#updateID').val("");
                        $('#startTime').val("");
                        $('#endTime').val("");
                        $("#btnClockOn").trigger("click");
                    }

                });

            }
        }

    },

    'change #startTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        date1 = templateObject.dateFormat(date1);
        var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
        } else {}
    },
    'change #endTime': function () {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        date1 = templateObject.dateFormat(date1);
        var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
        } else {}
    },

    'click .clockOff': function (event) {
        const templateObject = Template.instance();
        let timesheetID = $("#updateID").val() || '';

        let clockList = templateObject.timesheetrecords.get();
        clockList = clockList.filter(clkList => {
            return clkList.id == timesheetID;
        });
        if (clockList.length > 0) {
            let checkPause = clockList[0].isPaused;
            if ($('#btnHoldOne').prop('disabled') && checkPause == "completed") {
                swal({
                    title: 'New Timesheet',
                    text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        $('#btnClockOn').prop('disabled', false);
                        $('#startTime').prop('disabled', false);
                        $('#endTime').prop('disabled', false);
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
                        $('#txtBookedHoursSpent').val("");
                        $('#txtBookedHoursSpent1').val("");
                        $('#updateID').val("");
                        $('#startTime').val("");
                        $('#endTime').val("");
                        $("#btnClockOn").trigger("click");
                    }

                });

            }
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
                    $('#startTime').prop('disabled', false);
                    $('#endTime').prop('disabled', false);
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
                    $('#txtBookedHoursSpent').val("");
                    $('#txtBookedHoursSpent1').val("");
                    $("#btnClockOn").trigger("click");
                }

            });

        }
    },
     'click .btnDesktopSearch': function(e) {
        let barcodeData = $('#barcodeScanInput').val();
        $('.fullScreenSpin').css('display', 'inline-block');
        if (barcodeData === '') {
            swal('Please enter the barcode', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal('Functionality awaiting API', '', 'info');
        }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblTimeSheet th');
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
                    PrefName: 'tblTimeSheet'
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
        //let datatable =$('#tblTimeSheet').DataTable();
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
                    PrefName: 'tblTimeSheet'
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
                            PrefName: 'tblTimeSheet',
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
                        PrefName: 'tblTimeSheet',
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

        //Meteor._reload.reload();
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblTimeSheet').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblTimeSheet th');
        $.each(datable, function (i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click #check-all': function (event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click .chkBox': function () {
        var listData = $(this).closest('tr').attr('id');
        const templateObject = Template.instance();
        const selectedTimesheetList = [];
        const selectedTimesheetCheck = [];
        let ids = [];
        let JsonIn = {};
        let JsonIn1 = {};
        let myStringJSON = '';
        $('.chkBox:checkbox:checked').each(function () {
            var chkIdLine = $(this).closest('tr').attr('id');
            let obj = {
                AppointID: parseInt(chkIdLine)
            }

            selectedTimesheetList.push(obj);

            templateObject.selectedTimesheetID.set(chkIdLine);
            // selectedAppointmentCheck.push(JsonIn1);
            // }
        });
        templateObject.selectedTimesheet.set(selectedTimesheetList);
    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblTimeSheet th');

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
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {
        //Meteor._reload.reload();
        window.open('/timesheet', '_self');
    },
    'click #btnClockOnOff': function (event) {
        const templateObject = Template.instance();
        $("#employee_name").val(Session.get('mySessionEmployee'));
        $('#sltJobOne').val("");
        $('#product-listone').val("");
        $('#updateID').val("");
        $('#startTime').val("");
        $('#endTime').val("");
        $('#txtBookedHoursSpent').val("");
        $('#txtBookedHoursSpent1').val("");
        $('#startTime').prop('disabled', false);
        $('#endTime').prop('disabled', false);
        $('#btnClockOn').prop('disabled', false);
        $('#btnHoldOne').prop('disabled', false);
        $('#btnClockOff').prop('disabled', false);
        $('.processTimesheet').prop('disabled', false);
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
                $('.btnHoldOne').prop('disabled', true);
            } else {
                $('.btnHoldOne').prop('disabled', false);
            }

            if (clockList[clockList.length - 1].isPaused == "paused") {
                $(".paused").show();
                $("#btnHoldOne").prop("disabled", true);
                $("#btnHoldOne").addClass("mt-32");
            } else {
                $(".paused").hide();
                $("#btnHoldOne").prop("disabled", false);
                $("#btnHoldOne").removeClass("mt-32");
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
                    $('#timesheetID').text(clockList[clockList.length - 1].id);
                    $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                    $('#sltJobOne').val(clockList[clockList.length - 1].job);
                    $('#product-listone').val(clockList[clockList.length - 1].product);
                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                    $('#startTime').prop('disabled', true);
                    if (clockList[clockList.length - 1].isPaused == "completed") {
                        $('#endTime').val(endTime);
                        $('#endTime').prop('disabled', true);
                        $('#btnClockOn').prop('disabled', true);
                        $('#btnHoldOne').prop('disabled', true);
                        $('#btnClockOff').prop('disabled', true);
                    }
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
                         $('#timesheetID').text(clockList[clockList.length - 1].id);
                        $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                        $('#sltJobOne').val(clockList[clockList.length - 1].job);
                        $('#product-listone').val(clockList[clockList.length - 1].product);
                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace('$', ''));
                        $('#startTime').prop('disabled', true);
                        if (clockList[clockList.length - 1].isPaused == "completed") {
                            $('#endTime').val(endTime);
                            $('#endTime').prop('disabled', true);
                            $('#btnClockOn').prop('disabled', true);
                            $('#btnHoldOne').prop('disabled', true);
                            $('#btnClockOff').prop('disabled', true);
                        }
                    }
                }
            }
        } else {
            $(".paused").hide();
            $("#btnHoldOne").prop("disabled", false);
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
            $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
            let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
            var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
            var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
            if (endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);

            } else if (document.getElementById("endTime").value == "") {
                endTime = "";
            }
            $("#btnSaveTimeSheetOne").trigger("click");
        } else {
            $('.fullScreenSpin').css('display', 'inline-block');
            if (checkStartTime != "" && checkEndTime == "" && $('#btnHoldOne').prop('disabled') == true) {
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
                            sideBarService.getAllTimeSheetList().then(function (data) {
                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                setTimeout(function () {
                                    window.open('/timesheet', '_self');
                                }, 500);
                            })
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
            } else if (clockList.length < 1) {
                $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                $("#btnSaveTimeSheetOne").trigger("click");
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
                // $("#btnSaveTimeSheetOne").trigger("click");

            }
        }
    },
    'click #btnClockOff': function () {
        let templateObject = Template.instance();
        let clockList = templateObject.timesheetrecords.get();
        let clockListStandBy = templateObject.timesheetrecords.get();
        let index = clockList.map(function (e) {
            return e.id;
        }).indexOf(parseInt($("#updateID").val()));
        clockList = clockList.filter(clkList => {
            return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
        });
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
                title: 'End Timesheet',
                text: 'This Timesheet is Currently "On Hold", Do you want to "Clock Off"? ',
                type: 'question',
                showCancelButton: true,
                denyButtonText: 'Continue',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                    let endTime = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                    let startTime = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                    toUpdate = {
                        type: "TTimeLog",
                        fields: {
                            ID: latestTimeLogId,
                            EndDatetime: date1 + ' ' + endTime
                        }
                    }

                    let newEntry = {
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
                                clockListStandBy[index].isPaused = "";
                                templateObject.timesheetrecords.set(clockListStandBy);
                                $('.paused').hide();
                                $("#btnHoldOne").removeClass("mt-32");
                                document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                                let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                                var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
                                var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
                               if (endTime > startTime) {
                                let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                                document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
                                $("#btnSaveTimeSheetOne").trigger("click");
                                } else {
                                swal({
                                    title: 'Oooops...',
                                    text: "Start Time can't be greater than End Time",
                                    type: 'error',
                                    showCancelButton: true,
                                    confirmButtonText: 'Ok'
                                })
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

                    //$("#btnClockOn").trigger("click");
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
                    if (endTime > startTime) {
                        let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                        document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);

                        $("#btnSaveTimeSheetOne").trigger("click");
                    } else {
                    swal({
                        title: 'Oooops...',
                        text: "Start Time can't be greater than End Time",
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Ok'
                    })
                    }
                }

            });

        }
    },
    'click #btnHoldOne': function (event) {
        $('#frmOnHoldModal').modal('show');
    },
    'click .btnSaveTimeSheetForm': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let timesheetID = $('#edtTimesheetID').val();
        var employeeName = $('#sltEmployee').val();
        var jobName = $('#sltJob').val();
        // var edthourlyRate = $('.lineEditHourlyRate').val() || 0;
        var edthour = $('.lineEditHour').val() || 0;
        var techNotes = $('.lineEditTechNotes').val() || '';
        var product = $('#product-list').children("option:selected").text() || '';
        // var taxcode = $('#sltTaxCode').val();
        // var accountdesc = $('#txaAccountDescription').val();
        // var bankaccountname = $('#edtBankAccountName').val();
        // var bankbsb = $('#edtBSB').val();
        // var bankacountno = $('#edtBankAccountNo').val();
        // let isBankAccount = templateObject.isBankAccount.get();
        let data = '';
        if (timesheetID == "") {
            data = {
                type: "TTimeSheetEntry",
                fields: {
                    // "EntryDate":"2020-10-12 12:39:14",
                    TimeSheet: [{
                            type: "TTimeSheet",
                            fields: {
                                EmployeeName: employeeName || '',
                                // HourlyRate:50,
                                ServiceName: product,
                                Allowedit: true,
                                // ChargeRate: 100,
                                Hours: parseInt(edthour) || 0,
                                // OverheadRate: 90,
                                Job: jobName || '',
                                // ServiceName: "Test"|| '',
                                TimeSheetClassName: "Default" || '',
                                Notes: techNotes || ''
                                // EntryDate: accountdesc|| ''
                            }
                        }
                    ],
                    "TypeName": "Payroll",
                    "WhoEntered": Session.get('mySessionEmployee') || ""
                }
            };

            contactService.saveTimeSheet(data).then(function (data) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    setTimeout(function () {
                        window.open('/timesheet', '_self');
                    }, 500);
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

        } else {
            data = {
                type: "TTimeSheet",
                //fields:{
                // "EntryDate":"2020-10-12 12:39:14",
                // TimeSheet:[{
                // type: "TTimeSheet",
                fields: {
                    ID: timesheetID,
                    EmployeeName: employeeName || '',
                    // HourlyRate:50,
                    ServiceName: product,
                    Allowedit: true,
                    // ChargeRate: 100,
                    Hours: parseInt(edthour) || 0,
                    // OverheadRate: 90,
                    Job: jobName || '',
                    // ServiceName: "Test"|| '',
                    TimeSheetClassName: "Default" || '',
                    Notes: techNotes || ''
                    // EntryDate: accountdesc|| ''
                }
                //  }],
                // "TypeName":"Payroll",
                // "WhoEntered":Session.get('mySessionEmployee')||""
                //}
            };

            contactService.saveTimeSheetUpdate(data).then(function (data) {
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

        }

    },
    'click #btnSaveTimeSheetOne': function () {
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
        var edthour = $('#txtBookedHoursSpent').val() || '00:01';
        let hours = templateObject.timeToDecimal(edthour);
        var techNotes = $('#txtNotesOne').val() || '';
        var product = $('#product-listone').children("option:selected").text() || '';
        var jobName = $('#sltJobOne').val() || '';
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

        if (hours != 0.01) {
            edthour = hours + parseFloat($('#txtBookedHoursSpent1').val());
        }

        // if (checkStartTime == "" && endTime != "") {
        //     $('.fullScreenSpin').css('display', 'none');
        //     swal({
        //         title: 'Oooops...',
        //         text: "You can't clock off, because you haven't clocked in",
        //         type: 'warning',
        //         showCancelButton: false,
        //         confirmButtonText: 'Try Again'
        //     }).then((result) => {
        //         if (result.value) {
        //             // Meteor._reload.reload();
        //         } else if (result.dismiss === 'cancel') {}
        //     });
        //     return false;
        // }

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
                        Description: 'Timesheet Started & Completed',
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
                                Hours: hours || 0.01,
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
                sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    setTimeout(function () {
                       window.open('/timesheet', '_self');
                    }, 500);
                })
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
                    Hours: hours || 0.01,
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
                                sideBarService.getAllTimeSheetList().then(function (data) {
                                    addVS1Data('TTimeSheet', JSON.stringify(data));
                                    setTimeout(function () {
                                        window.open('/timesheet', '_self');
                                    }, 500);
                                })
                            }).catch(function (err) {})
                        }).catch(function (err) {})
                    } else if (obj.fields.Description == "Timesheet Started") {
                        contactService.saveTimeSheetLog(obj).then(function (data) {
                            sideBarService.getAllTimeSheetList().then(function (data) {
                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                setTimeout(function () {
                                    window.open('/timesheet', '_self');
                                }, 500);
                            })
                        }).catch(function (err) {})
                    }
                } else {
                    sideBarService.getAllTimeSheetList().then(function (data) {
                        addVS1Data('TTimeSheet', JSON.stringify(data));
                        setTimeout(function () {
                            window.open('/timesheet', '_self');
                        }, 500);
                    })
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
    'click #processTimesheet': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        const templateObject = Template.instance();
        let selectClient = templateObject.selectedTimesheet.get();
        let contactService = new ContactService();
        if (selectClient.length === 0) {
            swal('Please select Timesheet to Process', '', 'info');
            $('.fullScreenSpin').css('display', 'none');
        } else {
            for(let x = 0; x < selectClient.length; x++) {

                 let data = {
                type: "TTimeSheet",
                fields: {
                    ID: selectClient[x].AppointID,
                    Status: "Processed"
                }

            };
              contactService.saveClockTimeSheet(data).then(function (data) {
                if((x+1) == selectClient.length) {
                     sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    setTimeout(function () {
                       window.open('/timesheet', '_self');
                    }, 200);
                })
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
           
            $('.fullScreenSpin').css('display', 'none');
        }
    },

    'click .processTimesheet': function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            let templateObject = Template.instance();
            let checkStatus = "";
            let checkStartTime = "";
            let checkEndTime = "";
            let TimeSheetHours = 0;
            let updateID = $("#updateID").val() || "";
            let contactService = new ContactService();
             var startTime = $('#startTime').val() || '';
            var endTime = $('#endTime').val() || '';
            if (startTime == "" || endTime == "") {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: "Please enter Start and End Time to process this TimeSheet",
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
            var edthour = $('#txtBookedHoursSpent').val() || 0.01;
            let hours = templateObject.timeToDecimal(edthour);
            var techNotes = $('#txtNotesOne').val() || '';
            var product = $('#product-listone').children("option:selected").text() || '';
            var jobName = $('#sltJobOne').val() || '';
            var status = "Processed"
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
                                Description: 'Timesheet Processed',
                                EnteredBy: Session.get('mySessionEmployeeLoggedID')
                            }
                        };
                        isPaused = "completed";
                    } else if ($('#startTime').val() != "" && $('#endTime').val() != "" && checkStatus != "completed") {
                        let startTime1 = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + (startdateGet.getDate())).slice(-2) + ' ' + ("0" + startdateGet.getHours()).slice(-2) + ":" + ("0" + startdateGet.getMinutes()).slice(-2);
                        obj = {
                            type: "TTimeLog",
                            fields: {
                                TimeSheetID: updateID,
                                EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                StartDatetime: checkStartTime,
                                EndDatetime: endTime,
                                Description: 'Timesheet Processed',
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
                            Description: 'Timesheet Processed',
                            EnteredBy: Session.get('mySessionEmployeeLoggedID')
                        }
                    };
                    isPaused = "completed";
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
                            Description: 'Timesheet Processed',
                            EnteredBy: Session.get('mySessionEmployeeLoggedID')
                        }
                    };
                    isPaused = "completed";
                } else if ($('#tActualStartTime').val() != "" && $('#tActualEndTime').val() != "") {
                    obj = {
                        type: "TTimeLog",
                        fields: {
                            EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                            StartDatetime: startTime,
                            EndDatetime: endTime,
                            Description: 'Timesheet Processed',
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
                                    Hours: hours || 0.01,
                                    Status: status,
                                    // OverheadRate: 90,
                                    Job: jobName || '',
                                    // ServiceName: "Test"|| '',
                                    TimeSheetClassName: "Default" || '',
                                    Notes: techNotes || '',
                                    Status: status,
                                    InvoiceNotes: "completed"
                                    // EntryDate: accountdesc|| ''
                                }
                            }
                        ],
                        "TypeName": "Payroll",
                        "WhoEntered": Session.get('mySessionEmployee') || ""
                    }
                };
                contactService.saveTimeSheet(data).then(function (data) {
                    sideBarService.getAllTimeSheetList().then(function (data) {
                        addVS1Data('TTimeSheet', JSON.stringify(data));
                        setTimeout(function () {
                            window.open('/timesheet', '_self');
                        }, 500);
                    })
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
                        Hours: hours || 0.01,
                        Status: status,
                        // OverheadRate: 90,
                        Job: jobName || '',
                        // ServiceName: "Test"|| '',
                        TimeSheetClassName: "Default" || '',
                        Notes: techNotes || '',
                        InvoiceNotes: "completed"
                        // EntryDate: accountdesc|| ''
                    }

                };

                contactService.saveClockTimeSheet(data).then(function (data) {
                    if (Object.keys(obj).length > 0) {
                        if (obj.fields.Description == "Timesheet Processed") {
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
                                    sideBarService.getAllTimeSheetList().then(function (data) {
                                        addVS1Data('TTimeSheet', JSON.stringify(data));
                                        setTimeout(function () {
                                            window.open('/timesheet', '_self');
                                        }, 500);
                                    })
                                }).catch(function (err) {})
                            }).catch(function (err) {})
                        } else if (obj.fields.Description == "Timesheet Processed") {
                            contactService.saveTimeSheetLog(obj).then(function (data) {
                                sideBarService.getAllTimeSheetList().then(function (data) {
                                    addVS1Data('TTimeSheet', JSON.stringify(data));
                                    setTimeout(function () {
                                        window.open('/timesheet', '_self');
                                    }, 500);
                                })
                            }).catch(function (err) {})
                        }
                    } else {
                        sideBarService.getAllTimeSheetList().then(function (data) {
                            addVS1Data('TTimeSheet', JSON.stringify(data));
                            setTimeout(function () {
                                window.open('/timesheet', '_self');
                            }, 500);
                        })
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
    'change #dateTo': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        let timesheetData = templateObject.datatablerecords1.get();
        let timesheetList = [];
        //templateObject.datatablerecords.set('');
        let startDate = new Date($("#dateFrom").datepicker("getDate"));
        let endDate = new Date($("#dateTo").datepicker("getDate"));
        for (let x = 0; x < timesheetData.length; x++) {
            let date = new Date(timesheetData[x].timesheetdate1);
            if (date >= startDate && date <= endDate) {
                timesheetList.push(timesheetData[x]);
            }
        }
        templateObject.datatablerecords.set(timesheetList);
        $('.fullScreenSpin').css('display', 'none');

    },
    'change #dateFrom': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        let timesheetData = templateObject.datatablerecords1.get();
        let timesheetList = [];
        //templateObject.datatablerecords.set('');
        let startDate = new Date($("#dateFrom").datepicker("getDate"));
        let endDate = new Date($("#dateTo").datepicker("getDate"));
        for (let x = 0; x < timesheetData.length; x++) {
            let date = new Date(timesheetData[x].timesheetdate1);
            if (date >= startDate && date <= endDate) {
                timesheetList.push(timesheetData[x]);
            }
        }
        templateObject.datatablerecords.set(timesheetList);
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnAddNewAccounts': function () {

        $('#add-account-title').text('Add New Account');
        $('#edtAccountID').val('');
        $('#sltAccountType').val('');
        $('#sltAccountType').removeAttr('readonly', true);
        $('#sltAccountType').removeAttr('disabled', 'disabled');
        $('#edtAccountName').val('');
        $('#edtAccountName').attr('readonly', false);
        $('#edtAccountNo').val('');
        $('#sltTaxCode').val(loggedTaxCodePurchaseInc || '');
        $('#txaAccountDescription').val('');
        $('#edtBankAccountName').val('');
        $('#edtBSB').val('');
        $('#edtBankAccountNo').val('');
    },
    'click .printConfirm': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click #btnHoldOne': function (event) {
        $('#frmOnHoldModal').modal('show');
    },
    'click .btnTimesheetListOne': function (event) {
        $('.modal-backdrop').css('display', 'none');
        let id = $('#updateID').val();
        if (id) {
            FlowRouter.go('/timesheettimelog?id=' + id);
        } else {
            FlowRouter.go('/timesheettimelog');
        }
    },
    'click #btnHold': function (event) {
        $('#frmOnHoldModal').modal('show');
    },
    'click .btnPauseJobOne': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        templateObject = Template.instance();
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
        var startTime = ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
        var endTime = ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
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
                    sideBarService.getAllTimeSheetList().then(function (data) {
                        addVS1Data('TTimeSheet', JSON.stringify(data));
                        setTimeout(function () {
                            window.open('/timesheet', '_self');
                        }, 500);
                    })
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
    'click .btnDeleteTimeSheetOne': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let timesheetID = $('#updateID').val();
        if (timesheetID == "") {
            //window.open('/timesheet', '_self');
        } else {
            data = {
                type: "TTimeSheet",
                fields: {
                    ID: timesheetID,
                    Active: false,
                }
            };

            contactService.saveTimeSheetUpdate(data).then(function (data) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    setTimeout(function () {
                        window.open('/timesheet', '_self');
                    }, 500);
                })
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        //Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'blur .cashamount': function (event) {
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                }));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));
            //parseFloat(parseFloat($.trim($(event.target).text().substring(Currency.length).replace(",", ""))) || 0);
            $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                }) || 0);
            //$('.lineUnitPrice').text();

        }
    },
    'blur .colRate, keyup .colRate, change .colRate': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;
        let totalGrossPay = 0;
        let totalRegular = 0;
        let totalOvertime = 0;
        let totalDouble = 0;
        $(event.target).closest("tr").find("span.colRateSpan").text($(event.target).val());
        // .closest('span').find('.colRateSpan').html($(event.target).val());
        $('.colRate').each(function () {
            var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            // var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

    },
    'blur .colRegHoursOne': function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let id = $(event.target).closest("tr").attr('id');
        let edthour = $(event.target).val() || '00:00';
        let hours = templateObject.timeToDecimal(edthour);
        data = {
            type: "TTimeSheet",
            fields: {
                ID: id,
                Hours: hours || 0.01
            }

        };

        contactService.saveTimeSheetUpdate(data).then(function (data) {
            sideBarService.getAllTimeSheetList().then(function (data) {
                addVS1Data('TTimeSheet', JSON.stringify(data));
            })
        }).catch(function (err) {
        });
    },
    'blur .colRegHours, keyup .colRegHours, change .colRegHours': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseInt($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colRegHours').each(function () {
            var chkbidwithLine = Number($(this).val()) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumHour').text(totalvalue || 0);

    },
    'blur .colOvertime, keyup .colOvertime, change .colOvertime': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseInt($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colOvertime').each(function () {
            var chkbidwithLine = Number($(this).val()) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumOvertime').text(totalvalue || 0);

    },
    'blur .colDouble, keyup .colDouble, change .colDouble': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseInt($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colDouble').each(function () {
            var chkbidwithLine = Number($(this).val()) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumDouble').text(totalvalue || 0);

    },
    'blur .colAdditional, keyup .colAdditional, change .colAdditional': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colAdditional').each(function () {
            var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumAdditions').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

    },
    'blur .colPaycheckTips, keyup .colPaycheckTips, change .colPaycheckTips': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colPaycheckTips').each(function () {
            var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumPaytips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

    },
    'blur .colCashTips, keyup .colCashTips, change .colCashTips': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colCashTips').each(function () {
            var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumCashtips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

    },
    'blur .colGrossPay, keyup .colGrossPay, change .colGrossPay': function (event) {
        let templateObject = Template.instance();
        let inputUnitPrice = parseFloat($(event.target).val()) || 0;
        let utilityService = new UtilityService();
        let totalvalue = 0;

        $('.colGrossPay').each(function () {
            var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
            totalvalue = totalvalue + chkbidwithLine;
        });

        $('.tblTimeSheet tbody tr').each(function () {
            var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
            var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
            var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
            var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
            var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
            var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
            //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

            totalRegular = (rateValue * regHourValue) || 0;
            totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
            totalDouble = ((rateValue * 2) * doubleeValue) || 0;
            totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
            $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
        });
        $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

    },
    'keydown .cashamount': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {}
        else {
            event.preventDefault();
        }
    },
    // 'click .btnEditTimeSheet': function (event) {
    //     var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    //     $('#edtTimesheetID').val(targetID);
    // }
    // ,
    'click #btnNewTimeSheet': function (event) {
        $('#edtTimesheetID').val('');
        $('#add-timesheet-title').text('New Timesheet');
        $('.sltEmployee').val('');
        $('.sltJob').val('');
        $('.lineEditHourlyRate').val('');
        $('.lineEditHour').val('');
        $('.lineEditTechNotes').val('');
    }
});

Template.timesheet.helpers({
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
    edithours: () => {
        return Session.get('CloudEditTimesheetHours') || false;
    },
    employeerecords: () => {
        return Template.instance().employeerecords.get().sort(function (a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.sortdate == 'NA') {
                return 1;
            } else if (b.sortdate == 'NA') {
                return -1;
            }
            return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
        });
    },
    productsdatatablerecords: () => {
        return Template.instance().productsdatatablerecords.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    loggedInEmployee: () => {
        return Session.get('mySessionEmployee') || '';
    }

});
