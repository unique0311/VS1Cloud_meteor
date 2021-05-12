import {PaymentsService} from "../../payments/payments-service";
import {ReactiveVar} from "meteor/reactive-var";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import 'jquery-editable-select';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.paymentcard.onCreated(() => {
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
  templateObject.custpaymentid = new ReactiveVar();
});

Template.paymentcard.onRendered(() => {
//   $(document).ready(function () {
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
//                 window.open('/customerawaitingpayments', "_self");
//             } else {

//             }
//         });
//     });
// });
  $('.fullScreenSpin').css('display','inline-block');
  let imageData= (localStorage.getItem("Image"));
  if(imageData)
  {
      $('.uploadedImage').attr('src', imageData);
  };

  $('#edtCustomerName').attr('disabled', 'disabled');
  $('#edtCustomerName').attr('readonly', true);
setTimeout(function () {
  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
    if(error){
//console.log(error);
    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
  }else{
    if(result){
      for (let i = 0; i < result.customFields.length; i++) {
        let customcolumn = result.customFields;
        let columData = customcolumn[i].label;
        let columHeaderUpdate = customcolumn[i].thclass;
        let hiddenColumn = customcolumn[i].hidden;
        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
        let columnWidth = customcolumn[i].width;

        $(""+columHeaderUpdate+"").html(columData);
        if(columnWidth != 0){
          $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
        }

        if(hiddenColumn == true){
          $("."+columnClass+"").addClass('hiddenColumn');
          $("."+columnClass+"").removeClass('showColumn');
          $(".chk"+columnClass+"").removeAttr('checked');
        }else if(hiddenColumn == false){
          $("."+columnClass+"").removeClass('hiddenColumn');
          $("."+columnClass+"").addClass('showColumn');
          $(".chk"+columnClass+"").attr('checked','checked');
        }

      }
    }

  }
  });
}, 500);
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
  const record =[];
  let paymentService = new PaymentsService();
  let clientsService = new PaymentsService();
  const clientList = [];
  const deptrecords = [];
  const paymentmethodrecords = [];
  const accountnamerecords = [];

  templateObject.getAllClients = function(){
    getVS1Data('TCustomerVS1').then(function (dataObject) {
    if(dataObject.length == 0){
      clientsService.getClientVS1().then(function(data){
          for(let i in data.tcustomervs1){

              let customerrecordObj = {
                customerid: data.tcustomervs1[i].Id || ' ',
                customername: data.tcustomervs1[i].ClientName || ' ',
                customeremail: data.tcustomervs1[i].Email || ' ',
                street : data.tcustomervs1[i].Street || ' ',
                street2 : data.tcustomervs1[i].Street2 || ' ',
                street3 : data.tcustomervs1[i].Street3 || ' ',
                suburb : data.tcustomervs1[i].Suburb || ' ',
                statecode : data.tcustomervs1[i].State +' '+data.tcustomervs1[i].Postcode || ' ',
                country : data.tcustomervs1[i].Country || ' '
              };
              //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
              clientList.push(customerrecordObj);

              //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
          }
          //templateObject.clientrecords.set(clientList);
          templateObject.clientrecords.set(clientList.sort(function(a, b){
               if (a.customername == 'NA') {
             return 1;
                 }
             else if (b.customername == 'NA') {
               return -1;
             }
           return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
           }));

        for (var i = 0; i < clientList.length; i++) {
        $('#edtCustomerName').editableSelect('add',clientList[i].customername);
        }


      });
    }else{
    let data = JSON.parse(dataObject[0].data);
    let useData = data.tcustomervs1;

    for(let i in useData){

        let customerrecordObj = {
          customerid: useData[i].fields.ID || ' ',
          customername: useData[i].fields.ClientName || ' ',
          customeremail: useData[i].fields.Email || ' ',
          street : useData[i].fields.Street || ' ',
          street2 : useData[i].fields.Street2 || ' ',
          street3 : useData[i].fields.Street3 || ' ',
          suburb : useData[i].fields.Suburb || ' ',
          statecode : useData[i].fields.State +' '+useData[i].fields.Postcode || ' ',
          country : useData[i].fields.Country || ' '
        };
        //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
        clientList.push(customerrecordObj);

        //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
    }
    //templateObject.clientrecords.set(clientList);
    templateObject.clientrecords.set(clientList.sort(function(a, b){
         if (a.customername == 'NA') {
       return 1;
           }
       else if (b.customername == 'NA') {
         return -1;
       }
     return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
     }));

  for (var i = 0; i < clientList.length; i++) {
  $('#edtCustomerName').editableSelect('add',clientList[i].customername);
  }
    }
    }).catch(function (err) {
      clientsService.getClientVS1().then(function(data){
          for(let i in data.tcustomervs1){

              let customerrecordObj = {
                customerid: data.tcustomervs1[i].Id || ' ',
                customername: data.tcustomervs1[i].ClientName || ' ',
                customeremail: data.tcustomervs1[i].Email || ' ',
                street : data.tcustomervs1[i].Street || ' ',
                street2 : data.tcustomervs1[i].Street2 || ' ',
                street3 : data.tcustomervs1[i].Street3 || ' ',
                suburb : data.tcustomervs1[i].Suburb || ' ',
                statecode : data.tcustomervs1[i].State +' '+data.tcustomervs1[i].Postcode || ' ',
                country : data.tcustomervs1[i].Country || ' '
              };
              //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
              clientList.push(customerrecordObj);

              //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
          }
          //templateObject.clientrecords.set(clientList);
          templateObject.clientrecords.set(clientList.sort(function(a, b){
               if (a.customername == 'NA') {
             return 1;
                 }
             else if (b.customername == 'NA') {
               return -1;
             }
           return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
           }));

        for (var i = 0; i < clientList.length; i++) {
        $('#edtCustomerName').editableSelect('add',clientList[i].customername);
        }


      });
    });

  };
  templateObject.getDepartments = function(){
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

  templateObject.getPaymentMethods = function(){
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

  templateObject.getAccountNames = function(){
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
  $('#edtCustomerName').editableSelect()
    .on('select.editable-select', function (e, li) {
      let selectedCustomer = li.text();
      if(clientList){
        for (var i = 0; i < clientList.length; i++) {
          if(clientList[i].customername == selectedCustomer){
            $('#edtCustomerEmail').val(clientList[i].customeremail);
            $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
            $('#txabillingAddress').val(postalAddress);
          }
        }
      }
    });

    var url = window.location.href;
    if(url.indexOf('?id=') > 0){
    var getsale_id = url.split('?id=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesID = parseInt(currentSalesID);
      getVS1Data('TCustomerPayment').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOneCustomerPayment(currentSalesID).then(function (data) {
              let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

          if (data.fields.Lines.length) {
            for (let i = 0; i < data.fields.Lines.length; i++) {
              let amountDue = Currency+''+data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
              let paymentAmt = Currency+''+data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
              let outstandingAmt = Currency+''+data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
              let originalAmt = Currency+''+data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

              lineItemObj = {
                  //lid:data.fields.Lines[i].fields.ID || '',
                  id: data.fields.Lines[i].fields.ID || '',
                  invoiceid: data.fields.Lines[i].fields.TransNo || '',
                  transid: data.fields.Lines[i].fields.TransNo || '',
                  invoicedate: data.fields.Lines[i].fields.Date !=''? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY"): data.fields.Lines[i].fields.Date,
                  refno: data.fields.Lines[i].fields.RefNo || '',
                  transtype: data.fields.Lines[i].fields.TrnType || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount:outstandingAmt,
                  orginalamount:originalAmt
              };
              lineItems.push(lineItemObj);
            }
            }else {
            let amountDue = Currency+''+data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
            let paymentAmt =  Currency+''+data.fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
            let outstandingAmt = Currency+''+data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
            let originalAmt = Currency+''+data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
            lineItemObj = {
                id: data.fields.Lines.fields.ID || '',
                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                transid: data.fields.Lines.fields.InvoiceNo || '',
                invoicedate: data.fields.Lines.fields.Date !=''? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY"): data.fields.Lines.fields.Date,
                refno: data.fields.Lines.fields.RefNo || '',
                transtype: data.fields.Lines.fields.TrnType || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount:outstandingAmt,
                orginalamount:originalAmt
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
                LineItems:lineItems,
                checkpayment: data.fields.Payment,
                department: data.fields.DeptClassName,
                applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

            };
            templateObject.record.set(record);
            $('#edtCustomerName').val(data.fields.CompanyName);
            $('#edtBankAccountName').val(data.fields.AccountName);

            $('#edtCustomerName').attr('disabled', 'disabled');
            $('#edtCustomerName').attr('readonly', true);


            // $('#edtCustomerEmail').attr('readonly', true);

            $('#edtPaymentAmount').attr('readonly', true);

            $('#edtBankAccountName').attr('disabled', 'disabled');
            $('#edtBankAccountName').attr('readonly', true);

            $('.ui-datepicker-trigger').css('pointer-events', 'none');
            $('#dtPaymentDate').attr('readonly', true);

            $('#sltPaymentMethod').attr('disabled', 'disabled');
            $('#sltPaymentMethod').attr('readonly', true);

            $('#sltDepartment').attr('disabled', 'disabled');
            $('#sltDepartment').attr('readonly', true);
            //setTimeout(function () {
              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
                if(error){
            //console.log(error);
                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
              }else{
                if(result){
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $(""+columHeaderUpdate+"").html(columData);
                    if(columnWidth != 0){
                      $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                    }

                    if(hiddenColumn == true){
                      $("."+columnClass+"").addClass('hiddenColumn');
                      $("."+columnClass+"").removeClass('showColumn');
                      $(".chk"+columnClass+"").removeAttr('checked');
                    }else if(hiddenColumn == false){
                      $("."+columnClass+"").removeClass('hiddenColumn');
                      $("."+columnClass+"").addClass('showColumn');
                      $(".chk"+columnClass+"").attr('checked','checked');
                    }

                  }
                }

              }
              });
            //}, 500);
            setTimeout(function () {
              $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
             },1000);

            // $('#edtBankAccountName').val(data.fields.AccountName);
            $('#edtBankAccountName').append('<option value="'+data.fields.AccountName+'" selected="selected">'+data.fields.AccountName+'</option>');
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
            $('#sltDepartment').append('<option value="'+data.fields.DeptClassName+'" selected="selected">'+data.fields.DeptClassName+'</option>');
            if(clientList){
              for (var i = 0; i < clientList.length; i++) {
                if(clientList[i].customername == data.fields.CompanyName){
                  $('#edtCustomerEmail').val(clientList[i].customeremail);
                  $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }
              $('.fullScreenSpin').css('display','none');
            });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcustomerpayment;
          // console.log(useData);
          var added=false;
          for(let d=0; d<useData.length; d++){

              if(parseInt(useData[d].fields.ID) === currentSalesID){
                $('.fullScreenSpin').css('display','none');
                added = true;
                let lineItems = [];
      let lineItemObj = {};

      let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
      let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

      if (useData[d].fields.Lines.length) {

        for (let i = 0; i < useData[d].fields.Lines.length; i++) {
          let amountDue = Currency+''+useData[d].fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
          let paymentAmt = Currency+''+useData[d].fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
          let outstandingAmt = Currency+''+useData[d].fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
          let originalAmt = Currency+''+useData[d].fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

          lineItemObj = {
              //lid:useData[d].fields.Lines[i].fields.ID || '',
              id: useData[d].fields.Lines[i].fields.ID || '',
              invoiceid: useData[d].fields.Lines[i].fields.TransNo || '',
              transid: useData[d].fields.Lines[i].fields.TransNo || '',
              invoicedate: useData[d].fields.Lines[i].fields.Date !=''? moment(useData[d].fields.Lines[i].fields.Date).format("DD/MM/YYYY"): useData[d].fields.Lines[i].fields.Date,
              refno: useData[d].fields.Lines[i].fields.RefNo || '',
              transtype: useData[d].fields.Lines[i].fields.TrnType || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount:outstandingAmt,
              orginalamount:originalAmt
          };
          lineItems.push(lineItemObj);
        }
        }else {
        let amountDue = Currency+''+useData[d].fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
        let paymentAmt =  Currency+''+useData[d].fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
        let outstandingAmt = Currency+''+useData[d].fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
        let originalAmt = Currency+''+useData[d].fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
        lineItemObj = {
            id: useData[d].fields.Lines.fields.ID || '',
            invoiceid: useData[d].fields.Lines.fields.InvoiceId || '',
            transid: useData[d].fields.Lines.fields.InvoiceNo || '',
            invoicedate: useData[d].fields.Lines.fields.Date !=''? moment(useData[d].fields.Lines.fields.Date).format("DD/MM/YYYY"): useData[d].fields.Lines.fields.Date,
            refno: useData[d].fields.Lines.fields.RefNo || '',
            transtype: useData[d].fields.Lines.fields.TrnType || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount:outstandingAmt,
            orginalamount:originalAmt
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
            LineItems:lineItems,
            checkpayment: useData[d].fields.Payment,
            department: useData[d].fields.DeptClassName,
            applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

        };
        templateObject.record.set(record);
        $('#edtCustomerName').val(useData[d].fields.CompanyName);
        $('#edtBankAccountName').val(useData[d].fields.AccountName);

        $('#edtCustomerName').attr('disabled', 'disabled');
        $('#edtCustomerName').attr('readonly', true);


        // $('#edtCustomerEmail').attr('readonly', true);

        $('#edtPaymentAmount').attr('readonly', true);

        $('#edtBankAccountName').attr('disabled', 'disabled');
        $('#edtBankAccountName').attr('readonly', true);

        $('.ui-datepicker-trigger').css('pointer-events', 'none');
        $('#dtPaymentDate').attr('readonly', true);

        $('#sltPaymentMethod').attr('disabled', 'disabled');
        $('#sltPaymentMethod').attr('readonly', true);

        $('#sltDepartment').attr('disabled', 'disabled');
        $('#sltDepartment').attr('readonly', true);
        //setTimeout(function () {
          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
            if(error){
        //console.log(error);
            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $(""+columHeaderUpdate+"").html(columData);
                if(columnWidth != 0){
                  $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                }

                if(hiddenColumn == true){
                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                  $(".chk"+columnClass+"").removeAttr('checked');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
                  $(".chk"+columnClass+"").attr('checked','checked');
                }

              }
            }

          }
          });
        //}, 500);
        setTimeout(function () {
          $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
         },1000);

        // $('#edtBankAccountName').val(useData[d].fields.AccountName);
        $('#edtBankAccountName').append('<option value="'+useData[d].fields.AccountName+'" selected="selected">'+useData[d].fields.AccountName+'</option>');
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
        $('#sltDepartment').append('<option value="'+useData[d].fields.DeptClassName+'" selected="selected">'+useData[d].fields.DeptClassName+'</option>');
        if(clientList){
          for (var i = 0; i < clientList.length; i++) {
            if(clientList[i].customername == useData[d].fields.CompanyName){
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }
              }

          }

          if(!added) {
            paymentService.getOneCustomerPayment(currentSalesID).then(function (data) {
                let lineItems = [];
            let lineItemObj = {};

            let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

            if (data.fields.Lines.length) {
              for (let i = 0; i < data.fields.Lines.length; i++) {
                let amountDue = Currency+''+data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
                let paymentAmt = Currency+''+data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
                let outstandingAmt = Currency+''+data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
                let originalAmt = Currency+''+data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

                lineItemObj = {
                    //lid:data.fields.Lines[i].fields.ID || '',
                    id: data.fields.Lines[i].fields.ID || '',
                    invoiceid: data.fields.Lines[i].fields.TransNo || '',
                    transid: data.fields.Lines[i].fields.TransNo || '',
                    invoicedate: data.fields.Lines[i].fields.Date !=''? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY"): data.fields.Lines[i].fields.Date,
                    refno: data.fields.Lines[i].fields.RefNo || '',
                    transtype: data.fields.Lines[i].fields.TrnType || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount:outstandingAmt,
                    orginalamount:originalAmt
                };
                lineItems.push(lineItemObj);
              }
              }else {
              let amountDue = Currency+''+data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
              let paymentAmt =  Currency+''+data.fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
              let outstandingAmt = Currency+''+data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
              let originalAmt = Currency+''+data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
              lineItemObj = {
                  id: data.fields.Lines.fields.ID || '',
                  invoiceid: data.fields.Lines.fields.InvoiceId || '',
                  transid: data.fields.Lines.fields.InvoiceNo || '',
                  invoicedate: data.fields.Lines.fields.Date !=''? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY"): data.fields.Lines.fields.Date,
                  refno: data.fields.Lines.fields.RefNo || '',
                  transtype: data.fields.Lines.fields.TrnType || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount:outstandingAmt,
                  orginalamount:originalAmt
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
                  LineItems:lineItems,
                  checkpayment: data.fields.Payment,
                  department: data.fields.DeptClassName,
                  applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

              };
              templateObject.record.set(record);
              $('#edtCustomerName').val(data.fields.CompanyName);
              $('#edtBankAccountName').val(data.fields.AccountName);

              $('#edtCustomerName').attr('disabled', 'disabled');
              $('#edtCustomerName').attr('readonly', true);


              // $('#edtCustomerEmail').attr('readonly', true);

              $('#edtPaymentAmount').attr('readonly', true);

              $('#edtBankAccountName').attr('disabled', 'disabled');
              $('#edtBankAccountName').attr('readonly', true);

              $('.ui-datepicker-trigger').css('pointer-events', 'none');
              $('#dtPaymentDate').attr('readonly', true);

              $('#sltPaymentMethod').attr('disabled', 'disabled');
              $('#sltPaymentMethod').attr('readonly', true);

              $('#sltDepartment').attr('disabled', 'disabled');
              $('#sltDepartment').attr('readonly', true);
              //setTimeout(function () {
                Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
                  if(error){
              //console.log(error);
                  //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                }else{
                  if(result){
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass;
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                      let columnWidth = customcolumn[i].width;

                      $(""+columHeaderUpdate+"").html(columData);
                      if(columnWidth != 0){
                        $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                      }

                      if(hiddenColumn == true){
                        $("."+columnClass+"").addClass('hiddenColumn');
                        $("."+columnClass+"").removeClass('showColumn');
                        $(".chk"+columnClass+"").removeAttr('checked');
                      }else if(hiddenColumn == false){
                        $("."+columnClass+"").removeClass('hiddenColumn');
                        $("."+columnClass+"").addClass('showColumn');
                        $(".chk"+columnClass+"").attr('checked','checked');
                      }

                    }
                  }

                }
                });
              //}, 500);
              setTimeout(function () {
                $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
               },1000);

              // $('#edtBankAccountName').val(data.fields.AccountName);
              $('#edtBankAccountName').append('<option value="'+data.fields.AccountName+'" selected="selected">'+data.fields.AccountName+'</option>');
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
              $('#sltDepartment').append('<option value="'+data.fields.DeptClassName+'" selected="selected">'+data.fields.DeptClassName+'</option>');
              if(clientList){
                for (var i = 0; i < clientList.length; i++) {
                  if(clientList[i].customername == data.fields.CompanyName){
                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                    $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                    $('#txabillingAddress').val(postalAddress);
                  }
                }
              }
                $('.fullScreenSpin').css('display','none');
              });
          }
        }
      }).catch(function (err) {
          paymentService.getOneCustomerPayment(currentSalesID).then(function (data) {
              let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

          if (data.fields.Lines.length) {
            for (let i = 0; i < data.fields.Lines.length; i++) {
              let amountDue = Currency+''+data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
              let paymentAmt = Currency+''+data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
              let outstandingAmt = Currency+''+data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
              let originalAmt = Currency+''+data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

              lineItemObj = {
                  //lid:data.fields.Lines[i].fields.ID || '',
                  id: data.fields.Lines[i].fields.ID || '',
                  invoiceid: data.fields.Lines[i].fields.TransNo || '',
                  transid: data.fields.Lines[i].fields.TransNo || '',
                  invoicedate: data.fields.Lines[i].fields.Date !=''? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY"): data.fields.Lines[i].fields.Date,
                  refno: data.fields.Lines[i].fields.RefNo || '',
                  transtype: data.fields.Lines[i].fields.TrnType || '',
                  amountdue: amountDue || 0,
                  paymentamount: paymentAmt || 0,
                  ouststandingamount:outstandingAmt,
                  orginalamount:originalAmt
              };
              lineItems.push(lineItemObj);
            }
            }else {
            let amountDue = Currency+''+data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
            let paymentAmt =  Currency+''+data.fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
            let outstandingAmt = Currency+''+data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
            let originalAmt = Currency+''+data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
            lineItemObj = {
                id: data.fields.Lines.fields.ID || '',
                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                transid: data.fields.Lines.fields.InvoiceNo || '',
                invoicedate: data.fields.Lines.fields.Date !=''? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY"): data.fields.Lines.fields.Date,
                refno: data.fields.Lines.fields.RefNo || '',
                transtype: data.fields.Lines.fields.TrnType || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount:outstandingAmt,
                orginalamount:originalAmt
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
                LineItems:lineItems,
                checkpayment: data.fields.Payment,
                department: data.fields.DeptClassName,
                applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

            };
            templateObject.record.set(record);
            $('#edtCustomerName').val(data.fields.CompanyName);
            $('#edtBankAccountName').val(data.fields.AccountName);

            $('#edtCustomerName').attr('disabled', 'disabled');
            $('#edtCustomerName').attr('readonly', true);


            // $('#edtCustomerEmail').attr('readonly', true);

            $('#edtPaymentAmount').attr('readonly', true);

            $('#edtBankAccountName').attr('disabled', 'disabled');
            $('#edtBankAccountName').attr('readonly', true);

            $('.ui-datepicker-trigger').css('pointer-events', 'none');
            $('#dtPaymentDate').attr('readonly', true);

            $('#sltPaymentMethod').attr('disabled', 'disabled');
            $('#sltPaymentMethod').attr('readonly', true);

            $('#sltDepartment').attr('disabled', 'disabled');
            $('#sltDepartment').attr('readonly', true);
            //setTimeout(function () {
              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
                if(error){
            //console.log(error);
                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
              }else{
                if(result){
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass;
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                    let columnWidth = customcolumn[i].width;

                    $(""+columHeaderUpdate+"").html(columData);
                    if(columnWidth != 0){
                      $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                    }

                    if(hiddenColumn == true){
                      $("."+columnClass+"").addClass('hiddenColumn');
                      $("."+columnClass+"").removeClass('showColumn');
                      $(".chk"+columnClass+"").removeAttr('checked');
                    }else if(hiddenColumn == false){
                      $("."+columnClass+"").removeClass('hiddenColumn');
                      $("."+columnClass+"").addClass('showColumn');
                      $(".chk"+columnClass+"").attr('checked','checked');
                    }

                  }
                }

              }
              });
            //}, 500);
            setTimeout(function () {
              $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
             },1000);

            // $('#edtBankAccountName').val(data.fields.AccountName);
            $('#edtBankAccountName').append('<option value="'+data.fields.AccountName+'" selected="selected">'+data.fields.AccountName+'</option>');
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
            $('#sltDepartment').append('<option value="'+data.fields.DeptClassName+'" selected="selected">'+data.fields.DeptClassName+'</option>');
            if(clientList){
              for (var i = 0; i < clientList.length; i++) {
                if(clientList[i].customername == data.fields.CompanyName){
                  $('#edtCustomerEmail').val(clientList[i].customeremail);
                  $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }
              $('.fullScreenSpin').css('display','none');
            });
        });

    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/invoicecard?id=' + listData,'_self');
    }
    });
  }else if(url.indexOf('?soid=') > 0){
    // alert('here');
    var getsale_id = url.split('?soid=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesID = parseInt(currentSalesID);
      paymentService.getOneSalesOrderPayment(currentSalesID).then(function (data) {
          let lineItems = [];
      let lineItemObj = {};

      let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");
      let amountDue = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let paymentAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let outstandingAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let originalAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
        lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
            refno: data.fields.ReferenceNo || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount:outstandingAmt,
            orginalamount:originalAmt
        };
        lineItems.push(lineItemObj);
        let record = {
            lid:'',
            customerName: data.fields.CustomerName || '',
            paymentDate: begunDate,
            reference: data.fields.ReferenceNo || ' ',
            bankAccount: data.fields.GLAccountName || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems:lineItems,
            checkpayment: data.fields.PayMethod,
            department: data.fields.DeptClassName,
            applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

        };
        templateObject.record.set(record);
        $('#edtCustomerName').val(data.fields.CustomerName);
        $('#edtBankAccountName').val(data.fields.GLAccountName);
        if(clientList){
          for (var i = 0; i < clientList.length; i++) {
            if(clientList[i].customername == data.fields.CustomerName){
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }
        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
          if(error){
      //console.log(error);
          //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
        }else{
          if(result){
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass;
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
              let columnWidth = customcolumn[i].width;

              $(""+columHeaderUpdate+"").html(columData);
              if(columnWidth != 0){
                $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
              }

              if(hiddenColumn == true){
                $("."+columnClass+"").addClass('hiddenColumn');
                $("."+columnClass+"").removeClass('showColumn');
                $(".chk"+columnClass+"").removeAttr('checked');
              }else if(hiddenColumn == false){
                $("."+columnClass+"").removeClass('hiddenColumn');
                $("."+columnClass+"").addClass('showColumn');
                $(".chk"+columnClass+"").attr('checked','checked');
              }

            }
          }

        }
        });

          $('.fullScreenSpin').css('display','none');
        });
    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/salesordercard?id=' + listData,'_self');
    }
    });
  }else if(url.indexOf('?quoteid=') > 0){
    // alert('here');
    var getsale_id = url.split('?quoteid=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesID = parseInt(currentSalesID);
      paymentService.getOneQuotePayment(currentSalesID).then(function (data) {
          let lineItems = [];
      let lineItemObj = {};

      let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");
      let amountDue = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let paymentAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let outstandingAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let originalAmt = Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
        lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
            refno: data.fields.ReferenceNo || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount:outstandingAmt,
            orginalamount:originalAmt
        };
        lineItems.push(lineItemObj);
        let record = {
            lid:'',
            customerName: data.fields.CustomerName || '',
            paymentDate: begunDate,
            reference: data.fields.ReferenceNo || ' ',
            bankAccount: data.fields.GLAccountName || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems:lineItems,
            checkpayment: data.fields.PayMethod,
            department: data.fields.DeptClassName,
            applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

        };
        templateObject.record.set(record);
        $('#edtCustomerName').val(data.fields.CustomerName);
        $('#edtBankAccountName').val(data.fields.GLAccountName);
        if(clientList){
          for (var i = 0; i < clientList.length; i++) {
            if(clientList[i].customername == data.fields.CustomerName){
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }
        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
          if(error){
      //console.log(error);
          //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
        }else{
          if(result){
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass;
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
              let columnWidth = customcolumn[i].width;

              $(""+columHeaderUpdate+"").html(columData);
              if(columnWidth != 0){
                $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
              }

              if(hiddenColumn == true){
                $("."+columnClass+"").addClass('hiddenColumn');
                $("."+columnClass+"").removeClass('showColumn');
                $(".chk"+columnClass+"").removeAttr('checked');
              }else if(hiddenColumn == false){
                $("."+columnClass+"").removeClass('hiddenColumn');
                $("."+columnClass+"").addClass('showColumn');
                $(".chk"+columnClass+"").attr('checked','checked');
              }

            }
          }

        }
        });
          $('.fullScreenSpin').css('display','none');
        });
    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/quotecard?id=' + listData,'_self');
    }
    });
  }else if(url.indexOf('?invid=') > 0){
    // alert('here');
    var getsale_id = url.split('?invid=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesID = parseInt(currentSalesID);
      getVS1Data('TInvoiceEx').then(function (dataObject) {
        if(dataObject.length == 0){
          paymentService.getOneInvoicePayment(currentSalesID).then(function (data) {
              let lineItems = [];
          let lineItemObj = {};

          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
          // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {minimumFractionDigits: 2});
          // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
            lineItemObj = {
                id: data.fields.ID || '',
                invoiceid: data.fields.ID || '',
                transid: data.fields.ID || '',
                invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
                refno: data.fields.ReferenceNo || '',
                transtype: "Invoice" || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount:outstandingAmt,
                orginalamount:originalAmt
            };
            lineItems.push(lineItemObj);
            let record = {
                lid:'',
                customerName: data.fields.CustomerName || '',
                paymentDate: begunDate,
                reference: data.fields.ReferenceNo || ' ',
                bankAccount: Session.get('banaccount') || data.fields.GLAccountName || '',
                paymentAmount: appliedAmt || 0,
                notes: data.fields.Comments,
                LineItems:lineItems,
                checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                department: Session.get('department') || data.fields.DeptClassName,
                applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

            };
            templateObject.record.set(record);
            $('#edtCustomerName').val(data.fields.CustomerName);
            $('#edtBankAccountName').val(record.bankAccount);
            if(clientList){
              for (var i = 0; i < clientList.length; i++) {
                if(clientList[i].customername == data.fields.CustomerName){
                  $('#edtCustomerEmail').val(clientList[i].customeremail);
                  $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                  let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                  $('#txabillingAddress').val(postalAddress);
                }
              }
            }
            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
              if(error){
          //console.log(error);
              //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            }else{
              if(result){
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass;
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                  let columnWidth = customcolumn[i].width;

                  $(""+columHeaderUpdate+"").html(columData);
                  if(columnWidth != 0){
                    $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                  }

                  if(hiddenColumn == true){
                    $("."+columnClass+"").addClass('hiddenColumn');
                    $("."+columnClass+"").removeClass('showColumn');
                    $(".chk"+columnClass+"").removeAttr('checked');
                  }else if(hiddenColumn == false){
                    $("."+columnClass+"").removeClass('hiddenColumn');
                    $("."+columnClass+"").addClass('showColumn');
                    $(".chk"+columnClass+"").attr('checked','checked');
                  }

                }
              }

            }
            });
              $('.fullScreenSpin').css('display','none');
            });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tinvoiceex;

          var added=false;
          for(let d=0; d<useData.length; d++){
            if(parseInt(useData[d].fields.ID) === currentSalesID){
              added = true;
              $('.fullScreenSpin').css('display','none');
              let lineItems = [];
let lineItemObj = {};

let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
var currentDate = new Date();
var begunDate = moment(currentDate).format("DD/MM/YYYY");
let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
// Currency+''+useData[d].fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {minimumFractionDigits: 2});
// Currency+''+useData[d].fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
lineItemObj = {
  id: useData[d].fields.ID || '',
  invoiceid: useData[d].fields.ID || '',
  transid: useData[d].fields.ID || '',
  invoicedate: useData[d].fields.SaleDate !=''? moment(useData[d].fields.SaleDate).format("DD/MM/YYYY"): useData[d].fields.SaleDate,
  refno: useData[d].fields.ReferenceNo || '',
  transtype: "Invoice" || '',
  amountdue: amountDue || 0,
  paymentamount: paymentAmt || 0,
  ouststandingamount:outstandingAmt,
  orginalamount:originalAmt
};
lineItems.push(lineItemObj);
let record = {
  lid:'',
  customerName: useData[d].fields.CustomerName || '',
  paymentDate: begunDate,
  reference: useData[d].fields.ReferenceNo || ' ',
  bankAccount: Session.get('banaccount') || useData[d].fields.GLAccountName || '',
  paymentAmount: appliedAmt || 0,
  notes: useData[d].fields.Comments,
  LineItems:lineItems,
  checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
  department: Session.get('department') || useData[d].fields.DeptClassName,
  applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

};
templateObject.record.set(record);
$('#edtCustomerName').val(useData[d].fields.CustomerName);
$('#edtBankAccountName').val(record.bankAccount);
if(clientList){
for (var i = 0; i < clientList.length; i++) {
  if(clientList[i].customername == useData[d].fields.CustomerName){
    $('#edtCustomerEmail').val(clientList[i].customeremail);
    $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
    $('#txabillingAddress').val(postalAddress);
  }
}
}
Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
if(error){
//console.log(error);
//Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
}else{
if(result){
  for (let i = 0; i < result.customFields.length; i++) {
    let customcolumn = result.customFields;
    let columData = customcolumn[i].label;
    let columHeaderUpdate = customcolumn[i].thclass;
    let hiddenColumn = customcolumn[i].hidden;
    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
    let columnWidth = customcolumn[i].width;

    $(""+columHeaderUpdate+"").html(columData);
    if(columnWidth != 0){
      $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
    }

    if(hiddenColumn == true){
      $("."+columnClass+"").addClass('hiddenColumn');
      $("."+columnClass+"").removeClass('showColumn');
      $(".chk"+columnClass+"").removeAttr('checked');
    }else if(hiddenColumn == false){
      $("."+columnClass+"").removeClass('hiddenColumn');
      $("."+columnClass+"").addClass('showColumn');
      $(".chk"+columnClass+"").attr('checked','checked');
    }

  }
}

}
});
$('.fullScreenSpin').css('display','none');
            }
          }

          if(!added) {

          }
        }
      }).catch(function (err) {
        paymentService.getOneInvoicePayment(currentSalesID).then(function (data) {
            let lineItems = [];
        let lineItemObj = {};

        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
        // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {minimumFractionDigits: 2});
        // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
          lineItemObj = {
              id: data.fields.ID || '',
              invoiceid: data.fields.ID || '',
              transid: data.fields.ID || '',
              invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
              refno: data.fields.ReferenceNo || '',
              transtype: "Invoice" || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount:outstandingAmt,
              orginalamount:originalAmt
          };
          lineItems.push(lineItemObj);
          let record = {
              lid:'',
              customerName: data.fields.CustomerName || '',
              paymentDate: begunDate,
              reference: data.fields.ReferenceNo || ' ',
              bankAccount: Session.get('banaccount') || data.fields.GLAccountName || '',
              paymentAmount: appliedAmt || 0,
              notes: data.fields.Comments,
              LineItems:lineItems,
              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
              department: Session.get('department') || data.fields.DeptClassName,
              applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

          };
          templateObject.record.set(record);
          $('#edtCustomerName').val(data.fields.CustomerName);
          $('#edtBankAccountName').val(record.bankAccount);
          if(clientList){
            for (var i = 0; i < clientList.length; i++) {
              if(clientList[i].customername == data.fields.CustomerName){
                $('#edtCustomerEmail').val(clientList[i].customeremail);
                $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                $('#txabillingAddress').val(postalAddress);
              }
            }
          }
          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
            if(error){
        //console.log(error);
            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass;
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                let columnWidth = customcolumn[i].width;

                $(""+columHeaderUpdate+"").html(columData);
                if(columnWidth != 0){
                  $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                }

                if(hiddenColumn == true){
                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                  $(".chk"+columnClass+"").removeAttr('checked');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
                  $(".chk"+columnClass+"").attr('checked','checked');
                }

              }
            }

          }
          });
            $('.fullScreenSpin').css('display','none');
          });
      });

    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/invoicecard?id=' + listData,'_self');
    }
    });
  }else if((url.indexOf('?custname=') > 0) && (url.indexOf('from=') > 0)){
    var getsale_custname = url.split('?custname=');
    var currentSalesURL = getsale_custname[getsale_custname.length-1].split("&");

    var getsale_salesid = url.split('from=');
    var currentSalesID = getsale_salesid[getsale_salesid.length-1].split('#')[0];

    if(getsale_custname[1]){
      let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
      // let currentSalesID = currentSalesURL[1].split('from=');
      paymentService.getCustomerPaymentByName(currentSalesName).then(function (data) {
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

      for(let i=0;i<data.tcustomerpayment.length;i++){
          if(data.tcustomerpayment[i].fields.Lines && data.tcustomerpayment[i].fields.Lines.length){
            for(let j=0;j< data.tcustomerpayment[i].fields.Lines.length;j++){
              if(data.tcustomerpayment[i].fields.Lines[j].fields.TransNo == currentSalesID ){
                 companyName = data.tcustomerpayment[i].fields.CompanyName;
                 referenceNo = data.tcustomerpayment[i].fields.ReferenceNo;
                 paymentMethodName = data.tcustomerpayment[i].fields.PaymentMethodName;
                 accountName = data.tcustomerpayment[i].fields.AccountName;
                 notes = data.tcustomerpayment[i].fields.Notes;
                 paymentdate = data.tcustomerpayment[i].fields.PaymentDate;
                 checkpayment = data.tcustomerpayment[i].fields.Payment;
                 department = data.tcustomerpayment[i].fields.DeptClassName;
                 appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});
                 templateObject.custpaymentid.set(data.tcustomerpayment[i].fields.ID);

                let amountDue = Currency+''+data.tcustomerpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
                let paymentAmt = Currency+''+data.tcustomerpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
                let outstandingAmt = Currency+''+data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
                let originalAmt = Currency+''+data.tcustomerpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});



                lineItemObj = {
                    id: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                    invoiceid: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                    transid: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                    invoicedate: data.tcustomerpayment[i].fields.Lines[j].fields.Date !=''? moment(data.tcustomerpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY"): data.tcustomerpayment[i].fields.Lines[j].fields.Date,
                    refno: data.tcustomerpayment[i].fields.Lines[j].fields.RefNo || '',
                    transtype: "Invoice" || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount:outstandingAmt,
                    orginalamount:originalAmt
                };
                lineItems.push(lineItemObj);
              }else{

              }

          }
          }
      }
// alert(companyName);
      let record = {
          lid:'',
          customerName: companyName || '',
          paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
          reference: referenceNo || ' ',
          bankAccount: Session.get('banaccount') || accountName || '',
          paymentAmount: appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})  || 0,
          notes: notes || '',
          LineItems:lineItems,
          checkpayment: Session.get('paymentmethod') ||checkpayment ||'',
          department: Session.get('department') || department ||'',
          applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0

      };

      $('#edtCustomerName').val(companyName);
      $('#edtBankAccountName').val(record.bankAccount);

      templateObject.record.set(record);
      if(clientList){
        for (var i = 0; i < clientList.length; i++) {
          if(clientList[i].customername == companyName){
            $('#edtCustomerEmail').val(clientList[i].customeremail);
            $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
            $('#txabillingAddress').val(postalAddress);
          }
        }
      }
      /*
      let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
      let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

      if (data.fields.Lines.length) {
        for (let i = 0; i < data.fields.Lines.length; i++) {
          let amountDue = Currency+''+data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
          let paymentAmt = Currency+''+data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
          let outstandingAmt = Currency+''+data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
          let originalAmt = Currency+''+data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

          lineItemObj = {
              id: data.fields.Lines[i].fields.ID || '',
              invoiceid: data.fields.Lines[i].fields.ID || '',
              transid: data.fields.Lines[i].fields.ID || '',
              invoicedate: data.fields.Lines[i].fields.Date !=''? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY"): data.fields.Lines[i].fields.Date,
              refno: data.fields.Lines[i].fields.RefNo || '',
              amountdue: amountDue || 0,
              paymentamount: paymentAmt || 0,
              ouststandingamount:outstandingAmt,
              orginalamount:originalAmt
          };
          lineItems.push(lineItemObj);
        }
        }else {
        let amountDue = Currency+''+data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
        let paymentAmt =  Currency+''+data.fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
        let outstandingAmt = Currency+''+data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
        let originalAmt = Currency+''+data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
        lineItemObj = {
            id: data.fields.Lines.fields.ID || '',
            invoiceid: data.fields.Lines.fields.InvoiceId || '',
            transid: data.fields.Lines.fields.InvoiceNo || '',
            invoicedate: data.fields.Lines.fields.Date !=''? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY"): data.fields.Lines.fields.Date,
            refno: data.fields.Lines.fields.RefNo || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount:outstandingAmt,
            orginalamount:originalAmt
        };
        lineItems.push(lineItemObj);
        }

        $('#edtCustomerName').val(data.fields.CompanyName);
        $('#edtBankAccountName').val(data.fields.AccountName);
        if(clientList){
          for (var i = 0; i < clientList.length; i++) {
            if(clientList[i].customername == data.fields.CustomerName){
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
            }
          }
        }
        */

        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
          if(error){
      //console.log(error);
          //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
        }else{
          if(result){
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass;
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
              let columnWidth = customcolumn[i].width;

              $(""+columHeaderUpdate+"").html(columData);
              if(columnWidth != 0){
                $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
              }

              if(hiddenColumn == true){
                $("."+columnClass+"").addClass('hiddenColumn');
                $("."+columnClass+"").removeClass('showColumn');
                $(".chk"+columnClass+"").removeAttr('checked');
              }else if(hiddenColumn == false){
                $("."+columnClass+"").removeClass('hiddenColumn');
                $("."+columnClass+"").addClass('showColumn');
                $(".chk"+columnClass+"").attr('checked','checked');
              }

            }
          }

        }
        });
          $('.fullScreenSpin').css('display','none');
        });
    }
  }else if(url.indexOf('?customername=') > 0){
    // alert('here');
    var getsale_id = url.split('?customername=');
    var currentSalesName = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesName = currentSalesName;
      paymentService.getCustomerSalesPayment(currentSalesName).then(function (data) {
          let lineItems = [];
      let lineItemObj = {};

      let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");
      let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
      let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
      let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {minimumFractionDigits: 2});
      // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
        lineItemObj = {
            id: data.fields.ID || '',
            invoiceid: data.fields.ID || '',
            transid: data.fields.ID || '',
            invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
            refno: data.fields.ReferenceNo || '',
            transtype: "Invoice" || '',
            amountdue: amountDue || 0,
            paymentamount: paymentAmt || 0,
            ouststandingamount:outstandingAmt,
            orginalamount:originalAmt
        };
        lineItems.push(lineItemObj);
        let record = {
            lid:'',
            customerName: data.fields.CustomerName || '',
            paymentDate: begunDate,
            reference: data.fields.ReferenceNo || ' ',
            bankAccount: Session.get('banaccount') || data.fields.GLAccountName || '',
            paymentAmount: appliedAmt || 0,
            notes: data.fields.Comments,
            LineItems:lineItems,
            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
            department: Session.get('department') || data.fields.DeptClassName,
            applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})

        };
        templateObject.record.set(record);
        $('#edtCustomerName').val(data.fields.CustomerName);
        $('#edtBankAccountName').val(record.bankAccount);
        if(clientList){
          for (var i = 0; i < clientList.length; i++) {
            if(clientList[i].customername == data.fields.CustomerName){
              $('#edtCustomerEmail').val(clientList[i].customeremail);
              $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
              let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
              $('#txabillingAddress').val(postalAddress);
            }
          }
        }
        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
          if(error){
      //console.log(error);
          //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
        }else{
          if(result){
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass;
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
              let columnWidth = customcolumn[i].width;

              $(""+columHeaderUpdate+"").html(columData);
              if(columnWidth != 0){
                $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
              }

              if(hiddenColumn == true){
                $("."+columnClass+"").addClass('hiddenColumn');
                $("."+columnClass+"").removeClass('showColumn');
                $(".chk"+columnClass+"").removeAttr('checked');
              }else if(hiddenColumn == false){
                $("."+columnClass+"").removeClass('hiddenColumn');
                $("."+columnClass+"").addClass('showColumn');
                $(".chk"+columnClass+"").attr('checked','checked');
              }

            }
          }

        }
        });
          $('.fullScreenSpin').css('display','none');
        });
    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/invoicecard?id=' + listData,'_self');
    }
    });
  }else if(url.indexOf('?selectcust=') > 0){
    // alert('here');
    var getsale_id = url.split('?selectcust=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    //console.log(currentSalesID);
    if(getsale_id[1]){
    let lineItems = [];
  let lineItemObj = {};
  let amountData =  0;
      var arr = currentSalesID.split(',');
      for (let i = 0; i < arr.length; i++) {
        // alert(arr[i]);
        currentSalesID = parseInt(arr[i]);

    paymentService.getOneInvoicePayment(currentSalesID).then(function (data) {


    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
    // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
    amountData = amountData + data.fields.TotalBalance;
    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {minimumFractionDigits: 2});
    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {minimumFractionDigits: 2});
    // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
      lineItemObj = {
          id: data.fields.ID || '',
          invoiceid: data.fields.ID || '',
          transid: data.fields.ID || '',
          invoicedate: data.fields.SaleDate !=''? moment(data.fields.SaleDate).format("DD/MM/YYYY"): data.fields.SaleDate,
          refno: data.fields.ReferenceNo || '',
          transtype: "Invoice" || '',
          amountdue: amountDue || 0,
          paymentamount: paymentAmt || 0,
          ouststandingamount:outstandingAmt,
          orginalamount:originalAmt
      };
      lineItems.push(lineItemObj);
      let record = {
          lid:'',
          customerName: data.fields.CustomerName || '',
          paymentDate: begunDate,
          reference: data.fields.ReferenceNo || ' ',
          bankAccount: Session.get('banaccount') || data.fields.GLAccountName || '',
          paymentAmount:  utilityService.modifynegativeCurrencyFormat(amountData) || 0,
          notes: data.fields.Comments,
          LineItems:lineItems,
          checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
          department: Session.get('department') || data.fields.DeptClassName,
          applied:utilityService.modifynegativeCurrencyFormat(amountData) || 0

      };
      templateObject.record.set(record);
      $('#edtCustomerName').val(data.fields.CustomerName);
      $('#edtBankAccountName').val(record.bankAccount);
      if(clientList){
        for (var i = 0; i < clientList.length; i++) {
          if(clientList[i].customername == data.fields.CustomerName){
            $('#edtCustomerEmail').val(clientList[i].customeremail);
            $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
            $('#txabillingAddress').val(postalAddress);
          }
        }
      }
      Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentcard', function(error, result){
        if(error){
    //console.log(error);
        //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
      }else{
        if(result){
          for (let i = 0; i < result.customFields.length; i++) {
            let customcolumn = result.customFields;
            let columData = customcolumn[i].label;
            let columHeaderUpdate = customcolumn[i].thclass;
            let hiddenColumn = customcolumn[i].hidden;
            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
            let columnWidth = customcolumn[i].width;

            $(""+columHeaderUpdate+"").html(columData);
            if(columnWidth != 0){
              $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
            }

            if(hiddenColumn == true){
              $("."+columnClass+"").addClass('hiddenColumn');
              $("."+columnClass+"").removeClass('showColumn');
              $(".chk"+columnClass+"").removeAttr('checked');
            }else if(hiddenColumn == false){
              $("."+columnClass+"").removeClass('hiddenColumn');
              $("."+columnClass+"").addClass('showColumn');
              $(".chk"+columnClass+"").attr('checked','checked');
            }

          }
        }

      }
      });
        $('.fullScreenSpin').css('display','none');
      });

      }


    }

    $('#tblPaymentcard tbody').on( 'click', 'tr .colType', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      window.open('/invoicecard?id=' + listData,'_self');
    }
    });
  }else{
    $('.fullScreenSpin').css('display','none');
  }

    exportSalesToPdf = function(){
      let margins = {
        top: 0,
        bottom: 0,
        left: 0,
        width: 100
      };
        let id = $('.printID').attr("id");
      var pdf =  new jsPDF('p', 'pt', 'a4');
      //new jsPDF('p', 'pt', 'letter');
      // new jsPDF('p', 'mm', 'a4');
        pdf.setFontSize(18);
        var source = document.getElementById('html-2-pdfwrapper');
        pdf.addHTML(source, function () {
           pdf.save('Customer Payment '+id+'.pdf');
           $('#html-2-pdfwrapper').css('display','none');
       });
    };

});


