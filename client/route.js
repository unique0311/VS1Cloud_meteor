FlowRouter.notFound = {
  action() {
    BlazeLayout.render( 'layoutlogin', { yield: 'notFound' } );
  }
};


FlowRouter.route('/', {
    name: 'vs1login',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'vs1login' } );
    }
});

FlowRouter.route('/vs1greentracklogin', {
  name: 'vs1greentracklogin',
  action() {
    BlazeLayout.render( 'layoutlogin', { yield: 'vs1greentracklogin' } );
  }
});

FlowRouter.route('/vs1check', {
  name: 'vs1check',
  action() {
    BlazeLayout.render( 'layoutlogin', { yield: 'vs1check' } );
  }
});

FlowRouter.route('/accounttransactions', {
    name: 'accounttransactions',
    action() {
      BlazeLayout.render( 'layout', { yield: 'accounttransactions' } );
    }
});

FlowRouter.route('/testlogin', {
    name: 'testlogin',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'testlogin' } );
    }
});

FlowRouter.route('/forgot', {
    name: 'forgotforgot',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'forgotforgot' } );
    }
});
FlowRouter.route('/register', {
    name: 'register',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'register' } );
    }
});

FlowRouter.route('/registerdb', {
    name: 'registerdb',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'registerdb' } );
    }
});

FlowRouter.route('/binnypurchasedb', {
    name: 'binnypurchasedb',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'binnypurchasedb' } );
    }
});

FlowRouter.route('/packagerenewal', {
    name: 'packagerenewal',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'packagerenewal' } );
    }
});

FlowRouter.route('/simonpurchasedb', {
    name: 'simonpurchasedb',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'simonpurchasedb' } );
    }
});

FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'dashboard' } );
    }
});

FlowRouter.route('/appointments', {
    name: 'appointments',
    action() {
      BlazeLayout.render( 'layout', { yield: 'appointments' } );
    }
});

FlowRouter.route('/appointmenttimelist', {
    name: 'appointmenttimelist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'appointmenttimelist' } );
    }
});

FlowRouter.route('/newappointments', {
    name: 'newappointments',
    action() {
      BlazeLayout.render( 'layout', { yield: 'newappointments' } );
    }
});

/* Sales */
FlowRouter.route('/salesordercard', {
    name: 'new_salesorder',
    action() {
      BlazeLayout.render( 'layout', { yield: 'new_salesorder' } );
    }
});

FlowRouter.route('/invoicecard', {
    name: 'new_invoice',
    action() {
      BlazeLayout.render( 'layout', { yield: 'new_invoice' } );
    }
});

FlowRouter.route('/refundcard', {
    name: 'refundcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'refundcard' } );
    }
});



FlowRouter.route('/quotecard', {
    name: 'new_quote',
    action() {
      BlazeLayout.render( 'layout', { yield: 'new_quote' } );
    }
});

FlowRouter.route('/salesorderslist', {
    name: 'salesorderslist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'salesorderslist' } );
    }
});

FlowRouter.route('/invoicelist', {
    name: 'invoicelist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'invoicelist' } );
    }
});

FlowRouter.route('/invoicelistBO', {
    name: 'invoicelistBO',
    action() {
      BlazeLayout.render( 'layout', { yield: 'invoicelistBO' } );
    }
});
FlowRouter.route('/quoteslist', {
    name: 'quoteslist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'quoteslist' } );
    }
});

/*Overviews*/
FlowRouter.route('/accountsoverview', {
    name: 'accountsoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'accountsoverview' } );
    }
});

FlowRouter.route('/payrolloverview', {
    name: 'payrolloverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'payrolloverview' } );
    }
});

FlowRouter.route('/purchasesoverview', {
    name: 'purchasesoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchasesoverview' } );
    }
});

FlowRouter.route('/salesoverview', {
    name: 'salesoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'salesoverview' } );
    }
});

FlowRouter.route('/contactoverview', {
    name: 'contactoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'contactoverview' } );
    }
});

FlowRouter.route('/billcard', {
    name: 'billcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'billcard' } );
    }
});

