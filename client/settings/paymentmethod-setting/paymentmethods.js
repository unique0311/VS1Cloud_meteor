import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.paymentmethodSettings.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.deptrecords = new ReactiveVar();

  templateObject.includeCreditCard = new ReactiveVar();
  templateObject.includeCreditCard.set(false);
});

Template.paymentmethodSettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'paymentmethodList', function(error, result){
    if(error){

    }else{
      if(result){
        for (let i = 0; i < result.customFields.length; i++) {
          let customcolumn = result.customFields;
          let columData = customcolumn[i].label;
          let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
          let hiddenColumn = customcolumn[i].hidden;
          let columnClass = columHeaderUpdate.split('.')[1];
          let columnWidth = customcolumn[i].width;

           $("th."+columnClass+"").html(columData);
            $("th."+columnClass+"").css('width',""+columnWidth+"px");

        }
      }

    }
    });

    function MakeNegative() {
      $('td').each(function(){
        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
       });
    };

    templateObject.getTaxRates = function () {
      getVS1Data('TPaymentMethod').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getPaymentMethodVS1().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tpaymentmethodvs1.length; i++){
              // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                 var dataList = {
                   id: data.tpaymentmethodvs1[i].Id || '',
                   paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                   iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
               };

                dataTableList.push(dataList);
                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'paymentmethodList', function(error, result){
              if(error){

              }else{
                if(result){
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    let columnindex = customcolumn[i].index + 1;

                    if(hiddenColumn == true){

                      $("."+columnClass+"").addClass('hiddenColumn');
                      $("."+columnClass+"").removeClass('showColumn');
                    }else if(hiddenColumn == false){
                      $("."+columnClass+"").removeClass('hiddenColumn');
                      $("."+columnClass+"").addClass('showColumn');
                    }

                  }
                }

              }
              });


              setTimeout(function () {
                MakeNegative();
              }, 100);
            }

            $('.fullScreenSpin').css('display','none');
            setTimeout(function () {
                $('#paymentmethodList').DataTable({
                      columnDefs: [
                         { "orderable": false, "targets": -1 }
                       ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                            {
                         extend: 'csvHtml5',
                         text: '',
                         download: 'open',
                         className: "btntabletocsv hiddenColumn",
                         filename: "paymentmethodList_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Payment Method List',
                          filename: "paymentmethodList_"+ moment().format(),
                          exportOptions: {
                          columns: ':visible'
                        }
                      },
                      {
                       extend: 'excelHtml5',
                       title: '',
                       download: 'open',
                       className: "btntabletoexcel hiddenColumn",
                       filename: "paymentmethodList_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                      // ,
                      // customize: function ( win ) {
                      //   $(win.document.body).children("h1:first").remove();
                      // }

                      }],
                      // bStateSave: true,
                      // rowId: 0,
                      paging: false,
                      "scrollY": "400px",
                      "scrollCollapse": true,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "asc" ]],
                      // "aaSorting": [[1,'desc']],
                      action: function () {
                          $('#paymentmethodList').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                        setTimeout(function () {
                          MakeNegative();
                        }, 100);
                      },

                  }).on('page', function () {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
                  }).on('column-reorder', function () {

                  }).on( 'length.dt', function ( e, settings, len ) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  });
                  $('.fullScreenSpin').css('display','none');
              }, 10);


              var columns = $('#paymentmethodList th');
              let sTible = "";
              let sWidth = "";
              let sIndex = "";
              let sVisible = "";
              let columVisible = false;
              let sClass = "";
              $.each(columns, function(i,v) {
                if(v.hidden == false){
                  columVisible =  true;
                }
                if((v.className.includes("hiddenColumn"))){
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
             $('div.dataTables_filter input').addClass('form-control form-control-sm');

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tpaymentmethodvs1;
        let lineItems = [];
  let lineItemObj = {};
  for(let i=0; i<useData.length; i++){
    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
       var dataList = {
         id: useData[i].fields.ID || '',
         paymentmethodname: useData[i].fields.PaymentMethodName || '',
         iscreditcard: useData[i].fields.IsCreditCard || 'false',
     };

      dataTableList.push(dataList);
      //}
  }

  templateObject.datatablerecords.set(dataTableList);

  if(templateObject.datatablerecords.get()){

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'paymentmethodList', function(error, result){
    if(error){

    }else{
      if(result){
        for (let i = 0; i < result.customFields.length; i++) {
          let customcolumn = result.customFields;
          let columData = customcolumn[i].label;
          let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
          let hiddenColumn = customcolumn[i].hidden;
          let columnClass = columHeaderUpdate.split('.')[1];
          let columnWidth = customcolumn[i].width;
          let columnindex = customcolumn[i].index + 1;

          if(hiddenColumn == true){

            $("."+columnClass+"").addClass('hiddenColumn');
            $("."+columnClass+"").removeClass('showColumn');
          }else if(hiddenColumn == false){
            $("."+columnClass+"").removeClass('hiddenColumn');
            $("."+columnClass+"").addClass('showColumn');
          }

        }
      }

    }
    });


    setTimeout(function () {
      MakeNegative();
    }, 100);
  }

  $('.fullScreenSpin').css('display','none');
  setTimeout(function () {
      $('#paymentmethodList').DataTable({
            columnDefs: [
               { "orderable": false, "targets": -1 }
             ],
            select: true,
            destroy: true,
            colReorder: true,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
                  {
               extend: 'csvHtml5',
               text: '',
               download: 'open',
               className: "btntabletocsv hiddenColumn",
               filename: "paymentmethodList_"+ moment().format(),
               orientation:'portrait',
                exportOptions: {
                columns: ':visible'
              }
            },{
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Payment Method List',
                filename: "paymentmethodList_"+ moment().format(),
                exportOptions: {
                columns: ':visible'
              }
            },
            {
             extend: 'excelHtml5',
             title: '',
             download: 'open',
             className: "btntabletoexcel hiddenColumn",
             filename: "paymentmethodList_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }
            // ,
            // customize: function ( win ) {
            //   $(win.document.body).children("h1:first").remove();
            // }

            }],
            // bStateSave: true,
            // rowId: 0,
            paging: false,
            "scrollY": "400px",
            "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[ 0, "asc" ]],
            // "aaSorting": [[1,'desc']],
            action: function () {
                $('#paymentmethodList').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },

        }).on('page', function () {
          setTimeout(function () {
            MakeNegative();
          }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function () {

        }).on( 'length.dt', function ( e, settings, len ) {
          setTimeout(function () {
            MakeNegative();
          }, 100);
        });
        $('.fullScreenSpin').css('display','none');
    }, 10);


    var columns = $('#paymentmethodList th');
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function(i,v) {
      if(v.hidden == false){
        columVisible =  true;
      }
      if((v.className.includes("hiddenColumn"))){
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
   $('div.dataTables_filter input').addClass('form-control form-control-sm');

        }
      }).catch(function (err) {
        taxRateService.getPaymentMethodVS1().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          for(let i=0; i<data.tpaymentmethodvs1.length; i++){
            // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
               var dataList = {
                 id: data.tpaymentmethodvs1[i].Id || '',
                 paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                 iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
             };

              dataTableList.push(dataList);
              //}
          }

          templateObject.datatablerecords.set(dataTableList);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'paymentmethodList', function(error, result){
            if(error){

            }else{
              if(result){
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.split('.')[1];
                  let columnWidth = customcolumn[i].width;
                  let columnindex = customcolumn[i].index + 1;

                  if(hiddenColumn == true){

                    $("."+columnClass+"").addClass('hiddenColumn');
                    $("."+columnClass+"").removeClass('showColumn');
                  }else if(hiddenColumn == false){
                    $("."+columnClass+"").removeClass('hiddenColumn');
                    $("."+columnClass+"").addClass('showColumn');
                  }

                }
              }

            }
            });


            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          $('.fullScreenSpin').css('display','none');
          setTimeout(function () {
              $('#paymentmethodList').DataTable({
                    columnDefs: [
                       { "orderable": false, "targets": -1 }
                     ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                          {
                       extend: 'csvHtml5',
                       text: '',
                       download: 'open',
                       className: "btntabletocsv hiddenColumn",
                       filename: "paymentmethodList_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Payment Method List',
                        filename: "paymentmethodList_"+ moment().format(),
                        exportOptions: {
                        columns: ':visible'
                      }
                    },
                    {
                     extend: 'excelHtml5',
                     title: '',
                     download: 'open',
                     className: "btntabletoexcel hiddenColumn",
                     filename: "paymentmethodList_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                    // ,
                    // customize: function ( win ) {
                    //   $(win.document.body).children("h1:first").remove();
                    // }

                    }],
                    // bStateSave: true,
                    // rowId: 0,
                    paging: false,
                    "scrollY": "400px",
                    "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],
                    // "aaSorting": [[1,'desc']],
                    action: function () {
                        $('#paymentmethodList').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },

                }).on('page', function () {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                }).on('column-reorder', function () {

                }).on( 'length.dt', function ( e, settings, len ) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                });
                $('.fullScreenSpin').css('display','none');
            }, 10);


            var columns = $('#paymentmethodList th');
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function(i,v) {
              if(v.hidden == false){
                columVisible =  true;
              }
              if((v.className.includes("hiddenColumn"))){
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
           $('div.dataTables_filter input').addClass('form-control form-control-sm');

        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
      });


    }

    templateObject.getTaxRates();

    $(document).on('click', '.table-remove', function() {
    event.stopPropagation();
    event.stopPropagation();
    var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    $('#selectDeleteLineID').val(targetID);
    $('#deleteLineModal').modal('toggle');
    // if ($('.paymentmethodList tbody>tr').length > 1) {
    // // if(confirm("Are you sure you want to delete this row?")) {
    // this.click;
    // $(this).closest('tr').remove();
    // //} else { }
    // event.preventDefault();
    // return false;
    // }
});

