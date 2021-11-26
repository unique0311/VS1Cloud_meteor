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
Template.payrollrules.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
});

Template.payrollrules.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];

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

    setTimeout(function() {
        $('#tblPayRollRulesList').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
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
                [25, -1],
                [25, "All"]
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

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });
});

Template.payrollrules.events({
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    },
    'change #ruleModifierInitial': function(event) {
        var optionSelected = $(event.target).val();

        if (optionSelected == "greaterthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "lessthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "dayoftheweek") {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "inline-flex";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").removeClass("noradiusright");

        }

        // document.getElementById("ruleConstructOne").value = "Greater Than";
        // document.getElementById("ruleModifierTime").style.display = "inline-flex";
        // document.getElementById("ruleModifierDay").style.display = "none";
    },
    'click #ruleLessThan': function() {
        document.getElementById("ruleConstructOne").value = "Less Than";
        document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
        document.getElementById("ruleModifierDay").style.display = "none";
    },
    'click #ruleSpecificDay': function() {
        document.getElementById("ruleConstructOne").value = "Specific Day";
        document.getElementById("ruleModifierTime").style.display = "none";
        document.getElementById("ruleModifierDay").style.display = "inline-flex";
    }
});

Template.payrollrules.helpers({
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
    }
});
