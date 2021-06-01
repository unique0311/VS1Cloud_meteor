import { SalesBoardService } from './sales-service';
import {  ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
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
Template.new_salesorder.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.SalesOrderNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.salesorderrecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.SalesOrderId = new ReactiveVar();
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
    templateObject.record = new ReactiveVar({});
});
Template.new_salesorder.onRendered(() => {
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
    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];
    const termrecords = [];
    const statusList = [];

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
        getVS1Data('TCustomerVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function(data) {
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
                            taxCode: data.tcustomervs1[i].TaxCodeName || ''
                        };
                        clientList.push(customerrecordObj);

                    }
                    templateObject.clientrecords.set(clientList.sort(function(a, b) {
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
                        taxCode: useData[i].fields.TaxCodeName || ''
                    };
                    clientList.push(customerrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
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
            }
        }).catch(function(err) {
            clientsService.getClientVS1().then(function(data) {
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
                        taxCode: data.tcustomervs1[i].TaxCodeName || ''
                    };
                    clientList.push(customerrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
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
            setTimeout(function() {
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
    var url = window.location.href;
    if (url.includes("id") && url.includes("total")) {
        url = new URL(url);
        let dateStart = new Date();
        let transDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
        var getso_id = url.searchParams.get("id");
        var paidAmount = url.searchParams.get("total");
        var currency_symbol = url.searchParams.get("currency");
        if (getso_id != "") {
            salesOrderID = parseInt(getso_id);
            $('.printID').attr("id", salesOrderID);
            templateObject.getSalesOrderData = function() {
                getVS1Data('TSalesOrderEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneSalesOrderdataEx(salesOrderID).then(function(data) {
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
                                let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                                    taxRate: data.fields.Lines.fields.LineTaxRate || 0,
                                    taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }

                            let salesorderrecord = {
                                id: data.fields.ID,
                                lid: 'Edit Sales Order' + ' ' + data.fields.ID,
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
                                totalPaid: totalPaidAmount
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

                            setTimeout(function() {
                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].customername == data.fields.CustomerName) {
                                            salesorderrecord.firstname = clientList[i].firstname || '';
                                            salesorderrecord.lastname = clientList[i].lastname || '';
                                            templateObject.salesorderrecord.set(salesorderrecord);
                                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);

                                            $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                            $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                        }
                                    }
                                };
                            }, 100);

                            templateObject.salesorderrecord.set(salesorderrecord);
                            templateObject.lineitems.set(lineItems);

                            templateObject.selectedCurrency.set(salesorderrecord.currency);
                            templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                            if (templateObject.salesorderrecord.get()) {



                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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
                            setTimeout(function() {
                                let getTotal = $('#totalBalanceDue').text();
                                $('.pdfCustomerAddress').html($('#txabillingAddress').val());
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
                                    invoiceid: salesOrderID || '',
                                    transid: salesOrderID || '',
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
                                    applied: paidAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    })

                                };
                                templateObject.record.set(record);

                            }, 1500)
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

                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tsalesorderex;
                        var added = false;
                        let company_name = "";
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === salesOrderID) {
                                company_name = useData[d].fields.CustomerName;
                                added = true;
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
                                let totalBalance = currencySymbol + '' + useData[d].fields.TotalBalance.toLocaleString(undefined, {
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
                                            unitPrice: currencySymbol + '' + useData[d].fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: currencySymbol + '' + useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
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

                                let salesorderrecord = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit Sales Order' + ' ' + useData[d].fields.ID,
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
                                    totalPaid: totalPaidAmount
                                };

                                $('#edtCustomerName').val(useData[d].fields.CustomerName);
                                templateObject.CleintName.set(useData[d].fields.CustomerName);
                                $('#sltCurrency').val(useData[d].fields.ForeignExchangeCode);

                                templateObject.attachmentCount.set(0);
                                if (useData[d].fields.Attachments) {
                                    if (useData[d].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[d].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[d].fields.Attachments);
                                    }
                                }

                                setTimeout(function() {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == useData[d].fields.CustomerName) {
                                                salesorderrecord.firstname = clientList[i].firstname || '';
                                                salesorderrecord.lastname = clientList[i].lastname || '';
                                                templateObject.salesorderrecord.set(salesorderrecord);
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                                $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                            $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                            }
                                        }
                                    };
                                }, 100);
                                templateObject.salesorderrecord.set(salesorderrecord);

                                templateObject.selectedCurrency.set(salesorderrecord.currency);
                                templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                                if (templateObject.salesorderrecord.get()) {



                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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
                            try {
                                accountService.getOneQuotedataEx(salesOrderID).then(function(data) {
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
                                        let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                                            taxRate: data.fields.Lines.fields.LineTaxRate || 0,
                                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                            TotalAmt: AmountGbp || 0,
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0
                                        };
                                        lineItems.push(lineItemObj);
                                    }

                                    let salesorderrecord = {
                                        id: data.fields.ID,
                                        lid: 'Edit Sales Order' + ' ' + data.fields.ID,
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
                                        totalPaid: totalPaidAmount
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

                                    setTimeout(function() {
                                        if (clientList) {
                                            for (var i = 0; i < clientList.length; i++) {
                                                if (clientList[i].customername == data.fields.CustomerName) {
                                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                                    $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                            $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                                }
                                            }
                                        }
                                    }, 100);

                                    templateObject.salesorderrecord.set(salesorderrecord);

                                    templateObject.selectedCurrency.set(salesorderrecord.currency);
                                    templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                                    if (templateObject.salesorderrecord.get()) {



                                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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

                                });
                            } catch (err) {

                            }
                        }
                        setTimeout(function() {
                            let getTotal = $('#totalBalanceDue').text();
                            $('.pdfCustomerAddress').html($('#txabillingAddress').val());
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
                                    applied: paidAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    })

                                };
                                templateObject.record.set(record);
                        }, 1500);

                    }
                }).catch(function(err) {

                    accountService.getOneSalesOrderdataEx(currentQuote).then(function(data) {
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
                            let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                                taxRate: data.fields.Lines.fields.LineTaxRate || 0,
                                taxCode: data.fields.Lines.fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0
                            };
                            lineItems.push(lineItemObj);
                        }

                        let salesorderrecord = {
                            id: data.fields.ID,
                            lid: 'Edit Quote' + ' ' + data.fields.ID,
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
                            totalPaid: totalPaidAmount
                        };

                        templateObject.querystring.set(stringQuery);
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

                        setTimeout(function() {
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.CustomerName) {
                                        salesorderrecord.firstname = clientList[i].firstname || '';
                                        salesorderrecord.lastname = clientList[i].lastname || '';
                                        templateObject.salesorderrecord.set(salesorderrecord);
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                        $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                    }
                                }
                            }
                        }, 100);

                        templateObject.salesorderrecord.set(salesorderrecord);

                        templateObject.selectedCurrency.set(salesorderrecord.currency);
                        templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                        if (templateObject.salesorderrecord.get()) {



                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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

                    });
                });
            };
            templateObject.getSalesOrderData();
            $('#html-2-pdfwrapper1').css('display', 'block');

            async function addAttachment() {
                let attachment = [];
                let templateObject = Template.instance();
                let invoiceId = getso_id;
                let encodedPdf = await generatePdfForMail(invoiceId);
                let pdfObject = "";
                var reader = new FileReader();
                reader.readAsDataURL(encodedPdf);
                reader.onloadend = function() {
                    var base64data = reader.result;
                    base64data = base64data.split(',')[1];

                    pdfObject = {
                        filename: 'Customer Payment-' + invoiceId + '.pdf',
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
                    let mailSubject = 'Payment for Sales Order ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
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
                        '                        Please find payment for Sales Order <span> ' + erpInvoiceId + '</span> attached below.' +
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
                            swal({
                                title: 'Something went wrong',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            });
                        } else {
                            $('#html-2-pdfwrapper').css('display', 'none');
                            swal({
                                title: 'SUCCESS',
                                text: "Email Sent To Customer: " + checkEmailData,
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    Router.go('/salesorderslist?success=true');
                                } else if (result.dismiss === 'cancel') {
                                    Router.go('/salesorderslist?success=true');
                                } else {
                                    Router.go('/salesorderslist?success=true');
                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        }
                    });

                }

            }

            setTimeout(function() {
                addAttachment();
            }, 2500);


            function generatePdfForMail(invoiceId) {
                return new Promise((resolve, reject) => {
                    let templateObject = Template.instance();

                    let completeTabRecord;
                    let doc = new jsPDF('p', 'pt', 'a4');
                    doc.setFontSize(18);
                    var source = document.getElementById('html-2-pdfwrapper1');
                    doc.addHTML(source, function() {
                        resolve(doc.output('blob'));
                        //$('#html-2-pdfwrapper1').css('display', 'none');
                    });
                });
            }

        }
    } else if (url.indexOf('?copyquid=') > 0) {
        var getso_id = url.split('?copyquid=');
        var currentSalesOrder = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            $('.printID').attr("id", currentSalesOrder);
            currentSalesOrder = parseInt(currentSalesOrder);
            templateObject.getSalesOrderData = function() {
                accountService.getOneQuotedataEx(currentSalesOrder).then(function(data) {
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
                        let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                            taxRate: data.fields.Lines.fields.LineTaxRate || 0,
                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                            TotalAmt: AmountGbp || 0,
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0
                        };
                        lineItems.push(lineItemObj);
                    }

                    let salesorderrecord = {
                        id: data.fields.ID,
                        lid: 'New Sales Order',
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
                        totalPaid: totalPaidAmount
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
                    /* END  attachment */
                    setTimeout(function() {
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    salesorderrecord.firstname = clientList[i].firstname || '';
                                    salesorderrecord.lastname = clientList[i].lastname || '';
                                    templateObject.salesorderrecord.set(salesorderrecord);
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                }
                            }
                        }
                    }, 100);

                    templateObject.salesorderrecord.set(salesorderrecord);
                    templateObject.selectedCurrency.set(salesorderrecord.currency);
                    templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                    if (templateObject.salesorderrecord.get()) {



                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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

                });
            };

            templateObject.getSalesOrderData();
        }
    } else if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentSalesOrder = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentSalesOrder = parseInt(currentSalesOrder);
            $('.printID').attr("id", currentSalesOrder);
            templateObject.getSalesOrderData = function() {
                getVS1Data('TSalesOrderEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneSalesOrderdataEx(currentSalesOrder).then(function(data) {
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
                                let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    TotalAmt: AmountGbp || 0,
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }

                            let salesorderrecord = {
                                id: data.fields.ID,
                                lid: 'Edit Sales Order' + ' ' + data.fields.ID,
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
                                totalPaid: totalPaidAmount
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
                            setTimeout(function() {
                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].customername == data.fields.CustomerName) {
                                            salesorderrecord.firstname = clientList[i].firstname || '';
                                            salesorderrecord.lastname = clientList[i].lastname || '';
                                            templateObject.salesorderrecord.set(salesorderrecord);
                                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        }
                                    }
                                }
                            }, 100);

                            templateObject.salesorderrecord.set(salesorderrecord);
                            templateObject.selectedCurrency.set(salesorderrecord.currency);
                            templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                            if (templateObject.salesorderrecord.get()) {

                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tsalesorderex;
                        var added = false;
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentSalesOrder) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
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
                                let totalBalance = currencySymbol + '' + useData[d].fields.TotalBalance.toLocaleString(undefined, {
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
                                            unitPrice: currencySymbol + '' + useData[d].fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            lineCost: currencySymbol + '' + useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
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
                                        unitPrice: useData[d].fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        lineCost: useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                        TotalAmt: AmountGbp || 0,
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let salesorderrecord = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit Sales Order' + ' ' + useData[d].fields.ID,
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
                                    totalPaid: totalPaidAmount
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
                                setTimeout(function() {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].customername == useData[d].fields.CustomerName) {
                                                salesorderrecord.firstname = clientList[i].firstname || '';
                                                salesorderrecord.lastname = clientList[i].lastname || '';
                                                templateObject.salesorderrecord.set(salesorderrecord);
                                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                            }
                                        }
                                    }
                                }, 100);

                                templateObject.salesorderrecord.set(salesorderrecord);
                                templateObject.selectedCurrency.set(salesorderrecord.currency);
                                templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                                if (templateObject.salesorderrecord.get()) {

                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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
                        if (!added) {}
                    }
                }).catch(function(err) {

                    accountService.getOneSalesOrderdataEx(currentSalesOrder).then(function(data) {
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
                            let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
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
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0
                            };
                            lineItems.push(lineItemObj);
                        }

                        let salesorderrecord = {
                            id: data.fields.ID,
                            lid: 'Edit Sales Order' + ' ' + data.fields.ID,
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
                            totalPaid: totalPaidAmount
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
                        setTimeout(function() {
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.CustomerName) {
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                    }
                                }
                            }
                        }, 100);

                        templateObject.salesorderrecord.set(salesorderrecord);
                        templateObject.selectedCurrency.set(salesorderrecord.currency);
                        templateObject.inputSelectedCurrency.set(salesorderrecord.currency);
                        if (templateObject.salesorderrecord.get()) {



                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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

                    });
                });

            };

            templateObject.getSalesOrderData();
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
        let salesorderrecord = {
            id: '',
            lid: 'New Sales Order',
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
            totalPaid: Currency + '' + 0.00
        };

        $('#edtCustomerName').val('');
        templateObject.salesorderrecord.set(salesorderrecord);
        if (templateObject.salesorderrecord.get()) {
            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSalesOrderLine', function(error, result) {
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

    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getDepartment().then(function(data) {
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
        }).catch(function(err) {
            salesService.getDepartment().then(function(data) {
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

    templateObject.getTerms = function() {
        getVS1Data('TTermsVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getTermVS1().then(function(data) {
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
        }).catch(function(err) {
            salesService.getTermVS1().then(function(data) {
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
    $(document).ready(function() {
        $('#edtCustomerName').editableSelect();
        $('#addRow').on('click', function() {
            var rowData = $('#tblSalesOrderLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).text("");
            $(".lineProductDesc", rowData).text("");
            $(".lineQty", rowData).val("");
            $(".lineUnitPrice", rowData).val("");
            $(".lineTaxRate", rowData).text("");
            $(".lineTaxCode", rowData).text("");
            $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblSalesOrderLine tbody").append(rowData);

            if ($('#printID').val() != "") {
                var rowData1 = $('.sales_print tbody>tr:last').clone(true);
                $("#lineProductName", rowData1).text("");
                $("#lineProductDesc", rowData1).text("");
                $("#lineQty", rowData1).text("");
                $("#lineOrdered", rowData1).text("");
                $("#lineUnitPrice", rowData1).text("");
                // $(".lineTaxRate", rowData).text("");
                $("#lineTaxAmount", rowData1).text("");
                $("#lineAmt", rowData1).text("");
                rowData1.attr('id', tokenid);
                $(".sales_print tbody").append(rowData1);
            }

        });



    });

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventory tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        let customers = templateObject.clientrecords.get();



        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblSalesOrderLine tbody tr");
        var $printrows = $(".sales_print tbody tr");
        let taxcode1 = "";
        let selectedCust = $('#edtCustomerName').val();
        let getCustDetails = "";
        let lineTaxRate = "";
        let taxRate = ""
        if (selectedCust != "") {
            getCustDetails = customers.filter(customer => {
                return customer.customername == selectedCust
            });

            taxRate = taxcodeList.filter(taxrate => {
                return taxrate.codename == getCustDetails[0].taxCode
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

            taxcode1 = getCustDetails[0].taxCode
        } else {
            lineTaxRate = table.find(".taxrate").text();
        }

        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();


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

            if ($('.printID').val() == "") {
                $('#' + selectLineID + " #lineProductName").text(lineProductName);
                $('#' + selectLineID + " #lineProductDesc").text(lineProductDesc);
                $('#' + selectLineID + " #lineOrdered").text(1);
                $('#' + selectLineID + " #lineQty").text(1);
                $('#' + selectLineID + " #lineUnitPrice").text(lineUnitPrice);
            }

            if (lineTaxRate == "NT") {
                lineTaxRate = "E";
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').val() == "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }
            } else {
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').val() == "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }
            }

            lineAmount = 1 * Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
            $('#' + selectLineID + " .lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));

            if ($('.printID').val() == "") {
                $('#' + selectLineID + " #lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            }

            $('#productListModal').modal('toggle');
            $tblrows.each(function(index) {
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


                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

                    var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

    $(document).on("click", "#tblTaxRate tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblSalesOrderLine tbody tr");
        var $printrows = $(".sales_print tbody tr");
        if (selectLineID) {
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $('#' + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
            $('#' + selectLineID + " .lineTaxCode").text(lineTaxCode);

             if($(".printID").val() == "") {
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxCode);
            }

            $('#taxRateListModal').modal('toggle');
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").text() || '';

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                if ((taxrateamount == '') || (taxrateamount == ' ')) {
                    var taxTotal = 0;
                } else {
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

             if ($(".printID").val() == "") {
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
                    var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
        .on('select.editable-select', function(e, li) {
            let taxcodeList = templateObject.taxraterecords.get();
            let customers = templateObject.clientrecords.get();
            let selectedCustomer = li.text();
            if (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    if (clientList[i].customername == selectedCustomer) {
                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                        $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                        $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                        $('#txabillingAddress').val(postalAddress);
                         $('.pdfCustomerAddress').text(postalAddress);
                        $('#txaShipingInfo').val(postalAddress);
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
                        let $tblrows = $("#tblSalesOrderLine tbody tr");
                        let $printrows = $(".sales_print tbody tr");
                        let lineAmount = 0;
                        let subGrandTotal = 0;
                        let taxGrandTotal = 0;
                        let taxGrandTotalPrint = 0;

                        $tblrows.each(function(index) {
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
                                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;;
                                    }
                                }
                            }

                            var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                            var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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


                                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                                var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
        let invoiceData = templateObject.salesorderrecord.get();
        let lineItems = [];
        let total = $('#totalBalanceDue').html() || 0;
        let tax = $('#subtotal_tax').html() || 0;
        let customer = $('#edtCustomerName').val();
        let name = $('#firstname').val();
        let surname = $('#lastname').val();
        let dept = $('#sltDept').val();
        var erpGet = erpDb();
        $('#tblSalesOrderLine > tbody > tr').each(function () {
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
                unitPrice: tdunitprice.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0
            }

            lineItems.push(lineItemObj);
        });
        let company = Session.get('vs1companyName');
        let vs1User = localStorage.getItem('mySession');
        let customerEmail = $('#edtCustomerEmail').val();
        let id = $('.printID').attr("id");
        stringQuery = "?";
        var customerID = $('#edtCustomerEmail').attr('customerid');
        for (let l = 0; l < lineItems.length; l++) {
            stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
        }
        stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + invoiceData.id + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Sales Order&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept;
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.setFontSize(18);
        var source = document.getElementById('html-2-pdfwrapper');
        pdf.addHTML(source, function () {

            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
             pdf.textWithLink('Pay Now', 480, 104, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });

            if ($(".printID").val() == "") {
                pdf.save('Sales Order-' + id + '.pdf');
            } else {
                pdf.save('Sales Order.pdf');
            }
            $('#html-2-pdfwrapper').css('display', 'none');
        });

    };

    setTimeout(function() {

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

    setTimeout(function() {

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
Template.new_salesorder.onRendered(function() {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let salesService = new SalesBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    tempObj.getAllProducts = function() {
        getVS1Data('TProductVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function(data) {

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
                            columnDefs: [{
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
                            }],
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
            }
        }).catch(function(err) {
            productService.getNewProductListVS1().then(function(data) {

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
                        columnDefs: [{
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
                        }],
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

    tempObj.getAllTaxCodes = function() {
        getVS1Data('TTaxcodeVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getTaxCodesVS1().then(function(data) {

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
                            }],
                            colReorder: true,
                            // colReorder: {
                            //   fixedColumnsLeft: 1
                            // },
                            bStateSave: true,
                            //scrollX: 1000,
                            //rowId: 0,
                            pageLength: 25,
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, "All"]
                            ],
                            info: true,
                            responsive: true

                        });
                        // tableProductList
                        //     .order( [ 1, 'desc' ] )
                        //     .draw();
                        // $('#tblTaxRate').DataTable().column( 0 ).visible( false );
                        //$('#tblInventory').DataTable().column( 5 ).visible( false );
                        //$('#tblInventory').DataTable().column( 6 ).visible( false );
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
                //localStorage.setItem('VS1ProductList', JSON.stringify(splashArrayProductList));

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
                        }],
                        colReorder: true,
                        // colReorder: {
                        //   fixedColumnsLeft: 1
                        // },
                        bStateSave: true,
                        //scrollX: 1000,
                        //rowId: 0,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true

                    });
                    // tableProductList
                    //     .order( [ 1, 'desc' ] )
                    //     .draw();
                    // $('#tblTaxRate').DataTable().column( 0 ).visible( false );
                    //$('#tblInventory').DataTable().column( 5 ).visible( false );
                    //$('#tblInventory').DataTable().column( 6 ).visible( false );
                }
            }
        }).catch(function(err) {
            salesService.getTaxCodesVS1().then(function(data) {

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
                //localStorage.setItem('VS1ProductList', JSON.stringify(splashArrayProductList));

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
                        }],
                        colReorder: true,
                        // colReorder: {
                        //   fixedColumnsLeft: 1
                        // },
                        bStateSave: true,
                        //scrollX: 1000,
                        //rowId: 0,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true

                    });
                    // tableProductList
                    //     .order( [ 1, 'desc' ] )
                    //     .draw();
                    // $('#tblTaxRate').DataTable().column( 0 ).visible( false );
                    //$('#tblInventory').DataTable().column( 5 ).visible( false );
                    //$('#tblInventory').DataTable().column( 6 ).visible( false );
                }
            })
        });
    };
    tempObj.getAllTaxCodes();
    //$('#tblInventory').DataTable().column( 6 ).visible( false );
});
Template.new_salesorder.helpers({
    salesorderrecord: () => {
        return Template.instance().salesorderrecord.get();
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
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'new_salesorder'
        });
    },
    salesCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblSalesOrderLine'
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
        return Template.instance().statusrecords.get().sort(function(a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    record: () => {
        return Template.instance().record.get();
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
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
     currentDate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
});

Template.new_salesorder.events({
    'click #edtCustomerName': function(event) {
        $('#edtCustomerName').select();
        $('#edtCustomerName').editableSelect();
    },
    'change #sltStatus': function() {
        let status = $('#sltStatus').find(":selected").val();
        if (status == "newstatus") {
            $('#statusModal').modal();
        }
    },
    'click .btnSaveStatus': function() {
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
            clientService.saveLeadStatus(leadData).then(function(objDetails) {
                sideBarService.getAllLeadStatus().then(function(dataUpdate) {
                    addVS1Data('TLeadStatusType', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                        let id = $('.printID').attr("id");
                        if (id != "") {
                            window.open("/salesordercard?id=" + id);
                        } else {
                            window.open("/salesordercard");
                        }
                    }).catch(function(err) {

                    });
                }).catch(function(err) {
                    window.open('/salesordercard', '_self');
                });
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
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
                //$('.loginSpinner').css('display','none');
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
                if (result.value) {} else if (result.dismiss === 'cancel') {

                }
            });
        }
    },
    'blur .lineProductDesc': function (event) {
        var targetID = $(event.target).closest('tr').attr('id');
        $('#' + targetID + " #lineProductDesc").text($('#' + targetID + " .lineProductDesc").text());
    },
    'blur .lineQty': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblSalesOrderLine tbody tr");
        let $printrows = $(".sales_print tbody tr");
        var targetID = $(event.target).closest('tr').attr('id');
        //if(selectLineID){
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        if ($('.printID').val() == "") {
            $('#' + targetID + " #lineQty").text($('#' + targetID + " .lineQty").val());
        }

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


            var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
        //}
    },
    'change .lineUnitPrice': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        }




        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        // let utilityService = new UtilityService();
        let $tblrows = $("#tblSalesOrderLine tbody tr");
        let $printrows = $(".sales_print tbody tr");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        //if(selectLineID){
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        if ($('.printID').val() == "") {
            $('#' + targetID + " #lineUnitPrice").text($('#' + targetID + " .lineUnitPrice").val());
        }
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".lineUnitPrice").val() || 0;
            var taxcode = $tblrow.find(".lineTaxRate").text() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }


            var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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

                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
    'click #btnCustomFileds': function(event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineProductName': function(event) {
        $('#tblSalesOrderLine tbody tr .lineProductName').attr("data-toggle", "modal");
        $('#tblSalesOrderLine tbody tr .lineProductName').attr("data-target", "#productListModal");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectLineID').val(targetID);
        // Autofocus Searchbar
        setTimeout(function() {
            $('#tblInventory_filter .form-control-sm').focus();
        }, 500);
    },
    'click #productListModal #refreshpagelist': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1SalesProductList', '');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();

    },
    'click .lineTaxRate': function(event) {
        $('#tblSalesOrderLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblSalesOrderLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function(event) {
        $('#tblSalesOrderLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblSalesOrderLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtCustomerName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        exportSalesToPdf();
        // let doc = new jsPDF();
        //   let lineItemObj = {};
        //   let salesData = [];
        //   var url = window.location.href;
        //   var getso_id = url.split('?id=');
        //   var currentSalesOrder = getso_id[getso_id.length-1];
        //
        //   let accountService = new SalesBoardService();
        //   if(getso_id[1]){
        //       currentSalesOrder = parseInt(currentSalesOrder);
        //   accountService.getOneSalesOrderdata(currentSalesOrder).then(function (data) {
        //     if(data.fields.Lines.length){
        //         for(let i=0; i<data.fields.Lines.length; i++){
        //             lineItemObj = {
        //                 productname: data.fields.Lines[i].fields.ProductName || '',
        //                 description: data.fields.Lines[i].fields.ProductDescription || '',
        //                 quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
        //                 unitPrice: data.fields.Lines[i].fields.LinePrice.toFixed(2) || 0,
        //                 taxcode: data.fields.Lines[i].fields.LineTaxCode || '',
        //                 clientName:data.fields.ClientName,
        //                 TotalAmt: data.fields.Lines[i].fields.TotalLineAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0,
        //                 curTotalAmt:data.fields.Lines[i].fields.TotalLineAmount.toFixed(2) || 0,
        //                 TotalAmtInc: data.fields.Lines[i].fields.TotalLineAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0,
        //                 TaxTotal: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) || 0,
        //                 TaxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2)  || 0,
        //             };
        //         }
        //         var salesorderrecord = {
        //             salesOrderto : data.fields.InvoiceToDesc,
        //             shipto : data.fields.ShipToDesc,
        //             docnumber : data.fields.DocNumber,
        //             saledate : data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
        //             duedate : data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
        //             status : data.fields.SalesStatus,
        //             pickmemo : data.fields.PickMemo,
        //             ponumber : data.fields.CustPONumber,
        //
        //         };
        //         salesData.push(lineItemObj);
        //     }
        //
        //     doc.setFontSize(16);
        //     doc.text(" SALES ORDER ", 20,40);
        //     doc.setFontSize(8);
        //     doc.text(''+salesData[0].clientName,35,53);
        //     //purchase date
        //     doc.setFontType('bold');
        //     let logo= 'data:image/png;' +
        //         'base64,' +
        //         'iVBORw0KGgoAAAANSUhEUgAAANgAAAA/CAYAAAH1ZjZBAAAKQ2lDQ1BJQ0MgcHJvZmlsZQAAeNqdU3dYk' +
        //         '/cWPt/3ZQ9WQtjwsZdsgQAiI6wIyBBZohCSAGGEEBJAxYWIClYUFRGcSFXEgtUKSJ2I4qAouGdBiohai1VcOO4' +
        //         'f3Ke1fXrv7e371/u855zn/M55zw+AERImkeaiagA5UoU8Otgfj09IxMm9gAIVSOAEIBDmy8JnBcUAAPADeXh+dLA//' +
        //         'AGvbwACAHDVLiQSx+H/g7pQJlcAIJEA4CIS5wsBkFIAyC5UyBQAyBgAsFOzZAoAlAAAbHl8QiIAqg0A7PRJPgUA2KmT3BcA2KI' +
        //         'cqQgAjQEAmShHJAJAuwBgVYFSLALAwgCgrEAiLgTArgGAWbYyRwKAvQUAdo5YkA9AYACAmUIszAAgOAIAQx4TzQMgTAOgMNK/' +
        //         '4KlfcIW4SAEAwMuVzZdL0jMUuJXQGnfy8ODiIeLCbLFCYRcpEGYJ5CKcl5sjE0jnA0zODAAAGvnRwf44P5Dn5uTh5mbnbO/0xaL+a/' +
        //         'BvIj4h8d/+vIwCBAAQTs/v2l/l5dYDcMcBsHW/a6lbANpWAGjf+V0z2wmgWgrQevmLeTj8QB6eoVDIPB0cCgsL7SViob0w44s+/zPhb+CLfvb8QB7+23rwAHGaQJmtwKOD/XFhbnauUo7nywRCMW735yP+x4V//Y4p0eI0sVwsFYrxWIm4UCJNx3m5UpFEIcmV4hLpfzLxH5b9CZN3DQCshk/ATrYHtctswH7uAQKLDljSdgBAfvMtjBoLkQAQZzQyefcAAJO/+Y9AKwEAzZek4wAAvOgYXKiUF0zGCAAARKCBKrBBBwzBFKzADpzBHbzAFwJhBkRADCTAPBBCBuSAHAqhGJZBGVTAOtgEtbADGqARmuEQtMExOA3n4BJcgetwFwZgGJ7CGLyGCQRByAgTYSE6iBFijtgizggXmY4EImFINJKApCDpiBRRIsXIcqQCqUJqkV1II/ItchQ5jVxA+pDbyCAyivyKvEcxlIGyUQPUAnVAuagfGorGoHPRdDQPXYCWomvRGrQePYC2oqfRS+h1dAB9io5jgNExDmaM2WFcjIdFYIlYGibHFmPlWDVWjzVjHVg3dhUbwJ5h7wgkAouAE+wIXoQQwmyCkJBHWExYQ6gl7CO0EroIVwmDhDHCJyKTqE+0JXoS+cR4YjqxkFhGrCbuIR4hniVeJw4TX5NIJA7JkuROCiElkDJJC0lrSNtILaRTpD7SEGmcTCbrkG3J3uQIsoCsIJeRt5APkE+S+8nD5LcUOsWI4kwJoiRSpJQSSjVlP+UEpZ8yQpmgqlHNqZ7UCKqIOp9aSW2gdlAvU4epEzR1miXNmxZDy6Qto9XQmmlnafdoL+l0ugndgx5Fl9CX0mvoB+nn6YP0dwwNhg2Dx0hiKBlrGXsZpxi3GS+ZTKYF05eZyFQw1zIbmWeYD5hvVVgq9ip8FZHKEpU6lVaVfpXnqlRVc1U/1XmqC1SrVQ+rXlZ9pkZVs1DjqQnUFqvVqR1Vu6k2rs5Sd1KPUM9RX6O+X/2C+mMNsoaFRqCGSKNUY7fGGY0hFsYyZfFYQtZyVgPrLGuYTWJbsvnsTHYF+xt2L3tMU0NzqmasZpFmneZxzQEOxrHg8DnZnErOIc4NznstAy0/LbHWaq1mrX6tN9p62r7aYu1y7Rbt69rvdXCdQJ0snfU6bTr3dQm6NrpRuoW623XP6j7TY+t56Qn1yvUO6d3RR/Vt9KP1F+rv1u/RHzcwNAg2kBlsMThj8MyQY+hrmGm40fCE4agRy2i6kcRoo9FJoye4Ju6HZ+M1eBc+ZqxvHGKsNN5l3Gs8YWJpMtukxKTF5L4pzZRrmma60bTTdMzMyCzcrNisyeyOOdWca55hvtm82/yNhaVFnMVKizaLx5balnzLBZZNlvesmFY+VnlW9VbXrEnWXOss623WV2xQG1ebDJs6m8u2qK2brcR2m23fFOIUjynSKfVTbtox7PzsCuya7AbtOfZh9iX2bfbPHcwcEh3WO3Q7fHJ0dcx2bHC866ThNMOpxKnD6VdnG2ehc53zNRemS5DLEpd2lxdTbaeKp26fesuV5RruutK10/Wjm7ub3K3ZbdTdzD3Ffav7TS6bG8ldwz3vQfTw91jicczjnaebp8LzkOcvXnZeWV77vR5Ps5wmntYwbcjbxFvgvct7YDo+PWX6zukDPsY+Ap96n4e+pr4i3z2+I37Wfpl+B/ye+zv6y/2P+L/hefIW8U4FYAHBAeUBvYEagbMDawMfBJkEpQc1BY0FuwYvDD4VQgwJDVkfcpNvwBfyG/ljM9xnLJrRFcoInRVaG/owzCZMHtYRjobPCN8Qfm+m+UzpzLYIiOBHbIi4H2kZmRf5fRQpKjKqLupRtFN0cXT3LNas5Fn7Z72O8Y+pjLk722q2cnZnrGpsUmxj7Ju4gLiquIF4h/hF8ZcSdBMkCe2J5MTYxD2J43MC52yaM5zkmlSWdGOu5dyiuRfm6c7Lnnc8WTVZkHw4hZgSl7I/5YMgQlAvGE/lp25NHRPyhJuFT0W+oo2iUbG3uEo8kuadVpX2ON07fUP6aIZPRnXGMwlPUit5kRmSuSPzTVZE1t6sz9lx2S05lJyUnKNSDWmWtCvXMLcot09mKyuTDeR55m3KG5OHyvfkI/lz89sVbIVM0aO0Uq5QDhZML6greFsYW3i4SL1IWtQz32b+6vkjC4IWfL2QsFC4sLPYuHhZ8eAiv0W7FiOLUxd3LjFdUrpkeGnw0n3LaMuylv1Q4lhSVfJqedzyjlKD0qWlQyuCVzSVqZTJy26u9Fq5YxVhlWRV72qX1VtWfyoXlV+scKyorviwRrjm4ldOX9V89Xlt2treSrfK7etI66Trbqz3Wb+vSr1qQdXQhvANrRvxjeUbX21K3nShemr1js20zcrNAzVhNe1bzLas2/KhNqP2ep1/XctW/a2rt77ZJtrWv913e/MOgx0VO97vlOy8tSt4V2u9RX31btLugt2PGmIbur/mft24R3dPxZ6Pe6V7B/ZF7+tqdG9s3K+/v7IJbVI2jR5IOnDlm4Bv2pvtmne1cFoqDsJB5cEn36Z8e+NQ6KHOw9zDzd+Zf7f1COtIeSvSOr91rC2jbaA9ob3v6IyjnR1eHUe+t/9+7zHjY3XHNY9XnqCdKD3x+eSCk+OnZKeenU4/PdSZ3Hn3TPyZa11RXb1nQ8+ePxd07ky3X/fJ897nj13wvHD0Ivdi2yW3S609rj1HfnD94UivW2/rZffL7Vc8rnT0Tes70e/Tf/pqwNVz1/jXLl2feb3vxuwbt24m3Ry4Jbr1+Hb27Rd3Cu5M3F16j3iv/L7a/eoH+g/qf7T+sWXAbeD4YMBgz8NZD+8OCYee/pT/04fh0kfMR9UjRiONj50fHxsNGr3yZM6T4aeypxPPyn5W/3nrc6vn3/3i+0vPWPzY8Av5i8+/rnmp83Lvq6mvOscjxx+8znk98ab8rc7bfe+477rfx70fmSj8QP5Q89H6Y8en0E/3Pud8/vwv94Tz+4A5JREAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RjJGODJEQkZDMUExMUU3ODQ4N0FCQ0U4RUU0NUFCMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RjJGODJEQUZDMUExMUU3ODQ4N0FCQ0U4RUU0NUFCMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MEE3RDU5QkYzNzkxMUU2QjhBMjk3RkM1MEQ0MDZBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MEE3RDU5Q0YzNzkxMUU2QjhBMjk3RkM1MEQ0MDZBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PndX4pQAABxZSURBVHjaYvz//z8DvQALPklGRkacckiORHYtI0gclz4mCh37nwCfeMuArvxvaWlp/R8JxMfHJ4Pof39+/2dceoXh77+/DC677zEwLr7CAOL///vnKc6QwhdnyMHxH6rw88cPDHwCgoy/f3z7X3nxDYMSGxPDhtc/GHa9/M4QJsPNsNJBEawVZ9jjwvjAhvXrbv569+r/65cv/395++o/w+LL//9/evPfwsIiHJd5RPsMGzh16RqK5n/AILUw0MVtJrk+gwFBEdHgNccugBTrEzITIIAY6ZnPmAjlM2xYVFQUpiQOmtxBWI2iTE1iHrsJijYgZibLsj/AvMTMzALyDSNyFmBmZmYEmcu49BowL/xmUJPkZrj14ivD/3RD/IUEvgQCy8hYNc668H/alWf/GWac///z62egqp//Gaad+4/PPLKT/utXL/+LcDIz/Pz9j+HLn/8MwjwsDG++/GEQERVjpLgEQQfsHBymh0+dO4UsZqanhd88SjI1CExeten/929fGcoSIhnRagMMABBAdM1n9ARkV2e48js+jFQWMCCVBfgwA7kBT0n5Ac6FjMSkIbR6AVd9zgQ06h+qR/5DwpCZfjGG7kF0Npz++xvkeab4uNhkUVERXSYm5v/MMy4ynHj5mWHb4w8MzNMuMDDPvsTgse8h0Ne/GZiXXWcAqmHQ3HoXKH4ZxP5P9xg7fO4Sg6CQkPiVh8/gYntPnmXomzZz3/pd+z6A+Jv2H3257cCRd/+AUbVw0WJhkNgWT2kG631PGBg+/WZgYIM44f+/fwxfv3yHJPOZFxgYeFgZbgTKku02sgsPElMgCrh15+5/ZhbMMAWZqHTgE8N/HwGGe1/+AWOLiUFRTpYsNw6Ix6BAbvOhEw+xSXDz8DI4GWkzYmnk095jgx0ABNBoPTbUANmlIjl5DEvqwJVcGIdqjMkS6HT/H7A8RmGMEWspI92TIjnNKWiT6j+O5hNKoMEaLsCWByNdk+Lfv39gzSbG9evXbUHvvSE3rUBgypTJMyA++8vA3HeGgXHJVQbm/rPg5hPz0usMzHMvM7RcfsXAvPwGAxOwW8ncewYUCvTPY8j93W+fP3/DFnvA9mFSYGBAGLAFwZydnZMObCuaMrEAlYlzMfyPVWdgEOOCJ7j/qToMX34DG8jvvjP8j1RlYAD2lZlYmAa48GBm5sYmLCIqKnvhwsWLoHE0kMedHB3V/37/CfbJtKtvGaYZgZqOvyERCRT//w8YycBm1N+fv2FDBvT32OkbdxmWbdh8AcR+9OodWCwgLCL/3M27/9///f//zst3DL29fY3zVq692dTVux6UHFetXrPkO8jRP/4yZB95yZB1+jXc8b9+/2b4C0p6guwMLAtvMzB8/8vw+eO3odMIfvniObDQYWIQ5WFm+PDtL8NvoF/4WBkZPv/5z9B86wvDpEvARnCcLMPrr38Z2NhYGfgFBBkHLimSAK7fvvPz8/cfDPdef2V49/UHA4j99NN3hk/fgOxfwNj7x8hw781XsHhEVEzTkOq2vP/59//tmzfxqtHX1WRgB1oyIEMD5AJBdmbGs/ee/X/25BFW+c+fP4GHvCjt1pOFqQWSi8qvrDh0+v/S/Sf+B8Ym7aaW+4ZttwUgALvWG9rUFcV/L8lzbTN1adNmaZuKNcLUMhW/7A9OHEXWMvaHSquCiDgo+skvguAHP0idKKIOOixdwX0QS53g7FYGblXbsjG1k2nUVhOtJiZqbK01r/nz8nI99zWRpBa1aZbOkEMO771777v33Htyzrnnd1/GTixTKe3ePhmcNQXY7MuINzxEfB+JWG0f8bYkUszMsrAUYFuvRUajEV6vN9Vp7DXiReMVlq45ZTSSMwHlxVlPsrQwBX1MD0I1Faqurv6cXzs6On75r8eKKApP/ex0Oy/FXdP2Bqup7xPJnASlfZuYLNfW1tbFIBB+bzAY8rkcdXV1a+cRWa3W+c3NzS2xMs7x8k5UJorijP2U0DY2Nn5fXl5uVQMTxTA+niKHzhIzJRRUx2yyPWAbu+6wfZc86jMv51/ItPZ7WatjkN0eltivzses/k8n638sqWXH+h6qbTfTe7su3nv+ntqvHPo4nes3LTEshl3FQT9cDhWMslgsczwej1tRlPAE7V54d/zzg/tub5HJbBSiWZwSCjAt5eDCDzYglyxhNIxTVeWo6bwLmQcEJQK24X0ITZcAvQiezOfm6LC27G2Y6Prt9SE+COqts/FBoR4bzzjJuYpYWZiLzk9LEIkwaGbkpC2I/a9i2InjbR0ul+suV9brtN+zu+GANDKMeOCSK4s/r/hkeeUaskQN+axRKZCw1fii3QE5pETT2dhQY2u+qlQPqWYumpYZEY4Bmk9kHP6wGOtLc1G/KF9V4Bk7javTcmVl9rY+hhL6ZSWh7Inkx+CIL6FswPniN3t8CeXI2Mrvati9M0hh+GxPz01hHJ3r6v7d7rA7odUgT88ta2w8rU4Dtvk9sE3zcauqBF1f8nMR//PTAW6VYTmMcDhM1hNVmKhBIBiENkeLpsuDY0XvvEWCBDI/D1MnSwva/ldvsP3CVVaxdNkq1bo6e1wXrt14FN9ublmpsGnrtu9+/vsy+6n7IisylyzY3rDvdOvpbhevlyRppGD2TKHlaFtb27nz7CS1az7528MFi5dW8vre3n96BK2I4SEJT9fPwb+VJhSRWxRabkL40YEt572omKVFhJRhydPBQnUFooBgKEQsQ1GiCqM/yB8eH7nVfoCUduojIwarzBh+GkTfVZuUzcNSS3qao8/tdk9OTuIGhx+Nd8j6fArYunfh9iV6heLiYghTQDyzCnv5bpjZbtgndS46SydgJj/rot/AaIQ8Q9SlU6qQbzCgzGx65TeFWYVNBf0oLFx9ZcB9/LrtCgTN5OXgca1i8RKY80RNfPKcVVga6LOvao7s2Htww9AjL0Z9vgnl4mtTYDIh4Pdjy5qvv3EN3G6Zbjwxi9a/YaTJLsGbRc8EYOfKY6I6wvi3B3sAAosgylYuBQEPRK2a1FWDxSOANGkoWI+IYJXEGqHWNqZp//CoNTbFE62Kio2xYGq0omKJ2OIR8eIQRMXlVFAWdt2Fvd97nXlvF3ZF8WRp1/2Syb6dNzPvvfnmN9/3zXzfOBDmQJiDHAxzUP8wzFa7zTipOzu6l5Z6pwSUisF6txm7oh1DaeLLKtPbN/Yqw2yp0nd2qEAgdKZDRl5AZSiNecXmsDqf+iKGsTkc+0TYf4Q2mFA05jXqpJjqTOzvl3/fGFaH0tq3qH8VpXUOhtmG8F6N/zto5zuUvnUwrG9pM0q+77C9H1HysnvDGSsdvr6+4rGIriFqbW190qdKh0BoenAfeTlRqGUW0GE4douwqKioGfn5+acmIOr7EUKnFutBwwRy9dopLzp059l8Fiyx6ykxJiYmdhIifC2RSKYmJiYm4evY2Ni5Zk+o9evWb4iLi4v38fEZjO8HBAQEmutjdOI8f3//AMt2k5LmfZ6dnX1gxYovV1p9GLbDSNIH/7LZLGhQ6SH9ajOkXW6CUpmaUfnRvYcdOsirU0DevXYaLcuKGugoIfw/r1aB2qLgmFQBqcWNcKtNA7SlwLS9/20C2d4M1TZ00UKGLO0ogw+LsYwCrKurbcTXD2pq6vFvQkJCUnR09Gx8vWjRwsXmd8WMxHnz589fZPH+PQjnV1aUYxe3FOyKRpFGSnL6PgX7SumjkCAHpQNlVPjxanSPoPJq2yg4VE7fFx2tpGDvLaadbdfosoIjtyk4WM7UzS6jUq40oib1Zjc3m/ahTRGGRjRr2lRJFI50DA0NDTe7ppEGI4m+HIqKzp/Hp2Dk5eUdpSjG04Yiye6NQtKcx8SoFp47ewH9QWidMh235ezs7IoFy6mTJ87+VViIy63G3nP1Sg0UN3fSzjQrgt1h63jG776qTQutai0W5Mz0KeSCXK4Dd/O+NIvZbdZqjHBihh8MxNGTPDbsL2kBFjaWUdtsrlOKXWuJYrH4AwACAvz9uqY1gjQCdpZJXfpFMph3cnEnUgRQJGUl5XEemBSlGdGzpgGLDRcvXvobM1qr1apxD8fEzZ21Kj0DODxBKAfVWXAFiTEe6uAOA2yfNBRWhvsgrcQIwOdAZrXcFJiMOKPQAbU8EhSpYfitwOxK9dOHPjDHiweypGC6DRxQeaZBQS99/bpnd4wt+8/mrtoYJITeABbAobfee5SjvXZROYq0rktHoXbXVSnagOpN1UV8uqsyheG684G16yZzjd3UULUOI8kgzIwo0INBawQnAbvL9e2pvnuQAAY3KleFmPuxtwBmR0dH2DXDCIIAjVbHhP6aSKvT95StJMVSo3IGg4HsRiIBao2W/jXTAI+B0GvoP2KI0By1jxixd9ZQmiFm/ox040GzhrB8sGnRmLQU9KaBQ3YB3ZULdB5BkVy7nhKRtOLIVJ3Q3t4uN+cpOtXwrK5VVV1dqdLqYVRE5PQu5rh5DJYpO0BnYDr8fm0ddGh6d+ZU642QPmwAgxakKQ5CT0ob6Q5pIW4gR8j7aIjACsX4qAOGYd1T4g2ZFvjOXMgsk6GX4CEQEvCZ2JkuV1JSUmnXCCsu/uecXK2H7N//uHL18qUbackLJzyRq6BeprQq97ilpdFlkDfEz1uwxMt3aLjI09M3bNRov+b2pwiRzBQXFhIsaFCotXVtSir3t8Pn+AK+MP7TBElO9r6T36/5Kv7m9ZKHIcEh4lURHpBe/BjAkwfxl5CtXvAITZUsWq7NEgu7t2Ew5AiSngXosWwCZkGzGlhZdwBcUHdx2DTQRC4c6FQb4czZgoLEefPtF2FtMtmjnbuy9jxUacBreBiW7nC7Rtp8pbSi6dmyHmiqK6+pk/tFTJhc29IqjQwOYEkftzW1K5W0ty1hNOrErjxhfuF56YjJkpm+YRGSHVm7czGz8P2t23dsx50vR9oglTYcFg8WMsBByoa3uxPsjPSAcSIu8BFjsNcv9v4lDQQYscevhSt55jgRiN0xskiYjBhFJQeCXKkDFzcPOJRzOMuul6ZsTVghkZlWwPDo9MQRLOg1kCkICsQAfI19Rc1yTmmgaKB5ISHFOtiApkAuZAS5wKYwV3BCjFYheacjGDPAy3uQzT1/+yWgz5ZUUVFBiEQijnkj85Ghp0aKVZ4ep50YKJPWCPSU2aox4AgOqyLIgN9s94u//UAC9I0aaX3Da1UKcmEDK7cNyS0OLPPnw5pAvpU9GOTvbxmj5kDYOyRtxtffXFiydOn01xkupUj5lMcNoFV4fFCP0sL0GOIrBk/PgVP642PeB4TRdPF6KYUXgLlcp7eDq1AAWzZt/DNn/765luuxDob1ARVcvEo58Xjwpq/hIfKEPdt+Kdq9LTPq2QV0B8P6iJanry5enrFmSr30wUv3xSxXZ8LHjIU4yaTVd6tu//wcTdTBsD6m4VlHj98fPX4iNNVJn28OYAHP4cLQoGFw7NC+e1t+WDuiF9PBwTAbkbNk5pytUbGfJAeOCOPgU6LxMpWyvR3ulN+Snc498kt1eenGV7D17JNhDvofLk05yMGw94r+FaC9KwFvqsrC52VpuqQpXWgbKG2hLKLo5yBLO1Q2GWYURymoiAs6g7SIjtBPR5RBZ0HAQYW2KCKIgDCiZXGhjJQROoUCLaUshSJrS9t0TZum2ZOX997ce1+SPiCtKNskvP/7Tpu83HfvS3L/d+65ufc/4i1RhAjxjihChEgwESJE3E4Eu5n7c2+m8jTeC4zBXtsacbyGIhcZXmvBXYOdRPZXZL1/yUWQ5eA3ec+xSDARNwIjkB0UEOMb4DfjB19jvVhh/G/IKgV1LxQ/bpFgtwNUyHa7On0RsuSb1O48AdlmiAQT4W+IQ4YTYrQjG3uLr2WVi2hLRIKJ8AfgYWAt3CJ5gy7wZxfRHr6dvgyZ2B99GZdk3RuMrMwHLno78CJsI13v4DrkgBY92C1Fenr6TKG4QFpa2iS/oRjHYnsWWZnrsS/Y/ci0JMuOny90uC082FkE4fMzZ34ita3vsAv/TUP2+RV3TrIxuIuvl3XCJbIMyJPwao+SK70kw2s7eE5Fz/myl7se15Z9SnYV7ZEh7EVkiWIM5qNwunR2CgoKdgslZCoqKk66vVlycvKvXcUphmU8Xu6ZZ56Z1rtP7ySGYVj3saysZTm44COPPJIm9IizZs162Vv7WINJWC4jI2OWt3KTJ016vLq6ppbrBO++u/i9Dk5xECCXu59EI9vGC5lwREMJd3xsr5Q0gnTNcaCWH+btozKgPkSWc5gkSJtSUAt4D79EKnOdJ4fPz+uAeq8EqI+PALXyKFALD8Dac61QqLUBlV0K1D+LybkUOueto41ALTrIl1uBymcfhm+qDfBKaTNQWaV8O7g9dJxaeQReOtTIXxvRiHJdL8clIFvlz17Mrz3Yk09OeUqlClMNHzo0ZUZGukdWaOnSD7IrKn48gUl17tw5j3errqys6Z3UN551OmDDhg3r8THabuM0Tc21coR169avw8csCMJ2jAaD0Vv7ZrPJ3FW5/v37D0TO9JSHPCwDCxYsWHi8vPxYdHR0TOacOZn9B9yRNHfuG69hS0lJGVVcXLx306ZN8Oxzz+MTlrnPJcpKcgXMLtVATmEdQGwIkV/CEk1EsQfv28b7sZVyopiQ22iB3GVH4MVUNaxI7kXqCMFlVAEAwTK+QvT4j0X1PBlUCkQMOwyOU7r8FseXVco9F5D2Qw3RPyHn47aw4hC+BnT+itM6WFHaCIWT+8LIHt2Ape3uS59BUVQW8Fl7RYL5ErZs2boZ/7daLY70mTOn85NYFOzK35Wfv+s/33uLZ4hblwVAaUnx0WHJKYO7GJqBuz6OY+FqygkTCPeKi0sQkmvNqk/Wv5Ax83nh6StXfvLRX9584+13Fi3+O36e/++8nVExsRE5yz+0GUymiPQZL0yRIc/DMjRIELnmH6mDnAONAGol33abHZ4cFAGbRnWMwuYeroMlWG4rHBEmNhg+LtNCcmQgTOvX3SWzJQDNQiAaa2YPj4FJid1Ajjydgow9WV48QQi9DV64tzusHhHveb/76/WQur2KJxnWUguRw6g9GtBOlEOUMgCcDgakMjkcOLB/+ojUka+KBPPVUMU9+MfZT3GH7GRIwghkyTQaTUPnoc+l9XW2I8HTDq4XdSTh0qbp0/+Qjv87LCZy9x89ZvS4sz+equZlaD105IKDgoIdVjMEKAJBFR4ZNOS++4YcLC4pioyMSHnppZelyBUAGeXRNth40Uhy3nqIHSqHM8h73Z9/wZPDXWtDcRKWhRGgTGeDaeDW1qU6YiuLE8YN6Abpd0QgsjnBSXGuMqzgpuH+UCiIwaonKA5z4gyhqK0RPZQwdWA4bDqh49uUo9eNNGytNUHGQBSCcTRQEilIJZJUf+17twXB3B0bZx9VBMkvE13sgIOmhfFbF3MLHCWsD8VpnHdiC9olBOsoJpPJiWQ0jdqhKAlUVV3UoJGniaIEvVbQh9EIFeSKIEqnayMqalEIPMeRF5ByYLEzYHayl847IK9xtMFC1Ms63Xrf7oBWu2stoBdH7GB42TqOccWwgCUMXTGUsErKfeNhyefLIDLK0GN3Dkrw3DU4NGJlPeUweickxIkE8+XJDoYhX7HRYoOAwGBMJK+rS01WOyEjDsQtNken9ZnMZgvtpMFotiGChaAOLvOabRtxoY0j7VpBERyCyNTR7L6iA3jpUia+ptjYWFjz2do1X3711eqrfU86nU7vJjEmmTJEBncjL1HQYiepigla7bDiATW8eKca0/yyGtwzhlj4DL9mxVqPV0wMcvwdiuhZMtgLumYLr7hHoQMRARLeD6KyWIcLe/idjVbec7mHzCgmHKTC3c5J6sQR3IWqKm1Mz17iLKKvQtduMLUgMtRpddBmpWH4iNSHvJXDidnrde2gtzuhHZGiMxw6dGhv3q7dVZLgUDhbo4H57yxePnTY8NEdU+QU9fCjE6d99e2OvTVNWqhtboEWkxXsAg+Zn79z26tz3/wIk6u0vAI++fxfq97PXv5FWFhYuLAtZUiI8ompT8/YvnNXiVqtjncfLzlUWmZqbwMZumHYkOdi0TVvT42G4G5oKGZy8h4rUgGzDmqBWn0ckr+vgccL6+HRPXUwbEc1yDeeBmpRKUzYXQ18emPuytX5bq/EMkT0lXERjfc+7KVeMSIQXivWQs/cs/BUWQv8Zk89UOvPQ40BvedgKV+2zQGPJangt4khYDc6PHnM9+0rOihO0/sw/rv7h23z33r7s8ikfnDkx7Mw5veTZ59s0HF1do67Z/CQcR7PxEqj2xkJ6J3Ig7FURFd1TprwYJ+PP11TJI/sAXV6c8CiFZ8WHLnYwFU0tHH1qBfOfH3+2gfHjxu3s2BfdUBUD9AzUqA5KkhYx9Il774cHtW9z3lNY1W90Q7DHnhw6vclx3TlGi13sr6VO1HXwu07VWmc937Oqvi77xs2dXrGYoEH0+Ru3pJH/AnDIO9LkzjJPDUB1o6JQQ4JkazV5YUVEihBnm1LtRm+qzVDaZMNnEYniYtKGqywt8ZE2GTBQ0wbMrvLrCziBEM0WfGWEsZl5PnlHgwNIRMRoevNTth62gA/oDbIDCbmoJ4m5Pp0vBo2j4kGU5sN7KgeRaCCEHv9ho0b/bXv+bVkgDeZndBu4bE9ExL7obsnq6m6cMZqNrVcazuKoCBVXO+kgQEBAQqdVlvXVFd74ZfWpY5PHBCqCoshSRxNRl1zQ30lbbdZvJWNjo6+s/piZQXWUzIYDB1hG/oTESIlMZi2nYYLyKPpUNyDP44IdCweeRR1qJx4Ls7KgA6RSeKa26A6mQzlBGFUOBrizTmsh+zj7USelY/laJg3JBwWDo8CbasVynUOLK8L6kAJ3IuIh9vSI1K7da6xt4yKjoHsrKxv52RmTvTXfnjbEczfMGHChMy8vLyl2ubmn78B89JfDq7qNXw4WimDPx0zwIcnDbxYPwlwnZB5jwqW/koFTQZn17O6qM/FqtVQdrjUPGToMDwkpv21H4qLfX0cO3bsWPbYY4/HbNmyeW6Npu7K2T2vPdwLkaguXr/8Kc2BHU/YCHNlcK4ZRwfNv+atTgqHcywkxMfDyYoKQOTCs4e0P38/ogfzE9w16O7nyk+Ur2toagaj0URS2d0o4B+bNShWa7VzrkWP/CxiFIr1egZSKHzz3qdoFCPeNaAffJG7ufnpKU/EXO7VRIKJBPt/h+rLbd9oJqc9GnrsRMU1S4VfL7AsA2FhYdArrgeMHTV64f69hfO9DRtFgokE8wlEdu8+MW934dd9kvrC6VMV+Hc6uBUfBZ5xVCpDoe+APjD/tbn7cz5YktpVXCYSTCSYT0ERGDg2e/Xarx+aOFl18cJ5NHQ0ILLd4FzgfNJgSEzqBw6HHd56dfbG7Vs3P/vTp4kEEwnmwxh07+B5s15/8x8pI8dKzWYTNNXXkR+LKYnkuhAqJDQU1HHx0NrcBLnrP9u/Kuu92fAzdliLBBMJ5ldzIiPGjk+/f/zvnhg0eGhsbM84kMpkYLNYwGo1A213kOGdu2+QrTCUBGRyOflxOChYSR6bDO1QeeY0lBYV7t2z47u19bXV6345T0WCiQTzfyQEBgX3C4uIjEMeKQoNMUMQsaROmrZbLWa9sV3fpG9tqULl8B464/UdWYoEEyFCxM+EKNsmQsQNxP8A6OmxRbN5/DAAAAAASUVORK5CYII=';
        //     //doc.addImage(logo, 'PNG', 82, 18, 83, 18);
        //     doc.text("Date:", 110,40);
        //     //Delivery Date
        //     doc.text("Sales Order Number:", 110,52);
        //     doc.text("ABN:",110,64);
        //     doc.setFontType('normal');
        //     doc.text(salesorderrecord.saledate, 110,45);
        //     doc.text(salesorderrecord.docnumber ,110,57);
        //     doc.text("123456789" ,110,69);
        //
        //     doc.text(loggedCompany, 160,40);
        //     doc.text("106 O'Reilly Merry street",160,45);
        //     doc.text("Rynfield, Benon",160,50);
        //
        //
        //     //table
        //     doc.setFontType('bold');
        //     doc.text("Product Name",20,100);
        //     doc.text("Description",60,100);
        //     doc.text("Qty ",110,100);
        //     doc.text("Unit Price",132,100);
        //     doc.text("Tax Rate",155,100);
        //     doc.text("Amount",180,100);
        //     doc.line(18,103,195,103);
        //     doc.setFontType('normal');
        //     doc.setFontSize(8);
        //     let axiz=0;
        //     for(let i=0;i<salesData.length ;i++){
        //         doc.text(''+salesData[i].productname,20,110+axiz);
        //         doc.text(''+salesData[i].description,60,110+axiz);
        //         doc.text(''+salesData[i].quantity,110,110+axiz);
        //         doc.text(Currency+''+salesData[i].unitPrice,132,110+axiz);
        //         doc.text(''+salesData[i].taxcode,156,110+axiz);
        //         doc.text(Currency+''+salesData[i].curTotalAmt,180,110+axiz);
        //         axiz+=3;
        //         doc.line(18,110+axiz,195,110+axiz);
        //         axiz+=10;
        //     }
        //     doc.text('Subtotal',145,110+axiz);
        //     doc.text(Currency+''+salesData[0].curTotalAmt,180,110+axiz);
        //
        //     axiz+=5;
        //     doc.text('Tax',145,110+axiz);
        //     doc.text(Currency+''+salesData[0].TaxTotal,180,110+axiz);
        //
        //     axiz+=10;
        //     doc.line(105,110+axiz,195,110+axiz);
        //     axiz+=10;
        //     doc.setFontType('bold');
        //     doc.setFontSize(10);
        //     doc.text('TOTAL',140,110+axiz);
        //     doc.text(Currency+''+salesData[0].TotalAmtInc,175,110+axiz);
        //     axiz+=5;
        //     doc.line(105,110+axiz,195,110+axiz);
        //
        //     doc.save('Sales #'+salesorderrecord.docnumber+'.pdf');
        // });
        // }
    },
    'keydown .lineQty, keydown .lineUnitPrice': function(event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblSalesOrderLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                $(".sales_print #"+targetID).remove();
                event.preventDefault();
                let $tblrows = $("#tblSalesOrderLine tbody tr");
                let $printrows = $(".sales_print tbody tr");
                //if(selectLineID){
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


                    var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
                    var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
    'click .btnDeleteSO': function(event) {
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
                type: "TSalesOrderEx",
                fields: {
                    ID: currentInvoice,
                    Deleted: true,
                    Lines: null
                }
            };

            salesService.saveSalesOrderEx(objDetails).then(function(objDetails) {
                Router.go('/salesorderslist?success=true');
            }).catch(function(err) {
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
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            Router.go('/salesorderslist?success=true');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblSalesOrderLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();
            $(".sales_print #"+selectLineID).remove();
            //event.preventDefault();
            let $tblrows = $("#tblSalesOrderLine tbody tr");
            let $printrows = $(".sales_print tbody tr");
            //if(selectLineID){
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let  taxGrandTotalPrint = 0;

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


                var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
                    var subTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseInt(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
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
            // $(event.target).closest('tr').remove();
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

            //event.preventDefault();

        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function(event) {
        /*
    let getchkcustomField1 = true;
    let getchkcustomField2 =  true;
    let getcustomField1 = $('.customField1Text').html();
    let getcustomField2 = $('.customField2Text').html();
    let saleCustField1 = $('#edtSaleCustField1').val();
    let saleCustField2 = $('#edtSaleCustField2').val();
    if($('#formCheck-one').is(':checked')){
      getchkcustomField1 = false;
    }
    if($('#formCheck-two').is(':checked')){
      getchkcustomField2 = false;
    }

    var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    if(getcurrentCloudDetails){
      $('.lblCustomField1').text('');
      $('.lblCustomField2').text('');
    if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'new_salesorder'});
        if (checkPrefDetails) {
        CloudPreference.update({ _id: checkPrefDetails._id},{ $set: {username:clientUsername,useremail:clientEmail,
          PrefGroup:'salesform',PrefName:'new_salesorder',published:true,
          customFields:[{
              index: '1',
              label: getcustomField1,
              hidden: getchkcustomField1
              },{
              index: '2',
              label: getcustomField2,
              hidden: getchkcustomField2
          }],
          createdAt: new Date() }}, function(err, idTag) {
          if (err) {
            $('#myModal4').modal('toggle');
          //  Router.go('/salesorderslist?success=true');
          } else {
            $('#myModal4').modal('toggle');
          //Router.go('/salesorderslist?success=true');

          }
        });

      }else{
        $('.lblCustomField1').text('');
        $('.lblCustomField2').text('');
        CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
          PrefGroup:'salesform',PrefName:'new_salesorder',published:true,
          customFields:[{
              index: '1',
              label: getcustomField1,
              hidden: getchkcustomField1
              },{
              index: '2',
              label: getcustomField2,
              hidden: getchkcustomField2
          }],
          createdAt: new Date() }, function(err, idTag) {
          if (err) {
            $('#myModal4').modal('toggle');
          } else {
            $('#myModal4').modal('toggle');

          }
        });
      }
    }
    }
    */
        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event) {
        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let name = $('#edtCustomerEmail').attr('customerfirstname');
        let surname = $('#edtCustomerEmail').attr('customerlastname');
        let salesService = new SalesBoardService();
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            var erpGet = erpDb();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblSalesOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSalesOrderLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMQtySold: parseFloat(tdQty) || 0,
                            UOMQtyShipped: parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();
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
            var currentSalesOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentSalesOrder = parseInt(currentSalesOrder);
                objDetails = {
                    type: "TSalesOrderEx",
                    fields: {
                        ID: currentSalesOrder,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
                    type: "TSalesOrderEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
            
            salesService.saveSalesOrderEx(objDetails).then(function(objDetails) {
                let company = Session.get('vs1companyName');
                let vs1User = localStorage.getItem('mySession');
                var customerID = $('#edtCustomerEmail').attr('customerid');
                 let stringQuery = "?";
                var customerID = $('#edtCustomerEmail').attr('customerid');
                for (let l = 0; l < lineItemsForm.length; l++) {
                    stringQuery = stringQuery + "product" + l + "=" + lineItemsForm[l].fields.ProductName + "&price" + l + "=" + lineItemsForm[l].fields.LinePrice + "&qty" + l + "=" + lineItemsForm[l].fields.UOMQtySold + "&";
                }
                stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + objDetails.fields.ID + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Sales Order&url=" + window.location.href  + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + departement;
                // Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
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
                        pdfObject = {
                            filename: 'Sales Order-' + invoiceId + '.pdf',
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
                        let mailSubject = 'Sales Order ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
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
                            '                        Please find sales order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                 <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Simply click on <a style="border: none; color: white; padding: 6px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #5cb85c; border-color: #4cae4c; border-radius: 10px;" href="https://www.depot.vs1cloud.com/stripe/' + stringQuery + '">Make Payment</a> to pay now.' +
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
                                    Router.go('/salesorderslist?success=true');

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
                                    Router.go('/salesorderslist?success=true');
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
                                            Router.go('/salesorderslist?success=true');
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
                                    Router.go('/salesorderslist?success=true');

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
                                            Router.go('/salesorderslist?success=true');
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
                                    Router.go('/salesorderslist?success=true');
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
                                            Router.go('/salesorderslist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            Router.go('/salesorderslist?success=true');
                        };
                    };


                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function () {
                            doc.setFontSize(10);
                            doc.setTextColor(255, 255, 255);
                            doc.textWithLink('Pay Now', 480, 104, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });
                            resolve(doc.output('blob'));
                            $('#html-2-pdfwrapper').css('display', 'none');
                        });
                    });
                }
                // End Send Email

                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // salesService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
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
                            PrefName: 'new_salesorder'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_salesorder',
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
                                    Router.go('/salesorderslist?success=true');
                                } else {
                                    Router.go('/salesorderslist?success=true');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_salesorder',
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
                                    Router.go('/salesorderslist?success=true');
                                } else {
                                    Router.go('/salesorderslist?success=true');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {

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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .chkProductName': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colProductName').css('display', 'table-cell');
            $('.colProductName').css('padding', '.75rem');
            $('.colProductName').css('vertical-align', 'top');
        } else {
            $('.colProductName').css('display', 'none');
        }
    },
    'click .chkDescription': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colDescription').css('display', 'table-cell');
            $('.colDescription').css('padding', '.75rem');
            $('.colDescription').css('vertical-align', 'top');
        } else {
            $('.colDescription').css('display', 'none');
        }
    },
    'click .chkQty': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colQty').css('display', 'table-cell');
            $('.colQty').css('padding', '.75rem');
            $('.colQty').css('vertical-align', 'top');
        } else {
            $('.colQty').css('display', 'none');
        }
    },
    'click .chkUnitPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colUnitPrice').css('display', 'table-cell');
            $('.colUnitPrice').css('padding', '.75rem');
            $('.colUnitPrice').css('vertical-align', 'top');
        } else {
            $('.colUnitPrice').css('display', 'none');
        }
    },
    'click .chkCostPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCostPrice').css('display', 'table-cell');
            $('.colCostPrice').css('padding', '.75rem');
            $('.colCostPrice').css('vertical-align', 'top');
        } else {
            $('.colCostPrice').css('display', 'none');
        }
    },
    'click .chkSalesLinesCustField1': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colSalesLinesCustField1').css('display', 'table-cell');
            $('.colSalesLinesCustField1').css('padding', '.75rem');
            $('.colSalesLinesCustField1').css('vertical-align', 'top');
        } else {
            $('.colSalesLinesCustField1').css('display', 'none');
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
    'click .chkAmount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'change .rngRangeProductName': function(event) {

        let range = $(event.target).val();
        $(".spWidthProductName").html(range + '%');
        $('.colProductName').css('width', range + '%');

    },
    'change .rngRangeDescription': function(event) {

        let range = $(event.target).val();
        $(".spWidthDescription").html(range + '%');
        $('.colDescription').css('width', range + '%');

    },
    'change .rngRangeQty': function(event) {

        let range = $(event.target).val();
        $(".spWidthQty").html(range + '%');
        $('.colQty').css('width', range + '%');

    },
    'change .rngRangeUnitPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + '%');
        $('.colUnitPrice').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function(event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeAmount': function(event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeCostPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + '%');
        $('.colCostPrice').css('width', range + '%');

    },
    'change .rngRangeSalesLinesCustField1': function(event) {

        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + '%');
        $('.colSalesLinesCustField1').css('width', range + '%');

    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

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
                    PrefName: 'tblSalesOrderLine'
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
                            PrefName: 'tblSalesOrderLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                            //Router.go('/salesorderslist?success=true');
                        } else {
                            $('#myModal2').modal('toggle');
                            //Router.go('/salesorderslist?success=true');

                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblSalesOrderLine',
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
                    PrefName: 'tblSalesOrderLine'
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
    'click .btnResetSettings': function(event) {
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
                    PrefName: 'new_salesorder'
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
    'click .payNow': function() {
        let templateObject = Template.instance();
        var url = window.location.href;
        let invoiceData = templateObject.salesorderrecord.get();
        var id_available = url.includes("?id=");
        if(id_available == true) {
            let lineItems = [];
            let total = $('#grandTotal').html() || 0;
            let tax = $('#subtotal_tax').html() || 0;
            let customer = $('#edtCustomerName').val();
            $('#tblSalesOrderLine > tbody > tr').each(function() {
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
            let company = Session.get('vs1companyName');
            let vs1User = localStorage.getItem('mySession');
            let customerEmail = $('#edtCustomerEmail').val();
            let stringQuery = "?";
            for (let l = 0; l < lineItems.length; l++) {
                stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
            }
            stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + invoiceData.id + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Sales Order&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort;
            window.open("https://www.depot.vs1cloud.com/stripe/" + stringQuery, '_self');

        } else{
        let customername = $('#edtCustomerName');
        let name = $('#edtCustomerEmail').attr('customerfirstname');
        let surname = $('#edtCustomerEmail').attr('customerlastname');
        let salesService = new SalesBoardService();
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            var erpGet = erpDb();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblSalesOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSalesOrderLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMQtySold: parseFloat(tdQty) || 0,
                            UOMQtyShipped: parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();
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
            var currentSalesOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentSalesOrder = parseInt(currentSalesOrder);
                objDetails = {
                    type: "TSalesOrderEx",
                    fields: {
                        ID: currentSalesOrder,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
                    type: "TSalesOrderEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
            
            setTimeout(function(){
            salesService.saveSalesOrderEx(objDetails).then(function(objDetails) {
                let company = Session.get('vs1companyName');
                let vs1User = localStorage.getItem('mySession');
                var customerID = $('#edtCustomerEmail').attr('customerid');
                 let stringQuery = "?";
                var customerID = $('#edtCustomerEmail').attr('customerid');
                for (let l = 0; l < lineItemsForm.length; l++) {
                    stringQuery = stringQuery + "product" + l + "=" + lineItemsForm[l].fields.ProductName + "&price" + l + "=" + lineItemsForm[l].fields.LinePrice + "&qty" + l + "=" + lineItemsForm[l].fields.UOMQtySold + "&";
                }
                stringQuery = stringQuery + "tax=" + tax + "&total=" + total + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + objDetails.fields.ID + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Sales Order&url=" + window.location.href  + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + departement;
                // Send Email

                let url = "https://www.depot.vs1cloud.com/stripe/" + stringQuery;
                $('#html-2-pdfwrapper').css('display', 'block');
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
                        pdfObject = {
                            filename: 'Sales Order-' + invoiceId + '.pdf',
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
                        let mailSubject = 'Sales Order ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
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
                            '                        Please find sales order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                 <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Simply click on <a style="border: none; color: white; padding: 6px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #5cb85c; border-color: #4cae4c; border-radius: 10px;" href="https://www.depot.vs1cloud.com/stripe/' + stringQuery + '">Make Payment</a> to pay now.' +
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
                                    Router.go('/salesorderslist?success=true');
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
                                    Router.go('/salesorderslist?success=true');
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
                                            window.open(url,'_self');
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
                                    Router.go('/salesorderslist?success=true');

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
                                            window.open(url,'_self');
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
                                    Router.go('/salesorderslist?success=true');
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
                                            window.open(url,'_self');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            window.open(url,'_self');
                        };
                    };


                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function () {
                            doc.setFontSize(10);
                            doc.setTextColor(255, 255, 255);
                            doc.textWithLink('Pay Now', 480, 104, { url: 'https://www.depot.vs1cloud.com/stripe/' + stringQuery });
                            resolve(doc.output('blob'));
                            $('#html-2-pdfwrapper').css('display', 'none');
                        });
                    });
                }
                // End Send Email

                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // salesService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
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
                            PrefName: 'new_salesorder'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_salesorder',
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
                                    Router.go('/salesorderslist?success=true');
                                } else {
                                    Router.go('/salesorderslist?success=true');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_salesorder',
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
                                    Router.go('/salesorderslist?success=true');
                                } else {
                                    Router.go('/salesorderslist?success=true');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {

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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        },500);
        }

        }
    },
    'click #btnPayment': function() {

        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let salesService = new SalesBoardService();
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblSalesOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSalesOrderLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMQtySold: parseFloat(tdQty) || 0,
                            UOMQtyShipped: parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();
            // let saleDate = $('#dtSODate').val();
            // let dueDate = $('#dtDueDate').val();
            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

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
            var currentSalesOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentSalesOrder = parseInt(currentSalesOrder);
                objDetails = {
                    type: "TSalesOrderEx",
                    fields: {
                        ID: currentSalesOrder,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
                    type: "TSalesOrderEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
            salesService.saveSalesOrderEx(objDetails).then(function(objDetails) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    salesService.saveCustomerEmail(customerEmailData).then(function(customerEmailData) {

                    });
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
                            PrefName: 'new_salesorder'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_salesorder',
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
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_salesorder',
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
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {
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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
        //Router.go('/salesorderslist');
        //window.open('/invoicelist','_self');
    },
    'click #btnCopyToInvoice': function() {
        //Router.go('/salesorderslist');
        //window.open('/invoicelist','_self');
        $('.fullScreenSpin').css('display', 'inline-block');
        var url = window.location.href;
        //if ((url.indexOf('?id=') > 0) || (url.indexOf('?copyquid=') > 0)) {
        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let salesService = new SalesBoardService();
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblSalesOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").text();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSalesOrderLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMQtySold: parseFloat(tdQty) || 0,
                            UOMQtyShipped: parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
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

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

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
            var currentSalesOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentSalesOrder = parseInt(currentSalesOrder);
                objDetails = {
                    type: "TSalesOrderEx",
                    fields: {
                        ID: currentSalesOrder,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
                    type: "TSalesOrderEx",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,
                        //DueDate: dueDate,
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
            salesService.saveSalesOrderEx(objDetails).then(function(objDetails) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    salesService.saveCustomerEmail(customerEmailData).then(function(customerEmailData) {

                    });
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
                            PrefName: 'new_salesorder'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'new_salesorder',
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
                                    window.open('/invoicecard?copysoid=' + linesave, '_self');
                                } else {
                                    window.open('/invoicecard?copysoid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'new_salesorder',
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
                                    window.open('/invoicecard?copysoid=' + linesave, '_self');
                                } else {
                                    window.open('/invoicecard?copysoid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {
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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        }
        // } else {
        //     Router.go('/invoicecard');
        // }
    },
    'click .chkEmailCopy': function(event) {
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
                } else {


                }
            }
        } else {

        }
    }

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
