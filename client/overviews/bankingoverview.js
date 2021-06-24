import { PaymentsService } from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.bankingoverview.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.awaitingcustpaymentCount = new ReactiveVar();
    templateObject.awaitingsupppaymentCount = new ReactiveVar();

    templateObject.overduecustpaymentCount = new ReactiveVar();
    templateObject.overduesupppaymentCount = new ReactiveVar();
    templateObject.bankaccountdatarecord = new ReactiveVar([]);
});

Template.bankingoverview.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    let accountService = new AccountService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];


    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblBankingOverview', function(error, result) {
        if (error) {

        } else {
            if (result) {

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    getVS1Data('TAccountVS1').then(function(dataObject) {
        if (dataObject.length == 0) {
            accountService.getAccountListVS1().then(function(data) {
                let arrayDataUse = [];
                let totalAmountCalculation = '';
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    if ((data.taccountvs1[i].AccountTypeName == 'CCARD') || (data.taccountvs1[i].AccountTypeName == 'BANK')) {
                        arrayDataUse.push(data.taccountvs1[i]);
                        let filterDueDateData = _.filter(arrayDataUse, function(data) {
                            return data.AccountName
                        });

                        let groupData = _.omit(_.groupBy(filterDueDateData, 'AccountName'), ['']);
                        totalAmountCalculation = _.map(groupData, function(value, key) {
                            let totalBalance = 0;
                            let creditcard = 'fas fa-credit-card';
                            for (let i = 0; i < value.length; i++) {
                                totalBalance += value[i].Balance;
                                let accountName = value[i].AccountName.toLowerCase();
                                if (accountName.includes("credit")) {
                                    creditcard = 'fas fa-credit-card';
                                } else if (accountName.includes("mastercard")) {
                                    creditcard = 'fab fa-cc-mastercard'
                                } else if (accountName.includes("bank")) {
                                    creditcard = 'fab fa-cc-visa'
                                }
                            }
                            let userObject = {};
                            userObject.name = key;
                            userObject.totalbalance = utilityService.modifynegativeCurrencyFormat(totalBalance);
                            userObject.card = creditcard;
                            return userObject;

                        });

                    }
                }
                let sortedArray = [];
                sortedArray = totalAmountCalculation.sort(function(a, b) {
                    return b.totalbalance - a.totalbalance;
                });
                let getTop4Data = _.take(sortedArray, 4);
                let newObjData = '';
                let newObjDataArr = [];

                templateObject.bankaccountdatarecord.set(getTop4Data);
            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.taccountvs1;
            let itemsAwaitingPaymentcount = [];
            let itemsOverduePaymentcount = [];
            let dataListAwaitingCust = {};
            let totAmount = 0;
            let totAmountOverDue = 0;
            let customerawaitingpaymentCount = '';
            var groups = {};
            let arrayDataUse = [];
            let totalAmountCalculation = '';
            for (let i = 0; i < useData.length; i++) {
                if ((useData[i].fields.AccountTypeName == 'CCARD') || (useData[i].fields.AccountTypeName == 'BANK')) {
                    arrayDataUse.push(useData[i].fields);
                    let filterDueDateData = _.filter(arrayDataUse, function(data) {
                        return data.AccountName
                    });
                    let groupData = _.omit(_.groupBy(filterDueDateData, 'AccountName'), ['']);
                    totalAmountCalculation = _.map(groupData, function(value, key) {
                        let totalBalance = 0;
                        let creditcard = 'fas fa-credit-card';
                        let id = 0;
                        for (let i = 0; i < value.length; i++) {
                            id = value[i].ID;
                            totalBalance += value[i].Balance;
                            let accountName = value[i].AccountName.toLowerCase();
                            if (accountName.includes("credit")) {
                                creditcard = 'fas fa-credit-card';
                            } else if (accountName.includes("mastercard")) {
                                creditcard = 'fab fa-cc-mastercard'
                            } else if (accountName.includes("bank")) {
                                creditcard = 'fab fa-cc-visa'
                            }
                        }
                        let userObject = {};
                        userObject.id = id;
                        userObject.name = key;
                        userObject.totalbalance = utilityService.modifynegativeCurrencyFormat(totalBalance);
                        userObject.card = creditcard;
                        return userObject;

                    });

                }
            }
            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function(a, b) {
                return b.totalbalance - a.totalbalance;
            });
            let getTop4Data = _.take(sortedArray, 4);
            let newObjData = '';
            let newObjDataArr = [];
            templateObject.bankaccountdatarecord.set(getTop4Data);

        }
    }).catch(function(err) {
        accountService.getAccountListVS1().then(function(data) {
            let arrayDataUse = [];
            let totalAmountCalculation = '';
            for (let i = 0; i < data.taccountvs1.length; i++) {
                if ((data.taccountvs1[i].AccountTypeName == 'CCARD') || (data.taccountvs1[i].AccountTypeName == 'BANK')) {
                    arrayDataUse.push(data.taccountvs1[i]);
                    let filterDueDateData = _.filter(arrayDataUse, function(data) {
                        return data.AccountName
                    });

                    let groupData = _.omit(_.groupBy(filterDueDateData, 'AccountName'), ['']);
                    totalAmountCalculation = _.map(groupData, function(value, key) {
                        let totalBalance = 0;
                        let creditcard = 'fas fa-credit-card';
                        for (let i = 0; i < value.length; i++) {
                            totalBalance += value[i].Balance;
                            let accountName = value[i].AccountName.toLowerCase();
                            if (accountName.includes("credit")) {
                                creditcard = 'fas fa-credit-card';
                            } else if (accountName.includes("mastercard")) {
                                creditcard = 'fab fa-cc-mastercard'
                            } else if (accountName.includes("bank")) {
                                creditcard = 'fab fa-cc-visa'
                            }
                        }
                        let userObject = {};
                        userObject.name = key;
                        userObject.totalbalance = utilityService.modifynegativeCurrencyFormat(totalBalance);
                        userObject.card = creditcard;
                        return userObject;

                    });

                }
            }
            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function(a, b) {
                return b.totalbalance - a.totalbalance;
            });
            let getTop4Data = _.take(sortedArray, 4);
            let newObjData = '';
            let newObjDataArr = [];

            templateObject.bankaccountdatarecord.set(getTop4Data);
        });
    });


    getVS1Data('TPurchaseOrderEx').then(function(dataObject) {
        if (dataObject.length == 0) {
            paymentService.getOverviewAwaitingSupplierDetails().then(function(data) {
                let itemsSuppAwaitingPaymentcount = [];
                let itemsSuppOverduePaymentcount = [];
                let dataListAwaitingSupp = {};
                let customerawaitingpaymentCount = '';
                let supptotAmount = 0;
                let supptotAmountOverDue = 0;
                for (let i = 0; i < data.tpurchaseorder.length; i++) {
                    dataListAwaitingSupp = {
                        id: data.tpurchaseorder[i].Id || '',
                    };
                    if (data.tpurchaseorder[i].TotalBalance > 0) {
                        // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                        supptotAmount += Number(data.tpurchaseorder[i].TotalBalance);
                        itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                        let date = new Date(data.tpurchaseorder[i].DueDate);
                        if (date < new Date()) {
                            supptotAmountOverDue += Number(data.tpurchaseorder[i].TotalBalance);
                            itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                        }
                    }

                }
                $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
                $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

                $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
                $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
                // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tpurchaseorderex;
            let itemsSuppAwaitingPaymentcount = [];
            let itemsSuppOverduePaymentcount = [];
            let dataListAwaitingSupp = {};
            let customerawaitingpaymentCount = '';
            let supptotAmount = 0;
            let supptotAmountOverDue = 0;
            for (let i = 0; i < useData.length; i++) {
                dataListAwaitingSupp = {
                    id: useData[i].Id || '',
                };
                if (useData[i].TotalBalance > 0) {
                    // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                    supptotAmount += Number(useData[i].TotalBalance);
                    itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                    let date = new Date(useData[i].DueDate);
                    if (date < new Date()) {
                        supptotAmountOverDue += Number(useData[i].TotalBalance);
                        itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                    }
                }

            }
            $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
            $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

            $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
            $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));

        }
    }).catch(function(err) {
        paymentService.getOverviewAwaitingSupplierDetails().then(function(data) {
            let itemsSuppAwaitingPaymentcount = [];
            let itemsSuppOverduePaymentcount = [];
            let dataListAwaitingSupp = {};
            let customerawaitingpaymentCount = '';
            let supptotAmount = 0;
            let supptotAmountOverDue = 0;
            for (let i = 0; i < data.tpurchaseorder.length; i++) {
                dataListAwaitingSupp = {
                    id: data.tpurchaseorder[i].Id || '',
                };
                if (data.tpurchaseorder[i].TotalBalance > 0) {
                    // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                    supptotAmount += Number(data.tpurchaseorder[i].TotalBalance);
                    itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                    let date = new Date(data.tpurchaseorder[i].DueDate);
                    if (date < new Date()) {
                        supptotAmountOverDue += Number(data.tpurchaseorder[i].TotalBalance);
                        itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                    }
                }

            }
            $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
            $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

            $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
            $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
            // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
        });
    });

    // $('#tblBankingOverview').DataTable();
    templateObject.getAllBankAccountData = function() {
        getVS1Data('TBankAccountReport').then(function(dataObject) {

            if (dataObject.length == 0) {
                paymentService.getAllBankAccountDetails().then(function(data) {
                    addVS1Data('TBankAccountReport', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineID = "";
                    for (let i = 0; i < data.tbankaccountreport.length; i++) {
                        let amount = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amount) || 0.00;
                        let amountInc = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amountinc) || 0.00;
                        let creditEx = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalCreditInc) || 0.00;
                        let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].OpeningBalanceInc) || 0.00;
                        let closingBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].ClosingBalanceInc) || 0.00;
                        let accountType = data.tbankaccountreport[i].Type || '';
                        // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                        // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                        // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                        if (data.tbankaccountreport[i].Type == "Un-Invoiced PO") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "PO") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Invoice") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "Credit") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Supplier Payment") {
                            lineID = data.tbankaccountreport[i].PaymentID;
                        } else if (data.tbankaccountreport[i].Type == "Bill") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Customer Payment") {
                            lineID = data.tbankaccountreport[i].PaymentID;
                        } else if (data.tbankaccountreport[i].Type == "Journal Entry") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "UnInvoiced SO") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "Cheque") {
                            if (Session.get('ERPLoggedCountry') == "Australia") {
                                accountType = "Cheque";
                            } else if (Session.get('ERPLoggedCountry') == "United States of America") {
                                accountType = "Check";
                            } else {
                                accountType = "Cheque";
                            }

                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Check") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        }


                        var dataList = {
                            id: lineID || '',
                            sortdate: data.tbankaccountreport[i].Date != '' ? moment(data.tbankaccountreport[i].Date).format("YYYY/MM/DD") : data.tbankaccountreport[i].Date,
                            paymentdate: data.tbankaccountreport[i].Date != '' ? moment(data.tbankaccountreport[i].Date).format("DD/MM/YYYY") : data.tbankaccountreport[i].Date,
                            customername: data.tbankaccountreport[i].ClientName || '',
                            paymentamount: amount || 0.00,
                            amountinc: amountInc || 0.00,
                            creditex: creditEx || 0.00,
                            openingbalance: openningBalance || 0.00,
                            closingbalance: closingBalance || 0.00,
                            accountnumber: data.tbankaccountreport[i].AccountNumber || '',
                            accounttype: data.tbankaccountreport[i].AccountType || '',
                            // balance: balance || 0.00,
                            bankaccount: data.tbankaccountreport[i].AccountName || '',
                            department: data.tbankaccountreport[i].ClassName || '',
                            chqrefno: data.tbankaccountreport[i].ChqRefNo || '',
                            receiptno: data.tbankaccountreport[i].ReceiptNo || '',
                            jobname: data.tbankaccountreport[i].jobname || '',
                            paymentmethod: data.tbankaccountreport[i].PaymentMethod || '',
                            type: accountType || '',
                            notes: data.tbankaccountreport[i].Notes || ''
                        };
                        if (data.tbankaccountreport[i].Type.replace(/\s/g, '') != "") {
                            dataTableList.push(dataList);
                        }

                    }


                    //awaitingpaymentCount
                    templateObject.datatablerecords.set(dataTableList);
                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblBankingOverview', function(error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#tblBankingOverview').DataTable({
                            // dom: 'lBfrtip',
                            "columnDefs": [{ "targets": 0, "type": "date" },
                                //   {"targets":1,
                                //   render: function(data, type, row) {
                                //     let getData = data.split('</span>');
                                //
                                //     return getData[1];
                                //   }
                                // }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Banking Overview - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Payment Overview',
                                    filename: "Banking Overview - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "Banking Overview - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: 25,
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "desc"]
                            ],
                            // "aaSorting": [[1,'desc']],
                            action: function() {
                                $('#tblBankingOverview').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function(oSettings) {
                                setTimeout(function() {
                                    MakeNegative();
                                }, 100);
                            },

                        }).on('page', function() {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);

                        }).on('column-reorder', function() {

                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblBankingOverview th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
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
                    $('#tblBankingOverview tbody').on('click', 'tr', function() {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        if ((listData) && (transactiontype)) {
                            if (transactiontype == "Un-Invoiced PO") {
                                Router.go('/purchaseordercard?id=' + listData);
                            } else if (transactiontype == "PO") {
                                Router.go('/purchaseordercard?id=' + listData);
                            } else if (transactiontype == "Invoice") {
                                Router.go('/invoicecard?id=' + listData);
                            } else if (transactiontype == "Credit") {
                                Router.go('/creditcard?id=' + listData);
                            } else if (transactiontype == "Supplier Payment") {
                                Router.go('/supplierpaymentcard?id=' + listData);
                            } else if (transactiontype == "Bill") {
                                Router.go('/billcard?id=' + listData);
                            } else if (transactiontype == "Customer Payment") {
                                Router.go('/paymentcard?id=' + listData);
                            } else if (transactiontype == "Journal Entry") {
                                Router.go('/journalentrycard?id=' + listData);
                            } else if (transactiontype == "UnInvoiced SO") {
                                Router.go('/salesordercard?id=' + listData);
                            } else if (transactiontype == "Cheque") {
                                Router.go('/chequecard?id=' + listData);
                            } else if (transactiontype == "Check") {
                                Router.go('/chequecard?id=' + listData);
                            } else {
                                Router.go('/chequelist');
                            }

                        }
                    });

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tbankaccountreport;
                let lineItems = [];
                let lineItemObj = {};
                let lineID = "";
                for (let i = 0; i < useData.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(useData[i].Amount) || 0.00;
                    let amountInc = utilityService.modifynegativeCurrencyFormat(useData[i].Amountinc) || 0.00;
                    let creditEx = utilityService.modifynegativeCurrencyFormat(useData[i].TotalCreditInc) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(useData[i].OpeningBalanceInc) || 0.00;
                    let closingBalance = utilityService.modifynegativeCurrencyFormat(useData[i].ClosingBalanceInc) || 0.00;
                    let accountType = useData[i].Type || '';
                    // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                    if (useData[i].Type == "Un-Invoiced PO") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "PO") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Invoice") {
                        lineID = useData[i].SaleID;
                    } else if (useData[i].Type == "Credit") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Supplier Payment") {
                        lineID = useData[i].PaymentID;
                    } else if (useData[i].Type == "Bill") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Customer Payment") {
                        lineID = useData[i].PaymentID;
                    } else if (useData[i].Type == "Journal Entry") {
                        lineID = useData[i].SaleID;
                    } else if (useData[i].Type == "UnInvoiced SO") {
                        lineID = useData[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Cheque") {
                        if (Session.get('ERPLoggedCountry') == "Australia") {
                            accountType = "Cheque";
                        } else if (Session.get('ERPLoggedCountry') == "United States of America") {
                            accountType = "Check";
                        } else {
                            accountType = "Cheque";
                        }

                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Check") {
                        lineID = useData[i].PurchaseOrderID;
                    }


                    var dataList = {
                        id: lineID || '',
                        sortdate: useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date,
                        paymentdate: useData[i].Date != '' ? moment(useData[i].Date).format("DD/MM/YYYY") : useData[i].Date,
                        customername: useData[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        amountinc: amountInc || 0.00,
                        creditex: creditEx || 0.00,
                        openingbalance: openningBalance || 0.00,
                        closingbalance: closingBalance || 0.00,
                        accountnumber: useData[i].AccountNumber || '',
                        accounttype: useData[i].AccountType || '',
                        // balance: balance || 0.00,
                        bankaccount: useData[i].AccountName || '',
                        department: useData[i].ClassName || '',
                        chqrefno: useData[i].ChqRefNo || '',
                        receiptno: useData[i].ReceiptNo || '',
                        jobname: useData[i].jobname || '',
                        paymentmethod: useData[i].PaymentMethod || '',
                        type: accountType || '',
                        notes: useData[i].Notes || ''
                    };
                    if (useData[i].Type.replace(/\s/g, '') != "") {
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblBankingOverview', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblBankingOverview').DataTable({
                        // dom: 'lBfrtip',
                        "columnDefs": [{ "targets": 0, "type": "date" },
                            //   {"targets":1,
                            //   render: function(data, type, row) {
                            //     let getData = data.split('</span>');
                            //
                            //     return getData[1];
                            //   }
                            // }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: [':visible:not(.colPaymentDate)']
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Payment Overview',
                                filename: "Banking Overview - " + moment().format(),
                                exportOptions: {
                                    columns: [':visible'],
                                    stripHtml: false
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
//                                    columns: ['.colSortDate',':visible:not(.colPaymentDate)']
                                    columns: [':visible'],
                                    stripHtml: true
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblBankingOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblBankingOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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
                $('#tblBankingOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype == "Un-Invoiced PO") {
                            Router.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "PO") {
                            Router.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "Invoice") {
                            Router.go('/invoicecard?id=' + listData);
                        } else if (transactiontype == "Credit") {
                            Router.go('/creditcard?id=' + listData);
                        } else if (transactiontype == "Supplier Payment") {
                            Router.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype == "Bill") {
                            Router.go('/billcard?id=' + listData);
                        } else if (transactiontype == "Customer Payment") {
                            Router.go('/paymentcard?id=' + listData);
                        } else if (transactiontype == "Journal Entry") {
                            Router.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype == "UnInvoiced SO") {
                            Router.go('/salesordercard?id=' + listData);
                        } else if (transactiontype == "Cheque") {
                            Router.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Check") {
                            Router.go('/chequecard?id=' + listData);
                        } else {
                            Router.go('/chequelist');
                        }

                    }
                });

            }
        }).catch(function(err) {
            paymentService.getAllBankAccountDetails().then(function(data) {
                addVS1Data('TBankAccountReport', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                let lineID = "";
                for (let i = 0; i < data.tbankaccountreport.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amount) || 0.00;
                    let amountInc = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amountinc) || 0.00;
                    let creditEx = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalCreditInc) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].OpeningBalanceInc) || 0.00;
                    let closingBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].ClosingBalanceInc) || 0.00;
                    let accountType = data.tbankaccountreport[i].Type || '';
                    // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                    if (data.tbankaccountreport[i].Type == "Un-Invoiced PO") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "PO") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Invoice") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Credit") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Supplier Payment") {
                        lineID = data.tbankaccountreport[i].PaymentID;
                    } else if (data.tbankaccountreport[i].Type == "Bill") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Customer Payment") {
                        lineID = data.tbankaccountreport[i].PaymentID;
                    } else if (data.tbankaccountreport[i].Type == "Journal Entry") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "UnInvoiced SO") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Cheque") {
                        if (Session.get('ERPLoggedCountry') == "Australia") {
                            accountType = "Cheque";
                        } else if (Session.get('ERPLoggedCountry') == "United States of America") {
                            accountType = "Check";
                        } else {
                            accountType = "Cheque";
                        }

                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Check") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    }


                    var dataList = {
                        id: lineID || '',
                        sortdate: data.tbankaccountreport[i].Date != '' ? moment(data.tbankaccountreport[i].Date).format("YYYY/MM/DD") : data.tbankaccountreport[i].Date,
                        paymentdate: data.tbankaccountreport[i].Date != '' ? moment(data.tbankaccountreport[i].Date).format("DD/MM/YYYY") : data.tbankaccountreport[i].Date,
                        customername: data.tbankaccountreport[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        amountinc: amountInc || 0.00,
                        creditex: creditEx || 0.00,
                        openingbalance: openningBalance || 0.00,
                        closingbalance: closingBalance || 0.00,
                        accountnumber: data.tbankaccountreport[i].AccountNumber || '',
                        accounttype: data.tbankaccountreport[i].AccountType || '',
                        // balance: balance || 0.00,
                        bankaccount: data.tbankaccountreport[i].AccountName || '',
                        department: data.tbankaccountreport[i].ClassName || '',
                        chqrefno: data.tbankaccountreport[i].ChqRefNo || '',
                        receiptno: data.tbankaccountreport[i].ReceiptNo || '',
                        jobname: data.tbankaccountreport[i].jobname || '',
                        paymentmethod: data.tbankaccountreport[i].PaymentMethod || '',
                        type: accountType || '',
                        notes: data.tbankaccountreport[i].Notes || ''
                    };
                    if (data.tbankaccountreport[i].Type.replace(/\s/g, '') != "") {
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblBankingOverview', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblBankingOverview').DataTable({
                        // dom: 'lBfrtip',
                        "columnDefs": [{ "targets": 0, "type": "date" },
                            //   {"targets":1,
                            //   render: function(data, type, row) {
                            //     let getData = data.split('</span>');
                            //
                            //     return getData[1];
                            //   }
                            // }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Payment Overview',
                                filename: "Banking Overview - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: 25,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblBankingOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblBankingOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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
                $('#tblBankingOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype == "Un-Invoiced PO") {
                            Router.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "PO") {
                            Router.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "Invoice") {
                            Router.go('/invoicecard?id=' + listData);
                        } else if (transactiontype == "Credit") {
                            Router.go('/creditcard?id=' + listData);
                        } else if (transactiontype == "Supplier Payment") {
                            Router.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype == "Bill") {
                            Router.go('/billcard?id=' + listData);
                        } else if (transactiontype == "Customer Payment") {
                            Router.go('/paymentcard?id=' + listData);
                        } else if (transactiontype == "Journal Entry") {
                            Router.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype == "UnInvoiced SO") {
                            Router.go('/salesordercard?id=' + listData);
                        } else if (transactiontype == "Cheque") {
                            Router.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Check") {
                            Router.go('/chequecard?id=' + listData);
                        } else {
                            Router.go('/chequelist');
                        }

                    }
                });

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }
    templateObject.getAllBankAccountData();

});

