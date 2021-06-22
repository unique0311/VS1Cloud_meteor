import {
  PaymentsService
} from "../../payments/payments-service";
import {
  ReactiveVar
} from "meteor/reactive-var";
import {
  UtilityService
} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {
  Random
} from 'meteor/random';

import 'jquery-editable-select';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.supplierpaymentcard.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar();
  templateObject.record = new ReactiveVar({});
  templateObject.CleintName = new ReactiveVar();
  templateObject.Department = new ReactiveVar();
  templateObject.Date = new ReactiveVar();
  templateObject.DueDate = new ReactiveVar();
  templateObject.clientrecords = new ReactiveVar([]);
  templateObject.deptrecords = new ReactiveVar();
  templateObject.paymentmethodrecords = new ReactiveVar();
  templateObject.accountnamerecords = new ReactiveVar();
  templateObject.supppaymentid = new ReactiveVar();
});

Template.supplierpaymentcard.onRendered(() => {
//   $(document).ready(function () {
//     var referrer = document.referrer;
//     localStorage.setItem("prevurl", referrer);
//     history.pushState(null, document.title, location.href);
//     window.addEventListener('popstate', function (event) {
//         swal({
//             title: 'Save Or Cancel To Continue',
//             text: "Do you want to Save or Cancel this transaction?",
//             type: 'question',
//             showCancelButton: true,
//             confirmButtonText: 'Save'
//         }).then((result) => {
//             if (result.value) {
//                 $(".btnSave").trigger("click");
//             } else if (result.dismiss === 'cancel') {
//                 window.open('/supplierawaitingpurchaseorder', "_self");
//             } else {

//             }
//         });
//     });
// });
  $('.fullScreenSpin').css('display', 'inline-block');
  let imageData = (localStorage.getItem("Image"));
  if (imageData) {
    $('.uploadedImage').attr('src', imageData);
  };
  setTimeout(function() {
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
      if (error) {

        //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
      } else {
        if (result) {
          for (let i = 0; i < result.customFields.length; i++) {
            let customcolumn = result.customFields;
            let columData = customcolumn[i].label;
            let columHeaderUpdate = customcolumn[i].thclass;
            let hiddenColumn = customcolumn[i].hidden;
            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
            let columnWidth = customcolumn[i].width;

            $("" + columHeaderUpdate + "").html(columData);
            if (columnWidth != 0) {
              $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
            }

            if (hiddenColumn == true) {
              $("." + columnClass + "").addClass('hiddenColumn');
              $("." + columnClass + "").removeClass('showColumn');
              $(".chk" + columnClass + "").removeAttr('checked');
            } else if (hiddenColumn == false) {
              $("." + columnClass + "").removeClass('hiddenColumn');
              $("." + columnClass + "").addClass('showColumn');
              $(".chk" + columnClass + "").attr('checked', 'checked');
            }

          }
        }

      }
    });
  }, 500);
  $('#edtSupplierName').attr('disabled', 'disabled');
  $('#edtSupplierName').attr('readonly', true);
  $("#date-input,#dtPaymentDate").datepicker({
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
  const templateObject = Template.instance();
  const record = [];
  let paymentService = new PaymentsService();
  let clientsService = new PaymentsService();
  const clientList = [];
  const deptrecords = [];
  const paymentmethodrecords = [];
  const accountnamerecords = [];

  templateObject.getAllClients = function() {
    getVS1Data('TSupplierVS1').then(function (dataObject) {
    if(dataObject.length == 0){
      clientsService.getSupplierVS1().then(function(data) {
        for (let i in data.tsuppliervs1) {

          let customerrecordObj = {
            customerid: data.tsuppliervs1[i].Id || ' ',
            customername: data.tsuppliervs1[i].ClientName || ' ',
            customeremail: data.tsuppliervs1[i].Email || ' ',
            street: data.tsuppliervs1[i].Street || ' ',
            street2: data.tsuppliervs1[i].Street2 || ' ',
            street3: data.tsuppliervs1[i].Street3 || ' ',
            suburb: data.tsuppliervs1[i].Suburb || ' ',
            statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
            country: data.tsuppliervs1[i].Country || ' '
          };
          //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
          clientList.push(customerrecordObj);

          //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
        }
        //templateObject.clientrecords.set(clientList);
        templateObject.clientrecords.set(clientList.sort(function(a, b) {
          if (a.customername == 'NA') {
            return 1;
          } else if (b.customername == 'NA') {
            return -1;
          }
          return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
        }));

        for (var i = 0; i < clientList.length; i++) {
          $('#edtSupplierName').editableSelect('add', clientList[i].customername);
        }


      });
    }else{
    let data = JSON.parse(dataObject[0].data);
    let useData = data.tsuppliervs1;
    for (let i in useData) {

      let customerrecordObj = {
        customerid: useData[i].fields.ID || ' ',
        customername: useData[i].fields.ClientName || ' ',
        customeremail: useData[i].fields.Email || ' ',
        street: useData[i].fields.Street || ' ',
        street2: useData[i].fields.Street2 || ' ',
        street3: useData[i].fields.Street3 || ' ',
        suburb: useData[i].fields.Suburb || ' ',
        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
        country: useData[i].fields.Country || ' '
      };
      //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
      clientList.push(customerrecordObj);

      //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
    }
    //templateObject.clientrecords.set(clientList);
    templateObject.clientrecords.set(clientList.sort(function(a, b) {
      if (a.customername == 'NA') {
        return 1;
      } else if (b.customername == 'NA') {
        return -1;
      }
      return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
    }));

    for (var i = 0; i < clientList.length; i++) {
      $('#edtSupplierName').editableSelect('add', clientList[i].customername);
    }

    }
    }).catch(function (err) {
      clientsService.getSupplierVS1().then(function(data) {
        for (let i in data.tsuppliervs1) {

          let customerrecordObj = {
            customerid: data.tsuppliervs1[i].Id || ' ',
            customername: data.tsuppliervs1[i].ClientName || ' ',
            customeremail: data.tsuppliervs1[i].Email || ' ',
            street: data.tsuppliervs1[i].Street || ' ',
            street2: data.tsuppliervs1[i].Street2 || ' ',
            street3: data.tsuppliervs1[i].Street3 || ' ',
            suburb: data.tsuppliervs1[i].Suburb || ' ',
            statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
            country: data.tsuppliervs1[i].Country || ' '
          };
          //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
          clientList.push(customerrecordObj);

          //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
        }
        //templateObject.clientrecords.set(clientList);
        templateObject.clientrecords.set(clientList.sort(function(a, b) {
          if (a.customername == 'NA') {
            return 1;
          } else if (b.customername == 'NA') {
            return -1;
          }
          return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
        }));

        for (var i = 0; i < clientList.length; i++) {
          $('#edtSupplierName').editableSelect('add', clientList[i].customername);
        }


      });
    });


  };
  templateObject.getDepartments = function() {
    getVS1Data('TDeptClass').then(function (dataObject) {
      if(dataObject.length == 0){
        paymentService.getDepartment().then(function(data){
          for(let i in data.tdeptclass){

            let deptrecordObj = {
              department: data.tdeptclass[i].DeptClassName || ' ',
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

          }
      });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;

        for(let i in useData){

          let deptrecordObj = {
            department: useData[i].DeptClassName || ' ',
          };

          deptrecords.push(deptrecordObj);
          templateObject.deptrecords.set(deptrecords);

        }
      }
      }).catch(function (err) {
        paymentService.getDepartment().then(function(data){
          for(let i in data.tdeptclass){

            let deptrecordObj = {
              department: data.tdeptclass[i].DeptClassName || ' ',
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

          }
      });
      });


  }

  templateObject.getPaymentMethods = function() {
    getVS1Data('TPaymentMethod').then(function (dataObject) {
    if(dataObject.length == 0){
      paymentService.getPaymentMethodVS1().then(function(data){
        for(let i in data.tpaymentmethodvs1){

          let paymentmethodrecordObj = {
            paymentmethod: data.tpaymentmethodvs1[i].PaymentMethodName || ' ',
          };

          paymentmethodrecords.push(paymentmethodrecordObj);
          templateObject.paymentmethodrecords.set(paymentmethodrecords);

        }
    });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tpaymentmethodvs1;
      for(let i in useData){

        let paymentmethodrecordObj = {
          paymentmethod: useData[i].fields.PaymentMethodName || ' ',
        };

        paymentmethodrecords.push(paymentmethodrecordObj);
        templateObject.paymentmethodrecords.set(paymentmethodrecords);

      }
    }

    }).catch(function (err) {
      paymentService.getPaymentMethodVS1().then(function(data){
        for(let i in data.tpaymentmethodvs1){

          let paymentmethodrecordObj = {
            paymentmethod: data.tpaymentmethodvs1[i].PaymentMethodName || ' ',
          };

          paymentmethodrecords.push(paymentmethodrecordObj);
          templateObject.paymentmethodrecords.set(paymentmethodrecords);

        }
    });
    });

  }

  templateObject.getAccountNames = function() {
    getVS1Data('TAccountVS1').then(function (dataObject) {
      if(dataObject.length == 0){
        paymentService.getAccountNameVS1().then(function(data){
          for(let i in data.taccountvs1){

            let accountnamerecordObj = {
              accountname: data.taccountvs1[i].AccountName || ' '
            };
            // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
            if(data.taccountvs1[i].AccountTypeName ==  "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB"){
              accountnamerecords.push(accountnamerecordObj);
            }
            templateObject.accountnamerecords.set(accountnamerecords);
            if(templateObject.accountnamerecords.get()){
              setTimeout(function () {
              var usedNames = {};
              $("select[name='edtBankAccountName'] > option").each(function () {
                  if(usedNames[this.text]) {
                      $(this).remove();
                  } else {
                      usedNames[this.text] = this.value;
                  }
              });
            }, 1000);
            }

          }
      });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.taccountvs1;

        for(let i in useData){

          let accountnamerecordObj = {
            accountname: useData[i].fields.AccountName || ' '
          };
          // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
          if(useData[i].fields.AccountTypeName.replace(/\s/g, '') ==  "BANK" || useData[i].fields.AccountTypeName.toUpperCase() == "CCARD" || useData[i].fields.AccountTypeName.replace(/\s/g, '') == "OCLIAB"){
            accountnamerecords.push(accountnamerecordObj);
          }
          //accountnamerecords.push(accountnamerecordObj);
          templateObject.accountnamerecords.set(accountnamerecords);
          if(templateObject.accountnamerecords.get()){
            setTimeout(function () {
            var usedNames = {};
            $("select[name='edtBankAccountName'] > option").each(function () {
                if(usedNames[this.text]) {
                    $(this).remove();
                } else {
                    usedNames[this.text] = this.value;
                }
            });

          }, 1000);
          }

        }

      }
      }).catch(function (err) {
        paymentService.getAccountNameVS1().then(function(data){
          for(let i in data.taccountvs1){

            let accountnamerecordObj = {
              accountname: data.taccountvs1[i].AccountName || ' '
            };
            // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
            if(data.taccountvs1[i].AccountTypeName ==  "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB"){
              accountnamerecords.push(accountnamerecordObj);
            }
            templateObject.accountnamerecords.set(accountnamerecords);
            if(templateObject.accountnamerecords.get()){
              setTimeout(function () {
              var usedNames = {};
              $("select[name='edtBankAccountName'] > option").each(function () {
                  if(usedNames[this.text]) {
                      $(this).remove();
                  } else {
                      usedNames[this.text] = this.value;
                  }
              });
            }, 1000);
            }

          }
      });
      });

  }

  templateObject.getAllClients();
  templateObject.getDepartments();
  templateObject.getPaymentMethods();
  templateObject.getAccountNames();
  $('#edtSupplierName').editableSelect()
    .on('select.editable-select', function(e, li) {
      let selectedSupplier = li.text();
      if (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          if (clientList[i].customername == selectedSupplier) {
            $('#edtSupplierEmail').val(clientList[i].customeremail);
            $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
            $('#txabillingAddress').val(postalAddress);
          }
        }
      }
    });

  var url = window.location.href;
  if (url.indexOf('?id=') > 0) {
    var getsale_id = url.split('?id=');
    var currentSalesID = getsale_id[getsale_id.length - 1];
    if (getsale_id[1]) {
      currentSalesID = parseInt(currentSalesID);
      getVS1Data('TSupplierPayment').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
            let lineItems = [];
            let lineItemObj = {};

            let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });

            if (data.fields.Lines.length) {
              for (let i = 0; i < data.fields.Lines.length; i++) {
                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });

                lineItemObj = {

                  id: data.fields.Lines[i].fields.ID || '',
                  invoiceid: data.fields.Lines[i].fields.ID || '',
                  transid: data.fields.Lines[i].fields.ID || '',
                  poid: data.fields.Lines[i].fields.POID || '',
                  invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                  refno: data.fields.Lines[i].fields.RefNo || '',
                  transtype: data.fields.Lines[i].fields.TrnType || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);
              }
            } else {
              let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              lineItemObj = {
                id: data.fields.Lines.fields.ID || '',
                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                transid: data.fields.Lines.fields.TransNo || '',
                poid: data.fields.Lines.fields.POID || '',
                invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
                refno: data.fields.Lines.fields.RefNo || '',
                transtype: data.fields.Lines.fields.TrnType || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount: outstandingAmt,
                orginalamount: originalAmt
              };
              lineItems.push(lineItemObj);
            }
            let record = {
              lid: data.fields.ID || '',
              customerName: data.fields.CompanyName || '',
              paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
              reference: data.fields.ReferenceNo || ' ',
              bankAccount: data.fields.AccountName || '',
              paymentAmount: appliedAmt || 0,
              notes: data.fields.Notes,
              LineItems: lineItems,
              checkpayment: data.fields.Payment,
              department: data.fields.DeptClassName,
              applied: appliedAmt.toLocaleString(undefined, {
                minimumFractionDigits: 2
              })

            };
            templateObject.record.set(record);
            $('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
            $('#edtSupplierName').val(data.fields.CompanyName);

            $('#edtSupplierName').attr('disabled', 'disabled');
            $('#edtSupplierName').attr('readonly', true);

            $('#edtSupplierEmail').attr('readonly', true);

            $('#edtPaymentAmount').attr('readonly', true);

            $('#edtBankAccountName').attr('disabled', 'disabled');
            $('#edtBankAccountName').attr('readonly', true);

            $('.ui-datepicker-trigger').css('pointer-events', 'none');
            $('#dtPaymentDate').attr('readonly', true);

            $('#sltPaymentMethod').attr('disabled', 'disabled');
            $('#sltPaymentMethod').attr('readonly', true);

            $('#sltDepartment').attr('disabled', 'disabled');
            $('#sltDepartment').attr('readonly', true);


            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
              if (error) {

                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $("" + columHeaderUpdate + "").html(columData);
                    if (columnWidth != 0) {
                      $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                    }

                    if (hiddenColumn == true) {
                      $("." + columnClass + "").addClass('hiddenColumn');
                      $("." + columnClass + "").removeClass('showColumn');
                      $(".chk" + columnClass + "").removeAttr('checked');
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass('hiddenColumn');
                      $("." + columnClass + "").addClass('showColumn');
                      $(".chk" + columnClass + "").attr('checked', 'checked');
                    }

                  }
                }

              }
            });

            setTimeout(function() {
              $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
            }, 1000);






            //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
            //$('#edtBankAccountName').val(data.fields.AccountName);
            //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
            $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
            $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
            if (clientList) {
              for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].customername == data.fields.SupplierName) {
                  $('#edtSupplierEmail').val(clientList[i].customeremail);
                  $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tsupplierpayment;


          var added=false;
          for(let d=0; d<useData.length; d++){

              if(parseInt(useData[d].fields.ID) === currentSalesID){
                $('.fullScreenSpin').css('display','none');
                added = true;
                let lineItems = [];
let lineItemObj = {};

let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Amount).toLocaleString(undefined, {
  minimumFractionDigits: 2
});
let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Applied).toLocaleString(undefined, {
  minimumFractionDigits: 2
});

if (useData[d].fields.Lines.length) {
  for (let i = 0; i < useData[d].fields.Lines.length; i++) {
    let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });
    let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.Payment).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });
    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });
    let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });

    lineItemObj = {

      id: useData[d].fields.Lines[i].fields.ID || '',
      invoiceid: useData[d].fields.Lines[i].fields.ID || '',
      transid: useData[d].fields.Lines[i].fields.ID || '',
      poid: useData[d].fields.Lines[i].fields.POID || '',
      invoicedate: useData[d].fields.Lines[i].fields.Date != '' ? moment(useData[d].fields.Lines[i].fields.Date).format("DD/MM/YYYY") : useData[d].fields.Lines[i].fields.Date,
      refno: useData[d].fields.Lines[i].fields.RefNo || '',
      transtype: useData[d].fields.Lines[i].fields.TrnType || '',
      amountdue: amountDue || 0,
      paymentamount: paymentAmt || 0,
      ouststandingamount: outstandingAmt,
      orginalamount: originalAmt
    };
    lineItems.push(lineItemObj);
  }
} else {
  let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.AmountDue).toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
  let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.Payment).toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
  let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
  let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
  lineItemObj = {
    id: useData[d].fields.Lines.fields.ID || '',
    invoiceid: useData[d].fields.Lines.fields.InvoiceId || '',
    transid: useData[d].fields.Lines.fields.TransNo || '',
    poid: useData[d].fields.Lines.fields.POID || '',
    invoicedate: useData[d].fields.Lines.fields.Date != '' ? moment(useData[d].fields.Lines.fields.Date).format("DD/MM/YYYY") : useData[d].fields.Lines.fields.Date,
    refno: useData[d].fields.Lines.fields.RefNo || '',
    transtype: useData[d].fields.Lines.fields.TrnType || '',
    amountdue: amountDue || 0,
    paymentamount: paymentAmt || 0,
    ouststandingamount: outstandingAmt,
    orginalamount: originalAmt
  };
  lineItems.push(lineItemObj);
}
let record = {
  lid: useData[d].fields.ID || '',
  customerName: useData[d].fields.CompanyName || '',
  paymentDate: useData[d].fields.PaymentDate ? moment(useData[d].fields.PaymentDate).format('DD/MM/YYYY') : "",
  reference: useData[d].fields.ReferenceNo || ' ',
  bankAccount: useData[d].fields.AccountName || '',
  paymentAmount: appliedAmt || 0,
  notes: useData[d].fields.Notes,
  LineItems: lineItems,
  checkpayment: useData[d].fields.Payment,
  department: useData[d].fields.DeptClassName,
  applied: appliedAmt.toLocaleString(undefined, {
    minimumFractionDigits: 2
  })

};
templateObject.record.set(record);
$('#edtSupplierName').editableSelect('add', useData[d].fields.CompanyName);
$('#edtSupplierName').val(useData[d].fields.CompanyName);

