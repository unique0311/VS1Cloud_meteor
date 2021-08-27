  Barcode_SepChar = '-';

  Barcode_Prefix_Employee     = 'EMP';
  Barcode_Prefix_Sale         = 'S';
  Barcode_Prefix_SalesLine    = 'SL';
  Barcode_Prefix_UOMSalesLine = 'USL';
  Barcode_Prefix_DisPatch     = 'DIS';
  Barcode_StartNew            = 'START-NEW';
  Barcode_Prefix_PQABATCH     = 'PBA';
  Barcode_Prefix_PQASN        = 'PSN';
  Barcode_Prefix_PQACOMB      = 'PCOMB';
  Barcode_Prefix_BXR          = 'BXR'; //Barcode x ref -> tblBarcodexRef
  Barcode_Prefix_SLBatch      = 'SLB';
  Barcode_Prefix_Customer     = 'C';

 licenceIPAddress = "login.vs1cloud.com"; //165.228.147.127
  //Global Declaration
  /* VS1 SandBox Details */
  URLRequest = 'https://'; //non ssl server
  checkSSLPorts = '4433'; //Non SSL Port
  vs1loggedDatatbase = 'vs1_sandbox_license'; //SandBox databaseName

  ERPDatabaseIPAdderess = "www.login.vs1cloud.com"; //www.login.vs1cloud.com
  ReplicaERPDatabaseIPAdderess = "replica.vs1cloud.com"+ ':' + '4434' + '/' + 'erpapi' + '/'; //www.login.vs1cloud.com

  stripeGlobalURL= "https://www.depot.vs1cloud.com/stripe-sandbox/"; //https://www.depot.vs1cloud.com/stripe-sandbox/
  //vs1loggedDatatbase = 'vs1_sandbox_license'; //Normal databaseName

  /* VS1 Production Details */
  //vs1loggedDatatbase = 'vs1_production_license'; //Production databaseName
  //checkSSLPorts = '4433'; //Use SSL Port
  //URLRequest = 'https://'; //ssl server

loggedserverIP = localStorage.getItem('mainEIPAddress');
loggedserverPort = localStorage.getItem('mainEPort');
Currency = Session.get('ERPCurrency') || '$';
CountryAbbr = Session.get('ERPCountryAbbr');
addExtraUserPrice = 0;
// loggedCompany = Session.get('EDatabase');
loggedCompany = Session.get('vs1companyName');
defaultDept = Session.get('ERPDefaultDepartment');
defaultUOM = Session.get('ERPDefaultUOM');
isModuleGreenTrack = Session.get('CloudSeedToSaleLicence');
isPurchasedTrueERPModule = localStorage.getItem('isPurchasedTrueERPModule') || false;
bsbCodeName = "Branch Code";
reportsloadMonths = 1; //This load for 1 months
initialDataLoad = 25; //This load 25 for transaction list data
initialBaseDataLoad = 25; //This load for 100 data base lists
if(Session.get('ERPLoggedCountry') == "Australia"){
  // Session.setPersistent('ERPTaxCodePurchaseInc', "NCG");
  // Session.setPersistent('ERPTaxCodeSalesInc', "GST");
  loggedTaxCodePurchaseInc = Session.get('ERPTaxCodePurchaseInc') || "NCG";
  loggedTaxCodeSalesInc = Session.get('ERPTaxCodeSalesInc') || "GST";
  LoggedCountry = Session.get('ERPLoggedCountry');
  chequeSpelling = "Cheque";
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+152;
  }else{
    addExtraUserPrice = Currency+45;
  }

  bsbCodeName = "BSB (Branch Number)";
}else if(Session.get('ERPLoggedCountry') == "United States of America"){
  // Session.setPersistent('ERPTaxCodePurchaseInc', "NT");
  // Session.setPersistent('ERPTaxCodeSalesInc', "NT");
  LoggedCountry = "United States";
  loggedTaxCodePurchaseInc = Session.get('ERPTaxCodePurchaseInc') || "NT";
  loggedTaxCodeSalesInc = Session.get('ERPTaxCodeSalesInc') || "NT";
  chequeSpelling = "Check";
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+110;
  }else{
  addExtraUserPrice = Currency+35;
   }
}else{
  loggedTaxCodePurchaseInc = Session.get('ERPTaxCodePurchaseInc') || "NT";
  loggedTaxCodeSalesInc = Session.get('ERPTaxCodeSalesInc') || "NT";
  chequeSpelling = "Cheque";
  LoggedCountry = Session.get('ERPLoggedCountry');
}

if(Session.get('ERPLoggedCountry') == "South Africa"){
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+1660;
  }else{
  addExtraUserPrice = Currency+480;
  }
}else if((Session.get('ERPLoggedCountry') == "Canada")){
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+140;
  }else{
  addExtraUserPrice = Currency+40;
  }
}else if((Session.get('ERPLoggedCountry') == "New Zealand")){
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+160;
  }else{
  addExtraUserPrice = Currency+40;
   }
}else if(Session.get('ERPLoggedCountry') == "United Arab Emirates"){
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = '$'+110;
  }else{
  addExtraUserPrice = '$'+35;
    }
}else if(Session.get('ERPLoggedCountry') == "United Kingdom"){
  if(isPurchasedTrueERPModule === 'true'){
    addExtraUserPrice = Currency+80;
  }else{
  addExtraUserPrice = Currency+25;
   }
}

//loggedTaxCodePurchaseInc = Session.get('ERPTaxCodePurchaseInc');
//loggedTaxCodeSalesInc = Session.get('ERPTaxCodeSalesInc');
