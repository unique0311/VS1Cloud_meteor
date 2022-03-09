import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    DashBoardService
} from './dashboard-service';
import {
    UtilityService
} from "../utility-service";
import {
    VS1ChartService
} from "../vs1charts/vs1charts-service"

import 'gauge-chart';

let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let monthlyprofitlosschart = localStorage.getItem("profitchat") || true;
let profitlosschart = localStorage.getItem("profitloss") || true;
let resalechart = localStorage.getItem("hideresalechat") || true;
let quotedinvoicedchart = localStorage.getItem("quotedinvoicedchart") || true;
let earningschart = localStorage.getItem("earningschat") || true;
let expenseschart = localStorage.getItem("expenseschart") || true;
Template.dashboard.onCreated(function() {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);


    templateObject.records = new ReactiveVar([]);
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
});

Template.dashboard.onRendered(function() {
    let templateObject = Template.instance();
    let isDashboard = Session.get('CloudDashboardModule');
    if (isDashboard) {
        templateObject.includeDashboard.set(true);
    }

    setTimeout(function() {
        $(".connectedSortable").sortable({
            connectWith: ".connectedSortable",
            placeholder: "portlet-placeholder ui-corner-all",
            stop: function(event, ui) {

            }
        });
        $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all");

        $(".portlet-toggle").on("click", function() {
            var icon = $(this);
            icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
            icon.closest(".portlet").find(".portlet-content").toggle();
        });

        $(".portlet").resizable({
            handles: 'e'
        });
    }, 200);

    templateObject.deactivateDraggable = function() {
        $('#col1,#col2').sortable({
            disabled: true,
            connectWith: '.col-area',
            placeholder: 'highlight',
            cursor: 'grabbing',
            handle: '.card'
        }).disableSelection();
    }
    templateObject.activateDraggable = function() {
        $('#col1,#col2').sortable({
            disabled: false,
            connectWith: '.col-area',
            placeholder: 'highlight',
            cursor: 'grabbing',
            handle: '.card'
        }).disableSelection();
    }

    templateObject.hideChartElements = function() {
        $("#profitlosshide").addClass('hideelement');
        $("#profitlosshide").removeClass('showelement');

        $("#profitloss1hide").addClass('hideelement');
        $("#profitloss1hide").removeClass('showelement');

        $("#expenseshide").addClass('hideelement');
        $("#expenseshide").removeClass('showelement');

        $("#hidesales1").addClass('hideelement');
        $("#hidesales1").removeClass('showelement');

        $("#resalehide").addClass('hideelement');
        $("#resalehide").removeClass('showelement');

        $("#hideearnings").addClass('hideelement');
        $("#hideearnings").removeClass('showelement');

        var dimmedElements = document.getElementsByClassName('dimmedChart');
        while (dimmedElements.length > 0) {
            dimmedElements[0].classList.remove('dimmedChart');
        }


    }

    templateObject.showChartElements = function() {
        $("#profitlosshide").removeClass('hideelement');
        $("#profitlosshide").addClass('showelement');

        $("#profitloss1hide").removeClass('hideelement');
        $("#profitloss1hide").addClass('showelement');

        $("#expenseshide").removeClass('hideelement');
        $("#expenseshide").addClass('showelement');

        $("#hidesales1").removeClass('hideelement');
        $("#hidesales1").addClass('showelement');

        $("#resalehide").removeClass('hideelement');
        $("#resalehide").addClass('showelement');

        $("#hideearnings").removeClass('hideelement');
        $("#hideearnings").addClass('showelement');

        $('.card').addClass('dimmedChart');

        $(".py-2").removeClass("dimmedChart");
        // $('#profitlosschat').addClass('dimmedChart');
        // $('#showexpenseschat').addClass('dimmedChart');
        // $('#showsales1chat').addClass('dimmedChart');
        // $('#showresaleschat').addClass('dimmedChart');
        // $('#showearningschat').addClass('dimmedChart');


    }

    templateObject.checkChartToDisplay = function() {
        if (localStorage.getItem('profitchat') == "true" || localStorage.getItem('profitchat') == true || localStorage.getItem('profitchat') == null) {
            $("#profitlosshide").text("Hide");
            $("#monthlyprofitlossstatus").removeClass('hideelement');
        } else {
            $("#profitlosshide").text("Show");
            $("#monthlyprofitlossstatus").addClass('hideelement');
        }


        if (localStorage.getItem('expenseschart') == "true" || localStorage.getItem('expensechart') == true || localStorage.getItem('expensechart') == null) {
            $("#expenseshide").text("Hide");
            $("#expensechart").removeClass('hideelement');
        } else {
            $("#expenseshide").text("Show");
            $("#expensechart").addClass('hideelement');
        }

        if (localStorage.getItem('profitloss') == "true" || localStorage.getItem('profitloss') == true || localStorage.getItem('profitloss') == null) {
            $("#profitloss1hide").text("Hide");
            $("#profitlossstatus").removeClass('hideelement');
        } else {
            $("#profitloss1hide").text("Show");
            $("#profitlossstatus").addClass('hideelement');
        }

        if (localStorage.getItem('quotedinvoicedchart') == "true" || localStorage.getItem('quotedinvoicedchart') == true || localStorage.getItem('quotedinvoicedchart') == null) {
            $("#hidesales1").text("Hide");
            $("#quotedinvoicedamount").removeClass('hideelement');
        } else {
            $("#hidesales1").text("Show");
            $("#quotedinvoicedamount").addClass('hideelement');
        }

        if (localStorage.getItem('resaleschat') == "true" || localStorage.getItem('resaleschat') == true || localStorage.getItem('resaleschat') == null) {
            $("#resalehide").text("Hide");
            $("#resalecomparision").removeClass('hideelement');
        } else {
            $("#resalehide").text("Show");
            $("#resalecomparision").addClass('hideelement');
        }

        if (localStorage.getItem('earningschat') == "true" || localStorage.getItem('earningschat') == true || localStorage.getItem('earningschat') == null) {
            $("#hideearnings").text("Hide");
            $("#showearningchat").removeClass('hideelement');
        } else {
            $("#hideearnings").text("Show");
            $("#showearningchat").addClass('hideelement');
        }
    }
});