FlowRouter.route('/chequecard', {
    name: 'chequecard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'chequecard' } );
    }
});

/* Contacts */
FlowRouter.route('/customerscard', {
    name: 'customerscard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'customerscard' } );
    }
});

FlowRouter.route('/employeescard', {
    name: 'employeescard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'employeescard' } );
    }
});

FlowRouter.route('/supplierscard', {
    name: 'supplierscard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierscard' } );
    }
});

FlowRouter.route('/customerlist', {
    name: 'customerlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'customerlist' } );
    }
});

FlowRouter.route('/invoiceemail', {
    name: 'invoiceemail',
    action() {
      BlazeLayout.render( 'layout', { yield: 'invoiceemail' } );
    }
});

FlowRouter.route('/joblist', {
    name: 'joblist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'joblist' } );
    }
});

FlowRouter.route('/statementlist', {
    name: 'statementlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'statementlist' } );
    }
});



FlowRouter.route('/employeelist', {
    name: 'employeelist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'employeelist' } );
    }
});

FlowRouter.route('/supplierlist', {
    name: 'supplierlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierlist' } );
    }
});
/* Chart of Accounts */
FlowRouter.route('/chartofaccounts', {
    name: 'chartofaccounts',
    action() {
      BlazeLayout.render( 'layout', { yield: 'chartofaccounts' } );
    }
});

/* Expense Claim */
FlowRouter.route('/expenseclaims', {
    name: 'expenseclaims',
    action() {
      BlazeLayout.render( 'layout', { yield: 'expenseclaims' } );
    }
});

/* Purchases */
FlowRouter.route('/purchaseorderlist', {
    name: 'purchaseorderlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchaseorderlist' });
    }
});

FlowRouter.route('/purchaseorderlistBO', {
    name: 'purchaseorderlistBO',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchaseorderlistBO' } );
    }
});

FlowRouter.route('/purchaseordercard', {
    name: 'purchaseordercard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchaseordercard'} );
    }
});

FlowRouter.route('/billlist', {
    name: 'billlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'billlist' } );
    }
});

FlowRouter.route('/chequelist', {
    name: 'chequelist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'chequelist' } );
    }
});

FlowRouter.route('/creditlist', {
    name: 'creditlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'creditlist' } );
    }
});

/* Inventory */
FlowRouter.route('/inventorylist', {
    name: 'inventorylist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'inventorylist' } );
    }
});

FlowRouter.route('/productlist', {
    name: 'productlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'productlist' } );
    }
});

// FlowRouter.route('/forgotpassword');
FlowRouter.route('/forgotpassword', {
    name: 'forgotpassword',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'forgotpassword' } );
    }
});
// FlowRouter.route('/Password/Reset', function(){
//     this.render('resetpassword');
// });

FlowRouter.route('/resetpassword', {
    name: 'resetpassword',
    action() {
      BlazeLayout.render( 'layoutlogin', { yield: 'resetpassword' } );
    }
});

// FlowRouter.route('/viewpayment', {
//     name: 'viewpayment',
//     template: 'viewpayment',
//     layoutTemplate: 'layout'
// });

/* Payments */
FlowRouter.route('/paymentcard', {
    name: 'paymentcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'paymentcard' } );
    }
});

FlowRouter.route('/supplierpaymentcard', {
    name: 'supplierpaymentcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierpaymentcard' } );
    }
});



/* Settings */
FlowRouter.route('/settings', {
    name: 'settings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'settings' } );
    }
});

FlowRouter.route('/organisationsettings', {
    name: 'organisationsettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'organisationsettings' } );
    }
});

FlowRouter.route('/accesslevel', {
    name: 'accesslevel',
    action() {
      BlazeLayout.render( 'layout', { yield: 'accesslevel' } );
    }
});

FlowRouter.route('/companyappsettings', {
    name: 'companyappsettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'companyappsettings' } );
    }
});

/* Reports */
FlowRouter.route('/balancesheetreport', {
    name: 'balancesheetreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'balancesheetreport' } );
    }
});

