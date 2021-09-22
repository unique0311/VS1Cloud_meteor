import {PaymentsService} from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.customerpayment.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.customerpayment.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];


    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                    // let columnindex = customcolumn[i].index + 1;
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

    templateObject.resetData = function (dataVal) {
      window.open('/customerpayment?page=last','_self');
    }
    // $('#tblCustomerPayment').DataTable();
    templateObject.getAllSalesOrderData = function () {
        getVS1Data('TCustomerPayment').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};

                        addVS1Data('TCustomerPayment',JSON.stringify(data));

                    for(let i=0; i<data.tcustomerpayment.length; i++){

                        let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Amount)|| 0.00;
                        let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Applied) || 0.00;
                        // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Balance)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalPaid)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalBalance)|| 0.00;
                        var dataList = {
                            id: data.tcustomerpayment[i].fields.ID || '',
                            sortdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("YYYY/MM/DD"): data.tcustomerpayment[i].fields.PaymentDate,
                            paymentdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("DD/MM/YYYY"): data.tcustomerpayment[i].fields.PaymentDate,
                            customername: data.tcustomerpayment[i].fields.CompanyName || '',
                            paymentamount: amount || 0.00,
                            applied: applied || 0.00,
                            balance: balance || 0.00,
                            bankaccount: data.tcustomerpayment[i].fields.AccountName || '',
                            department: data.tcustomerpayment[i].fields.DeptClassName || '',
                            refno: data.tcustomerpayment[i].fields.ReferenceNo || '',
                            paymentmethod: data.tcustomerpayment[i].fields.PaymentMethodName || '',
                            notes: data.tcustomerpayment[i].fields.Notes || ''
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.datatablerecords.set(dataTableList);
                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblCustomerPayment').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [
                                {type: 'date', targets: 0}
                                // ,
                                // { targets: 0, className: "text-center" }

                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Customer Payments List - "+ moment().format(),
                                    orientation:'portrait',
                                    exportOptions: {
                                        columns: ':visible',
                                        format: {
                                            body: function ( data, row, column ) {
                                                if(data.includes("</span>")){
                                                    var res = data.split("</span>");
                                                    data = res[1];
                                                }

                                                return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                            }
                                        }
                                    }
                                },{
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Customer Payment',
                                    filename: "Customer Payments List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: 25,
                            searching: true,
                            lengthMenu: [ [25, -1], [25, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#tblCustomerPayment').DataTable().ajax.reload();
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
                    }, 0);

                    var columns = $('#tblCustomerPayment th');
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
                    $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if(listData){
                            FlowRouter.go('/paymentcard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomerpayment;
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<data.tcustomerpayment.length; i++){
                    let amount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Amount)|| 0.00;
                    let applied = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Applied) || 0.00;
                    // Currency+''+useData[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        sortdate: useData[i].fields.PaymentDate !=''? moment(useData[i].fields.PaymentDate).format("YYYY/MM/DD"): useData[i].fields.PaymentDate,
                        paymentdate: useData[i].fields.PaymentDate !=''? moment(useData[i].fields.PaymentDate).format("DD/MM/YYYY"): useData[i].fields.PaymentDate,
                        customername: useData[i].fields.CompanyName || '',
                        paymentamount: amount || 0.00,
                        applied: applied || 0.00,
                        balance: balance || 0.00,
                        bankaccount: useData[i].fields.AccountName || '',
                        department: useData[i].fields.DeptClassName || '',
                        refno: useData[i].fields.ReferenceNo || '',
                        paymentmethod: useData[i].fields.PaymentMethodName || '',
                        notes: useData[i].fields.Notes || ''
                    };
                    dataTableList.push(dataList);
                }
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblCustomerPayment').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            {type: 'date', targets: 0}
                            // ,
                            // { targets: 0, className: "text-center" }

                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Customer Payments List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function ( data, row, column ) {
                                            if(data.includes("</span>")){
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }

                                            return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                        }
                                    }
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Customer Payment',
                                filename: "Customer Payments List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: 25,
                        searching: true,
                        lengthMenu: [ [25, -1], [25, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblCustomerPayment').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblCustomerPayment_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }

                          if(oSettings.fnRecordsDisplay() < 25){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }
                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;

                             sideBarService.getTCustomerPaymentList(25,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TCustomerPayment').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpayment), dataOld.tcustomerpayment);
                                   let objCombineData = {
                                     tcustomerpayment:thirdaryData
                                   }


                                     addVS1Data('TCustomerPayment',JSON.stringify(objCombineData)).then(function (datareturn) {
                                       templateObject.resetData(objCombineData);
                                     $('.fullScreenSpin').css('display','none');
                                     }).catch(function (err) {
                                     $('.fullScreenSpin').css('display','none');
                                     });

                                 }
                                }).catch(function (err) {

                                });

                             }).catch(function(err) {
                               $('.fullScreenSpin').css('display','none');
                             });

                           });
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if(urlParametersPage){
                            this.fnPageChange('last');
                          }

                         }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on( 'length.dt', function ( e, settings, len ) {
                      $('.fullScreenSpin').css('display','inline-block');
                      let dataLenght = settings._iDisplayLength;
                      if(dataLenght == -1){
                        if(settings.fnRecordsDisplay() > 150){
                          $('.paginate_button.page-item.next').addClass('disabled');
                          $('.fullScreenSpin').css('display','none');
                        }else{
                        sideBarService.getTCustomerPaymentList('All',1).then(function(dataNonBo) {

                          addVS1Data('TCustomerPayment',JSON.stringify(dataNonBo)).then(function (datareturn) {
                            templateObject.resetData(dataNonBo);
                          $('.fullScreenSpin').css('display','none');
                          }).catch(function (err) {
                          $('.fullScreenSpin').css('display','none');
                          });
                        }).catch(function(err) {
                          $('.fullScreenSpin').css('display','none');
                        });
                       }
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display','none');
                        }else{
                          sideBarService.getTCustomerPaymentList(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('TCustomerPayment',JSON.stringify(dataNonBo)).then(function (datareturn) {
                              templateObject.resetData(dataNonBo);
                            $('.fullScreenSpin').css('display','none');
                            }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                            });
                          }).catch(function(err) {
                            $('.fullScreenSpin').css('display','none');
                          });
                        }
                      }
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblCustomerPayment th');
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
                $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/paymentcard?id=' + listData);
                    }
                });
            }
        }).catch(function (err) {
          sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};

                  addVS1Data('TCustomerPayment',JSON.stringify(data));

              for(let i=0; i<data.tcustomerpayment.length; i++){

                  let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Amount)|| 0.00;
                  let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Applied) || 0.00;
                  // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                  let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Balance)|| 0.00;
                  let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalPaid)|| 0.00;
                  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalBalance)|| 0.00;
                  var dataList = {
                      id: data.tcustomerpayment[i].fields.ID || '',
                      sortdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("YYYY/MM/DD"): data.tcustomerpayment[i].fields.PaymentDate,
                      paymentdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("DD/MM/YYYY"): data.tcustomerpayment[i].fields.PaymentDate,
                      customername: data.tcustomerpayment[i].fields.CompanyName || '',
                      paymentamount: amount || 0.00,
                      applied: applied || 0.00,
                      balance: balance || 0.00,
                      bankaccount: data.tcustomerpayment[i].fields.AccountName || '',
                      department: data.tcustomerpayment[i].fields.DeptClassName || '',
                      refno: data.tcustomerpayment[i].fields.ReferenceNo || '',
                      paymentmethod: data.tcustomerpayment[i].fields.PaymentMethodName || '',
                      notes: data.tcustomerpayment[i].fields.Notes || ''
                  };
                  dataTableList.push(dataList);
              }
              templateObject.datatablerecords.set(dataTableList);
              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                  //$.fn.dataTable.moment('DD/MM/YY');
                  $('#tblCustomerPayment').DataTable({
                      // dom: 'lBfrtip',
                      columnDefs: [
                          {type: 'date', targets: 0}
                          // ,
                          // { targets: 0, className: "text-center" }

                      ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                          {
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "Customer Payments List - "+ moment().format(),
                              orientation:'portrait',
                              exportOptions: {
                                  columns: ':visible',
                                  format: {
                                      body: function ( data, row, column ) {
                                          if(data.includes("</span>")){
                                              var res = data.split("</span>");
                                              data = res[1];
                                          }

                                          return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                      }
                                  }
                              }
                          },{
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Customer Payment',
                              filename: "Customer Payments List - "+ moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: 25,
                      searching: true,
                      lengthMenu: [ [25, -1], [25, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      // "aaSorting": [[1,'desc']],
                      action: function () {
                          $('#tblCustomerPayment').DataTable().ajax.reload();
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
              }, 0);

              var columns = $('#tblCustomerPayment th');
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
              $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                  var listData = $(this).closest('tr').attr('id');
                  if(listData){
                      FlowRouter.go('/paymentcard?id=' + listData);
                  }
              });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });

    }

    templateObject.getAllSalesOrderData();

});