Template.dashboard.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    loggedDb: function() {
        return Template.instance().loggedDb.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

// Listen to event to update reactive variable
Template.dashboard.events({
    'click .btnBatchUpdate': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        batchUpdateCall();
    },
    'click .editchartsbtn': function() {
        $(".btnchartdropdown").addClass('hideelement');

        setTimeout(function() {
            $(".monthlyprofilelossedit").removeClass('hideelement');
            $(".monthlyprofilelossedit").addClass('showelement');

            $(".profitlossedit").removeClass('hideelement');
            $(".profitlossedit").addClass('showelement');

            $(".resalecomparisionedit").removeClass('hideelement');
            $(".resalecomparisionedit").addClass('showelement');

            $(".quotedinvoicededit").removeClass('hideelement');
            $(".quotedinvoicededit").addClass('showelement');

            $(".monthlyearningsedit").removeClass('hideelement');
            $(".monthlyearningsedit").addClass('showelement');

            $(".expensesedit").removeClass('hideelement');
            $(".expensesedit").addClass('showelement');
        }, 200);

    },
    'click #editcharts': function() {
        const templateObject = Template.instance();
        templateObject.showChartElements();

        $("#btnDone").addClass('showelement');
        $("#btnDone").removeClass('hideelement');
        $("#btnCancel").addClass('showelement');
        $("#btnCancel").removeClass('hideelement');
        $("#editcharts").addClass('hideelement')
        $("#editcharts").removeClass('showelement');
        $(".btnchartdropdown").addClass('hideelement');
        $(".btnchartdropdown").removeClass('showelement');

        $("#resalecomparision").removeClass('hideelement');
        $("#quotedinvoicedamount").removeClass('hideelement');
        $("#expensechart").removeClass('hideelement');
        $("#monthlyprofitlossstatus").removeClass('hideelement');
        $("#resalecomparision").removeClass('hideelement');
        $("#showearningchat").removeClass('hideelement');
        templateObject.activateDraggable();

    },
    'click #btnCancel': function() {
        const templateObject = Template.instance();
        templateObject.hideChartElements();
        templateObject.checkChartToDisplay();
        $("#btnDone").addClass('hideelement');
        $("#btnDone").removeClass('showelement');
        $("#btnCancel").addClass('hideelement');
        $("#btnCancel").removeClass('showelement');
        $("#editcharts").addClass('showelement')
        $("#editcharts").removeClass('hideelement');
        $(".btnchartdropdown").removeClass('hideelement');
        $(".btnchartdropdown").addClass('showelement');

        templateObject.deactivateDraggable();
    },

    'click #btnDone': function() {
        const templateObject = Template.instance();
        templateObject.hideChartElements();
        $("#btnDone").addClass('hideelement');
        $("#btnDone").removeClass('showelement');
        $("#btnCancel").addClass('hideelement');
        $("#btnCancel").removeClass('showelement');
        $("#editcharts").addClass('showelement')
        $("#editcharts").removeClass('hideelement');
        $(".btnchartdropdown").removeClass('hideelement');
        $(".btnchartdropdown").addClass('showelement');

        //monthlyprofitloss
        if (monthlyprofitlosschart == "true" || monthlyprofitlosschart == true) {
            localStorage.setItem("profitchat", true);
            $("#profitlosshide").text("Show");
        } else {
            localStorage.setItem("profitchat", false);
            $("#profitlosshide").text("Hide");
        }

        if (profitlosschart == "true" || profitlosschart == true) {
            localStorage.setItem("profitloss", true);
            $("#profitloss1hide").text("Show");
        } else {
            localStorage.setItem("profitloss", false);
            $("#profitloss1hide").text("Hide");
        }


        if (resalechart == "true" || resalechart == true) {
            localStorage.setItem("resaleschat", true);
            $("#resalehide").text("Show");
        } else {
            $("#resalehide").text("Hide");
            localStorage.setItem("resaleschat", false);
        }

        if (quotedinvoicedchart == "true" || quotedinvoicedchart == true) {
            $("#hidesales1").text("Show");
            localStorage.setItem("quotedinvoicedchart", true);
        } else {
            $("#hidesales1").text("Hide");
            localStorage.setItem("quotedinvoicedchart", false);
        }

        if (earningschart == "true" || earningschart == true) {
            localStorage.setItem("earningschat", true);
            $("#hideearnings").text("Show");
        } else {
            $("#hideearnings").text("Hide");
            localStorage.setItem("earningschat", false);
        }

        if (expenseschart == "true" || expenseschart == true) {
            $("#expenseshide").text("Show");
            localStorage.setItem("expenseschart", true);
        } else {
            $("#expenseshide").text("Hide");
            localStorage.setItem("expenseschart", false);
        }

        templateObject.deactivateDraggable();
        templateObject.checkChartToDisplay();


    },
    'click .progressbarcheck': function() {
        var valeur = 0;
        $('.loadingbar').css('width', valeur + '%').attr('aria-valuenow', valeur);
        $('input:checked').each(function() {
            if ($(this).attr('value') > valeur) {
                valeur = $(this).attr('value');
            }
        });
        $('.loadingbar').css('width', valeur + '%').attr('aria-valuenow', valeur);
        $(".progressBarInner").text("Invoices " + valeur + "%");
    },
    'click #hideearnings': function() {
        let check = earningschart;
        if (check == "true" || check == true) {
            earningschart = false;
            $(".monthlyearningsedit").text("Show");
        } else {
            earningschart = true;
            $(".monthlyearningsedit").text("Hide");
        }
    },
    'click #expenseshide': function() {
        let check = expenseschart;
        if (check == "true" || check == true) {
            expenseschart = false;
            $(".expensesedit").text("Show");
            // localStorage.setItem("expenseschart",false);
        } else {
            $(".expensesedit").text("Hide");
            expenseschart = true;
            // localStorage.setItem("expenseschart",true);
        }
    },
    'click #profitloss1hide': function() {
        let check = profitlosschart;
        if (check == "true" || check == true) {
            profitlosschart = false;
            $(".profitlossedit").text("Show");
        } else {
            $(".profitlossedit").text("Hide");
            profitlosschart = true
        }
    },
    'click #profitlosshide': function() {
        let check = monthlyprofitlosschart;
        if (check == "true" || check == true) {
            monthlyprofitlosschart = false;
            $(".monthlyprofilelossedit").text("Show");
        } else {
            $(".monthlyprofilelossedit").text("Hide");
            monthlyprofitlosschart = true;
        }
    },

    'click #resalehide': function() {
        let check = resalechart;
        if (check == "true" || check == true) {
            resalechart = false;
            $(".resalecomparisionedit").text("Show");
        } else {
            $(".resalecomparisionedit").text("Hide");
            resalechart = true
        }
    },

    'click #hidesales1': function() {
        let check = quotedinvoicedchart;
        if (check == "true" || check == true) {
            quotedinvoicedchart = false;
            $(".quotedinvoicededit").text("Show");
        } else {
            $(".quotedinvoicededit").text("Hide");
            quotedinvoicedchart = true;
        }
    }
});