Template.paymentcard.helpers({
  record: () => {
        return Template.instance().record.get();
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
  paymentmethodrecords: () => {
      return Template.instance().paymentmethodrecords.get().sort(function(a, b){
        if (a.paymentmethod == 'NA') {
      return 1;
          }
      else if (b.paymentmethod == 'NA') {
        return -1;
      }
    return (a.paymentmethod.toUpperCase() > b.paymentmethod.toUpperCase()) ? 1 : -1;
    });
  },
  accountnamerecords: () => {
      return Template.instance().accountnamerecords.get().sort(function(a, b){
        if (a.accountname == 'NA') {
      return 1;
          }
      else if (b.accountname == 'NA') {
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
    return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblPaymentcard'});
    },
    companyaddress1: () =>{
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () =>{
        return Session.get('vs1companyaddress2');
    },
    companyphone: () =>{
        return Session.get('vs1companyPhone');
    },
    companyabn: () =>{
        return Session.get('vs1companyABN');
    },
    organizationname: () =>{
        return Session.get('vs1companyName');
    },
    organizationurl: () =>{
        return Session.get('vs1companyURL');
    }
});

Template.paymentcard.events({
  'click .btnSave':function () {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();

    let paymentService = new PaymentsService();
    let customer = $("#edtCustomerName").val();
    let paymentAmt = $("#edtPaymentAmount").val();
    let paymentDate = $("#dtPaymentDate").val();
    let bankAccount = $("#edtBankAccountName").val();
    let reference = $("#edtReference").val();
    let payMethod = $("#sltPaymentMethod").val();
    let notes = $("#txaNotes").val();
    let customerEmail = $("#edtCustomerEmail").val();
    if(payMethod == ''){
      payMethod = "Cash";
    }
    let department = $("#sltDepartment").val();
    let empName = localStorage.getItem('mySession');
    let paymentData=[];
    Session.setPersistent('paymentmethod', payMethod);
    Session.setPersistent('banaccount', bankAccount);
    Session.setPersistent('department', department);
    var url = window.location.href;
    if(url.indexOf('?soid=') > 0){
    var getsale_id = url.split('?soid=');
    var currentSalesID = getsale_id[getsale_id.length-1];
    if(getsale_id[1]){
      currentSalesID = parseInt(currentSalesID);
      $('.tblPaymentcard > tbody > tr').each(function(){
        var lineID = this.id;

        let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
        let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
        let Line = {
              type: 'TGuiCustPaymentLines',
              fields: {
                    TransType:linetype,
                    // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                    //EnteredBy:empName || ' ',
                    // InvoiceId:currentSalesID,
                    //RefNo:reference,
                    Paid:true,
                    Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    TransID:lineID
              }
          };
          paymentData.push(Line);
      });

      let objDetails = {
             type: "TCustPayments",
             fields: {
                 // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                 // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                 AccountName:bankAccount,
                 ClientPrintName:customer,
                 CompanyName:customer,
                 EmployeeName: empName || ' ',
                 GUILines: paymentData,
                 Notes:notes,
                 // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
                 PayMethodName: payMethod,
                 Payment:true,
                 ReferenceNo: reference,
                 Notes:notes
             }
         };

      paymentService.saveDepositData(objDetails).then(function (data) {
        var customerID = $('#edtCustomerEmail').attr('customerid');
        // Send Email
        $('#html-2-pdfwrapper').css('display','block');
          $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                   // console.log(base64data);
                   pdfObject = {
                      filename: 'Customer Payment ' + invoiceId + '.pdf',
                      content: base64data,
                      encoding: 'base64'
                  };
                  attachment.push(pdfObject);
          // let mailBody = "VS1 Cloud Test";
          let erpInvoiceId = objDetails.fields.ID;


          let mailFromName = Session.get('vs1companyName');
          let mailFrom = localStorage.getItem('mySession');
          let customerEmailName = $('#edtCustomerName').val();
          let checkEmailData = $('#edtCustomerEmail').val();
          // let mailCC = templateObject.mailCopyToUsr.get();
          let grandtotal = $('#grandTotal').html();
          let amountDueEmail = $('#totalBalanceDue').html();
          let emailDueDate = $("#dtDueDate").val();
          let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
          let mailBody = "Hi "+customerEmailName+",\n\n Here's Payment "+erpInvoiceId+" for  "+grandtotal+"." +
              // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
              "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

    var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
    '    <tr>'+
    '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
    '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
    '        </td>'+
    '    </tr>'+
    '    <tr>'+
    '        <td style="padding: 40px 30px 40px 30px;">'+
    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
    '                        Hello there <span>'+customerEmailName+'</span>,'+
    '                    </td>'+
    '                </tr>'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
    '                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
    '                    </td>'+
    '                </tr>'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
    '                        Kind regards,'+
    '                        <br>'+
    '                        '+mailFromName+''+
    '                    </td>'+
    '                </tr>'+
    '            </table>'+
    '        </td>'+
    '    </tr>'+
    '    <tr>'+
    '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
    '                <tr>'+
    '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
    '                        If you have any question, please do not hesitate to contact us.'+
    '                    </td>'+
    '                    <td align="right">'+
    '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
    '                    </td>'+
    '                </tr>'+
    '            </table>'+
    '        </td>'+
    '    </tr>'+
    '</table>';

        if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: checkEmailData,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                //window.open('/salesorderslist','_self');

              } else {

              }
          });

          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: mailFrom,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                window.open('/salesorderslist','_self');
              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                // window.open('/salesorderslist','_self');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else if(($('.chkEmailCopy').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: checkEmailData,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                //window.open('/salesorderslist','_self');

              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To Customer: "+checkEmailData+" ",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                 //window.open('/salesorderslist','_self');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else if(($('.chkEmailRep').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: mailFrom,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                //window.open('/salesorderslist','_self');
              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To User: "+mailFrom+" ",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                 //window.open('/salesorderslist','_self');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else{
          //window.open('/salesorderslist','_self');
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
               doc.addHTML(source, function () {
                  //pdf.save('Invoice.pdf');
                  resolve(doc.output('blob'));
                  // $('#html-2-pdfwrapper').css('display','none');
              });
          });
      }
        // End Send Email
        if(customerID !== " "){
            let customerEmailData = {
              type: "TCustomer",
              fields: {
              ID : customerID,
              Email : customerEmail
             }
          }
          // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        $('.fullScreenSpin').css('display','none');
        // window.open('/salesorderslist','_self');
      }).catch(function (err) {
        swal({
        title: 'Something went wrong',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
        }).then((result) => {
        if (result.value) {
         //Meteor._reload.reload();
        } else if (result.dismiss === 'cancel') {

        }
        });
            $('.fullScreenSpin').css('display','none');
      });

      }
    }else if(url.indexOf('?invid=') > 0){
        var getsale_id = url.split('?invid=');
        var currentSalesID = getsale_id[getsale_id.length-1];
        if(getsale_id[1]){
          currentSalesID = parseInt(currentSalesID);
          $('.tblPaymentcard > tbody > tr').each(function(){
            var lineID = this.id;
            let linetype = $('#'+lineID+" .colType").text();
            let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
            let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
            let Line = {
                  type: 'TGuiCustPaymentLines',
                  fields: {
                      TransType:linetype,
                      TransID:lineID,
                      // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                      //EnteredBy:empName || ' ',
                      // InvoiceId:currentSalesID,
                      //RefNo:reference,
                      Paid:true,
                      Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,

                  }
              };
              paymentData.push(Line);
          });
if(paymentAmt.replace(/[^0-9.-]+/g,"") < 0){
  let objDetails = {
         type: "TCustPayments",
         fields: {
             Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             AccountName:bankAccount,
             ClientPrintName:customer,
             CompanyName:customer,
             DeptClassName: department,
             // EmployeeName: empName || ' ',
             GUILines: paymentData,
             Notes:notes,
             Payment:true,
             // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
             PayMethodName: payMethod,

             ReferenceNo: reference

         }
     };

  paymentService.saveDepositData(objDetails).then(function (data) {
    var customerID = $('#edtCustomerEmail').attr('customerid');
    // Send Email
    $('#html-2-pdfwrapper').css('display','block');
      $('.pdfCustomerName').html($('#edtCustomerName').val());
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
               // console.log(base64data);
               pdfObject = {
                  filename: 'Customer Payment-' + invoiceId + '.pdf',
                  content: base64data,
                  encoding: 'base64'
              };
              attachment.push(pdfObject);
      // let mailBody = "VS1 Cloud Test";
      let erpInvoiceId = objDetails.fields.ID;


      let mailFromName = Session.get('vs1companyName');
      let mailFrom = localStorage.getItem('mySession');
      let customerEmailName = $('#edtCustomerName').val();
      let checkEmailData = $('#edtCustomerEmail').val();
      // let mailCC = templateObject.mailCopyToUsr.get();
      let grandtotal = $('#grandTotal').html();
      let amountDueEmail = $('#totalBalanceDue').html();
      let emailDueDate = $("#dtDueDate").val();
      let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
      let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
          // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
          "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
'    <tr>'+
'        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
'            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td style="padding: 40px 30px 40px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
'                        Hello there <span>'+customerEmailName+'</span>,'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
'                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
'                        Kind regards,'+
'                        <br>'+
'                        '+mailFromName+''+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
'                        If you have any question, please do not hesitate to contact us.'+
'                    </td>'+
'                    <td align="right">'+
'                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'</table>';

    if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {

          }
      });

      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailCopy').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To User: "+mailFrom+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else{
      Router.go('/paymentoverview?success=true');
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
           doc.addHTML(source, function () {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
          });
      });
  }
    // End Send Email
    if(customerID !== " "){
        let customerEmailData = {
          type: "TCustomer",
          fields: {
          ID : customerID,
          Email : customerEmail
         }
      }
      // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
      //
      // });
    };
    $('.fullScreenSpin').css('display','none');
    //Router.go('/paymentoverview?success=true');



  }).catch(function (err) {
    // Router.go('/paymentoverview?success=true');
    swal({
    title: 'Something went wrong',
    text: err,
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
     //Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
    });
        $('.fullScreenSpin').css('display','none');
  });
}else{
  let objDetails = {
         type: "TCustPayments",
         fields: {
             // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             AccountName:bankAccount,
             ClientPrintName:customer,
             CompanyName:customer,
             DeptClassName: department,
             // EmployeeName: empName || ' ',
             GUILines: paymentData,
             Notes:notes,
             Payment:true,
             // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
             PayMethodName: payMethod,

             ReferenceNo: reference

         }
     };

  paymentService.saveDepositData(objDetails).then(function (data) {
    var customerID = $('#edtCustomerEmail').attr('customerid');
    // Send Email
    $('#html-2-pdfwrapper').css('display','block');
      $('.pdfCustomerName').html($('#edtCustomerName').val());
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
               // console.log(base64data);
               pdfObject = {
                  filename: 'Customer Payment ' + invoiceId + '.pdf',
                  content: base64data,
                  encoding: 'base64'
              };
              attachment.push(pdfObject);
      // let mailBody = "VS1 Cloud Test";
      let erpInvoiceId = objDetails.fields.ID;


      let mailFromName = Session.get('vs1companyName');
      let mailFrom = localStorage.getItem('mySession');
      let customerEmailName = $('#edtCustomerName').val();
      let checkEmailData = $('#edtCustomerEmail').val();
      // let mailCC = templateObject.mailCopyToUsr.get();
      let grandtotal = $('#grandTotal').html();
      let amountDueEmail = $('#totalBalanceDue').html();
      let emailDueDate = $("#dtDueDate").val();
      let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
      let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
          // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
          "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
'    <tr>'+
'        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
'            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td style="padding: 40px 30px 40px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
'                        Hello there <span>'+customerEmailName+'</span>,'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
'                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
'                        Kind regards,'+
'                        <br>'+
'                        '+mailFromName+''+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
'                        If you have any question, please do not hesitate to contact us.'+
'                    </td>'+
'                    <td align="right">'+
'                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'</table>';

    if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {

          }
      });

      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailCopy').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To User: "+mailFrom+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else{
      Router.go('/paymentoverview?success=true');
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
           doc.addHTML(source, function () {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
          });
      });
  }
    // End Send Email
    if(customerID !== " "){
        let customerEmailData = {
          type: "TCustomer",
          fields: {
          ID : customerID,
          Email : customerEmail
         }
      }
      // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
      //
      // });
    };
    $('.fullScreenSpin').css('display','none');
    // Router.go('/paymentoverview?success=true');
  }).catch(function (err) {
    // Router.go('/paymentoverview?success=true');
    swal({
    title: 'Something went wrong',
    text: err,
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
     //Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
    });
        $('.fullScreenSpin').css('display','none');
  });
}


          }
    }else if(url.indexOf('?quoteid=') > 0){
            var getsale_id = url.split('?quoteid=');
            var currentSalesID = getsale_id[getsale_id.length-1];
            if(getsale_id[1]){
              currentSalesID = parseInt(currentSalesID);
              $('.tblPaymentcard > tbody > tr').each(function(){
                var lineID = this.id;

                let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
                let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
                let Line = {
                      type: 'TGuiCustPaymentLines',
                      fields: {
                        TransType:linetype,
                        // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                        //EnteredBy:empName || ' ',
                        // InvoiceId:currentSalesID,
                        //RefNo:reference,
                        Paid:true,
                        Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        TransID:lineID
                      }
                  };
                  paymentData.push(Line);
              });

              let objDetails = {
                     type: "TCustPayments",
                     fields: {
                         // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                         // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                         AccountName:bankAccount,
                         ClientPrintName:customer,
                         CompanyName:customer,
                         EmployeeName: empName || ' ',
                         GUILines: paymentData,
                         Notes:notes,
                         // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
                         PayMethodName: payMethod,
                         Payment:true,
                         ReferenceNo: reference,
                         Notes:notes
                     }
                 };

              paymentService.saveDepositData(objDetails).then(function (data) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                // Send Email
                $('#html-2-pdfwrapper').css('display','block');
                  $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                           // console.log(base64data);
                           pdfObject = {
                              filename: 'customerpayment-' + invoiceId + '.pdf',
                              content: base64data,
                              encoding: 'base64'
                          };
                          attachment.push(pdfObject);
                  // let mailBody = "VS1 Cloud Test";
                  let erpInvoiceId = objDetails.fields.ID;


                  let mailFromName = Session.get('vs1companyName');
                  let mailFrom = localStorage.getItem('mySession');
                  let customerEmailName = $('#edtCustomerName').val();
                  let checkEmailData = $('#edtCustomerEmail').val();
                  // let mailCC = templateObject.mailCopyToUsr.get();
                  let grandtotal = $('#grandTotal').html();
                  let amountDueEmail = $('#totalBalanceDue').html();
                  let emailDueDate = $("#dtDueDate").val();
                  let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
                  let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
                      // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
                      "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

            var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
            '    <tr>'+
            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
            '        </td>'+
            '    </tr>'+
            '    <tr>'+
            '        <td style="padding: 40px 30px 40px 30px;">'+
            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
            '                <tr>'+
            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
            '                        Hello there <span>'+customerEmailName+'</span>,'+
            '                    </td>'+
            '                </tr>'+
            '                <tr>'+
            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
            '                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
            '                    </td>'+
            '                </tr>'+
            '                <tr>'+
            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
            '                        Kind regards,'+
            '                        <br>'+
            '                        '+mailFromName+''+
            '                    </td>'+
            '                </tr>'+
            '            </table>'+
            '        </td>'+
            '    </tr>'+
            '    <tr>'+
            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
            '                <tr>'+
            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
            '                        If you have any question, please do not hesitate to contact us.'+
            '                    </td>'+
            '                    <td align="right">'+
            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
            '                    </td>'+
            '                </tr>'+
            '            </table>'+
            '        </td>'+
            '    </tr>'+
            '</table>';

                if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
                  Meteor.call('sendEmail', {
                      from: ""+mailFromName+" <"+mailFrom+">",
                      to: checkEmailData,
                      subject: mailSubject,
                      text: '',
                      html:htmlmailBody,
                      attachments : attachment
                  }, function (error, result) {
                      if (error && error.error === "error") {
                        window.open('/invoicelist','_self');

                      } else {

                      }
                  });

                  Meteor.call('sendEmail', {
                      from: ""+mailFromName+" <"+mailFrom+">",
                      to: mailFrom,
                      subject: mailSubject,
                      text: '',
                      html:htmlmailBody,
                      attachments : attachment
                  }, function (error, result) {
                      if (error && error.error === "error") {
                        window.open('/invoicelist','_self');
                      } else {
                        $('#html-2-pdfwrapper').css('display','none');
                        swal({
                        title: 'SUCCESS',
                        text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                        }).then((result) => {
                        if (result.value) {
                         window.open('/invoicelist','_self');
                        } else if (result.dismiss === 'cancel') {

                        }
                        });

                          $('.fullScreenSpin').css('display','none');
                      }
                  });

                }else if(($('.chkEmailCopy').is(':checked'))){
                  Meteor.call('sendEmail', {
                      from: ""+mailFromName+" <"+mailFrom+">",
                      to: checkEmailData,
                      subject: mailSubject,
                      text: '',
                      html:htmlmailBody,
                      attachments : attachment
                  }, function (error, result) {
                      if (error && error.error === "error") {
                        window.open('/invoicelist','_self');

                      } else {
                        $('#html-2-pdfwrapper').css('display','none');
                        swal({
                        title: 'SUCCESS',
                        text: "Email Sent To Customer: "+checkEmailData+" ",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                        }).then((result) => {
                        if (result.value) {
                         window.open('/invoicelist','_self');
                        } else if (result.dismiss === 'cancel') {

                        }
                        });

                          $('.fullScreenSpin').css('display','none');
                      }
                  });

                }else if(($('.chkEmailRep').is(':checked'))){
                  Meteor.call('sendEmail', {
                      from: ""+mailFromName+" <"+mailFrom+">",
                      to: mailFrom,
                      subject: mailSubject,
                      text: '',
                      html:htmlmailBody,
                      attachments : attachment
                  }, function (error, result) {
                      if (error && error.error === "error") {
                        window.open('/invoicelist','_self');
                      } else {
                        $('#html-2-pdfwrapper').css('display','none');
                        swal({
                        title: 'SUCCESS',
                        text: "Email Sent To User: "+mailFrom+" ",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                        }).then((result) => {
                        if (result.value) {
                         window.open('/invoicelist','_self');
                        } else if (result.dismiss === 'cancel') {

                        }
                        });

                          $('.fullScreenSpin').css('display','none');
                      }
                  });

                }else{
                  window.open('/invoicelist','_self');
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
                       doc.addHTML(source, function () {
                          //pdf.save('Invoice.pdf');
                          resolve(doc.output('blob'));
                          // $('#html-2-pdfwrapper').css('display','none');
                      });
                  });
              }
                // End Send Email
                if(customerID !== " "){
                    let customerEmailData = {
                      type: "TCustomer",
                      fields: {
                      ID : customerID,
                      Email : customerEmail
                     }
                  }
                  // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                  //
                  // });
                };
                $('.fullScreenSpin').css('display','none');
                // window.open('/invoicelist','_self');
              }).catch(function (err) {
                swal({
                title: 'Something went wrong',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                 //Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
                });
                    $('.fullScreenSpin').css('display','none');
              });

              }

    }else if((url.indexOf('?custname=') > 0) && (url.indexOf('from=') > 0)){
      let paymentID = templateObject.custpaymentid.get();
      $('.tblPaymentcard > tbody > tr').each(function(){
  var lineID = this.id;
  let linetype = $('#'+lineID+" .colType").text();
  let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
  let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
  let Line = {
        type: 'TGuiCustPaymentLines',
        fields: {
          TransType:linetype,
         TransID:lineID,
         // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
         //EnteredBy:empName || ' ',
         // InvoiceId:currentSalesID,
         //RefNo:reference,
         Paid:true,
         Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
        }
    };
    paymentData.push(Line);
});

      let objDetails = {
             type: "TCustPayments",
             fields: {
               // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                   // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                   AccountName:bankAccount,
                   ClientPrintName:customer,
                   CompanyName:customer,
                   DeptClassName: department,
                   // EmployeeName: empName || ' ',
                   GUILines: paymentData,
                   Notes:notes,
                   Payment:true,
                   // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
                   PayMethodName: payMethod,

                   ReferenceNo: reference
             }
         };

      paymentService.saveDepositData(objDetails).then(function (data) {
        var customerID = $('#edtCustomerEmail').attr('customerid');
        // Send Email
        $('#html-2-pdfwrapper').css('display','block');
          $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                   // console.log(base64data);
                   pdfObject = {
                      filename: 'customerpayment-' + invoiceId + '.pdf',
                      content: base64data,
                      encoding: 'base64'
                  };
                  attachment.push(pdfObject);
          // let mailBody = "VS1 Cloud Test";
          let erpInvoiceId = objDetails.fields.ID;


          let mailFromName = Session.get('vs1companyName');
          let mailFrom = localStorage.getItem('mySession');
          let customerEmailName = $('#edtCustomerName').val();
          let checkEmailData = $('#edtCustomerEmail').val();
          // let mailCC = templateObject.mailCopyToUsr.get();
          let grandtotal = $('#grandTotal').html();
          let amountDueEmail = $('#totalBalanceDue').html();
          let emailDueDate = $("#dtDueDate").val();
          let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
          let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
              // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
              "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

    var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
    '    <tr>'+
    '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
    '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
    '        </td>'+
    '    </tr>'+
    '    <tr>'+
    '        <td style="padding: 40px 30px 40px 30px;">'+
    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
    '                        Hello there <span>'+customerEmailName+'</span>,'+
    '                    </td>'+
    '                </tr>'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
    '                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
    '                    </td>'+
    '                </tr>'+
    '                <tr>'+
    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
    '                        Kind regards,'+
    '                        <br>'+
    '                        '+mailFromName+''+
    '                    </td>'+
    '                </tr>'+
    '            </table>'+
    '        </td>'+
    '    </tr>'+
    '    <tr>'+
    '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
    '                <tr>'+
    '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
    '                        If you have any question, please do not hesitate to contact us.'+
    '                    </td>'+
    '                    <td align="right">'+
    '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
    '                    </td>'+
    '                </tr>'+
    '            </table>'+
    '        </td>'+
    '    </tr>'+
    '</table>';

        if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: checkEmailData,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                Router.go('/paymentoverview?success=true');

              } else {

              }
          });

          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: mailFrom,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                Router.go('/paymentoverview?success=true');
              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                 Router.go('/paymentoverview?success=true');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else if(($('.chkEmailCopy').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: checkEmailData,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                Router.go('/paymentoverview?success=true');

              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To Customer: "+checkEmailData+" ",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                 Router.go('/paymentoverview?success=true');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else if(($('.chkEmailRep').is(':checked'))){
          Meteor.call('sendEmail', {
              from: ""+mailFromName+" <"+mailFrom+">",
              to: mailFrom,
              subject: mailSubject,
              text: '',
              html:htmlmailBody,
              attachments : attachment
          }, function (error, result) {
              if (error && error.error === "error") {
                Router.go('/paymentoverview?success=true');
              } else {
                $('#html-2-pdfwrapper').css('display','none');
                swal({
                title: 'SUCCESS',
                text: "Email Sent To User: "+mailFrom+" ",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.value) {
                 Router.go('/paymentoverview?success=true');
                } else if (result.dismiss === 'cancel') {

                }
                });

                  $('.fullScreenSpin').css('display','none');
              }
          });

        }else{
          Router.go('/paymentoverview?success=true');
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
               doc.addHTML(source, function () {
                  //pdf.save('Invoice.pdf');
                  resolve(doc.output('blob'));
                  // $('#html-2-pdfwrapper').css('display','none');
              });
          });
      }
        // End Send Email
        if(customerID !== " "){
            let customerEmailData = {
              type: "TCustomer",
              fields: {
              ID : customerID,
              Email : customerEmail
             }
          }
          // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        $('.fullScreenSpin').css('display','none');
        // Router.go('/paymentoverview?success=true');
      }).catch(function (err) {
        //Router.go('/paymentoverview?success=true');
        swal({
        title: 'Something went wrong',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
        }).then((result) => {
        if (result.value) {
         //Meteor._reload.reload();
        } else if (result.dismiss === 'cancel') {

        }
        });
            //Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
      });
    }else if((url.indexOf('?id=') > 0)){
      var getsale_id = url.split('?id=');
      var currentSalesID = getsale_id[getsale_id.length-1];
      let paymentID = parseInt(currentSalesID);

      // Send Email
      $('#html-2-pdfwrapper').css('display','block');
        $('.pdfCustomerName').html($('#edtCustomerName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        async function addAttachment() {
        let attachment = [];
        let templateObject = Template.instance();

            let invoiceId = paymentID;
            let encodedPdf = await generatePdfForMail(invoiceId);
            let pdfObject = "";
            var reader = new FileReader();
             reader.readAsDataURL(encodedPdf);
             reader.onloadend = function() {
                 var base64data = reader.result;
                 base64data = base64data.split(',')[1];
                 // console.log(base64data);
                 pdfObject = {
                    filename: 'customerpayment-' + invoiceId + '.pdf',
                    content: base64data,
                    encoding: 'base64'
                };
                attachment.push(pdfObject);
        // let mailBody = "VS1 Cloud Test";
        let erpInvoiceId = paymentID;


        let mailFromName = Session.get('vs1companyName');
        let mailFrom = localStorage.getItem('mySession');
        let customerEmailName = $('#edtCustomerName').val();
        let checkEmailData = $('#edtCustomerEmail').val();
        // let mailCC = templateObject.mailCopyToUsr.get();
        let grandtotal = $('#grandTotal').html();
        let amountDueEmail = $('#totalBalanceDue').html();
        let emailDueDate = $("#dtDueDate").val();
        let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
        let mailBody = "Hi "+customerEmailName+",\n\n Here's invoice "+erpInvoiceId+" for  "+grandtotal+"." +
            // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
            "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

  var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
  '    <tr>'+
  '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
  '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
  '        </td>'+
  '    </tr>'+
  '    <tr>'+
  '        <td style="padding: 40px 30px 40px 30px;">'+
  '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
  '                <tr>'+
  '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
  '                        Hello there <span>'+customerEmailName+'</span>,'+
  '                    </td>'+
  '                </tr>'+
  '                <tr>'+
  '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
  '                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
  '                    </td>'+
  '                </tr>'+
  '                <tr>'+
  '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
  '                        Kind regards,'+
  '                        <br>'+
  '                        '+mailFromName+''+
  '                    </td>'+
  '                </tr>'+
  '            </table>'+
  '        </td>'+
  '    </tr>'+
  '    <tr>'+
  '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
  '            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
  '                <tr>'+
  '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
  '                        If you have any question, please do not hesitate to contact us.'+
  '                    </td>'+
  '                    <td align="right">'+
  '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
  '                    </td>'+
  '                </tr>'+
  '            </table>'+
  '        </td>'+
  '    </tr>'+
  '</table>';

      if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
        Meteor.call('sendEmail', {
            from: ""+mailFromName+" <"+mailFrom+">",
            to: checkEmailData,
            subject: mailSubject,
            text: '',
            html:htmlmailBody,
            attachments : attachment
        }, function (error, result) {
            if (error && error.error === "error") {
              Router.go('/paymentoverview?success=true');

            } else {

            }
        });

        Meteor.call('sendEmail', {
            from: ""+mailFromName+" <"+mailFrom+">",
            to: mailFrom,
            subject: mailSubject,
            text: '',
            html:htmlmailBody,
            attachments : attachment
        }, function (error, result) {
            if (error && error.error === "error") {
              Router.go('/paymentoverview?success=true');
            } else {
              $('#html-2-pdfwrapper').css('display','none');
              swal({
              title: 'SUCCESS',
              text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
              }).then((result) => {
              if (result.value) {
               Router.go('/paymentoverview?success=true');
              } else if (result.dismiss === 'cancel') {

              }
              });

                $('.fullScreenSpin').css('display','none');
            }
        });

      }else if(($('.chkEmailCopy').is(':checked'))){
        Meteor.call('sendEmail', {
            from: ""+mailFromName+" <"+mailFrom+">",
            to: checkEmailData,
            subject: mailSubject,
            text: '',
            html:htmlmailBody,
            attachments : attachment
        }, function (error, result) {
            if (error && error.error === "error") {
              Router.go('/paymentoverview?success=true');

            } else {
              $('#html-2-pdfwrapper').css('display','none');
              swal({
              title: 'SUCCESS',
              text: "Email Sent To Customer: "+checkEmailData+" ",
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
              }).then((result) => {
              if (result.value) {
               Router.go('/paymentoverview?success=true');
              } else if (result.dismiss === 'cancel') {

              }
              });

                $('.fullScreenSpin').css('display','none');
            }
        });

      }else if(($('.chkEmailRep').is(':checked'))){
        Meteor.call('sendEmail', {
            from: ""+mailFromName+" <"+mailFrom+">",
            to: mailFrom,
            subject: mailSubject,
            text: '',
            html:htmlmailBody,
            attachments : attachment
        }, function (error, result) {
            if (error && error.error === "error") {
              Router.go('/paymentoverview?success=true');
            } else {
              $('#html-2-pdfwrapper').css('display','none');
              swal({
              title: 'SUCCESS',
              text: "Email Sent To User: "+mailFrom+" ",
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
              }).then((result) => {
              if (result.value) {
               Router.go('/paymentoverview?success=true');
              } else if (result.dismiss === 'cancel') {

              }
              });

                $('.fullScreenSpin').css('display','none');
            }
        });

      }else{
        Router.go('/paymentoverview?success=true');
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
             doc.addHTML(source, function () {
                //pdf.save('Invoice.pdf');
                resolve(doc.output('blob'));
                // $('#html-2-pdfwrapper').css('display','none');
            });
        });
    }
      // End Send Email
      // currentSalesID = parseInt(currentSalesID);
      $('.tblPaymentcard > tbody > tr').each(function(){
           var lineID = this.id;
           let linetype = $('#'+lineID+" .colType").text();
           let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
           let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
           let Line = {
                 type: 'TGuiCustPaymentLines',
                 fields: {
                   TransType:linetype,
                    TransID:lineID,
                    // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                    //EnteredBy:empName || ' ',
                    // InvoiceId:currentSalesID,
                    //RefNo:reference,
                    Paid:true,
                    Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                 }
             };
             paymentData.push(Line);
         });

      let objDetails = {
             type: "TCustPayments",
             fields: {
                 ID: paymentID,
                 // AccountName:bankAccount,
                 // ClientPrintName:customer,
                 // CompanyName:customer,
                 // DeptClassName: department,
                 Notes:notes,
                 // Payment:true,
                 // PayMethodName: payMethod,
                 ReferenceNo: reference
             }
         };

      paymentService.saveDepositData(objDetails).then(function (data) {
        var customerID = $('#edtCustomerEmail').attr('customerid');

        if(customerID !== " "){
            let customerEmailData = {
              type: "TCustomer",
              fields: {
              ID : customerID,
              Email : customerEmail
             }
          }
          // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
          //
          // });
        };
        $('.fullScreenSpin').css('display','none');

      }).catch(function (err) {
        // Router.go('/paymentoverview?success=true');
        // swal({
        // title: 'Something went wrong',
        // text: err,
        // type: 'error',
        // showCancelButton: false,
        // confirmButtonText: 'Try Again'
        // }).then((result) => {
        // if (result.value) {
        //  //Meteor._reload.reload();
        // } else if (result.dismiss === 'cancel') {
        //
        // }
        // });
            // $('.fullScreenSpin').css('display','none');
      });
    }else if(url.indexOf('?selectcust=') > 0){
        var getsale_id = url.split('?selectcust=');
        var currentSalesID = getsale_id[getsale_id.length-1];
        if(getsale_id[1]){
          // currentSalesID = parseInt(currentSalesID);
          $('.tblPaymentcard > tbody > tr').each(function(){
            var lineID = this.id;
            let linetype = $('#'+lineID+" .colType").text();
            let lineAmountDue = $('#'+lineID+" .lineAmountdue").text();
            let linePaymentAmt = $('#'+lineID+" .linePaymentamount").val();
            let Line = {
                  type: 'TGuiCustPaymentLines',
                  fields: {
                      TransType:linetype,
                      TransID:lineID,
                      // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                      //EnteredBy:empName || ' ',
                      // InvoiceId:currentSalesID,
                      //RefNo:reference,
                      Paid:true,
                      Payment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,

                  }
              };
              paymentData.push(Line);
          });
if(paymentAmt.replace(/[^0-9.-]+/g,"") < 0){
  let objDetails = {
         type: "TCustPayments",
         fields: {
             Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             AccountName:bankAccount,
             ClientPrintName:customer,
             CompanyName:customer,
             DeptClassName: department,
             // EmployeeName: empName || ' ',
             GUILines: paymentData,
             Notes:notes,
             Payment:true,
             // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
             PayMethodName: payMethod,

             ReferenceNo: reference

         }
     };

  paymentService.saveDepositData(objDetails).then(function (data) {
    var customerID = $('#edtCustomerEmail').attr('customerid');
    // Send Email
    $('#html-2-pdfwrapper').css('display','block');
      $('.pdfCustomerName').html($('#edtCustomerName').val());
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
               // console.log(base64data);
               pdfObject = {
                  filename: 'customerpayment-' + invoiceId + '.pdf',
                  content: base64data,
                  encoding: 'base64'
              };
              attachment.push(pdfObject);
      // let mailBody = "VS1 Cloud Test";
      let erpInvoiceId = objDetails.fields.ID;


      let mailFromName = Session.get('vs1companyName');
      let mailFrom = localStorage.getItem('mySession');
      let customerEmailName = $('#edtCustomerName').val();
      let checkEmailData = $('#edtCustomerEmail').val();
      // let mailCC = templateObject.mailCopyToUsr.get();
      let grandtotal = $('#grandTotal').html();
      let amountDueEmail = $('#totalBalanceDue').html();
      let emailDueDate = $("#dtDueDate").val();
      let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
      let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
          // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
          "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
'    <tr>'+
'        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
'            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td style="padding: 40px 30px 40px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
'                        Hello there <span>'+customerEmailName+'</span>,'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
'                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
'                        Kind regards,'+
'                        <br>'+
'                        '+mailFromName+''+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
'                        If you have any question, please do not hesitate to contact us.'+
'                    </td>'+
'                    <td align="right">'+
'                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'</table>';

    if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {

          }
      });

      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailCopy').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To User: "+mailFrom+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else{
      Router.go('/paymentoverview?success=true');
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
           doc.addHTML(source, function () {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
          });
      });
  }
    // End Send Email
    if(customerID !== " "){
        let customerEmailData = {
          type: "TCustomer",
          fields: {
          ID : customerID,
          Email : customerEmail
         }
      }
      // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
      //
      // });
    };
    $('.fullScreenSpin').css('display','none');
    // Router.go('/paymentoverview?success=true');
  }).catch(function (err) {
    // Router.go('/paymentoverview?success=true');
    swal({
    title: 'Something went wrong',
    text: err,
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
     //Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
    });
        $('.fullScreenSpin').css('display','none');
  });
}else{
  let objDetails = {
         type: "TCustPayments",
         fields: {
             // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
             AccountName:bankAccount,
             ClientPrintName:customer,
             CompanyName:customer,
             DeptClassName: department,
             // EmployeeName: empName || ' ',
             GUILines: paymentData,
             Notes:notes,
             Payment:true,
             // PaymentDate: moment(paymentDate).format('DD/MM/YYYY'),
             PayMethodName: payMethod,

             ReferenceNo: reference

         }
     };

  paymentService.saveDepositData(objDetails).then(function (data) {
    var customerID = $('#edtCustomerEmail').attr('customerid');
    // Send Email
    $('#html-2-pdfwrapper').css('display','block');
      $('.pdfCustomerName').html($('#edtCustomerName').val());
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
               // console.log(base64data);
               pdfObject = {
                  filename: 'customerpayment-' + invoiceId + '.pdf',
                  content: base64data,
                  encoding: 'base64'
              };
              attachment.push(pdfObject);
      // let mailBody = "VS1 Cloud Test";
      let erpInvoiceId = objDetails.fields.ID;


      let mailFromName = Session.get('vs1companyName');
      let mailFrom = localStorage.getItem('mySession');
      let customerEmailName = $('#edtCustomerName').val();
      let checkEmailData = $('#edtCustomerEmail').val();
      // let mailCC = templateObject.mailCopyToUsr.get();
      let grandtotal = $('#grandTotal').html();
      let amountDueEmail = $('#totalBalanceDue').html();
      let emailDueDate = $("#dtDueDate").val();
      let mailSubject = 'Payment '+erpInvoiceId+' from ' + mailFromName + ' for '+customerEmailName;
      let mailBody = "Hi "+customerEmailName+",\n\n Here's payment "+erpInvoiceId+" for  "+grandtotal+"." +
          // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
          "\n\nIf you have any questions, please let us know : "+mailFrom+".\n\nThanks,\n" + mailFromName;

var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
'    <tr>'+
'        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">'+
'            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td style="padding: 40px 30px 40px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">'+
'                        Hello there <span>'+customerEmailName+'</span>,'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">'+
'                        Please find payment <span>'+erpInvoiceId+'</span> attached below.'+
'                    </td>'+
'                </tr>'+
'                <tr>'+
'                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">'+
'                        Kind regards,'+
'                        <br>'+
'                        '+mailFromName+''+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'    <tr>'+
'        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">'+
'            <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
'                <tr>'+
'                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">'+
'                        If you have any question, please do not hesitate to contact us.'+
'                    </td>'+
'                    <td align="right">'+
'                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:'+mailFrom+'">Contact Us</a>'+
'                    </td>'+
'                </tr>'+
'            </table>'+
'        </td>'+
'    </tr>'+
'</table>';

    if(($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {

          }
      });

      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" and User: "+mailFrom+"",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailCopy').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: checkEmailData,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');

          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To Customer: "+checkEmailData+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else if(($('.chkEmailRep').is(':checked'))){
      Meteor.call('sendEmail', {
          from: ""+mailFromName+" <"+mailFrom+">",
          to: mailFrom,
          subject: mailSubject,
          text: '',
          html:htmlmailBody,
          attachments : attachment
      }, function (error, result) {
          if (error && error.error === "error") {
            Router.go('/paymentoverview?success=true');
          } else {
            $('#html-2-pdfwrapper').css('display','none');
            swal({
            title: 'SUCCESS',
            text: "Email Sent To User: "+mailFrom+" ",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.value) {
             Router.go('/paymentoverview?success=true');
            } else if (result.dismiss === 'cancel') {

            }
            });

              $('.fullScreenSpin').css('display','none');
          }
      });

    }else{
      Router.go('/paymentoverview?success=true');
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
           doc.addHTML(source, function () {
              //pdf.save('Invoice.pdf');
              resolve(doc.output('blob'));
              // $('#html-2-pdfwrapper').css('display','none');
          });
      });
  }
    // End Send Email
    if(customerID !== " "){
        let customerEmailData = {
          type: "TCustomer",
          fields: {
          ID : customerID,
          Email : customerEmail
         }
      }
      // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
      //
      // });
    };
    $('.fullScreenSpin').css('display','none');
    // Router.go('/paymentoverview?success=true');
  }).catch(function (err) {
    // Router.go('/paymentoverview?success=true');
    swal({
    title: 'Something went wrong',
    text: err,
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
     //Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
    });
        $('.fullScreenSpin').css('display','none');
  });
}


          }
    }

        // if(depositData[0].PayMethod !== ''){
        //     PayMethod = depositData[0].PayMethod;
        // }
        // else {
        //     PayMethod = 'Cash';
        // }
  },
  'keydown #edtPaymentAmount,keydown #lineOrginalamount,keydown #lineAmountdue,keydown #linePaymentamount, keydown #lineOutstandingAmount': function(event){
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
        event.keyCode == 46 || event.keyCode == 190) {
        } else {
            event.preventDefault();
        }
    },
    'blur #edtPaymentAmount': function(event){
      let paymentAmt = $(event.target).val();
      let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0;
      $('#edtPaymentAmount').val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
    },
    'blur .linePaymentamount': function(event){
      let paymentAmt = $(event.target).val();
      let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0;
       $(event.target).val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
      let $tblrows = $("#tblPaymentcard tbody tr");
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
    'click .btnBack':function(event){
      event.preventDefault();
      history.back(1);
    },
    'click .printConfirm' : function(event){
      $('#html-2-pdfwrapper').css('display','block');
      $('.pdfCustomerName').html($('#edtCustomerName').val());
      $('.pdfCustomerAddress').html($('#txabillingAddress').val());
      exportSalesToPdf();
  },
  'click .btnRemove': function(event){
   let templateObject = Template.instance();
   let utilityService = new UtilityService();
   var clicktimes = 0;
   var targetID = $(event.target).closest('tr').attr('id'); // table row ID
   $('#selectDeleteLineID').val(targetID);

   times++;
   if (times == 1) {
     $('#deleteLineModal').modal('toggle');
   }else{
   if($('#tblPaymentcard tbody>tr').length > 1){
     this.click;
     $(event.target).closest('tr').remove();
     event.preventDefault();
  let $tblrows = $("#tblPaymentcard tbody tr");
//if(selectLineID){
 let lineAmount = 0;
 let subGrandTotal = 0;
 let taxGrandTotal = 0;

     return false;

   }else{
     $('#deleteLineModal').modal('toggle');
   }

}
 },
 'click .btnDeletePayment': function(event){
   $('.fullScreenSpin').css('display','inline-block');
   let templateObject = Template.instance();
   let paymentService = new PaymentsService();
   var url = window.location.href;
   var getso_id = url.split('?id=');
   var currentInvoice = getso_id[getso_id.length-1];
   var objDetails = '';
   if(getso_id[1]){
   currentInvoice = parseInt(currentInvoice);
   var objDetails = {
      type: "TCustomerPayment",
      fields: {
          ID: currentInvoice,
          Deleted: true,
          Lines: null
      }
    };

    paymentService.deleteDepositData(objDetails).then(function (objDetails) {
      $('.modal-backdrop').css('display','none');
         Router.go('/paymentoverview?success=true');
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
 }else{
    Router.go('/paymentoverview?success=true');
 }

   // $('#deleteLineModal').modal('toggle');
  },
  'click .btnConfirmPayment': function(event){
    $('#deleteLineModal').modal('toggle');
   },
'click .btnDeleteLine': function(event){
  let templateObject = Template.instance();
  let utilityService = new UtilityService();
   let selectLineID = $('#selectDeleteLineID').val();
  if($('#tblPaymentcard tbody>tr').length > 1){
    this.click;

      $('#'+selectLineID).closest('tr').remove();
      //event.preventDefault();
      let $tblrows = $("#tblPaymentcard tbody tr");
   //if(selectLineID){
   let lineAmount = 0;
   let subGrandTotal = 0;
   let taxGrandTotal = 0;
      //return false;

    }else{
     this.click;
     $('#'+selectLineID).closest('tr').remove();

   }

   $('#deleteLineModal').modal('toggle');
 },
    'click .chkcolTransDate': function(event){
      if($(event.target).is(':checked')){
        $('.colTransDate').css('display','table-cell');
        $('.colTransDate').css('padding','.75rem');
        $('.colTransDate').css('vertical-align','top');
      }else{
        $('.colTransDate').css('display','none');
      }
    },
    'click .chkcolType': function(event){
      if($(event.target).is(':checked')){
        $('.colType').css('display','table-cell');
        $('.colType').css('padding','.75rem');
        $('.colType').css('vertical-align','top');
      }else{
        $('.colType').css('display','none');
      }
    },
    'click .chkcolTransNo': function(event){
      if($(event.target).is(':checked')){
        $('.colTransNo').css('display','table-cell');
        $('.colTransNo').css('padding','.75rem');
        $('.colTransNo').css('vertical-align','top');
      }else{
        $('.colTransNo').css('display','none');
      }
    },
    'click .chklineOrginalamount': function(event){
      if($(event.target).is(':checked')){
        $('.lineOrginalamount').css('display','table-cell');
        $('.lineOrginalamount').css('padding','.75rem');
        $('.lineOrginalamount').css('vertical-align','top');
      }else{
        $('.lineOrginalamount').css('display','none');
      }
    },
    'click .chklineAmountdue': function(event){
      if($(event.target).is(':checked')){
        $('.lineAmountdue').css('display','table-cell');
        $('.lineAmountdue').css('padding','.75rem');
        $('.lineAmountdue').css('vertical-align','top');
      }else{
        $('.lineAmountdue').css('display','none');
      }
    },
    'click .chklinePaymentamount': function(event){
      if($(event.target).is(':checked')){
        $('.linePaymentamount').css('display','table-cell');
        $('.linePaymentamount').css('padding','.75rem');
        $('.linePaymentamount').css('vertical-align','top');
      }else{
        $('.linePaymentamount').css('display','none');
      }
    },
    'click .chklineOutstandingAmount': function(event){
      if($(event.target).is(':checked')){
        $('.lineOutstandingAmount').css('display','table-cell');
        $('.lineOutstandingAmount').css('padding','.75rem');
        $('.lineOutstandingAmount').css('vertical-align','top');
      }else{
        $('.lineOutstandingAmount').css('display','none');
      }
    },
    'click .chkcolComments': function(event){
      if($(event.target).is(':checked')){
        $('.colComments').css('display','table-cell');
        $('.colComments').css('padding','.75rem');
        $('.colComments').css('vertical-align','top');
      }else{
        $('.colComments').css('display','none');
      }
    },
    'change .rngRangeTransDate' : function(event){
      let range = $(event.target).val();
      $(".spWidthTransDate").html(range+'%');
      $('.colTransDate').css('width',range+'%');
    },
    'change .rngRangeType' : function(event){
      let range = $(event.target).val();
      $(".spWidthType").html(range+'%');
      $('.colType').css('width',range+'%');
    },
    'change .rngRangeTransNo' : function(event){
      let range = $(event.target).val();
      $(".spWidthTransNo").html(range+'%');
      $('.colTransNo').css('width',range+'%');
    },
    'change .rngRangelineOrginalamount' : function(event){
      let range = $(event.target).val();
      $(".spWidthlineOrginalamount").html(range+'%');
      $('.lineOrginalamount').css('width',range+'%');
    },
    'change .rngRangeAmountdue' : function(event){
      let range = $(event.target).val();
      $(".spWidthAmountdue").html(range+'%');
      $('.lineAmountdue').css('width',range+'%');
    },
    'change .rngRangePaymentAmount' : function(event){
      let range = $(event.target).val();
      $(".spWidthPaymentAmount").html(range+'%');
      $('.linePaymentamount').css('width',range+'%');
    },
    'change .rngRangeOutstandingAmount' : function(event){
      let range = $(event.target).val();
      $(".spWidthOutstandingAmount").html(range+'%');
      $('.lineOutstandingAmount').css('width',range+'%');
    },
    'change .rngRangeComments' : function(event){
      let range = $(event.target).val();
      $(".spWidthComments").html(range+'%');
      $('.colComments').css('width',range+'%');
    },
    'click .btnResetGridSettings': function(event){
      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblPaymentcard'});
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
    'click .btnSaveGridSettings': function(event){

      let lineItems = [];
      //let lineItemObj = {};
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
        // var price = $tblrow.find(".lineUnitPrice").text()||0;
        // var taxcode = $tblrow.find(".lineTaxRate").text()||0;

      });


      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblPaymentcard'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblPaymentcard',published:true,
              customFields:lineItems,
              updatedAt: new Date() }}, function(err, idTag) {
              if (err) {
                $('#myModal2').modal('toggle');
                //window.open('/invoiceslist','_self');
              } else {
                $('#myModal2').modal('toggle');
                //window.open('/invoiceslist','_self');

              }
            });

          }else{
            CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblPaymentcard',published:true,
              customFields:lineItems,
              createdAt: new Date() }, function(err, idTag) {
              if (err) {
                $('#myModal2').modal('toggle');
                //window.open('/invoiceslist','_self');
              } else {
                $('#myModal2').modal('toggle');
                //window.open('/invoiceslist','_self');

              }
            });
             // console.log(checkPrefDetails);
          }
        }
      }
    },
    'blur .divcolumn' : function(event){
      let columData = $(event.target).html();
      let columHeaderUpdate = $(event.target).attr("valueupdate");
      $(""+columHeaderUpdate+"").html(columData);

    },
    'click .chkEmailCopy':function(event){
      $('#edtCustomerEmail').val($('#edtCustomerEmail').val().replace(/\s/g, ''));
      if($(event.target).is(':checked')){
        let checkEmailData = $('#edtCustomerEmail').val();

        if(checkEmailData.replace(/\s/g, '') === ''){
          swal('Customer Email cannot be blank!', '', 'warning');
          event.preventDefault();
        }else{
          // alert('here 1');
          function isEmailValid(mailTo) {
            return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
          };
          if(!isEmailValid(checkEmailData)){
            swal('The email field must be a valid email address !', '', 'warning');

            event.preventDefault();
            return false;
          }else{


          }
        }
      }else{

      }
    }
});
