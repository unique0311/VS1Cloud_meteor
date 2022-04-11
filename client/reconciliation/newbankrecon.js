import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { ReconService } from "./recon-service";
import { UtilityService } from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
import 'jquery-editable-select';
import { AccountService } from "../accounts/account-service";
import {ProductService} from "../product/product-service";
let utilityService = new UtilityService();

Template.newbankrecon.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.bankTransactionData = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);

    setTimeout(function() {
        $(document).ready(function() {
            $('#sltTaxRate').editableSelect();
            $("#sltTaxRate")
                .editableSelect()
                .on("click.editable-select", function (e, li) {
                    var $each = $(this);
                    var taxSelected = "sales";
                    var offset = $each.offset();
                    var taxRateDataName = e.target.value || "";
                    if (e.pageX > offset.left + $each.width() - 8) {
                        // X button 16px wide?
                        $("#taxRateListModal").modal("toggle");
                    } else {
                        if (taxRateDataName.replace(/\s/g, "") !== "") {
                            $(".taxcodepopheader").text("Edit Tax Rate");
                            getVS1Data("TTaxcodeVS1")
                                .then(function (dataObject) {
                                    if (dataObject.length === 0) {
                                        purchaseService
                                            .getTaxCodesVS1()
                                            .then(function (data) {
                                                let lineItems = [];
                                                let lineItemObj = {};
                                                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                                    if (
                                                        data.ttaxcodevs1[i].CodeName === taxRateDataName
                                                    ) {
                                                        $("#edtTaxNamePop").attr("readonly", true);
                                                        let taxRate = (
                                                            data.ttaxcodevs1[i].Rate * 100
                                                        ).toFixed(2);
                                                        var taxRateID = data.ttaxcodevs1[i].Id || "";
                                                        var taxRateName =
                                                            data.ttaxcodevs1[i].CodeName || "";
                                                        var taxRateDesc =
                                                            data.ttaxcodevs1[i].Description || "";
                                                        $("#edtTaxID").val(taxRateID);
                                                        $("#edtTaxNamePop").val(taxRateName);
                                                        $("#edtTaxRatePop").val(taxRate);
                                                        $("#edtTaxDescPop").val(taxRateDesc);
                                                        setTimeout(function () {
                                                            $("#newTaxRateModal").modal("toggle");
                                                        }, 100);
                                                    }
                                                }
                                            })
                                            .catch(function (err) {
                                                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                                $(".fullScreenSpin").css("display", "none");
                                                // Meteor._reload.reload();
                                            });
                                    } else {
                                        let data = JSON.parse(dataObject[0].data);
                                        let useData = data.ttaxcodevs1;
                                        let lineItems = [];
                                        let lineItemObj = {};
                                        $(".taxcodepopheader").text("Edit Tax Rate");
                                        for (let i = 0; i < useData.length; i++) {
                                            if (useData[i].CodeName === taxRateDataName) {
                                                $("#edtTaxNamePop").attr("readonly", true);
                                                let taxRate = (useData[i].Rate * 100).toFixed(2);
                                                var taxRateID = useData[i].Id || "";
                                                var taxRateName = useData[i].CodeName || "";
                                                var taxRateDesc = useData[i].Description || "";
                                                $("#edtTaxID").val(taxRateID);
                                                $("#edtTaxNamePop").val(taxRateName);
                                                $("#edtTaxRatePop").val(taxRate);
                                                $("#edtTaxDescPop").val(taxRateDesc);
                                                //setTimeout(function() {
                                                $("#newTaxRateModal").modal("toggle");
                                                //}, 500);
                                            }
                                        }
                                    }
                                })
                                .catch(function (err) {
                                    purchaseService
                                        .getTaxCodesVS1()
                                        .then(function (data) {
                                            let lineItems = [];
                                            let lineItemObj = {};
                                            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                                if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
                                                    $("#edtTaxNamePop").attr("readonly", true);
                                                    let taxRate = (
                                                        data.ttaxcodevs1[i].Rate * 100
                                                    ).toFixed(2);
                                                    var taxRateID = data.ttaxcodevs1[i].Id || "";
                                                    var taxRateName = data.ttaxcodevs1[i].CodeName || "";
                                                    var taxRateDesc =
                                                        data.ttaxcodevs1[i].Description || "";
                                                    $("#edtTaxID").val(taxRateID);
                                                    $("#edtTaxNamePop").val(taxRateName);
                                                    $("#edtTaxRatePop").val(taxRate);
                                                    $("#edtTaxDescPop").val(taxRateDesc);
                                                    setTimeout(function () {
                                                        $("#newTaxRateModal").modal("toggle");
                                                    }, 100);
                                                }
                                            }
                                        })
                                        .catch(function (err) {
                                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                            $(".fullScreenSpin").css("display", "none");
                                            // Meteor._reload.reload();
                                        });
                                });
                        } else {
                            $("#taxRateListModal").modal("toggle");
                        }
                    }
                });
            $('#sltAccountName').editableSelect();
            $('#sltAccountName').editableSelect().on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                let accountService = new AccountService();
                const accountTypeList = [];
                var accountDataName = e.target.value ||'';

                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#selectLineID').val('');
                    $('#accountListModal').modal();
                    setTimeout(function () {
                        $('#tblAccount_filter .form-control-sm').focus();
                        $('#tblAccount_filter .form-control-sm').val('');
                        $('#tblAccount_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblAccountlist').DataTable();
                        datatable.draw();
                        $('#tblAccountlist_filter .form-control-sm').trigger("input");
                    }, 500);
                }else{
                    if(accountDataName.replace(/\s/g, '') !== ''){
                        getVS1Data('TAccountVS1').then(function (dataObject) {
                            if (dataObject.length === 0) {
                                accountService.getOneAccountByName(accountDataName).then(function (data) {
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    let fullAccountTypeName = '';
                                    let accBalance = '';
                                    $('#add-account-title').text('Edit Account Details');
                                    $('#edtAccountName').attr('readonly', true);
                                    $('#sltAccountType').attr('readonly', true);
                                    $('#sltAccountType').attr('disabled', 'disabled');
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

                                    if(showTrans === 'true'){
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

                                        if(showTrans === 'true'){
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
                                        let lineItems = [];
                                        let lineItemObj = {};
                                        let fullAccountTypeName = '';
                                        let accBalance = '';
                                        $('#add-account-title').text('Edit Account Details');
                                        $('#edtAccountName').attr('readonly', true);
                                        $('#sltAccountType').attr('readonly', true);
                                        $('#sltAccountType').attr('disabled', 'disabled');
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

                                        if(showTrans === 'true'){
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
                                let lineItems = [];
                                let lineItemObj = {};
                                let fullAccountTypeName = '';
                                let accBalance = '';
                                $('#add-account-title').text('Edit Account Details');
                                $('#edtAccountName').attr('readonly', true);
                                $('#sltAccountType').attr('readonly', true);
                                $('#sltAccountType').attr('disabled', 'disabled');
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

                                if(showTrans === 'true'){
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
                        $('#accountListModal').modal();
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

        });

    }, 500);


});

Template.newbankrecon.onRendered(function() {

    const templateObject = Template.instance();

    let productService = new ProductService();
    const taxCodesList = [];
    var splashArrayTaxRateList = [];

    templateObject.getAllTaxCodes = function () {
        getVS1Data("TTaxcodeVS1")
            .then(function (dataObject) {
                if (dataObject.length === 0) {
                    productService.getTaxCodesVS1().then(function (data) {
                        // let records = [];
                        // let inventoryData = [];
                        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                            var dataList = [
                                data.ttaxcodevs1[i].Id || "",
                                data.ttaxcodevs1[i].CodeName || "",
                                data.ttaxcodevs1[i].Description || "-",
                                taxRate || 0,
                            ];

                            let taxcoderecordObj = {
                                codename: data.ttaxcodevs1[i].CodeName || " ",
                                coderate: taxRate || " ",
                            };

                            taxCodesList.push(taxcoderecordObj);

                            splashArrayTaxRateList.push(dataList);
                        }
                        templateObject.taxraterecords.set(taxCodesList);

                        if (splashArrayTaxRateList) {
                            $("#tblTaxRate").DataTable({
                                data: splashArrayTaxRateList,
                                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                columnDefs: [
                                    {
                                        orderable: false,
                                        targets: 0,
                                    },
                                    {
                                        className: "taxName",
                                        targets: [1],
                                    },
                                    {
                                        className: "taxDesc",
                                        targets: [2],
                                    },
                                    {
                                        className: "taxRate text-right",
                                        targets: [3],
                                    },
                                ],
                                colReorder: true,

                                pageLength: initialDatatableLoad,
                                lengthMenu: [
                                    [initialDatatableLoad, -1],
                                    [initialDatatableLoad, "All"],
                                ],
                                info: true,
                                responsive: true,
                                fnDrawCallback: function (oSettings) {
                                    // $('.dataTables_paginate').css('display', 'none');
                                },
                                fnInitComplete: function () {
                                    $(
                                        "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                                    ).insertAfter("#tblTaxRate_filter");
                                    $(
                                        "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                    ).insertAfter("#tblTaxRate_filter");
                                },
                            });
                        }
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.ttaxcodevs1;
                    // let records = [];
                    // let inventoryData = [];
                    for (let i = 0; i < useData.length; i++) {
                        let taxRate = (useData[i].Rate * 100).toFixed(2);
                        var dataList = [
                            useData[i].Id || "",
                            useData[i].CodeName || "",
                            useData[i].Description || "-",
                            taxRate || 0,
                        ];

                        let taxcoderecordObj = {
                            codename: useData[i].CodeName || " ",
                            coderate: taxRate || " ",
                        };

                        taxCodesList.push(taxcoderecordObj);

                        splashArrayTaxRateList.push(dataList);
                    }
                    templateObject.taxraterecords.set(taxCodesList);
                    if (splashArrayTaxRateList) {
                        $("#tblTaxRate").DataTable({
                            data: splashArrayTaxRateList,
                            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                            columnDefs: [
                                {
                                    orderable: false,
                                    targets: 0,
                                },
                                {
                                    className: "taxName",
                                    targets: [1],
                                },
                                {
                                    className: "taxDesc",
                                    targets: [2],
                                },
                                {
                                    className: "taxRate text-right",
                                    targets: [3],
                                },
                            ],
                            colReorder: true,

                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"],
                            ],
                            info: true,
                            responsive: true,
                            fnDrawCallback: function (oSettings) {
                                // $('.dataTables_paginate').css('display', 'none');
                            },
                            fnInitComplete: function () {
                                $(
                                    "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                                ).insertAfter("#tblTaxRate_filter");
                                $(
                                    "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                ).insertAfter("#tblTaxRate_filter");
                            },
                        });
                    }
                }
            })
            .catch(function (err) {
                productService.getTaxCodesVS1().then(function (data) {
                    // let records = [];
                    // let inventoryData = [];
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                        var dataList = [
                            data.ttaxcodevs1[i].Id || "",
                            data.ttaxcodevs1[i].CodeName || "",
                            data.ttaxcodevs1[i].Description || "-",
                            taxRate || 0,
                        ];

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || " ",
                            coderate: taxRate || " ",
                        };

                        taxCodesList.push(taxcoderecordObj);

                        splashArrayTaxRateList.push(dataList);
                    }
                    templateObject.taxraterecords.set(taxCodesList);

                    if (splashArrayTaxRateList) {
                        $("#tblTaxRate").DataTable({
                            data: splashArrayTaxRateList,
                            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                            columnDefs: [
                                {
                                    orderable: false,
                                    targets: 0,
                                },
                                {
                                    className: "taxName",
                                    targets: [1],
                                },
                                {
                                    className: "taxDesc",
                                    targets: [2],
                                },
                                {
                                    className: "taxRate text-right",
                                    targets: [3],
                                },
                            ],
                            colReorder: true,

                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"],
                            ],
                            info: true,
                            responsive: true,
                            fnDrawCallback: function (oSettings) {
                                // $('.dataTables_paginate').css('display', 'none');
                            },
                            fnInitComplete: function () {
                                $(
                                    "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                                ).insertAfter("#tblTaxRate_filter");
                                $(
                                    "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                ).insertAfter("#tblTaxRate_filter");
                            },
                        });
                    }
                });
            });
    };

    templateObject.getBankTransactionData = function () {
        getVS1Data("TToBeReconciledDeposit")
            .then(function (dataObject) {
                // console.log(dataObject.length);
                if (dataObject.length === 0) {
                    // templateObject.taxraterecords.set(taxCodesList);
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    // console.log(data);
                    // let useData = data.ttaxcodevs1;
                    // let records = [];
                    // let inventoryData = [];
                    // for (let i = 0; i < useData.length; i++) {
                    //     let taxRate = (useData[i].Rate * 100).toFixed(2);
                    //     var dataList = [
                    //         useData[i].Id || "",
                    //         useData[i].CodeName || "",
                    //         useData[i].Description || "-",
                    //         taxRate || 0,
                    //     ];
                    //
                    //     let taxcoderecordObj = {
                    //         codename: useData[i].CodeName || " ",
                    //         coderate: taxRate || " ",
                    //     };
                    //
                    //     taxCodesList.push(taxcoderecordObj);
                    //
                    //     splashArrayTaxRateList.push(dataList);
                    // }
                    // templateObject.taxraterecords.set(taxCodesList);
                }
            })
            .catch(function (err) {

            });
    };

    setTimeout(function () {
        templateObject.getBankTransactionData();
        templateObject.getAllTaxCodes();
    }, 500);

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        $(".colAccount").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblDepositEntryLine tbody tr");

        if(selectLineID){
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineAccoutNo = table.find(".accountnumber").text();


            $('#'+selectLineID+" .lineAccountName").val(lineProductName);
            $('#accountListModal').modal('toggle');

            $(".colAccount").removeClass('boldtablealertsborder');
        }else{
            let accountname = table.find(".productName").text();
            $('#accountListModal').modal('toggle');
            $('#sltAccountName').val(accountname);
            if($tblrows.find(".lineAccountName").val() === ''){
                $tblrows.find(".colAccount").addClass('boldtablealertsborder');
            }
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
            // $(".colAccount").removeClass('boldtablealertsborder');
        }, 1000);
    });

    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        let selectedTaxRateDropdownID = $('#selectLineID').val() || 'sltTaxRate';
        $('#'+selectedTaxRateDropdownID+'').val($(this).find(".taxName").text());
        $('#taxRateListModal').modal('toggle');
    });
});

Template.newbankrecon.events({


    'click .btnReconTransactionDetail': function() {
        FlowRouter.go('/recontransactiondetail');
        // window.open('/recontransactiondetail', '_self');
    },

});

Template.newbankrecon.helpers({
    taxraterecords: () => {
        return Template.instance()
            .taxraterecords.get()
            .sort(function (a, b) {
                if (a.description === "NA") {
                    return 1;
                } else if (b.description === "NA") {
                    return -1;
                }
                return a.description.toUpperCase() > b.description.toUpperCase()
                    ? 1
                    : -1;
            });
    },
    bankTransactionData: () => {
        return Template.instance().bankTransactionData.get();
    }
});
