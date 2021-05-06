import {BaseService} from "../js/base-service";
export class StockTransferService extends BaseService {
  getAllStockTransferEntry() {
      let options = {
          PropertyList: "Id,AccountName,CreationDate,Notes,EmployeeName,DateTransferred,deleted,Description,Processed",
          select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TStockTransferEntry, options);
  }

  }