FlowRouter.route('/balancetransactionlist', {
    name: 'balancetransactionlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'balancetransactionlist' } );
    }
});

FlowRouter.route('/allreports', {
    name: 'allreports',
    action() {
      BlazeLayout.render( 'layout', { yield: 'allreports' } );
    }
});

FlowRouter.route('/productsalesreport', {
    name: 'productsalesreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'productsalesreport' } );
    }
});

FlowRouter.route('/salesreport', {
    name: 'salesreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'salesreport' } );
    }
});


FlowRouter.route('/salessummaryreport', {
    name: 'salessummaryreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'salessummaryreport' } );
    }
});


FlowRouter.route('/profitlossreport', {
    name: 'profitlossreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'profitlossreport' } );
    }
});

FlowRouter.route('/taxsummaryreport', {
    name: 'taxsummaryreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'taxsummaryreport' } );
    }
});

FlowRouter.route('/productview', {
    name: 'productview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'productview' } );
    }
});

FlowRouter.route('/paymentoverview', {
    name: 'paymentoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'paymentoverview' } );
    }
});

FlowRouter.route('/bankingoverview', {
    name: 'bankingoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'bankingoverview' } );
    }
});

FlowRouter.route('/reconciliation', {
    name: 'reconciliation',
    action() {
      BlazeLayout.render( 'layout', { yield: 'reconciliation' } );
    }
});

FlowRouter.route('/reconciliationlist', {
    name: 'reconciliationlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'reconciliationlist' } );
    }
});

FlowRouter.route('/appointmentlist', {
    name: 'appointmentlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'appointmentlist' } );
    }
});

FlowRouter.route('/customerawaitingpayments', {
    name: 'customerawaitingpayments',
    action() {
      BlazeLayout.render( 'layout', { yield: 'customerawaitingpayments' } );
    }
});

FlowRouter.route('/customerpayment', {
    name: 'customerpayment',
    action() {
      BlazeLayout.render( 'layout', { yield: 'customerpayment' } );
    }
});

FlowRouter.route('/supplierawaitingpurchaseorder', {
    name: 'supplierawaitingpurchaseorder',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierawaitingpurchaseorder' } );
    }
});

FlowRouter.route('/supplierawaitingbills', {
    name: 'supplierawaitingbills',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierawaitingbills' });
    }
});

FlowRouter.route('/supplierbills', {
    name: 'supplierbills',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierbills' });
    }
});

FlowRouter.route('/supplierpayment', {
    name: 'supplierpayment',
    action() {
      BlazeLayout.render( 'layout', { yield: 'supplierpayment' });
    }
});

FlowRouter.route('/formnewbill', {
    name: 'formnewbill',
    action() {
      BlazeLayout.render( 'layout', { yield: 'formnewbill' });
    }
});

FlowRouter.route('/creditcard', {
    name: 'creditcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'creditcard' });
    }
});

FlowRouter.route('/agedpayables', {
    name: 'agedpayables',
    action() {
      BlazeLayout.render( 'layout', { yield: 'agedpayables' });
    }
});

FlowRouter.route('/agedpayablessummary', {
    name: 'agedpayablessummary',
    action() {
      BlazeLayout.render( 'layout', { yield: 'agedpayablessummary' });
    }
});

FlowRouter.route('/agedreceivables', {
    name: 'agedreceivables',
    action() {
      BlazeLayout.render( 'layout', { yield: 'agedreceivables' });
    }
});

FlowRouter.route('/agedreceivablessummary', {
    name: 'agedreceivablessummary',
    action() {
      BlazeLayout.render( 'layout', { yield: 'agedreceivablessummary' });
    }
});
// Here
FlowRouter.route('/trialbalance', {
    name: 'trialbalance',
    action() {
      BlazeLayout.render( 'layout', { yield: 'trialbalance' });
    }
});

FlowRouter.route('/currenciesSettings', {
    name: 'currenciesSettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'currenciesSettings' });
    }
});

FlowRouter.route('/taxratesettings', {
    name: 'taxRatesSettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'taxRatesSettings' });
    }
});

