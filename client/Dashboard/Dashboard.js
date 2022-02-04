import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from './dashboard-service';
import { UtilityService } from "../utility-service";
import { VS1ChartService } from "../vs1charts/vs1charts-service"

import 'gauge-chart';
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();

Template.dashboard.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);


    templateObject.records = new ReactiveVar([]);
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
});

Template.dashboard.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get('CloudDashboardModule');
  if (isDashboard) {
      templateObject.includeDashboard.set(true);
  }



// $( document ).ready(function() {
// setTimeout(function(){
function handleDragStart (evt) {
  dragSource = this;
  evt.target.classList.add(draggingClass);
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver (evt) {
  evt.dataTransfer.dropEffect = 'move';
  evt.preventDefault();
}

function handleDragEnter (evt) {
  this.classList.add('over');
}

function handleDragLeave (evt) {
  this.classList.remove('over');
}

function handleDrop (evt) {
  evt.stopPropagation();
  
  if (dragSource !== this) {
    dragSource.innerHTML = this.innerHTML;
    this.innerHTML = evt.dataTransfer.getData('text/html');
  }
  
  evt.preventDefault();
}

function handleDragEnd (evt) {
  Array.prototype.forEach.call(columns, function (col) {
    ['over', 'dragging'].forEach(function (className) {
      col.classList.remove(className);
    });
  });
}
templateObject.deactivateDraggable = function() {

var columns = document.querySelectorAll('.card');
var draggingClass = 'dragging';
var dragSource;

Array.prototype.forEach.call(columns, function (col) {
  col.removeEventListener('dragstart', handleDragStart);
  col.removeEventListener('dragenter', handleDragEnter)
  col.removeEventListener('dragover', handleDragOver);
  col.removeEventListener('dragleave', handleDragLeave);
  col.removeEventListener('drop', handleDrop);
  col.removeEventListener('dragend', handleDragEnd);

});



}

templateObject.activateDraggable = function() {

var columns = document.querySelectorAll('.card');
var draggingClass = 'dragging';
var dragSource;

Array.prototype.forEach.call(columns, function (col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

// function handleDragStart (evt) {
//   dragSource = this;
//   evt.target.classList.add(draggingClass);
//   evt.dataTransfer.effectAllowed = 'move';
//   evt.dataTransfer.setData('text/html', this.innerHTML);
// }

// function handleDragOver (evt) {
//   evt.dataTransfer.dropEffect = 'move';
//   evt.preventDefault();
// }

// function handleDragEnter (evt) {
//   this.classList.add('over');
// }

// function handleDragLeave (evt) {
//   this.classList.remove('over');
// }

// function handleDrop (evt) {
//   evt.stopPropagation();
  
//   if (dragSource !== this) {
//     dragSource.innerHTML = this.innerHTML;
//     this.innerHTML = evt.dataTransfer.getData('text/html');
//   }
  
//   evt.preventDefault();
// }

// function handleDragEnd (evt) {
//   Array.prototype.forEach.call(columns, function (col) {
//     ['over', 'dragging'].forEach(function (className) {
//       col.classList.remove(className);
//     });
//   });
// }
}
// },1000);
// });

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
    templateObject.activateDraggable();
 
    //  if($("#profitchat").hasClass('showchat')) {
    //    $("#profitlosshide").text("Show");
    // } else if($("#profitchat").hasClass('hidechat')) {
    //    $("#profitlosshide").text("Hide");
    // }
},
'click #btnDone': function() {
    const templateObject = Template.instance();
    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();
   $("#btnDone").addClass('hideelement');
   $("#btnDone").removeClass('showelement');
   $("#editcharts").addClass('showelement')
   $("#editcharts").removeClass('hideelement');
   templateObject.deactivateDraggable();


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