Template.customerpayment.events({
    'click #newSalesOrder' : function(event){
        FlowRouter.go('/salesordercard');
    },
    'click .salesOrderList' : function(event){
        FlowRouter.go('/salesorderslist');
    },
    'click #newInvoice' : function(event){
        FlowRouter.go('/invoicecard');
    },
    'click .invoiceList' : function(event){
        FlowRouter.go('/invoicelist');
    },
    'click #newQuote' : function(event){
        FlowRouter.go('/quotecard');
    },
    'click .QuoteList' : function(event){
        FlowRouter.go('/quoteslist');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblCustomerPayment th');
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerPayment'});
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
        //let datatable =$('#tblCustomerPayment').DataTable();
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
        //datatable.state.save();

        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerPayment'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblCustomerPayment',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblCustomerPayment',published:true,
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

        //Meteor._reload.reload();
    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblCustomerPayment').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblCustomerPayment th');
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
        var columns = $('#tblCustomerPayment th');

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
        jQuery('#tblCustomerPayment_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnNewPayment': function () {
        FlowRouter.go('/customerawaitingpayments');
    },
    'click .btnAwaitingPayment': function () {
        FlowRouter.go('/customerawaitingpayments');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function(data) {
            addVS1Data('TCustomerPayment',JSON.stringify(data)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .printConfirm' : function(event){
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerPayment_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    }


});
Template.customerpayment.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.paymentdate == 'NA') {
                return 1;
            }
            else if (b.paymentdate == 'NA') {
                return -1;
            }
            return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblCustomerPayment'});
    }
});
