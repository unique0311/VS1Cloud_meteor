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

  //Global Declaration
  /* VS1 SandBox Details */
  URLRequest = 'http://'; //non ssl server
  checkSSLPorts = '3420'; //Non SSL Port
  vs1loggedDatatbase = 'vs1_sandbox_license'; //SandBox databaseName
  //vs1loggedDatatbase = 'Vs1_license'; //Normal databaseName

  /* VS1 Production Details */
  //vs1loggedDatatbase = 'vs1_production_license'; //Production databaseName
  //checkSSLPorts = '443'; //Use SSL Port
  //URLRequest = 'https://'; //ssl server

loggedserverIP = localStorage.getItem('mainEIPAddress');
loggedserverPort = localStorage.getItem('mainEPort');
Currency = Session.get('ERPCurrency') || '$';
CountryAbbr = Session.get('ERPCountryAbbr');
LoggedCountry = Session.get('ERPLoggedCountry');
// loggedCompany = Session.get('EDatabase');
loggedCompany = Session.get('vs1companyName');
defaultDept = Session.get('ERPDefaultDepartment');
defaultUOM = Session.get('ERPDefaultUOM');
isModuleGreenTrack = Session.get('CloudSeedToSaleLicence');
if(Session.get('ERPLoggedCountry') == "Australia"){
  loggedTaxCodePurchaseInc = "NCG";
  loggedTaxCodeSalesInc = "GST";
  chequeSpelling = "Cheque";
}else if(Session.get('ERPLoggedCountry') == "United States of America"){
  loggedTaxCodePurchaseInc = "NT";
  loggedTaxCodeSalesInc = "NT";
  chequeSpelling = "Check";
}else{
  loggedTaxCodePurchaseInc = "NT";
  loggedTaxCodeSalesInc = "NT";
  chequeSpelling = "Cheque";
}


//loggedTaxCodePurchaseInc = Session.get('ERPTaxCodePurchaseInc');
//loggedTaxCodeSalesInc = Session.get('ERPTaxCodeSalesInc');
