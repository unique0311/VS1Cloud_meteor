import 'jQuery.print/jQuery.print.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../js/sidebar-service';
// import { OrganisationService } from '../../js/organisation-service';
let sideBarService = new SideBarService();
Template.customfieldpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.custfields = new ReactiveVar([]);
   
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

        const custField = [];
        let count = 1;

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


          templateObject.getSalesCustomFieldsList= function () {
            var url = FlowRouter.current().path;
            sideBarService.getAllCustomFields().then(function (data) {
                let customData = {};
                for(let x = 0; x < data.tcustomfieldlist.length; x++) {
                    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
                        if(data.tcustomfieldlist[x].fields.ListType == "ltSales") {
                            customData = {
                                id: data.tcustomfieldlist[x].fields.ID,
                                custfieldlabel: data.tcustomfieldlist[x].fields.Description
                            }
                            custField.push(customData);
                        }
                    } 
                }

            if(custField.length < 4) {
                let remainder = 4 - custField.length;
                count = count + remainder;
                for(let r =0 ; r < remainder; r++) {
                    customData = {
                        id: "",
                        custfieldlabel: "Custom Field "+count
                    }
                    count++;
                    custField.push(customData);
                }

            }

            templateObject.custfields.set(custField);


            
            
            }).catch(function (err) {
            })
        }

        
         setTimeout(function(){
            templateObject.getSalesCustomFieldsList()
        },500);





});