$('#paymentmethodList tbody').on( 'click', 'tr .colName, tr .colIsCreditCard, tr .colStatus', function () {
var listData = $(this).closest('tr').attr('id');
var isCreditcard = false;
if(listData){
  $('#add-paymentmethod-title').text('Edit Payment Method');
  //$('#isformcreditcard').removeAttr('checked');
  if (listData !== '') {
    listData = Number(listData);
 //taxRateService.getOnePaymentMethod(listData).then(function (data) {

   var paymentMethodID = listData || '';
   var paymentMethodName = $(event.target).closest("tr").find(".colName").text() || '';
    // isCreditcard = $(event.target).closest("tr").find(".colName").text() || '';
   
   if($(event.target).closest("tr").find(".colIsCreditCard .chkBox").is(':checked')){
     isCreditcard = true;
   }

   $('#edtPaymentMethodID').val(paymentMethodID);
   $('#edtName').val(paymentMethodName);

   if(isCreditcard == true){
     templateObject.includeCreditCard.set(true);
     //$('#iscreditcard').prop('checked');
   }else{
     templateObject.includeCreditCard.set(false);
   }

  //});


  $(this).closest('tr').attr('data-target', '#myModal');
  $(this).closest('tr').attr('data-toggle', 'modal');

}

}

});
});


