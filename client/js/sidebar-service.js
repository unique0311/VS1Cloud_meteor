import {
  BaseService
} from '../js/base-service.js';
export class SideBarService extends BaseService {
  getNewProductListVS1() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getNewProductListVS1Update(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
      };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getTPaymentList(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [PaymentDate]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         IgnoreDates: true,
         select: "[Deleted]=false"
     };
    }
      return this.getList(this.ERPObjects.TPaymentList, options);
  }

  getTCustomerPaymentList(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
      return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getTSupplierPaymentList(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
      return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getTARReport(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          IgnoreDates: true,
          select: '[MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         IgnoreDates: true
     };
    }
      return this.getList(this.ERPObjects.TARReport, options);
  }

  getTAPReport(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          IgnoreDates: true,
          select: '[MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         IgnoreDates: true
     };
    }
      return this.getList(this.ERPObjects.TAPReport, options);
  }

  getTTransactionListReport(msTimeStamp){
    let options = '';
    if(msTimeStamp){
      options = {
         IgnoreDates: true,
         Listtype: 1,
         FilterIndex: 2

       };
    }else{
      options = {
         IgnoreDates: true,
         Listtype: 1,
         FilterIndex: 2
     };
    }
      return this.getList(this.ERPObjects.TTransactionListReport, options);
  }

  getAllAppointmentList(msTimeStamp){
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Active]=true"
     };
    }

      return this.getList(this.ERPObjects.TAppointment, options);
  }

  getAllAppointmentPredList(data){
      let options = {
          PropertyList: "ID,EmployeeID,ShowApptDurationin,ShowSaturdayinApptCalendar,ShowSundayinApptCalendar,ApptStartTime,ApptEndtime,DefaultApptDuration,DefaultServiceProductID,DefaultServiceProduct"
       }
      return this.getList(this.ERPObjects.TAppointmentPreferences, options);
  }

  getAllCustomersDataVS1() {
    let options = {
      ListType: "Detail",
      select: '[Active]=true'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllCustomersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllSuppliersDataVS1() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAllSuppliersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAccountListVS1() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getAccountListVS1Update(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
      };
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getTaxRateVS1() {
    let options = {
      PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TTaxcodeVS1, options);
  }

  getDepartment() {
    let options = {
      PropertyList: "ID,GlobalRef,KeyValue,DeptClassGroup,DeptClassName,Description,SiteCode,Active",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TDeptClass, options);
  }

  getTermsVS1() {
    let options = {
      PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active,isPurchasedefault,isSalesdefault",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TTermsVS1, options);
  }

  getAllLeadStatus() {
    let options = {
      PropertyList: "ID,TypeName",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TLeadStatusType, options);
  }

  getShippingMethodData() {
    let options = {
      PropertyList: "ID,ShippingMethod,",
    };
    return this.getList(this.ERPObjects.TShippingMethod, options);
  }

  getCurrencies() {
    let options = {
      PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TCurrency, options);
  }

  getAccountTypesToAddNew() {
    let options = {
      PropertyList: "AccountTypeName,Description,OriginalDescription",
    };
    return this.getList(this.ERPObjects.TAccountType, options);
  }

  getAllEmployees() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllEmployeesUpdate(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TEmployee, options);
  }
  getAllContactCombineVS1() {
    let options = {
      PropertyList: "ID,EmployeeNo,ClientName,Phone,Mobile,Email,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,Street,Country,CUSTFLD1,CUSTFLD2,IsCustomer,IsOtherContact,IsSupplier,",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }


  getClientVS1() {
    let options = {
      PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }


  getAccountTypes() {
    let options = {
      PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber,Description",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TAccount, options);
  }


  getAllJournalEnrtryLinesList() {
    let options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllJournalEnrtryLinesListUpdate() {
    let options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllTVS1BankDepositData(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TVS1BankDeposit, options);
  }

  getAllBankAccountDetails() {
    let options = {
        IgnoreDates: true,
        select: "[deleted]=false"
    };
    return this.getList(this.ERPObjects.TBankAccountReport, options);
  }

  getAllInvoiceList() {
    let options = {
      orderby:'"SaleID desc"',
      ListType: "Detail",
      //select: "[Deleted]=false",
      // LimitCount:'"50"',
      // Limitfrom:'"1"'
    };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getAllInvoiceListUpdate(msTimeStamp) {
    let options = {
      orderby:'"SaleID desc"',
      ListType: "Detail",
      select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"',
      LimitCount:'"25"'
    };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getAllInvoiceListNonBO(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        orderby:'"SaleID desc"',
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
        //LimitCount:'"'+limitcount+'"',
        //LimitFrom:'"'+limitfrom+'"'
      };
    }else{
       options = {
        orderby:'"SaleID desc"',
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
      };
    }

    return this.getList(this.ERPObjects.TInvoiceNonBackOrder, options);
  }

  getAllBOInvoiceList() {
    let options = {

      FilterString: "SaleType='Invoice'",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.BackOrderSalesList, options);
  }

  getAllSalesOrderList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TSalesOrderEx, options);
  }

  getAllPurchaseOrderList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }

  getAllPurchaseOrderListNonBo() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
    };
    return this.getList(this.ERPObjects.TpurchaseOrderNonBackOrder, options);
  }

  getAllPurchaseOrderListAll() {
    let options = {
      IgnoreDates:true,
      IncludePOs:true,
      IncludeBills:true
    };
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllPurchaseOrderListBO() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
    };
    return this.getList(this.ERPObjects.TpurchaseOrderBackOrder, options);
  }

  getAllReconcilationList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TReconciliation, options);
  }

  getAllChequeList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }

    return this.getList(this.ERPObjects.TCheque, options);
  }

  getProductStocknSaleReportData(dateFrom, dateTo) {
   let options = {
      DateFrom: '"'+dateFrom+'"',
      DateTo: '"'+dateTo+'"'
  };

  return this.getList(this.ERPObjects.TProductStocknSalePeriodReport, options);
  }

  getCurrentLoggedUser() {
      let options = {
          PropertyList: "ID,DatabaseName,UserName,MultiLogon,EmployeeID,FirstName,LastName,LastTime",

      };
      return this.getList(this.ERPObjects.TAppUser, options);
  }

  getAllJobssDataVS1() {
      let options = {
          ListType: "Detail",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TJobVS1, options);
  }

  getAllStockAdjustEntry(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
      return this.getList(this.ERPObjects.TStockAdjustEntry, options);
  }

  getAllBillList() {
    let options = {
      PropertyList: "ID,EmployeeName,AccountName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
      select: "[Deleted]=false and [Cancelled]=false",
    };
    return this.getList(this.ERPObjects.TBill, options);
  }

  getAllBillExList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [Cancelled]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false and [Cancelled]=false"
     };
    }

    return this.getList(this.ERPObjects.TBillEx, options);
  }


  getAllQuoteList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TQuoteEx, options);
  }


  getAllSalesOrderListNonBO() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

    };
    return this.getList(this.ERPObjects.TsalesOrderNonBackOrder, options);
  }

  getAllCreditList(msTimeStamp) {
    let options = '';
    if(msTimeStamp){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"'
        };
    }else{
      options = {
         ListType: "Detail",
         select: "[Deleted]=false"
     };
    }
    return this.getList(this.ERPObjects.TCredit, options);
  }

  getSalesListData() {
    let options = {
         IgnoreDates:true
     };

  return this.getList(this.ERPObjects.TSalesList, options);
  }
  getCountry() {
      return this.GET(this.erpGet.ERPCountries);
  }

  getPaymentMethodDataVS1() {
      let options = {
          ListType: "Detail",
      };
      return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getClientTypeData() {
      let options = {
          ListType: "Detail",
      };
      return this.getList(this.ERPObjects.TClientType, options);
  }

  getAllCustomerStatementData() {
      return this.getList(this.ERPObjects.TStatementList);
  }

  getGlobalSettings(){
        let options = {
           PropertyList: "PrefName,Fieldvalue",
           select: '[PrefName]="DefaultServiceProduct" or [PrefName]="DefaultServiceProductID" or [PrefName]="DefaultApptDuration" or [PrefName]="ApptStartTime" or [PrefName]="ApptEndtime" or [PrefName]="ShowSaturdayinApptCalendar" or [PrefName]="ShowSundayinApptCalendar" or [PrefName]="ShowApptDurationin" or [PrefName]="RoundApptDurationTo" or [PrefName]="MinimumChargeAppointmentTime"'
        }
       return this.getList(this.ERPObjects.TERPPreference,options);
   }


   getGlobalSettingsExtra(){
        let options = {
           PropertyList: "ID,Prefname,fieldValue",
        }
    return this.getList(this.ERPObjects.TERPPreferenceExtra,options);
   }

}
