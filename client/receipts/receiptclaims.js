import {
    PaymentsService
} from '../payments/payments-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    EmployeeProfileService
} from "../js/profile-service";
import {
    AccountService
} from "../accounts/account-service";
import {
    UtilityService
} from "../utility-service";
import {
    SideBarService
} from '../js/sidebar-service';
import {
    OCRService
} from '../js/ocr-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new AccountService();
let ocrService = new OCRService();
Template.receiptsoverview.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.suppliers = new ReactiveVar([]);
    templateObject.chartAccounts = new ReactiveVar([]);
    templateObject.expenseClaimList = new ReactiveVar([]);
    templateObject.editExpenseClaim = new ReactiveVar();
});

Template.receiptsoverview.onRendered(function () {
    let templateObject = Template.instance();
    $("#date-input,#dateTo,#dateFrom,#dtReceiptDate,#dtExpenseDate,#dtTimeDate").datepicker({
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

    setTimeout(function () {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblSplitExpense').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": 3
            }, {
                type: 'date',
                targets: 0
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterSplit'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Awaiting Customer Payments List - " + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    format: {
                        body: function (data, row, column) {
                            if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                            }

                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                        }
                    }
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "Awaiting Customer Payments List - " + moment().format(),
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsLeft: 0
            },
            pageLength: initialReportDatatableLoad,
            "bLengthChange": false,
            info: true,
            responsive: true,
            "order": [
                [1, "desc"]
            ],
            action: function () {
                // $('#tblSplitExpense').DataTable().ajax.reload();
            },
            "fnInitComplete": function () {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshSplit' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSplitExpense_filter");
                $('.myvarFilterFormSplit').appendTo(".colDateFilterSplit");
            }
        }).on('page', function () {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        });
    }, 0);

    setTimeout(function () {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblMerge').DataTable({
            columnDefs: [{
                type: 'date',
                targets: 0
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterMerge'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Awaiting Customer Payments List - " + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    format: {
                        body: function (data, row, column) {
                            if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                            }

                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                        }
                    }
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "Awaiting Customer Payments List - " + moment().format(),
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            // colReorder: {
            //     fixedColumnsLeft: 0
            // },
            pageLength: initialReportDatatableLoad,
            "bLengthChange": false,
            info: true,
            responsive: true,
            "order": [
                [1, "desc"]
            ],
            action: function () {
                $('#tblMerge').DataTable().ajax.reload();
            },
            "fnInitComplete": function () {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshMerge' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus'></i></button>").insertAfter("#tblMerge_filter");
                $('.myvarFilterFormMerge').appendTo(".colDateFilterMerge");
            }
        }).on('page', function () {
            setTimeout(function () {
                MakeNegative();
            }, 100);
            // let draftRecord = templateObject.datatablerecords.get();
            // templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        });
    }, 0);


    $('.imageParent')
        // tile mouse actions
        .on('mouseover', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(' + $(this).attr('data-scale') + ')'
            });
        })
        .on('mouseout', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(1)'
            });
        })
        .on('mousemove', function (e) {
            $(this).children('.receiptPhoto').css({
                'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
            });
        })
        // tiles set up
        .each(function () {
            $(this)
                // add a photo container
                .append('<div class="receiptPhoto"></div>')
                // set up a background image for each tile based on data-image attribute
                .children('.receiptPhoto').css({
                    'background-image': 'url(' + $(this).attr('data-image') + ')'
                });
        })

    templateObject.getEmployees = function () {
        getVS1Data('TEmployee').then(function (dataObject) {

            if (dataObject.length == 0) {
                sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TEmployee', JSON.stringify(data));
                    let lineItems = [];
                    for (let i = 0; i < data.temployee.length; i++) {
                        let lineItem = {
                            id: data.temployee[i].fields.ID || '',
                            employeeno: data.temployee[i].fields.EmployeeNo || '',
                            employeename: data.temployee[i].fields.EmployeeName || '',
                        };
                        lineItems.push(lineItem);
                    }

                    templateObject.employees.set(lineItems);
                }).catch(function (err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;

                let lineItems = [];
                for (let i = 0; i < useData.length; i++) {
                    let lineItem = {
                        id: useData[i].fields.ID || '',
                        employeeno: useData[i].fields.EmployeeNo || '',
                        employeename: useData[i].fields.EmployeeName || '',
                    };
                    lineItems.push(lineItem);
                }
                templateObject.employees.set(lineItems);
            }
        }).catch(function (err) {
            sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TEmployee', JSON.stringify(data));
                let lineItems = [];
                for (let i = 0; i < data.temployee.length; i++) {
                    let lineItem = {
                        id: data.temployee[i].fields.ID || '',
                        employeeno: data.temployee[i].fields.EmployeeNo || '',
                        employeename: data.temployee[i].fields.EmployeeName || '',
                    };
                    lineItems.push(lineItem);
                }
                templateObject.employees.set(lineItems);
            }).catch(function (err) {

            });
        });
    }

    templateObject.getEmployees();

    templateObject.getSuppliers = function () {
        accountService.getSupplierVS1().then(function (data) {
            let lineItems = [];
            for (let i in data.tsuppliervs1) {
                let lineItem = {
                    supplierid: data.tsuppliervs1[i].Id || ' ',
                    suppliername: data.tsuppliervs1[i].ClientName || ' ',
                };
                lineItems.push(lineItem);
            }
            templateObject.suppliers.set(lineItems);
        }).catch(function (err) {

        });
    }

    templateObject.getSuppliers();

    templateObject.getChartAccounts = function () {
        accountService.getAccountListVS1().then(function (data) {
            let lineItems = [];
            for (let i = 0; i < data.taccountvs1.length; i++) {
                let lineItem = {
                    accountId: data.taccountvs1[i].Id || ' ',
                    accountname: data.taccountvs1[i].AccountName || ' '
                };

                lineItems.push(lineItem);
            }
            templateObject.chartAccounts.set(lineItems);
        });
    }

    templateObject.getChartAccounts();

    templateObject.getExpenseClaims = function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        accountService.getExpenseClaim().then(function (data) {
            let lineItems = [];
            data.texpenseclaim.forEach(expense => {

                if(Object.prototype.toString.call(expense.fields.Lines) === "[object Array]"){
                    expense.fields.Lines.forEach(claim => {
                        let lineItem = claim.fields;
                        lineItem.DateTime = claim.fields.DateTime != '' ? moment(claim.fields.DateTime).format("DD/MM/YYYY") : '';
                        lineItems.push(lineItem);
                    })
                }else if(Object.prototype.toString.call(expense.fields.Lines) === "[object Object]"){    
                    let lineItem = expense.fields.Lines.fields;
                    lineItem.DateTime = lineItem.DateTime != '' ? moment(lineItem.DateTime).format("DD/MM/YYYY") : '';
                    lineItems.push(lineItem);
                }
            });

            templateObject.expenseClaimList.set(lineItems);

            setTimeout(function () {
                //$.fn.dataTable.moment('DD/MM/YY');
                $('#tblReceiptList').DataTable({
                    columnDefs: [{
                        "orderable": false,
                        "targets": 0
                    }, {
                        type: 'date',
                        targets: 1
                    }],
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-12 col-md-6 colDateFilter p-0'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [{
                        extend: 'excelHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Awaiting Customer Payments List - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible:not(.chkBox)',
                            format: {
                                body: function (data, row, column) {
                                    if (data.includes("</span>")) {
                                        var res = data.split("</span>");
                                        data = res[1];
                                    }
        
                                    return column === 1 ? data.replace(/<.*?>/ig, "") : data;
        
                                }
                            }
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Supplier Payment',
                        filename: "Awaiting Customer Payments List - " + moment().format(),
                        exportOptions: {
                            columns: ':visible:not(.chkBox)',
                            stripHtml: false
                        }
                    }],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    pageLength: initialReportDatatableLoad,
                    "bLengthChange": false,
                    info: true,
                    responsive: true,
                    "order": [
                        [1, "desc"]
                    ],
                    action: function () {
                        // $('#tblReceiptList').DataTable().ajax.reload();
                    },
                    "fnInitComplete": function () {
                        $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefresh' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReceiptList_filter");
                        $('.myvarFilterForm').appendTo(".colDateFilter");
                    }
                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                });
                $('.fullScreenSpin').css('display', 'none');
            }, 0);

            // $('.dataTables_info').html('Showing 1 to '+ lineItems.length + ' of ' + lineItems.length + ' entries');
        });
    }

    templateObject.getExpenseClaims();

    templateObject.getLineAttachmentList = function(lineId) {
        accountService.getLineAttachmentList(lineId).then(function (data) {
            console.log('attachmentdata', data);
        })
    }

    templateObject.getOCRResultFromImage = function(imageData, fileName) {
        let data = {
            'file_data': imageData,
            'file_name': fileName
        }
        ocrService.POST(data).then(function(data) {
            console.log('ocrresult', data);
        }).catch(function (err) {
            console.log('ocrresult err', err);
        });
    }

    templateObject.base64data = function (file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = function () {
                resolve(fr.result);
            }
            fr.readAsDataURL(file);
        })
    };
});

