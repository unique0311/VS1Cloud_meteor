import {BaseService} from "../js/base-service";
export class ReconService extends BaseService {

    getAccountNameVS1() {
        let options = {
            PropertyList: "Id,AccountName,AccountTypeName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TAccountVS1, options);
    }

    getToBeReconciledDeposit(accountid) {
        let options = {
            AccountId: accountid
        };
        return this.getList(this.ERPObjects.TToBeReconciledDeposit, options);
    }

    getToBeReconciledWithdrawal(accountid) {
        let options = {
            AccountId: accountid
        };
        return this.getList(this.ERPObjects.TToBeReconciledWithDrawal, options);
    }

    getReconciliation(){
        let options = {
            PropertyList: "AccountName,Deleted,DeptName,EmployeeName,Finished,GlobalRef,ID,ISEmpty,KeyValue,Notes,OnHold,OpenBalance,ReconciliationDate,StatementNo,CloseBalance",
            select: "[Deleted]=false"
        };
        return this.getList(this.ERPObjects.TReconciliation, options);
    }

    getReconciliationBalance(bankAccount){
        let options = {
            PropertyList: "AccountName,Deleted,CloseBalance,OnHold,AccountID",
            select: "[Deleted]=false"
        };
        return this.getList(this.ERPObjects.TReconciliation, options);
    }

    saveReconciliation(data){
        return this.POST(this.ERPObjects.TReconciliation,data);
    }

    getOneReconData(id) {

        return this.getOneById(this.ERPObjects.TReconciliation, id);
    }

}