$('#edtSupplierName').attr('disabled', 'disabled');
$('#edtSupplierName').attr('readonly', true);

$('#edtSupplierEmail').attr('readonly', true);

$('#edtPaymentAmount').attr('readonly', true);

$('#edtBankAccountName').attr('disabled', 'disabled');
$('#edtBankAccountName').attr('readonly', true);

$('.ui-datepicker-trigger').css('pointer-events', 'none');
$('#dtPaymentDate').attr('readonly', true);

$('#sltPaymentMethod').attr('disabled', 'disabled');
$('#sltPaymentMethod').attr('readonly', true);

$('#sltDepartment').attr('disabled', 'disabled');
$('#sltDepartment').attr('readonly', true);


Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
  if (error) {

    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
  } else {
    if (result) {
      for (let i = 0; i < result.customFields.length; i++) {
        let customcolumn = result.customFields;
        let columData = customcolumn[i].label;
        let columHeaderUpdate = customcolumn[i].thclass;
        let hiddenColumn = customcolumn[i].hidden;
        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
        let columnWidth = customcolumn[i].width;

        $("" + columHeaderUpdate + "").html(columData);
        if (columnWidth != 0) {
          $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
        }

        if (hiddenColumn == true) {
          $("." + columnClass + "").addClass('hiddenColumn');
          $("." + columnClass + "").removeClass('showColumn');
          $(".chk" + columnClass + "").removeAttr('checked');
        } else if (hiddenColumn == false) {
          $("." + columnClass + "").removeClass('hiddenColumn');
          $("." + columnClass + "").addClass('showColumn');
          $(".chk" + columnClass + "").attr('checked', 'checked');
        }

      }
    }

  }
});

setTimeout(function() {
  $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
}, 1000);