Template.bankingoverview.events({
    'click .btnRefresh': function() {

        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();

        sideBarService.getAllBankAccountDetails().then(function(data) {
            addVS1Data('TBankAccountReport', JSON.stringify(data)).then(function(datareturn) {
              location.reload();
            }).catch(function(err) {
              location.reload();
            });
        }).catch(function(err) {
          location.reload();
        });
        //templateObject.getAllBankAccountData();
    },
    'click #newSalesOrder': function(event) {
        Router.go('/salesordercard');
    },
    'click .btnNewDepositEnrty': function(event) {
        Router.go('/depositcard');
    },
    'click .btnCustomerlist': function(event) {
        Router.go('/customerpayment');
    },
    'click #newInvoice': function(event) {
        Router.go('/invoicecard');
    },
    'click .btnSupplierPaymentList': function(event) {
        Router.go('/supplierpayment');
    },
    'click #newQuote': function(event) {
        Router.go('/quotecard');
    },
    'click .QuoteList': function(event) {
        Router.go('/quoteslist');
    },
    'click .chkDatatable': function(event) {
        var columns = $('#tblBankingOverview th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblBankingOverview' });
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
    'click .saveTable': function(event) {
        let lineItems = [];
        //let datatable =$('#tblBankingOverview').DataTable();
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
        //datatable.state.save();

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblBankingOverview' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblBankingOverview',
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
                        PrefGroup: 'salesform',
                        PrefName: 'tblBankingOverview',
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

        //Meteor._reload.reload();
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblBankingOverview').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblBankingOverview th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblBankingOverview th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
    'click #exportbtn': function() {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBankingOverview_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBankingOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .openaccountpayable': function() {
        Router.go('/chequelist');
    },
    'click .openaccountreceivable': function(event) {
        let id = $(event.target).closest('.openaccountreceivable').attr('id');
        Router.go('/accounttransactions?id=' + id);
    },
    'click .btnPrinStatment': function() {
        Router.go('/statementlist');
    },
    'click .btnStockAdjustment': function() {
        Router.go('/chequelist');
    },
    'click .btnReconcile': function() {
        //Router.go('/bankrecon');
        window.open('/bankrecon', '_self');
    },
    'click .btnReconList': function() {
        Router.go('/reconciliationlist');
    }
});
Template.bankingoverview.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.paymentdate == 'NA') {
                return 1;
            } else if (b.paymentdate == 'NA') {
                return -1;
            }
            return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblBankingOverview' });
    },
    formname: () => {
        return chequeSpelling;
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    bankaccountdatarecord: () => {
        return Template.instance().bankaccountdatarecord.get();
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
