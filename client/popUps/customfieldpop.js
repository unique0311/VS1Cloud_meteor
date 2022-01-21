import 'jQuery.print/jQuery.print.js';
import { ReactiveVar } from 'meteor/reactive-var';
Template.customfieldpop.onCreated(() => {
    const templateObject = Template.instance();
   
});

Template.customfieldpop.onRendered(() => {

    const templateObject = Template.instance();
        $("#customField2,#customdateone").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });

        $('#sltCustomOne1').editableSelect();
        $('#sltCustomOne2').editableSelect();
        $('#sltCustomOne3').editableSelect();

         $(document).ready(function () {
            $('#formCheck-customOne').click(function () {
                if ($(event.target).is(':checked')) {
                    $('.checkbox1div').css('display', 'block');

                } else {
                    $('.checkbox1div').css('display', 'none');
                }
            });

            $('#formCheck-customTwo').click(function () {
                if ($(event.target).is(':checked')) {
                    $('.checkbox2div').css('display', 'block');
                } else {
                    $('.checkbox2div').css('display', 'none');
                }
            });

            $('#formCheck-customThree').click(function () {
                if ($(event.target).is(':checked')) {
                    $('.checkbox3div').css('display', 'block');
                } else {
                    $('.checkbox3div').css('display', 'none');
                }
            });



            $('.customField1Text').blur(function () {
                var inputValue1 = $('.customField1Text').text();
                $('.lblCustomField1').text(inputValue1);
            });

            $('.customField2Text').blur(function () {
                var inputValue2 = $('.customField2Text').text();
                $('.lblCustomField2').text(inputValue2);
            });

        });


});