//$('#edtBankAccountName').editableSelect('add',useData[d].fields.AccountName);
//$('#edtBankAccountName').val(useData[d].fields.AccountName);
//  $('#edtBankAccountName').append($('<option>', {value:useData[d].fields.AccountName selected="selected", text:useData[d].fields.AccountName}));
$('#edtBankAccountName').append('<option value="' + useData[d].fields.AccountName + '" selected="selected">' + useData[d].fields.AccountName + '</option>');
$('#sltDepartment').append('<option value="' + useData[d].fields.DeptClassName + '" selected="selected">' + useData[d].fields.DeptClassName + '</option>');
if (clientList) {
  for (var i = 0; i < clientList.length; i++) {
    if (clientList[i].customername == useData[d].fields.SupplierName) {
      $('#edtSupplierEmail').val(clientList[i].customeremail);
      $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
      let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
      $('#txabillingAddress').val(postalAddress);
    }
  }
}
$('.fullScreenSpin').css('display', 'none');
              }

          }
          if(!added) {
            paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
              let lineItems = [];
              let lineItemObj = {};

              let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });

              if (data.fields.Lines.length) {
                for (let i = 0; i < data.fields.Lines.length; i++) {
                  let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  });
                  let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  });
                  let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  });
                  let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  });

                  lineItemObj = {

                    id: data.fields.Lines[i].fields.ID || '',
                    invoiceid: data.fields.Lines[i].fields.ID || '',
                    transid: data.fields.Lines[i].fields.ID || '',
                    poid: data.fields.Lines[i].fields.POID || '',
                    invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                    refno: data.fields.Lines[i].fields.RefNo || '',
                    transtype: data.fields.Lines[i].fields.TrnType || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount: outstandingAmt,
                    orginalamount: originalAmt
                  };
                  lineItems.push(lineItemObj);
                }
              } else {
                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                lineItemObj = {
                  id: data.fields.Lines.fields.ID || '',
                  invoiceid: data.fields.Lines.fields.InvoiceId || '',
                  transid: data.fields.Lines.fields.TransNo || '',
                  poid: data.fields.Lines.fields.POID || '',
                  invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
                  refno: data.fields.Lines.fields.RefNo || '',
                  transtype: data.fields.Lines.fields.TrnType || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);
              }
              let record = {
                lid: data.fields.ID || '',
                customerName: data.fields.CompanyName || '',
                paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
                reference: data.fields.ReferenceNo || ' ',
                bankAccount: data.fields.AccountName || '',
                paymentAmount: appliedAmt || 0,
                notes: data.fields.Notes,
                LineItems: lineItems,
                checkpayment: data.fields.Payment,
                department: data.fields.DeptClassName,
                applied: appliedAmt.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })

              };
              templateObject.record.set(record);
              $('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
              $('#edtSupplierName').val(data.fields.CompanyName);

              $('#edtSupplierName').attr('disabled', 'disabled');
              $('#edtSupplierName').attr('readonly', true);

              $('#edtSupplierEmail').attr('readonly', true);

              $('#edtPaymentAmount').attr('readonly', true);

              $('#edtBankAccountName').attr('disabled', 'disabled');
              $('#edtBankAccountName').attr('readonly', true);

              $('.ui-datepicker-trigger').css('pointer-events', 'none');
              $('#dtPaymentDate').attr('readonly', true);

              $('#sltPaymentMethod').attr('disabled', 'disabled');
              $('#sltPaymentMethod').attr('readonly', true);

              $('#sltDepartment').attr('disabled', 'disabled');
              $('#sltDepartment').attr('readonly', true);


              Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                if (error) {

                  //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass;
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                      let columnWidth = customcolumn[i].width;

                      $("" + columHeaderUpdate + "").html(columData);
                      if (columnWidth != 0) {
                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                      }

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass('hiddenColumn');
                        $("." + columnClass + "").removeClass('showColumn');
                        $(".chk" + columnClass + "").removeAttr('checked');
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass('hiddenColumn');
                        $("." + columnClass + "").addClass('showColumn');
                        $(".chk" + columnClass + "").attr('checked', 'checked');
                      }

                    }
                  }

                }
              });

              setTimeout(function() {
                $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
              }, 1000);






              //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
              //$('#edtBankAccountName').val(data.fields.AccountName);
              //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
              $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
              $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
              if (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                  if (clientList[i].customername == data.fields.SupplierName) {
                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                    $('#txabillingAddress').val(postalAddress);
                  }
                }
              }
              $('.fullScreenSpin').css('display', 'none');
            });
          }
        }
      }).catch(function (err) {
        paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          if (data.fields.Lines.length) {
            for (let i = 0; i < data.fields.Lines.length; i++) {
              let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });
              let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2
              });

              lineItemObj = {

                id: data.fields.Lines[i].fields.ID || '',
                invoiceid: data.fields.Lines[i].fields.ID || '',
                transid: data.fields.Lines[i].fields.ID || '',
                poid: data.fields.Lines[i].fields.POID || '',
                invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                refno: data.fields.Lines[i].fields.RefNo || '',
                transtype: data.fields.Lines[i].fields.TrnType || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount: outstandingAmt,
                orginalamount: originalAmt
              };
              lineItems.push(lineItemObj);
            }
          } else {
            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            lineItemObj = {
              id: data.fields.Lines.fields.ID || '',
              invoiceid: data.fields.Lines.fields.InvoiceId || '',
              transid: data.fields.Lines.fields.TransNo || '',
              poid: data.fields.Lines.fields.POID || '',
              invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
              refno: data.fields.Lines.fields.RefNo || '',
              transtype: data.fields.Lines.fields.TrnType || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount: outstandingAmt,
              orginalamount: originalAmt
            };
            lineItems.push(lineItemObj);
          }
          let record = {
            lid: data.fields.ID || '',
            customerName: data.fields.CompanyName || '',
            paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
            reference: data.fields.ReferenceNo || ' ',
            bankAccount: data.fields.AccountName || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Notes,
            LineItems: lineItems,
            checkpayment: data.fields.Payment,
            department: data.fields.DeptClassName,
            applied: appliedAmt.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
          $('#edtSupplierName').val(data.fields.CompanyName);

          $('#edtSupplierName').attr('disabled', 'disabled');
          $('#edtSupplierName').attr('readonly', true);

          $('#edtSupplierEmail').attr('readonly', true);

          $('#edtPaymentAmount').attr('readonly', true);

          $('#edtBankAccountName').attr('disabled', 'disabled');
          $('#edtBankAccountName').attr('readonly', true);

          $('.ui-datepicker-trigger').css('pointer-events', 'none');
          $('#dtPaymentDate').attr('readonly', true);

          $('#sltPaymentMethod').attr('disabled', 'disabled');
          $('#sltPaymentMethod').attr('readonly', true);

          $('#sltDepartment').attr('disabled', 'disabled');
          $('#sltDepartment').attr('readonly', true);


          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });

          setTimeout(function() {
            $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
          }, 1000);






          //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
          //$('#edtBankAccountName').val(data.fields.AccountName);
          //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
          $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
          $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }
          $('.fullScreenSpin').css('display', 'none');
        });
      });

    }

    $('#tblSupplierPaymentcard tbody').on('click', 'tr .colType', function() {
      var listData = $(this).closest('tr').attr('id');
      var columnType = $(event.target).text();
      if (listData) {
        if (columnType == "Purchase Order") {
          window.open('/purchaseordercard?id=' + listData, '_self');
        } else if (columnType == "Bill") {
          window.open('/billcard?id=' + listData, '_self');
        } else if (columnType == "Credit") {
          window.open('/creditcard?id=' + listData, '_self');
        }

      }
    });
  } else if (url.indexOf('?poid=') > 0) {
    var getpo_id = url.split('?poid=');
    var currentPOID = getpo_id[getpo_id.length - 1];
    if (getpo_id[1]) {
      currentPOID = parseInt(currentPOID);
      getVS1Data('TPurchaseOrderEx').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
            let lineItems = [];
            let lineItemObj = {};

            let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            //if (data.fields.Lines.length) {
            //for (let i = 0; i < data.fields.Lines.length; i++) {
            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });

            lineItemObj = {
              id: data.fields.ID || '',
              invoiceid: data.fields.ID || '',
              transid: data.fields.ID || '',
              poid: data.fields.ID || '',
              invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
              refno: data.fields.CustPONumber || '',
              transtype: 'Purchase Order' || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount: outstandingAmt,
              orginalamount: originalAmt
            };
            lineItems.push(lineItemObj);

            let record = {
              lid: '',
              customerName: data.fields.ClientName || '',
              paymentDate: begunDate,
              reference: data.fields.CustPONumber || ' ',
              bankAccount: Session.get('bankaccount') || '',
              paymentAmount: appliedAmt || 0,
              notes: data.fields.Comments,
              LineItems: lineItems,
              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
              department: Session.get('department') || data.fields.DeptClassName,
              applied: appliedAmt.toLocaleString(undefined, {
                minimumFractionDigits: 2
              })

            };
            templateObject.record.set(record);
            $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
            $('#edtSupplierName').val(data.fields.ClientName);
            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
            $('#edtBankAccountName').val(record.bankAccount);
            if (clientList) {
              for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].customername == data.fields.SupplierName) {
                  $('#edtSupplierEmail').val(clientList[i].customeremail);
                  $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
              if (error) {

                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $("" + columHeaderUpdate + "").html(columData);
                    if (columnWidth != 0) {
                      $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                    }

                    if (hiddenColumn == true) {
                      $("." + columnClass + "").addClass('hiddenColumn');
                      $("." + columnClass + "").removeClass('showColumn');
                      $(".chk" + columnClass + "").removeAttr('checked');
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass('hiddenColumn');
                      $("." + columnClass + "").addClass('showColumn');
                      $(".chk" + columnClass + "").attr('checked', 'checked');
                    }

                  }
                }

              }
            });
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tpurchaseorderex;
          var added=false;
          for(let d=0; d<useData.length; d++){
            if(parseInt(useData[d].fields.ID) === currentPOID){
              added = true;
              $('.fullScreenSpin').css('display','none');
              let lineItems = [];
        let lineItemObj = {};

        let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        //if (useData[d].fields.Lines.length) {
        //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
        let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });

        lineItemObj = {
          id: useData[d].fields.ID || '',
          invoiceid: useData[d].fields.ID || '',
          transid: useData[d].fields.ID || '',
          poid: useData[d].fields.ID || '',
          invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
          refno: useData[d].fields.CustPONumber || '',
          transtype: 'Purchase Order' || '',
          amountdue: amountDue || 0,
          paymentamount: paymentAmt || 0,
          ouststandingamount: outstandingAmt,
          orginalamount: originalAmt
        };
        lineItems.push(lineItemObj);

        let record = {
          lid: '',
          customerName: useData[d].fields.ClientName || '',
          paymentDate: begunDate,
          reference: useData[d].fields.CustPONumber || ' ',
          bankAccount: Session.get('bankaccount') || '',
          paymentAmount: appliedAmt || 0,
          notes: useData[d].fields.Comments,
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
          department: Session.get('department') || useData[d].fields.DeptClassName,
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })

        };
        templateObject.record.set(record);
        $('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
        $('#edtSupplierName').val(useData[d].fields.ClientName);
        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
        $('#edtBankAccountName').val(record.bankAccount);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == useData[d].fields.SupplierName) {
              $('#edtSupplierEmail').val(clientList[i].customeremail);
              $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
            }

          }

            if(!added) {
              paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
                let lineItems = [];
                let lineItemObj = {};

                let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("DD/MM/YYYY");
                //if (data.fields.Lines.length) {
                //for (let i = 0; i < data.fields.Lines.length; i++) {
                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });

                lineItemObj = {
                  id: data.fields.ID || '',
                  invoiceid: data.fields.ID || '',
                  transid: data.fields.ID || '',
                  poid: data.fields.ID || '',
                  invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                  refno: data.fields.CustPONumber || '',
                  transtype: 'Purchase Order' || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);

                let record = {
                  lid: '',
                  customerName: data.fields.ClientName || '',
                  paymentDate: begunDate,
                  reference: data.fields.CustPONumber || ' ',
                  bankAccount: Session.get('bankaccount') || '',
                  paymentAmount: appliedAmt || 0,
                  notes: data.fields.Comments,
                  LineItems: lineItems,
                  checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                  department: Session.get('department') || data.fields.DeptClassName,
                  applied: appliedAmt.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  })

                };
                templateObject.record.set(record);
                $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                $('#edtSupplierName').val(data.fields.ClientName);
                //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                $('#edtBankAccountName').val(record.bankAccount);
                if (clientList) {
                  for (var i = 0; i < clientList.length; i++) {
                    if (clientList[i].customername == data.fields.SupplierName) {
                      $('#edtSupplierEmail').val(clientList[i].customeremail);
                      $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                      let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                      $('#txabillingAddress').val(postalAddress);
                    }
                  }
                }

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                  if (error) {

                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass;
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                        let columnWidth = customcolumn[i].width;

                        $("" + columHeaderUpdate + "").html(columData);
                        if (columnWidth != 0) {
                          $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                        }

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass('hiddenColumn');
                          $("." + columnClass + "").removeClass('showColumn');
                          $(".chk" + columnClass + "").removeAttr('checked');
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass('hiddenColumn');
                          $("." + columnClass + "").addClass('showColumn');
                          $(".chk" + columnClass + "").attr('checked', 'checked');
                        }

                      }
                    }

                  }
                });
                $('.fullScreenSpin').css('display', 'none');
              });
            }
        }

      }).catch(function (err) {
        paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Purchase Order' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: appliedAmt.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      });

    }
  } else if (url.indexOf('?billid=') > 0) {
    var getpo_id = url.split('?billid=');
    var currentPOID = getpo_id[getpo_id.length - 1];
    if (getpo_id[1]) {
      currentPOID = parseInt(currentPOID);
      getVS1Data('TBillEx').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOneBillPayment(currentPOID).then(function(data) {
            let lineItems = [];
            let lineItemObj = {};

            let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            //if (data.fields.Lines.length) {
            //for (let i = 0; i < data.fields.Lines.length; i++) {
            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });

            lineItemObj = {
              id: data.fields.ID || '',
              invoiceid: data.fields.ID || '',
              transid: data.fields.ID || '',
              poid: data.fields.ID || '',
              invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
              refno: data.fields.CustPONumber || '',
              transtype: 'Bill' || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount: outstandingAmt,
              orginalamount: originalAmt
            };
            lineItems.push(lineItemObj);

            let record = {
              lid: '',
              customerName: data.fields.ClientName || '',
              paymentDate: begunDate,
              reference: data.fields.CustPONumber || ' ',
              bankAccount: Session.get('bankaccount') || '',
              paymentAmount: appliedAmt || 0,
              notes: data.fields.Comments,
              LineItems: lineItems,
              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
              department: Session.get('department') || data.fields.DeptClassName,
              applied: appliedAmt.toLocaleString(undefined, {
                minimumFractionDigits: 2
              })

            };
            templateObject.record.set(record);
            $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
            $('#edtSupplierName').val(data.fields.ClientName);
            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
            $('#edtBankAccountName').val(record.bankAccount);
            if (clientList) {
              for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].customername == data.fields.SupplierName) {
                  $('#edtSupplierEmail').val(clientList[i].customeremail);
                  $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
              if (error) {

                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $("" + columHeaderUpdate + "").html(columData);
                    if (columnWidth != 0) {
                      $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                    }

                    if (hiddenColumn == true) {
                      $("." + columnClass + "").addClass('hiddenColumn');
                      $("." + columnClass + "").removeClass('showColumn');
                      $(".chk" + columnClass + "").removeAttr('checked');
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass('hiddenColumn');
                      $("." + columnClass + "").addClass('showColumn');
                      $(".chk" + columnClass + "").attr('checked', 'checked');
                    }

                  }
                }

              }
            });
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tbillex;
          var added=false;
          for(let d=0; d<useData.length; d++){
            if(parseInt(useData[d].fields.ID) === currentPOID){
              added = true;
              $('.fullScreenSpin').css('display','none');
              let lineItems = [];
        let lineItemObj = {};

        let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        //if (useData[d].fields.Lines.length) {
        //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
        let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });

        lineItemObj = {
          id: useData[d].fields.ID || '',
          invoiceid: useData[d].fields.ID || '',
          transid: useData[d].fields.ID || '',
          poid: useData[d].fields.ID || '',
          invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
          refno: useData[d].fields.CustPONumber || '',
          transtype: 'Bill' || '',
          amountdue: amountDue || 0,
          paymentamount: paymentAmt || 0,
          ouststandingamount: outstandingAmt,
          orginalamount: originalAmt
        };
        lineItems.push(lineItemObj);

        let record = {
          lid: '',
          customerName: useData[d].fields.ClientName || '',
          paymentDate: begunDate,
          reference: useData[d].fields.CustPONumber || ' ',
          bankAccount: Session.get('bankaccount') || '',
          paymentAmount: appliedAmt || 0,
          notes: useData[d].fields.Comments,
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
          department: Session.get('department') || useData[d].fields.DeptClassName,
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })

        };
        templateObject.record.set(record);
        $('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
        $('#edtSupplierName').val(useData[d].fields.ClientName);
        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
        $('#edtBankAccountName').val(record.bankAccount);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == useData[d].fields.SupplierName) {
              $('#edtSupplierEmail').val(clientList[i].customeremail);
              $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
            }
          }
          if(!added) {

          }
        }

      }).catch(function (err) {
        paymentService.getOneBillPayment(currentPOID).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Bill' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: appliedAmt.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      });

    }
  } else if (url.indexOf('?creditid=') > 0) {
    var getpo_id = url.split('?creditid=');
    var currentPOID = getpo_id[getpo_id.length - 1];
    if (getpo_id[1]) {
      currentPOID = parseInt(currentPOID);
      getVS1Data('TCredit').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOneCreditPayment(currentPOID).then(function(data) {
            let lineItems = [];
            let lineItemObj = {};

            let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            //if (data.fields.Lines.length) {
            //for (let i = 0; i < data.fields.Lines.length; i++) {
            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
              minimumFractionDigits: 2
            });

            lineItemObj = {
              id: data.fields.ID || '',
              invoiceid: data.fields.ID || '',
              transid: data.fields.ID || '',
              poid: data.fields.ID || '',
              invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
              refno: data.fields.CustPONumber || '',
              transtype: 'Credit' || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount: outstandingAmt,
              orginalamount: originalAmt
            };
            lineItems.push(lineItemObj);

            let record = {
              lid: '',
              customerName: data.fields.ClientName || '',
              paymentDate: begunDate,
              reference: data.fields.CustPONumber || ' ',
              bankAccount: Session.get('bankaccount') || '',
              paymentAmount: appliedAmt || 0,
              notes: data.fields.Comments,
              LineItems: lineItems,
              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
              department: Session.get('department') || data.fields.DeptClassName,
              applied: appliedAmt.toLocaleString(undefined, {
                minimumFractionDigits: 2
              })

            };
            templateObject.record.set(record);
            $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
            $('#edtSupplierName').val(data.fields.ClientName);
            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
            $('#edtBankAccountName').val(record.bankAccount);
            if (clientList) {
              for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].customername == data.fields.SupplierName) {
                  $('#edtSupplierEmail').val(clientList[i].customeremail);
                  $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
              if (error) {

              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $("" + columHeaderUpdate + "").html(columData);
                    if (columnWidth != 0) {
                      $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                    }

                    if (hiddenColumn == true) {
                      $("." + columnClass + "").addClass('hiddenColumn');
                      $("." + columnClass + "").removeClass('showColumn');
                      $(".chk" + columnClass + "").removeAttr('checked');
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass('hiddenColumn');
                      $("." + columnClass + "").addClass('showColumn');
                      $(".chk" + columnClass + "").attr('checked', 'checked');
                    }

                  }
                }

              }
            });
            $('.fullScreenSpin').css('display', 'none');
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcredit;
          var added=false;
          for(let d=0; d<useData.length; d++){
            if(parseInt(useData[d].fields.ID) === currentPOID){
              added = true;
              $('.fullScreenSpin').css('display','none');
              let lineItems = [];
        let lineItemObj = {};

        let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        //if (useData[d].fields.Lines.length) {
        //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
        let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });

        lineItemObj = {
          id: useData[d].fields.ID || '',
          invoiceid: useData[d].fields.ID || '',
          transid: useData[d].fields.ID || '',
          poid: useData[d].fields.ID || '',
          invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
          refno: useData[d].fields.CustPONumber || '',
          transtype: 'Credit' || '',
          amountdue: amountDue || 0,
          paymentamount: paymentAmt || 0,
          ouststandingamount: outstandingAmt,
          orginalamount: originalAmt
        };
        lineItems.push(lineItemObj);

        let record = {
          lid: '',
          customerName: useData[d].fields.ClientName || '',
          paymentDate: begunDate,
          reference: useData[d].fields.CustPONumber || ' ',
          bankAccount: Session.get('bankaccount') || '',
          paymentAmount: appliedAmt || 0,
          notes: useData[d].fields.Comments,
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
          department: Session.get('department') || useData[d].fields.DeptClassName,
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })

        };
        templateObject.record.set(record);
        $('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
        $('#edtSupplierName').val(useData[d].fields.ClientName);
        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
        $('#edtBankAccountName').val(record.bankAccount);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == useData[d].fields.SupplierName) {
              $('#edtSupplierEmail').val(clientList[i].customeremail);
              $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
            }
          }
          if(!added) {

          }
        }
      }).catch(function (err) {
        paymentService.getOneCreditPayment(currentPOID).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Credit' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: appliedAmt.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      });

    }
  } else if ((url.indexOf('?suppname=') > 0) && (url.indexOf('from=') > 0)) {
    var getsale_custname = url.split('?suppname=');
    var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");

    var getsale_salesid = url.split('from=');
    var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];

    if (getsale_custname[1]) {
      let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
      // let currentSalesID = currentSalesURL[1].split('from=');
      paymentService.getSupplierPaymentByName(currentSalesName).then(function(data) {
        let lineItems = [];
        let lineItemObj = {};
        let companyName = '';
        let referenceNo = '';
        let paymentMethodName = '';
        let accountName = '';
        let notes = '';
        let paymentdate = '';
        let checkpayment = '';
        let department = '';
        let appliedAmt = 0;

        for (let i = 0; i < data.tsupplierpayment.length; i++) {
          if (data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length) {
            for (let j = 0; j < data.tsupplierpayment[i].fields.Lines.length; j++) {
              if (data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID) {
                companyName = data.tsupplierpayment[i].fields.CompanyName;
                referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                accountName = data.tsupplierpayment[i].fields.AccountName;
                notes = data.tsupplierpayment[i].fields.Notes;
                paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                checkpayment = data.tsupplierpayment[i].fields.Payment;
                department = data.tsupplierpayment[i].fields.DeptClassName;
                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });



                lineItemObj = {
                  id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
                  invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines[j].fields.Date,
                  refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
                  transtype: "Purchase order" || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);
              } else {

              }

            }
          }
        }
        let record = {
          lid: '',
          customerName: companyName || '',
          paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
          reference: referenceNo || ' ',
          bankAccount: Session.get('bankaccount') || accountName || '',
          paymentAmount: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          }) || 0,
          notes: notes || '',
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || checkpayment || '',
          department: Session.get('department') || department || '',
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          }) || 0

        };

        $('#edtSupplierName').val(companyName);
        $('#edtBankAccountName').val(record.bankAccount);

        templateObject.record.set(record);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == companyName) {
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  } else if ((url.indexOf('?bsuppname=') > 0) && (url.indexOf('from=') > 0)) {
    var getsale_custname = url.split('?bsuppname=');
    var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");

    var getsale_salesid = url.split('from=');
    var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];

    if (getsale_custname[1]) {
      let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
      // let currentSalesID = currentSalesURL[1].split('from=');
      paymentService.getSupplierPaymentByName(currentSalesName).then(function(data) {
        let lineItems = [];
        let lineItemObj = {};
        let companyName = '';
        let suppPaymentID = '';
        let referenceNo = '';
        let paymentMethodName = '';
        let accountName = '';
        let notes = '';
        let paymentdate = '';
        let checkpayment = '';
        let department = '';
        let appliedAmt = 0;

        for (let i = 0; i < data.tsupplierpayment.length; i++) {
          if (data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length) {
            for (let j = 0; j < data.tsupplierpayment[i].fields.Lines.length; j++) {
              if (data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID) {
                companyName = data.tsupplierpayment[i].fields.CompanyName;
                suppPaymentID = data.tsupplierpayment[i].fields.ID;
                referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                accountName = data.tsupplierpayment[i].fields.AccountName;
                notes = data.tsupplierpayment[i].fields.Notes;
                paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                checkpayment = data.tsupplierpayment[i].fields.Payment;
                department = data.tsupplierpayment[i].fields.DeptClassName;
                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });



                lineItemObj = {
                  id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
                  transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                  invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines[j].fields.Date,
                  refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
                  transtype: "Bill" || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);
              } else {

              }

            }
          }else{
            if (data.tsupplierpayment[i].fields.Lines.fields.TransNo == currentSalesID) {
                companyName = data.tsupplierpayment[i].fields.CompanyName;
                suppPaymentID = data.tsupplierpayment[i].fields.ID;
                referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                accountName = data.tsupplierpayment[i].fields.AccountName;
                notes = data.tsupplierpayment[i].fields.Notes;
                paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                checkpayment = data.tsupplierpayment[i].fields.Payment;
                department = data.tsupplierpayment[i].fields.DeptClassName;
                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.Payment.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });



                lineItemObj = {
                  id: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                  invoiceid: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                  poid: data.tsupplierpayment[i].fields.Lines.fields.POID || '',
                  transid: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                  invoicedate: data.tsupplierpayment[i].fields.Lines.fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines.fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines.fields.Date,
                  refno: data.tsupplierpayment[i].fields.Lines.fields.RefNo || '',
                  transtype: "Bill" || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount: outstandingAmt,
                  orginalamount: originalAmt
                };
                lineItems.push(lineItemObj);
              } else {

              }
          }
        }
        let record = {
          lid: suppPaymentID,
          customerName: companyName || '',
          paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
          reference: referenceNo || ' ',
          bankAccount: Session.get('bankaccount') || accountName || '',
          paymentAmount: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          }) || 0,
          notes: notes || '',
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || checkpayment || '',
          department: Session.get('department') || department || '',
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          }) || 0

        };

        $('#edtSupplierName').val(companyName);
        $('#edtBankAccountName').val(record.bankAccount);

        templateObject.record.set(record);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == companyName) {
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  } else if ((url.indexOf('?suppcreditname=') > 0) && (url.indexOf('pocreditid=') > 0)) {
    var getsale_custname = url.split('?suppcreditname=');
    var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");
    let totalPaymentAmount = 0;
    let totalCreditAmt = 0;
    let totalGrandAmount = 0;
    var getsale_salesid = url.split('pocreditid=');
    let lineItems = [];
    let lineItemObj = {};
    var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];
    if (currentSalesID) {
      currentPOID = parseInt(currentSalesID);
      paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {


        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
          minimumFractionDigits: 2
        });
        totalPaymentAmount = data.fields.TotalBalance;
        lineItemObj = {
          id: data.fields.ID || '',
          invoiceid: data.fields.ID || '',
          transid: data.fields.ID || '',
          poid: data.fields.ID || '',
          invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
          refno: data.fields.CustPONumber || '',
          transtype: 'Purchase Order' || '',
          amountdue: amountDue || 0,
          paymentamount: paymentAmt || 0,
          ouststandingamount: outstandingAmt,
          orginalamount: originalAmt
        };
        lineItems.push(lineItemObj);

        let record = {
          lid: '',
          customerName: data.fields.ClientName || '',
          paymentDate: begunDate,
          reference: data.fields.CustPONumber || ' ',
          bankAccount: Session.get('bankaccount') || '',
          paymentAmount: appliedAmt || 0,
          notes: data.fields.Comments,
          LineItems: lineItems,
          checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
          department: Session.get('department') || data.fields.DeptClassName,
          applied: appliedAmt.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })

        };
        templateObject.record.set(record);
        $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
        $('#edtSupplierName').val(data.fields.ClientName);
        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
        $('#edtBankAccountName').val(record.bankAccount);
        if (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            if (clientList[i].customername == data.fields.SupplierName) {
              $('#edtSupplierEmail').val(clientList[i].customeremail);
              $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
          if (error) {

          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $("" + columHeaderUpdate + "").html(columData);
                if (columnWidth != 0) {
                  $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                }

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass('hiddenColumn');
                  $("." + columnClass + "").removeClass('showColumn');
                  $(".chk" + columnClass + "").removeAttr('checked');
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass('hiddenColumn');
                  $("." + columnClass + "").addClass('showColumn');
                  $(".chk" + columnClass + "").attr('checked', 'checked');
                }

              }
            }

          }
        });
        $('.fullScreenSpin').css('display', 'none');
        if (currentSalesURL) {
          let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
          paymentService.getCreditPaymentByName(currentSalesName).then(function(creditdata) {
            for (let i = 0; i < creditdata.tcredit.length; i++) {
              totalCreditAmt += creditdata.tcredit[i].fields.TotalBalance;
              if (creditdata.tcredit[i].fields.Lines && creditdata.tcredit[i].fields.Lines.length) {
                //for(let j=0;j< creditdata.tcredit[i].fields.Lines.length;j++){
                let amountDueCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let paymentAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let outstandingAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });
                let originalAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalAmountInc).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                });

                lineItemObj = {
                  id: creditdata.tcredit[i].fields.ID || '',
                  invoiceid: creditdata.tcredit[i].fields.ID || '',
                  poid: creditdata.tcredit[i].fields.ID || '',
                  transid: creditdata.tcredit[i].fields.ID || '',
                  invoicedate: creditdata.tcredit[i].fields.OrderDate != '' ? moment(creditdata.tcredit[i].fields.OrderDate).format("DD/MM/YYYY") : creditdata.tcredit[i].fields.OrderDate,
                  refno: creditdata.tcredit[i].fields.RefNo || '',
                  transtype: "Credit" || '',
                  amountdue: amountDueCredit || 0,
                  paymentamount: paymentAmtCredit || 0,
                  ouststandingamount: outstandingAmtCredit,
                  orginalamount: originalAmtCredit
                };
                lineItems.push(lineItemObj);
                //  }

              }
            }

            totalGrandAmount = parseFloat(totalPaymentAmount) - parseFloat(totalCreditAmt);
            let record = {
              lid: '',
              customerName: data.fields.ClientName || '',
              paymentDate: begunDate,
              reference: data.fields.CustPONumber || ' ',
              bankAccount: Session.get('bankaccount') || '',
              paymentAmount: utilityService.modifynegativeCurrencyFormat(totalGrandAmount) || 0,
              notes: data.fields.Comments,
              LineItems: lineItems,
              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
              department: Session.get('department') || data.fields.DeptClassName,
              applied: utilityService.modifynegativeCurrencyFormat(totalGrandAmount) || 0

            };
            templateObject.record.set(record);

            //

          });

        }


      });
    }



    // if(getsale_custname[1]){
    //   let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
    //
    //   paymentService.getSupplierPaymentByName(currentSalesName).then(function (data) {
    //   let lineItems = [];
    //   let lineItemObj = {};
    //   let companyName = '';
    //   let referenceNo = '';
    //   let paymentMethodName = '';
    //   let accountName = '';
    //   let notes = '';
    //   let paymentdate = '';
    //   let checkpayment = '';
    //   let department = '';
    //   let appliedAmt = 0;
    //
    //   for(let i=0;i<data.tsupplierpayment.length;i++){
    //       if(data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length){
    //         for(let j=0;j< data.tsupplierpayment[i].fields.Lines.length;j++){
    //           if(data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID ){
    //              companyName = data.tsupplierpayment[i].fields.CompanyName;
    //              referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
    //              paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
    //              accountName = data.tsupplierpayment[i].fields.AccountName;
    //              notes = data.tsupplierpayment[i].fields.Notes;
    //              paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
    //              checkpayment = data.tsupplierpayment[i].fields.Payment;
    //              department = data.tsupplierpayment[i].fields.DeptClassName;
    //              appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});
    //              templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);
    //
    //             let amountDue = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
    //             let paymentAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
    //             let outstandingAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
    //             let originalAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
    //
    //
    //
    //             lineItemObj = {
    //                 id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
    //                 invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
    //                 poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
    //                 transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
    //                 invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date !=''? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY"): data.tsupplierpayment[i].fields.Lines[j].fields.Date,
    //                 refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
    //                 transtype: "Bill" || '',
    //                 amountdue: amountDue || 0,
    //                 paymentamount: paymentAmt || 0,
    //                 ouststandingamount:outstandingAmt,
    //                 orginalamount:originalAmt
    //             };
    //             lineItems.push(lineItemObj);
    //           }else{
    //
    //           }
    //
    //       }
    //       }
    //   }
    //   let record = {
    //       lid:'',
    //       customerName: companyName || '',
    //       paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
    //       reference: referenceNo || ' ',
    //       bankAccount: Session.get('bankaccount') || accountName || '',
    //       paymentAmount: appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})  || 0,
    //       notes: notes || '',
    //       LineItems:lineItems,
    //       checkpayment: Session.get('paymentmethod') ||checkpayment ||'',
    //       department: Session.get('department') || department ||'',
    //       applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0
    //
    //   };
    //
    //   $('#edtSupplierName').val(companyName);
    //   $('#edtBankAccountName').val(record.bankAccount);
    //
    //   templateObject.record.set(record);
    //   if(clientList){
    //     for (var i = 0; i < clientList.length; i++) {
    //       if(clientList[i].customername == companyName){
    //         $('#edtCustomerEmail').val(clientList[i].customeremail);
    //         $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
    //       }
    //     }
    //   }
    //
    //   Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSupplierPaymentcard', function(error, result){
    //     if(error){
    //
    //   }else{
    //     if(result){
    //       for (let i = 0; i < result.customFields.length; i++) {
    //         let customcolumn = result.customFields;
    //         let columData = customcolumn[i].label;
    //         let columHeaderUpdate = customcolumn[i].thclass;
    //         let hiddenColumn = customcolumn[i].hidden;
    //         let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
    //         let columnWidth = customcolumn[i].width;
    //
    //         $(""+columHeaderUpdate+"").html(columData);
    //         if(columnWidth != 0){
    //           $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
    //         }
    //
    //         if(hiddenColumn == true){
    //           $("."+columnClass+"").addClass('hiddenColumn');
    //           $("."+columnClass+"").removeClass('showColumn');
    //           $(".chk"+columnClass+"").removeAttr('checked');
    //         }else if(hiddenColumn == false){
    //           $("."+columnClass+"").removeClass('hiddenColumn');
    //           $("."+columnClass+"").addClass('showColumn');
    //           $(".chk"+columnClass+"").attr('checked','checked');
    //         }
    //
    //       }
    //     }
    //
    //   }
    //   });
    //       $('.fullScreenSpin').css('display','none');
    //     });
    // }
  } else if (url.indexOf('?selectsupppo=') > 0) {
    var getpo_id = url.split('?selectsupppo=');
    var getbill_id = url.split('&selectsuppbill=');
    var getcredit_id = url.split('&selectsuppcredit=');
    let lineItems = [];
    let lineItemObj = {};
    let amountData = 0;
    if (getpo_id[1]) {
      var currentPOID = getpo_id[getpo_id.length - 1];
      var arr = currentPOID.split(',');
      for (let i = 0; i < arr.length; i++) {
        currentPOID = parseInt(arr[i]);
        if (!isNaN(currentPOID)) {
        paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {


          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          amountData = amountData + data.fields.TotalBalance;
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Purchase Order' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
        }
      }
    }
    if (getbill_id[1]) {
      var currentBillID = getbill_id[getbill_id.length - 1];
      var arrBill = currentBillID.split(',');
      for (let i = 0; i < arrBill.length; i++) {
        currentBillID = parseInt(arrBill[i]);
        if (!isNaN(currentBillID)) {
        paymentService.getOneBillPayment(currentBillID).then(function(data) {


          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          amountData = amountData + data.fields.TotalBalance;
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Bill' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      }
      }
    }
    if (getcredit_id[1]) {
      var currentCreditID = getcredit_id[getcredit_id.length - 1];
      var arrcredit = currentCreditID.split(',');
      for (let i = 0; i < arrcredit.length; i++) {
        currentCreditID = parseInt(arrcredit[i]);
      if (!isNaN(currentCreditID)) {
        paymentService.getOneCreditPayment(currentCreditID).then(function(data) {


          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          amountData = amountData + data.fields.TotalDiscount;
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });

          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Credit' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      }
      }
    }
  } else if (url.indexOf('?selectsuppb=') > 0) {
    var getpo_id = url.split('?selectsuppb=');
    var currentPOID = getpo_id[getpo_id.length - 1];
    if (getpo_id[1]) {
      let lineItems = [];
      let lineItemObj = {};
      let amountData = 0;
      var arr = currentPOID.split(',');
      for (let i = 0; i < arr.length; i++) {
        currentPOID = parseInt(arr[i]);
        paymentService.getOneBillPayment(currentPOID).then(function(data) {

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          //if (data.fields.Lines.length) {
          //for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
            minimumFractionDigits: 2
          });
          amountData = amountData + data.fields.TotalBalance;
          lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            poid: data.fields.ID || '',
            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
            refno: data.fields.CustPONumber || '',
            transtype: 'Bill' || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount: outstandingAmt,
            orginalamount: originalAmt
          };
          lineItems.push(lineItemObj);

          let record = {
            lid: '',
            customerName: data.fields.ClientName || '',
            paymentDate: begunDate,
            reference: data.fields.CustPONumber || ' ',
            bankAccount: Session.get('bankaccount') || '',
            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
            notes: data.fields.Comments,
            LineItems: lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

          };
          templateObject.record.set(record);
          $('#edtSupplierName').editableSelect('add', data.fields.ClientName);
          $('#edtSupplierName').val(data.fields.ClientName);
          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
          $('#edtBankAccountName').val(record.bankAccount);
          if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
              if (clientList[i].customername == data.fields.SupplierName) {
                $('#edtSupplierEmail').val(clientList[i].customeremail);
                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {} else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $("" + columHeaderUpdate + "").html(columData);
                  if (columnWidth != 0) {
                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                  }

                  if (hiddenColumn == true) {
                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                    $(".chk" + columnClass + "").removeAttr('checked');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                    $(".chk" + columnClass + "").attr('checked', 'checked');
                  }

                }
              }

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      }
    }
  }

  exportSalesToPdf = function() {
    let margins = {
      top: 0,
      bottom: 0,
      left: 0,
      width: 100
    };
      let id = $('.printID').attr("id");
    var pdf = new jsPDF('p', 'pt', 'a4');

    pdf.setFontSize(18);
    var source = document.getElementById('html-2-pdfwrapper');
    pdf.addHTML(source, function() {
      pdf.save('Supplier Payment '+id+'.pdf');
      $('#html-2-pdfwrapper').css('display', 'none');
    });
  };


  $('#tblSupplierPaymentcard tbody').on('click', 'tr .colType', function() {
    var listData = $(this).closest('tr').attr('id');
    var columnType = $(event.target).text();
    if (listData) {
      if (columnType == "Purchase Order") {
        window.open('/purchaseordercard?id=' + listData, '_self');
      } else if (columnType == "Bill") {
        window.open('/billcard?id=' + listData, '_self');
      } else if (columnType == "Credit") {
        window.open('/creditcard?id=' + listData, '_self');
      }

    }
  });

});


Template.supplierpaymentcard.helpers({
  record: () => {
    return Template.instance().record.get();
  },
  deptrecords: () => {
    return Template.instance().deptrecords.get().sort(function(a, b) {
      if (a.department == 'NA') {
        return 1;
      } else if (b.department == 'NA') {
        return -1;
      }
      return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
    });
  },
  paymentmethodrecords: () => {
    return Template.instance().paymentmethodrecords.get().sort(function(a, b) {
      if (a.paymentmethod == 'NA') {
        return 1;
      } else if (b.paymentmethod == 'NA') {
        return -1;
      }
      return (a.paymentmethod.toUpperCase() > b.paymentmethod.toUpperCase()) ? 1 : -1;
    });
  },
  accountnamerecords: () => {
    return Template.instance().accountnamerecords.get().sort(function(a, b) {
      if (a.accountname == 'NA') {
        return 1;
      } else if (b.accountname == 'NA') {
        return -1;
      }
      return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
    });
  },
  currentDate: () => {
    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    return begunDate;
  },
  salesCloudGridPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: Session.get('mycloudLogonID'),
      PrefName: 'tblSupplierPaymentcard'
    });
  },
  companyaddress1: () => {
    return Session.get('vs1companyaddress1');
  },
  companyaddress2: () => {
    return Session.get('vs1companyaddress2');
  },
  companyphone: () => {
    return Session.get('vs1companyPhone');
  },
  companyabn: () => {
    return Session.get('vs1companyABN');
  },
  organizationname: () => {
    return Session.get('vs1companyName');
  },
  organizationurl: () => {
    return Session.get('vs1companyURL');
  }
});

