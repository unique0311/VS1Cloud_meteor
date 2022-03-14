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
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.receiptsoverview.onCreated(function() {
    const templateObject = Template.instance();
});

Template.receiptsoverview.onRendered(function() {
    $("#date-input,#dateTo,#dateFrom,#dtReceiptDate").datepicker({
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

    setTimeout(function() {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblReceiptList').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": 0
            }, {
                type: 'date',
                targets: 1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
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
                        body: function(data, row, column) {
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
            action: function() {
                $('#tblReceiptList').DataTable().ajax.reload();
            },
            "fnInitComplete": function() {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefresh' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReceiptList_filter");
                $('.myvarFilterForm').appendTo(".colDateFilter");
            }
        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {}).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });
        $('.fullScreenSpin').css('display', 'none');
    }, 0);
    setTimeout(function() {
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
                        body: function(data, row, column) {
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
            action: function() {
                $('#tblSplitExpense').DataTable().ajax.reload();
            },
            "fnInitComplete": function() {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshSplit' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSplitExpense_filter");
                $('.myvarFilterFormSplit').appendTo(".colDateFilterSplit");
            }
        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {}).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });
        $('.fullScreenSpin').css('display', 'none');
    }, 0);

    setTimeout(function() {
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
                        body: function(data, row, column) {
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
            action: function() {
                $('#tblMerge').DataTable().ajax.reload();
            },
            "fnInitComplete": function() {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshMerge' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus'></i></button>").insertAfter("#tblMerge_filter");
                $('.myvarFilterFormMerge').appendTo(".colDateFilterMerge");
            }
        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function() {}).on('length.dt', function(e, settings, len) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });
        $('.fullScreenSpin').css('display', 'none');
    }, 0);


    $('.imageParent')
        // tile mouse actions
        .on('mouseover', function() {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(' + $(this).attr('data-scale') + ')'
            });
        })
        .on('mouseout', function() {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(1)'
            });
        })
        .on('mousemove', function(e) {
            $(this).children('.receiptPhoto').css({
                'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
            });
        })
        // tiles set up
        .each(function() {
            $(this)
                // add a photo container
                .append('<div class="receiptPhoto"></div>')
                // set up a background image for each tile based on data-image attribute
                .children('.receiptPhoto').css({
                    'background-image': 'url(' + $(this).attr('data-image') + ')'
                });
        })
});

Template.receiptsoverview.events({
    'click #receiptentry1': function() {
        $('#receiptModal').modal('toggle');
    }
});

Template.receiptsoverview.helpers({

});