Template.receiptsoverview.events({
    'click a#showManuallyCreate': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-expense-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-expense').addClass('show active');
    },
    'click a#showMultiple': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-multiple-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-multiple').addClass('show active');
    },
    'click a#showTime': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-time-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-time').addClass('show active');
    },
    'click #nav-expense .btn-upload': function (event) {
        $('#nav-expense .attachment-upload').trigger('click');
    },
    'click #nav-time .btn-upload': function (event) {
        $('#nav-time .attachment-upload').trigger('click');
    },
    'click #viewReceiptModal .btn-upload': function (event) {
        $('#viewReceiptModal .attachment-upload').trigger('click');
    },

    'change #viewReceiptModal .attachment-upload': function(event) {
        let files = $(event.target)[0].files;
        let imageFile = files[0];
        console.log('file changed', imageFile);
        let template = Template.instance();
        template.base64data(imageFile).then(imageData => {
            template.getOCRResultFromImage(imageData, imageFile.name);
        })
    },

    'click #formCheck-All': function (event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click #tblReceiptList tbody tr td:not(:first-child)': function (event) {
        let template = Template.instance();
        var selectedId = $(event.target).closest('tr').attr('id');
        let selectedClaim = template.expenseClaimList.get().filter(claim => claim.ID == selectedId)[0];
        template.editExpenseClaim.set(selectedClaim);

        template.getLineAttachmentList(selectedClaim.ID);
        console.log('employeeid', selectedClaim)
        $('#viewReceiptModal').modal('toggle');
    },
});

Template.receiptsoverview.helpers({
    employees: () => {
        return Template.instance().employees.get().sort(function (a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    suppliers: () => {
        return Template.instance().suppliers.get().sort(function (a, b) {
            if (a.suppliername == 'NA') {
                return 1;
            } else if (b.suppliername == 'NA') {
                return -1;
            }
            return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
        });
    },
    chartAccounts: () => {
        return Template.instance().chartAccounts.get().sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    expenseClaimList: () => {
        return Template.instance().expenseClaimList.get().sort(function (a, b) {
            if (a.claimDate == 'NA') {
                return 1;
            } else if (b.claimDate == 'NA') {
                return -1;
            }
            return (a.claimDate > b.claimDate) ? 1 : -1;
        });
    },
    editExpenseClaim: () => {   
        return Template.instance().editExpenseClaim.get();
    }
});
