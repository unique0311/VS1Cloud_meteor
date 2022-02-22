import {BaseService} from '../js/base-service.js';
export class SideBarService extends BaseService {
  getNewProductListVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         ListType: "Detail",
         select: "[Active]=true"
        };
    }else{
      options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getProductServiceListVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true and [ProductType]!='INV'"
        };
    }else{
      options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true and [ProductType]!='INV'",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getAllCustomFields() {
       let options = {
           ListType: "Detail",
       };
    return this.getList(this.ERPObjects.TCustomFieldList, options);
  }


  getProductServiceListVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ProductName] f7like "'+dataSearchName+'" OR [BARCODE] f7like "'+dataSearchName+'" and [ProductType]!="INV"'
       };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getSelectedProducts(employeeID) {
       let options = {
           PropertyList: "ID,EmployeeName,PayRate,Rate, ServiceDesc",
           select: '[Active]=true and [EmployeeID]='+employeeID+''
       };
    return this.getList(this.ERPObjects.TRepServices, options);
  }

  getNewProductListVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ProductName] f7like "'+dataSearchName+'" OR [BARCODE] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }


  getNewInvoiceByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getNewInvoiceBoByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.BackOrderSalesList, options);
  }



  getNewQuoteByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TQuoteEx, options);
  }


   getNewSalesOrderByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSalesOrderEx, options);
  }

   getNewPoByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }


   getNewBillByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[SupplierName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TBillEx, options);
  }

   getNewCreditByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[SupplierName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TCredit, options);
  }

  getNewCustomerPaymentByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[CompanyName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TCustomerPayment, options);
  }


  getNewSupplierPaymentByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[CompanyName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

    getNewCustomerByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[Companyname] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

   getNewEmployeeByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[EmployeeName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TEmployee, options);
  }


   getNewSupplierByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAllJobssDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
      return this.getList(this.ERPObjects.TJobVS1, options);
  }

  getTPaymentList(dateFrom, dateTo, ignoreDate){
    let options = '';
    if(ignoreDate == true){
       options = {
          IgnoreDates:true,
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         IgnoreDates: false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+initialReportLoad+'"'
     };
    }
      return this.getList(this.ERPObjects.TPaymentList, options);
  }

  getTCustomerPaymentList(limitcount, limitfrom){
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getTSupplierPaymentList(limitcount, limitfrom){
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getAllCustomersDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }
  getAllCustomersDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllEmployeesDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[EmployeeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllAccountDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[AccountName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getAllSuppliersDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }


getCustomersDataByName(dataSearchName) {
    var options = '';
    options = {
      PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName,FirstName,LastName,TaxCodeName,ClientTypeName,Discount",
      select: '[ClientName] = "' + dataSearchName + '"'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getClientVS1() {
      let options = {
          PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName,FirstName,LastName,TaxCodeName,ClientTypeName,Discount",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllSuppliersDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }
  getAccountListVS1() {
    let options = '';
    //if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    // }else{
    //   options = {
    //    orderby:'"AccountID desc"',
    //    ListType: "Detail",
    //    select: '[Active]=true',
    //    LimitCount:'"'+limitcount+'"',
    //    LimitFrom:'"'+limitfrom+'"'
    //   };
    // }
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getAllContactCombineVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
      options = {
        //IgnoreDates:true,
        select: "[Active]=true",
      };
    }else{
      options = {
         // orderby:'"ClientID desc"',
         // ListType: "Detail",
         select: "[Active]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }


  getClientVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
         select: "[Active]=true"
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
       select: "[Active]=true",
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }
  getAllEmployees(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       //LimitCount:'"'+limitcount+'"',
       //LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllEmployeesDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       //LimitCount:'"'+limitcount+'"',
       //LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllInvoiceListNonBO(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        orderby:'"SaleID desc"',
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

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

  getAllSalesOrderList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          orderby:'"SaleID desc"',
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"SaleID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TSalesOrderEx, options);
  }

  getAllPurchaseOrderList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }

  getAllChequeList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
        orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }

    return this.getList(this.ERPObjects.TChequeEx, options);
  }
  getAllPurchaseOrderListAll(dateFrom, dateTo, ignoreDate) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true
     };
   }else{
     options = {
       IgnoreDates:false,
       IncludePOs:true,
       IncludeBills:true,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
   };
  }
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllAwaitingSupplierPayment(dateFrom, dateTo, ignoreDate) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true,
        Paid:false,
        Unpaid:true
     };
   }else{
     options = {
       IgnoreDates:false,
       IncludePOs:true,
       IncludeBills:true,
       Paid:false,
       Unpaid:true,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
   };
  }
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllBillExList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [Cancelled]=false'
        };
    }else{
      options = {
         orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false and [Cancelled]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }

    return this.getList(this.ERPObjects.TBillEx, options);
  }


  getAllQuoteList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          orderby:'"SaleID desc"',
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"SaleID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TQuoteEx, options);
  }

  getAllCreditList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
        orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TCredit, options);
  }

  getSalesListData(dateFrom, dateTo, ignoreDate) {

    let options = '';
    if(ignoreDate == true){
      options = {
         IgnoreDates:true,
     };
   }else{
     options = {
        IgnoreDates:false,
        DateFrom:'"'+dateFrom+'"',
        DateTo:'"'+dateTo+'"',
        LimitCount:'"'+initialReportLoad+'"'
    };
   }

  return this.getList(this.ERPObjects.TSalesList, options);
  }

  getAllJournalEnrtryLinesList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    }else{
      options = {
         orderby:'"GJID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllStockAdjustEntry(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"StockAdjustEntryID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TStockAdjustEntry, options);
  }

  getAllStockTransferEntry(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"TransferEntryID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TStockTransferEntry, options);
  }

  getAllInvoiceList(limitcount, limitfrom) {
    let options = '';
 if(limitcount == 'All'){
    options = {
       orderby:'"SaleID desc"',
       ListType: "Detail",
       select: '[Deleted]=false'
     };
 }else{
   options = {
      orderby:'"SaleID desc"',
      ListType: "Detail",
      select: "[Deleted]=false",
      LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
  };
 }
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }
  // Rasheed Speed Here
  getNewProductListVS1Update(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
      };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }



  getTARReport(dateFrom, dateTo, ignoreDate){
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false"
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
      return this.getList(this.ERPObjects.TARReport, options);
  }

  getTAPReport(dateFrom, dateTo, ignoreDate){
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false"
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
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
         FilterIndex: 2,
         LimitCount:'"'+initialReportLoad+'"'
       };
    }else{
      options = {
         IgnoreDates: true,
         Listtype: 1,
         FilterIndex: 2,
         LimitCount:'"'+initialReportLoad+'"'
     };
    }
      return this.getList(this.ERPObjects.TTransactionListReport, options);
  }

  getAllAppointmentList(limitcount, limitfrom){
    let options = '';
    let checkOwnAppointment = Session.get('CloudAppointmentSeeOwnAppointmentsOnly');
    let selectedEmployeeName = Session.get('mySessionEmployee');

    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        orderby:'"AppointID desc"',
        ListType: "Detail",
        select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
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



  getAllCustomersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }


  getAllSuppliersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
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

  getTaxRateVS1ByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
        select: '[CodeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TTaxcodeVS1, options);
  }

  getShippingMethodByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,ShippingMethod",
        select: '[ShippingMethod] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TShippingMethod, options);
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

  getAllowance(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        select: '[Active]=true',
        // LimitCount:'"'+limitcount+'"',
        // LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TAllowance, options);
  }

  getDeduction(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        select: '[Active]=true',
        // LimitCount:'"'+limitcount+'"',
        // LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TDeduction, options);
  }

  getAllEmployeePaySettings(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TEmployeepaysettings, options);
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
      PropertyList: "ID,ShippingMethod",
      select: "[Active]=true"
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



  getAllEmployeesUpdate(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TEmployee, options);
  }



  getAccountTypes() {
    let options = {
      PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber,Description",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TAccount, options);
  }




  getAllJournalEnrtryLinesListUpdate() {
    let options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllTVS1BankDepositData(limitcount, limitfrom) {
    let options = '';
  if(limitcount == 'All'){
     options = {
        ListType: "Detail",
        select: '[Deleted]=false'
      };
  }else{
    options = {
       orderby:'"DepositID desc"',
       ListType: "Detail",
       select: "[Deleted]=false",
       // LimitCount:'"'+initialReportLoad+'"'
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TVS1BankDeposit, options);
  }

  getAllBankAccountDetails(dateFrom, dateTo, ignoreDate) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false"
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
    return this.getList(this.ERPObjects.TBankAccountReport, options);
  }



  getAllInvoiceListUpdate(msTimeStamp) {
    let options = {
      orderby:'"SaleID desc"',
      ListType: "Detail",
      select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"',
      //LimitCount:'"50"'
    };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getAllBOInvoiceList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      FilterString: "SaleType='Invoice'",
      select: "[Deleted]=false",
    };
  }else{
    options = {
     orderby:'"SaleID desc"',
     FilterString: "SaleType='Invoice'",
     select: "[Deleted]=false",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.BackOrderSalesList, options);
  }

  // getAllBackOrderInvoiceList(limitcount, limitfrom) {
  //   let options = '';
  //   if(limitcount == 'All'){
  //    options = {
  //      orderby:'"SaleID desc"',
  //      PropertyList: "Id,ClientName,EmployeeName,SaleClassName,SaleDate",
  //   };
  // }else{
  //   options = {
  //     orderby:'"SaleID desc"',
  //     PropertyList: "Id,ClientName,EmployeeName,SaleClassName,SaleDate",
  //    //  select: "[Deleted]=false",
  //    // //  LimitCount:'"'+limitcount+'"',
  //    // // LimitFrom:'"'+limitfrom+'"'
  //  };
  // }
  //   return this.getList(this.ERPObjects.TInvoiceBackOrder, options);
  // }

  getAllBackOrderInvoiceList(limitcount, limitfrom) {
    let options = '';
     if(limitcount == 'All'){
        options = {
           orderby:'"SaleID desc"',
           ListType: "Detail",
           // select: '[Deleted]=false'
         };
     }else{
       options = {
          orderby:'"SaleID desc"',
          ListType: "Detail",
          // select: '[Deleted]=false',
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
      };
     }
    return this.getList(this.ERPObjects.TInvoiceBackOrder, options);
}


  getAllPurchaseOrderListNonBo() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
    };
    return this.getList(this.ERPObjects.TpurchaseOrderNonBackOrder, options);
  }



  getAllPurchaseOrderListBO(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
      select: '[Deleted]=false'
    };
    }else{
      options = {
        orderby:'"PurchaseOrderID desc"',
       PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
       select: '[Deleted]=false',
       LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TpurchaseOrderBackOrder, options);
  }

  getAllReconcilationList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"ReconciliationID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TReconciliation, options);
  }



  getProductStocknSaleReportData(dateFrom, dateTo) {
   let options = {
      IgnoreDates:false,
      DateFrom: '"'+dateFrom+'"',
      DateTo: '"'+dateTo+'"',
      LimitCount:'"'+initialReportLoad+'"'
  };

  return this.getList(this.ERPObjects.TProductStocknSalePeriodReport, options);
  }

  getCurrentLoggedUser() {
      let options = {
          PropertyList: "ID,DatabaseName,UserName,MultiLogon,EmployeeID,FirstName,LastName,LastTime",

      };
      return this.getList(this.ERPObjects.TAppUser, options);
  }

  getAllBillList() {
    let options = {
      PropertyList: "ID,EmployeeName,AccountName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
      select: "[Deleted]=false and [Cancelled]=false",
    };
    return this.getList(this.ERPObjects.TBill, options);
  }

  getAllSalesOrderListNonBO() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

    };
    return this.getList(this.ERPObjects.TsalesOrderNonBackOrder, options);
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

  getPaymentMethodVS1() {
      let options = {
          PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
          select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getPaymentMethodVS1ByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
        select: '[PaymentMethodName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getClientTypeDataByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,TypeDescription,TypeName,Active",
        select: '[TypeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TClientType, options);
  }

  getClientTypeData() {
      let options = {
          ListType: "Detail",
      };
      return this.getList(this.ERPObjects.TClientType, options);
  }

  getAllCustomerStatementData(dateFrom, dateTo, ignoreDate) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true
     };
    }else{
     options = {
       IgnoreDates: false,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
    return this.getList(this.ERPObjects.TStatementList, options);
    //return this.getList(this.ERPObjects.TStatementList);
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

   getGlobalSearchReport(searchName, limitcount, limitfrom){
       let options = {
         SearchName: "'"+searchName+"'",
         QuerySearchMode: "'smSearchEngineLike'",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
       };
       return this.getList(this.ERPObjects.TGlobalSearchReport, options);
   }

   getOneSupplierDataExByName(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ClientName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TSupplier, options);
   }

   getOneCustomerDataExByName(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ClientName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TCustomer, options);
   }

   getOneProductdatavs1byname(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ProductName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TProduct, options);
   }

   getAllTimeSheetList(){
    let options = {
           ListType: "Detail",
           select: "[Active]=true",
           //LimitCount:'"'+initialDataLoad+'"',
     }
        return this.getList(this.ERPObjects.TTimeSheet, options);
    }


    getNewChequeByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        //select: '[ID] f7like "'+dataSearchName+'"'
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" OR [GLAccountName] f7like "'+dataSearchName+'" OR [SupplierInvoiceNumber] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TChequeEx, options);
  }

  getAllRefundList(limitcount, limitfrom) {
    let options = '';
 if(limitcount == 'All'){
    options = {
       orderby:'"SaleID desc"',
       ListType: "Detail",
       select: '[Deleted]=false'
     };
 }else{
   options = {
      orderby:'"SaleID desc"',
      ListType: "Detail",
      select: "[Deleted]=false",
      LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
  };
 }
  return this.getList(this.ERPObjects.TRefundSale, options);
}

getNewRefundByNameOrID(dataSearchName) {
  let options = '';
     options = {
      ListType: "Detail",
      select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
      //select: '[ClientName] f7like "'+dataSearchName+'"'
     };
  return this.getList(this.ERPObjects.TRefundSale, options);
}

getCloudTERPForm() {
    let options = {
        PropertyList: "Description,TabGroupName,SkinsGroup",
        select: "[TabGroup]=26 and [AccessLevels]=true"
    };
    return this.getList(this.ERPObjects.TERPForm, options);
}

getEmpFormAccessDetail() {
    let options = {
        ListType: "Detail",
        select: "[TabGroup]=26 and [EmployeeId]='"+Session.get('mySessionEmployeeLoggedID')+"'",
    };
    return this.getList(this.ERPObjects.TEmployeeFormAccessDetail, options);
}

getAllPayRunDataVS1(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail"
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
     ListType: "Detail",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
    };
  }
    return this.getList(this.ERPObjects.TPayRun, options);
}

getAllPayHistoryDataVS1(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail"
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
     ListType: "Detail",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
    };
  }
    return this.getList(this.ERPObjects.TPayHistory, options);
}

}