FlowRouter.route('/generalledger', {
    name: 'generalledger',
    action() {
      BlazeLayout.render( 'layout', { yield: 'generalledger' });
    }
});

FlowRouter.route('/1099report', {
    name: 'report1099',
    action() {
      BlazeLayout.render( 'layout', { yield: 'report1099' });
    }
});

FlowRouter.route('/printstatement', {
    name: 'printstatement',
    action() {
      BlazeLayout.render( 'layout', { yield: 'printstatement' });
    }
});

FlowRouter.route('/purchasesreport', {
    name: 'purchasesreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchasesreport' });
    }
});

FlowRouter.route('/purchasesummaryreport', {
    name: 'purchasesummaryreport',
    action() {
      BlazeLayout.render( 'layout', { yield: 'purchasesummaryreport' });
    }
});

FlowRouter.route('/departmentSettings', {
    name: 'departmentSettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'departmentSettings' });
    }
});

FlowRouter.route('/clienttypesettings', {
    name: 'clienttypesettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'clienttypesettings' });
    }
});

FlowRouter.route('/paymentmethodSettings', {
    name: 'paymentmethodSettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'paymentmethodSettings' });
    }
});

FlowRouter.route('/termsettings', {
    name: 'termsettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'termsettings' });
    }
});

FlowRouter.route('/stockAdjustmentOverview', {
    name: 'stockadjustmentoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stockadjustmentoverview' });
    }
});
FlowRouter.route('/stockadjustmentcard', {
    name: 'stockadjustmentcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stockadjustmentcard' });
    }
});
FlowRouter.route('/journalentrycard', {
    name: 'journalentrycard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'journalentrycard' });
    }
});
FlowRouter.route('/journalentrylist', {
    name: 'journalentrylist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'journalentrylist' });
    }
});
FlowRouter.route('/timesheet', {
    name: 'timesheet',
    action() {
      BlazeLayout.render( 'layout', { yield: 'timesheet' });
    }
});

FlowRouter.route('/squareapi', {
    name: 'squareapi',
    action() {
      BlazeLayout.render( 'layout', { yield: 'squareapi' });
    }
});

FlowRouter.route('/paychexapi', {
    name: 'paychexapi',
    action() {
      BlazeLayout.render( 'layout', { yield: 'paychexapi' });
    }
});

FlowRouter.route('/adpapi', {
    name: 'adpapi',
    action() {
      BlazeLayout.render( 'layout', { yield: 'adpapi' });
    }
});

FlowRouter.route('/stsdashboard', {
    name: 'stsdashboard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsdashboard' });
    }
});

FlowRouter.route('/stsplants', {
    name: 'stsplants',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsplants' });
    }
});

FlowRouter.route('/stsharvests', {
    name: 'stsharvests',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsharvests' });
    }
});

FlowRouter.route('/stspackages', {
    name: 'stspackages',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stspackages' });
    }
});

FlowRouter.route('/stsoverviews', {
    name: 'stsoverviews',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsoverviews' });
    }
});

FlowRouter.route('/stscreateplantings', {
    name: 'stscreateplantings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreateplantings' });
    }
});

FlowRouter.route('/stschangegrowthphase', {
    name: 'stschangegrowthphase',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stschangegrowthphase' });
    }
});

FlowRouter.route('/stsrecordadditives', {
    name: 'stsrecordadditives',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsrecordadditives' });
    }
});

FlowRouter.route('/stschangeroom', {
    name: 'stschangeroom',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stschangeroom' });
    }
});

FlowRouter.route('/stsmanicureplants', {
    name: 'stsmanicureplants',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsmanicureplants' });
    }
});

FlowRouter.route('/stsdestroyplants', {
    name: 'stsdestroyplants',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsdestroyplants' });
    }
});

FlowRouter.route('/ststaghistory', {
    name: 'ststaghistory',
    action() {
      BlazeLayout.render( 'layout', { yield: 'ststaghistory' });
    }
});

FlowRouter.route('/stscreateharvests', {
    name: 'stscreateharvests',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreateharvests' });
    }
});