Template.customfieldpop.events({
 'click .btnToggleText1': function (event) {
    var text = document.getElementById("customFieldText1");
    var date = document.getElementById("customFieldDate1");
    var drop = document.getElementById("sltCustomOne1");

    if (text.style.display === "none") {
        text.style.display = "block";
        date.style.display = "none";
        drop.style.display = "none";
    }
    $('.checkbox1div').empty();
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 1</label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField1" name="edtSaleCustField1" value=""> </div>');
},
'click .btnToggleDate1': function (event) {
    $('.checkbox1div').empty();
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 1<br></label>'+
    '<input type="text" class="form-control customField1" style=" border-color: #858796 !important; width: 86% !important; display: inline-flex;" id="edtSaleCustField1" name="edtSaleCustField1" value="">'+
    '<div class="input-group-addon" style=""><span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>'+
    '</div> </div>');

    var text = document.getElementById("customFieldText1");
    var date = document.getElementById("customFieldDate1");
    var drop = document.getElementById("sltCustomOne1");
    if (date.style.display === "none") {
        text.style.display = "none";
        date.style.display = "inline-flex";
        drop.style.display = "none";
    }

    setTimeout( function(){
    $("#edtSaleCustField1").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });
},1500);
},
'click .btnToggleDrop1': function (event) {
    $('.checkbox1div').empty();
     var text = document.getElementById("customFieldText1");
    var date = document.getElementById("customFieldDate1");
    var drop = document.getElementById("sltCustomOne1");
    if (drop.style.display === "none") {
        text.style.display = "none";
        date.style.display = "none";
        drop.style.display = "block";
    }
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 1<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField1" name="edtSaleCustField1" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
        $('#edtSaleCustField1').editableSelect();
    },1500);
},
'click .btnToggleText2': function (event) {
    $('.checkbox2div').empty();
    var text = document.getElementById("customFieldText2");
    var date = document.getElementById("customFieldDate2");
    var drop = document.getElementById("sltCustomOne2");

    if (text.style.display === "none") {
        text.style.display = "block";
        date.style.display = "none";
        drop.style.display = "none";
    }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 2</label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField2" name="edtSaleCustField2" value=""> </div>');
},
'click .btnToggleDate2': function (event) {
    $('.checkbox2div').empty();
    var text = document.getElementById("customFieldText2");
    var date = document.getElementById("customFieldDate2");
    var drop = document.getElementById("sltCustomOne2");
    if (date.style.display === "none") {
        text.style.display = "none";
        date.style.display = "inline-flex";
        drop.style.display = "none";
    }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 2<br></label>'+
    '<input type="text" class="form-control customField1" style=" border-color: #858796 !important; width: 86% !important; display: inline-flex;" id="edtSaleCustField2" name="edtSaleCustField2" value="">'+
    '<div class="input-group-addon" style=""><span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>'+
    '</div> </div>');

    setTimeout( function(){
    $("#edtSaleCustField2").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });
},1500);
},
'click .btnToggleDrop2': function (event) {
    $('.checkbox2div').empty();
    var text = document.getElementById("customFieldText2");
    var date = document.getElementById("customFieldDate2");
    var drop = document.getElementById("sltCustomOne2");
    if (drop.style.display === "none") {
        text.style.display = "none";
        date.style.display = "none";
        drop.style.display = "block";
    }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 2<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField2" name="edtSaleCustField2" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
        $('#edtSaleCustField2').editableSelect();
    },200);
},
'click .btnToggleText3': function (event) {
    $('.checkbox3div').empty();
     var text = document.getElementById("customFieldText3");
    var date = document.getElementById("customFieldDate3");
    var drop = document.getElementById("sltCustomOne3");

    if (text.style.display === "none") {
        text.style.display = "block";
        date.style.display = "none";
        drop.style.display = "none";
    }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 3</label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField3" name="edtSaleCustField3" value=""> </div>');
},
'click .btnToggleDate3': function (event) {
    $('.checkbox3div').empty();
    var text = document.getElementById("customFieldText3");
    var date = document.getElementById("customFieldDate3");
    var drop = document.getElementById("sltCustomOne3");
    if (date.style.display === "none") {
        text.style.display = "none";
        date.style.display = "inline-flex";
        drop.style.display = "none";
    }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 3<br></label>'+
    '<input type="text" class="form-control customField1" style=" border-color: #858796 !important; width: 86% !important; display: inline-flex;" id="edtSaleCustField3" name="edtSaleCustField3" value="">'+
    '<div class="input-group-addon" style=""><span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>'+
    '</div> </div>');

    setTimeout( function(){
    $("#edtSaleCustField3").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });
},200);
},
'click .btnToggleDrop3': function (event) {
    $('.checkbox3div').empty();
    var text = document.getElementById("customFieldText3");
    var date = document.getElementById("customFieldDate3");
    var drop = document.getElementById("sltCustomOne3");
    if (drop.style.display === "none") {
        text.style.display = "none";
        date.style.display = "none";
        drop.style.display = "block";
    }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField1">Custom Field 3<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField3" name="edtSaleCustField3" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
        $('#edtSaleCustField3').editableSelect();
    },200);
},
// 'click .btnToggleText3': function (event) {
//     var text = document.getElementById("customFieldText3");
//     var date = document.getElementById("customFieldDate3");
//     var drop = document.getElementById("sltCustomOne3");
//     if (text.style.display === "none") {
//         text.style.display = "block";
//         date.style.display = "none";
//         drop.style.display = "none";
//     }
// },
// 'click .btnToggleDate3': function (event) {
//     var text = document.getElementById("customFieldText3");
//     var date = document.getElementById("customFieldDate3");
//     var drop = document.getElementById("sltCustomOne3");
//     if (date.style.display === "none") {
//         text.style.display = "none";
//         date.style.display = "inline-flex";
//         drop.style.display = "none";
//     }
// },
// 'click .btnToggleDrop3': function (event) {
//     var text = document.getElementById("customFieldText3");
//     var date = document.getElementById("customFieldDate3");
//     var drop = document.getElementById("sltCustomOne3");
//     if (drop.style.display === "none") {
//         text.style.display = "none";
//         date.style.display = "none";
//         drop.style.display = "block";
//     }
// },

})

Template.customfieldpop.helpers({
   
});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
    return (a.indexOf(b) >= 0);
});