Template.paymentmethodSettings.events({
    'click #btnNewInvoice':function(event){
        // Router.go('/invoicecard');
    },
    'click .feeOnTopInput':function(event){
      if($(event.target).is(':checked')){
        $('.feeInPriceInput').attr('checked', false);
      }
    },
    'click .feeInPriceInput':function(event){
      if($(event.target).is(':checked')){
        $('.feeOnTopInput').attr('checked', false);
      }
    },
    'click .chkDatatable' : function(event){
      var columns = $('#paymentmethodList th');
      let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

      $.each(columns, function(i,v) {
        let className = v.classList;
        let replaceClass = className[1];

      if(v.innerText == columnDataValue){
      if($(event.target).is(':checked')){
        $("."+replaceClass+"").css('display','table-cell');
        $("."+replaceClass+"").css('padding','.75rem');
        $("."+replaceClass+"").css('vertical-align','top');
      }else{
        $("."+replaceClass+"").css('display','none');
      }
      }
      });
    },
    'click .resetTable' : function(event){
      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'paymentmethodList'});
          if (checkPrefDetails) {
            CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
            if (err) {

            }else{
              Meteor._reload.reload();
            }
            });

          }
        }
      }
    },
    'click .saveTable' : function(event){
      let lineItems = [];
      $('.columnSettings').each(function (index) {
        var $tblrow = $(this);
        var colTitle = $tblrow.find(".divcolumn").text()||'';
        var colWidth = $tblrow.find(".custom-range").val()||0;
        var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
        var colHidden = false;
        if($tblrow.find(".custom-control-input").is(':checked')){
          colHidden = false;
        }else{
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

      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'paymentmethodList'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'paymentmethodList',published:true,
              customFields:lineItems,
              updatedAt: new Date() }}, function(err, idTag) {
              if (err) {
                $('#myModal2').modal('toggle');
              } else {
                $('#myModal2').modal('toggle');
              }
            });

          }else{
            CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'paymentmethodList',published:true,
              customFields:lineItems,
              createdAt: new Date() }, function(err, idTag) {
              if (err) {
                $('#myModal2').modal('toggle');
              } else {
                $('#myModal2').modal('toggle');

              }
            });
          }
        }
      }

    },
    'blur .divcolumn' : function(event){
      let columData = $(event.target).text();

      let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
      var datable = $('#paymentmethodList').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#paymentmethodList th');
      $.each(datable, function(i,v) {
        
      if(v.innerText == columnDataValue){
          let className = v.className;
          let replaceClass = className.replace(/ /g, ".");
        $("."+replaceClass+"").css('width',range+'px');

      }
      });

    },
    'click .btnOpenSettings' : function(event){
      let templateObject = Template.instance();
      var columns = $('#paymentmethodList th');
      
      const tableHeaderList = [];
      let sTible = "";
      let sWidth = "";
      let sIndex = "";
      let sVisible = "";
      let columVisible = false;
      let sClass = "";
      $.each(columns, function(i,v) {
        if(v.hidden == false){
          columVisible =  true;
        }
        if((v.className.includes("hiddenColumn"))){
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
  'click #exportbtn': function () {
    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#paymentmethodList_wrapper .dt-buttons .btntabletoexcel').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
        addVS1Data('TPaymentMethod',JSON.stringify(dataReload)).then(function (datareturn) {
        location.reload(true);
        }).catch(function (err) {
          location.reload(true);
        });
    }).catch(function(err) {
        location.reload(true);
    });
  },
  'click .btnDeletePaymentMethod': function () {
    let taxRateService = new TaxRateService();
    let paymentMethodId = $('#selectDeleteLineID').val();


    let objDetails = {
        type: "TPaymentMethod",
        fields: {
            Id: parseInt(paymentMethodId),
            Active: false
        }
    };

    taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
      sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
          addVS1Data('TPaymentMethod',JSON.stringify(dataReload)).then(function (datareturn) {
          location.reload(true);
          }).catch(function (err) {
            location.reload(true);
          });
      }).catch(function(err) {
          location.reload(true);
      });
    }).catch(function (err) {
      swal({
      title: 'Something went wrong',
      text: err,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Try Again'
      }).then((result) => {
      if (result.value) {
       Meteor._reload.reload();
      } else if (result.dismiss === 'cancel') {

      }
      });
        $('.fullScreenSpin').css('display','none');
    });

  },
  'click .btnSavePaymentMethod': function () {
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let paymentMethodID = $('#edtPaymentMethodID').val();
    //let headerDept = $('#sltDepartment').val();
    let paymentName = $('#edtName').val();
    let isCreditCard = false;
    let siteCode = $('#edtSiteCode').val();

    if($('#isformcreditcard').is(':checked')){
      isCreditCard = true;
    }else{
      isCreditCard = false;
    }

    let objDetails = '';
    if (paymentName === ''){
      $('.fullScreenSpin').css('display','none');
    Bert.alert('<strong>WARNING:</strong> Payment Method Name cannot be blank!', 'warning');
    e.preventDefault();
    }

    if(paymentMethodID == ""){
      taxRateService.checkPaymentMethodByName(paymentName).then(function (data) {
        paymentMethodID = data.tpaymentmethod[0].Id;
        objDetails = {
           type: "TPaymentMethod",
           fields: {
               ID: parseInt(paymentMethodID),
               Active: true,
               //PaymentMethodName: paymentName,
               IsCreditCard: isCreditCard,
               PublishOnVS1:true
           }
       };

       taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
         sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
             addVS1Data('TPaymentMethod',JSON.stringify(dataReload)).then(function (datareturn) {
             location.reload(true);
             }).catch(function (err) {
               location.reload(true);
             });
         }).catch(function(err) {
             location.reload(true);
         });
       }).catch(function (err) {
         swal({
         title: 'Something went wrong',
         text: err,
         type: 'error',
         showCancelButton: false,
         confirmButtonText: 'Try Again'
         }).then((result) => {
         if (result.value) {
          Meteor._reload.reload();
         } else if (result.dismiss === 'cancel') {

         }
         });
           $('.fullScreenSpin').css('display','none');
       });
      }).catch(function (err) {
        objDetails = {
           type: "TPaymentMethod",
           fields: {
               Active: true,
               PaymentMethodName: paymentName,
               IsCreditCard: isCreditCard,
               PublishOnVS1:true
           }
       };

       taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
         sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
             addVS1Data('TPaymentMethod',JSON.stringify(dataReload)).then(function (datareturn) {
             location.reload(true);
             }).catch(function (err) {
               location.reload(true);
             });
         }).catch(function(err) {
             location.reload(true);
         });
       }).catch(function (err) {
         swal({
         title: 'Something went wrong',
         text: err,
         type: 'error',
         showCancelButton: false,
         confirmButtonText: 'Try Again'
         }).then((result) => {
         if (result.value) {
          Meteor._reload.reload();
         } else if (result.dismiss === 'cancel') {

         }
         });
           $('.fullScreenSpin').css('display','none');
       });
      });

   }else{
     objDetails = {
        type: "TPaymentMethod",
        fields: {
            ID: parseInt(paymentMethodID),
            Active: true,
            PaymentMethodName: paymentName,
            IsCreditCard: isCreditCard,
            PublishOnVS1:true
        }
    };

    taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
      sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
          addVS1Data('TPaymentMethod',JSON.stringify(dataReload)).then(function (datareturn) {
          location.reload(true);
          }).catch(function (err) {
            location.reload(true);
          });
      }).catch(function(err) {
          location.reload(true);
      });
    }).catch(function (err) {
      swal({
      title: 'Something went wrong',
      text: err,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Try Again'
      }).then((result) => {
      if (result.value) {
       Meteor._reload.reload();
      } else if (result.dismiss === 'cancel') {

      }
      });
        $('.fullScreenSpin').css('display','none');
    });
   }

   


  },
  'click .btnAddPaymentMethod': function () {
    let templateObject = Template.instance();
      $('#add-paymentmethod-title').text('Add New Payment Method');
      $('#edtPaymentMethodID').val('');
      $('#edtName').val('');
      templateObject.includeCreditCard.set(false);
  },
  'click .btnBack':function(event){
    event.preventDefault();
    history.back(1);
  }


});

Template.paymentmethodSettings.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.paymentmethodname == 'NA') {
     return 1;
         }
     else if (b.paymentmethodname == 'NA') {
       return -1;
     }
   return (a.paymentmethodname.toUpperCase() > b.paymentmethodname.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'paymentmethodList'});
},
deptrecords: () => {
    return Template.instance().deptrecords.get().sort(function(a, b){
      if (a.department == 'NA') {
    return 1;
        }
    else if (b.department == 'NA') {
      return -1;
    }
  return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
  });
},
includeCreditCard: () => {
    return Template.instance().includeCreditCard.get();
},
loggedCompany: () => {
  return localStorage.getItem('mySession') || '';
}
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