FlowRouter.route('/stsharvestlist', {
    name: 'stsharvestlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsharvestlist' });
    }
});

FlowRouter.route('/stscreatepackagefromharvest', {
    name: 'stscreatepackagefromharvest',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreatepackagefromharvest' });
    }
});

FlowRouter.route('/stscreatepackagefrompackages', {
    name: 'stscreatepackagefrompackages',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreatepackagefrompackages' });
    }
});

FlowRouter.route('/stscreatepackagesfromharvest', {
    name: 'stscreatepackagesfromharvest',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreatepackagesfromharvest' });
    }
});

FlowRouter.route('/stspackagelist', {
    name: 'stspackagelist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stspackagelist' });
    }
});

FlowRouter.route('/stsactivitylog', {
    name: 'stsactivitylog',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsactivitylog' });
    }
});

FlowRouter.route('/ststagorderlist', {
    name: 'ststagorderlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'ststagorderlist' });
    }
});

FlowRouter.route('/stsactiveinventory', {
    name: 'stsactiveinventory',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsactiveinventory' });
    }
});

FlowRouter.route('/stssettings', {
    name: 'stssettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stssettings' });
    }
});

FlowRouter.route('/ststransfers', {
    name: 'ststransfers',
    action() {
      BlazeLayout.render( 'layout', { yield: 'ststransfers' });
    }
});

FlowRouter.route('/stscreatetransfer', {
    name: 'stscreatetransfer',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stscreatetransfer' });
    }
});

FlowRouter.route('/stsaddtransfercontent', {
    name: 'stsaddtransfercontent',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsaddtransfercontent' });
    }
});

FlowRouter.route('/ststransferhistory', {
    name: 'ststransferhistory',
    action() {
      BlazeLayout.render( 'layout', { yield: 'ststransferhistory' });
    }
});

FlowRouter.route('/stsprintlabels', {
    name: 'stsprintlabels',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsprintlabels' });
    }
});

FlowRouter.route('/stslocationoverview', {
    name: 'stslocationoverview',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stslocationoverview' });
    }
});

FlowRouter.route('/stsoutgoingorders', {
    name: 'stsoutgoingorders',
    action() {
      BlazeLayout.render( 'layout', { yield: 'stsoutgoingorders' });
    }
});

FlowRouter.route('/featureallocation', {
    name: 'featureallocation',
    action() {
      BlazeLayout.render( 'layout', { yield: 'featureallocation' });
    }
});

FlowRouter.route('/registersts', {
    name: 'registersts',
    action() {
      BlazeLayout.render( 'layout', { yield: 'registersts' });
    }
});

FlowRouter.route('/bankrecon', {
    name: 'bankrecon',
    action() {
      BlazeLayout.render( 'layout', { yield: 'bankrecon' });
    }
});

FlowRouter.route('/depositcard', {
    name: 'depositcard',
    action() {
      BlazeLayout.render( 'layout', { yield: 'depositcard' });
    }
});

FlowRouter.route('/depositlist', {
    name: 'depositlist',
    action() {
      BlazeLayout.render( 'layout', { yield: 'depositlist' });
    }
});

FlowRouter.route('/linktrueerp', {
    name: 'linktrueerp',
    action() {
      BlazeLayout.render( 'layout', { yield: 'linktrueerp' });
    }
});

FlowRouter.route('/subscriptionSettings', {
    name: 'subscriptionSettings',
    action() {
      BlazeLayout.render( 'layout', { yield: 'subscriptionSettings' });
    }
});

FlowRouter.route('/employeetimeclock', {
    name: 'employeetimeclock',
    action() {
      BlazeLayout.render( 'layout', { yield: 'employeetimeclock' });
    }
});

FlowRouter.route('/vs1shipping', {
    name: 'vs1shipping',
    action() {
      BlazeLayout.render( 'layout', { yield: 'vs1shipping' });
    }
});

FlowRouter.route('/shippingdocket', {
    name: 'shippingdocket',
    action() {
      BlazeLayout.render( 'layout', { yield: 'shippingdocket' });
    }
});
