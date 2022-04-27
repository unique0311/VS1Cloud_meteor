export default class AssignLeaveType {
  
  constructor(options) {
    this.type = options.type;
    if (options.fields instanceof AssignLeaveTypeFields) {
      this.fields = fields;
    } else {
      this.fields = new AssignLeaveTypeFields(options.fields);
    }
  }

  /**
   *
   * @param {Array} array
   * @return {AssignLeaveType[]}
   */
   static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new AssignLeaveType(element));
    });

    return myList;
  }

}

export class AssignLeaveTypeFields {
    constructor({
      LeaveType,
      EmployeeID,
      LeaveCalcMethod,
      HoursAccruedAnnually,
      HoursAccruedAnnuallyFullTimeEmp,
      HoursFullTimeEmpFortnightlyPay,
      HoursLeave,
      OpeningBalance,
      OnTerminationUnusedBalance,
      EFTLeaveType,
      SuperannuationGuarantee
    }) {
      this.LeaveType = LeaveType;
      this.EmployeeID = EmployeeID;
      this.LeaveCalcMethod = LeaveCalcMethod;
      this.HoursAccruedAnnually = HoursAccruedAnnually;
      this.HoursAccruedAnnuallyFullTimeEmp = HoursAccruedAnnuallyFullTimeEmp;
      this.HoursFullTimeEmpFortnightlyPay = HoursFullTimeEmpFortnightlyPay;
      this.HoursLeave = HoursLeave;
      this.OpeningBalance = OpeningBalance;
      this.OnTerminationUnusedBalance = OnTerminationUnusedBalance;
      this.EFTLeaveType = EFTLeaveType;
      this.SuperannuationGuarantee = SuperannuationGuarantee;
    }
  }
  