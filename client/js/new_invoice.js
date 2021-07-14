import { SalesBoardService } from './sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import {OrganisationService} from '../js/organisation-service';
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
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.new_invoice.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.InvoiceNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.invoicerecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.InvoiceId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.record = new ReactiveVar({});
    templateObject.accountID = new ReactiveVar();
    templateObject.stripe_fee_method = new ReactiveVar()
        /* Attachments */
        templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.includeBOnShippedQty = new ReactiveVar();
    templateObject.includeBOnShippedQty.set(true);
    templateObject.productextrasellrecords = new ReactiveVar([]);

    templateObject.singleInvoiceData = new ReactiveVar([]);
    $(window).on('resize', function () {
        setTimeout(function () {

            var x = window.matchMedia("(max-width: 1024px)")

            function mediaQuery(x) {
                if (x.matches) {

                    $("#colInvnoReference").removeClass("col-auto");
                    $("#colInvnoReference").addClass("col-6");

                    $("#colTermsVia").removeClass("col-auto");
                    $("#colTermsVia").addClass("col-6");

                    $("#colStatusDepartment").removeClass("col-auto");
                    $("#colStatusDepartment").addClass("col-6");

                    $("#colBillingAddress").removeClass("col-auto");
                    $("#colBillingAddress").addClass("col-6");

                    $("#colOrderDue").removeClass("col-auto");
                    $("#colOrderDue").addClass("col-6");

                    $("#fieldwidth").removeClass("billaddressfield");
                    $("#fieldwidth").addClass("billaddressfield2");

                }
            }
            mediaQuery(x)
            x.addListener(mediaQuery)
        }, 10);

        setTimeout(function () {

            var x = window.matchMedia("(max-width: 420px)")

            function mediaQuery(x) {
                if (x.matches) {

                    $("#colInvnoReference").removeClass("col-auto");
                    $("#colInvnoReference").addClass("col-12");

                    $("#colTermsVia").removeClass("col-auto");
                    $("#colTermsVia").addClass("col-12");

                    $("#colStatusDepartment").removeClass("col-auto");
                    $("#colStatusDepartment").addClass("col-12");

                    $("#colBillingAddress").removeClass("col-auto");
                    $("#colBillingAddress").addClass("col-12");

                    $("#colOrderDue").removeClass("col-auto");
                    $("#colOrderDue").addClass("col-12");

                    $("#colSupplierName").removeClass("col-auto");
                    $("#colSupplierName").addClass("col-12");

                    $("#colSupplierEmail").removeClass("col-auto");
                    $("#colSupplierEmail").addClass("col-12");

                    $("#fieldwidth").removeClass("billaddressfield");
                    $("#fieldwidth").addClass("billaddressfield2");

                }
            }
            mediaQuery(x)
            x.addListener(mediaQuery)
        }, 10);

    });
});
Template.new_invoice.onRendered(() => {
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };

    const templateObject = Template.instance();
    const records = [];
    let salesService = new SalesBoardService();
    let clientsService = new SalesBoardService();
    let productsService = new SalesBoardService();
    let accountService = new SalesBoardService();
    let organisationService = new OrganisationService();
    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];
    const termrecords = [];
    const statusList = [];
    let isBOnShippedQty = Session.get('CloudSalesQtyOnly');
    if (isBOnShippedQty) {
        templateObject.includeBOnShippedQty.set(false);
    }

    $("#date-input,#dtSODate,#dtDueDate").datepicker({
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

    $(document).ready(function () {
        $('#formCheck-one').click(function () {
            if ($(event.target).is(':checked')) {
                $('.checkbox1div').css('display', 'block');
            } else {
                $('.checkbox1div').css('display', 'none');
            }
        });

        $('#formCheck-two').click(function () {
            if ($(event.target).is(':checked')) {
                $('.checkbox2div').css('display', 'block');
            } else {
                $('.checkbox2div').css('display', 'none');
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
    $('.fullScreenSpin').css('display', 'inline-block');
    templateObject.getAllClients = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function (data) {
                    for (let i in data.tcustomervs1) {

                        let customerrecordObj = {
                            customerid: data.tcustomervs1[i].Id || ' ',
                            firstname: data.tcustomervs1[i].FirstName,
                            lastname: data.tcustomervs1[i].LastName,
                            customername: data.tcustomervs1[i].ClientName || ' ',
                            customeremail: data.tcustomervs1[i].Email || ' ',
                            street: data.tcustomervs1[i].Street || ' ',
                            street2: data.tcustomervs1[i].Street2 || ' ',
                            street3: data.tcustomervs1[i].Street3 || ' ',
                            suburb: data.tcustomervs1[i].Suburb || ' ',
                            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                            country: data.tcustomervs1[i].Country || ' ',
                            termsName: data.tcustomervs1[i].TermsName || '',
                            taxCode: data.tcustomervs1[i].TaxCodeName || '',
                            clienttypename: data.tcustomervs1[i].ClientTypeName || ''
                        };
                        clientList.push(customerrecordObj);

                    }
                    templateObject.clientrecords.set(clientList.sort(function (a, b) {
                            if (a.customername == 'NA') {
                                return 1;
                            } else if (b.customername == 'NA') {
                                return -1;
                            }
                            return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                        }));

                    for (var i = 0; i < clientList.length; i++) {
                        $('#edtCustomerName').editableSelect('add', clientList[i].customername);
                    }

                    if (Router.current().params.query.id) {}
                    else {
                        setTimeout(function () {
                            $('#edtCustomerName').focus();
                        }, 200);
                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                for (let i in useData) {

                    let customerrecordObj = {
                        customerid: useData[i].fields.ID || ' ',
                        firstname: useData[i].fields.FirstName,
                        lastname: useData[i].fields.LastName,
                        customername: useData[i].fields.ClientName || ' ',
                        customeremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || '',
                        taxCode: useData[i].fields.TaxCodeName || '',
                        clienttypename: useData[i].fields.ClientTypeName || ''
                    };
                    clientList.push(customerrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));
                for (var i = 0; i < clientList.length; i++) {
                    $('#edtCustomerName').editableSelect('add', clientList[i].customername);
                }
                if (Router.current().params.query.id) {}
                else {
                    setTimeout(function () {
                        $('#edtCustomerName').focus();
                    }, 100);
                }
            }
        }).catch(function (err) {
            clientsService.getClientVS1().then(function (data) {
                for (let i in data.tcustomervs1) {

                    let customerrecordObj = {
                        customerid: data.tcustomervs1[i].Id || ' ',
                        firstname: data.fields.FirstName,
                        lastname: data.fields.LastName,
                        customername: data.tcustomervs1[i].ClientName || ' ',
                        customeremail: data.tcustomervs1[i].Email || ' ',
                        street: data.tcustomervs1[i].Street || ' ',
                        street2: data.tcustomervs1[i].Street2 || ' ',
                        street3: data.tcustomervs1[i].Street3 || ' ',
                        suburb: data.tcustomervs1[i].Suburb || ' ',
                        statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                        country: data.tcustomervs1[i].Country || ' ',
                        termsName: data.tcustomervs1[i].TermsName || '',
                        taxCode: datatcustomervs1[i].TaxCodeName || '',
                        clienttypename: data.tcustomervs1[i].ClientTypeName || ''
                    };
                    clientList.push(customerrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                for (var i = 0; i < clientList.length; i++) {
                    $('#edtCustomerName').editableSelect('add', clientList[i].customername);
                }
                if (Router.current().params.query.id) {}
                else {
                    setTimeout(function () {
                        $('#edtCustomerName').focus();
                    }, 200);
                }

            });
        });
    };

    templateObject.getOrganisationDetails = function () {
        let account_id = Session.get('vs1companyStripeID') || '';
        let stripe_fee = Session.get('vs1companyStripeFeeMethod') || 'apply';
        templateObject.accountID.set(account_id);
        templateObject.stripe_fee_method.set(stripe_fee);
    }

    templateObject.getOrganisationDetails();

    templateObject.getAllLeadStatuss = function () {
        getVS1Data('TLeadStatusType').then(function (dataObject) {
            if (dataObject.length == 0) {
                clientsService.getAllLeadStatus().then(function (data) {
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
        }).catch(function (err) {
            clientsService.getAllLeadStatus().then(function (data) {
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
    let url2 = window.location.href;

    templateObject.getAllClients();
    templateObject.getAllLeadStatuss();
    var url = window.location.href;
    let bankDetails = Session.get('vs1companyBankDetails') || '';
    // $('.bankDetails').html(bankDetails.replace(/[\r\n]/g, "<br />"));


    if (url.indexOf('?copyquid=') > 0) {
        var getso_id = url.split('?copyquid=');
        var currentInvoice = getso_id[getso_id.length - 1];
        $('.printID').attr("id", currentInvoice);
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            templateObject.getInvoiceData = function () {
                let customerData = templateObject.clientrecords.get();
                accountService.getOneQuotedataEx(currentInvoice).then(function (data) {
                    templateObject.singleInvoiceData.set(data);
                    let cust_result = customerData.filter(cust_data => {
                        return cust_data.customername == data.fields.CustomerName
                    });
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    let exchangeCode = data.fields.ForeignExchangeCode;
                    let currencySymbol = Currency;
                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalInc = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                item: data.fields.Lines[i].fields.ProductName || '',
                                description: data.fields.Lines[i].fields.ProductDescription || '',
                                quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0,

                            };
                            var dataListTable = [
                                data.fields.Lines[i].fields.ProductName || '',
                                data.fields.Lines[i].fields.ProductDescription || '',
                                "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                data.fields.Lines[i].fields.LineTaxCode || '',
                                AmountGbp || currencySymbol + '' + 0.00,
                                '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                            ];
                            lineItemsTable.push(dataListTable);
                            lineItems.push(lineItemObj);
                        }
                    } else {
                        let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                        let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                        lineItemObj = {
                            lineID: Random.id(),
                            id: data.fields.Lines.fields.ID || '',
                            description: data.fields.Lines.fields.ProductDescription || '',
                            quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                            unitPrice: data.fields.Lines.fields.LinePrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            lineCost: data.fields.Lines.fields.LineCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                            TotalAmt: AmountGbp || 0,
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0
                        };
                        lineItems.push(lineItemObj);
                    }

                    let invoicerecord = {
                        id: data.fields.ID,
                        lid: 'New Invoice',
                        socustomer: data.fields.CustomerName,
                        salesOrderto: data.fields.InvoiceToDesc,
                        shipto: data.fields.ShipToDesc,
                        department: data.fields.SaleClassName,
                        docnumber: data.fields.DocNumber,
                        custPONumber: data.fields.CustPONumber,
                        saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                        duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                        employeename: data.fields.EmployeeName,
                        status: data.fields.SalesStatus,
                        category: data.fields.SalesCategory,
                        comments: data.fields.Comments,
                        pickmemo: data.fields.PickMemo,
                        ponumber: data.fields.CustPONumber,
                        via: data.fields.Shipping,
                        connote: data.fields.ConNote,
                        reference: data.fields.ReferenceNo,
                        currency: data.fields.ForeignExchangeCode,
                        branding: data.fields.MedType,
                        invoiceToDesc: data.fields.InvoiceToDesc,
                        shipToDesc: data.fields.ShipToDesc,
                        termsName: data.fields.TermsName,
                        Total: totalInc,
                        LineItems: lineItems,
                        TotalTax: totalTax,
                        SubTotal: subTotal,
                        balanceDue: totalBalance,
                        saleCustField1: data.fields.SaleCustField1,
                        saleCustField2: data.fields.SaleCustField2,
                        totalPaid: totalPaidAmount,
                        ispaid: false
                    };

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    templateObject.CleintName.set(data.fields.CustomerName);
                    $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                    /* START attachment */
                    templateObject.attachmentCount.set(0);
                    if (data.fields.Attachments) {
                        if (data.fields.Attachments.length) {
                            templateObject.attachmentCount.set(data.fields.Attachments.length);
                            templateObject.uploadedFiles.set(data.fields.Attachments);
                        }
                    }
                    /* END  attachment */

                    setTimeout(function () {
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    invoicerecord.firstname = clientList[i].firstname || '';
                                    invoicerecord.lastname = clientList[i].lastname || '';
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                }
                            }
                        }
                    }, 100);

                    templateObject.invoicerecord.set(invoicerecord);
                    templateObject.selectedCurrency.set(invoicerecord.currency);
                    templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                    if (templateObject.invoicerecord.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                            if (error) {}
                            else {
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
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');

                                        }

                                    }
                                }

                            }
                        });
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            };

            templateObject.getInvoiceData();
        }
    } else if (url.includes("id") && url.includes("total")) {
        $('.fullScreenSpin').css('display', 'inline-block');
        url = new URL(url);
        let dateStart = new Date();
        let transDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
        var getso_id = url.searchParams.get("id");
        var paymentID = url.searchParams.get("paymentID");
        var paidAmount = url.searchParams.get("total");
        var currency_symbol = url.searchParams.get("currency");
        if (getso_id) {
            currentInvoice = parseInt(getso_id);
            $('.printID').attr("id", currentInvoice);
            templateObject.getInvoiceData = function () {
                getVS1Data('TInvoiceEx').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        let customerData = templateObject.clientrecords.get();
                        accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                            templateObject.singleInvoiceData.set(data);
                            let cust_result = customerData.filter(cust_data => {
                                return cust_data.customername == useData[d].fields.ClientName
                            });
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};
                            let exchangeCode = data.fields.ForeignExchangeCode;
                            let currencySymbol = Currency;
                            let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                    let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0;
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2) || 0;
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal) || 0;
                                    let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0;
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines[i].fields.ID || '',
                                        item: data.fields.Lines[i].fields.ProductName || '',
                                        description: data.fields.Lines[i].fields.ProductDescription || '',
                                        quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                        qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0,

                                    };
                                    var dataListTable = [
                                        data.fields.Lines[i].fields.ProductName || '',
                                        data.fields.Lines[i].fields.ProductDescription || '',
                                        "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                        "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                        data.fields.Lines[i].fields.LineTaxCode || '',
                                        AmountGbp || currencySymbol + '' + 0.00,
                                        '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                    ];
                                    lineItemsTable.push(dataListTable);
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0;
                                let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines.fields.ID || '',
                                    description: data.fields.Lines.fields.ProductDescription || '',
                                    quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                    unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }

                            let invoicerecord = {
                                id: data.fields.ID,
                                lid: 'Edit Invoice' + ' ' + data.fields.ID,
                                socustomer: data.fields.CustomerName,
                                salesOrderto: data.fields.InvoiceToDesc,
                                shipto: data.fields.ShipToDesc,
                                department: data.fields.SaleClassName,
                                docnumber: data.fields.DocNumber,
                                custPONumber: data.fields.CustPONumber,
                                saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                                duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                employeename: data.fields.EmployeeName,
                                status: data.fields.SalesStatus,
                                category: data.fields.SalesCategory,
                                comments: data.fields.Comments,
                                pickmemo: data.fields.PickMemo,
                                ponumber: data.fields.CustPONumber,
                                via: data.fields.Shipping,
                                connote: data.fields.ConNote,
                                reference: data.fields.ReferenceNo,
                                currency: data.fields.ForeignExchangeCode,
                                branding: data.fields.MedType,
                                invoiceToDesc: data.fields.InvoiceToDesc,
                                shipToDesc: data.fields.ShipToDesc,
                                termsName: data.fields.TermsName,
                                Total: totalInc || 0,
                                LineItems: lineItems,
                                TotalTax: totalTax || 0,
                                SubTotal: subTotal || 0,
                                balanceDue: totalBalance || 0,
                                saleCustField1: data.fields.SaleCustField1 || '',
                                saleCustField2: data.fields.SaleCustField2 || '',
                                totalPaid: totalPaidAmount || 0,
                                ispaid: true
                            };

                            $('#edtCustomerName').val(data.fields.CustomerName);
                            templateObject.CleintName.set(data.fields.CustomerName);
                            $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);
                                }
                            }
                            setTimeout(function () {
                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].customername == data.fields.CustomerName) {
                                            invoicerecord.firstname = clientList[i].firstname || '';
                                            invoicerecord.lastname = clientList[i].lastname || '';
                                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                            $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                            $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                        }
                                    }
                                };

                                if (data.fields.IsPaid === true) {
                                    $('#edtCustomerName').attr('readonly', true);
                                    $('#edtCustomerName').attr('disabled', 'disabled');
                                    $('.btn-primary').attr('disabled', 'disabled');
                                    $('#btnCopyInvoice').attr('disabled', 'disabled');
                                    $('#edtCustomerName').css('background-color', '#eaecf4');
                                    $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                    $('.btnSave').attr('disabled', 'disabled');
                                    $('#btnBack').removeAttr('disabled', 'disabled');
                                    $('.printConfirm').removeAttr('disabled', 'disabled');
                                    $('.tblInvoiceLine tbody tr').each(function () {
                                        var $tblrow = $(this);
                                        $tblrow.find("td").attr('contenteditable', false);
                                        $tblrow.find("td").removeClass("lineProductName");
                                        $tblrow.find("td").removeClass("lineTaxRate");
                                        $tblrow.find("td").removeClass("lineTaxCode");

                                        $tblrow.find("td").attr('readonly', true);
                                        $tblrow.find("td").attr('disabled', 'disabled');
                                        $tblrow.find("td").css('background-color', '#eaecf4');
                                        $tblrow.find("td .table-remove").removeClass("btnRemove");
                                    });
                                }
                            }, 100);

                            templateObject.invoicerecord.set(invoicerecord);
                            let getTotal = $('#totalBalanceDue').text();
                            let invoice_total = getTotal.replace(currency_symbol, '');
                            let paymentItems = [];
                            let paymentLineItems = {};
                            let dueAmount = utilityService.modifynegativeCurrencyFormat(parseFloat(invoice_total) - parseFloat(paidAmount)).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;

                            paymentLineItems = {
                                id: '',
                                invoiceid: getso_id || '',
                                transid: getso_id || '',
                                invoicedate: transDate,
                                transtype: "Invoice",
                                amountdue: dueAmount,
                                paymentamount: paidAmount || 0,
                                ouststandingamount: dueAmount,
                                orginalamount: getTotal
                            };
                            paymentItems.push(paymentLineItems);

                            let record = {
                                customerName: data.fields.CompanyName || '',
                                paymentDate: transDate,
                                reference: '',
                                paymentAmount: paidAmount || 0,
                                notes: data.fields.Notes,
                                LineItems: paymentItems,
                                department: "Default",
                                applied: currency_symbol + '' + paidAmount

                            };

                            templateObject.record.set(record);
                            templateObject.selectedCurrency.set(invoicerecord.currency);
                            templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                            if (templateObject.invoicerecord.get()) {
                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                    if (error) {
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
                                                } else if (hiddenColumn == false) {
                                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                                    $("." + columnClass + "").addClass('showColumn');

                                                }

                                            }
                                        }

                                    }
                                });
                            }
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);

                        let useData = data.tinvoiceex;
                        let customerData = templateObject.clientrecords.get();
                        var added = false;
                        let company_name = "";
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentInvoice) {
                                added = true;
                                let cust_result = customerData.filter(cust_data => {
                                    return cust_data.customername == useData[d].fields.ClientName
                                });
                                templateObject.singleInvoiceData.set(useData[d]);
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = useData[d].fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalInc = currencySymbol + '' + useData[d].fields.TotalAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let subTotal = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalTax = currencySymbol + '' + useData[d].fields.TotalTax.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalPaidAmount = currencySymbol + '' + useData[d].fields.TotalPaid.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                if (useData[d].fields.Lines.length) {
                                    for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                        let AmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        });
                                        let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: useData[d].fields.Lines[i].fields.ID || '',
                                            item: useData[d].fields.Lines[i].fields.ProductName || '',
                                            description: useData[d].fields.Lines[i].fields.ProductDescription || '',
                                            quantity: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: useData[d].fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: useData[d].fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };
                                        var dataListTable = [
                                            useData[d].fields.Lines[i].fields.ProductName || '',
                                            useData[d].fields.Lines[i].fields.ProductDescription || '',
                                            "<div contenteditable='true' class='qty'>" + '' + useData[d].fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                            "<div>" + '' + currencySymbol + '' + useData[d].fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                            useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            AmountGbp || currencySymbol + '' + 0.00,
                                            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                        ];
                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = useData[d].fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines.fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = currencySymbol + '' + useData[d].fields.Lines.fields.LineTaxRate;
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: useData[d].fields.Lines.fields.ID || '',
                                        description: useData[d].fields.Lines.fields.ProductDescription || '',
                                        quantity: useData[d].fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: useData[d].fields.Lines.fields.LinePrice.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: useData[d].fields.Lines.fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: useData[d].fields.Lines.fields.LineTaxRate || 0,
                                        taxCode: useData[d].fields.Lines.fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }
                                company_name = useData[d].fields.CustomerName;
                                let invoicerecord = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit Invoice' + ' ' + useData[d].fields.ID,
                                    socustomer: useData[d].fields.CustomerName,
                                    salesOrderto: useData[d].fields.InvoiceToDesc,
                                    shipto: useData[d].fields.ShipToDesc,
                                    department: useData[d].fields.SaleClassName,
                                    docnumber: useData[d].fields.DocNumber,
                                    custPONumber: useData[d].fields.CustPONumber,
                                    saledate: useData[d].fields.SaleDate ? moment(useData[d].fields.SaleDate).format('DD/MM/YYYY') : "",
                                    duedate: useData[d].fields.DueDate ? moment(useData[d].fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: useData[d].fields.EmployeeName,
                                    status: useData[d].fields.SalesStatus,
                                    category: useData[d].fields.SalesCategory,
                                    comments: useData[d].fields.Comments,
                                    pickmemo: useData[d].fields.PickMemo,
                                    ponumber: useData[d].fields.CustPONumber,
                                    via: useData[d].fields.Shipping,
                                    connote: useData[d].fields.ConNote,
                                    reference: useData[d].fields.ReferenceNo,
                                    currency: useData[d].fields.ForeignExchangeCode,
                                    branding: useData[d].fields.MedType,
                                    invoiceToDesc: useData[d].fields.InvoiceToDesc,
                                    shipToDesc: useData[d].fields.ShipToDesc,
                                    termsName: useData[d].fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: useData[d].fields.SaleCustField1,
                                    saleCustField2: useData[d].fields.SaleCustField2,
                                    totalPaid: totalPaidAmount,
                                    ispaid: useData[d].fields.IsPaid
                                };

                                $('#edtCustomerName').val(useData[d].fields.CustomerName);
                                templateObject.CleintName.set(useData[d].fields.CustomerName);
                                $('#sltCurrency').val(useData[d].fields.ForeignExchangeCode);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (useData[d].fields.Attachments) {
                                    if (useData[d].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[d].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[d].fields.Attachments);
                                    }
                                }
                                /* END  attachment */
                                setTimeout(function () {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == useData[d].fields.CustomerName) {
                                                invoicerecord.firstname = clientList[i].firstname || '';
                                                invoicerecord.lastname = clientList[i].lastname || '';
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                                $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                                $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                            }
                                        }
                                    };

                                    if (useData[d].fields.IsPaid === true) {
                                        $('#edtCustomerName').attr('readonly', true);
                                        $('#edtCustomerName').attr('disabled', 'disabled');
                                        $('.btn-primary').attr('disabled', 'disabled');
                                        $('#edtCustomerName').css('background-color', '#eaecf4');
                                        $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                        $('.btnSave').attr('disabled', 'disabled');
                                        $('#btnBack').removeAttr('disabled', 'disabled');
                                        $('.printConfirm').removeAttr('disabled', 'disabled');
                                        $('.tblInvoiceLine tbody tr').each(function () {
                                            var $tblrow = $(this);
                                            $tblrow.find("td").attr('contenteditable', false);
                                            $tblrow.find("td").removeClass("lineProductName");
                                            $tblrow.find("td").removeClass("lineTaxRate");
                                            $tblrow.find("td").removeClass("lineTaxCode");

                                            $tblrow.find("td").attr('readonly', true);
                                            $tblrow.find("td").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        });
                                    }
                                }, 100);

                                templateObject.invoicerecord.set(invoicerecord);
                                templateObject.selectedCurrency.set(invoicerecord.currency);
                                templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                                if (templateObject.invoicerecord.get()) {

                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                        if (error) {}
                                        else {
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
                            accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                                templateObject.singleInvoiceData.set(data);
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = data.fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                if (data.fields.Lines.length) {
                                    for (let i = 0; i < data.fields.Lines.length; i++) {
                                        let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        });
                                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines[i].fields.ID || '',
                                            item: data.fields.Lines[i].fields.ProductName || '',
                                            description: data.fields.Lines[i].fields.ProductDescription || '',
                                            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };
                                        var dataListTable = [
                                            data.fields.Lines[i].fields.ProductName || '',
                                            data.fields.Lines[i].fields.ProductDescription || '',
                                            "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                            "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                            data.fields.Lines[i].fields.LineTaxCode || '',
                                            AmountGbp || currencySymbol + '' + 0.00,
                                            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                        ];
                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines.fields.ID || '',
                                        description: data.fields.Lines.fields.ProductDescription || '',
                                        quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let invoicerecord = {
                                    id: data.fields.ID,
                                    lid: 'Edit Invoice' + ' ' + data.fields.ID,
                                    socustomer: data.fields.CustomerName,
                                    salesOrderto: data.fields.InvoiceToDesc,
                                    shipto: data.fields.ShipToDesc,
                                    department: data.fields.SaleClassName,
                                    docnumber: data.fields.DocNumber,
                                    custPONumber: data.fields.CustPONumber,
                                    saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: data.fields.EmployeeName,
                                    status: data.fields.SalesStatus,
                                    category: data.fields.SalesCategory,
                                    comments: data.fields.Comments,
                                    pickmemo: data.fields.PickMemo,
                                    ponumber: data.fields.CustPONumber,
                                    via: data.fields.Shipping,
                                    connote: data.fields.ConNote,
                                    reference: data.fields.ReferenceNo,
                                    currency: data.fields.ForeignExchangeCode,
                                    branding: data.fields.MedType,
                                    invoiceToDesc: data.fields.InvoiceToDesc,
                                    shipToDesc: data.fields.ShipToDesc,
                                    termsName: data.fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: data.fields.SaleCustField1,
                                    saleCustField2: data.fields.SaleCustField2,
                                    totalPaid: totalPaidAmount,
                                    ispaid: data.fields.IsPaid
                                };

                                $('#edtCustomerName').val(data.fields.CustomerName);
                                templateObject.CleintName.set(data.fields.CustomerName);
                                $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);
                                    }
                                }
                                /* END  attachment */
                                setTimeout(function () {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == data.fields.CustomerName) {
                                                invoicerecord.firstname = clientList[i].firstname || '';
                                                invoicerecord.lastname = clientList[i].lastname || '';
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                            }
                                        }
                                    };

                                    if (data.fields.IsPaid === true) {
                                        $('#edtCustomerName').attr('readonly', true);
                                        $('#edtCustomerName').attr('disabled', 'disabled');
                                        $('.btn-primary').attr('disabled', 'disabled');
                                        $('#btnCopyInvoice').attr('disabled', 'disabled');
                                        $('#edtCustomerName').css('background-color', '#eaecf4');
                                        $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                        $('.btnSave').attr('disabled', 'disabled');
                                        $('#btnBack').removeAttr('disabled', 'disabled');
                                        $('.printConfirm').removeAttr('disabled', 'disabled');
                                        $('.tblInvoiceLine tbody tr').each(function () {
                                            var $tblrow = $(this);
                                            $tblrow.find("td").attr('contenteditable', false);
                                            $tblrow.find("td").removeClass("lineProductName");
                                            $tblrow.find("td").removeClass("lineTaxRate");
                                            $tblrow.find("td").removeClass("lineTaxCode");

                                            $tblrow.find("td").attr('readonly', true);
                                            $tblrow.find("td").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        });
                                    }
                                }, 100);

                                templateObject.invoicerecord.set(invoicerecord);

                                templateObject.selectedCurrency.set(invoicerecord.currency);
                                templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                                if (templateObject.invoicerecord.get()) {

                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                        if (error) {}
                                        else {
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
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');
                                                    }

                                                }
                                            }

                                        }
                                    });
                                }
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                        setTimeout(function () {
                            let getTotal = $('#totalBalanceDue').text();
                            $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                            $('.pdfCustomerName').html($('#edtCustomerName').val());
                            let invoice_total = getTotal.replace(currency_symbol, '').replace(',', '');
                            let paymentItems = [];
                            let paymentLineItems = {};
                            let dueAmount = utilityService.modifynegativeCurrencyFormat(parseFloat(invoice_total) - parseFloat(paidAmount)).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0;
                            let amountPaid = Currency + '' + paidAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            paymentLineItems = {
                                id: '',
                                invoiceid: getso_id || '',
                                transid: getso_id || '',
                                invoicedate: transDate,
                                transtype: "Invoice",
                                amountdue: dueAmount || 0,
                                paymentamount: amountPaid || 0,
                                ouststandingamount: dueAmount,
                                orginalamount: getTotal
                            };
                            paymentItems.push(paymentLineItems);

                            let record = {
                                customerName: company_name || '',
                                paymentDate: transDate,
                                reference: '',
                                paymentAmount: paidAmount || 0,
                                notes: $("txaComment").val() || '',
                                LineItems: paymentItems,
                                department: "Default",
                                applied: currency_symbol + '' + paidAmount

                            };
                            templateObject.record.set(record);
                        }, 1500)

                    }
                }).catch(function (err) {
                    accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                        templateObject.singleInvoiceData.set(data);
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        let exchangeCode = data.fields.ForeignExchangeCode;
                        let currencySymbol = Currency;
                        let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                                let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines[i].fields.ID || '',
                                    item: data.fields.Lines[i].fields.ProductName || '',
                                    description: data.fields.Lines[i].fields.ProductDescription || '',
                                    quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                    qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0,

                                };
                                var dataListTable = [
                                    data.fields.Lines[i].fields.ProductName || '',
                                    data.fields.Lines[i].fields.ProductDescription || '',
                                    "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                    "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                    data.fields.Lines[i].fields.LineTaxCode || '',
                                    AmountGbp || currencySymbol + '' + 0.00,
                                    '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                ];
                                lineItemsTable.push(dataListTable);
                                lineItems.push(lineItemObj);
                            }
                        } else {
                            let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines.fields.ID || '',
                                description: data.fields.Lines.fields.ProductDescription || '',
                                quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0
                            };
                            lineItems.push(lineItemObj);
                        }

                        let invoicerecord = {
                            id: data.fields.ID,
                            lid: 'Edit Invoice' + ' ' + data.fields.ID,
                            socustomer: data.fields.CustomerName,
                            salesOrderto: data.fields.InvoiceToDesc,
                            shipto: data.fields.ShipToDesc,
                            department: data.fields.SaleClassName,
                            docnumber: data.fields.DocNumber,
                            custPONumber: data.fields.CustPONumber,
                            saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                            duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                            employeename: data.fields.EmployeeName,
                            status: data.fields.SalesStatus,
                            category: data.fields.SalesCategory,
                            comments: data.fields.Comments,
                            pickmemo: data.fields.PickMemo,
                            ponumber: data.fields.CustPONumber,
                            via: data.fields.Shipping,
                            connote: data.fields.ConNote,
                            reference: data.fields.ReferenceNo,
                            currency: data.fields.ForeignExchangeCode,
                            branding: data.fields.MedType,
                            invoiceToDesc: data.fields.InvoiceToDesc,
                            shipToDesc: data.fields.ShipToDesc,
                            termsName: data.fields.TermsName,
                            Total: totalInc,
                            LineItems: lineItems,
                            TotalTax: totalTax,
                            SubTotal: subTotal,
                            balanceDue: totalBalance,
                            saleCustField1: data.fields.SaleCustField1,
                            saleCustField2: data.fields.SaleCustField2,
                            totalPaid: totalPaidAmount,
                            ispaid: data.fields.IsPaid
                        };

                        $('#edtCustomerName').val(data.fields.CustomerName);
                        templateObject.CleintName.set(data.fields.CustomerName);
                        $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                        /* START attachment */
                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);
                            }
                        }
                        /* END  attachment */
                        setTimeout(function () {
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.CustomerName) {
                                        invoicerecord.firstname = clientList[i].firstname;
                                        invoicerecord.surname = clientList[i].lastname;
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                        $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                    }
                                }
                            };

                            if (data.fields.IsPaid === true) {
                                $('#edtCustomerName').attr('readonly', true);
                                $('#edtCustomerName').attr('disabled', 'disabled');
                                $('.btn-primary').attr('disabled', 'disabled');
                                $('#btnCopyInvoice').attr('disabled', 'disabled');
                                $('#edtCustomerName').css('background-color', '#eaecf4');
                                $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                $('.btnSave').attr('disabled', 'disabled');
                                $('#btnBack').removeAttr('disabled', 'disabled');
                                $('.printConfirm').removeAttr('disabled', 'disabled');
                                $('.tblInvoiceLine tbody tr').each(function () {
                                    var $tblrow = $(this);
                                    $tblrow.find("td").attr('contenteditable', false);
                                    $tblrow.find("td").removeClass("lineProductName");
                                    $tblrow.find("td").removeClass("lineTaxRate");
                                    $tblrow.find("td").removeClass("lineTaxCode");

                                    $tblrow.find("td").attr('readonly', true);
                                    $tblrow.find("td").attr('disabled', 'disabled');
                                    $tblrow.find("td").css('background-color', '#eaecf4');
                                    $tblrow.find("td .table-remove").removeClass("btnRemove");
                                });
                            }
                        }, 100);

                        templateObject.invoicerecord.set(invoicerecord);
                        templateObject.selectedCurrency.set(invoicerecord.currency);
                        templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                        if (templateObject.invoicerecord.get()) {

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                if (error) {}
                                else {
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
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                            }

                                        }
                                    }

                                }
                            });
                        }
                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');

                    });
                });

            };
            templateObject.getInvoiceData();
            try {
                $('#html-2-pdfwrapper1').css('display', 'block');
                async function addAttachment() {

                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = getso_id;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];
                        pdfObject = {
                            filename: 'Customer Payment-' + paymentID + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);
                        let erpInvoiceId = getso_id;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('mySession');
                        let customerEmailName = $('#edtCustomerName').val();
                        let checkEmailData = url.searchParams.get("email");
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + paymentID + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
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
                            '                        Please find payment <span>' + paymentID + '</span> attached below.' +
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

                        Meteor.call('sendEmail', {
                            from: "" + mailFromName + " <" + mailFrom + ">",
                            to: checkEmailData,
                            subject: mailSubject,
                            text: '',
                            html: htmlmailBody,
                            attachments: attachment
                        }, function (error, result) {

                            if (error && error.error === "error") {
                                Router.go('/invoicelist?success=true');
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Customer: " + checkEmailData,
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {

                                        Router.go('/invoicelist?success=true');
                                    } else if (result.dismiss === 'cancel') {
                                        Router.go('/invoicelist?success=true');
                                    } else {
                                        Router.go('/invoicelist?success=true');
                                    }
                                });
                            }

                        });

                    }

                }
                setTimeout(function () {
                    addAttachment();
                }, 2500);

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper1');
                        doc.addHTML(source, function () {
                            resolve(doc.output('blob'));
                        });
                    });
                }
            } catch (err) {}

        }
    } else if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        $('.printID').attr("id", currentInvoice);
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            templateObject.getInvoiceData = function () {

                getVS1Data('TInvoiceEx').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        let customerData = templateObject.clientrecords.get();
                        accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                            templateObject.singleInvoiceData.set(data);
                            let cust_result = customerData.filter(cust_data => {
                                return cust_data.customername == data.fields.CustomerName
                            });
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};
                            let exchangeCode = data.fields.ForeignExchangeCode;
                            let currencySymbol = Currency;
                            let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                    let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                    let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines[i].fields.ID || '',
                                        item: data.fields.Lines[i].fields.ProductName || '',
                                        description: data.fields.Lines[i].fields.ProductDescription || '',
                                        quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                        qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0,

                                    };
                                    var dataListTable = [
                                        data.fields.Lines[i].fields.ProductName || '',
                                        data.fields.Lines[i].fields.ProductDescription || '',
                                        "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                        "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                        data.fields.Lines[i].fields.LineTaxCode || '',
                                        AmountGbp || currencySymbol + '' + 0.00,
                                        '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                    ];
                                    lineItemsTable.push(dataListTable);
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines.fields.ID || '',
                                    description: data.fields.Lines.fields.ProductDescription || '',
                                    quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                    unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }

                            let invoicerecord = {
                                id: data.fields.ID,
                                lid: 'Edit Invoice' + ' ' + data.fields.ID,
                                socustomer: data.fields.CustomerName,
                                salesOrderto: data.fields.InvoiceToDesc,
                                shipto: data.fields.ShipToDesc,
                                department: data.fields.SaleClassName,
                                docnumber: data.fields.DocNumber,
                                custPONumber: data.fields.CustPONumber,
                                saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                                duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                employeename: data.fields.EmployeeName,
                                status: data.fields.SalesStatus,
                                category: data.fields.SalesCategory,
                                comments: data.fields.Comments,
                                pickmemo: data.fields.PickMemo,
                                ponumber: data.fields.CustPONumber,
                                via: data.fields.Shipping,
                                connote: data.fields.ConNote,
                                reference: data.fields.ReferenceNo,
                                currency: data.fields.ForeignExchangeCode,
                                branding: data.fields.MedType,
                                invoiceToDesc: data.fields.InvoiceToDesc,
                                shipToDesc: data.fields.ShipToDesc,
                                termsName: data.fields.TermsName,
                                Total: totalInc,
                                LineItems: lineItems,
                                TotalTax: totalTax,
                                SubTotal: subTotal,
                                balanceDue: totalBalance,
                                saleCustField1: data.fields.SaleCustField1,
                                saleCustField2: data.fields.SaleCustField2,
                                totalPaid: totalPaidAmount,
                                ispaid: data.fields.IsPaid
                            };

                            $('#edtCustomerName').val(data.fields.CustomerName);
                            templateObject.CleintName.set(data.fields.CustomerName);
                            $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                            /* START attachment */
                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);
                                }
                            }
                            /* END  attachment */
                            setTimeout(function () {
                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].customername == data.fields.CustomerName) {
                                            invoicerecord.firstname = clientList[i].firstname || '';
                                            invoicerecord.lastname = clientList[i].lastname || '';
                                            templateObject.invoicerecord.set(invoicerecord);
                                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                            $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                            $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                        }
                                    }
                                };

                                if (data.fields.IsPaid === true) {
                                    $('#edtCustomerName').attr('readonly', true);
                                    $('#edtCustomerName').attr('disabled', 'disabled');
                                    $('.btn-primary').attr('disabled', 'disabled');

                                    $('#btnCopyInvoice').attr('disabled', 'disabled');
                                    $('#edtCustomerName').css('background-color', '#eaecf4');

                                    $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                    $('.btnSave').attr('disabled', 'disabled');
                                    $('#btnBack').removeAttr('disabled', 'disabled');
                                    $('.printConfirm').removeAttr('disabled', 'disabled');
                                    $('.tblInvoiceLine tbody tr').each(function () {
                                        var $tblrow = $(this);
                                        $tblrow.find("td").attr('contenteditable', false);
                                        $tblrow.find("td").removeClass("lineProductName");
                                        $tblrow.find("td").removeClass("lineTaxRate");
                                        $tblrow.find("td").removeClass("lineTaxCode");

                                        $tblrow.find("td").attr('readonly', true);
                                        $tblrow.find("td").attr('disabled', 'disabled');
                                        $tblrow.find("td").css('background-color', '#eaecf4');
                                        $tblrow.find("td .table-remove").removeClass("btnRemove");
                                    });
                                }
                            }, 100);

                            templateObject.invoicerecord.set(invoicerecord);

                            templateObject.selectedCurrency.set(invoicerecord.currency);
                            templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                            if (templateObject.invoicerecord.get()) {

                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                    if (error) {}
                                    else {
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
                                                } else if (hiddenColumn == false) {
                                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                                    $("." + columnClass + "").addClass('showColumn');

                                                }

                                            }
                                        }

                                    }
                                });
                            }
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');

                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tinvoiceex;
                        let customerData = templateObject.clientrecords.get();

                        var added = false;
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentInvoice) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let cust_result = customerData.filter(cust_data => {
                                    return cust_data.customername == useData[d].fields.ClientName
                                });
                                templateObject.singleInvoiceData.set(useData[d]);
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = useData[d].fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalInc = currencySymbol + '' + useData[d].fields.TotalAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let subTotal = currencySymbol + '' + useData[d].fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalTax = currencySymbol + '' + useData[d].fields.TotalTax.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                let totalPaidAmount = currencySymbol + '' + useData[d].fields.TotalPaid.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                if (useData[d].fields.Lines.length) {
                                    for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                        let AmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        });
                                        let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: useData[d].fields.Lines[i].fields.ID || '',
                                            item: useData[d].fields.Lines[i].fields.ProductName || '',
                                            description: useData[d].fields.Lines[i].fields.ProductDescription || '',
                                            quantity: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: useData[d].fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: useData[d].fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };
                                        var dataListTable = [
                                            useData[d].fields.Lines[i].fields.ProductName || '',
                                            useData[d].fields.Lines[i].fields.ProductDescription || '',
                                            "<div contenteditable='true' class='qty'>" + '' + useData[d].fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                            "<div>" + '' + currencySymbol + '' + useData[d].fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                            useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            AmountGbp || currencySymbol + '' + 0.00,
                                            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                        ];
                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = useData[d].fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let currencyAmountGbp = currencySymbol + '' + useData[d].fields.Lines.fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = currencySymbol + '' + useData[d].fields.Lines.fields.LineTaxRate;
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: useData[d].fields.Lines.fields.ID || '',
                                        description: useData[d].fields.Lines.fields.ProductDescription || '',
                                        quantity: useData[d].fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: useData[d].fields.Lines.fields.LinePrice.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: useData[d].fields.Lines.fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: useData[d].fields.Lines.fields.LineTaxRate || 0,
                                        taxCode: useData[d].fields.Lines.fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let invoicerecord = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit Invoice' + ' ' + useData[d].fields.ID,
                                    socustomer: useData[d].fields.CustomerName,
                                    salesOrderto: useData[d].fields.InvoiceToDesc,
                                    shipto: useData[d].fields.ShipToDesc,
                                    department: useData[d].fields.SaleClassName,
                                    docnumber: useData[d].fields.DocNumber,
                                    custPONumber: useData[d].fields.CustPONumber,
                                    saledate: useData[d].fields.SaleDate ? moment(useData[d].fields.SaleDate).format('DD/MM/YYYY') : "",
                                    duedate: useData[d].fields.DueDate ? moment(useData[d].fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: useData[d].fields.EmployeeName,
                                    status: useData[d].fields.SalesStatus,
                                    category: useData[d].fields.SalesCategory,
                                    comments: useData[d].fields.Comments,
                                    pickmemo: useData[d].fields.PickMemo,
                                    ponumber: useData[d].fields.CustPONumber,
                                    via: useData[d].fields.Shipping,
                                    connote: useData[d].fields.ConNote,
                                    reference: useData[d].fields.ReferenceNo,
                                    currency: useData[d].fields.ForeignExchangeCode,
                                    branding: useData[d].fields.MedType,
                                    invoiceToDesc: useData[d].fields.InvoiceToDesc,
                                    shipToDesc: useData[d].fields.ShipToDesc,
                                    termsName: useData[d].fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: useData[d].fields.SaleCustField1,
                                    saleCustField2: useData[d].fields.SaleCustField2,
                                    totalPaid: totalPaidAmount,
                                    ispaid: useData[d].fields.IsPaid
                                };

                                $('#edtCustomerName').val(useData[d].fields.CustomerName);
                                templateObject.CleintName.set(useData[d].fields.CustomerName);
                                $('#sltCurrency').val(useData[d].fields.ForeignExchangeCode);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (useData[d].fields.Attachments) {
                                    if (useData[d].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[d].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[d].fields.Attachments);
                                    }
                                }
                                /* END  attachment */
                                setTimeout(function () {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == useData[d].fields.CustomerName) {
                                                invoicerecord.firstname = clientList[i].firstname || '';
                                                invoicerecord.lastname = clientList[i].lastname || '';
                                                templateObject.invoicerecord.set(invoicerecord);
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                                $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                                $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                            }
                                        }
                                    };

                                    if (useData[d].fields.IsPaid === true) {
                                        $('#edtCustomerName').attr('readonly', true);
                                        $('#edtCustomerName').attr('disabled', 'disabled');
                                        $('.btn-primary').attr('disabled', 'disabled');
                                        $('#edtCustomerName').css('background-color', '#eaecf4');

                                        $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                        $('.btnSave').attr('disabled', 'disabled');
                                        $('#btnBack').removeAttr('disabled', 'disabled');
                                        $('.printConfirm').removeAttr('disabled', 'disabled');
                                        $('.tblInvoiceLine tbody tr').each(function () {
                                            var $tblrow = $(this);
                                            $tblrow.find("td").attr('contenteditable', false);
                                            $tblrow.find("td").removeClass("lineProductName");
                                            $tblrow.find("td").removeClass("lineTaxRate");
                                            $tblrow.find("td").removeClass("lineTaxCode");

                                            $tblrow.find("td").attr('readonly', true);
                                            $tblrow.find("td").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        });
                                    }

                                }, 100);

                                templateObject.invoicerecord.set(invoicerecord);

                                templateObject.selectedCurrency.set(invoicerecord.currency);
                                templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                                if (templateObject.invoicerecord.get()) {

                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                        if (error) {}
                                        else {
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
                            accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                                templateObject.singleInvoiceData.set(data);
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = data.fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                if (data.fields.Lines.length) {
                                    for (let i = 0; i < data.fields.Lines.length; i++) {
                                        let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        });
                                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines[i].fields.ID || '',
                                            item: data.fields.Lines[i].fields.ProductName || '',
                                            description: data.fields.Lines[i].fields.ProductDescription || '',
                                            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };
                                        var dataListTable = [
                                            data.fields.Lines[i].fields.ProductName || '',
                                            data.fields.Lines[i].fields.ProductDescription || '',
                                            "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                            "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                            data.fields.Lines[i].fields.LineTaxCode || '',
                                            AmountGbp || currencySymbol + '' + 0.00,
                                            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                        ];
                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines.fields.ID || '',
                                        description: data.fields.Lines.fields.ProductDescription || '',
                                        quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let invoicerecord = {
                                    id: data.fields.ID,
                                    lid: 'Edit Invoice' + ' ' + data.fields.ID,
                                    socustomer: data.fields.CustomerName,
                                    salesOrderto: data.fields.InvoiceToDesc,
                                    shipto: data.fields.ShipToDesc,
                                    department: data.fields.SaleClassName,
                                    docnumber: data.fields.DocNumber,
                                    custPONumber: data.fields.CustPONumber,
                                    saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: data.fields.EmployeeName,
                                    status: data.fields.SalesStatus,
                                    category: data.fields.SalesCategory,
                                    comments: data.fields.Comments,
                                    pickmemo: data.fields.PickMemo,
                                    ponumber: data.fields.CustPONumber,
                                    via: data.fields.Shipping,
                                    connote: data.fields.ConNote,
                                    reference: data.fields.ReferenceNo,
                                    currency: data.fields.ForeignExchangeCode,
                                    branding: data.fields.MedType,
                                    invoiceToDesc: data.fields.InvoiceToDesc,
                                    shipToDesc: data.fields.ShipToDesc,
                                    termsName: data.fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance,
                                    saleCustField1: data.fields.SaleCustField1,
                                    saleCustField2: data.fields.SaleCustField2,
                                    totalPaid: totalPaidAmount,
                                    ispaid: data.fields.IsPaid
                                };

                                $('#edtCustomerName').val(data.fields.CustomerName);
                                templateObject.CleintName.set(data.fields.CustomerName);
                                $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);
                                    }
                                }
                                /* END  attachment */
                                setTimeout(function () {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == data.fields.CustomerName) {
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                                $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                                $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                            }
                                        }
                                    };

                                    if (data.fields.IsPaid === true) {
                                        $('#edtCustomerName').attr('readonly', true);
                                        $('#edtCustomerName').attr('disabled', 'disabled');
                                        $('.btn-primary').attr('disabled', 'disabled');
                                        $('#btnCopyInvoice').attr('disabled', 'disabled');
                                        $('#edtCustomerName').css('background-color', '#eaecf4');

                                        $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                        $('.btnSave').attr('disabled', 'disabled');
                                        $('#btnBack').removeAttr('disabled', 'disabled');
                                        $('.printConfirm').removeAttr('disabled', 'disabled');
                                        $('.tblInvoiceLine tbody tr').each(function () {
                                            var $tblrow = $(this);
                                            $tblrow.find("td").attr('contenteditable', false);
                                            $tblrow.find("td").removeClass("lineProductName");
                                            $tblrow.find("td").removeClass("lineTaxRate");
                                            $tblrow.find("td").removeClass("lineTaxCode");

                                            $tblrow.find("td").attr('readonly', true);
                                            $tblrow.find("td").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        });
                                    }
                                }, 100);

                                templateObject.invoicerecord.set(invoicerecord);

                                templateObject.selectedCurrency.set(invoicerecord.currency);
                                templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                                if (templateObject.invoicerecord.get()) {

                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                        if (error) {}
                                        else {
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
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');

                                                    }

                                                }
                                            }

                                        }
                                    });
                                }
                            }).catch(function (err) {

                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');

                            });
                        }

                    }
                }).catch(function (err) {
                    let customerData = templateObject.clientrecords.get();
                    accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                        templateObject.singleInvoiceData.set(data);
                        let cust_result = customerData.filter(cust_data => {
                            return cust_data.customername == data.fields.CustomerName
                        });
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        let exchangeCode = data.fields.ForeignExchangeCode;
                        let currencySymbol = Currency;
                        let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                                let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines[i].fields.ID || '',
                                    item: data.fields.Lines[i].fields.ProductName || '',
                                    description: data.fields.Lines[i].fields.ProductDescription || '',
                                    quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                    qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LinePrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0,

                                };
                                var dataListTable = [
                                    data.fields.Lines[i].fields.ProductName || '',
                                    data.fields.Lines[i].fields.ProductDescription || '',
                                    "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                    "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                    data.fields.Lines[i].fields.LineTaxCode || '',
                                    AmountGbp || currencySymbol + '' + 0.00,
                                    '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                                ];
                                lineItemsTable.push(dataListTable);
                                lineItems.push(lineItemObj);
                            }
                        } else {
                            let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines.fields.ID || '',
                                description: data.fields.Lines.fields.ProductDescription || '',
                                quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0
                            };
                            lineItems.push(lineItemObj);
                        }

                        let invoicerecord = {
                            id: data.fields.ID,
                            lid: 'Edit Invoice' + ' ' + data.fields.ID,
                            salesOrderto: data.fields.InvoiceToDesc,
                            shipto: data.fields.ShipToDesc,
                            department: data.fields.SaleClassName,
                            docnumber: data.fields.DocNumber,
                            custPONumber: data.fields.CustPONumber,
                            saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                            duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                            employeename: data.fields.EmployeeName,
                            status: data.fields.SalesStatus,
                            category: data.fields.SalesCategory,
                            comments: data.fields.Comments,
                            pickmemo: data.fields.PickMemo,
                            ponumber: data.fields.CustPONumber,
                            via: data.fields.Shipping,
                            connote: data.fields.ConNote,
                            reference: data.fields.ReferenceNo,
                            currency: data.fields.ForeignExchangeCode,
                            branding: data.fields.MedType,
                            invoiceToDesc: data.fields.InvoiceToDesc,
                            shipToDesc: data.fields.ShipToDesc,
                            termsName: data.fields.TermsName,
                            Total: totalInc,
                            LineItems: lineItems,
                            TotalTax: totalTax,
                            SubTotal: subTotal,
                            balanceDue: totalBalance,
                            saleCustField1: data.fields.SaleCustField1,
                            saleCustField2: data.fields.SaleCustField2,
                            totalPaid: totalPaidAmount,
                            ispaid: data.fields.IsPaid
                        };

                        $('#edtCustomerName').val(data.fields.CustomerName);
                        templateObject.CleintName.set(data.fields.CustomerName);
                        $('#sltCurrency').val(data.fields.ForeignExchangeCode);

                        /* START attachment */
                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);
                            }
                        }
                        /* END  attachment */
                        setTimeout(function () {
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.CustomerName) {
                                        invoicerecord.firstname = clientList[i].firstname || '';
                                        invoicerecord.lastname = clientList[i].lastname || '';
                                        templateObject.invoicerecord.set(invoicerecord);
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                        $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                    }
                                }
                            };

                            if (data.fields.IsPaid === true) {
                                $('#edtCustomerName').attr('readonly', true);
                                $('#edtCustomerName').attr('disabled', 'disabled');
                                $('.btn-primary').attr('disabled', 'disabled');
                                $('#btnCopyInvoice').attr('disabled', 'disabled');
                                $('#edtCustomerName').css('background-color', '#eaecf4');

                                $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                $('.btnSave').attr('disabled', 'disabled');
                                $('#btnBack').removeAttr('disabled', 'disabled');
                                $('.printConfirm').removeAttr('disabled', 'disabled');
                                $('.tblInvoiceLine tbody tr').each(function () {
                                    var $tblrow = $(this);
                                    $tblrow.find("td").attr('contenteditable', false);
                                    $tblrow.find("td").removeClass("lineProductName");
                                    $tblrow.find("td").removeClass("lineTaxRate");
                                    $tblrow.find("td").removeClass("lineTaxCode");

                                    $tblrow.find("td").attr('readonly', true);
                                    $tblrow.find("td").attr('disabled', 'disabled');
                                    $tblrow.find("td").css('background-color', '#eaecf4');
                                    $tblrow.find("td .table-remove").removeClass("btnRemove");
                                });
                            }
                        }, 100);

                        templateObject.invoicerecord.set(invoicerecord);

                        templateObject.selectedCurrency.set(invoicerecord.currency);
                        templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                        if (templateObject.invoicerecord.get()) {

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                                if (error) {}
                                else {
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
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');

                                            }

                                        }
                                    }

                                }
                            });
                        }
                    }).catch(function (err) {

                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');

                    });
                });

            };

            templateObject.getInvoiceData();
        }
    } else if (url.indexOf('?copyinvid=') > 0) {
        var getso_id = url.split('?copyinvid=');
        var currentInvoice = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            $('.printID').attr("id", currentInvoice);
            templateObject.getInvoiceData = function () {
                let customerData = templateObject.clientrecords.get();
                accountService.getOneInvoicedataEx(currentInvoice).then(function (data) {
                    templateObject.singleInvoiceData.set(data);
                    let cust_result = customerData.filter(cust_data => {
                        return cust_data.customername == useData[d].fields.ClientName
                    });
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    let exchangeCode = data.fields.ForeignExchangeCode;
                    let currencySymbol = Currency;
                    let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalBalance = currencySymbol + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                item: data.fields.Lines[i].fields.ProductName || '',
                                description: data.fields.Lines[i].fields.ProductDescription || '',
                                quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0,

                            };
                            var dataListTable = [
                                data.fields.Lines[i].fields.ProductName || '',
                                data.fields.Lines[i].fields.ProductDescription || '',
                                "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                data.fields.Lines[i].fields.LineTaxCode || '',
                                AmountGbp || currencySymbol + '' + 0.00,
                                '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                            ];
                            lineItemsTable.push(dataListTable);
                            lineItems.push(lineItemObj);
                        }
                    } else {
                        let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                        let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                        lineItemObj = {
                            lineID: Random.id(),
                            id: data.fields.Lines.fields.ID || '',
                            description: data.fields.Lines.fields.ProductDescription || '',
                            quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                            unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                            TotalAmt: AmountGbp || 0,
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0
                        };
                        lineItems.push(lineItemObj);
                    }

                    let invoicerecord = {
                        id: data.fields.ID,
                        lid: 'New Invoice',
                        socustomer: data.fields.CustomerName,
                        salesOrderto: data.fields.InvoiceToDesc,
                        shipto: data.fields.ShipToDesc,
                        department: data.fields.SaleClassName,
                        docnumber: data.fields.DocNumber,
                        custPONumber: data.fields.CustPONumber,
                        saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                        duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                        employeename: data.fields.EmployeeName,
                        status: data.fields.SalesStatus,
                        category: data.fields.SalesCategory,
                        comments: data.fields.Comments,
                        pickmemo: data.fields.PickMemo,
                        ponumber: data.fields.CustPONumber,
                        via: data.fields.Shipping,
                        connote: data.fields.ConNote,
                        reference: data.fields.ReferenceNo,
                        currency: data.fields.ForeignExchangeCode,
                        branding: data.fields.MedType,
                        invoiceToDesc: data.fields.InvoiceToDesc,
                        shipToDesc: data.fields.ShipToDesc,
                        termsName: data.fields.TermsName,
                        Total: totalInc,
                        LineItems: lineItems,
                        TotalTax: totalTax,
                        SubTotal: subTotal,
                        balanceDue: totalBalance,
                        saleCustField1: data.fields.SaleCustField1,
                        saleCustField2: data.fields.SaleCustField2,
                        totalPaid: totalPaidAmount,
                        ispaid: false
                    };

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    templateObject.CleintName.set(data.fields.CustomerName);
                    $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                    templateObject.attachmentCount.set(0);
                    if (data.fields.Attachments) {
                        if (data.fields.Attachments.length) {
                            templateObject.attachmentCount.set(data.fields.Attachments.length);
                            templateObject.uploadedFiles.set(data.fields.Attachments);
                        }
                    }
                    setTimeout(function () {
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    invoicerecord.firstname = clientList[i].firstname || '';
                                    invoicerecord.lastname = clientList[i].lastname || '';
                                    templateObject.invoicerecord.set(invoicerecord);
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                }
                            }
                        }
                    }, 100);

                    templateObject.invoicerecord.set(invoicerecord);
                    templateObject.selectedCurrency.set(invoicerecord.currency);
                    templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                    if (templateObject.invoicerecord.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                            if (error) {}
                            else {
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
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                        }

                                    }
                                }

                            }
                        });
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            };

            templateObject.getInvoiceData();
        }
    } else if (url.indexOf('?copysoid=') > 0) {
        var getso_id = url.split('?copysoid=');
        var currentInvoice = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            $('.printID').attr("id", currentInvoice);
            templateObject.getInvoiceData = function () {
                accountService.getOneSalesOrderdataEx(currentInvoice).then(function (data) {
                    templateObject.singleInvoiceData.set(data);
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    let exchangeCode = data.fields.ForeignExchangeCode;
                    let currencySymbol = Currency;
                    let total = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalInc = currencySymbol + '' + data.fields.TotalAmountInc.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let subTotal = currencySymbol + '' + data.fields.TotalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalTax = currencySymbol + '' + data.fields.TotalTax.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalBalance = currencySymbol + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalPaidAmount = currencySymbol + '' + data.fields.TotalPaid.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            let AmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = currencySymbol + '' + data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                item: data.fields.Lines[i].fields.ProductName || '',
                                description: data.fields.Lines[i].fields.ProductDescription || '',
                                quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0,

                            };
                            var dataListTable = [
                                data.fields.Lines[i].fields.ProductName || '',
                                data.fields.Lines[i].fields.ProductDescription || '',
                                "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                data.fields.Lines[i].fields.LineTaxCode || '',
                                AmountGbp || currencySymbol + '' + 0.00,
                                '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                            ];
                            lineItemsTable.push(dataListTable);
                            lineItems.push(lineItemObj);
                        }
                    } else {
                        let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                        let TaxTotalGbp = cutilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                        let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
                        lineItemObj = {
                            lineID: Random.id(),
                            id: data.fields.Lines.fields.ID || '',
                            description: data.fields.Lines.fields.ProductDescription || '',
                            quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                            unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                            TotalAmt: AmountGbp || 0,
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0
                        };
                        lineItems.push(lineItemObj);
                    }

                    let invoicerecord = {
                        id: data.fields.ID,
                        lid: 'New Invoice',
                        socustomer: data.fields.CustomerName,
                        salesOrderto: data.fields.InvoiceToDesc,
                        shipto: data.fields.ShipToDesc,
                        department: data.fields.SaleClassName,
                        docnumber: data.fields.DocNumber,
                        custPONumber: data.fields.CustPONumber,
                        saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                        duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                        employeename: data.fields.EmployeeName,
                        status: data.fields.SalesStatus,
                        category: data.fields.SalesCategory,
                        comments: data.fields.Comments,
                        pickmemo: data.fields.PickMemo,
                        ponumber: data.fields.CustPONumber,
                        via: data.fields.Shipping,
                        connote: data.fields.ConNote,
                        reference: data.fields.ReferenceNo,
                        currency: data.fields.ForeignExchangeCode,
                        branding: data.fields.MedType,
                        invoiceToDesc: data.fields.InvoiceToDesc,
                        shipToDesc: data.fields.ShipToDesc,
                        termsName: data.fields.TermsName,
                        Total: totalInc,
                        LineItems: lineItems,
                        TotalTax: totalTax,
                        SubTotal: subTotal,
                        balanceDue: totalBalance,
                        saleCustField1: data.fields.SaleCustField1,
                        saleCustField2: data.fields.SaleCustField2,
                        totalPaid: totalPaidAmount,
                        ispaid: false
                    };

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    templateObject.CleintName.set(data.fields.CustomerName);
                    $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                    /* START attachment */
                    templateObject.attachmentCount.set(0);
                    if (data.fields.Attachments) {
                        if (data.fields.Attachments.length) {
                            templateObject.attachmentCount.set(data.fields.Attachments.length);
                            templateObject.uploadedFiles.set(data.fields.Attachments);
                        }
                    }
                    /* END  attachment */
                    setTimeout(function () {
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    invoicerecord.firstname = clientList[i].firstname || '';
                                    invoicerecord.lastname = clientList[i].lastname || '';
                                    templateObject.invoicerecord.set(invoicerecord);
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                }
                            }
                        }
                    }, 100);

                    templateObject.invoicerecord.set(invoicerecord);
                    templateObject.selectedCurrency.set(invoicerecord.currency);
                    templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                    if (templateObject.invoicerecord.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                            if (error) {}
                            else {
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
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                        }

                                    }
                                }

                            }
                        });
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            };

            templateObject.getInvoiceData();
        }
    } else {
        $('.fullScreenSpin').css('display', 'none');

        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        lineItemObj = {
            lineID: Random.id(),
            item: '',
            description: '',
            quantity: '',
            qtyordered: '',
            qtyshipped: '',
            qtybo: '',
            unitPrice: 0,
            taxRate: '',
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
        let invoicerecord = {
            id: '',
            lid: 'New Invoice',
            socustomer: '',
            salesOrderto: '',
            shipto: '',
            department: '',
            docnumber: '',
            custPONumber: '',
            saledate: begunDate,
            duedate: '',
            employeename: '',
            status: '',
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
            TotalTax: Currency + '' + 0.00,
            SubTotal: Currency + '' + 0.00,
            balanceDue: Currency + '' + 0.00,
            saleCustField1: '',
            saleCustField2: '',
            totalPaid: Currency + '' + 0.00,
            ispaid: false
        };

        $('#edtCustomerName').val('');

        templateObject.invoicerecord.set(invoicerecord);
        if (templateObject.invoicerecord.get()) {

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function (error, result) {
                if (error) {}
                else {
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

    templateObject.getDepartments = function () {
        getVS1Data('TDeptClass').then(function (dataObject) {
            if (dataObject.length == 0) {
                salesService.getDepartment().then(function (data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            department: data.tdeptclass[i].DeptClassName || ' ',
                        };

                        deptrecords.push(deptrecordObj);
                        templateObject.deptrecords.set(deptrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;
                for (let i in useData) {

                    let deptrecordObj = {
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }

            }
        }).catch(function (err) {
            salesService.getDepartment().then(function (data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });

    }

    templateObject.getTerms = function () {
        getVS1Data('TTermsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                salesService.getTermVS1().then(function (data) {
                    for (let i in data.ttermsvs1) {

                        let termrecordObj = {
                            termsname: data.ttermsvs1[i].TermsName || ' ',
                        };

                        termrecords.push(termrecordObj);
                        templateObject.termrecords.set(termrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                for (let i in useData) {

                    let termrecordObj = {
                        termsname: useData[i].TermsName || ' ',
                    };

                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }

            }
        }).catch(function (err) {
            salesService.getTermVS1().then(function (data) {
                for (let i in data.ttermsvs1) {

                    let termrecordObj = {
                        termsname: data.ttermsvs1[i].TermsName || ' ',
                    };

                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }
            });
        });

    }

    templateObject.getDepartments();
    templateObject.getTerms();

    let table;
    if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
        var duedate = new Date();
        let dueDate = ("0" + duedate.getDate()).slice(-2) + "/" + ("0" + (duedate.getMonth() + 1)).slice(-2) + "/" + duedate.getFullYear();
        $('.due').text(dueDate);
    }

    $(document).ready(function () {
        $('#edtCustomerName').editableSelect();
        $('#addRow').on('click', function () {
            var rowData = $('#tblInvoiceLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).text("");
            $(".lineProductDesc", rowData).text("");
            $(".lineQty", rowData).val("");
            $(".lineOrdered", rowData).val("");
            $(".lineBo", rowData).val("");
            $(".lineUnitPrice", rowData).val("");
            $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblInvoiceLine tbody").append(rowData);

            if ($('#printID').attr('id') != "") {
                var rowData1 = $('.invoice_print tbody>tr:last').clone(true);
                $("#lineProductName", rowData1).text("");
                $("#lineProductDesc", rowData1).text("");
                $("#lineQty", rowData1).text("");
                $("#lineOrdered", rowData1).text("");
                $("#lineUnitPrice", rowData1).text("");

                $("#lineTaxAmount", rowData1).text("");
                $("#lineAmt", rowData1).text("");
                rowData1.attr('id', tokenid);
                $(".invoice_print tbody").append(rowData1);
            }
        });

    });

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventory tbody tr", function (e) {

        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        let customers = templateObject.clientrecords.get();
        let productExtraSell = templateObject.productextrasellrecords.get();
        var table = $(this);
        var $printrows = $(".invoice_print tbody tr");
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let taxcode1 = "";

        let selectedCust = $('#edtCustomerName').val();
        let getCustDetails = "";
        let lineTaxRate = "";
        let taxRate = ""
            getCustDetails = customers.filter(customer => {
            return customer.customername == selectedCust;
        });

        if (getCustDetails.length > 0) {
            taxRate = taxcodeList.filter(taxrate => {
                return taxrate.codename == getCustDetails[0].taxCode || '';
            });
            if (taxRate.length > 0) {
                if (taxRate.codename != "") {
                    lineTaxRate = taxRate[0].codename
                } else {
                    lineTaxRate = table.find(".taxrate").text();
                }
            } else {
                lineTaxRate = table.find(".taxrate").text();
            }

            taxcode1 = getCustDetails[0].taxCode || '';
        } else {
            lineTaxRate = table.find(".taxrate").text()
        }

        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();

            /*let filterProdExtraSellData =  _.filter(productExtraSell, function (dataProdExtra) {
            return ((dataProdExtra.productname == lineProductName) && (dataProdExtra.clienttype == getCustDetails[0].clienttypename));
            });
            if(filterProdExtraSellData.length > 0){
            lineUnitPrice = filterProdExtraSellData[0].price || 0;
            }*/

            let lineTaxCode = 0;
            let lineAmount = 0;
            let lineTaxAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == lineTaxRate) {

                        $('#' + selectLineID + " .lineTaxRate").text(taxcodeList[i].coderate);
                    }
                }
            }

            $('#' + selectLineID + " .lineProductName").text(lineProductName);
            $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
            $('#' + selectLineID + " .lineOrdered").val(1);
            $('#' + selectLineID + " .lineQty").val(1);
            $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);

            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineProductName").text(lineProductName);
                $('#' + selectLineID + " #lineProductDesc").text(lineProductDesc);
                $('#' + selectLineID + " #lineOrdered").text(1);
                $('#' + selectLineID + " #lineQty").text(1);
                $('#' + selectLineID + " #lineUnitPrice").text(lineUnitPrice);
            }

            if (lineTaxRate == "NT") {
                lineTaxRate = "E";
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }

            } else {
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }
            }

            lineAmount = 1 * Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
            $('#' + selectLineID + " .lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            }
            $('#productListModal').modal('toggle');
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxRate = $tblrow.find(".lineTaxCode").text();
                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
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

            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $printrows.each(function (index) {
                    var $printrows = $(this);
                    var qty = $printrows.find("#lineQty").text() || 0;
                    var price = $printrows.find("#lineUnitPrice").text() || "0";
                    var taxrateamount = 0;
                    var taxRate = $printrows.find("#lineTaxCode").text();
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }

                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

        }
    });

    /* On Click TaxCode List */
    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        var $printrows = $(".invoice_print tbody tr");

        if (selectLineID) {
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $('#' + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
            $('#' + selectLineID + " .lineTaxCode").text(lineTaxCode);
            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxCode);
            }

            $('#taxRateListModal').modal('toggle');
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || '';

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                if ((taxrateamount == '') || (taxrateamount == ' ')) {
                    var taxTotal = 0;
                } else {
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                }
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

            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $printrows.each(function (index) {
                    var $printrows = $(this);
                    var qty = $printrows.find("#lineQty").text() || 0;
                    var price = $printrows.find("#lineUnitPrice").text() || "0";
                    var taxrateamount = 0;
                    var taxRate = $printrows.find("#lineTaxCode").text();
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }
                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

        }
    });

    $('#edtCustomerName').editableSelect()
    .on('select.editable-select', function (e, li) {
        let taxcodeList = templateObject.taxraterecords.get();
        let customers = templateObject.clientrecords.get();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let $printrows = $(".invoice_print tbody tr");
        if (li.text() != undefined) {
            let selectedCustomer = li.text();
            if (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    if (clientList[i].customername == selectedCustomer) {
                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                        $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                        $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + ' ' + clientList[i].statecode + '\n' + clientList[i].country;
                        $('#txabillingAddress').val(postalAddress);
                        $('#pdfCustomerAddress').html(postalAddress);
                        $('.pdfCustomerAddress').text(postalAddress);
                        $('#txaShipingInfo').val(postalAddress);
                        $('#sltTerms').val(clientList[i].termsName || '');
                    }
                }
            }

            let getCustDetails = "";
            let taxRate = ""
                if (selectedCustomer != "") {
                    getCustDetails = customers.filter(customer => {
                        return customer.customername == selectedCustomer
                    });

                    taxRate = taxcodeList.filter(taxrate => {
                        return taxrate.codename == getCustDetails[0].taxCode
                    });

                    if (taxRate.length > 0) {
                        let rate = taxRate[0].coderate;
                        let code = getCustDetails[0].taxCode;
                        if (code == "NT") {
                            code = "E";
                        }
                        let taxcodeList = templateObject.taxraterecords.get();

                        let lineAmount = 0;
                        let subGrandTotal = 0;
                        let taxGrandTotal = 0;
                        let taxGrandTotalPrint = 0;
                        $tblrows.each(function (index) {
                            var $tblrow = $(this);
                            var qty = $tblrow.find(".lineQty").val() || 0;
                            var price = $tblrow.find(".lineUnitPrice").val() || 0;
                            var taxcode = code;
                            $tblrow.find(".lineTaxCode").text(code);
                            $tblrow.find(".lineTaxRate").text(rate);

                            var taxrateamount = 0;
                            if (taxcodeList) {
                                for (var i = 0; i < taxcodeList.length; i++) {
                                    if (taxcodeList[i].codename == taxcode) {
                                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
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

                        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                            $printrows.each(function (index) {
                                var $printrows = $(this);
                                var qty = $printrows.find("#lineQty").text() || 0;
                                var price = $printrows.find("#lineUnitPrice").text() || "0";
                                var taxcode = code;
                                $printrows.find("#lineTaxCode").text(code);
                                $printrows.find("#lineTaxRate").text(rate);
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

                    }
                }
        }

    });

    exportSalesToPdf = function () {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let invoiceData = templateObject.invoicerecord.get();
        let stripe_id = templateObject.accountID.get() || '';
        let stripe_fee_method = templateObject.stripe_fee_method.get();
        let lineItems = [];
        let total = $('#totalBalanceDue').html() || 0;
        let tax = $('#subtotal_tax').html() || 0;
        let customer = $('#edtCustomerName').val();
        let name = $('#firstname').val();
        let surname = $('#lastname').val();
        let dept = $('#sltDept').val();
        var erpGet = erpDb();
        $('#tblInvoiceLine > tbody > tr').each(function () {
            var lineID = this.id;
            let tdproduct = $('#' + lineID + " .lineProductName").text();
            let tddescription = $('#' + lineID + " .lineProductDesc").text();
            let tdQty = $('#' + lineID + " .lineQty").val();
            let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
            let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
            let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
            let tdlineamt = $('#' + lineID + " .lineAmt").text();

            lineItemObj = {
                description: tddescription || '',
                quantity: tdQty || 0,
                unitPrice: tdunitprice.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                }) || 0
            }

            lineItems.push(lineItemObj);
        });
        let company = Session.get('vs1companyName');
        let vs1User = localStorage.getItem('mySession');
        let customerEmail = $('#edtCustomerEmail').val();
        let id = $('.printID').attr("id") || "new";
        stringQuery = "?";
        var customerID = $('#edtCustomerEmail').attr('customerid');
        for (let l = 0; l < lineItems.length; l++) {
            stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
        }
        stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + invoiceData.id + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Invoice&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept;
        // var pdf = new jsPDF('p', 'pt', 'a4');
        // pdf.setFontSize(18);
        $(".linkText").attr("href", "https://www.depot.vs1cloud.com/stripe/" + stringQuery);
        var source = document.getElementById('html-2-pdfwrapper');
        let file = "Invoice.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Invoice-' + id + '.pdf';
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

        // pdf.addHTML(source, function () {

        //     pdf.setFontSize(10);
        //     pdf.setTextColor(255, 255, 255);
        //      pdf.textWithLink('Pay Now', 482, 113, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });

        //     if ($('.printID').attr('id') != undefined || $('.printID').attr('id') == "") {
        //         pdf.save('Invoice-' + id + '.pdf');
        //     } else {
        //         pdf.save('Invoice.pdf');
        //     }
        //     $('#html-2-pdfwrapper').css('display', 'none');
        //      $('.fullScreenSpin').css('display', 'none');
        // });

    };
});
Template.new_invoice.onRendered(function () {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let salesService = new SalesBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];

    tempObj.getAllProducts = function () {
        getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function (data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        var dataList = [
                            data.tproductvs1[i].ProductName || '-',
                            data.tproductvs1[i].SalesDescription || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                            data.tproductvs1[i].TotalQtyInStock,
                            data.tproductvs1[i].TaxCodeSales || ''
                        ];

                        splashArrayProductList.push(dataList);
                    }
                    localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                        $('#tblInventory').dataTable({
                            data: splashArrayProductList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [
                                {
                                    className: "productName",
                                    "targets": [0]
                                }, {
                                    className: "productDesc",
                                    "targets": [1]
                                }, {
                                    className: "costPrice text-right",
                                    "targets": [2]
                                }, {
                                    className: "salePrice text-right",
                                    "targets": [3]
                                }, {
                                    className: "prdqty",
                                    "targets": [4]
                                }, {
                                    className: "taxrate",
                                    "targets": [5]
                                }
                            ],
                            colReorder: true,
                            bStateSave: true,
                            pageLength: 25,
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, "All"]
                            ],
                            info: true,
                            responsive: true

                        });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    var dataList = [

                        useData[i].fields.ProductName || '-',
                        useData[i].fields.SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.SellQty1Price * 100) / 100),
                        useData[i].fields.TotalQtyInStock,
                        useData[i].fields.TaxCodeSales || ''
                    ];

                    if (useData[i].fields.ExtraSellPrice != null) {
                        for (let e = 0; e < useData[i].fields.ExtraSellPrice.length; e++) {
                            let lineExtaSellObj = {
                                clienttype: useData[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                productname: useData[i].fields.ExtraSellPrice[e].fields.ProductName || useData[i].fields.ProductName,
                                price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);

                        }
                    }
                    splashArrayProductList.push(dataList);
                }

                tempObj.productextrasellrecords.set(lineExtaSellItems);
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            {
                                className: "productName",
                                "targets": [0]
                            }, {
                                className: "productDesc",
                                "targets": [1]
                            }, {
                                className: "costPrice text-right",
                                "targets": [2]
                            }, {
                                className: "salePrice text-right",
                                "targets": [3]
                            }, {
                                className: "prdqty",
                                "targets": [4]
                            }, {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,

                        bStateSave: true,

                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                }
            }
        }).catch(function (err) {
            productService.getNewProductListVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {

                    var dataList = [

                        data.tproductvs1[i].ProductName || '-',
                        data.tproductvs1[i].SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                        data.tproductvs1[i].TotalQtyInStock,
                        data.tproductvs1[i].TaxCodeSales || ''
                    ];

                    splashArrayProductList.push(dataList);

                }
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            {
                                className: "productName",
                                "targets": [0]
                            }, {
                                className: "productDesc",
                                "targets": [1]
                            }, {
                                className: "costPrice text-right",
                                "targets": [2]
                            }, {
                                className: "salePrice text-right",
                                "targets": [3]
                            }, {
                                className: "prdqty",
                                "targets": [4]
                            }, {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,

                        bStateSave: true,

                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            })
        });

    };

    tempObj.getAllProducts();
    tempObj.getAllTaxCodes = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                salesService.getTaxCodesVS1().then(function (data) {

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
                            columnDefs: [{
                                    orderable: false,
                                    targets: 0
                                }, {
                                    className: "taxName",
                                    "targets": [1]
                                }, {
                                    className: "taxDesc",
                                    "targets": [2]
                                }, {
                                    className: "taxRate text-right",
                                    "targets": [3]
                                }
                            ],
                            colReorder: true,
                            bStateSave: true,
                            pageLength: 25,
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, "All"]
                            ],
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
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            }, {
                                className: "taxName",
                                "targets": [1]
                            }, {
                                className: "taxDesc",
                                "targets": [2]
                            }, {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,
                        bStateSave: true,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true

                    });
                }
            }
        }).catch(function (err) {
            salesService.getTaxCodesVS1().then(function (data) {

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
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            }, {
                                className: "taxName",
                                "targets": [1]
                            }, {
                                className: "taxDesc",
                                "targets": [2]
                            }, {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,
                        bStateSave: true,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true
                    });

                }
            })
        });

    };
    tempObj.getAllTaxCodes();
});
Template.new_invoice.helpers({
    vs1companyBankName: () => {
        return localStorage.getItem('vs1companyBankName') || '';
    },
    bsbRegionName: () => {
        return bsbCodeName;
    },
    vs1companyBankAccountName: () => {
        return localStorage.getItem('vs1companyBankAccountName') || '';
    },
    vs1companyBankAccountNo: () => {
        return localStorage.getItem('vs1companyBankAccountNo') || '';
    },
    vs1companyBankBSB: () => {
        return localStorage.getItem('vs1companyBankBSB') || '';
    },
    vs1companyBankSwiftCode: () => {
        return localStorage.getItem('vs1companyBankSwiftCode') || '';
    },
    vs1companyBankRoutingNo: () => {
        return localStorage.getItem('vs1companyBankRoutingNo') || '';
    },
    invoicerecord: () => {
        return Template.instance().invoicerecord.get();
    },
    accountID: () => {
        return Template.instance().accountID.get();
    },
    currentDate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function (a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function (a, b) {
            if (a.termsname == 'NA') {
                return 1;
            } else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'new_invoice'
        });
    },
    salesCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblInvoiceLine'
        });
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
    statusrecords: () => {
        return Template.instance().statusrecords.get().sort(function (a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    includeBOnShippedQty: () => {
        return Template.instance().includeBOnShippedQty.get();
    },
    companyname: () => {
        return loggedCompany;
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
    isMobileDevices: () => {
        var isMobile = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
    record: () => {
        return Template.instance().record.get();
    },
});

Template.new_invoice.events({
    'click #edtCustomerName': function (event) {
        $('#edtCustomerName').select();
        $('#edtCustomerName').editableSelect();
    },
    'change #sltStatus': function () {
        let status = $('#sltStatus').find(":selected").val();
        if (status == "newstatus") {
            $('#statusModal').modal();
        }
    },
    'click .btnSaveStatus': function () {
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
                            window.open("/invoicecard?id=" + id);
                        } else {
                            window.open("/invoicecard");
                        }
                    }).catch(function (err) {});
                }).catch(function (err) {
                    window.open('/invoicecard', '_self');
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
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
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
                if (result.value) {}
                else if (result.dismiss === 'cancel') {}
            });
        }
    },
    'blur .lineProductDesc': function (event) {
        var targetID = $(event.target).closest('tr').attr('id');
        $('#' + targetID + " #lineProductDesc").text($('#' + targetID + " .lineProductDesc").text());
    },
    'click .payNow': function () {
        let templateObject = Template.instance();
        let stripe_id = templateObject.accountID.get() || '';
        let stripe_fee_method = templateObject.stripe_fee_method.get();
        if (stripe_id != "") {
            var url = window.location.href;
            var id_available = url.includes("?id=");
            if (id_available == true) {
                if ($('.edtCustomerEmail').val() != "") {
                    let quoteData = templateObject.invoicerecord.get();
                    let lineItems = [];
                    let total = $('#totalBalanceDue').html() || 0;
                    let tax = $('#subtotal_tax').html() || 0;
                    let customer = $('#edtCustomerName').val();
                    let company = Session.get('vs1companyName');
                    let name = $('#firstname').val();
                    let surname = $('#lastname').val();
                    $('#tblInvoiceLine > tbody > tr').each(function () {
                        var lineID = this.id;
                        let tdproduct = $('#' + lineID + " .lineProductName").text();
                        let tddescription = $('#' + lineID + " .lineProductDesc").text();
                        let tdQty = $('#' + lineID + " .lineQty").val();
                        let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                        let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                        let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                        let tdlineamt = $('#' + lineID + " .lineAmt").text();

                        lineItemObj = {
                            description: tddescription || '',
                            quantity: tdQty || 0,
                            unitPrice: tdunitprice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0
                        }

                        lineItems.push(lineItemObj);
                    });
                    var erpGet = erpDb();
                    let vs1User = localStorage.getItem('mySession');
                    let customerEmail = $('#edtCustomerEmail').val();
                    let stringQuery = "?";
                    let dept = $('#sltDept').val();
                    var customerID = $('#edtCustomerEmail').attr('customerid');
                    for (let l = 0; l < lineItems.length; l++) {
                        stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
                    }
                    stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + quoteData.id + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Invoice&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept;
                    window.open("https://www.depot.vs1cloud.com/stripe/" + stringQuery, '_self');
                } else {
                    swal({
                        title: 'Customer Email Required',
                        text: 'Please enter customer email',
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });
                }
            } else {
                let templateObject = Template.instance();
                let lineItems = [];
                let imageData = (localStorage.getItem("Image"));
                let customername = $('#edtCustomerName');
                let name = $('#edtCustomerEmail').attr('customerfirstname');
                let surname = $('#edtCustomerEmail').attr('customerlastname');
                let salesService = new SalesBoardService();
                if (customername.val() === '') {
                    swal('Customer has not been selected!', '', 'warning');
                    e.preventDefault();
                } else {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    var splashLineArray = new Array();
                    let lineItemsForm = [];
                    let lineItems = [];
                    let lineItemObjForm = {};
                    var erpGet = erpDb();
                    var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

                    var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                    let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                    let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();
                    let checkBackOrder = templateObject.includeBOnShippedQty.get();
                    $('#tblInvoiceLine > tbody > tr').each(function () {
                        var lineID = this.id;
                        let tdproduct = $('#' + lineID + " .lineProductName").text();
                        let tddescription = $('#' + lineID + " .lineProductDesc").text();
                        let tdQty = $('#' + lineID + " .lineQty").val();

                        let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                        let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                        let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                        let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                        let tdlineamt = $('#' + lineID + " .lineAmt").text();

                        lineItemObj = {
                            description: tddescription || '',
                            quantity: tdQty || 0,
                            unitPrice: tdunitprice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0
                        }

                        lineItems.push(lineItemObj);

                        if (tdproduct != "") {

                            if (checkBackOrder == true) {
                                lineItemObjForm = {
                                    type: "TInvoiceLine",
                                    fields: {
                                        ProductName: tdproduct || '',
                                        ProductDescription: tddescription || '',
                                        UOMQtySold: parseFloat(tdOrderd) || 0,
                                        UOMQtyShipped: parseFloat(tdQty) || 0,
                                        LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                        Headershipdate: saleDate,
                                        LineTaxCode: tdtaxCode || '',
                                    }
                                };
                            } else {
                                lineItemObjForm = {
                                    type: "TInvoiceLine",
                                    fields: {
                                        ProductName: tdproduct || '',
                                        ProductDescription: tddescription || '',
                                        UOMQtySold: parseFloat(tdQty) || 0,
                                        UOMQtyShipped: parseFloat(tdQty) || 0,
                                        LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                        Headershipdate: saleDate,
                                        LineTaxCode: tdtaxCode || '',
                                    }
                                };
                            }

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

                    let customer = $('#edtCustomerName').val();
                    let customerEmail = $('#edtCustomerEmail').val();
                    let billingAddress = $('#txabillingAddress').val();

                    let poNumber = $('#ponumber').val();
                    let reference = $('#edtRef').val();
                    let termname = $('#sltTerms').val();
                    let departement = $('#sltDept').val();
                    let shippingAddress = $('#txaShipingInfo').val();
                    let comments = $('#txaComment').val();
                    let pickingInfrmation = $('#txapickmemo').val();
                    let total = $('#totalBalanceDue').html() || 0;
                    let tax = $('#subtotal_tax').html() || 0;
                    let saleCustField1 = $('#edtSaleCustField1').val();
                    let saleCustField2 = $('#edtSaleCustField2').val();
                    var url = window.location.href;
                    var getso_id = url.split('?id=');
                    var currentInvoice = getso_id[getso_id.length - 1];
                    let uploadedItems = templateObject.uploadedFiles.get();
                    var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                    var objDetails = '';
                    if (getso_id[1]) {
                        currentInvoice = parseInt(currentInvoice);
                        objDetails = {
                            type: "TInvoiceEx",
                            fields: {
                                ID: currentInvoice,
                                CustomerName: customer,
                                ForeignExchangeCode: currencyCode,
                                Lines: splashLineArray,
                                InvoiceToDesc: billingAddress,
                                SaleDate: saleDate,
                                CustPONumber: poNumber,
                                ReferenceNo: reference,
                                TermsName: termname,
                                SaleClassName: departement,
                                ShipToDesc: shippingAddress,
                                Comments: comments,
                                SaleCustField1: saleCustField1,
                                SaleCustField2: saleCustField2,
                                PickMemo: pickingInfrmation,
                                Attachments: uploadedItems,
                                SalesStatus: $('#sltStatus').val()
                            }
                        };
                    } else {
                        objDetails = {
                            type: "TInvoiceEx",
                            fields: {
                                CustomerName: customer,
                                ForeignExchangeCode: currencyCode,
                                Lines: splashLineArray,
                                InvoiceToDesc: billingAddress,
                                SaleDate: saleDate,
                                CustPONumber: poNumber,
                                ReferenceNo: reference,
                                TermsName: termname,
                                SaleClassName: departement,
                                ShipToDesc: shippingAddress,
                                Comments: comments,
                                SaleCustField1: saleCustField1,
                                SaleCustField2: saleCustField2,
                                PickMemo: pickingInfrmation,
                                Attachments: uploadedItems,
                                SalesStatus: $('#sltStatus').val()
                            }
                        };
                    }
                    salesService.saveInvoiceEx(objDetails).then(function (objDetails) {
                        let company = Session.get('vs1companyName');
                        let vs1User = localStorage.getItem('mySession');
                        let customerEmail = $('#edtCustomerEmail').val() || '';
                        let stringQuery = "?";
                        var customerID = $('#edtCustomerEmail').attr('customerid');
                        for (let l = 0; l < lineItems.length; l++) {
                            stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
                        }
                        stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + objDetails.fields.ID + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Invoice&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + departement;
                        let url = "https://www.depot.vs1cloud.com/stripe/" + stringQuery;
                        $('#html-2-pdfwrapper').css('display', 'block');
                        $('.pdfCustomerName').html($('#edtCustomerName').val());
                        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));

                        function generatePdfForMail(invoiceId) {
                        let file = "Invoice-" + invoiceId + ".pdf"
                        return new Promise((resolve, reject) => {
                        $(".linkText").attr("href", "https://www.depot.vs1cloud.com/stripe/" + stringQuery);
                        let templateObject = Template.instance();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        var source = document.getElementById('html-2-pdfwrapper');
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
                        }
                        resolve(html2pdf().set(opt).from(source).toPdf().output('datauristring'));
                        // doc.addHTML(source, function () {
                        //     doc.setFontSize(10);
                        //     doc.setTextColor(255, 255, 255);
                        //     doc.textWithLink('Pay Now', 482, 113, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });
                        //     resolve(doc.output('blob'));
                        //     $('#html-2-pdfwrapper').css('display', 'none');
                        // });
                    });
                }
                        async function addAttachment() {
                                let attachment = [];
                                let templateObject = Template.instance();

                                let invoiceId = objDetails.fields.ID;
                                let encodedPdf = await generatePdfForMail(invoiceId);
                                let pdfObject = "";
                                let base64data = encodedPdf.split(',')[1];
                                pdfObject = {
                                    filename: 'invoice-' + invoiceId + '.pdf',
                                    content: base64data,
                                    encoding: 'base64'
                                };
                                attachment.push(pdfObject);
                                let erpInvoiceId = objDetails.fields.ID;

                                let mailFromName = Session.get('vs1companyName');
                                let mailFrom = localStorage.getItem('mySession');
                                let customerEmailName = $('#edtCustomerName').val();
                                let checkEmailData = $('#edtCustomerEmail').val();
                                let grandtotal = $('#grandTotal').html();
                                let amountDueEmail = $('#totalBalanceDue').html();
                                let emailDueDate = $("#dtDueDate").val();
                                let mailSubject = 'Invoice ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                                let mailBody = "Hi " + customerEmailName + ",\n\n Here's invoice " + erpInvoiceId + " for  " + grandtotal + "." +
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
                                    '                        Hi <span>' + customerEmailName + '</span>.' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
                                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                                    '                        Please find attached Invoice <span>' + erpInvoiceId + '</span>' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
                                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                                    '                        Simply click on <a style="border: none; color: white; padding: 6px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #5cb85c; border-color: #4cae4c; border-radius: 10px;" href="https://www.depot.vs1cloud.com/stripe/' + stringQuery + '">Make Payment</a> to pay now.' +
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
                                    }, function (error, result) {
                                        if (error && error.error === "error") {
                                            Router.go('/invoicelist?success=true');

                                        } else {}
                                    });

                                    Meteor.call('sendEmail', {
                                        from: "" + mailFromName + " <" + mailFrom + ">",
                                        to: mailFrom,
                                        subject: mailSubject,
                                        text: '',
                                        html: htmlmailBody,
                                        attachments: attachment
                                    }, function (error, result) {
                                        if (error && error.error === "error") {
                                            Router.go('/invoicelist?success=true');
                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    window.open(url, '_self');
                                                } else if (result.dismiss === 'cancel') {}
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
                                    }, function (error, result) {
                                        if (error && error.error === "error") {
                                            Router.go('/invoicelist?success=true');

                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " ",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    window.open(url, '_self');
                                                } else if (result.dismiss === 'cancel') {}
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
                                    }, function (error, result) {
                                        if (error && error.error === "error") {
                                            Router.go('/invoicelist?success=true');
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
                                                    window.open(url, '_self');
                                                } else if (result.dismiss === 'cancel') {}
                                            });

                                            $('.fullScreenSpin').css('display', 'none');
                                        }
                                    });

                                } else {
                                    window.open(url, '_self');
                                };



                        }
                        addAttachment();
                    }).catch(function (err) {
                        $('#html-2-pdfwrapper').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {}
                            else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            }
        } else {
            swal({
                title: 'WARNING',
                text: "Please Set Up Payment Method To Use This Option, Click Ok to be Redirected to Payment Method page.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.value) {
                    window.open('paymentmethodSettings', '_self');
                } else if (result.dismiss === 'cancel') {}
            });
        }
    },
    'blur .lineQty': function (event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let $printrows = $(".invoice_print tbody tr");
        let isBOnShippedQty = templateObject.includeBOnShippedQty.get();
        var targetID = $(event.target).closest('tr').attr('id');
        if (isBOnShippedQty == true) {
            let qtyOrdered = $('#' + targetID + " .lineOrdered").val();
            let qtyBO = $('#' + targetID + " .lineBo").val();
            let qtyShipped = $('#' + targetID + " .lineQty").val();
            let boValue = '';

            if ((qtyOrdered == '') || (isNaN(qtyOrdered))) {
                qtyOrdered = 0;
            }
            if (parseInt(qtyOrdered) < parseInt(qtyShipped)) {
                $('#' + targetID + " .lineQty").val(qtyOrdered);
                $('#' + targetID + " .lineBo").val(0);
            } else if (parseInt(qtyShipped) <= parseInt(qtyOrdered)) {
                boValue = parseInt(qtyOrdered) - parseInt(qtyShipped);
                $('#' + targetID + " .lineBo").val(boValue);
            }
        }
        if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $('#' + targetID + " #lineQty").text($('#' + targetID + " .lineQty").val());
        }

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function (index) {
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

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function (index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

    },
    'blur .lineOrdered': function (event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let isBOnShippedQty = templateObject.includeBOnShippedQty.get();
        var targetID = $(event.target).closest('tr').attr('id');
        if (isBOnShippedQty == true) {
            let qtyOrdered = $('#' + targetID + " .lineOrdered").val();
            let qtyBO = $('#' + targetID + " .lineBo").val();
            let qtyShipped = $('#' + targetID + " .lineQty").val();
            let boValue = '';

            if ((qtyOrdered == '') || (isNaN(qtyOrdered))) {
                qtyOrdered = 0;
            }
            if (parseInt(qtyOrdered) < parseInt(qtyShipped)) {
                $('#' + targetID + " .lineQty").val(qtyOrdered);
                $('#' + targetID + " .lineBo").val(0);
            } else if (parseInt(qtyShipped) <= parseInt(qtyOrdered)) {
                boValue = parseInt(qtyOrdered) - parseInt(qtyShipped);
                $('#' + targetID + " .lineBo").val(boValue);
            }
        }

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;

        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".lineUnitPrice").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
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

    },
    'change .lineUnitPrice': function (event) {

        let utilityService = new UtilityService();
        let inputUnitPrice = 0;
        if (!isNaN($(event.target).val())) {
            inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));

        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let $printrows = $(".invoice_print tbody tr");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $('#' + targetID + " #lineUnitPrice").text($('#' + targetID + " .lineUnitPrice").val());
        }

        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".lineUnitPrice").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
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

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function (index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
    },
    'click #btnCustomFileds': function (event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineProductName': function (event) {
        let customername = $('#edtCustomerName').val();
        if (customername === '') {
            swal('Customer has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            $('#tblInvoiceLine tbody tr .lineProductName').attr("data-toggle", "modal");
            $('#tblInvoiceLine tbody tr .lineProductName').attr("data-target", "#productListModal");
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectLineID').val(targetID);
            setTimeout(function () {
                $('#tblInventory_filter .form-control-sm').focus();
            }, 500);
        }
    },
    'click #productListModal #refreshpagelist': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1SalesProductList', '');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();

    },
    'click .lineTaxRate': function (event) {
        $('#tblInvoiceLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblInvoiceLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function (event) {
        $('#tblInvoiceLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblInvoiceLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#html-2-pdfwrapper').css('display', 'block');
        if ($('.edtCustomerEmail').val() != "") {
            $('.pdfCustomerName').html($('#edtCustomerName').val());
            $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
            $('#printcomment').html($('#txaComment').val().replace(/[\r\n]/g, "<br />"));
            var ponumber = $('#ponumber').val() || '.';
            $('.po').text(ponumber);
            var rowCount = $('.tblInvoiceLine tbody tr').length;
            exportSalesToPdf();
        } else {
            swal({
                title: 'Customer Email Required',
                text: 'Please enter customer email',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.value) {}
                else if (result.dismiss === 'cancel') {}
            });
        }
    },
    'keydown .lineQty, keydown .lineUnitPrice, keydown .lineOrdered': function (event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {}
        else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function (event) {
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
            if ($('#tblInvoiceLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                $(".invoice_print #" + targetID).remove();
                event.preventDefault();
                let $tblrows = $("#tblInvoiceLine tbody tr");
                let $printrows = $(".invoice_print tbody tr");
                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;
                let taxGrandTotalPrint = 0;

                $tblrows.each(function (index) {
                    var $tblrow = $(this);
                    var qty = $tblrow.find(".lineQty").val() || 0;
                    var price = $tblrow.find(".lineUnitPrice").val() || 0;
                    var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                    var taxrateamount = 0;
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxcode) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
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

                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $printrows.each(function (index) {
                        var $printrows = $(this);
                        var qty = $printrows.find("#lineQty").text() || 0;
                        var price = $printrows.find("#lineUnitPrice").text() || "0";
                        var taxrateamount = 0;
                        var taxRate = $printrows.find("#lineTaxCode").text();
                        if (taxcodeList) {
                            for (var i = 0; i < taxcodeList.length; i++) {
                                if (taxcodeList[i].codename == taxRate) {
                                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                                }
                            }
                        }
                        var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                        var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }

        }
    },
    'click .btnDeleteInvoice': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let salesService = new SalesBoardService();
        var url = window.location.href;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TInvoiceEx",
                fields: {
                    ID: currentInvoice,
                    Deleted: true,
                    Lines: null
                }
            };

            salesService.saveInvoiceEx(objDetails).then(function (objDetails) {
                Router.go('/invoicelist?success=true');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            Router.go('/invoicelist?success=true');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function (event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblInvoiceLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();
            let $tblrows = $("#tblInvoiceLine tbody tr");
            let $printrows = $(".invoice_print tbody tr");
            $(".invoice_print #" + selectLineID).remove();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100; ;
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

            $printrows.each(function (index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }
                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
            //return false;
        } else {
            this.click;
            $('#' + selectLineID + " .lineProductName").text('');
            $('#' + selectLineID + " .lineProductDesc").text('');
            $('#' + selectLineID + " .lineOrdered").val('');
            $('#' + selectLineID + " .lineQty").val('');
            $('#' + selectLineID + " .lineBo").val('');
            $('#' + selectLineID + " .lineUnitPrice").val('');
            $('#' + selectLineID + " .lineCostPrice").val('');
            $('#' + selectLineID + " .lineSalesLinesCustField1").text('');
            $('#' + selectLineID + " .lineTaxRate").text('');
            $('#' + selectLineID + " .lineTaxCode").text('');
            $('#' + selectLineID + " .lineAmt").text('');

            document.getElementById("subtotal_tax").innerHTML = Currency + '0.00';
            document.getElementById("subtotal_total").innerHTML = Currency + '0.00';
            document.getElementById("grandTotal").innerHTML = Currency + '0.00';
            document.getElementById("balanceDue").innerHTML = Currency + '0.00';
            document.getElementById("totalBalanceDue").innerHTML = Currency + '0.00';
        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function (event) {

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function (event) {
        let templateObject = Template.instance();
        let stripe_id = templateObject.accountID.get();
        let stripe_fee_method = templateObject.stripe_fee_method.get();
        let lineItems = [];
        let imageData = (localStorage.getItem("Image"));
        let customername = $('#edtCustomerName');
        let name = $('#edtCustomerEmail').attr('customerfirstname');
        let surname = $('#edtCustomerEmail').attr('customerlastname');
        let salesService = new SalesBoardService();
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItems = [];
            let lineItemObjForm = {};
            var erpGet = erpDb();
            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let checkBackOrder = templateObject.includeBOnShippedQty.get();
            $('#tblInvoiceLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();

                let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                lineItemObj = {
                    description: tddescription || '',
                    quantity: tdQty || 0,
                    unitPrice: tdunitprice.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0
                }

                lineItems.push(lineItemObj);

                if (tdproduct != "") {

                    if (checkBackOrder == true) {
                        lineItemObjForm = {
                            type: "TInvoiceLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdOrderd) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                Headershipdate: saleDate,
                                LineTaxCode: tdtaxCode || '',
                            }
                        };
                    } else {
                        lineItemObjForm = {
                            type: "TInvoiceLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdQty) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                Headershipdate: saleDate,
                                LineTaxCode: tdtaxCode || '',
                            }
                        };
                    }

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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#sltDept').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();
            let total = $('#totalBalanceDue').html() || 0;
            let tax = $('#subtotal_tax').html() || 0;
            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = window.location.href;
            var getso_id = url.split('?id=');
            var currentInvoice = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentInvoice = parseInt(currentInvoice);
                objDetails = {
                    type: "TInvoiceEx",
                    fields: {
                        ID: currentInvoice,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        CustPONumber: poNumber,
                        ReferenceNo: reference,
                        TermsName: termname,
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TInvoiceEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        CustPONumber: poNumber,
                        ReferenceNo: reference,
                        TermsName: termname,
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            }

            salesService.saveInvoiceEx(objDetails).then(function (objDetails) {
                let company = Session.get('vs1companyName');
                let vs1User = localStorage.getItem('mySession');
                let customerEmail = $('#edtCustomerEmail').val() || '';
                let stringQuery = "?";
                var customerID = $('#edtCustomerEmail').attr('customerid');
                for (let l = 0; l < lineItems.length; l++) {
                    stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
                }
                stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + objDetails.fields.ID + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Invoice&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + departement;
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtCustomerName').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                var ponumber = $('#ponumber').val() || '.';
                $('.po').text(ponumber);
                function generatePdfForMail(invoiceId) {
                    let file = "Invoice-" + invoiceId + ".pdf"
                        return new Promise((resolve, reject) => {
                        $(".linkText").attr("href", "https://www.depot.vs1cloud.com/stripe/" + stringQuery);
                        let templateObject = Template.instance();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        var source = document.getElementById('html-2-pdfwrapper');
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
                        }
                        resolve(html2pdf().set(opt).from(source).toPdf().output('datauristring'));
                        // doc.addHTML(source, function () {
                        //     doc.setFontSize(10);
                        //     doc.setTextColor(255, 255, 255);
                        //     doc.textWithLink('Pay Now', 482, 113, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });
                        //     resolve(doc.output('blob'));
                        //     $('#html-2-pdfwrapper').css('display', 'none');
                        // });
                    });
                }
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);

                    // var base64data = reader.result;
                    let base64data = encodedPdf.split(',')[1];
                    pdfObject = {
                        filename: 'invoice-' + invoiceId + '.pdf',
                        content: base64data,
                        encoding: 'base64'
                    };
                    attachment.push(pdfObject);
                    let erpInvoiceId = objDetails.fields.ID;

                    let mailFromName = Session.get('vs1companyName');
                    let mailFrom = localStorage.getItem('mySession');
                    let customerEmailName = $('#edtCustomerName').val();
                    let checkEmailData = $('#edtCustomerEmail').val();
                    let grandtotal = $('#grandTotal').html();
                    let amountDueEmail = $('#totalBalanceDue').html();
                    let emailDueDate = $("#dtDueDate").val();
                    let mailSubject = 'Invoice ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                    let mailBody = "Hi " + customerEmailName + ",\n\n Here's invoice " + erpInvoiceId + " for  " + grandtotal + "." +
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
                        '                        Hi <span>' + customerEmailName + '</span>.' +
                        '                    </td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                        '                        Please find attached Invoice <span>' + erpInvoiceId + '</span>' +
                        '                    </td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                        '                        Simply click on <a style="border: none; color: white; padding: 6px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #5cb85c; border-color: #4cae4c; border-radius: 10px;" href="https://www.depot.vs1cloud.com/stripe/' + stringQuery + '">Make Payment</a> to pay now.' +
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
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                Router.go('/invoicelist?success=true');

                            } else {}
                        });

                        Meteor.call('sendEmail', {
                            from: "" + mailFromName + " <" + mailFrom + ">",
                            to: mailFrom,
                            subject: mailSubject,
                            text: '',
                            html: htmlmailBody,
                            attachments: attachment
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                Router.go('/invoicelist?success=true');
                            } else {
                                $('#html-2-pdfwrapper').css('display', 'none');
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {}
                                    else if (result.dismiss === 'cancel') {}
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
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                Router.go('/invoicelist?success=true');

                            } else {
                                $('#html-2-pdfwrapper').css('display', 'none');
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Customer: " + checkEmailData + " ",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        Router.go('/invoicelist?success=true');
                                    } else if (result.dismiss === 'cancel') {}
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
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                Router.go('/invoicelist?success=true');
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
                                        Router.go('/invoicelist?success=true');
                                    } else if (result.dismiss === 'cancel') {}
                                });

                                $('.fullScreenSpin').css('display', 'none');
                            }
                        });

                    } else {
                        Router.go('/invoicelist?success=true');
                    };

                }
                addAttachment();
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }

                };
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
                            PrefName: 'new_invoice'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_invoice',
                                    published: true,
                                    customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }
                                    ],
                                    updatedAt: new Date()
                                }
                            }, function (err, idTag) {
                                if (err) {}
                                else {}
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_invoice',
                                published: true,
                                customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }
                                ],
                                createdAt: new Date()
                            }, function (err, idTag) {
                                if (err) {}
                                else {}
                            });
                        }
                    }
                } else {};

            }).catch(function (err) {
                $('#html-2-pdfwrapper').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });

        }

    },
    'click .chkProductName': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colProductName').css('display', 'table-cell');
            $('.colProductName').css('padding', '.75rem');
            $('.colProductName').css('vertical-align', 'top');
        } else {
            $('.colProductName').css('display', 'none');
        }
    },
    'click .chkDescription': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colDescription').css('display', 'table-cell');
            $('.colDescription').css('padding', '.75rem');
            $('.colDescription').css('vertical-align', 'top');
        } else {
            $('.colDescription').css('display', 'none');
        }
    },
    'click .chkQty': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colQty').css('display', 'table-cell');
            $('.colQty').css('padding', '.75rem');
            $('.colQty').css('vertical-align', 'top');
        } else {
            $('.colQty').css('display', 'none');
        }
    },
    'click .chkUnitPrice': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colUnitPrice').css('display', 'table-cell');
            $('.colUnitPrice').css('padding', '.75rem');
            $('.colUnitPrice').css('vertical-align', 'top');
        } else {
            $('.colUnitPrice').css('display', 'none');
        }
    },
    'click .chkCostPrice': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colCostPrice').css('display', 'table-cell');
            $('.colCostPrice').css('padding', '.75rem');
            $('.colCostPrice').css('vertical-align', 'top');
        } else {
            $('.colCostPrice').css('display', 'none');
        }
    },
    'click .chkSalesLinesCustField1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colSalesLinesCustField1').css('display', 'table-cell');
            $('.colSalesLinesCustField1').css('padding', '.75rem');
            $('.colSalesLinesCustField1').css('vertical-align', 'top');
        } else {
            $('.colSalesLinesCustField1').css('display', 'none');
        }
    },
    'click .chkTaxRate': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkAmount': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'change .rngRangeProductName': function (event) {

        let range = $(event.target).val();
        $(".spWidthProductName").html(range + '%');
        $('.colProductName').css('width', range + '%');

    },
    'change .rngRangeDescription': function (event) {

        let range = $(event.target).val();
        $(".spWidthDescription").html(range + '%');
        $('.colDescription').css('width', range + '%');

    },
    'change .rngRangeQty': function (event) {

        let range = $(event.target).val();
        $(".spWidthQty").html(range + '%');
        $('.colQty').css('width', range + '%');

    },
    'change .rngRangeUnitPrice': function (event) {

        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + '%');
        $('.colUnitPrice').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function (event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeAmount': function (event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeCostPrice': function (event) {

        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + '%');
        $('.colCostPrice').css('width', range + '%');

    },
    'change .rngRangeSalesLinesCustField1': function (event) {

        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + '%');
        $('.colSalesLinesCustField1').css('width', range + '%');

    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
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
                    PrefName: 'tblInvoiceLine'
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
                            PrefName: 'tblInvoiceLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
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
                        PrefGroup: 'salesform',
                        PrefName: 'tblInvoiceLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
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
    'click .btnResetGridSettings': function (event) {
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
                    PrefName: 'tblInvoiceLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {}
                        else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function (event) {
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
                    PrefName: 'new_invoice'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {}
                        else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function (event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event, ui) {
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
    'click .file-name': function (event) {
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
    'click .confirm-delete-attachment': function (event, ui) {
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
    'click #btn_Attachment': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click #btnPayment': function () {

        var currenturl = window.location.href;
        var getcurrent_id = currenturl.split('?id=');
        var currentId = getcurrent_id[getcurrent_id.length - 1];
        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let salesService = new SalesBoardService();
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItems = [];
            let lineItemObjForm = {};
            var erpGet = erpDb();
            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let checkBackOrder = templateObject.includeBOnShippedQty.get();
            $('#tblInvoiceLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();

                let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                lineItemObj = {
                    description: tddescription || '',
                    quantity: tdQty || 0,
                    unitPrice: tdunitprice.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0
                }

                lineItems.push(lineItemObj);

                if (tdproduct != "") {

                    if (checkBackOrder == true) {
                        lineItemObjForm = {
                            type: "TInvoiceLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdOrderd) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                Headershipdate: saleDate,
                                LineTaxCode: tdtaxCode || '',
                            }
                        };
                    } else {
                        lineItemObjForm = {
                            type: "TInvoiceLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdQty) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                Headershipdate: saleDate,
                                LineTaxCode: tdtaxCode || '',
                            }
                        };
                    }

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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();
            let termname = $('#sltTerms').val();
            let departement = $('#sltDept').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = window.location.href;
            var getso_id = url.split('?id=');
            var currentInvoice = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentInvoice = parseInt(currentInvoice);
                objDetails = {
                    type: "TInvoiceEx",
                    fields: {
                        ID: currentInvoice,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        CustPONumber: poNumber,
                        ReferenceNo: reference,
                        TermsName: termname,
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TInvoiceEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        CustPONumber: poNumber,
                        ReferenceNo: reference,
                        TermsName: termname,
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            }
            salesService.saveInvoiceEx(objDetails).then(function (objDetails) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtCustomerName').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];
                        pdfObject = {
                            filename: 'invoice-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);
                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('mySession');
                        let customerEmailName = $('#edtCustomerName').val();
                        let checkEmailData = $('#edtCustomerEmail').val();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Invoice ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's invoice " + erpInvoiceId + " for  " + grandtotal + "." +
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
                            '                        Please find invoice <span>' + erpInvoiceId + '</span> attached below.' +
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
                            }, function (error, result) {
                                if (error && error.error === "error") {}
                                else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function (error, result) {
                                if (error && error.error === "error") {}
                                else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {}
                                        else if (result.dismiss === 'cancel') {}
                                    });

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
                            }, function (error, result) {
                                if (error && error.error === "error") {}
                                else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {}
                                        else if (result.dismiss === 'cancel') {}
                                    });

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
                            }, function (error, result) {
                                if (error && error.error === "error") {}
                                else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {}
                                        else if (result.dismiss === 'cancel') {}
                                    });

                                }
                            });

                        } else {};
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
                        doc.addHTML(source, function () {
                            resolve(doc.output('blob'));
                            $('#html-2-pdfwrapper').css('display', 'none');
                        });
                    });
                }
                if (customerID !== " ") {};
                let linesave = objDetails.fields.ID;
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
                            PrefName: 'new_invoice'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_invoice',
                                    published: true,
                                    customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }
                                    ],
                                    updatedAt: new Date()
                                }
                            }, function (err, idTag) {
                                if (err) {}
                                else {}
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_invoice',
                                published: true,
                                customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }
                                ],
                                createdAt: new Date()
                            }, function (err, idTag) {
                                if (err) {}
                                else {}
                            });
                        }
                    }
                } else {}

                sideBarService.getAllInvoiceList().then(function (data) {
                    addVS1Data('TInvoiceEx', JSON.stringify(data)).then(function (datareturn) {
                        window.open('/paymentcard?invid=' + linesave, '_self');
                    }).catch(function (err) {
                        window.open('/paymentcard?invid=' + linesave, '_self');
                    });
                }).catch(function (err) {
                    window.open('/paymentcard?invid=' + linesave, '_self');
                });

            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click #btnViewPayment': function () {
        var url = window.location.href;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];

        let customer = $('#edtCustomerName').val();
        window.open('/paymentcard?custname=' + customer + '&from=' + currentInvoice, '_self');
    },
    'click .btnBack': function (event) {

        event.preventDefault();
        history.back(1);
    },
    'click #btnCopyInvoice': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        var url = window.location.href;
        if ((url.indexOf('?id=') > 0) || (url.indexOf('?copyquid=') > 0) || (url.indexOf('?copyinvid='))) {
            let templateObject = Template.instance();
            let customername = $('#edtCustomerName');
            let salesService = new SalesBoardService();
            if (customername.val() === '') {
                swal('Customer has not been selected!', '', 'warning');
                e.preventDefault();
            } else {
                $('.fullScreenSpin').css('display', 'inline-block');
                var splashLineArray = new Array();
                let lineItemsForm = [];
                let lineItems = [];
                let lineItemObjForm = {};
                var erpGet = erpDb();
                var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                let checkBackOrder = templateObject.includeBOnShippedQty.get();
                $('#tblInvoiceLine > tbody > tr').each(function () {
                    var lineID = this.id;
                    let tdproduct = $('#' + lineID + " .lineProductName").text();
                    let tddescription = $('#' + lineID + " .lineProductDesc").text();
                    let tdQty = $('#' + lineID + " .lineQty").val();

                    let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                    let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                    let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                    let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                    let tdlineamt = $('#' + lineID + " .lineAmt").text();

                    lineItemObj = {
                        description: tddescription || '',
                        quantity: tdQty || 0,
                        unitPrice: tdunitprice.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        }) || 0
                    }

                    lineItems.push(lineItemObj);

                    if (tdproduct != "") {

                        if (checkBackOrder == true) {
                            lineItemObjForm = {
                                type: "TInvoiceLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdOrderd) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    Headershipdate: saleDate,
                                    LineTaxCode: tdtaxCode || '',
                                }
                            };
                        } else {
                            lineItemObjForm = {
                                type: "TInvoiceLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdQty) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    Headershipdate: saleDate,
                                    LineTaxCode: tdtaxCode || '',
                                }
                            };
                        }

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

                let customer = $('#edtCustomerName').val();
                let customerEmail = $('#edtCustomerEmail').val();
                let billingAddress = $('#txabillingAddress').val();

                let poNumber = $('#ponumber').val();
                let reference = $('#edtRef').val();
                let termname = $('#sltTerms').val();
                let departement = $('#sltDept').val();
                let shippingAddress = $('#txaShipingInfo').val();
                let comments = $('#txaComment').val();
                let pickingInfrmation = $('#txapickmemo').val();

                let saleCustField1 = $('#edtSaleCustField1').val();
                let saleCustField2 = $('#edtSaleCustField2').val();
                var url = window.location.href;
                var getso_id = url.split('?id=');
                var currentInvoice = getso_id[getso_id.length - 1];
                let uploadedItems = templateObject.uploadedFiles.get();
                var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                var objDetails = '';
                if (getso_id[1]) {
                    currentInvoice = parseInt(currentInvoice);
                    objDetails = {
                        type: "TInvoiceEx",
                        fields: {
                            ID: currentInvoice,
                            CustomerName: customer,
                            ForeignExchangeCode: currencyCode,
                            Lines: splashLineArray,
                            InvoiceToDesc: billingAddress,
                            SaleDate: saleDate,
                            CustPONumber: poNumber,
                            ReferenceNo: reference,
                            TermsName: termname,
                            SaleClassName: departement,
                            ShipToDesc: shippingAddress,
                            Comments: comments,
                            SaleCustField1: saleCustField1,
                            SaleCustField2: saleCustField2,
                            PickMemo: pickingInfrmation,
                            Attachments: uploadedItems,
                            SalesStatus: $('#sltStatus').val()
                        }
                    };
                } else {
                    objDetails = {
                        type: "TInvoiceEx",
                        fields: {
                            CustomerName: customer,
                            ForeignExchangeCode: currencyCode,
                            Lines: splashLineArray,
                            InvoiceToDesc: billingAddress,
                            SaleDate: saleDate,
                            CustPONumber: poNumber,
                            ReferenceNo: reference,
                            TermsName: termname,
                            SaleClassName: departement,
                            ShipToDesc: shippingAddress,
                            Comments: comments,
                            SaleCustField1: saleCustField1,
                            SaleCustField2: saleCustField2,
                            PickMemo: pickingInfrmation,
                            Attachments: uploadedItems
                        }
                    };
                }

                salesService.saveInvoiceEx(objDetails).then(function (objDetails) {
                    var customerID = $('#edtCustomerEmail').attr('customerid');
                    if (customerID !== " ") {
                        let customerEmailData = {
                            type: "TCustomer",
                            fields: {
                                ID: customerID,
                                Email: customerEmail
                            }
                        }
                        salesService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {});
                    };
                    let linesave = objDetails.fields.ID;
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
                                PrefName: 'new_invoice'
                            });
                            if (checkPrefDetails) {
                                CloudPreference.update({
                                    _id: checkPrefDetails._id
                                }, {
                                    $set: {
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'salesform',
                                        PrefName: 'new_invoice',
                                        published: true,
                                        customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }
                                        ],
                                        updatedAt: new Date()
                                    }
                                }, function (err, idTag) {
                                    if (err) {
                                        window.open('/invoicecard?copyinvid=' + linesave, '_self');
                                    } else {
                                        window.open('/invoicecard?copyinvid=' + linesave, '_self');

                                    }
                                });
                            } else {
                                CloudPreference.insert({
                                    userid: clientID,
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_invoice',
                                    published: true,
                                    customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }
                                    ],
                                    createdAt: new Date()
                                }, function (err, idTag) {
                                    if (err) {
                                        window.open('/invoicecard?copyinvid=' + linesave, '_self');
                                    } else {
                                        window.open('/invoicecard?copyinvid=' + linesave, '_self');

                                    }
                                });
                            }
                        }
                    } else {
                        window.open('/invoicecard?copyinvid=' + linesave, '_self');
                    }

                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {}
                        else if (result.dismiss === 'cancel') {}
                    });

                    $('.fullScreenSpin').css('display', 'none');
                });

            }
        } else {

            window.open('/invoicecard', '_self');
        }
    },
    'click .chkEmailCopy': function (event) {
        $('#edtCustomerEmail').val($('#edtCustomerEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtCustomerEmail').val();

            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Customer Email cannot be blank!', '', 'warning');
                event.preventDefault();
            } else {

                function isEmailValid(mailTo) {
                    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                };
                if (!isEmailValid(checkEmailData)) {
                    swal('The email field must be a valid email address !', '', 'warning');

                    event.preventDefault();
                    return false;
                } else {}
            }
        } else {}
    }
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
