import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from './dashboard-service';
import 'gauge-chart';
Template.dashboard.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
});

Template.dashboard.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get('CloudDashboardModule');
  if (isDashboard) {
      templateObject.includeDashboard.set(true);
  }

$( document ).ready(function() {
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
    });
});

templateObject.hideChartElements = function () {
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

     var dimmedElements = document.getElementsByClassName('dimmed');
     while(dimmedElements.length > 0){
        dimmedElements[0].classList.remove('dimmed');
    }


}

templateObject.showChartElements = function () {
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

     $('#profitchat').addClass('dimmed');
     $('#profitlosschat').addClass('dimmed');
     $('#showexpenseschat').addClass('dimmed');
     $('#showsales1chat').addClass('dimmed');
     $('#showresaleschat').addClass('dimmed');
     $('#showearningschat').addClass('dimmed');


}

templateObject.checkChartToDisplay = function() {
     if(localStorage.getItem('profitchat') == "true" || localStorage.getItem('profitchat') == true || localStorage.getItem('profitchat') == null) {
      $("#profitlosshide").text("Hide");
      $("#monthlyprofitlossstatus").removeClass('hideelement');
    } else {
      $("#profitlosshide").text("Show");
      $("#monthlyprofitlossstatus").addClass('hideelement');
    }

    if(localStorage.getItem('expensechart') == "true" || localStorage.getItem('expensechart') == true || localStorage.getItem('expensechart') == null) {
       $("#expenseshide").text("Hide");
       $("#expensechart").removeClass('hideelement');
    } else {
      $("#expenseshide").text("Show");
      $("#expensechart").addClass('hideelement');
    }

    if(localStorage.getItem('profitloss') == "true" || localStorage.getItem('profitloss') == true || localStorage.getItem('profitloss') == null) {
       $("#profitloss1hide").text("Hide");
       $("#profitlossstatus").removeClass('hideelement');
    } else {
      $("#profitloss1hide").text("Show");
      $("#profitlossstatus").addClass('hideelement');
    }

     if(localStorage.getItem('quotedinvoicedchart') == "true" || localStorage.getItem('quotedinvoicedchart') == true || localStorage.getItem('quotedinvoicedchart') == null) {
       $("#hidesales1").text("Hide");
       $("#quotedinvoicedamount").removeClass('hideelement');
    } else {
      $("#hidesales1").text("Show");
      $("#quotedinvoicedamount").addClass('hideelement');
    }

     if(localStorage.getItem('resaleschat') == "true" || localStorage.getItem('resaleschat') == true || localStorage.getItem('resaleschat') == null) {
       $("#resalehide").text("Hide");
       $("#resalecomparision").removeClass('hideelement');
    } else {
      $("#resalehide").text("Show");
      $("#resalecomparision").addClass('hideelement');
    }

    if(localStorage.getItem('earningschat') == "true" || localStorage.getItem('earningschat') == true || localStorage.getItem('earningschat') == null) {
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
'click .btnBatchUpdate': function () {
  $('.fullScreenSpin').css('display','inline-block');
    batchUpdateCall();
},
'click #editcharts': function () {
     const templateObject = Template.instance();
     templateObject.showChartElements();

   $("#btnDone").addClass('showelement');
   $("#btnDone").removeClass('hideelement');
   $("#editcharts").addClass('hideelement')
   $("#editcharts").removeClass('showelement');

    $("#resalecomparision").removeClass('hideelement');
    $("#quotedinvoicedamount").removeClass('hideelement');
    $("#expensechart").removeClass('hideelement');
    $("#monthlyprofitlossstatus").removeClass('hideelement');
    $("#resalecomparision").removeClass('hideelement');
    $("#showearningchat").removeClass('hideelement');
 
     if($("#profitchat").hasClass('showchat')) {
       $("#profitlosshide").text("Show");
    } else if($("#profitchat").hasClass('hidechat')) {
       $("#profitlosshide").text("Hide");
    }
},
'click #btnDone': function() {
    const templateObject = Template.instance();
    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();
   $("#btnDone").addClass('hideelement');
   $("#btnDone").removeClass('showelement');
   $("#editcharts").addClass('showelement')
   $("#editcharts").removeClass('hideelement');
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
    $(".progressBarInner").text("Invoices "+valeur+"%");
}
});