Template.customfieldpop.events({
 'click .btnToggleText1': function (event) {
    const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
    // var text = document.getElementById("customFieldText1");
    // var date = document.getElementById("customFieldDate1");
    // var drop = document.getElementById("sltCustomOne1");

    // if (text.style.display === "none") {
    //     text.style.display = "block";
    //     date.style.display = "none";
    //     drop.style.display = "none";
    // }
    var url = FlowRouter.current().path;
    let custfield1 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield1 =custfieldarr[0].custfieldlabel || 'Custom Field 1';
    } else {
        custfield1 = "Custom Field 1"
    }
    $('.checkbox1div').empty();
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">'+custfield1+'</label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField1" name="edtSaleCustField1" value=""> </div>');
},
'click .btnToggleDate1': function (event) {
    const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();

    var url = FlowRouter.current().path;
    let custfield1 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield1 =custfieldarr[0].custfieldlabel || 'Custom Field 1';
    } else {
        custfield1 = "Custom Field 1"
    }
    $('.checkbox1div').empty();
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">'+custfield1+'<br></label>'+
    '<input type="text" class="form-control customField1" style=" border-color: #858796 !important; width: 86% !important; display: inline-flex;" id="edtSaleCustField1" name="edtSaleCustField1" value="">'+
    '<div class="input-group-addon" style=""><span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>'+
    '</div> </div>');

    // var text = document.getElementById("customFieldText1");
    // var date = document.getElementById("customFieldDate1");
    // var drop = document.getElementById("sltCustomOne1");
    // if (date.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "inline-flex";
    //     drop.style.display = "none";
    // }

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
     const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
    var url = FlowRouter.current().path;
    let custfield1 = "";
     if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield1 =custfieldarr[0].custfieldlabel || 'Custom Field 1';
    } else {
        custfield1 = "Custom Field 1"
    }
    $('.checkbox1div').empty();
    // var text = document.getElementById("customFieldText1");
    // var date = document.getElementById("customFieldDate1");
    // var drop = document.getElementById("sltCustomOne1");
    // if (drop.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "none";
    //     drop.style.display = "block";
    // }
    $('.checkbox1div').append('<div class="form-group"><label class="lblCustomField1">'+custfield1+'<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField1" name="edtSaleCustField1" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
        $('#edtSaleCustField1').editableSelect();
         $('#edtSaleCustField1').editableSelect()
        .on('click.editable-select', function (e, li) {
             var $earch = $(this);
            var offset = $earch.offset();
            var fieldDataName = e.target.value || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customFieldList').modal('toggle');
            } else {
                if (fieldDataName.replace(/\s/g, '') != '') {
                $('#newStatusHeader1').text('Edit Custom Field');
                    getVS1Data('TCustomFieldList').then(function (dataObject) { //edit to test indexdb
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newCustomFieldPop').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcustomfieldlist;
                            for (let i in useData) {
                                if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(useData[i].fields.ID);
                                        $('#newStatus').val(useData[i].fields.Description);
                                }
                            }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('newCustomFieldPop');
                            }, 200);
                        }
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                         sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId1').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus1').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('toggle');
                            }, 200);
                        });
                    });

            } else {
                $('#customFieldList').modal('toggle');
            }
        }
        });
    },1500);
},
'click .btnToggleText2': function (event) {
     const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
    var url = FlowRouter.current().path;
    let custfield2 = "";
     if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield2 =custfieldarr[1].custfieldlabel || 'Custom Field 2';
    } else {
        custfield2 = "Custom Field 2"
    }
    $('.checkbox2div').empty();
    // var text = document.getElementById("customFieldText2");
    // var date = document.getElementById("customFieldDate2");
    // var drop = document.getElementById("sltCustomOne2");

    // if (text.style.display === "none") {
    //     text.style.display = "block";
    //     date.style.display = "none";
    //     drop.style.display = "none";
    // }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField2">'+custfield2+'</label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField2" name="edtSaleCustField2" value=""> </div>');
},
'click .btnToggleDate2': function (event) {
      const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
     var url = FlowRouter.current().path;
    let custfield2 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield2 =custfieldarr[1].custfieldlabel || 'Custom Field 2';
    } else {
        custfield2 = "Custom Field 2"
    }
    $('.checkbox2div').empty();
    // var text = document.getElementById("customFieldText2");
    // var date = document.getElementById("customFieldDate2");
    // var drop = document.getElementById("sltCustomOne2");
    // if (date.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "inline-flex";
    //     drop.style.display = "none";
    // }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField2">'+custfield2+'<br></label>'+
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
      const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
    var url = FlowRouter.current().path;
    let custfield2 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield2 =custfieldarr[1].custfieldlabel || 'Custom Field 2';
    } else {
        custfield2 = "Custom Field 2"
    }
    $('.checkbox2div').empty();
    // var text = document.getElementById("customFieldText2");
    // var date = document.getElementById("customFieldDate2");
    // var drop = document.getElementById("sltCustomOne2");
    // if (drop.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "none";
    //     drop.style.display = "block";
    // }
    $('.checkbox2div').append('<div class="form-group"><label class="lblCustomField2">'+custfield2+'<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField2" name="edtSaleCustField2" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
       $('#edtSaleCustField2').editableSelect();
         $('#edtSaleCustField2').editableSelect()
        .on('click.editable-select', function (e, li) {
             var $earch = $(this);
            var offset = $earch.offset();
            var fieldDataName = e.target.value || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customFieldList').modal('toggle');
            } else {
                if (fieldDataName.replace(/\s/g, '') != '') {
                $('#newStatusHeader1').text('Edit Custom Field');
                    getVS1Data('TCustomFieldList').then(function (dataObject) { //edit to test indexdb
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newCustomFieldPop').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcustomfieldlist;
                            for (let i in useData) {
                                if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(useData[i].fields.ID);
                                        $('#newStatus').val(useData[i].fields.Description);
                                }
                            }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('newCustomFieldPop');
                            }, 200);
                        }
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                         sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId1').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus1').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('toggle');
                            }, 200);
                        });
                    });

            } else {
                $('#customFieldList').modal('toggle');
            }
        }
        });
    },200);
},
'click .btnToggleText3': function (event) {
    const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
    var url = FlowRouter.current().path;
    let custfield3 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield3 =custfieldarr[2].custfieldlabel || 'Custom Field 3';
    } else {
        custfield3 = "Custom Field 3"
    }
    $('.checkbox3div').empty();
    //  var text = document.getElementById("customFieldText3");
    // var date = document.getElementById("customFieldDate3");
    // var drop = document.getElementById("sltCustomOne3");

    // if (text.style.display === "none") {
    //     text.style.display = "block";
    //     date.style.display = "none";
    //     drop.style.display = "none";
    // }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField3">'+custfield3+'<br></label>'+
                '<input class="form-control form-control" type="text" id="edtSaleCustField3" name="edtSaleCustField3" value=""> </div>');
},
'click .btnToggleDate3': function (event) {
     const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
     var url = FlowRouter.current().path;
    let custfield3 = "";
    if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield3 =custfieldarr[1].custfieldlabel || 'Custom Field 1';
    } else {
        custfield3 = "Custom Field 3"
    }
    $('.checkbox3div').empty();
    // var text = document.getElementById("customFieldText3");
    // var date = document.getElementById("customFieldDate3");
    // var drop = document.getElementById("sltCustomOne3");
    // if (date.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "inline-flex";
    //     drop.style.display = "none";
    // }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField3">'+custfield3+'<br></label>'+
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
     const templateObject = Template.instance();
    let custfieldarr = templateObject.custfields.get();
      var url = FlowRouter.current().path;
    let custfield3 = "";
   if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
        custfield3 =custfieldarr[1].custfieldlabel || 'Custom Field 1';
    } else {
        custfield3 = "Custom Field 3"
    }
    $('.checkbox3div').empty();
    // var text = document.getElementById("customFieldText3");
    // var date = document.getElementById("customFieldDate3");
    // var drop = document.getElementById("sltCustomOne3");
    // if (drop.style.display === "none") {
    //     text.style.display = "none";
    //     date.style.display = "none";
    //     drop.style.display = "block";
    // }
    $('.checkbox3div').append('<div class="form-group"><label class="lblCustomField3">'+custfield3+'<br></label>'+
    ' <select type="search" class="form-control pointer customField1" id="edtSaleCustField3" name="edtSaleCustField3" style="background-color:rgb(255, 255, 255); border-color: #858796;border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>');
    setTimeout( function(){
        $('#edtSaleCustField2').editableSelect();
         $('#edtSaleCustField2').editableSelect()
        .on('click.editable-select', function (e, li) {
             var $earch = $(this);
            var offset = $earch.offset();
            var fieldDataName = e.target.value || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customFieldList').modal('toggle');
            } else {
                if (fieldDataName.replace(/\s/g, '') != '') {
                $('#newStatusHeader1').text('Edit Custom Field');
                    getVS1Data('TCustomFieldList').then(function (dataObject) { //edit to test indexdb
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newCustomFieldPop').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcustomfieldlist;
                            for (let i in useData) {
                                if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId').val(useData[i].fields.ID);
                                        $('#newStatus').val(useData[i].fields.Description);
                                }
                            }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('newCustomFieldPop');
                            }, 200);
                        }
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                         sideBarService.getAllCustomFields().then(function(data) {
                                for (let i in data.tcustomfieldlist) {
                                    if (data.tcustomfieldlist[i].fields.Description === fieldDataName) {
                                        $('#statusId1').val(data.tcustomfieldlist[i].fields.ID);
                                        $('#newStatus1').val(data.tcustomfieldlist[i].fields.Description);
                                        
                                    }
                                }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCustomFieldPop').modal('toggle');
                            }, 200);
                        });
                    });

            } else {
                $('#customFieldList').modal('toggle');
            }
        }
        });
    },200);
},
// 'click .btnSaveCustomField': function() {
//      let organisationService = new OrganisationService();
//       let fieldID = $('#statusId1').val() || '';
//       let termsName = $('#newStatus1').val();
//       let listType = "";

