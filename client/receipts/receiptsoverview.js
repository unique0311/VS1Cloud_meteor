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
            "fnDrawCallback": function(oSettings) {
                let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                if (checkurlIgnoreDate == 'true') {

                } else {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblcustomerAwaitingPayment_ellipsis').addClass('disabled');

                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                            $('.paginate_button.page-item.previous').addClass('disabled');
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                    } else {}
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }
                    $('.paginate_button.next:not(.disabled)', this.api().table().container())
                        .on('click', function() {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            let dataLenght = oSettings._iDisplayLength;

                            var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                            var dateTo = new Date($("#dateTo").datepicker("getDate"));

                            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

                            sideBarService.getAllAwaitingCustomerPayment(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                getVS1Data('TAwaitingCustomerPayment').then(function(dataObjectold) {
                                    if (dataObjectold.length == 0) {} else {
                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tbillreport), dataOld.tbillreport);
                                        let objCombineData = {
                                            Params: dataObjectnew.Params,
                                            tsaleslist: thirdaryData
                                        }

                                        addVS1Data('TAwaitingCustomerPayment', JSON.stringify(objCombineData)).then(function(datareturn) {
                                            templateObject.resetData(objCombineData);
                                            $('.fullScreenSpin').css('display', 'none');
                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    }
                                }).catch(function(err) {});

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });

                        });
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
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
