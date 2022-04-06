import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import { UtilityService } from "../../utility-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let _ = require("lodash");

Template.clockedOnEmployees.onCreated(function () {
  const templateObject = Template.instance();


});

Template.clockedOnEmployees.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.getAllTimeSheetDataClock = function () {
    getVS1Data("TTimeSheet")
      .then(function (dataObject) {
        if (dataObject == 0) {
          sideBarService
            .getAllTimeSheetList()
            .then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              let sumTotalCharge = 0;
              let sumSumHour = 0;
              let sumSumHourlyRate = 0;
              /* Update Clocked On Employees */
              let dataListClockedOnEmployeeObj = {};
              for (let t = 0; t < data.ttimesheet.length; t++) {
                if (data.ttimesheet[t].fields.Logs != null) {
                  if (
                    data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" ||
                    data.ttimesheet[t].fields.InvoiceNotes == "paused"
                  ) {
                    dataListClockedOnEmployeeObj = {
                      employeename:
                        data.ttimesheet[t].fields.EmployeeName || "",
                    };
                    clockedOnEmpList.push(dataListClockedOnEmployeeObj);
                  }
                  let hourlyRate =
                    utilityService.modifynegativeCurrencyFormat(
                      data.ttimesheet[t].fields.HourlyRate
                    ) || Currency + 0.0;

                  let labourCost =
                    utilityService.modifynegativeCurrencyFormat(
                      data.ttimesheet[t].fields.LabourCost
                    ) || Currency + 0.0;
                  let totalAmount =
                    utilityService.modifynegativeCurrencyFormat(
                      data.ttimesheet[t].fields.Total
                    ) || Currency + 0.0;
                  let totalAdjusted =
                    utilityService.modifynegativeCurrencyFormat(
                      data.ttimesheet[t].fields.TotalAdjusted
                    ) || Currency + 0.0;
                  let totalAmountInc =
                    utilityService.modifynegativeCurrencyFormat(
                      data.ttimesheet[t].fields.TotalInc
                    ) || Currency + 0.0;
                  let hoursFormatted =
                    templateObject.timeFormat(
                      data.ttimesheet[t].fields.Hours
                    ) || "";
                  if (
                    data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") ==
                      "" ||
                    data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
                  ) {
                    hourlyRate = Currency + 0.0;
                  }
                  if (
                    data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") ==
                      "" ||
                    data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
                  ) {
                    hoursFormatted = "00:00";
                  }
                  var dataList = {
                    id: data.ttimesheet[t].fields.ID || "",
                    employee: data.ttimesheet[t].fields.EmployeeName || "",
                    hourlyrate: hourlyRate,
                    hours: data.ttimesheet[t].fields.Hours || "",
                    hourFormat: hoursFormatted,
                    job: data.ttimesheet[t].fields.Job || "",
                    labourcost: labourCost,
                    overheadrate: data.ttimesheet[t].fields.OverheadRate || "",
                    sortdate:
                      data.ttimesheet[t].fields.TimeSheetDate != ""
                        ? moment(
                            data.ttimesheet[t].fields.TimeSheetDate
                          ).format("YYYY/MM/DD")
                        : data.ttimesheet[t].fields.TimeSheetDate,
                    timesheetdate:
                      data.ttimesheet[t].fields.TimeSheetDate != ""
                        ? moment(
                            data.ttimesheet[t].fields.TimeSheetDate
                          ).format("DD/MM/YYYY")
                        : data.ttimesheet[t].fields.TimeSheetDate,
                    product: data.ttimesheet[t].fields.ServiceName || "",
                    timesheetdate1:
                      data.ttimesheet[t].fields.TimeSheetDate || "",
                    timelog: data.ttimesheet[t].fields.Logs || "",
                    isPaused: data.ttimesheet[t].fields.InvoiceNotes || "",
                    totalamountex: totalAmount || Currency + 0.0,
                    totaladjusted: totalAdjusted || Currency + 0.0,
                    totalamountinc: totalAmountInc || Currency + 0.0,
                    overtime: 0,
                    double: 0,
                    additional: Currency + "0.00",
                    paychecktips: Currency + "0.00",
                    cashtips: Currency + "0.00",
                    startTime: data.ttimesheet[t].fields.StartTime || "",
                    endTime: data.ttimesheet[t].fields.EndTime || "",
                    notes: data.ttimesheet[t].fields.Notes || "",
                    finished: "Not Processed",
                    color: "#f6c23e",
                  };
                  timeSheetList.push(dataList);
                }
              }
              templateObject.clockedOnEmpData.set(clockedOnEmpList);
              templateObject.timesheetrecords.set(timeSheetList);
              $(".fullScreenSpin").css("display", "none");
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let lineItems = [];
          let lineItemObj = {};
          let sumTotalCharge = 0;
          let sumSumHour = 0;
          let sumSumHourlyRate = 0;

          /* Update Clocked On Employees */
          let dataListClockedOnEmployeeObj = {};
          for (let t = 0; t < data.ttimesheet.length; t++) {
            if (data.ttimesheet[t].fields.Logs != null) {
              if (
                data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" ||
                data.ttimesheet[t].fields.InvoiceNotes == "paused"
              ) {
                dataListClockedOnEmployeeObj = {
                  employeename: data.ttimesheet[t].fields.EmployeeName || "",
                };
                clockedOnEmpList.push(dataListClockedOnEmployeeObj);
              }
              let hourlyRate =
                utilityService.modifynegativeCurrencyFormat(
                  data.ttimesheet[t].fields.HourlyRate
                ) || Currency + 0.0;
              let labourCost =
                utilityService.modifynegativeCurrencyFormat(
                  data.ttimesheet[t].fields.LabourCost
                ) || Currency + 0.0;
              let totalAmount =
                utilityService.modifynegativeCurrencyFormat(
                  data.ttimesheet[t].fields.Total
                ) || Currency + 0.0;
              let totalAdjusted =
                utilityService.modifynegativeCurrencyFormat(
                  data.ttimesheet[t].fields.TotalAdjusted
                ) || Currency + 0.0;
              let totalAmountInc =
                utilityService.modifynegativeCurrencyFormat(
                  data.ttimesheet[t].fields.TotalInc
                ) || Currency + 0.0;
              sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
              sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
              sumSumHourlyRate =
                sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
              let hoursFormatted =
                templateObject.timeFormat(data.ttimesheet[t].fields.Hours) ||
                "";
              if (
                data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") == "" ||
                data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
              ) {
                hourlyRate = Currency + 0.0;
              }
              if (
                data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") == "" ||
                data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
              ) {
                hoursFormatted = "00:00";
              }

              var dataList = {
                id: data.ttimesheet[t].fields.ID || "",
                employee: data.ttimesheet[t].fields.EmployeeName || "",
                hourlyrate: hourlyRate,
                hours: data.ttimesheet[t].fields.Hours || "",
                hourFormat: hoursFormatted || "",
                job: data.ttimesheet[t].fields.Job || "",
                labourcost: labourCost,
                overheadrate: data.ttimesheet[t].fields.OverheadRate || "",
                sortdate:
                  data.ttimesheet[t].fields.TimeSheetDate != ""
                    ? moment(data.ttimesheet[t].fields.TimeSheetDate).format(
                        "YYYY/MM/DD"
                      )
                    : data.ttimesheet[t].fields.TimeSheetDate,
                timesheetdate:
                  data.ttimesheet[t].fields.TimeSheetDate != ""
                    ? moment(data.ttimesheet[t].fields.TimeSheetDate).format(
                        "DD/MM/YYYY"
                      )
                    : data.ttimesheet[t].fields.TimeSheetDate,
                product: data.ttimesheet[t].fields.ServiceName || "",
                timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || "",
                timelog: data.ttimesheet[t].fields.Logs || "",
                isPaused: data.ttimesheet[t].fields.InvoiceNotes || "",
                totalamountex: totalAmount || Currency + 0.0,
                totaladjusted: totalAdjusted || Currency + 0.0,
                totalamountinc: totalAmountInc || Currency + 0.0,
                overtime: 0,
                double: 0,
                additional: Currency + "0.00",
                paychecktips: Currency + "0.00",
                cashtips: Currency + "0.00",
                startTime: data.ttimesheet[t].fields.StartTime || "",
                endTime: data.ttimesheet[t].fields.EndTime || "",
                notes: data.ttimesheet[t].fields.Notes || "",
                finished: "Not Processed",
                color: "#f6c23e",
              };

              timeSheetList.push(dataList);
            }
          }
          templateObject.timesheetrecords.set(timeSheetList);
          templateObject.clockedOnEmpData.set(clockedOnEmpList);
          let url = window.location.href;
          $(".fullScreenSpin").css("display", "none");
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllTimeSheetList()
          .then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let sumTotalCharge = 0;
            let sumSumHour = 0;
            let sumSumHourlyRate = 0;
            /* Update Clocked On Employees */
            let dataListClockedOnEmployeeObj = {};
            for (let t = 0; t < data.ttimesheet.length; t++) {
              if (data.ttimesheet[t].fields.Logs != null) {
                if (
                  data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" ||
                  data.ttimesheet[t].fields.InvoiceNotes == "paused"
                ) {
                  dataListClockedOnEmployeeObj = {
                    employeename: data.ttimesheet[t].fields.EmployeeName || "",
                  };
                  clockedOnEmpList.push(dataListClockedOnEmployeeObj);
                }
                let hourlyRate =
                  utilityService.modifynegativeCurrencyFormat(
                    data.ttimesheet[t].fields.HourlyRate
                  ) || Currency + 0.0;
                let labourCost =
                  utilityService.modifynegativeCurrencyFormat(
                    data.ttimesheet[t].fields.LabourCost
                  ) || Currency + 0.0;
                let totalAmount =
                  utilityService.modifynegativeCurrencyFormat(
                    data.ttimesheet[t].fields.Total
                  ) || Currency + 0.0;
                let totalAdjusted =
                  utilityService.modifynegativeCurrencyFormat(
                    data.ttimesheet[t].fields.TotalAdjusted
                  ) || Currency + 0.0;
                let totalAmountInc =
                  utilityService.modifynegativeCurrencyFormat(
                    data.ttimesheet[t].fields.TotalInc
                  ) || Currency + 0.0;
                let hoursFormatted =
                  templateObject.timeFormat(data.ttimesheet[t].fields.Hours) ||
                  "";
                if (
                  data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") ==
                    "" ||
                  data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
                ) {
                  hourlyRate = Currency + 0.0;
                }
                if (
                  data.ttimesheet[t].fields.StartTime.replace(/\s/g, "") ==
                    "" ||
                  data.ttimesheet[t].fields.EndTime.replace(/\s/g, "") == ""
                ) {
                  hoursFormatted = "00:00";
                }
                var dataList = {
                  id: data.ttimesheet[t].fields.ID || "",
                  employee: data.ttimesheet[t].fields.EmployeeName || "",
                  hourlyrate: hourlyRate,
                  hours: data.ttimesheet[t].fields.Hours || "",
                  hourFormat: hoursFormatted,
                  job: data.ttimesheet[t].fields.Job || "",
                  labourcost: labourCost,
                  overheadrate: data.ttimesheet[t].fields.OverheadRate || "",
                  sortdate:
                    data.ttimesheet[t].fields.TimeSheetDate != ""
                      ? moment(data.ttimesheet[t].fields.TimeSheetDate).format(
                          "YYYY/MM/DD"
                        )
                      : data.ttimesheet[t].fields.TimeSheetDate,
                  timesheetdate:
                    data.ttimesheet[t].fields.TimeSheetDate != ""
                      ? moment(data.ttimesheet[t].fields.TimeSheetDate).format(
                          "DD/MM/YYYY"
                        )
                      : data.ttimesheet[t].fields.TimeSheetDate,
                  product: data.ttimesheet[t].fields.ServiceName || "",
                  timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || "",
                  timelog: data.ttimesheet[t].fields.Logs || "",
                  isPaused: data.ttimesheet[t].fields.InvoiceNotes || "",
                  totalamountex: totalAmount || Currency + 0.0,
                  totaladjusted: totalAdjusted || Currency + 0.0,
                  totalamountinc: totalAmountInc || Currency + 0.0,
                  overtime: 0,
                  double: 0,
                  additional: Currency + "0.00",
                  paychecktips: Currency + "0.00",
                  cashtips: Currency + "0.00",
                  startTime: data.ttimesheet[t].fields.StartTime || "",
                  endTime: data.ttimesheet[t].fields.EndTime || "",
                  notes: data.ttimesheet[t].fields.Notes || "",
                  finished: "Not Processed",
                  color: "#f6c23e",
                };
                timeSheetList.push(dataList);
              }
            }
            templateObject.clockedOnEmpData.set(clockedOnEmpList);
            templateObject.timesheetrecords.set(timeSheetList);
            $(".fullScreenSpin").css("display", "none");
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $(".fullScreenSpin").css("display", "none");
            // Meteor._reload.reload();
          });
      });
  };

  templateObject.getAllTimeSheetDataClock();
});