//        if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
//          listType = "ltSales";
//        }


//        if (fieldID == "") {
//            // taxRateService.checkTermByName(termsName).then(function(data) {
//                 objDetails = {
//                     type: "TCustomFieldList",
//                     fields: {
//                         Description: termsName,
//                         listType: listType
//                     }
//                 };

//                 organisationService.saveCustomField(objDetails).then(function(objDetails) {
//                     // sideBarService.getTermsVS1().then(function(dataReload) {
//                         $('#newStatus1').val(termsName);
//                         // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
//                             $('#newCustomFieldPop').modal('toggle');
//                             $('.fullScreenSpin').css('display', 'none');
//                         // }).catch(function(err) {
//                         //     $('#newTermsModal').modal('toggle');
//                         //     $('.fullScreenSpin').css('display', 'none');
//                         // });
//                     // }).catch(function(err) {
//                     //     $('#newTermsModal').modal('toggle');
//                     //     $('.fullScreenSpin').css('display', 'none');
//                     // });
//                 }).catch(function(err) {
//                     swal({
//                         title: 'Oooops...',
//                         text: err,
//                         type: 'error',
//                         showCancelButton: false,
//                         confirmButtonText: 'Try Again'
//                     }).then((result) => {
//                         if (result.value) {
//                             $('#newTermsModal').modal('toggle');
//                             $('.fullScreenSpin').css('display', 'none');
//                         } else if (result.dismiss === 'cancel') {

//                         }
//                     });
//                     $('.fullScreenSpin').css('display', 'none');
//                 });

//         } else {
//             objDetails = {
//                     type: "TCustomFieldList",
//                     fields: {
//                         ID: fieldID,
//                         Description: termsName,
//                         listType: listType
//                     }
//                 };

//                 organisationService.saveCustomField(objDetails).then(function(objDetails) {
//                     // sideBarService.getTermsVS1().then(function(dataReload) {
//                         $('#newStatus1').val(termsName);
//                         // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
//                             $('#newCustomFieldPop').modal('toggle');
//                             $('.fullScreenSpin').css('display', 'none');
//                         // }).catch(function(err) {
//                         //     $('#newTermsModal').modal('toggle');
//                         //     $('.fullScreenSpin').css('display', 'none');
//                         // });
//                     // }).catch(function(err) {
//                     //     $('#newTermsModal').modal('toggle');
//                     //     $('.fullScreenSpin').css('display', 'none');
//                     // });
//                 }).catch(function(err) {
//                     swal({
//                         title: 'Oooops...',
//                         text: err,
//                         type: 'error',
//                         showCancelButton: false,
//                         confirmButtonText: 'Try Again'
//                     }).then((result) => {
//                         if (result.value) {
//                             $('#newTermsModal').modal('toggle');
//                             $('.fullScreenSpin').css('display', 'none');
//                         } else if (result.dismiss === 'cancel') {

