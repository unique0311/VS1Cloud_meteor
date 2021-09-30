import { SalesBoardService } from './sales-service';
import { PurchaseBoardService } from './purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import { AccountService } from "../accounts/account-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';

import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';


import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.chequecard.onCreated(() => {

    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.ChequeNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.chequerecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.accounts = new ReactiveVar([]);
    templateObject.ChequeId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);

    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();

    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.accountnamerecords = new ReactiveVar();
    templateObject.viarecords = new ReactiveVar([]);
});
Template.chequecard.onRendered(() => {

    $(window).on('load', function() {
        var win = $(this); //this = window
        if (win.width() <= 1024 && win.width() >= 450) {
            $("#colBalanceDue").addClass("order-12");
        }

        if (win.width() <= 926) {
            $("#totalSection").addClass("offset-md-6");
        }

    });

    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };


    const templateObject = Template.instance();


    const records = [];
    let viarecords = [];
    let purchaseService = new PurchaseBoardService();
    let clientsService = new PurchaseBoardService();
    let productsService = new PurchaseBoardService();

    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];
    const termrecords = [];
    const statusList = [];
    let newChequeID = 0;

    templateObject.getAllCheques = function() {
        clientsService.getAllChequeList1().then(function(data) {
            let newChequeID = 1;
            if(data.tcheque.length > 0){
                lastCheque = data.tcheque[data.tcheque.length - 1]
                newChequeID = parseInt(lastCheque.Id) + 1;
            } else{

            }
            $('.heading').html('New ' + chequeSpelling + ' #' + newChequeID + '<a role="button" data-toggle="modal" href="#helpViewModal"  style="font-size: 20px;">Help <i class="fa fa-question-circle-o" style="font-size: 20px; margin-left: 8px;"></i></a>  <a class="btn" role="button" data-toggle="modal" href="#myModal4" style="float: right;"><i class="icon ion-android-more-horizontal"></i></a><!--<button class="btn float-right" type="button" id="btnCustomFileds" name="btnCustomFileds"><i class="icon ion-android-more-horizontal"></i></button>-->');

        });
    }

    /*$(document).ready(function() {
        history.pushState(null, document.title, location.href);
        window.addEventListener('popstate', function(event) {
            swal({
                title: 'Save Or Cancel To Continue',
                text: "Do you want to Save or Cancel this transaction?",
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Save'
            }).then((result) => {
                if (result.value) {
                    $(".btnSave").trigger("click");
                } else if (result.dismiss === 'cancel') {
                    window.open('/chequelist', '_self');
                } else {

                }
            });
        });
    });*/


    $("#date-input,#dtSODate,#dtDueDate").datepicker({
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


    $(document).ready(function() {
        $('#formCheck-one').click(function() {


            if ($(event.target).is(':checked')) {
                $('.checkbox1div').css('display', 'block');
            } else {
                $('.checkbox1div').css('display', 'none');
            }
        });
        $('#formCheck-two').click(function() {


            if ($(event.target).is(':checked')) {
                $('.checkbox2div').css('display', 'block');
            } else {
                $('.checkbox2div').css('display', 'none');
            }
        });

        $('.customField1Text').blur(function() {
            var inputValue1 = $('.customField1Text').text();
            $('.lblCustomField1').text(inputValue1);
        });

        $('.customField2Text').blur(function() {
            var inputValue2 = $('.customField2Text').text();
            $('.lblCustomField2').text(inputValue2);
        });


    });
    $('.fullScreenSpin').css('display', 'inline-block');
    templateObject.getAllClients = function() {
        getVS1Data('TSupplierVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getSupplierVS1().then(function(data) {
                    for (let i in data.tsuppliervs1) {

                        let supplierrecordObj = {
                            supplierid: data.tsuppliervs1[i].Id || ' ',
                            suppliername: data.tsuppliervs1[i].ClientName || ' ',
                            supplieremail: data.tsuppliervs1[i].Email || ' ',
                            street: data.tsuppliervs1[i].Street || ' ',
                            street2: data.tsuppliervs1[i].Street2 || ' ',
                            street3: data.tsuppliervs1[i].Street3 || ' ',
                            suburb: data.tsuppliervs1[i].Suburb || ' ',
                            statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                            country: data.tsuppliervs1[i].Country || ' ',
                            termsName: data.tsuppliervs1[i].TermsName || ''
                        };

                        clientList.push(supplierrecordObj);


                    }

                    templateObject.clientrecords.set(clientList.sort(function(a, b) {
                        if (a.suppliername == 'NA') {
                            return 1;
                        } else if (b.suppliername == 'NA') {
                            return -1;
                        }
                        return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                    }));

                    for (var i = 0; i < clientList.length; i++) {
                        //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                    }
                    if (FlowRouter.current().queryParams.id) {

                    } else {
                        setTimeout(function() {
                            $('#edtSupplierName').trigger("click");
                        }, 200);
                    }

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsuppliervs1;
                for (let i in useData) {

                    let supplierrecordObj = {
                        supplierid: useData[i].fields.ID || ' ',
                        suppliername: useData[i].fields.ClientName || ' ',
                        supplieremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || ''
                    };

                    clientList.push(supplierrecordObj);


                }

                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.suppliername == 'NA') {
                        return 1;
                    } else if (b.suppliername == 'NA') {
                        return -1;
                    }
                    return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtSupplierName').trigger("click");
                    }, 100);
                }

            }
        }).catch(function(err) {
            clientsService.getSupplierVS1().then(function(data) {
                for (let i in data.tsuppliervs1) {

                    let supplierrecordObj = {
                        supplierid: data.tsuppliervs1[i].Id || ' ',
                        suppliername: data.tsuppliervs1[i].ClientName || ' ',
                        supplieremail: data.tsuppliervs1[i].Email || ' ',
                        street: data.tsuppliervs1[i].Street || ' ',
                        street2: data.tsuppliervs1[i].Street2 || ' ',
                        street3: data.tsuppliervs1[i].Street3 || ' ',
                        suburb: data.tsuppliervs1[i].Suburb || ' ',
                        statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                        country: data.tsuppliervs1[i].Country || ' ',
                        termsName: data.tsuppliervs1[i].TermsName || ''
                    };

                    clientList.push(supplierrecordObj);


                }

                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.suppliername == 'NA') {
                        return 1;
                    } else if (b.suppliername == 'NA') {
                        return -1;
                    }
                    return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtSupplierName').trigger("click");
                    }, 200);
                }

            });
        });
    };



    templateObject.getAllLeadStatuss = function() {
        getVS1Data('TLeadStatusType').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getAllLeadStatus().then(function(data) {
                    for (let i in data.tleadstatustype) {
                        let leadrecordObj = {
                            orderstatus: data.tleadstatustype[i].TypeName || ' '

                        };

                        statusList.push(leadrecordObj);
                    }
                    templateObject.statusrecords.set(statusList);


                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tleadstatustype;
                for (let i in useData) {
                    let leadrecordObj = {
                        orderstatus: useData[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);

            }
            setTimeout(function () {
                $('#sltStatus').append('<option value="newstatus">New Lead Status</option>');
            }, 1500)
        }).catch(function(err) {
            clientsService.getAllLeadStatus().then(function(data) {
                for (let i in data.tleadstatustype) {
                    let leadrecordObj = {
                        orderstatus: data.tleadstatustype[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);


            });
        });
    };



    templateObject.getAllClients();
    templateObject.getAllLeadStatuss();
    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentCheque = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentCheque = parseInt(currentCheque);
            $('.printID').attr("id", currentCheque);
            templateObject.getChequeData = function() {

                getVS1Data('TCheque').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        purchaseService.getOneChequeDataEx(currentCheque).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};
                            let exchangeCode = data.fields.ForeignExchangeCode;
                            let currencySymbol = Currency;
                            let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            let totalBalance = currencySymbol + '' + data.fields.TotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 });
                            if (data.fields.Lines) {
                                if (data.fields.Lines.length) {
                                    for (let i = 0; i < data.fields.Lines.length; i++) {
                                        let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines[i].fields.ID || '',
                                            accountname: data.fields.Lines[i].fields.AccountName || '',
                                            memo: data.fields.Lines[i].fields.ProductDescription || '',
                                            item: data.fields.Lines[i].fields.ProductName || '',
                                            description: data.fields.Lines[i].fields.ProductDescription || '',
                                            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };

                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal)
                                    let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines.fields.ID || '',
                                        accountname: data.fields.Lines.fields.AccountName || '',
                                        memo: data.fields.Lines.fields.ProductDescription || '',
                                        description: data.fields.Lines.fields.ProductDescription || '',
                                        quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                            } else {
                                lineItemObj = {
                                    lineID: Random.id(),
                                    item: '',
                                    accountname: '',
                                    memo: '',
                                    description: '',
                                    quantity: '',
                                    unitPrice: 0,
                                    taxRate: 0,
                                    taxCode: '',
                                    TotalAmt: 0,
                                    curTotalAmt: 0,
                                    TaxTotal: 0,
                                    TaxRate: 0,

                                };


                                lineItems.push(lineItemObj);
                            }

                            let chequerecord = {
                                id: data.fields.ID,
                                lid: 'Edit ' + chequeSpelling + ' ' + data.fields.ID,
                                bankaccount: data.fields.GLAccountName,
                                sosupplier: data.fields.SupplierName,
                                billto: data.fields.OrderTo,
                                shipto: data.fields.ShipTo,
                                shipping: data.fields.Shipping,
                                docnumber: data.fields.DocNumber,
                                custPONumber: data.fields.CustPONumber,
                                saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                                duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                employeename: data.fields.EmployeeName,
                                status: data.fields.OrderStatus,
                                invoicenumber: data.fields.SupplierInvoiceNumber,
                                comments: data.fields.Comments,
                                pickmemo: data.fields.SalesComments,
                                ponumber: data.fields.CustPONumber,
                                via: data.fields.Shipping,
                                connote: data.fields.ConNote,
                                reference: data.fields.RefNo,
                                currency: data.fields.ForeignExchangeCode,
                                branding: data.fields.MedType,
                                invoiceToDesc: data.fields.OrderTo,
                                shipToDesc: data.fields.ShipTo,
                                termsName: data.fields.TermsName,
                                Total: totalInc,
                                LineItems: lineItems,
                                isReconciled:data.fields.Isreconciled,
                                TotalTax: totalTax,
                                SubTotal: subTotal,
                                balanceDue: totalBalance,
                                saleCustField1: data.fields.SaleLineRef,
                                saleCustField2: data.fields.SalesComments,
                                totalPaid: totalPaidAmount,
                                ispaid: data.fields.IsPaid
                            };

                            $('#edtSupplierName').val(data.fields.SupplierName);
                            $('#sltBankAccountName').val(data.fields.GLAccountName);
                            templateObject.CleintName.set(data.fields.SupplierName);
                            $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                            if(data.fields.Isreconciled){
                              $(".btnDeleteCheque").prop("disabled", true);
                              $(".btnRemove").prop("disabled", true);
                              $(".btnSave").prop("disabled", true);
                              $("#form :input").prop("disabled", true);
                              $(".btn_Attachment").prop("disabled", true);
                            }


                            $(".printConfirm").prop("disabled", false);
                            $(".btnBack").prop("disabled", false);
                            $(".close").prop("disabled", false);
                            $(".closeModal").prop("disabled", false);
                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);
                                }
                            }

                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].suppliername == data.fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                        $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                    }
                                }
                            }

                            templateObject.chequerecord.set(chequerecord);

                            templateObject.selectedCurrency.set(chequerecord.currency);
                            templateObject.inputSelectedCurrency.set(chequerecord.currency);
                            if (templateObject.chequerecord.get()) {





                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblChequeLine', function(error, result) {
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
                                                    $("" + columHeaderUpdate + "").css('width', columnWidth);
                                                }

                                                if (hiddenColumn == true) {


                                                    $("." + columnClass + "").addClass('hiddenColumn');
                                                    $("." + columnClass + "").removeClass('showColumn');
                                                } else if (hiddenColumn == false) {
                                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                                    $("." + columnClass + "").addClass('showColumn');



                                                }

                                            }
                                        }

                                    }
                                });
                            }
                        }).catch(function(err) {
                            swal({
                                title: 'Oooops...',
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

                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tchequeex;
                        var added = false;
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentCheque) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = useData[d].fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalInc = currencySymbol + '' + useData[d].fields.TotalAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let subTotal = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalTax = currencySymbol + '' + useData[d].fields.TotalTax.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalBalance = currencySymbol + '' + useData[d].fields.TotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalPaidAmount = currencySymbol + '' + useData[d].fields.TotalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                if (useData[d].fields.Lines) {
                                    if (useData[d].fields.Lines.length) {
                                        for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                            let AmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                            let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineTaxTotal);
                                            let TaxRateGbp = (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                            lineItemObj = {
                                                lineID: Random.id(),
                                                id: useData[d].fields.Lines[i].fields.ID || '',
                                                accountname: useData[d].fields.Lines[i].fields.AccountName || '',
                                                memo: useData[d].fields.Lines[i].fields.ProductDescription || '',
                                                item: useData[d].fields.Lines[i].fields.ProductName || '',
                                                description: useData[d].fields.Lines[i].fields.ProductDescription || '',
                                                quantity: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                                unitPrice: currencySymbol + '' + useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                                lineCost: currencySymbol + '' + useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                                taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                                taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                                TotalAmt: AmountGbp || 0,
                                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                                TaxTotal: TaxTotalGbp || 0,
                                                TaxRate: TaxRateGbp || 0,

                                            };

                                            lineItemsTable.push(dataListTable);
                                            lineItems.push(lineItemObj);
                                        }
                                    } else {
                                        let AmountGbp = useData[d].fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                        let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines.fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = currencySymbol + '' + useData[d].fields.Lines.fields.LineTaxTotal;
                                        let TaxRateGbp = currencySymbol + '' + useData[d].fields.Lines.fields.LineTaxRate;
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: useData[d].fields.Lines.fields.ID || '',
                                            accountname: useData[d].fields.Lines.fields.AccountName || '',
                                            memo: useData[d].fields.Lines.fields.ProductDescription || '',
                                            description: useData[d].fields.Lines.fields.ProductDescription || '',
                                            quantity: useData[d].fields.Lines.fields.UOMOrderQty || 0,
                                            unitPrice: useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            lineCost: useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0
                                        };
                                        lineItems.push(lineItemObj);
                                    }

                                } else {
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        item: '',
                                        accountname: '',
                                        memo: '',
                                        description: '',
                                        quantity: '',
                                        unitPrice: 0,
                                        taxRate: 0,
                                        taxCode: '',
                                        TotalAmt: 0,
                                        curTotalAmt: 0,
                                        TaxTotal: 0,
                                        TaxRate: 0,

                                    };


                                    lineItems.push(lineItemObj);
                                }

                                let chequerecord = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit ' + chequeSpelling + ' ' + useData[d].fields.ID,
                                    bankaccount: useData[d].fields.GLAccountName,
                                    sosupplier: useData[d].fields.SupplierName,
                                    billto: useData[d].fields.OrderTo,
                                    shipto: useData[d].fields.ShipTo,
                                    shipping: useData[d].fields.Shipping,
                                    docnumber: useData[d].fields.DocNumber,
                                    custPONumber: useData[d].fields.CustPONumber,
                                    saledate: useData[d].fields.OrderDate ? moment(useData[d].fields.OrderDate).format('DD/MM/YYYY') : "",
                                    duedate: useData[d].fields.DueDate ? moment(useData[d].fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: useData[d].fields.EmployeeName,
                                    status: useData[d].fields.OrderStatus,
                                    invoicenumber: useData[d].fields.SupplierInvoiceNumber,
                                    comments: useData[d].fields.Comments,
                                    pickmemo: useData[d].fields.SalesComments,
                                    ponumber: useData[d].fields.CustPONumber,
                                    via: useData[d].fields.Shipping,
                                    connote: useData[d].fields.ConNote,
                                    reference: useData[d].fields.RefNo,
                                    currency: useData[d].fields.ForeignExchangeCode,
                                    branding: useData[d].fields.MedType,
                                    invoiceToDesc: useData[d].fields.OrderTo,
                                    shipToDesc: useData[d].fields.ShipTo,
                                    termsName: useData[d].fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    isReconciled:useData[d].fields.Isreconciled,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: useData[d].fields.SaleLineRef,
                                    saleCustField2: useData[d].fields.SalesComments,
                                    totalPaid: totalPaidAmount,
                                    ispaid: useData[d].fields.IsPaid
                                };

                                $('#edtSupplierName').val(useData[d].fields.SupplierName);
                                $('#sltBankAccountName').val(useData[d].fields.GLAccountName);
                                templateObject.CleintName.set(useData[d].fields.SupplierName);
                                $('#sltCurrency').val(useData[d].fields.ForeignExchangeCode);

                                if(useData[d].fields.Isreconciled){
                                  $(".btnDeleteCheque").prop("disabled", true);
                                  $(".btnRemove").prop("disabled", true);
                                  $(".btnSave").prop("disabled", true);
                                  $("#form :input").prop("disabled", true);
                                  $(".btn_Attachment").prop("disabled", true);
                                }


                                $(".printConfirm").prop("disabled", false);
                                $(".btnBack").prop("disabled", false);
                                $(".close").prop("disabled", false);
                                $(".closeModal").prop("disabled", false);
                                templateObject.attachmentCount.set(0);
                                if (useData[d].fields.Attachments) {
                                    if (useData[d].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[d].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[d].fields.Attachments);
                                    }
                                }

                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].suppliername == useData[d].fields.SupplierName) {
                                            $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                            $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                        }
                                    }
                                }

                                templateObject.chequerecord.set(chequerecord);

                                templateObject.selectedCurrency.set(chequerecord.currency);
                                templateObject.inputSelectedCurrency.set(chequerecord.currency);
                                if (templateObject.chequerecord.get()) {





                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblChequeLine', function(error, result) {
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
                                                        $("" + columHeaderUpdate + "").css('width', columnWidth);
                                                    }

                                                    if (hiddenColumn == true) {


                                                        $("." + columnClass + "").addClass('hiddenColumn');
                                                        $("." + columnClass + "").removeClass('showColumn');
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');



                                                    }

                                                }
                                            }

                                        }
                                    });
                                }
                            }
                        }

                        if (!added) {
                            purchaseService.getOneChequeDataEx(currentCheque).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = data.fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalBalance = currencySymbol + '' + data.fields.TotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                if (data.fields.Lines) {
                                    if (data.fields.Lines.length) {
                                        for (let i = 0; i < data.fields.Lines.length; i++) {
                                            let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                            let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                            lineItemObj = {
                                                lineID: Random.id(),
                                                id: data.fields.Lines[i].fields.ID || '',
                                                accountname: data.fields.Lines[i].fields.AccountName || '',
                                                memo: data.fields.Lines[i].fields.ProductDescription || '',
                                                item: data.fields.Lines[i].fields.ProductName || '',
                                                description: data.fields.Lines[i].fields.ProductDescription || '',
                                                quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                                unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                                lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                                TotalAmt: AmountGbp || 0,
                                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                                TaxTotal: TaxTotalGbp || 0,
                                                TaxRate: TaxRateGbp || 0,

                                            };

                                            lineItemsTable.push(dataListTable);
                                            lineItems.push(lineItemObj);
                                        }
                                    } else {
                                        let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                        let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines.fields.ID || '',
                                            accountname: data.fields.Lines.fields.AccountName || '',
                                            memo: data.fields.Lines.fields.ProductDescription || '',
                                            description: data.fields.Lines.fields.ProductDescription || '',
                                            quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                            unitPrice: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0
                                        };
                                        lineItems.push(lineItemObj);
                                    }

                                } else {
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        item: '',
                                        accountname: '',
                                        memo: '',
                                        description: '',
                                        quantity: '',
                                        unitPrice: 0,
                                        taxRate: 0,
                                        taxCode: '',
                                        TotalAmt: 0,
                                        curTotalAmt: 0,
                                        TaxTotal: 0,
                                        TaxRate: 0,

                                    };


                                    lineItems.push(lineItemObj);
                                }

                                let chequerecord = {
                                    id: data.fields.ID,
                                    lid: 'Edit ' + chequeSpelling + ' ' + data.fields.ID,
                                    bankaccount: data.fields.GLAccountName,
                                    sosupplier: data.fields.SupplierName,
                                    billto: data.fields.OrderTo,
                                    shipto: data.fields.ShipTo,
                                    shipping: data.fields.Shipping,
                                    docnumber: data.fields.DocNumber,
                                    custPONumber: data.fields.CustPONumber,
                                    saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: data.fields.EmployeeName,
                                    status: data.fields.OrderStatus,
                                    invoicenumber: data.fields.SupplierInvoiceNumber,
                                    comments: data.fields.Comments,
                                    pickmemo: data.fields.SalesComments,
                                    ponumber: data.fields.CustPONumber,
                                    via: data.fields.Shipping,
                                    connote: data.fields.ConNote,
                                    reference: data.fields.RefNo,
                                    currency: data.fields.ForeignExchangeCode,
                                    branding: data.fields.MedType,
                                    invoiceToDesc: data.fields.OrderTo,
                                    shipToDesc: data.fields.ShipTo,
                                    termsName: data.fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    isReconciled:data.fields.Isreconciled,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: data.fields.SaleLineRef,
                                    saleCustField2: data.fields.SalesComments,
                                    totalPaid: totalPaidAmount,
                                    ispaid: data.fields.IsPaid
                                };

                                $('#edtSupplierName').val(data.fields.SupplierName);
                                $('#sltBankAccountName').val(data.fields.GLAccountName);
                                templateObject.CleintName.set(data.fields.SupplierName);
                                $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                                if(data.fields.Isreconciled){
                                  $(".btnDeleteCheque").prop("disabled", true);
                                  $(".btnRemove").prop("disabled", true);
                                  $(".btnSave").prop("disabled", true);
                                  $("#form :input").prop("disabled", true);
                                  $(".btn_Attachment").prop("disabled", true);
                                }


                                $(".printConfirm").prop("disabled", false);
                                $(".btnBack").prop("disabled", false);
                                $(".close").prop("disabled", false);
                                $(".closeModal").prop("disabled", false);
                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);
                                    }
                                }

                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].suppliername == data.fields.SupplierName) {
                                            $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                            $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                        }
                                    }
                                }

                                templateObject.chequerecord.set(chequerecord);

                                templateObject.selectedCurrency.set(chequerecord.currency);
                                templateObject.inputSelectedCurrency.set(chequerecord.currency);
                                if (templateObject.chequerecord.get()) {





                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblChequeLine', function(error, result) {
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
                                                        $("" + columHeaderUpdate + "").css('width', columnWidth);
                                                    }

                                                    if (hiddenColumn == true) {


                                                        $("." + columnClass + "").addClass('hiddenColumn');
                                                        $("." + columnClass + "").removeClass('showColumn');
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');



                                                    }

                                                }
                                            }

                                        }
                                    });
                                }
                            }).catch(function(err) {
                                swal({
                                    title: 'Oooops...',
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

                            });
                        }
                    }
                }).catch(function(err) {
                    purchaseService.getOneChequeDataEx(currentCheque).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        let exchangeCode = data.fields.ForeignExchangeCode;
                        let currencySymbol = Currency;
                        let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        let totalBalance = currencySymbol + '' + data.fields.TotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        if (data.fields.Lines) {
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                    let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                    let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines[i].fields.ID || '',
                                        accountname: data.fields.Lines[i].fields.AccountName || '',
                                        memo: data.fields.Lines[i].fields.ProductDescription || '',
                                        item: data.fields.Lines[i].fields.ProductName || '',
                                        description: data.fields.Lines[i].fields.ProductDescription || '',
                                        quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0,

                                    };

                                    lineItemsTable.push(dataListTable);
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, { minimumFractionDigits: 2 });
                                let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal)
                                let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines.fields.ID || '',
                                    accountname: data.fields.Lines.fields.AccountName || '',
                                    memo: data.fields.Lines.fields.ProductDescription || '',
                                    description: data.fields.Lines.fields.ProductDescription || '',
                                    quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                    unitPrice: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }

                        } else {
                            lineItemObj = {
                                lineID: Random.id(),
                                item: '',
                                accountname: '',
                                memo: '',
                                description: '',
                                quantity: '',
                                unitPrice: 0,
                                taxRate: 0,
                                taxCode: '',
                                TotalAmt: 0,
                                curTotalAmt: 0,
                                TaxTotal: 0,
                                TaxRate: 0,

                            };


                            lineItems.push(lineItemObj);
                        }

                        let chequerecord = {
                            id: data.fields.ID,
                            lid: 'Edit ' + chequeSpelling + ' ' + data.fields.ID,
                            bankaccount: data.fields.GLAccountName,
                            sosupplier: data.fields.SupplierName,
                            billto: data.fields.OrderTo,
                            shipto: data.fields.ShipTo,
                            shipping: data.fields.Shipping,
                            docnumber: data.fields.DocNumber,
                            custPONumber: data.fields.CustPONumber,
                            saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                            duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                            employeename: data.fields.EmployeeName,
                            status: data.fields.OrderStatus,
                            invoicenumber: data.fields.SupplierInvoiceNumber,
                            comments: data.fields.Comments,
                            pickmemo: data.fields.SalesComments,
                            ponumber: data.fields.CustPONumber,
                            via: data.fields.Shipping,
                            connote: data.fields.ConNote,
                            reference: data.fields.RefNo,
                            currency: data.fields.ForeignExchangeCode,
                            branding: data.fields.MedType,
                            invoiceToDesc: data.fields.OrderTo,
                            shipToDesc: data.fields.ShipTo,
                            termsName: data.fields.TermsName,
                            Total: totalInc,
                            LineItems: lineItems,
                            isReconciled:data.fields.Isreconciled,
                            TotalTax: totalTax,
                            SubTotal: subTotal,
                            balanceDue: totalBalance,
                            saleCustField1: data.fields.SaleLineRef,
                            saleCustField2: data.fields.SalesComments,
                            totalPaid: totalPaidAmount,
                            ispaid: data.fields.IsPaid
                        };

                        $('#edtSupplierName').val(data.fields.SupplierName);
                        $('#sltBankAccountName').val(data.fields.GLAccountName);
                        templateObject.CleintName.set(data.fields.SupplierName);
                        $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                        if(data.fields.Isreconciled){
                          $(".btnDeleteCheque").prop("disabled", true);
                          $(".btnRemove").prop("disabled", true);
                          $(".btnSave").prop("disabled", true);
                          $("#form :input").prop("disabled", true);
                          $(".btn_Attachment").prop("disabled", true);
                        }


                        $(".printConfirm").prop("disabled", false);
                        $(".btnBack").prop("disabled", false);
                        $(".close").prop("disabled", false);
                        $(".closeModal").prop("disabled", false);

                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);
                            }
                        }

                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].suppliername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                    $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                }
                            }
                        }

                        templateObject.chequerecord.set(chequerecord);

                        templateObject.selectedCurrency.set(chequerecord.currency);
                        templateObject.inputSelectedCurrency.set(chequerecord.currency);
                        if (templateObject.chequerecord.get()) {





                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblChequeLine', function(error, result) {
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
                                                $("" + columHeaderUpdate + "").css('width', columnWidth);
                                            }

                                            if (hiddenColumn == true) {


                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');



                                            }

                                        }
                                    }

                                }
                            });
                        }
                    }).catch(function(err) {
                        swal({
                            title: 'Oooops...',
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

                    });
                });


            };

            templateObject.getChequeData();
        }

    } else {
        $('.fullScreenSpin').css('display', 'none');
        templateObject.getAllCheques();

        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        lineItemObj = {
            lineID: Random.id(),
            item: '',
            accountname: '',
            memo: '',
            description: '',
            quantity: '',
            unitPrice: 0,
            taxRate: 0,
            taxCode: '',
            TotalAmt: 0,
            curTotalAmt: 0,
            TaxTotal: 0,
            TaxRate: 0,

        };

        var dataListTable = [
            ' ' || '',
            ' ' || '',
            0 || 0,
            0.00 || 0.00,
            ' ' || '',
            0.00 || 0.00,
            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
        ];
        lineItemsTable.push(dataListTable);
        lineItems.push(lineItemObj);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let chequerecord = {
            id: '',
            lid: 'New ' + chequeSpelling,
            bankaccount: 'Bank',
            accountname: '',
            memo: '',
            sosupplier: '',
            billto: '',
            shipto: '',
            shipping: '',
            docnumber: '',
            custPONumber: '',
            saledate: begunDate,
            duedate: '',
            employeename: '',
            status: '',
            invoicenumber: '',
            category: '',
            comments: '',
            pickmemo: '',
            ponumber: '',
            via: '',
            connote: '',
            reference: '',
            currency: '',
            branding: '',
            invoiceToDesc: '',
            shipToDesc: '',
            termsName: '',
            Total: Currency + '' + 0.00,
            LineItems: lineItems,
            isReconciled:false,
            TotalTax: Currency + '' + 0.00,
            SubTotal: Currency + '' + 0.00,
            balanceDue: Currency + '' + 0.00,
            saleCustField1: '',
            saleCustField2: '',
            totalPaid: Currency + '' + 0.00,
            ispaid: false
        };

        $('#edtSupplierName').val('');
        $("#form :input").prop("disabled", false);
        templateObject.chequerecord.set(chequerecord);

        if (templateObject.chequerecord.get()) {

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblChequeLine', function(error, result) {
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
                                $("" + columHeaderUpdate + "").css('width', columnWidth);
                            }
                            if (hiddenColumn == true) {
                                $("." + columnClass + "").addClass('hiddenColumn');
                                $("." + columnClass + "").removeClass('showColumn');
                            } else if (hiddenColumn == false) {
                                $("." + columnClass + "").removeClass('hiddenColumn');
                                $("." + columnClass + "").addClass('showColumn');
                            }

                        }
                    }

                }
            });
        }

    }


    templateObject.getShpVias = function() {
        getVS1Data('TShippingMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getShpVia().then(function(data) {
                    for (let i in data.tshippingmethod) {

                        let viarecordObj = {
                            shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                        };

                        viarecords.push(viarecordObj);
                        templateObject.deptrecords.set(viarecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tshippingmethod;
                for (let i in useData) {

                    let viarecordObj = {
                        shippingmethod: useData[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.deptrecords.set(viarecords);

                }

            }
        }).catch(function(err) {

            purchaseService.getShpVia().then(function(data) {
                for (let i in data.tshippingmethod) {

                    let viarecordObj = {
                        shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.deptrecords.set(viarecords);

                }
            });
        });

    }

    templateObject.getTerms = function() {
        purchaseService.getTermVS1().then(function(data) {
            for (let i in data.ttermsvs1) {

                let termrecordObj = {
                    termsname: data.ttermsvs1[i].TermsName || ' ',
                };

                termrecords.push(termrecordObj);
                templateObject.termrecords.set(termrecords);

            }
        });

    }
    templateObject.getShpVias();



    let table;
    $(document).ready(function() {
        $('#edtSupplierName').editableSelect();
        $('#sltBankAccountName').editableSelect();

        $('#addRow').on('click', function() {
            var rowData = $('#tblChequeLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineAccountName", rowData).text("");
            $(".lineMemo", rowData).text("");
            $(".lineQty", rowData).text("");
            $(".lineAmount", rowData).val("");
            $(".lineTaxRate", rowData).text("");
            $(".lineTaxCode", rowData).text("");
            $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblChequeLine tbody").append(rowData);


            if ($('#printID').val() != "") {
                var rowData1 = $('.cheque_print tbody>tr:last').clone(true);
                $("#lineAccountName", rowData1).text("");
                $("#lineMemo", rowData1).text("");
                $("#lineQty", rowData1).text("");
                $("#lineAmount", rowData1).text("");
                $("#lineTaxRate", rowData).text("");
                $("#lineTaxCode", rowData1).text("");
                $("#lineAmt", rowData1).text("");
                rowData1.attr('id', tokenid);
                $(".cheque_print tbody").append(rowData1);
            }

            setTimeout(function () {
             $('#' + tokenid + " .lineAccountName").trigger('click');
            }, 200);

        });



    });


    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblChequeLine tbody tr");
        let $printrows = $(".cheque_print tbody tr");

        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();

            let lineUnitPrice = "0.00";
            let lineTaxRate = table.find(".taxrate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;
            $('#' + selectLineID + " .lineTaxRate").text(0);
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == lineTaxRate) {
                        $('#' + selectLineID + " .lineTaxRate").text(taxcodeList[i].coderate || 0);
                    }
                }
            }
            $('#' + selectLineID + " .lineAccountName").text(lineProductName);
            $('#' + selectLineID + " .lineMemo").text(lineProductDesc);
            $('#' + selectLineID + " .colAmount").val(lineUnitPrice);
            $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

            if ($('.printID').val() == "") {
                $('#' + selectLineID + " #lineAccountName").text(lineProductName);
                $('#' + selectLineID + " #lineMemo").text(lineProductDesc);
                $('#' + selectLineID + " #colAmount").text(lineUnitPrice);
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
            }



            $('#productListModal').modal('toggle');
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var amount = $tblrow.find(".colAmount").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate || 0;
                        }
                    }
                }


                var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                if (!isNaN(subTotal)) {
                    $tblrow.find('.colAmount').val(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            if ($(".printID").val() == "") {
                $printrows.each(function(index) {
                var $printrows = $(this);
                var amount = $printrows.find("#lineAmount").text() || "0";
                var taxcode = $printrows.find("#lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                        }
                    }
                }


                    var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))

                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                    }
                });
            }
        }else{
          let accountname = table.find(".productName").text();
          $('#productListModal').modal('toggle');
          $('#sltBankAccountName').val(accountname);
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });


    $(document).on("click", "#tblTaxRate tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblChequeLine tbody tr");

        if (selectLineID) {
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;


            $('#' + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
            $('#' + selectLineID + " .lineTaxCode").text(lineTaxCode);
            let $printrows = $(".cheque_print tbody tr");
            if ($('.printID').val() == "") {
                $('#' + selectLineID + " #lineAmount").text($('#' + selectLineID + " .colAmount").val());
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxCode);
            }


            $('#taxRateListModal').modal('toggle');
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var amount = $tblrow.find(".colAmount").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || '';

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {

                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;

                        }
                    }
                }


                var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                if ((taxrateamount == '') || (taxrateamount == ' ')) {
                    var taxTotal = 0;
                } else {
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                }
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                if (!isNaN(subTotal)) {
                    $tblrow.find('.colAmount').val(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

        if($(".printID").val() == "") {
            $printrows.each(function(index) {
            var $printrow = $(this);
            var amount = $printrow.find("#lineAmount").text() || "0";
            var taxcode = $printrow.find("#lineTaxCode").text() || "E";

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                    }
                }
            }
                var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                 $printrow.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                if (!isNaN(subTotal)) {
                    $printrow.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
        }
        }
    });


    $('#edtSupplierName').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();

      var supplierDataName = e.target.value.replace(/\s/g, '') ||'';
      var supplierDataID = $('#edtSupplierName').attr('suppid').replace(/\s/g, '') ||'';
      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
        $('#supplierListModal').modal();
        setTimeout(function () {
            $('#tblSupplierlist_filter .form-control-sm').focus();
            $('#tblSupplierlist_filter .form-control-sm').val('');
            $('#tblSupplierlist_filter .form-control-sm').trigger("input");
            var datatable = $('#tblSupplierlist').DataTable();
            datatable.draw();
            $('#tblSupplierlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(supplierDataName != ''){
          FlowRouter.go('/supplierscard?name=' + e.target.value);
         }else{
           $('#supplierListModal').modal();
           setTimeout(function () {
               $('#tblSupplierlist_filter .form-control-sm').focus();
               $('#tblSupplierlist_filter .form-control-sm').val('');
               $('#tblSupplierlist_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblSupplierlist_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


    });

    $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
        let selectLineID = $('#supplierSelectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        let $tblrows = $("#tblChequeLine tbody tr");
        var tableSupplier = $(this);
        $('#edtSupplierName').val(tableSupplier.find(".colCompany").text());
        $('#edtSupplierName').attr("suppid", tableSupplier.find(".colID").text());


        $('#edtSupplierEmail').val(tableSupplier.find(".colEmail").text());
        $('#edtSupplierEmail').attr('customerid', tableSupplier.find(".colID").text());
        $('#edtSupplierName').attr('suppid', tableSupplier.find(".colID").text());

        let postalAddress = tableSupplier.find(".colCompany").text() + '\n' + tableSupplier.find(".colStreetAddress").text() + '\n' + tableSupplier.find(".colCity").text()  + ' ' + tableSupplier.find(".colState").text()+ ' ' + tableSupplier.find(".colZipCode").text() + '\n' + tableSupplier.find(".colCountry").text();
        $('#txabillingAddress').val(postalAddress);
        $('#pdfSupplierAddress').html(postalAddress);
        $('.pdfSupplierAddress').text(postalAddress);
        $('#txaShipingInfo').val(postalAddress);
        $('#sltTerms').val(tableSupplier.find(".colSupplierTermName").text() || '');
        $('#supplierListModal').modal('toggle');

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var amount = $tblrow.find(".colAmount").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").text() || '';

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {

                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;

                    }
                }
            }


            var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
            if ((taxrateamount == '') || (taxrateamount == ' ')) {
                var taxTotal = 0;
            } else {
                var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            }
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
            if (!isNaN(subTotal)) {
                $tblrow.find('.colAmount').val(utilityService.modifynegativeCurrencyFormat(subTotal));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });
        $('#tblSupplierlist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshSupplier').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $('#sltBankAccountName').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('');
        $('#productListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(accountDataName.replace(/\s/g, '') != ''){
           getVS1Data('TAccountVS1').then(function (dataObject) {
               if (dataObject.length == 0) {
                 accountService.getOneAccountByName(accountDataName).then(function (data) {
                   if (accountTypeList) {
                       for (var h = 0; h < accountTypeList.length; h++) {

                           if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                               fullAccountTypeName = accountTypeList[h].description || '';

                           }
                       }

                   }

                    var accountid = data.taccountvs1[0].fields.ID || '';
                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                   var cardcvc = data.taccountvs1[0].fields.CVC || '';
                   var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                    if ((accounttype === "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }else if ((accounttype === "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                    } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }

                    $('#edtAccountID').val(accountid);
                    $('#sltAccountType').val(accounttype);
                    $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                    $('#edtAccountName').val(accountname);
                    $('#edtAccountNo').val(accountno);
                    $('#sltTaxCode').val(taxcode);
                    $('#txaAccountDescription').val(accountdesc);
                    $('#edtBankAccountName').val(bankaccountname);
                    $('#edtBSB').val(bankbsb);
                    $('#edtBankAccountNo').val(bankacountno);
                    $('#swiftCode').val(swiftCode);
                    $('#routingNo').val(routingNo);
                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                    $('#edtCardNumber').val(cardnumber);
                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                    $('#edtCvc').val(cardcvc);

                    if(showTrans == 'true'){
                        $('.showOnTransactions').prop('checked', true);
                    }else{
                      $('.showOnTransactions').prop('checked', false);
                    }

                    setTimeout(function () {
                        $('#addNewAccount').modal('show');
                    }, 500);

                 }).catch(function (err) {
                     $('.fullScreenSpin').css('display','none');
                 });
               } else {
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.taccountvs1;
                     var added=false;
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   for (let a = 0; a < data.taccountvs1.length; a++) {

                     if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                       added = true;
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }



                var accountid = data.taccountvs1[a].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                var accountname = data.taccountvs1[a].fields.AccountName || '';
                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[a].fields.Description || '';
                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                var routingNo = data.taccountvs1[a].BankCode || '';

                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

                     }
                   }
                   if(!added) {
                     accountService.getOneAccountByName(accountDataName).then(function (data) {
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                       var cardcvc = data.taccountvs1[0].fields.CVC || '';
                       var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                     }).catch(function (err) {
                         $('.fullScreenSpin').css('display','none');
                     });
                   }

               }
           }).catch(function (err) {
             accountService.getOneAccountByName(accountDataName).then(function (data) {
               if (accountTypeList) {
                   for (var h = 0; h < accountTypeList.length; h++) {

                       if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                           fullAccountTypeName = accountTypeList[h].description || '';

                       }
                   }

               }

                var accountid = data.taccountvs1[0].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                var accountname = data.taccountvs1[0].fields.AccountName || '';
                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[0].fields.Description || '';
                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[0].fields.CVC || '';
               var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

             }).catch(function (err) {
                 $('.fullScreenSpin').css('display','none');
             });

           });
           $('#addAccountModal').modal('toggle');
         }else{
           $('#selectLineID').val('');
           $('#productListModal').modal();
           setTimeout(function () {
             $('#tblAccount_filter .form-control-sm').focus();
             $('#tblAccount_filter .form-control-sm').val('');
             $('#tblAccount_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblAccount_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


    });

    exportSalesToPdf = function() {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");

        var source = document.getElementById('html-2-pdfwrapper');

        let file = "Cheque.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Cheque-' + id + '.pdf';
        }

        var opt = {
            margin: 0,
            filename: file,
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };
        html2pdf().set(opt).from(source).save().then(function (dataObject){
            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') == "") {
                $(".btnSave").trigger("click");
            } else {
             $('#html-2-pdfwrapper').css('display', 'none');
            $('.fullScreenSpin').css('display', 'none');
        }
        });
        // pdf.addHTML(source, function() {
        //     pdf.save('Cheque '+id+'.pdf');
        //     $('#html-2-pdfwrapper').css('display', 'none');
        // });
    };
});
Template.chequecard.onRendered(function() {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const accountnamerecords = [];
    let account = [];
    tempObj.getAllProducts = function() {
        getVS1Data('TAccountVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                accountService.getAccountListVS1().then(function(data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.taccountvs1.length; i++) {
                        if (data.taccountvs1[i].AccountTypeName == "BANK" || data.taccountvs1[i].AccountTypeName == "CCard") {
                            var accountList = {
                                accountname: data.taccountvs1[i].AccountName || '',
                                description: data.taccountvs1[i].Description || '',
                                accountnumber: data.taccountvs1[i].AccountNumber || '',
                                accountype: data.taccountvs1[i].AccountTypeName || '',
                                balance: utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                                taxcode: data.taccountvs1[i].TaxCode || ''
                            };

                        }
                        account.push(accountList);

                        var dataList = [
                            data.taccountvs1[i].AccountName || '-',
                            data.taccountvs1[i].Description || '',
                            data.taccountvs1[i].AccountNumber || '',
                            data.taccountvs1[i].AccountTypeName || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                            data.taccountvs1[i].TaxCode || ''
                        ];

                        splashArrayProductList.push(dataList);
                    }
                    tempObj.accounts.set(account);
                    localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                        $('#tblAccount').dataTable({
                            data: splashArrayProductList.sort(),

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [

                                { className: "productName", "targets": [0] },
                                { className: "productDesc", "targets": [1] },
                                { className: "accountnumber", "targets": [2] },
                                { className: "salePrice", "targets": [3] },
                                { className: "prdqty text-right", "targets": [4] },
                                { className: "taxrate", "targets": [5] }
                            ],
                            colReorder: true,



                            "order": [
                                [0, "asc"]
                            ],


                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true

                        });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');






                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;

                let records = [];
                let inventoryData = [];

                for (let i = 0; i < useData.length; i++) {
                    if (!isNaN(useData[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }

                    if (useData[i].fields.AccountTypeName == "BANK" || useData[i].fields.AccountTypeName == "CCARD") {
                        var accountList = {
                            accountname: useData[i].fields.AccountName || '',
                            description: useData[i].fields.Description || '',
                            accountnumber: useData[i].fields.AccountNumber || '',
                            accountype: useData[i].fields.AccountTypeName || '',
                            balance: utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.Balance * 100) / 100),
                            taxcode: data.taccountvs1[i].TaxCode || ''
                        };
                        account.push(accountList);
                    }


                    var dataList = [
                        useData[i].fields.AccountName || '-',
                        useData[i].fields.Description || '',
                        useData[i].fields.AccountNumber || '',
                        useData[i].fields.AccountTypeName || '',
                        accBalance,
                        useData[i].fields.TaxCode || ''
                    ];

                    splashArrayProductList.push(dataList);


                }
                tempObj.accounts.set(account);
                localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));
                if (splashArrayProductList) {

                    $('#tblAccount').dataTable({
                        data: splashArrayProductList.sort(),

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            { className: "productName", "targets": [0] },
                            { className: "productDesc", "targets": [1] },
                            { className: "accountnumber", "targets": [2] },
                            { className: "salePrice ", "targets": [3] },
                            { className: "prdqty text-right", "targets": [4] },
                            { className: "taxrate", "targets": [5] }
                        ],
                        colReorder: true,



                        "order": [
                            [0, "asc"]
                        ],



                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');






                }
            }
        }).catch(function(err) {
            accountService.getAccountListVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    if (data.taccountvs1[i].AccountTypeName == "BANK" || data.taccountvs1[i].AccountTypeName == "Cheque or Saving" || data.taccountvs1[i].AccountTypeName == "CCard") {
                        var accountList = {
                            accountname: data.taccountvs1[i].AccountName || '',
                            description: data.taccountvs1[i].Description || '',
                            accountnumber: data.taccountvs1[i].AccountNumber || '',
                            accountype: data.taccountvs1[i].AccountTypeName || '',
                            balance: utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                            taxcode: data.taccountvs1[i].TaxCode || ''
                        };

                    }
                    account.push(accountList);


                    var dataList = [
                        data.taccountvs1[i].AccountName || '-',
                        data.taccountvs1[i].Description || '',
                        data.taccountvs1[i].AccountNumber || '',
                        data.taccountvs1[i].AccountTypeName || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                        data.taccountvs1[i].TaxCode || ''
                    ];

                    splashArrayProductList.push(dataList);
                }
                tempObj.accounts.set(account);
                localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblAccount').dataTable({
                        data: splashArrayProductList.sort(),

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            { className: "productName", "targets": [0] },
                            { className: "productDesc", "targets": [1] },
                            { className: "accountnumber", "targets": [2] },
                            { className: "salePrice", "targets": [3] },
                            { className: "prdqty text-right", "targets": [4] },
                            { className: "taxrate", "targets": [5] }
                        ],
                        colReorder: true,



                        "order": [
                            [0, "asc"]
                        ],


                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');






                }
            });
        });
    };

    //tempObj.getAllProducts();




    tempObj.getAllTaxCodes = function() {
        getVS1Data('TTaxcodeVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getTaxCodesVS1().then(function(data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                        var dataList = [
                            data.ttaxcodevs1[i].Id || '',
                            data.ttaxcodevs1[i].CodeName || '',
                            data.ttaxcodevs1[i].Description || '-',
                            taxRate || 0,
                        ];

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || ' ',
                            coderate: taxRate || ' ',
                        };

                        taxCodesList.push(taxcoderecordObj);

                        splashArrayTaxRateList.push(dataList);
                    }
                    tempObj.taxraterecords.set(taxCodesList);


                    if (splashArrayTaxRateList) {

                        $('#tblTaxRate').DataTable({
                            data: splashArrayTaxRateList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [
                                { orderable: false, targets: 0 },
                                { className: "taxName", "targets": [1] },
                                { className: "taxDesc", "targets": [2] },
                                { className: "taxRate text-right", "targets": [3] }
                            ],
                            colReorder: true,



                            bStateSave: true,


                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true

                        });






                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    let taxRate = (useData[i].Rate * 100).toFixed(2);
                    var dataList = [
                        useData[i].Id || '',
                        useData[i].CodeName || '',
                        useData[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: useData[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { orderable: false, targets: 0 },
                            { className: "taxName", "targets": [1] },
                            { className: "taxDesc", "targets": [2] },
                            { className: "taxRate text-right", "targets": [3] }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true

                    });






                }

            }
        }).catch(function(err) {
            purchaseService.getTaxCodesVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var dataList = [
                        data.ttaxcodevs1[i].Id || '',
                        data.ttaxcodevs1[i].CodeName || '',
                        data.ttaxcodevs1[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { orderable: false, targets: 0 },
                            { className: "taxName", "targets": [1] },
                            { className: "taxDesc", "targets": [2] },
                            { className: "taxRate text-right", "targets": [3] }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true

                    });






                }
            })
        });
    };
    tempObj.getAllTaxCodes();

});
Template.chequecard.helpers({
    chequerecord: () => {
        return Template.instance().chequerecord.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.shippingmethod == 'NA') {
                return 1;
            } else if (b.shippingmethod == 'NA') {
                return -1;
            }
            return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function(a, b) {
            if (a.termsname == 'NA') {
                return 1;
            } else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    purchaseCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'chequecard' });
    },
    purchaseCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblChequeLine' });
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    accounts: () => {
        return Template.instance().accounts.get().sort(function(a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
        });
    },
    statusrecords: () => {
        return Template.instance().statusrecords.get().sort(function(a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
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
    },
    formname: () => {
        return chequeSpelling;
    },
    isMobileDevices: () => {
        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});

Template.chequecard.events({
    'click #edtSupplierName': function(event) {
        $('#edtSupplierName').select();
        $('#edtSupplierName').editableSelect();
    },
    'change #sltStatus': function () {
        let status = $('#sltStatus').find(":selected").val();
        if (status == "newstatus") {
            $('#statusModal').modal();
        }
    },
    'click .btnSaveStatus': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let clientService = new SalesBoardService()
        let status = $('#status').val();
        let leadData = {
            type: 'TLeadStatusType',
            fields: {
                TypeName: status,
                KeyValue: status
            }
        }

        if (status != "") {
            clientService.saveLeadStatus(leadData).then(function (objDetails) {
                sideBarService.getAllLeadStatus().then(function (dataUpdate) {
                    addVS1Data('TLeadStatusType', JSON.stringify(dataUpdate)).then(function (datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                        let id = $('.printID').attr("id");
                        if (id != "") {
                            window.open("/chequecard?id=" + id);
                        } else {
                           window.open("/chequecard");
                        }
                     }).catch(function (err) {

                    });
                }).catch(function (err) {

                   window.open('/chequecard', '_self');
                });
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');

                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {

                    }
                });

                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Please Enter Status',
                text: "Status field cannot be empty",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                } else if (result.dismiss === 'cancel') {

                }
            });
        }
    },
    'blur .lineMemo': function (event) {
        var targetID = $(event.target).closest('tr').attr('id');
        $('#' + targetID + " #lineMemo").text($('#' + targetID + " .lineMemo").text());
    },
    'blur .colAmount': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        var targetID = $(event.target).closest('tr').attr('id');
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) ||0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""))||0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }
        let $tblrows = $("#tblChequeLine tbody tr");
        let $printrows = $(".cheque_print tbody tr");

         if ($('.printID').val() == "") {
            $('#' + targetID + " #lineAmount").text($('#' + targetID + " .colAmount").val());
            $('#' + targetID + " #lineTaxCode").text($('#' + targetID + " .lineTaxCode").text());

        }

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var amount = $tblrow.find(".colAmount").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").text() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }


            var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
            if (!isNaN(subTotal)) {
                $tblrow.find('.colAmount').val(utilityService.modifynegativeCurrencyFormat(subTotal));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        if($(".printID").val() == "") {
            $printrows.each(function(index) {
            var $printrow = $(this);
            var amount = $printrow.find("#lineAmount").text() || "0";
            var taxcode = $printrow.find("#lineTaxCode").text() || "E";

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                    }
                }
            }
                var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                 $printrow.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                if (!isNaN(subTotal)) {
                    $printrow.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
        }

    },
    'click #btnCustomFileds': function(event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineAccountName': function(event) {
      let suppliername = $('#edtSupplierName').val();
      let accountService = new AccountService();
      const accountTypeList = [];
      if (suppliername === '') {
          swal('Supplier has not been selected!', '', 'warning');
          event.preventDefault();
      } else {
        var accountDataName = $(event.target).text() || '';
        if (accountDataName.replace(/\s/g, '') != '') {
          getVS1Data('TAccountVS1').then(function (dataObject) {
              if (dataObject.length == 0) {
                accountService.getOneAccountByName(accountDataName).then(function (data) {
                  if (accountTypeList) {
                      for (var h = 0; h < accountTypeList.length; h++) {

                          if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                              fullAccountTypeName = accountTypeList[h].description || '';

                          }
                      }

                  }

                   var accountid = data.taccountvs1[0].fields.ID || '';
                   var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                   var accountname = data.taccountvs1[0].fields.AccountName || '';
                   var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                   var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                   var accountdesc = data.taccountvs1[0].fields.Description || '';
                   var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                   var bankbsb = data.taccountvs1[0].fields.BSB || '';
                   var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                   var swiftCode = data.taccountvs1[0].fields.Extra || '';
                   var routingNo = data.taccountvs1[0].fields.BankCode || '';

                   var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                   var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[0].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                   if ((accounttype === "BANK")) {
                       $('.isBankAccount').removeClass('isNotBankAccount');
                       $('.isCreditAccount').addClass('isNotCreditAccount');
                   }else if ((accounttype === "CCARD")) {
                       $('.isCreditAccount').removeClass('isNotCreditAccount');
                       $('.isBankAccount').addClass('isNotBankAccount');
                   } else {
                       $('.isBankAccount').addClass('isNotBankAccount');
                       $('.isCreditAccount').addClass('isNotCreditAccount');
                   }

                   $('#edtAccountID').val(accountid);
                   $('#sltAccountType').val(accounttype);
                   $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                   $('#edtAccountName').val(accountname);
                   $('#edtAccountNo').val(accountno);
                   $('#sltTaxCode').val(taxcode);
                   $('#txaAccountDescription').val(accountdesc);
                   $('#edtBankAccountName').val(bankaccountname);
                   $('#edtBSB').val(bankbsb);
                   $('#edtBankAccountNo').val(bankacountno);
                   $('#swiftCode').val(swiftCode);
                   $('#routingNo').val(routingNo);
                   $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                   $('#edtCardNumber').val(cardnumber);
                   $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                   $('#edtCvc').val(cardcvc);

                   if(showTrans == 'true'){
                       $('.showOnTransactions').prop('checked', true);
                   }else{
                     $('.showOnTransactions').prop('checked', false);
                   }

                   setTimeout(function () {
                       $('#addNewAccount').modal('show');
                   }, 500);

                }).catch(function (err) {
                    $('.fullScreenSpin').css('display','none');
                });
              } else {
                  let data = JSON.parse(dataObject[0].data);
                  let useData = data.taccountvs1;
                    var added=false;
                  let lineItems = [];
                  let lineItemObj = {};
                  let fullAccountTypeName = '';
                  let accBalance = '';
                  $('#add-account-title').text('Edit Account Details');
                  $('#edtAccountName').attr('readonly', true);
                  $('#sltAccountType').attr('readonly', true);
                  $('#sltAccountType').attr('disabled', 'disabled');
                  for (let a = 0; a < data.taccountvs1.length; a++) {

                    if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                      added = true;
                      if (accountTypeList) {
                          for (var h = 0; h < accountTypeList.length; h++) {

                              if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                  fullAccountTypeName = accountTypeList[h].description || '';

                              }
                          }

                      }



               var accountid = data.taccountvs1[a].fields.ID || '';
               var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
               var accountname = data.taccountvs1[a].fields.AccountName || '';
               var accountno = data.taccountvs1[a].fields.AccountNumber || '';
               var taxcode = data.taccountvs1[a].fields.TaxCode || '';
               var accountdesc = data.taccountvs1[a].fields.Description || '';
               var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
               var bankbsb = data.taccountvs1[a].fields.BSB || '';
               var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

               var swiftCode = data.taccountvs1[a].fields.Extra || '';
               var routingNo = data.taccountvs1[a].BankCode || '';

               var showTrans = data.taccountvs1[a].fields.IsHeader || false;

               var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[a].fields.CVC || '';
               var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

               if ((accounttype === "BANK")) {
                   $('.isBankAccount').removeClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }else if ((accounttype === "CCARD")) {
                   $('.isCreditAccount').removeClass('isNotCreditAccount');
                   $('.isBankAccount').addClass('isNotBankAccount');
               } else {
                   $('.isBankAccount').addClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }

               $('#edtAccountID').val(accountid);
               $('#sltAccountType').val(accounttype);
               $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
               $('#edtAccountName').val(accountname);
               $('#edtAccountNo').val(accountno);
               $('#sltTaxCode').val(taxcode);
               $('#txaAccountDescription').val(accountdesc);
               $('#edtBankAccountName').val(bankaccountname);
               $('#edtBSB').val(bankbsb);
               $('#edtBankAccountNo').val(bankacountno);
               $('#swiftCode').val(swiftCode);
               $('#routingNo').val(routingNo);
               $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

               $('#edtCardNumber').val(cardnumber);
               $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
               $('#edtCvc').val(cardcvc);

               if(showTrans == 'true'){
                   $('.showOnTransactions').prop('checked', true);
               }else{
                 $('.showOnTransactions').prop('checked', false);
               }

               setTimeout(function () {
                   $('#addNewAccount').modal('show');
               }, 500);

                    }
                  }
                  if(!added) {
                    accountService.getOneAccountByName(accountDataName).then(function (data) {
                      if (accountTypeList) {
                          for (var h = 0; h < accountTypeList.length; h++) {

                              if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                  fullAccountTypeName = accountTypeList[h].description || '';

                              }
                          }

                      }

                       var accountid = data.taccountvs1[0].fields.ID || '';
                       var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                       var accountname = data.taccountvs1[0].fields.AccountName || '';
                       var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                       var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                       var accountdesc = data.taccountvs1[0].fields.Description || '';
                       var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                       var bankbsb = data.taccountvs1[0].fields.BSB || '';
                       var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                       var swiftCode = data.taccountvs1[0].fields.Extra || '';
                       var routingNo = data.taccountvs1[0].fields.BankCode || '';

                       var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                       var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                      var cardcvc = data.taccountvs1[0].fields.CVC || '';
                      var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                       if ((accounttype === "BANK")) {
                           $('.isBankAccount').removeClass('isNotBankAccount');
                           $('.isCreditAccount').addClass('isNotCreditAccount');
                       }else if ((accounttype === "CCARD")) {
                           $('.isCreditAccount').removeClass('isNotCreditAccount');
                           $('.isBankAccount').addClass('isNotBankAccount');
                       } else {
                           $('.isBankAccount').addClass('isNotBankAccount');
                           $('.isCreditAccount').addClass('isNotCreditAccount');
                       }

                       $('#edtAccountID').val(accountid);
                       $('#sltAccountType').val(accounttype);
                       $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                       $('#edtAccountName').val(accountname);
                       $('#edtAccountNo').val(accountno);
                       $('#sltTaxCode').val(taxcode);
                       $('#txaAccountDescription').val(accountdesc);
                       $('#edtBankAccountName').val(bankaccountname);
                       $('#edtBSB').val(bankbsb);
                       $('#edtBankAccountNo').val(bankacountno);
                       $('#swiftCode').val(swiftCode);
                       $('#routingNo').val(routingNo);
                       $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                       $('#edtCardNumber').val(cardnumber);
                       $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                       $('#edtCvc').val(cardcvc);

                       if(showTrans == 'true'){
                           $('.showOnTransactions').prop('checked', true);
                       }else{
                         $('.showOnTransactions').prop('checked', false);
                       }

                       setTimeout(function () {
                           $('#addNewAccount').modal('show');
                       }, 500);

                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display','none');
                    });
                  }

              }
          }).catch(function (err) {
            accountService.getOneAccountByName(accountDataName).then(function (data) {
              if (accountTypeList) {
                  for (var h = 0; h < accountTypeList.length; h++) {

                      if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                          fullAccountTypeName = accountTypeList[h].description || '';

                      }
                  }

              }

               var accountid = data.taccountvs1[0].fields.ID || '';
               var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
               var accountname = data.taccountvs1[0].fields.AccountName || '';
               var accountno = data.taccountvs1[0].fields.AccountNumber || '';
               var taxcode = data.taccountvs1[0].fields.TaxCode || '';
               var accountdesc = data.taccountvs1[0].fields.Description || '';
               var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
               var bankbsb = data.taccountvs1[0].fields.BSB || '';
               var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

               var swiftCode = data.taccountvs1[0].fields.Extra || '';
               var routingNo = data.taccountvs1[0].fields.BankCode || '';

               var showTrans = data.taccountvs1[0].fields.IsHeader || false;

               var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
              var cardcvc = data.taccountvs1[0].fields.CVC || '';
              var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

               if ((accounttype === "BANK")) {
                   $('.isBankAccount').removeClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }else if ((accounttype === "CCARD")) {
                   $('.isCreditAccount').removeClass('isNotCreditAccount');
                   $('.isBankAccount').addClass('isNotBankAccount');
               } else {
                   $('.isBankAccount').addClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }

               $('#edtAccountID').val(accountid);
               $('#sltAccountType').val(accounttype);
               $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
               $('#edtAccountName').val(accountname);
               $('#edtAccountNo').val(accountno);
               $('#sltTaxCode').val(taxcode);
               $('#txaAccountDescription').val(accountdesc);
               $('#edtBankAccountName').val(bankaccountname);
               $('#edtBSB').val(bankbsb);
               $('#edtBankAccountNo').val(bankacountno);
               $('#swiftCode').val(swiftCode);
               $('#routingNo').val(routingNo);
               $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

               $('#edtCardNumber').val(cardnumber);
               $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
               $('#edtCvc').val(cardcvc);

               if(showTrans == 'true'){
                   $('.showOnTransactions').prop('checked', true);
               }else{
                 $('.showOnTransactions').prop('checked', false);
               }

               setTimeout(function () {
                   $('#addNewAccount').modal('show');
               }, 500);

            }).catch(function (err) {
                $('.fullScreenSpin').css('display','none');
            });

          });
          $('#addAccountModal').modal('toggle');
        }else{
          $('#productListModal').modal('toggle');
          var targetID = $(event.target).closest('tr').attr('id');
          $('#selectLineID').val(targetID);
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('');
              $('#tblAccount_filter .form-control-sm').trigger("input");

              var datatable = $('#tblInventory').DataTable();
              datatable.draw();
              $('#tblAccount_filter .form-control-sm').trigger("input");

          }, 500);
        }
      }
    },
    'click #productListModal #refreshpagelist': function() {
        $('.fullScreenSpin').css('display', 'inline-block');


        Meteor._reload.reload();


    },
    'click .lineTaxRate': function(event) {
        $('#tblChequeLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblChequeLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function(event) {
        $('#tblChequeLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblChequeLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        $('#printcomment').html($('#txaComment').val().replace(/[\r\n]/g, "<br />"));
        exportSalesToPdf();

    },
    'keydown .lineQty, keydown .lineUnitPrice, keydown .lineAmount': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

            (event.keyCode >= 35 && event.keyCode <= 40)) {

            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblChequeLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                 $(".cheque_print #"+targetID).remove();
                event.preventDefault();
                let $tblrows = $("#tblChequeLine tbody tr");
                let $printrows = $(".cheque_print tbody tr");

                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;
                let taxGrandTotalPrint = 0;

                $tblrows.each(function(index) {
                    var $tblrow = $(this);
                    var amount = $tblrow.find(".colAmount").val() || 0;
                    var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                    var taxrateamount = 0;
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxcode) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }


                    var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                    if (!isNaN(subTotal)) {
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                        document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                    }

                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                    }
                });

            if ($(".printID").val() == "") {
                $printrows.each(function(index) {
                var $printrows = $(this);
                var amount = $printrows.find("#lineAmount").text() || "0";
                var taxcode = $printrows.find("#lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                        }
                    }
                }


                    var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))

                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                    }
                });
            }
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDeleteCheque': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let purchaseService = new PurchaseBoardService();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TChequeEx",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                }
            };

            purchaseService.saveChequeEx(objDetails).then(function(objDetails) {

               FlowRouter.go('/chequelist?success=true');

            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
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
            });
        } else {
            FlowRouter.go('/chequelist?success=true');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblChequeLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();
            $('.cheque_print #' + selectLineID).remove();

            let $tblrows = $("#tblChequeLine tbody tr");
            let $printrows = $(".cheque_print tbody tr");


            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }


                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                if (!isNaN(subTotal)) {
                    $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            if ($(".printID").val() == "") {
                $printrows.each(function(index) {
                var $printrows = $(this);
                var amount = $printrows.find("#lineAmount").text() || "0";
                var taxcode = $printrows.find("#lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                        }
                    }
                }


                    var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))

                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                    }
                });
            }


        } else {
            this.click;

            $('#' + selectLineID + " .lineAccountName").text('');
            $('#' + selectLineID + " .lineMemo").text('');
            $('#' + selectLineID + " .lineOrdered").val('');
            $('#' + selectLineID + " .lineQty").val('');
            $('#' + selectLineID + " .lineBo").val('');
            $('#' + selectLineID + " .lineCustomField1").text('');
            $('#' + selectLineID + " .lineCostPrice").text('');
            $('#' + selectLineID + " .lineCustomField2").text('');
            $('#' + selectLineID + " .lineTaxRate").text('');
            $('#' + selectLineID + " .lineTaxCode").text('');
            $('#' + selectLineID + " .lineAmount").val('');

            document.getElementById("subtotal_tax").innerHTML = Currency + '0.00';
            document.getElementById("subtotal_total").innerHTML = Currency + '0.00';
            document.getElementById("grandTotal").innerHTML = Currency + '0.00';
            document.getElementById("balanceDue").innerHTML = Currency + '0.00';
            document.getElementById("totalBalanceDue").innerHTML = Currency + '0.00';



        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function(event) {

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event) {
        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        // let termname = $('#sltTerms').val() || '';
        // if (termname === '') {
        //     swal('Terms has not been selected!', '', 'warning');
        //     event.preventDefault();
        //     return false;
        // }
        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblChequeLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdaccount = $('#' + lineID + " .lineAccountName").text();
                let tddmemo = $('#' + lineID + " .lineMemo").text();
                let tdamount = $('#' + lineID + " .lineAmount").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();

                if (tdaccount != "") {

                    lineItemObjForm = {
                        type: "TChequeLine",
                        fields: {
                            AccountName: tdaccount || '',
                            ProductDescription: tddmemo || '',


                            LineCost: Number(tdamount.replace(/[^0-9.-]+/g, "")) || 0,
                            LineTaxCode: tdtaxCode || '',
                        }
                    };
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
            let getchkcustomField1 = true;
            let getchkcustomField2 = true;
            let getcustomField1 = $('.customField1Text').html();
            let getcustomField2 = $('.customField2Text').html();
            if ($('#formCheck-one').is(':checked')) {
                getchkcustomField1 = false;
            }
            if ($('#formCheck-two').is(':checked')) {
                getchkcustomField2 = false;
            }

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let bankAccount = $('#sltBankAccountName').val();
            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#sltDept').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            let orderStatus = $('#edtStatus').val();
            let billTotal = $('#grandTotal').text();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentCheque = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentCheque = parseInt(currentCheque);
                objDetails = {
                    type: "TChequeEx",
                    fields: {
                        ID: currentCheque,
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        GLAccountName: bankAccount,

                        OrderDate: saleDate,

                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,

                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,
                        RefNo: reference,


                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val(),

                    }
                };
            } else {
                objDetails = {
                    type: "TChequeEx",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        GLAccountName: bankAccount,
                        OrderDate: saleDate,

                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,

                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,
                        RefNo: reference,


                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val(),

                    }
                };
            }

            purchaseService.saveChequeEx(objDetails).then(function(objDetails) {
                var supplierID = $('#edtSupplierEmail').attr('supplierid');

                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
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
                            filename: 'Cheque ' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);
                        let erpInvoiceId = objDetails.fields.ID;
                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail')||localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtSODate").val();
                        let mailSubject = 'Cheque ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's Cheque " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;
                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '        <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
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
                            '                        Please find Cheque <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        The amount outstanding of <span>' + amountDueEmail + '</span> is due on <span>' + emailDueDate + '</span>' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
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
                                    FlowRouter.go('/chequelist?success=true');
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
                                            FlowRouter.go('/chequelist?success=true');
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
                                    FlowRouter.go('/chequelist?success=true');
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
                                            FlowRouter.go('/chequelist?success=true');
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
                                    FlowRouter.go('/chequelist?success=true');
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
                                            FlowRouter.go('/chequelist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                           FlowRouter.go('/chequelist?success=true');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();

                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {

                            resolve(doc.output('blob'));

                        });
                    });
                }
                if (supplierID !== " ") {
                    let supplierEmailData = {
                            type: "TSupplier",
                            fields: {
                                ID: supplierID,
                                Email: supplierEmail
                            }
                        }



                };
                var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
                if (getcurrentCloudDetails) {
                    if (getcurrentCloudDetails._id.length > 0) {
                        var clientID = getcurrentCloudDetails._id;
                        var clientUsername = getcurrentCloudDetails.cloudUsername;
                        var clientEmail = getcurrentCloudDetails.cloudEmail;
                        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'chequecard' });
                        if (checkPrefDetails) {
                            CloudPreference.update({ _id: checkPrefDetails._id }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'chequecard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {
                                    FlowRouter.go('/chequelist?success=true');
                                } else {
                                    FlowRouter.go('/chequelist?success=true');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'chequecard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {
                                    FlowRouter.go('/chequelist?success=true');
                                } else {
                                    FlowRouter.go('/chequelist?success=true');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
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
            });
        }

    },
    'click .chkAccountName': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAccountName').css('display', 'table-cell');
            $('.colAccountName').css('padding', '.75rem');
            $('.colAccountName').css('vertical-align', 'top');
        } else {
            $('.colAccountName').css('display', 'none');
        }
    },
    'click .chkEmailCopy': function (event) {
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
    },
    'click .chkMemo': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colMemo').css('display', 'table-cell');
            $('.colMemo').css('padding', '.75rem');
            $('.colMemo').css('vertical-align', 'top');
        } else {
            $('.colMemo').css('display', 'none');
        }
    },
    'click .chkAmount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'click .chkTaxRate': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkTaxCode': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxCode').css('display', 'table-cell');
            $('.colTaxCode').css('padding', '.75rem');
            $('.colTaxCode').css('vertical-align', 'top');
        } else {
            $('.colTaxCode').css('display', 'none');
        }
    },
    'click .chkCustomField1': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCustomField1').css('display', 'table-cell');
            $('.colCustomField1').css('padding', '.75rem');
            $('.colCustomField1').css('vertical-align', 'top');
        } else {
            $('.colCustomField1').css('display', 'none');
        }
    },
    'click .chkCustomField2': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCustomField2').css('display', 'table-cell');
            $('.colCustomField2').css('padding', '.75rem');
            $('.colCustomField2').css('vertical-align', 'top');
        } else {
            $('.colCustomField2').css('display', 'none');
        }
    },
    'change .rngRangeAccountName': function(event) {

        let range = $(event.target).val();
        $(".spWidthAccountName").html(range);
        $('.colAccountName').css('width', range);

    },
    'change .rngRangeMemo': function(event) {

        let range = $(event.target).val();
        $(".spWidthMemo").html(range);
        $('.colMemo').css('width', range);

    },
    'change .rngRangeAmount': function(event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range);
        $('.colAmount').css('width', range);

    },
    'change .rngRangeTaxRate': function(event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range);
        $('.colTaxRate').css('width', range);

    },
    'change .rngRangeTaxCode': function(event) {

        let range = $(event.target).val();
        $(".spWidthTaxCode").html(range);
        $('.colTaxCode').css('width', range);

    },
    'change .rngRangeCustomField1': function(event) {

        let range = $(event.target).val();
        $(".spWidthCustomField1").html(range);
        $('.colCustomField1').css('width', range);

    },
    'change .rngRangeCustomField2': function(event) {

        let range = $(event.target).val();
        $(".spWidthCustomField2").html(range);
        $('.colCustomField2').css('width', range);

    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function(event) {
        let lineItems = [];

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



        });


        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblChequeLine' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'purchaseform',
                            PrefName: 'tblChequeLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');

                        } else {
                            $('#myModal2').modal('toggle');


                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'purchaseform',
                        PrefName: 'tblChequeLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
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
    'click .btnResetGridSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblChequeLine' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'chequecard' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function(event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function(event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function(event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
                'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function(event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function(event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click #btn_Attachment': function() {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);


    },
    'click #btnViewPayment': function() {
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];

        let supplier = $('#edtSupplierName').val();
        window.open('/supplierpaymentcard?bsuppname=' + supplier + '&from=' + currentInvoice, '_self');
    }

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