Template.payrolloverview.helpers({
    jobsrecords: () => {
      return Template.instance()
        .jobsrecords.get()
        .sort(function (a, b) {
          if (a.jobname == "NA") {
            return 1;
          } else if (b.jobname == "NA") {
            return -1;
          }
          return a.jobname.toUpperCase() > b.jobname.toUpperCase() ? 1 : -1;
        });
    },
    includePayrollClockOnOffOnly: () => {
      return Template.instance().includePayrollClockOnOffOnly.get();
    },
    datatablerecords: () => {
      return Template.instance()
        .datatablerecords.get()
        .sort(function (a, b) {
          if (a.employeename == "NA") {
            return 1;
          } else if (b.employeename == "NA") {
            return -1;
          }
          return a.employeename.toUpperCase() > b.employeename.toUpperCase()
            ? 1
            : -1;
        });
    },
    loggeduserdata: () => {
      return Template.instance()
        .loggeduserdata.get()
        .sort(function (a, b) {
          if (a.employeename == "NA") {
            return 1;
          } else if (b.employeename == "NA") {
            return -1;
          }
          return a.employeename.toUpperCase() > b.employeename.toUpperCase()
            ? 1
            : -1;
        });
    },
    clockedOnEmpData: () => {
      return Template.instance()
        .clockedOnEmpData.get()
        .sort(function (a, b) {
          if (a.employeename == "NA") {
            return 1;
          } else if (b.employeename == "NA") {
            return -1;
          }
          return a.employeename.toUpperCase() > b.employeename.toUpperCase()
            ? 1
            : -1;
        });
    },
    datatablerecords1: () => {
      return Template.instance()
        .datatablerecords1.get()
        .sort(function (a, b) {
          if (a.productname == "NA") {
            return 1;
          } else if (b.productname == "NA") {
            return -1;
          }
          return a.productname.toUpperCase() > b.productname.toUpperCase()
            ? 1
            : -1;
        });
    },
    edithours: () => {
      return Session.get("CloudEditTimesheetHours") || false;
    },
    clockOnOff: () => {
      return Session.get("CloudClockOnOff") || false;
    },
    launchClockOnOff: () => {
      return Session.get("launchClockOnOff") || false;
    },
    timesheetStartStop: () => {
      return Session.get("timesheetStartStop ") || false;
    },
    showTimesheet: () => {
      return Session.get("CloudShowTimesheet") || false;
    },
    tableheaderrecords: () => {
      return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
      return CloudPreference.findOne({
        userid: Session.get("mycloudLogonID"),
        PrefName: "tblPayHistorylist",
      });
    },
    loggedCompany: () => {
      return localStorage.getItem("mySession") || "";
    },
  });
  