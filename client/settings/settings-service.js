import {
    BaseService
} from '../js/base-service.js';

export class TaxRateService extends BaseService {
    getTaxRate() {
        return this.GET(this.erpGet.ERPTaxCode);
    }

    getOneTaxRate(id) {
        return this.getOneById(this.ERPObjects.ERPTaxCode, id);
    }

    getAccountType() {
        return this.GET(this.erpGet.ERPTAccountType);
    }

    getAccountList() {
        return this.GET(this.erpGet.ERPAccountList);
    }

    getScheduleSettings() {
        let options = {
                ListType: "Detail",
    //        PropertyList:"BeginFromOption,ContinueIndefinitely,EmployeeId,Employeename,EndDate,Every,FormID,Frequency,GlobalRef,HolidayAction,ID,ISEmpty,KeyStringFieldName,KeyValue,LastEmaileddate,MonthDays,MsTimeStamp,MsUpdateSiteCode",

            };
            return this.getList(this.ERPObjects.TReportSchedules,options);
        }
      saveScheduleSettings(data) {
      //     let options = {
      //             ListType: "Detail",
      // //        PropertyList:"BeginFromOption,ContinueIndefinitely,EmployeeId,Employeename,EndDate,Every,FormID,Frequency,GlobalRef,HolidayAction,ID,ISEmpty,KeyStringFieldName,KeyValue,LastEmaileddate,MonthDays,MsTimeStamp,MsUpdateSiteCode",
      //
      //         };
              return this.POST(this.ERPObjects.TReportSchedules,data);
          }
    getAssetTypes() {
        let options = {
            PropertyList: "AssetTypeName, AssetTypeCode, Notes",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TFixedAssetType, options);
    }

    getAccountOptions() {
        let options = {
            PropertyList: "AccountNumber, AccountName, AccountTypeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getAssetType(id) {
        return this.getOneById(this.ERPObjects.TFixedAssetType, id);
    }

    // getCurrencies() {
    //     let options = {
    //         PropertyList: "Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,ID,Country",
    //         select: "[Active]=true",
    //     };
    //     return this.getList(this.ERPObjects.TCurrency, options);
    // }

    getOneAccount(id) {
        return this.getOneById(this.ERPObjects.ERPAccount, id);
    }

    getAccountTypeDropDown() {
        let options = {
            PropertyList: "Description, AccountTypeName",
        };
        return this.getList(this.ERPObjects.ERPAccountType, options);
    }

    getTaxRateDropDown() {
        let options = {
            PropertyList: "CodeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    saveTaxRate(data) {
        return this.POST(this.ERPObjects.TTaxCode, data);
    }

    checkTaxRateByName(codeName) {
        let options = {
            select: "[CodeName]='" + codeName + "'"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    checkTermByName(termName) {
        let options = {
            select: "[TermsName]='" + termName + "'"
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    getOneAccountTypeByName(AccountTypeName) {
        let options = {
            PropertyList: "Description, AccountTypeName",
        };
        return this.getList(this.ERPObjects.ERPAccountType, options);
    }

    getExpenseAccountList() {
        return this.GET(this.erpGet.ERPExpenseAccountList);
    }

    getRevenueAccountList() {
        return this.GET(this.erpGet.ERPRevenueAccountList);
    }

    getEquityAccountList() {
        return this.GET(this.erpGet.ERPEquityAccountList);
    }

    getAssetAccountList() {
        return this.GET(this.erpGet.ERPAssetAccountList);
    }

    getLiabilityAccountList() {
        return this.GET(this.erpGet.ERPLiabilityAccountList);
    }
    getArchiveAccountList() {
        return this.GET(this.erpGet.ERPArchiveAccountList);
    }
    getChartOfAccounts() {
        let options = {
            select: "[Active]=true",
            ListType: "Detail"
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }
    saveAccount(data) {
        return this.POST(this.ERPObjects.TAccount, data);
    }
    saveClientTypeData(data) {
        return this.POST(this.ERPObjects.TClientType, data);
    }

    saveAccount(data) {
        return this.POST(this.ERPObjects.TAccount, data);
    }

    saveDepartment(data) {
        return this.POST(this.ERPObjects.TDeptClass, data);
    }

    checkDepartmentByName(deptName) {
        let options = {
            select: "[DeptClassName]='" + deptName + "'"
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }
    checkCurrency(Country) {
        let options = {
            PropertyList: "Code,CurrencyDesc,Currency,BuyRate,SellRate,Active,CurrencySymbol,ID",
            select: "[Country]=" + Country
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }
    saveCurrency(data) {
        return this.POST(this.ERPObjects.TCurrency, data);
    }


    getDepartment() {
        let options = {
            PropertyList: "ID,GlobalRef,KeyValue,DeptClassGroup,DeptClassName,Description,SiteCode,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }

    getClientType() {
        let options = {
            PropertyList: "ID,TypeDescription,TypeName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TClientType, options);
    }

    getOneDepartment(id) {
        return this.getOneById(this.ERPObjects.TDeptClass, id);
    }

    getCurrencies() {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }

    getCurrenciesVS1() {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TCurrencyVS1, options);
    }

    getOneCurrency(id) {
        return this.getOneById(this.ERPObjects.TCurrency, id);
    }

    getOneCurrencyByCountry(country) {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            // select: "[Country]='"+country+"'",
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }

    getPaymentMethod() {
        let options = {
            PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TPaymentMethod, options);
    }

    getPaymentMethodVS1() {
        let options = {
            PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
    }

    getOnePaymentMethod(id) {
        return this.getOneById(this.ERPObjects.TPaymentMethod, id);
    }

    savePaymentMethod(data) {
        return this.POST(this.ERPObjects.TPaymentMethod, data);
    }

    getTerms() {
        let options = {
            PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }
    getTermsVS1() {
        let options = {
            PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active,isPurchasedefault,isSalesdefault",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTermsVS1, options);
    }

    getTaxRateVS1() {
        let options = {
            PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }

    getOneTerms(id) {
        return this.getOneById(this.ERPObjects.TTerms, id);
    }

    saveTerms(data) {
        return this.POST(this.ERPObjects.TTerms, data);
    }

    checkPaymentMethodByName(paymentName) {
        let options = {
            select: "[PaymentMethodName]='" + paymentName + "'"
        };
        return this.getList(this.ERPObjects.TPaymentMethod, options);
    }

    getEmployees() {
        let options = {
            PropertyList: "PropertyList==ID,EmployeeName",
            Select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TEmployee, options);
    }

    getBins() {
        let options = {
            PropertyList: "ID,BinLocation,BinNumber",
            Select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TProductBin, options);
    }

    saveRoom(data) {
        return this.POST(this.ERPObjects.TProductBin, data);
    }

    pullBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_BackupList"', data);
    }

    saveBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_DatabaseBackup"', data);
    }

    restoreBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_DatabaseRestore"', data);
    }

    getAllBackUpList() {
        let options = {
            // PropertyList: "PropertyList==ID,EmployeeName",
            // Select: "[Active]=true"
        };
        return this.getList('VS1_Cloud_Task/Method?Name="VS1_BackupList"');
    }

}