Template.supplierpaymentcard.events({
  'click .btnSave': function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();

    let paymentService = new PaymentsService();
    let customer = $("#edtSupplierName").val();
    let paymentAmt = $("#edtPaymentAmount").val();
    var paymentDateTime = new Date($("#dtPaymentDate").datepicker("getDate"));
    let paymentDate = paymentDateTime.getFullYear() + "-" + (paymentDateTime.getMonth() + 1) + "-" + paymentDateTime.getDate();

    let bankAccount = $("#edtBankAccountName").val() || "Bank";
    let reference = $("#edtReference").val();
    let payMethod = $("#sltPaymentMethod").val();
    let notes = $("#txaNotes").val();
    let customerEmail = $("#edtSupplierEmail").val();
    if (payMethod == '') {
      payMethod = "Cash";
    }
    let department = $("#sltDepartment").val();
    let empName = localStorage.getItem('mySession');
    let paymentData = [];
    Session.setPersistent('paymentmethod', payMethod);
    Session.setPersistent('bankaccount', bankAccount);
    Session.setPersistent('department', department);
    var url = window.location.href;
    if ((url.indexOf('?id=') > 0)) {
      var getsale_id = url.split('?id=');
      var currentSalesID = getsale_id[getsale_id.length - 1];
      let paymentID = parseInt(currentSalesID);;
      // currentSalesID = parseInt(currentSalesID);
      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }

      });
      let objDetails = {
        type: "TSuppPayments",
        fields: {
          ID: paymentID,
          Deleted: false,
          Notes: notes,
          ReferenceNo: reference
        }
      };

      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');

        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'Supplier Payment ' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //Router.go('/paymentoverview?success=true');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //Router.go('/paymentoverview?success=true');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //Router.go('/paymentoverview?success=true');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //Router.go('/paymentoverview?success=true');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //Router.go('/paymentoverview?success=true');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //Router.go('/paymentoverview?success=true');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //Router.go('/paymentoverview?success=true');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //Router.go('/paymentoverview?success=true');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierpayment','_self');
        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {
              window.open('/supplierpayment','_self');
            }).catch(function (err) {
              window.open('/supplierpayment','_self');
            });
          }).catch(function (err) {
            window.open('/supplierpayment','_self');
          });
        //window.history.go(-2);
      }).catch(function(err) {
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        //window.open('/supplierpayment','_self');
        //window.history.go(-2);
        //Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?poid=') > 0)) {
      var getsale_id = url.split('?poid=');
      var currentSalesID = getsale_id[getsale_id.length - 1];
      let paymentID = parseInt(currentSalesID);;


      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });
      let objDetails = '';
      if(paymentData.length === 0){
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: 'Ooops...',
          text: 'There is no amount due for payment. A payment amount cannot be applied',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });

        return false;
      }else{
        objDetails = {
         type: "TSuppPayments",
         fields: {
           ID: 0,
           // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
           // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
           Deleted: false,
           AccountName: bankAccount,
           ClientPrintName: customer,
           CompanyName: customer,
           DeptClassName: department,
           //ForeignExchangeCode: CountryAbbr,
           //ForeignExchangeRate: 1,
           // EmployeeName: empName || ' ',
           GUILines: paymentData,
           Notes: notes,
           Payment: true,
           PaymentDate: paymentDate,
           PayMethodName: payMethod,

           ReferenceNo: reference
         }
       };
      }



      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                    //  window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierawaitingpurchaseorder','_self');
        sideBarService.getAllPurchaseOrderList().then(function (dataUpdate) {
          addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
          }).catch(function (err) {

          });
        }).catch(function (err) {

        });

        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });

        sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate) {
       addVS1Data('TbillReport', JSON.stringify(dataUpdate)).then(function (datareturn) {
         window.open('/supplierawaitingpurchaseorder','_self');
       }).catch(function (err) {
         window.open('/supplierawaitingpurchaseorder','_self');
       });
     }).catch(function (err) {
       window.open('/supplierawaitingpurchaseorder','_self');
     });


      }).catch(function(err) {
        //window.open('/paymentoverview','_self');
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?billid=') > 0)) {
      var getsale_id = url.split('?billid=');
      var currentSalesID = getsale_id[getsale_id.length - 1];
      let paymentID = parseInt(currentSalesID);;


      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });

      let objDetails = '';
      if(paymentData.length === 0){
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: 'Ooops...',
          text: 'There is no amount due for payment. A payment amount cannot be applied',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });

        return false;
      }else{
         objDetails = {
          type: "TSuppPayments",
          fields: {
            // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
            // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
            ID: 0,
            Deleted: false,
            AccountName: bankAccount,
            ClientPrintName: customer,
            CompanyName: customer,
            DeptClassName: department,
            // EmployeeName: empName || ' ',
            GUILines: paymentData,
            Notes: notes,
            Payment: true,
            PaymentDate: paymentDate,
            PayMethodName: payMethod,

            ReferenceNo: reference
          }
        };
      }


      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierawaitingpurchaseorder','_self');
        sideBarService.getAllBillExList().then(function (dataUpdate) {
          addVS1Data('TBillEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
          }).catch(function (err) {

          });
        }).catch(function (err) {

        });

        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });

        sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate) {
           addVS1Data('TbillReport', JSON.stringify(dataUpdate)).then(function (datareturn) {
             window.open('/supplierawaitingpurchaseorder','_self');
           }).catch(function (err) {
             window.open('/supplierawaitingpurchaseorder','_self');
           });
         }).catch(function (err) {
           window.open('/supplierawaitingpurchaseorder','_self');
         });

        //window.history.go(-2);
      }).catch(function(err) {
        //window.open('/supplierawaitingpurchaseorder','_self');
        //window.history.go(-2);
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }else if ((url.indexOf('?creditid=') > 0)) {
      var getsale_id = url.split('?creditid=');
      var currentSalesID = getsale_id[getsale_id.length - 1];
      let paymentID = parseInt(currentSalesID);;

      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });

      let objDetails = '';
      if(paymentData.length === 0){
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: 'Ooops...',
          text: 'There is no amount due for payment. A payment amount cannot be applied',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });

        return false;
      }else{
         objDetails = {
          type: "TSuppPayments",
          fields: {
            ID: 0,
            Deleted: false,
            AccountName: bankAccount,
            ClientPrintName: customer,
            CompanyName: customer,
            DeptClassName: department,
            GUILines: paymentData,
            Notes: notes,
            Payment: true,
            PayMethodName: payMethod,
            ReferenceNo: reference
          }
        };
      }


      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's bill " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierawaitingpurchaseorder','_self');
        sideBarService.getAllCreditList().then(function (dataUpdate) {
          addVS1Data('TCredit', JSON.stringify(dataUpdate)).then(function (datareturn) {
          }).catch(function (err) {

          });
        }).catch(function (err) {

        });

        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });

        sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate) {
           addVS1Data('TbillReport', JSON.stringify(dataUpdate)).then(function (datareturn) {
             window.open('/supplierawaitingpurchaseorder','_self');
           }).catch(function (err) {
             window.open('/supplierawaitingpurchaseorder','_self');
           });
         }).catch(function (err) {
           window.open('/supplierawaitingpurchaseorder','_self');
         });
        //window.history.go(-2);
      }).catch(function(err) {
        //window.open('/supplierawaitingpurchaseorder','_self');
        //window.history.go(-2);
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?suppname=') > 0) && (url.indexOf('from=') > 0)) {
      let paymentID = templateObject.supppaymentid.get();
      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });

      let objDetails = '';
      if(paymentData.length === 0){
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: 'Ooops...',
          text: 'There is no amount due for payment. A payment amount cannot be applied',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });

        return false;
      }else{
         objDetails = {
          type: "TSuppPayments",
          fields: {
            ID: paymentID,
            Amount: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            Applied: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            Deleted: false,
            AccountName: bankAccount,
            ClientPrintName: customer,
            CompanyName: customer,
            DeptClassName: department,
            // ForeignExchangeCode: CountryAbbr,
            // ForeignExchangeRate: 1,
            // EmployeeName: empName || ' ',
            GUILines: paymentData,
            Notes: notes,
            Payment: true,
            PaymentDate: paymentDate,
            PayMethodName: payMethod,

            ReferenceNo: reference
          }
        };
      }


      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');

        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierawaitingpurchaseorder','_self');
        sideBarService.getAllPurchaseOrderList().then(function (dataUpdate) {
            addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
            }).catch(function (err) {

            });
          }).catch(function (err) {

          });

        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });

        sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate) {
           addVS1Data('TbillReport', JSON.stringify(dataUpdate)).then(function (datareturn) {
             window.open('/supplierawaitingpurchaseorder','_self');
           }).catch(function (err) {
             window.open('/supplierawaitingpurchaseorder','_self');
           });
         }).catch(function (err) {
           window.open('/supplierawaitingpurchaseorder','_self');
         });
        //window.history.go(-2);
      }).catch(function(err) {
        //window.history.go(-2);
        //window.open('/supplierawaitingpurchaseorder','_self');
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?suppcreditname=') > 0) && (url.indexOf('pocreditid=') > 0)) {

      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
          paymentData.push(Line);
        }

      });

      let objDetails = '';
        if(paymentData.length === 0){
          $('.fullScreenSpin').css('display', 'none');
          swal({
            title: 'Ooops...',
            text: 'There is no amount due for payment. A payment amount cannot be applied',
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
          });

          return false;
        }else{
       objDetails = {
        type: "TSuppPayments",
        fields: {
          ID: 0,
          // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          Deleted: false,
          AccountName: bankAccount,
          ClientPrintName: customer,
          CompanyName: customer,
          DeptClassName: department,
          // ForeignExchangeCode: CountryAbbr,
          // ForeignExchangeRate: 1,
          // EmployeeName: empName || ' ',
          GUILines: paymentData,
          Notes: notes,
          Payment: true,
          PaymentDate: paymentDate,
          PayMethodName: payMethod,

          ReferenceNo: reference
        }
      };
    }


      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierpayment', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierpayment', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierpayment', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierpayment', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierpayment', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                //  window.open('/supplierpayment', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierpayment', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierpayment', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }

        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierpayment','_self');
        sideBarService.getAllPurchaseOrderList().then(function (dataUpdate) {
          sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
              addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

              }).catch(function (err) {

              });
            }).catch(function (err) {

            });

            addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
              sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate) {
                 addVS1Data('TbillReport', JSON.stringify(dataUpdate)).then(function (datareturn) {
                   window.open('/supplierpayment','_self');
                 }).catch(function (err) {
                   window.open('/supplierpayment','_self');
                 });
               }).catch(function (err) {
                 window.open('/supplierpayment','_self');
               });
            }).catch(function (err) {
                window.open('/supplierpayment','_self');
            });
          }).catch(function (err) {
            window.open('/supplierpayment','_self');
          });




      }).catch(function(err) {
        //window.open('/paymentoverview','_self');
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?selectsupppo=') > 0)) {
      var getsale_id = url.split('?selectsupp=');
      var currentSalesID = getsale_id[getsale_id.length - 1];

      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });

      let objDetails = '';
      if(paymentData.length === 0){
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: 'Ooops...',
          text: 'There is no amount due for payment. A payment amount cannot be applied',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });

        return false;
      }else{
       objDetails = {
        type: "TSuppPayments",
        fields: {
          ID: 0,
          Deleted: false,
          AccountName: bankAccount,
          ClientPrintName: customer,
          CompanyName: customer,
          DeptClassName: department,
          GUILines: paymentData,
          Notes: notes,
          Payment: true,
          PaymentDate: paymentDate,
          PayMethodName: payMethod,

          ReferenceNo: reference
        }
      };

    }


      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
            //  window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }

        };
        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });
          sideBarService.getAllPurchaseOrderList().then(function (dataUpdate) {
          addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
            sideBarService.getAllPurchaseOrderListAll().then(function (dataUpdate2) {
               addVS1Data('TbillReport', JSON.stringify(dataUpdate2)).then(function (datareturn) {
                 window.open('/supplierpayment','_self');
               }).catch(function (err) {
                 window.open('/supplierpayment','_self');
               });
             }).catch(function (err) {
               window.open('/supplierpayment','_self');
             });
          }).catch(function (err) {
              window.open('/supplierpayment','_self');
          });
        }).catch(function (err) {
          window.open('/supplierpayment','_self');
        });
      }).catch(function(err) {
        //window.open('/paymentoverview','_self');
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    } else if ((url.indexOf('?selectsuppb=') > 0)) {
      var getsale_id = url.split('?selectsuppb=');
      var currentSalesID = getsale_id[getsale_id.length - 1];
      // let paymentID = parseInt(currentSalesID);;


      $('.tblSupplierPaymentcard > tbody > tr').each(function() {
        var lineID = this.id;
        let linetype = $('#' + lineID + " .colType").text();
        let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
        let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
        let Line = {
          type: 'TGuiSuppPaymentLines',
          fields: {
            TransType: linetype,
            TransID: parseInt(lineID),
            Paid: true,
            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
            //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          }
        };
        if(parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0){
          paymentData.push(Line);
        }
      });

      let objDetails = '';
        if(paymentData.length === 0){
          $('.fullScreenSpin').css('display', 'none');
          swal({
            title: 'Ooops...',
            text: 'There is no amount due for payment. A payment amount cannot be applied',
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
          });

          return false;
        }else{
       objDetails = {
        type: "TSuppPayments",
        fields: {
          // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
          ID: 0,
          Deleted: false,
          AccountName: bankAccount,
          ClientPrintName: customer,
          CompanyName: customer,
          DeptClassName: department,
          // EmployeeName: empName || ' ',
          GUILines: paymentData,
          Notes: notes,
          Payment: true,
          PaymentDate: paymentDate,
          PayMethodName: payMethod,

          ReferenceNo: reference
        }
      };
    }
      paymentService.saveSuppDepositData(objDetails).then(function(data) {
        var customerID = $('#edtSupplierEmail').attr('customerid');
        // Start End Send Email
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierEmail').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
          let attachment = [];
          let templateObject = Template.instance();

          let invoiceId = objDetails.fields.ID;
          let encodedPdf = await generatePdfForMail(invoiceId);
          let pdfObject = "";
          var reader = new FileReader();
          reader.readAsDataURL(encodedPdf);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(',')[1];

            pdfObject = {
              filename: 'supplierpayment-' + invoiceId + '.pdf',
              content: base64data,
              encoding: 'base64'
            };
            attachment.push(pdfObject);

            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = Session.get('vs1companyName');
            let mailFrom = localStorage.getItem('mySession');
            let customerEmailName = $('#edtSupplierName').val();
            let checkEmailData = $('#edtSupplierEmail').val();
            // let mailCC = templateObject.mailCopyToUsr.get();
            let grandtotal = $('#grandTotal').html();
            let amountDueEmail = $('#totalBalanceDue').html();
            let emailDueDate = $("#dtDueDate").val();
            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
            let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
              "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
              "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '    <tr>' +
              '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
              '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td style="padding: 40px 30px 40px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
              '                        Hello there <span>' + customerEmailName + '</span>,' +
              '                    </td>' +
              '                </tr>' +
              '                <tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
              '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
              '                    </td>' +
              '                </tr>' +
              '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
              '                        Kind regards,' +
              '                        <br>' +
              '                        ' + mailFromName + '' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '    <tr>' +
              '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
              '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
              '                <tr>' +
              '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
              '                        If you have any question, please do not hesitate to contact us.' +
              '                    </td>' +
              '                    <td align="right">' +
              '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
              '                    </td>' +
              '                </tr>' +
              '            </table>' +
              '        </td>' +
              '    </tr>' +
              '</table>';

            if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {

                }
              });

              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                //  window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailCopy').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');

                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else if (($('.chkEmailRep').is(':checked'))) {
              Meteor.call('sendEmail', {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: '',
                html: htmlmailBody,
                attachments: attachment
              }, function(error, result) {
                if (error && error.error === "error") {
                  //window.open('/supplierawaitingpurchaseorder', '_self');
                } else {
                  $('#html-2-pdfwrapper').css('display', 'none');
                  swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      //window.open('/supplierawaitingpurchaseorder', '_self');
                    } else if (result.dismiss === 'cancel') {

                    }
                  });

                  $('.fullScreenSpin').css('display', 'none');
                }
              });

            } else {
              //window.open('/supplierawaitingpurchaseorder', '_self');
            };
          };
        }
        addAttachment();

        function generatePdfForMail(invoiceId) {
          return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            // let data = templateObject.singleInvoiceData.get();
            let completeTabRecord;
            let doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontSize(18);
            var source = document.getElementById('html-2-pdfwrapper');
            doc.addHTML(source, function() {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
            });
          });
        }
        // End Send Email
        if (customerID !== " ") {
          let customerEmailData = {
            type: "TSupplier",
            fields: {
              ID: customerID,
              Email: customerEmail
            }
          }
          // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        // $('.fullScreenSpin').css('display','none');
        // window.open('/supplierawaitingpurchaseorder','_self');

        sideBarService.getTSupplierPaymentList().then(function (dataUpdate) {
            addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function (err) {

          });
        sideBarService.getAllBillExList().then(function (dataUpdate) {
          addVS1Data('TBillEx', JSON.stringify(dataUpdate)).then(function (datareturn) {
            sideBarService.getAllBillExList().then(function (dataUpdate2) {
               addVS1Data('TbillReport', JSON.stringify(dataUpdate2)).then(function (datareturn) {
                 window.open('/supplierawaitingpurchaseorder','_self');
               }).catch(function (err) {
                 window.open('/supplierawaitingpurchaseorder','_self');
               });
             }).catch(function (err) {
               window.open('/supplierawaitingpurchaseorder','_self');
             });
          }).catch(function (err) {
              window.open('/supplierawaitingpurchaseorder','_self');
          });
        }).catch(function (err) {
          window.open('/supplierawaitingpurchaseorder','_self');
        });
        //window.history.go(-2);
      }).catch(function(err) {
        //window.open('/supplierawaitingpurchaseorder','_self');
        //window.history.go(-2);
        swal({
          title: 'Something went wrong',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },
  'keydown #edtPaymentAmount': function(event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (event.keyCode >= 35 && event.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }

    if (event.shiftKey == true) {
      event.preventDefault();
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 || event.keyCode == 9 ||
      event.keyCode == 37 || event.keyCode == 39 ||
      event.keyCode == 46 || event.keyCode == 190) {} else {
      event.preventDefault();
    }
  },
  'blur #edtPaymentAmount': function(event) {
    let paymentAmt = $(event.target).val();
    let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0;
    $('#edtPaymentAmount').val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
  },
  'blur .linePaymentamount': function(event) {
    let paymentAmt = $(event.target).val();
    let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0;
     $(event.target).val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
    let $tblrows = $("#tblSupplierPaymentcard tbody tr");
    let appliedGrandTotal = 0;
    $tblrows.each(function (index) {
        var $tblrow = $(this);
        var pricePayAmount = Number($tblrow.find(".linePaymentamount").val().replace(/[^0-9.-]+/g,""))||0;
        if (!isNaN(pricePayAmount)) {

            appliedGrandTotal += pricePayAmount;
            //document.getElementById("subtotal_total").innerHTML = Currency+''+subGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
        }
    });
    $('#edtPaymentAmount').val(utilityService.modifynegativeCurrencyFormat(appliedGrandTotal));
    $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(appliedGrandTotal));
  },
  'click .btnBack': function(event) {
    event.preventDefault();
    history.back(1);
  },
  'click .btnRemove': function(event) {
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
    var clicktimes = 0;
    var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    $('#selectDeleteLineID').val(targetID);

    times++;
    if (times == 1) {
      $('#deleteLineModal').modal('toggle');
    } else {
      if ($('#tblSupplierPaymentcard tbody>tr').length > 1) {
        this.click;
        $(event.target).closest('tr').remove();
        event.preventDefault();
        let $tblrows = $("#tblSupplierPaymentcard tbody tr");
        //if(selectLineID){
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;

        return false;

      } else {
        $('#deleteLineModal').modal('toggle');
      }

    }
  },
  'click .btnDeletePayment': function(event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    var url = window.location.href;
    var getso_id = url.split('?id=');
    var currentInvoice = getso_id[getso_id.length - 1];
    var objDetails = '';
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var objDetails = {
        type: "TSuppPayments",
        fields: {
          ID: currentInvoice,
          Deleted: true
          // Lines: null
        }
      };

      paymentService.deleteSuppDepositData(objDetails).then(function(objDetails) {
        $('.modal-backdrop').css('display','none');
        Router.go('/paymentoverview?success=true');
        sideBarService.getAllBillExList().then(function(dataBill) {
          addVS1Data('TBillEx',JSON.stringify(dataBill)).then(function (datareturn) {

          }).catch(function (err) {

          });
        }).catch(function(err) {

        });

        sideBarService.getAllPurchaseOrderListAll().then(function(data) {
          addVS1Data('TbillReport',JSON.stringify(data)).then(function (datareturn) {

          }).catch(function (err) {

          });
        }).catch(function(err) {

        });

      }).catch(function(err) {
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
        $('.fullScreenSpin').css('display', 'none');
        $('.modal-backdrop').css('display','none');
      });
    } else {
      let suppPaymentId = $('.printID').attr("id");
      if(suppPaymentId !== ''){
        currentInvoice = parseInt(suppPaymentId);
        var objDetails = {
          type: "TSuppPayments",
          fields: {
            ID: currentInvoice,
            Deleted: true
            // Lines: null
          }
        };

        paymentService.deleteSuppDepositData(objDetails).then(function(objDetails) {
          $('.modal-backdrop').css('display','none');
          Router.go('/paymentoverview?success=true');
          sideBarService.getAllBillExList().then(function(dataBill) {
            addVS1Data('TBillEx',JSON.stringify(dataBill)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function(err) {

          });

          sideBarService.getAllPurchaseOrderListAll().then(function(data) {
            addVS1Data('TbillReport',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
          }).catch(function(err) {

          });

        }).catch(function(err) {
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
          $('.fullScreenSpin').css('display', 'none');
          $('.modal-backdrop').css('display','none');
        });
      }else{
        Router.go('/paymentoverview?success=true');
        $('.modal-backdrop').css('display','none');
      }

    }
    // $('#deleteLineModal').modal('toggle');
  },
  'click .btnConfirmPayment': function(event) {
    $('#deleteLineModal').modal('toggle');
  },
  'click .btnDeleteLine': function(event) {
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
    let selectLineID = $('#selectDeleteLineID').val();
    if ($('#tblSupplierPaymentcard tbody>tr').length > 1) {
      this.click;

      $('#' + selectLineID).closest('tr').remove();
      //event.preventDefault();
      let $tblrows = $("#tblSupplierPaymentcard tbody tr");
      //if(selectLineID){
      let lineAmount = 0;
      let subGrandTotal = 0;
      let taxGrandTotal = 0;
      //return false;

    } else {
      this.click;
      $('#' + selectLineID).closest('tr').remove();

    }

    $('#deleteLineModal').modal('toggle');
  },
  'click .printConfirm': function(event) {
    $('#html-2-pdfwrapper').css('display', 'block');
    $('.pdfCustomerName').html($('#edtSupplierName').val());
    $('.pdfCustomerAddress').html($('#txabillingAddress').val());
    exportSalesToPdf();
  },
  'click .chkcolTransDate': function(event) {
    if ($(event.target).is(':checked')) {
      $('.colTransDate').css('display', 'table-cell');
      $('.colTransDate').css('padding', '.75rem');
      $('.colTransDate').css('vertical-align', 'top');
    } else {
      $('.colTransDate').css('display', 'none');
    }
  },
  'click .chkcolType': function(event) {
    if ($(event.target).is(':checked')) {
      $('.colType').css('display', 'table-cell');
      $('.colType').css('padding', '.75rem');
      $('.colType').css('vertical-align', 'top');
    } else {
      $('.colType').css('display', 'none');
    }
  },
  'click .chkcolTransNo': function(event) {
    if ($(event.target).is(':checked')) {
      $('.colTransNo').css('display', 'table-cell');
      $('.colTransNo').css('padding', '.75rem');
      $('.colTransNo').css('vertical-align', 'top');
    } else {
      $('.colTransNo').css('display', 'none');
    }
  },
  'click .chklineOrginalamount': function(event) {
    if ($(event.target).is(':checked')) {
      $('.lineOrginalamount').css('display', 'table-cell');
      $('.lineOrginalamount').css('padding', '.75rem');
      $('.lineOrginalamount').css('vertical-align', 'top');
    } else {
      $('.lineOrginalamount').css('display', 'none');
    }
  },
  'click .chklineAmountdue': function(event) {
    if ($(event.target).is(':checked')) {
      $('.lineAmountdue').css('display', 'table-cell');
      $('.lineAmountdue').css('padding', '.75rem');
      $('.lineAmountdue').css('vertical-align', 'top');
    } else {
      $('.lineAmountdue').css('display', 'none');
    }
  },
  'click .chklinePaymentamount': function(event) {
    if ($(event.target).is(':checked')) {
      $('.linePaymentamount').css('display', 'table-cell');
      $('.linePaymentamount').css('padding', '.75rem');
      $('.linePaymentamount').css('vertical-align', 'top');
    } else {
      $('.linePaymentamount').css('display', 'none');
    }
  },
  'click .chklineOutstandingAmount': function(event) {
    if ($(event.target).is(':checked')) {
      $('.lineOutstandingAmount').css('display', 'table-cell');
      $('.lineOutstandingAmount').css('padding', '.75rem');
      $('.lineOutstandingAmount').css('vertical-align', 'top');
    } else {
      $('.lineOutstandingAmount').css('display', 'none');
    }
  },
  'click .chkcolComments': function(event) {
    if ($(event.target).is(':checked')) {
      $('.colComments').css('display', 'table-cell');
      $('.colComments').css('padding', '.75rem');
      $('.colComments').css('vertical-align', 'top');
    } else {
      $('.colComments').css('display', 'none');
    }
  },
  'change .rngRangeTransDate': function(event) {
    let range = $(event.target).val();
    $(".spWidthTransDate").html(range + '%');
    $('.colTransDate').css('width', range + '%');
  },
  'change .rngRangeType': function(event) {
    let range = $(event.target).val();
    $(".spWidthType").html(range + '%');
    $('.colType').css('width', range + '%');
  },
  'change .rngRangeTransNo': function(event) {
    let range = $(event.target).val();
    $(".spWidthTransNo").html(range + '%');
    $('.colTransNo').css('width', range + '%');
  },
  'change .rngRangelineOrginalamount': function(event) {
    let range = $(event.target).val();
    $(".spWidthlineOrginalamount").html(range + '%');
    $('.lineOrginalamount').css('width', range + '%');
  },
  'change .rngRangeAmountdue': function(event) {
    let range = $(event.target).val();
    $(".spWidthAmountdue").html(range + '%');
    $('.lineAmountdue').css('width', range + '%');
  },
  'change .rngRangePaymentAmount': function(event) {
    let range = $(event.target).val();
    $(".spWidthPaymentAmount").html(range + '%');
    $('.linePaymentamount').css('width', range + '%');
  },
  'change .rngRangeOutstandingAmount': function(event) {
    let range = $(event.target).val();
    $(".spWidthOutstandingAmount").html(range + '%');
    $('.lineOutstandingAmount').css('width', range + '%');
  },
  'change .rngRangeComments': function(event) {
    let range = $(event.target).val();
    $(".spWidthComments").html(range + '%');
    $('.colComments').css('width', range + '%');
  },
  'click .btnResetGridSettings': function(event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get('mycloudLogonID'),
      clouddatabaseID: Session.get('mycloudLogonDBID')
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: 'tblSupplierPaymentcard'
        });
        if (checkPrefDetails) {
          CloudPreference.remove({
            _id: checkPrefDetails._id
          }, function(err, idTag) {
            if (err) {

            } else {
              Meteor._reload.reload();
            }
          });

        }
      }
    }
  },
  'click .btnSaveGridSettings': function(event) {

    let lineItems = [];
    //let lineItemObj = {};
    $('.columnSettings').each(function(index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || '';
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(':checked')) {
        colHidden = false;
      } else {
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
      // var price = $tblrow.find(".lineUnitPrice").text()||0;
      // var taxcode = $tblrow.find(".lineTaxRate").text()||0;

    });


    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get('mycloudLogonID'),
      clouddatabaseID: Session.get('mycloudLogonDBID')
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: 'tblSupplierPaymentcard'
        });
        if (checkPrefDetails) {
          CloudPreference.update({
            _id: checkPrefDetails._id
          }, {
            $set: {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: 'salesform',
              PrefName: 'tblSupplierPaymentcard',
              published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
              //window.open('/invoiceslist','_self');
            } else {
              $('#myModal2').modal('toggle');
              //window.open('/invoiceslist','_self');

            }
          });

        } else {
          CloudPreference.insert({
            userid: clientID,
            username: clientUsername,
            useremail: clientEmail,
            PrefGroup: 'salesform',
            PrefName: 'tblSupplierPaymentcard',
            published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
              //window.open('/invoiceslist','_self');
            } else {
              $('#myModal2').modal('toggle');
              //window.open('/invoiceslist','_self');

            }
          });

        }
      }
    }
  },
  'blur .divcolumn': function(event) {
    let columData = $(event.target).html();
    let columHeaderUpdate = $(event.target).attr("valueupdate");
    $("" + columHeaderUpdate + "").html(columData);

  },
  'click .chkEmailCopy': function(event) {
    $('#edtSupplierEmail').val($('#edtSupplierEmail').val().replace(/\s/g, ''));
    if ($(event.target).is(':checked')) {
      let checkEmailData = $('#edtSupplierEmail').val();
      if (checkEmailData.replace(/\s/g, '') === '') {
        swal('Supplier Email cannot be blank!', '', 'warning');
        event.preventDefault();
      } else {

        function isEmailValid(mailTo) {
          return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
        };
        if (!isEmailValid(checkEmailData)) {
          swal('The email field must be a valid email address !', '', 'warning');

          event.preventDefault();
          return false;
        } else {


        }
      }
    } else {

    }
  }
});