//                         }
//                     });
//                     $('.fullScreenSpin').css('display', 'none');
//                 });
//         }
// },
'click .btnSaveSettings': function (event) {
        var url = FlowRouter.current().path;
        // let custfield1 = $('.customField1').val() || 'Custom Field 1';
        // let custfield2 = $('.customField2').val() || 'Custom Field 2';
        // let custfield3 = $('.customField3').val() || 'Custom Field 3';
        // if(url.includes('/invoicecard')) {
        //     localStorage.setItem('custfield1invoice',custfield1);
        //     localStorage.setItem('custfield2invoice',custfield2);
        //     localStorage.setItem('custfield3invoice',custfield3);

        //     $('.lblCustomField1').text(localStorage.getItem('custfield1invoice'));
        //     $('.lblCustomField2').text(localStorage.getItem('custfield2invoice'));
        //     $('.lblCustomField3').text(localStorage.getItem('custfield3invoice'));
        //     $('#myModal4').modal('toggle');

        // } else if(url.includes('/salesordercard')) {
        //     localStorage.setItem('custfield1salesorder',custfield1);
        //     localStorage.setItem('custfield2salesorder',custfield2);
        //     localStorage.setItem('custfield3salesorder',custfield3);

        //     $('.lblCustomField1').text(localStorage.getItem('custfield1salesorder'));
        //     $('.lblCustomField2').text(localStorage.getItem('custfield2salesorder'));
        //     $('.lblCustomField3').text(localStorage.getItem('custfield3salesorder'));
        //     $('#myModal4').modal('toggle');

        // } else if(url.includes('/quotecard')) {
        //     localStorage.setItem('custfield1quote',custfield1);
        //     localStorage.setItem('custfield2quote',custfield2);
        //     localStorage.setItem('custfield3quote',custfield3);

        //     $('.lblCustomField1').text(localStorage.getItem('custfield1quote'));
        //     $('.lblCustomField2').text(localStorage.getItem('custfield2quote'));
        //     $('.lblCustomField3').text(localStorage.getItem('custfield3quote'));
        //     $('#myModal4').modal('toggle');
        // } else if(url.includes('/refundcard')) {
        //     localStorage.setItem('custfield1refund',custfield1);
        //     localStorage.setItem('custfield2refund',custfield2);
        //     localStorage.setItem('custfield3refund',custfield3);

        //     $('.lblCustomField1').text(localStorage.getItem('custfield1refund'));
        //     $('.lblCustomField2').text(localStorage.getItem('custfield2refund'));
        //     $('.lblCustomField3').text(localStorage.getItem('custfield3refund'));
        //     $('#myModal4').modal('toggle');
        // }
        $('#myModal4').modal('toggle');
    }
})

Template.customfieldpop.helpers({
        custfield1: () => {
            let url = FlowRouter.current().path;
            if(url.includes('/salesordercard')) {
                return localStorage.getItem('custfield1salesorder') || "Custom Field 1";
            } else if(url.includes('/invoicecard')) {
                return localStorage.getItem('custfield1invoice') || "Custom Field 1";
            } else if(url.includes('/quotecard')) {
                return localStorage.getItem('custfield1quote') || "Custom Field 1";
            }  else if(url.includes('/refundcard')) {
                return localStorage.getItem('custfield1refund') || "Custom Field 1";
            }
        },
        custfield2: () => {
            let url = FlowRouter.current().path;
            if(url.includes('/salesordercard')) {
                return localStorage.getItem('custfield2salesorder') || "Custom Field 2";
            } else if(url.includes('/invoicecard')) {
                return localStorage.getItem('custfield2invoice') || "Custom Field 2";
            } else if(url.includes('/quotecard')) {
                return localStorage.getItem('custfield2quote') || "Custom Field 2";
            } else if(url.includes('/refundcard')) {
                return localStorage.getItem('custfield2refund') || "Custom Field 2";
            }
        },
        custfield3: () => {
            let url = FlowRouter.current().path;
            if(url.includes('/salesordercard')) {
                return localStorage.getItem('custfield3salesorder') || "Custom Field 3";
            } else if(url.includes('/invoicecard')) {
                return localStorage.getItem('custfield3invoice') || "Custom Field 3";
            } else if(url.includes('/quotecard')) {
                return localStorage.getItem('custfield3quote') || "Custom Field 3";
            } else if(url.includes('/refundcard')) {
                return localStorage.getItem('custfield3refund') || "Custom Field 3";
            }
        },
        custfields: () => {
            return Template.instance().custfields.get();
        },
   
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
