import { PurchaseBoardService } from "../js/purchase-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { PaymentsService } from "../payments/payments-service";
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";
import draggableCharts from "../js/Charts/draggableCharts";
import resizableCharts from "../js/Charts/resizableCharts";
import ChartsApi from "../js/Api/ChartsApi";
import Tvs1ChartDashboardPreference from "../js/Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ChartsEditor from "../js/Charts/ChartsEditor";
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import ApiService from "../js/Api/Module/ApiService";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let _ = require("lodash");

/**
 * Current User ID
 */
const employeeId = Session.get("mySessionEmployeeLoggedID");
const _chartGroup = "Purchases";

/**
 * Build the positions of the widgets
 */
const buildPositions = async () => {
  const charts = $(".chart-visibility");

  for (let i = 0; i <= charts.length; i++) {
    $(charts[i]).attr("position", i);
  }
};

/**
 * This function will save the charts on the dashboard
 */
const saveCharts = async () => {
  /**
   * Lets load all API colections
   */
  const dashboardApis = new ChartsApi(); // Load all dashboard APIS
  buildPositions();

  const charts = $(".chart-visibility");
  //console.log(charts);

  /**
   * @property {Tvs1ChartDashboardPreference[]}
   */
  let chartList = [];

  // now we have to make the post request to save the data in database
  const apiEndpoint = dashboardApis.collection.findByName(
    dashboardApis.collectionNames.Tvs1dashboardpreferences
  );

  Array.prototype.forEach.call(charts, (chart) => {
    //console.log(chart);
    chartList.push(
      new Tvs1ChartDashboardPreference({
        type: "Tvs1dashboardpreferences",
        fields: new Tvs1ChartDashboardPreferenceField({
          Active:
            $(chart).find(".on-editor-change-mode").attr("is-hidden") == true ||
            $(chart).find(".on-editor-change-mode").attr("is-hidden") == "true"
              ? false
              : true,
          ChartID: $(chart).attr("chart-id"),
          ID: $(chart).attr("pref-id"), // This is empty when it is the first time, but the next times it is filled
          EmployeeID: employeeId,
          Chartname: $(chart).attr("chart-name"),
          Position: $(chart).attr("position"),
          ChartGroup: _chartGroup,
          ChartWidth: $(chart).find(".ui-resizable").width(),
        }),
      })
    );
  });

  //console.log(chartList);

  for (const _chart of chartList) {
    // chartList.forEach(async (chart) => {
    //console.log("Saving chart");

    const ApiResponse = await apiEndpoint.fetch(null, {
      method: "POST",
      headers: ApiService.getPostHeaders(),
      body: JSON.stringify(_chart),
    });

    if (ApiResponse.ok == true) {
      const jsonResponse = await ApiResponse.json();
      // console.log(
      //   "Chart: " +
      //     _chart.ChartName +
      //     " will be hidden ? " +
      //     !_chart.fields.Active
      // );
    }
    //});
  }
};

const chartsEditor = new ChartsEditor(
  () => {
    //$("#resetcharts").removeClass("hideelement").addClass("showelement"); // This will show the reset charts button

    $("#btnDone").addClass("showelement");
    $("#btnDone").removeClass("hideelement");
    $("#btnCancel").addClass("showelement");
    $("#btnCancel").removeClass("hideelement");
    // $("#editcharts").addClass("hideelement");
    // $("#editcharts").removeClass("showelement");
    $(".btnchartdropdown").addClass("hideelement");
    $(".btnchartdropdown").removeClass("showelement");

    $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
    $(".on-editor-change-mode").removeClass("hideelement");
    $(".on-editor-change-mode").addClass("showelement");

    $(".sortable-chart-widget-js .card").addClass("dimmedChart");
    $(".py-2").removeClass("dimmedChart");
  },
  () => {
    //$("#resetcharts").addClass("hideelement").removeClass("showelement"); // this will hide it back
    $("#btnDone").addClass("hideelement");
    $("#btnDone").removeClass("showelement");
    $("#btnCancel").addClass("hideelement");
    $("#btnCancel").removeClass("showelement");
    // $("#editcharts").addClass("showelement");
    // $("#editcharts").removeClass("hideelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    $(".on-editor-change-mode").removeClass("showelement");
    $(".on-editor-change-mode").addClass("hideelement");

    var dimmedElements = document.getElementsByClassName("dimmedChart");
    while (dimmedElements.length > 0) {
      dimmedElements[0].classList.remove("dimmedChart");
    }
  }
);

Template.purchasesoverview.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.creditperc = new ReactiveVar();
  templateObject.billperc = new ReactiveVar();
  templateObject.poperc = new ReactiveVar();
  templateObject.billpercTotal = new ReactiveVar();
  templateObject.creditpercTotal = new ReactiveVar();
  templateObject.popercTotal = new ReactiveVar();
});

Template.purchasesoverview.onRendered(function () {
  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();
  let accountService = new AccountService();
  let purchaseService = new PurchaseBoardService();
  let paymentService = new PaymentsService();
  const supplierList = [];
  let purchaseOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];
  let totAmount = 0;
  let totAmountBill = 0;
  let totAmountCredit = 0;

  let totCreditCount = 0;
  let totBillCount = 0;
  let totPOCount = 0;

  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =
    fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  $("#dateFrom").val(fromDate);
  $("#dateTo").val(begunDate);

  var ctx = document.getElementById("myChartCustomer").getContext("2d");

  var date = new Date();
  var month = date.getMonth() + 1;
  date.setDate(1);
  var all_days = [];
  var all_daysNoYear = [];
  while (date.getMonth() + 1 == month) {
    var d =
      date.getFullYear() +
      "-" +
      month.toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    var dnoyear =
      moment(month.toString().padStart(2, "0")).format("MMMM").substring(0, 3) +
      " " +
      date.getDate().toString().padStart(2, "0");
    all_days.push(d);
    all_daysNoYear.push(dnoyear);
    date.setDate(date.getDate() + 1);
  }

  function MakeNegative() {
    $("td").each(function () {
      if (
        $(this)
          .text()
          .indexOf("-" + Currency) >= 0
      )
        $(this).addClass("text-danger");
    });
  }

  Meteor.call(
    "readPrefMethod",
    Session.get("mycloudLogonID"),
    "tblPurchaseOverview",
    function (error, result) {
      if (error) {
      } else {
        if (result) {
          for (let i = 0; i < result.customFields.length; i++) {
            let customcolumn = result.customFields;
            let columData = customcolumn[i].label;
            let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
            let hiddenColumn = customcolumn[i].hidden;
            let columnClass = columHeaderUpdate.split(".")[1];
            let columnWidth = customcolumn[i].width;

            $("th." + columnClass + "").html(columData);
            $("th." + columnClass + "").css("width", "" + columnWidth + "px");
          }
        }
      }
    }
  );

  templateObject.resetData = function (dataVal) {
    window.open("/purchasesoverview?page=last", "_self");
  };

  templateObject.getAllPurchaseOrderAll = function () {
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    let prevMonth11Date = moment()
      .subtract(reportsloadMonths, "months")
      .format("YYYY-MM-DD");

    getVS1Data("TbillReport")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getAllPurchaseOrderListAll(
              prevMonth11Date,
              toDate,
              false,
              initialReportLoad,
              0
            )
            .then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              addVS1Data("TbillReport", JSON.stringify(data));
              let totalExpense = 0;
              let totalBill = 0;
              let totalCredit = 0;
              let totalPO = 0;

              for (let i = 0; i < data.tbillreport.length; i++) {
                let orderType = data.tbillreport[i].Type;
                totalExpense += Number(
                  data.tbillreport[i]["Total Amount (Inc)"]
                );
                if (data.tbillreport[i].Type == "Credit") {
                  totCreditCount++;
                  totalCredit += Number(
                    data.tbillreport[i]["Total Amount (Inc)"]
                  );
                }

                if (data.tbillreport[i].Type == "Bill") {
                  totBillCount++;
                  totalBill += Number(
                    data.tbillreport[i]["Total Amount (Inc)"]
                  );
                }

                if (data.tbillreport[i].Type == "Purchase Order") {
                  totPOCount++;
                  orderType = "PO";
                  totalPO += Number(data.tbillreport[i]["Total Amount (Inc)"]);
                }
                let totalAmountEx =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tbillreport[i]["Total Amount (Ex)"]
                  ) || 0.0;
                let totalTax =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tbillreport[i]["Total Tax"]
                  ) || 0.0;
                let totalAmount =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tbillreport[i]["Total Amount (Inc)"]
                  ) || 0.0;
                let amountPaidCalc =
                  data.tbillreport[i]["Total Amount (Inc)"] -
                  data.tbillreport[i].Balance;
                let totalPaid =
                  utilityService.modifynegativeCurrencyFormat(amountPaidCalc) ||
                  0.0;
                let totalOutstanding =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tbillreport[i].Balance
                  ) || 0.0;
                var dataList = {
                  id: data.tbillreport[i].PurchaseOrderID || "",
                  employee: data.tbillreport[i].Contact || "",
                  sortdate:
                    data.tbillreport[i].OrderDate != ""
                      ? moment(data.tbillreport[i].OrderDate).format(
                          "YYYY/MM/DD"
                        )
                      : data.tbillreport[i].OrderDate,
                  orderdate:
                    data.tbillreport[i].OrderDate != ""
                      ? moment(data.tbillreport[i].OrderDate).format(
                          "DD/MM/YYYY"
                        )
                      : data.tbillreport[i].OrderDate,
                  suppliername: data.tbillreport[i].Company || "",
                  totalamountex: totalAmountEx || 0.0,
                  totaltax: totalTax || 0.0,
                  totalamount: totalAmount || 0.0,
                  totalpaid: totalPaid || 0.0,
                  totaloustanding: totalOutstanding || 0.0,
                  // orderstatus: data.tbillreport[i].OrderStatus || '',
                  type: orderType || "",
                  custfield1: data.tbillreport[i].Phone || "",
                  custfield2: data.tbillreport[i].InvoiceNumber || "",
                  comments: data.tbillreport[i].Comments || "",
                };
                if (data.tbillreport[i].Deleted === false) {
                  dataTableList.push(dataList);
                  if (data.tbillreport[i].Balance != 0) {
                    if (data.tbillreport[i].Type == "Purchase Order") {
                      totAmount += Number(data.tbillreport[i].Balance);
                    }
                    if (data.tbillreport[i].Type == "Bill") {
                      totAmountBill += Number(data.tbillreport[i].Balance);
                    }
                    if (data.tbillreport[i].Type == "Credit") {
                      totAmountCredit += Number(data.tbillreport[i].Balance);
                    }
                  }
                }
                $(".suppAwaitingAmt").text(
                  utilityService.modifynegativeCurrencyFormat(totAmount)
                );
                $(".billAmt").text(
                  utilityService.modifynegativeCurrencyFormat(totAmountBill)
                );
                $(".creditAmt").text(
                  utilityService.modifynegativeCurrencyFormat(totAmountCredit)
                );
                // splashArray.push(dataList);
                //}
              }

              var totalPerc =
                Math.abs(totalCredit) + Math.abs(totalBill) + Math.abs(totalPO);

              var xwidth = (Math.abs(totalCredit) / totalPerc) * 100;
              var ywidth = (Math.abs(totalBill) / totalPerc) * 100;
              var zwidth = (Math.abs(totalPO) / totalPerc) * 100;

              templateObject.creditpercTotal.set(Math.round(xwidth));
              templateObject.billpercTotal.set(Math.round(ywidth));
              templateObject.popercTotal.set(Math.round(zwidth));

              templateObject.datatablerecords.set(dataTableList);
              $(".spExpenseTotal").text(
                utilityService.modifynegativeCurrencyFormat(totalExpense)
              );

              if (templateObject.datatablerecords.get()) {
                Meteor.call(
                  "readPrefMethod",
                  Session.get("mycloudLogonID"),
                  "tblPurchaseOverview",
                  function (error, result) {
                    if (error) {
                    } else {
                      if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                          let customcolumn = result.customFields;
                          let columData = customcolumn[i].label;
                          let columHeaderUpdate = customcolumn[
                            i
                          ].thclass.replace(/ /g, ".");
                          let hiddenColumn = customcolumn[i].hidden;
                          let columnClass = columHeaderUpdate.split(".")[1];
                          let columnWidth = customcolumn[i].width;
                          let columnindex = customcolumn[i].index + 1;

                          if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass("hiddenColumn");
                            $("." + columnClass + "").removeClass("showColumn");
                          } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass(
                              "hiddenColumn"
                            );
                            $("." + columnClass + "").addClass("showColumn");
                          }
                        }
                      }
                    }
                  }
                );

                function MakeNegative() {
                  $("td").each(function () {
                    if (
                      $(this)
                        .text()
                        .indexOf("-" + Currency) >= 0
                    )
                      $(this).addClass("text-danger");
                  });
                }

                var myChart = new Chart(ctx, {
                  type: "pie",
                  data: {
                    labels: ["Credit", "Bill", "Purchase Order"],
                    datasets: [
                      {
                        label: "Credit",
                        backgroundColor: [
                          "#e74a3b",
                          "#f6c23e",
                          "#1cc88a",
                          "#36b9cc",
                        ],
                        borderColor: [
                          "#ffffff",
                          "#ffffff",
                          "#ffffff",
                          "#ffffff",
                        ],
                        data: [totCreditCount, totBillCount, totPOCount],
                      },
                    ],
                  },
                  options: {
                    maintainAspectRatio: true,
                    legend: {
                      display: true,
                      position: "right",
                      reverse: false,
                    },
                    title: {
                      display: false,
                    },
                  },
                });
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              }
              // $('#tblPurchaseOverview').DataTable().destroy();
              // $('#tblPurchaseOverview tbody').empty();
              setTimeout(function () {
                $(".fullScreenSpin").css("display", "none");

                //$.fn.dataTable.moment('DD/MM/YY');
                $("#tblPurchaseOverview")
                  .DataTable({
                    columnDefs: [
                      {
                        type: "date",
                        targets: 0,
                      },
                    ],
                    sDom: "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                      {
                        extend: "excelHtml5",
                        text: "",
                        download: "open",
                        className: "btntabletocsv hiddenColumn",
                        filename:
                          "Purchase Overview List - " + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                          format: {
                            body: function (data, row, column) {
                              if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                              }

                              return column === 1
                                ? data.replace(/<.*?>/gi, "")
                                : data;
                            },
                          },
                        },
                      },
                      {
                        extend: "print",
                        download: "open",
                        className: "btntabletopdf hiddenColumn",
                        text: "",
                        title: "Purchase Overview",
                        filename:
                          "Purchase Overview List - " + moment().format(),
                        exportOptions: {
                          columns: ":visible",
                          stripHtml: false,
                        },
                      },
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: initialDatatableLoad,
                    bLengthChange: false,
                    lengthMenu: [
                      [initialDatatableLoad, -1],
                      [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    order: [
                      [0, "desc"],
                      [2, "desc"],
                    ],
                    action: function () {
                      $("#tblPurchaseOverview").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function (oSettings) {
                      let checkurlIgnoreDate =
                        FlowRouter.current().queryParams.ignoredate;
                      //if(checkurlIgnoreDate == 'true'){

                      //}else{
                      $(".paginate_button.page-item").removeClass("disabled");
                      $("#tblPurchaseOverview_ellipsis").addClass("disabled");

                      if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                          $(".paginate_button.page-item.previous").addClass(
                            "disabled"
                          );
                          $(".paginate_button.page-item.next").addClass(
                            "disabled"
                          );
                        }
                      } else {
                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $(".paginate_button.page-item.next").addClass(
                          "disabled"
                        );
                      }
                      $(
                        ".paginate_button.next:not(.disabled)",
                        this.api().table().container()
                      ).on("click", function () {
                        $(".fullScreenSpin").css("display", "inline-block");
                        let dataLenght = oSettings._iDisplayLength;

                        var dateFrom = new Date(
                          $("#dateFrom").datepicker("getDate")
                        );
                        var dateTo = new Date(
                          $("#dateTo").datepicker("getDate")
                        );

                        let formatDateFrom =
                          dateFrom.getFullYear() +
                          "-" +
                          (dateFrom.getMonth() + 1) +
                          "-" +
                          dateFrom.getDate();
                        let formatDateTo =
                          dateTo.getFullYear() +
                          "-" +
                          (dateTo.getMonth() + 1) +
                          "-" +
                          dateTo.getDate();
                        if (checkurlIgnoreDate == "true") {
                          sideBarService
                            .getAllPurchaseOrderListAll(
                              formatDateFrom,
                              formatDateTo,
                              true,
                              initialDatatableLoad,
                              oSettings.fnRecordsDisplay()
                            )
                            .then(function (dataObjectnew) {
                              getVS1Data("TbillReport")
                                .then(function (dataObjectold) {
                                  if (dataObjectold.length == 0) {
                                  } else {
                                    let dataOld = JSON.parse(
                                      dataObjectold[0].data
                                    );
                                    var thirdaryData = $.merge(
                                      $.merge([], dataObjectnew.tbillreport),
                                      dataOld.tbillreport
                                    );
                                    let objCombineData = {
                                      Params: dataOld.Params,
                                      tbillreport: thirdaryData,
                                    };

                                    addVS1Data(
                                      "TbillReport",
                                      JSON.stringify(objCombineData)
                                    )
                                      .then(function (datareturn) {
                                        templateObject.resetData(
                                          objCombineData
                                        );
                                        $(".fullScreenSpin").css(
                                          "display",
                                          "none"
                                        );
                                      })
                                      .catch(function (err) {
                                        $(".fullScreenSpin").css(
                                          "display",
                                          "none"
                                        );
                                      });
                                  }
                                })
                                .catch(function (err) {});
                            })
                            .catch(function (err) {
                              $(".fullScreenSpin").css("display", "none");
                            });
                        } else {
                          sideBarService
                            .getAllPurchaseOrderListAll(
                              formatDateFrom,
                              formatDateTo,
                              false,
                              initialDatatableLoad,
                              oSettings.fnRecordsDisplay()
                            )
                            .then(function (dataObjectnew) {
                              getVS1Data("TbillReport")
                                .then(function (dataObjectold) {
                                  if (dataObjectold.length == 0) {
                                  } else {
                                    let dataOld = JSON.parse(
                                      dataObjectold[0].data
                                    );
                                    var thirdaryData = $.merge(
                                      $.merge([], dataObjectnew.tbillreport),
                                      dataOld.tbillreport
                                    );
                                    let objCombineData = {
                                      Params: dataOld.Params,
                                      tbillreport: thirdaryData,
                                    };

                                    addVS1Data(
                                      "TbillReport",
                                      JSON.stringify(objCombineData)
                                    )
                                      .then(function (datareturn) {
                                        templateObject.resetData(
                                          objCombineData
                                        );
                                        $(".fullScreenSpin").css(
                                          "display",
                                          "none"
                                        );
                                      })
                                      .catch(function (err) {
                                        $(".fullScreenSpin").css(
                                          "display",
                                          "none"
                                        );
                                      });
                                  }
                                })
                                .catch(function (err) {});
                            })
                            .catch(function (err) {
                              $(".fullScreenSpin").css("display", "none");
                            });
                        }
                      });

                      //}
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },
                    fnInitComplete: function () {
                      let urlParametersPage =
                        FlowRouter.current().queryParams.page;
                      if (
                        urlParametersPage ||
                        FlowRouter.current().queryParams.ignoredate
                      ) {
                        this.fnPageChange("last");
                      }
                      $(
                        "<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshPurchaseOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                      ).insertAfter("#tblPurchaseOverview_filter");

                      $(".myvarFilterForm").appendTo(".colDateFilter");
                    },
                    fnInfoCallback: function (
                      oSettings,
                      iStart,
                      iEnd,
                      iMax,
                      iTotal,
                      sPre
                    ) {
                      let countTableData = data.Params.Count || 0; //get count from API data

                      return (
                        "Showing " +
                        iStart +
                        " to " +
                        iEnd +
                        " of " +
                        countTableData
                      );
                    },
                  })
                  .on("page", function () {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  })
                  .on("column-reorder", function () {});
                $(".fullScreenSpin").css("display", "none");
                $("div.dataTables_filter input").addClass(
                  "form-control form-control-sm"
                );
              }, 0);

              var columns = $("#tblPurchaseOverview th");
              let sTible = "";
              let sWidth = "";
              let sIndex = "";
              let sVisible = "";
              let columVisible = false;
              let sClass = "";
              $.each(columns, function (i, v) {
                if (v.hidden == false) {
                  columVisible = true;
                }
                if (v.className.includes("hiddenColumn")) {
                  columVisible = false;
                }
                sWidth = v.style.width.replace("px", "");

                let datatablerecordObj = {
                  sTitle: v.innerText || "",
                  sWidth: sWidth || "",
                  sIndex: v.cellIndex || "",
                  sVisible: columVisible || false,
                  sClass: v.className || "",
                };
                tableHeaderList.push(datatablerecordObj);
              });
              templateObject.tableheaderrecords.set(tableHeaderList);
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
              $("#tblPurchaseOverview tbody").on("click", "tr", function () {
                var listData = $(this).closest("tr").attr("id");
                var transactiontype = $(event.target)
                  .closest("tr")
                  .find(".colType")
                  .text();
                if (listData && transactiontype) {
                  if (transactiontype === "Purchase Order") {
                    FlowRouter.go("/purchaseordercard?id=" + listData);
                  } else if (transactiontype === "Bill") {
                    FlowRouter.go("/billcard?id=" + listData);
                  } else if (transactiontype === "Credit") {
                    FlowRouter.go("/creditcard?id=" + listData);
                  } else if (transactiontype === "PO") {
                    FlowRouter.go("/purchaseordercard?id=" + listData);
                  } else {
                    //FlowRouter.go('/purchaseordercard?id=' + listData);
                  }
                }

                // if(listData){
                //   FlowRouter.go('/purchaseordercard?id=' + listData);
                // }
              });

              let filterData = _.filter(data.tbillreport, function (data) {
                return data.Company;
              });

              let graphData = _.orderBy(filterData, "OrderDate");

              let daysDataArray = [];
              let currentDateNow = new Date();

              let initialData = _.filter(
                graphData,
                (obj) =>
                  moment(obj.OrderDate).format("YYYY-MM-DD") ===
                  moment(currentDateNow).format("YYYY-MM-DD")
              );
              let groupData = _.omit(_.groupBy(initialData, "OrderDate"), [""]);
            })
            .catch(function (err) {
              var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                  labels: ["Credit", "Bill", "Purchase Order"],
                  datasets: [
                    {
                      label: "Credit",
                      backgroundColor: [
                        "#e74a3b",
                        "#f6c23e",
                        "#1cc88a",
                        "#36b9cc",
                      ],
                      borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                      data: ["7", "20", "73"],
                    },
                  ],
                },
                options: {
                  maintainAspectRatio: true,
                  legend: {
                    display: true,
                    position: "right",
                    reverse: false,
                  },
                  title: {
                    display: false,
                  },
                },
              });
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tbillreport;
          let lineItems = [];
          let lineItemObj = {};

          if (data.Params.IgnoreDates == true) {
            $("#dateFrom").attr("readonly", true);
            $("#dateTo").attr("readonly", true);
            FlowRouter.go("/purchasesoverview?ignoredate=true");
          } else {
            $("#dateFrom").val(
              data.Params.DateFrom != ""
                ? moment(data.Params.DateFrom).format("DD/MM/YYYY")
                : data.Params.DateFrom
            );
            $("#dateTo").val(
              data.Params.DateTo != ""
                ? moment(data.Params.DateTo).format("DD/MM/YYYY")
                : data.Params.DateTo
            );
          }
          let totalExpense = 0;
          let totalBill = 0;
          let totalCredit = 0;
          let totalPO = 0;
          $(".fullScreenSpin").css("display", "none");
          for (let i = 0; i < useData.length; i++) {
            totalExpense += Number(useData[i]["Total Amount (Inc)"]);
            let orderType = useData[i].Type;
            if (useData[i].Type == "Credit") {
              totCreditCount++;
              totalCredit += Number(useData[i]["Total Amount (Inc)"]);
            }

            if (useData[i].Type == "Bill") {
              totBillCount++;
              totalBill += Number(useData[i]["Total Amount (Inc)"]);
            }

            if (useData[i].Type == "Purchase Order") {
              totPOCount++;
              orderType = "PO";
              totalPO += Number(useData[i]["Total Amount (Inc)"]);
            }
            let totalAmountEx =
              utilityService.modifynegativeCurrencyFormat(
                useData[i]["Total Amount (Ex)"]
              ) || 0.0;
            let totalTax =
              utilityService.modifynegativeCurrencyFormat(
                useData[i]["Total Tax"]
              ) || 0.0;
            let totalAmount =
              utilityService.modifynegativeCurrencyFormat(
                useData[i]["Total Amount (Inc)"]
              ) || 0.0;
            let amountPaidCalc =
              useData[i]["Total Amount (Inc)"] - useData[i].Balance;
            let totalPaid =
              utilityService.modifynegativeCurrencyFormat(amountPaidCalc) ||
              0.0;
            let totalOutstanding =
              utilityService.modifynegativeCurrencyFormat(useData[i].Balance) ||
              0.0;
            var dataList = {
              id: useData[i].PurchaseOrderID || "",
              employee: useData[i].Contact || "",
              sortdate:
                useData[i].OrderDate != ""
                  ? moment(useData[i].OrderDate).format("YYYY/MM/DD")
                  : useData[i].OrderDate,
              orderdate:
                useData[i].OrderDate != ""
                  ? moment(useData[i].OrderDate).format("DD/MM/YYYY")
                  : useData[i].OrderDate,
              suppliername: useData[i].Company || "",
              totalamountex: totalAmountEx || 0.0,
              totaltax: totalTax || 0.0,
              totalamount: totalAmount || 0.0,
              totalpaid: totalPaid || 0.0,
              totaloustanding: totalOutstanding || 0.0,
              // orderstatus: useData[i].OrderStatus || '',
              type: orderType || "",
              custfield1: useData[i].Phone || "",
              custfield2: useData[i].InvoiceNumber || "",
              comments: useData[i].Comments || "",
            };
            //if (useData[i].Deleted === false) {
            dataTableList.push(dataList);
            //if (useData[i].Balance != 0) {
            if (useData[i].Type == "Purchase Order") {
              totAmount += Number(useData[i].Balance);
            }

            if (useData[i].Type == "Bill") {
              totAmountBill += Number(useData[i].Balance);
            }

            if (useData[i].Type == "Credit") {
              totAmountCredit += Number(useData[i].Balance);
            }
            //}
            //}
            $(".suppAwaitingAmt").text(
              utilityService.modifynegativeCurrencyFormat(totAmount)
            );
            $(".billAmt").text(
              utilityService.modifynegativeCurrencyFormat(totAmountBill)
            );
            $(".creditAmt").text(
              utilityService.modifynegativeCurrencyFormat(totAmountCredit)
            );
            // splashArray.push(dataList);
            //}
          }

          var totalPerc =
            Math.abs(totalCredit) + Math.abs(totalBill) + Math.abs(totalPO);

          var xwidth = (Math.abs(totalCredit) / totalPerc) * 100;
          var ywidth = (Math.abs(totalBill) / totalPerc) * 100;
          var zwidth = (Math.abs(totalPO) / totalPerc) * 100;

          templateObject.creditpercTotal.set(Math.round(xwidth));
          templateObject.billpercTotal.set(Math.round(ywidth));
          templateObject.popercTotal.set(Math.round(zwidth));

          templateObject.datatablerecords.set(dataTableList);
          $(".spExpenseTotal").text(
            utilityService.modifynegativeCurrencyFormat(totalExpense)
          );

          if (templateObject.datatablerecords.get()) {
            Meteor.call(
              "readPrefMethod",
              Session.get("mycloudLogonID"),
              "tblPurchaseOverview",
              function (error, result) {
                if (error) {
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass.replace(
                        / /g,
                        "."
                      );
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.split(".")[1];
                      let columnWidth = customcolumn[i].width;
                      let columnindex = customcolumn[i].index + 1;

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass("hiddenColumn");
                        $("." + columnClass + "").removeClass("showColumn");
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass("hiddenColumn");
                        $("." + columnClass + "").addClass("showColumn");
                      }
                    }
                  }
                }
              }
            );

            function MakeNegative() {
              $("td").each(function () {
                if (
                  $(this)
                    .text()
                    .indexOf("-" + Currency) >= 0
                )
                  $(this).addClass("text-danger");
              });
            }

            var myChart = new Chart(ctx, {
              type: "pie",
              data: {
                labels: ["Credit", "Bill", "Purchase Order"],
                datasets: [
                  {
                    label: "Credit",
                    backgroundColor: [
                      "#e74a3b",
                      "#f6c23e",
                      "#1cc88a",
                      "#36b9cc",
                    ],
                    borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                    data: [totCreditCount, totBillCount, totPOCount],
                  },
                ],
              },
              options: {
                maintainAspectRatio: true,
                legend: {
                  display: true,
                  position: "right",
                  reverse: false,
                },
                title: {
                  display: false,
                },
              },
            });

            setTimeout(function () {
              MakeNegative();
            }, 100);
          }
          // $('#tblPurchaseOverview').DataTable().destroy();
          // $('#tblPurchaseOverview tbody').empty();
          setTimeout(function () {
            $(".fullScreenSpin").css("display", "none");

            //$.fn.dataTable.moment('DD/MM/YY');
            $("#tblPurchaseOverview")
              .DataTable({
                columnDefs: [
                  {
                    type: "date",
                    targets: 0,
                  },
                ],
                sDom: "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: "excelHtml5",
                    text: "",
                    download: "open",
                    className: "btntabletocsv hiddenColumn",
                    filename: "Purchase Overview List - " + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                      format: {
                        body: function (data, row, column) {
                          if (data.includes("</span>")) {
                            var res = data.split("</span>");
                            data = res[1];
                          }

                          return column === 1
                            ? data.replace(/<.*?>/gi, "")
                            : data;
                        },
                      },
                    },
                  },
                  {
                    extend: "print",
                    download: "open",
                    className: "btntabletopdf hiddenColumn",
                    text: "",
                    title: "Purchase Overview",
                    filename: "Purchase Overview List - " + moment().format(),
                    exportOptions: {
                      columns: ":visible",
                      stripHtml: false,
                    },
                  },
                ],
                select: true,
                destroy: true,
                colReorder: true,
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                bLengthChange: false,
                lengthMenu: [
                  [initialDatatableLoad, -1],
                  [initialDatatableLoad, "All"],
                ],
                info: true,
                responsive: true,
                order: [
                  [0, "desc"],
                  [2, "desc"],
                ],
                action: function () {
                  $("#tblPurchaseOverview").DataTable().ajax.reload();
                },
                fnDrawCallback: function (oSettings) {
                  let checkurlIgnoreDate =
                    FlowRouter.current().queryParams.ignoredate;
                  //if(checkurlIgnoreDate == 'true'){

                  //}else{
                  $(".paginate_button.page-item").removeClass("disabled");
                  $("#tblPurchaseOverview_ellipsis").addClass("disabled");

                  if (oSettings._iDisplayLength == -1) {
                    if (oSettings.fnRecordsDisplay() > 150) {
                      $(".paginate_button.page-item.previous").addClass(
                        "disabled"
                      );
                      $(".paginate_button.page-item.next").addClass("disabled");
                    }
                  } else {
                  }
                  if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                    $(".paginate_button.page-item.next").addClass("disabled");
                  }
                  $(
                    ".paginate_button.next:not(.disabled)",
                    this.api().table().container()
                  ).on("click", function () {
                    $(".fullScreenSpin").css("display", "inline-block");
                    let dataLenght = oSettings._iDisplayLength;

                    var dateFrom = new Date(
                      $("#dateFrom").datepicker("getDate")
                    );
                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                    let formatDateFrom =
                      dateFrom.getFullYear() +
                      "-" +
                      (dateFrom.getMonth() + 1) +
                      "-" +
                      dateFrom.getDate();
                    let formatDateTo =
                      dateTo.getFullYear() +
                      "-" +
                      (dateTo.getMonth() + 1) +
                      "-" +
                      dateTo.getDate();
                    if (checkurlIgnoreDate == "true") {
                      sideBarService
                        .getAllPurchaseOrderListAll(
                          formatDateFrom,
                          formatDateTo,
                          true,
                          initialDatatableLoad,
                          oSettings.fnRecordsDisplay()
                        )
                        .then(function (dataObjectnew) {
                          getVS1Data("TbillReport")
                            .then(function (dataObjectold) {
                              if (dataObjectold.length == 0) {
                              } else {
                                let dataOld = JSON.parse(dataObjectold[0].data);
                                var thirdaryData = $.merge(
                                  $.merge([], dataObjectnew.tbillreport),
                                  dataOld.tbillreport
                                );
                                let objCombineData = {
                                  Params: dataOld.Params,
                                  tbillreport: thirdaryData,
                                };

                                addVS1Data(
                                  "TbillReport",
                                  JSON.stringify(objCombineData)
                                )
                                  .then(function (datareturn) {
                                    templateObject.resetData(objCombineData);
                                    $(".fullScreenSpin").css("display", "none");
                                  })
                                  .catch(function (err) {
                                    $(".fullScreenSpin").css("display", "none");
                                  });
                              }
                            })
                            .catch(function (err) {});
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    } else {
                      sideBarService
                        .getAllPurchaseOrderListAll(
                          formatDateFrom,
                          formatDateTo,
                          false,
                          initialDatatableLoad,
                          oSettings.fnRecordsDisplay()
                        )
                        .then(function (dataObjectnew) {
                          getVS1Data("TbillReport")
                            .then(function (dataObjectold) {
                              if (dataObjectold.length == 0) {
                              } else {
                                let dataOld = JSON.parse(dataObjectold[0].data);
                                var thirdaryData = $.merge(
                                  $.merge([], dataObjectnew.tbillreport),
                                  dataOld.tbillreport
                                );
                                let objCombineData = {
                                  Params: dataOld.Params,
                                  tbillreport: thirdaryData,
                                };

                                addVS1Data(
                                  "TbillReport",
                                  JSON.stringify(objCombineData)
                                )
                                  .then(function (datareturn) {
                                    templateObject.resetData(objCombineData);
                                    $(".fullScreenSpin").css("display", "none");
                                  })
                                  .catch(function (err) {
                                    $(".fullScreenSpin").css("display", "none");
                                  });
                              }
                            })
                            .catch(function (err) {});
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    }
                  });

                  //}
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                },
                fnInitComplete: function () {
                  let urlParametersPage = FlowRouter.current().queryParams.page;
                  if (
                    urlParametersPage ||
                    FlowRouter.current().queryParams.ignoredate
                  ) {
                    this.fnPageChange("last");
                  }
                  $(
                    "<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshPurchaseOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                  ).insertAfter("#tblPurchaseOverview_filter");

                  $(".myvarFilterForm").appendTo(".colDateFilter");
                },
                fnInfoCallback: function (
                  oSettings,
                  iStart,
                  iEnd,
                  iMax,
                  iTotal,
                  sPre
                ) {
                  let countTableData = data.Params.Count || 0; //get count from API data

                  return (
                    "Showing " +
                    iStart +
                    " to " +
                    iEnd +
                    " of " +
                    countTableData
                  );
                },
              })
              .on("page", function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              })
              .on("column-reorder", function () {});
            $(".fullScreenSpin").css("display", "none");
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          }, 0);

          var columns = $("#tblPurchaseOverview th");
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function (i, v) {
            if (v.hidden == false) {
              columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
              columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
              sTitle: v.innerText || "",
              sWidth: sWidth || "",
              sIndex: v.cellIndex || "",
              sVisible: columVisible || false,
              sClass: v.className || "",
            };
            tableHeaderList.push(datatablerecordObj);
          });
          templateObject.tableheaderrecords.set(tableHeaderList);
          $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
          );
          $("#tblPurchaseOverview tbody").on("click", "tr", function () {
            var listData = $(this).closest("tr").attr("id");
            var transactiontype = $(event.target)
              .closest("tr")
              .find(".colType")
              .text();
            if (listData && transactiontype) {
              if (transactiontype === "Purchase Order") {
                FlowRouter.go("/purchaseordercard?id=" + listData);
              } else if (transactiontype === "Bill") {
                FlowRouter.go("/billcard?id=" + listData);
              } else if (transactiontype === "Credit") {
                FlowRouter.go("/creditcard?id=" + listData);
              } else if (transactiontype === "PO") {
                FlowRouter.go("/purchaseordercard?id=" + listData);
              } else {
                //FlowRouter.go('/purchaseordercard?id=' + listData);
              }
            }

            // if(listData){
            //   FlowRouter.go('/purchaseordercard?id=' + listData);
            // }
          });

          let filterData = _.filter(useData, function (data) {
            return data.Company;
          });

          let graphData = _.orderBy(filterData, "OrderDate");

          let daysDataArray = [];
          let currentDateNow = new Date();

          let initialData = _.filter(
            graphData,
            (obj) =>
              moment(obj.OrderDate).format("YYYY-MM-DD") ===
              moment(currentDateNow).format("YYYY-MM-DD")
          );
          let groupData = _.omit(_.groupBy(initialData, "OrderDate"), [""]);
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllPurchaseOrderListAll(
            prevMonth11Date,
            toDate,
            false,
            initialReportLoad,
            0
          )
          .then(function (data) {
            addVS1Data("TbillReport", JSON.stringify(data));
            let lineItems = [];
            let lineItemObj = {};

            let totalExpense = 0;
            let totalBill = 0;
            let totalCredit = 0;
            let totalPO = 0;

            for (let i = 0; i < data.tbillreport.length; i++) {
              let orderType = data.tbillreport[i].Type;
              totalExpense += Number(data.tbillreport[i]["Total Amount (Inc)"]);
              if (data.tbillreport[i].Type == "Credit") {
                totCreditCount++;
                totalCredit += Number(
                  data.tbillreport[i]["Total Amount (Inc)"]
                );
              }

              if (data.tbillreport[i].Type == "Bill") {
                totBillCount++;
                totalBill += Number(data.tbillreport[i]["Total Amount (Inc)"]);
              }

              if (data.tbillreport[i].Type == "Purchase Order") {
                totPOCount++;
                orderType = "PO";
                totalPO += Number(data.tbillreport[i]["Total Amount (Inc)"]);
              }
              let totalAmountEx =
                utilityService.modifynegativeCurrencyFormat(
                  data.tbillreport[i]["Total Amount (Ex)"]
                ) || 0.0;
              let totalTax =
                utilityService.modifynegativeCurrencyFormat(
                  data.tbillreport[i]["Total Tax"]
                ) || 0.0;
              let totalAmount =
                utilityService.modifynegativeCurrencyFormat(
                  data.tbillreport[i]["Total Amount (Inc)"]
                ) || 0.0;
              let amountPaidCalc =
                data.tbillreport[i]["Total Amount (Inc)"] -
                data.tbillreport[i].Balance;
              let totalPaid =
                utilityService.modifynegativeCurrencyFormat(amountPaidCalc) ||
                0.0;
              let totalOutstanding =
                utilityService.modifynegativeCurrencyFormat(
                  data.tbillreport[i].Balance
                ) || 0.0;
              var dataList = {
                id: data.tbillreport[i].PurchaseOrderID || "",
                employee: data.tbillreport[i].Contact || "",
                sortdate:
                  data.tbillreport[i].OrderDate != ""
                    ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD")
                    : data.tbillreport[i].OrderDate,
                orderdate:
                  data.tbillreport[i].OrderDate != ""
                    ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY")
                    : data.tbillreport[i].OrderDate,
                suppliername: data.tbillreport[i].Company || "",
                totalamountex: totalAmountEx || 0.0,
                totaltax: totalTax || 0.0,
                totalamount: totalAmount || 0.0,
                totalpaid: totalPaid || 0.0,
                totaloustanding: totalOutstanding || 0.0,
                // orderstatus: data.tbillreport[i].OrderStatus || '',
                type: orderType || "",
                custfield1: data.tbillreport[i].Phone || "",
                custfield2: data.tbillreport[i].InvoiceNumber || "",
                comments: data.tbillreport[i].Comments || "",
              };
              if (data.tbillreport[i].Deleted === false) {
                dataTableList.push(dataList);
                if (data.tbillreport[i].Balance != 0) {
                  if (data.tbillreport[i].Type == "Purchase Order") {
                    totAmount += Number(data.tbillreport[i].Balance);
                  }
                  if (data.tbillreport[i].Type == "Bill") {
                    totAmountBill += Number(data.tbillreport[i].Balance);
                  }
                  if (data.tbillreport[i].Type == "Credit") {
                    totAmountCredit += Number(data.tbillreport[i].Balance);
                  }
                }
              }
              $(".suppAwaitingAmt").text(
                utilityService.modifynegativeCurrencyFormat(totAmount)
              );
              $(".billAmt").text(
                utilityService.modifynegativeCurrencyFormat(totAmountBill)
              );
              $(".creditAmt").text(
                utilityService.modifynegativeCurrencyFormat(totAmountCredit)
              );
              // splashArray.push(dataList);
              //}
            }

            var totalPerc =
              Math.abs(totalCredit) + Math.abs(totalBill) + Math.abs(totalPO);

            var xwidth = (Math.abs(totalCredit) / totalPerc) * 100;
            var ywidth = (Math.abs(totalBill) / totalPerc) * 100;
            var zwidth = (Math.abs(totalPO) / totalPerc) * 100;

            templateObject.creditpercTotal.set(Math.round(xwidth));
            templateObject.billpercTotal.set(Math.round(ywidth));
            templateObject.popercTotal.set(Math.round(zwidth));

            templateObject.datatablerecords.set(dataTableList);
            $(".spExpenseTotal").text(
              utilityService.modifynegativeCurrencyFormat(totalExpense)
            );

            if (templateObject.datatablerecords.get()) {
              Meteor.call(
                "readPrefMethod",
                Session.get("mycloudLogonID"),
                "tblPurchaseOverview",
                function (error, result) {
                  if (error) {
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass.replace(
                          / /g,
                          "."
                        );
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.split(".")[1];
                        let columnWidth = customcolumn[i].width;
                        let columnindex = customcolumn[i].index + 1;

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass("hiddenColumn");
                          $("." + columnClass + "").removeClass("showColumn");
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass("hiddenColumn");
                          $("." + columnClass + "").addClass("showColumn");
                        }
                      }
                    }
                  }
                }
              );

              function MakeNegative() {
                $("td").each(function () {
                  if (
                    $(this)
                      .text()
                      .indexOf("-" + Currency) >= 0
                  )
                    $(this).addClass("text-danger");
                });
              }

              var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                  labels: ["Credit", "Bill", "Purchase Order"],
                  datasets: [
                    {
                      label: "Credit",
                      backgroundColor: [
                        "#e74a3b",
                        "#f6c23e",
                        "#1cc88a",
                        "#36b9cc",
                      ],
                      borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                      data: [totCreditCount, totBillCount, totPOCount],
                    },
                  ],
                },
                options: {
                  maintainAspectRatio: true,
                  legend: {
                    display: true,
                    position: "right",
                    reverse: false,
                  },
                  title: {
                    display: false,
                  },
                },
              });
              setTimeout(function () {
                MakeNegative();
              }, 100);
            }
            // $('#tblPurchaseOverview').DataTable().destroy();
            // $('#tblPurchaseOverview tbody').empty();
            setTimeout(function () {
              $(".fullScreenSpin").css("display", "none");

              //$.fn.dataTable.moment('DD/MM/YY');
              $("#tblPurchaseOverview")
                .DataTable({
                  columnDefs: [
                    {
                      type: "date",
                      targets: 0,
                    },
                  ],
                  sDom: "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                    {
                      extend: "excelHtml5",
                      text: "",
                      download: "open",
                      className: "btntabletocsv hiddenColumn",
                      filename: "Purchase Overview List - " + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                        format: {
                          body: function (data, row, column) {
                            if (data.includes("</span>")) {
                              var res = data.split("</span>");
                              data = res[1];
                            }

                            return column === 1
                              ? data.replace(/<.*?>/gi, "")
                              : data;
                          },
                        },
                      },
                    },
                    {
                      extend: "print",
                      download: "open",
                      className: "btntabletopdf hiddenColumn",
                      text: "",
                      title: "Purchase Overview",
                      filename: "Purchase Overview List - " + moment().format(),
                      exportOptions: {
                        columns: ":visible",
                        stripHtml: false,
                      },
                    },
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: initialDatatableLoad,
                  bLengthChange: false,
                  lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                  ],
                  info: true,
                  responsive: true,
                  order: [
                    [0, "desc"],
                    [2, "desc"],
                  ],
                  action: function () {
                    $("#tblPurchaseOverview").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function (oSettings) {
                    let checkurlIgnoreDate =
                      FlowRouter.current().queryParams.ignoredate;
                    //if(checkurlIgnoreDate == 'true'){

                    //}else{
                    $(".paginate_button.page-item").removeClass("disabled");
                    $("#tblPurchaseOverview_ellipsis").addClass("disabled");

                    if (oSettings._iDisplayLength == -1) {
                      if (oSettings.fnRecordsDisplay() > 150) {
                        $(".paginate_button.page-item.previous").addClass(
                          "disabled"
                        );
                        $(".paginate_button.page-item.next").addClass(
                          "disabled"
                        );
                      }
                    } else {
                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                      $(".paginate_button.page-item.next").addClass("disabled");
                    }
                    $(
                      ".paginate_button.next:not(.disabled)",
                      this.api().table().container()
                    ).on("click", function () {
                      $(".fullScreenSpin").css("display", "inline-block");
                      let dataLenght = oSettings._iDisplayLength;

                      var dateFrom = new Date(
                        $("#dateFrom").datepicker("getDate")
                      );
                      var dateTo = new Date($("#dateTo").datepicker("getDate"));

                      let formatDateFrom =
                        dateFrom.getFullYear() +
                        "-" +
                        (dateFrom.getMonth() + 1) +
                        "-" +
                        dateFrom.getDate();
                      let formatDateTo =
                        dateTo.getFullYear() +
                        "-" +
                        (dateTo.getMonth() + 1) +
                        "-" +
                        dateTo.getDate();
                      if (checkurlIgnoreDate == "true") {
                        sideBarService
                          .getAllPurchaseOrderListAll(
                            formatDateFrom,
                            formatDateTo,
                            true,
                            initialDatatableLoad,
                            oSettings.fnRecordsDisplay()
                          )
                          .then(function (dataObjectnew) {
                            getVS1Data("TbillReport")
                              .then(function (dataObjectold) {
                                if (dataObjectold.length == 0) {
                                } else {
                                  let dataOld = JSON.parse(
                                    dataObjectold[0].data
                                  );
                                  var thirdaryData = $.merge(
                                    $.merge([], dataObjectnew.tbillreport),
                                    dataOld.tbillreport
                                  );
                                  let objCombineData = {
                                    Params: dataOld.Params,
                                    tbillreport: thirdaryData,
                                  };

                                  addVS1Data(
                                    "TbillReport",
                                    JSON.stringify(objCombineData)
                                  )
                                    .then(function (datareturn) {
                                      templateObject.resetData(objCombineData);
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    })
                                    .catch(function (err) {
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    });
                                }
                              })
                              .catch(function (err) {});
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      } else {
                        sideBarService
                          .getAllPurchaseOrderListAll(
                            formatDateFrom,
                            formatDateTo,
                            false,
                            initialDatatableLoad,
                            oSettings.fnRecordsDisplay()
                          )
                          .then(function (dataObjectnew) {
                            getVS1Data("TbillReport")
                              .then(function (dataObjectold) {
                                if (dataObjectold.length == 0) {
                                } else {
                                  let dataOld = JSON.parse(
                                    dataObjectold[0].data
                                  );
                                  var thirdaryData = $.merge(
                                    $.merge([], dataObjectnew.tbillreport),
                                    dataOld.tbillreport
                                  );
                                  let objCombineData = {
                                    Params: dataOld.Params,
                                    tbillreport: thirdaryData,
                                  };

                                  addVS1Data(
                                    "TbillReport",
                                    JSON.stringify(objCombineData)
                                  )
                                    .then(function (datareturn) {
                                      templateObject.resetData(objCombineData);
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    })
                                    .catch(function (err) {
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    });
                                }
                              })
                              .catch(function (err) {});
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      }
                    });

                    //}
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },
                  fnInitComplete: function () {
                    let urlParametersPage =
                      FlowRouter.current().queryParams.page;
                    if (
                      urlParametersPage ||
                      FlowRouter.current().queryParams.ignoredate
                    ) {
                      this.fnPageChange("last");
                    }
                    $(
                      "<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshPurchaseOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                    ).insertAfter("#tblPurchaseOverview_filter");

                    $(".myvarFilterForm").appendTo(".colDateFilter");
                  },
                  fnInfoCallback: function (
                    oSettings,
                    iStart,
                    iEnd,
                    iMax,
                    iTotal,
                    sPre
                  ) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return (
                      "Showing " +
                      iStart +
                      " to " +
                      iEnd +
                      " of " +
                      countTableData
                    );
                  },
                })
                .on("page", function () {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                })
                .on("column-reorder", function () {});
              $(".fullScreenSpin").css("display", "none");
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
            }, 0);

            var columns = $("#tblPurchaseOverview th");
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function (i, v) {
              if (v.hidden == false) {
                columVisible = true;
              }
              if (v.className.includes("hiddenColumn")) {
                columVisible = false;
              }
              sWidth = v.style.width.replace("px", "");

              let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
              };
              tableHeaderList.push(datatablerecordObj);
            });
            templateObject.tableheaderrecords.set(tableHeaderList);
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
            $("#tblPurchaseOverview tbody").on("click", "tr", function () {
              var listData = $(this).closest("tr").attr("id");
              var transactiontype = $(event.target)
                .closest("tr")
                .find(".colType")
                .text();
              if (listData && transactiontype) {
                if (transactiontype === "Purchase Order") {
                  FlowRouter.go("/purchaseordercard?id=" + listData);
                } else if (transactiontype === "Bill") {
                  FlowRouter.go("/billcard?id=" + listData);
                } else if (transactiontype === "Credit") {
                  FlowRouter.go("/creditcard?id=" + listData);
                } else if (transactiontype === "PO") {
                  FlowRouter.go("/purchaseordercard?id=" + listData);
                } else {
                  //FlowRouter.go('/purchaseordercard?id=' + listData);
                }
              }

              // if(listData){
              //   FlowRouter.go('/purchaseordercard?id=' + listData);
              // }
            });

            let filterData = _.filter(data.tbillreport, function (data) {
              return data.Company;
            });

            let graphData = _.orderBy(filterData, "OrderDate");

            let daysDataArray = [];
            let currentDateNow = new Date();

            let initialData = _.filter(
              graphData,
              (obj) =>
                moment(obj.OrderDate).format("YYYY-MM-DD") ===
                moment(currentDateNow).format("YYYY-MM-DD")
            );
            let groupData = _.omit(_.groupBy(initialData, "OrderDate"), [""]);
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $(".fullScreenSpin").css("display", "none");
            // Meteor._reload.reload();
          });
      });
  };

  templateObject.getAllPurchaseOrderAll();
  templateObject.getAllFilterPurchasesData = function (
    fromDate,
    toDate,
    ignoreDate
  ) {
    sideBarService
      .getAllPurchaseOrderListAll(
        fromDate,
        toDate,
        ignoreDate,
        initialReportLoad,
        0
      )
      .then(function (data) {
        addVS1Data("TbillReport", JSON.stringify(data))
          .then(function (datareturn) {
            window.open(
              "/purchasesoverview?toDate=" +
                toDate +
                "&fromDate=" +
                fromDate +
                "&ignoredate=" +
                ignoreDate,
              "_self"
            );
          })
          .catch(function (err) {
            location.reload();
          });
      })
      .catch(function (err) {
        var myChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Credit", "Bill", "Purchase Order"],
            datasets: [
              {
                label: "Credit",
                backgroundColor: ["#e74a3b", "#f6c23e", "#1cc88a", "#36b9cc"],
                borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                data: ["7", "20", "73"],
              },
            ],
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: true,
              position: "right",
              reverse: false,
            },
            title: {
              display: false,
            },
          },
        });
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
      });
  };

  let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
  let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
  let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
  if (urlParametersDateFrom) {
    if (urlParametersIgnoreDate == true) {
      $("#dateFrom").attr("readonly", true);
      $("#dateTo").attr("readonly", true);
    } else {
      $("#dateFrom").val(
        urlParametersDateFrom != ""
          ? moment(urlParametersDateFrom).format("DD/MM/YYYY")
          : urlParametersDateFrom
      );
      $("#dateTo").val(
        urlParametersDateTo != ""
          ? moment(urlParametersDateTo).format("DD/MM/YYYY")
          : urlParametersDateTo
      );
    }
  }
  templateObject.checkChartToDisplay = async () => {
    const accountOverviewApis = new ChartsApi(); // Load all dashboard APIS
    let displayedCharts = 0;

    const allChartsEndpoint = accountOverviewApis.collection.findByName(
      accountOverviewApis.collectionNames.vs1charts
    );
    allChartsEndpoint.url.searchParams.append("ListType", "'Detail'");
    const allChartResponse = await allChartsEndpoint.fetch();

    if (allChartResponse.ok == true) {
      const allChartsJsonResponse = await allChartResponse.json();

      //console.log(allChartsJsonResponse);

      let chartList = Tvs1chart.fromList(
        allChartsJsonResponse.tvs1charts
      ).filter((chart) => {
        if (chart.fields.ChartGroup == _chartGroup) {
          return chart;
        }
      });
      //console.log(allChartResponse);
      //console.log(chartList);
      // the goal here is to get the right names so it can be used for preferences
      chartList.forEach((chart) => {
        //chart.fields.active = false; // Will set evething to false
        chart.fields._chartSlug =
          chart.fields.ChartGroup.toLowerCase() +
          "__" +
          chart.fields.ChartName.toLowerCase().split(" ").join("_");

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-id",
          chart.fields.ChartID
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "pref-id",
          chart.fields.ID
        );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-slug",
          chart.fields._chartSlug
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-group",
          chart.fields.ChartGroup
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-name",
          chart.fields.ChartName
        );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-active",
          chart.fields.Active
        );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-user-pref-is-hidden",
          !chart.fields.Active
        );
      });
    }

    // Now get user preferences
    const dashboardPreferencesEndpoint =
      accountOverviewApis.collection.findByName(
        accountOverviewApis.collectionNames.Tvs1dashboardpreferences
      );

    dashboardPreferencesEndpoint.url.searchParams.append(
      "ListType",
      "'Detail'"
    );
    dashboardPreferencesEndpoint.url.searchParams.append(
      "select",
      `[employeeID]=${employeeId}`
    );

    // this is the default list (hardcoded)
    let itemList = [
      "purchases__expenses_breakdown",
      "purchases__monthly_expenses",
    ];

    const dashboardPreferencesEndpointResponse =
      await dashboardPreferencesEndpoint.fetch(); // here i should get from database all charts to be displayed

    if (dashboardPreferencesEndpointResponse.ok == true) {
      const dashboardPreferencesEndpointJsonResponse =
        await dashboardPreferencesEndpointResponse.json();

      let tvs1ChartDashboardPreference = Tvs1ChartDashboardPreference.fromList(
        dashboardPreferencesEndpointJsonResponse.tvs1dashboardpreferences
      ).filter((chart) => {
        if (chart.fields.ChartGroup == _chartGroup) {
          return chart;
        }
      });

      //console.log(tvs1ChartDashboardPreference);

      if (tvs1ChartDashboardPreference.length > 0) {
        // if charts to be displayed are specified
        tvs1ChartDashboardPreference.forEach((tvs1chart, index) => {
          setTimeout(() => {
            // this is good to see how the charts are apearing or not
            //if (tvs1chart.fields.ChartGroup == "Dashboard") {
            const itemName =
              tvs1chart.fields.ChartGroup.toLowerCase() +
              "__" +
              tvs1chart.fields.Chartname.toLowerCase().split(" ").join("_"); // this is the new item name

            //localStorage.setItem(itemName, tvs1chart);
            //console.log(itemName + " " + tvs1chart.fields.Active);

            if (itemList.includes(itemName) == true) {
              // If the item name exist
              if (tvs1chart.fields.ChartWidth) {
                $(`[key='${itemName}']`).css(
                  "width",
                  tvs1chart.fields.ChartWidth
                );
              }
              $(`[key='${itemName}']`).attr("chart-id", tvs1chart.fields.Id);
              $(`[key='${itemName}']`).attr(
                "chart-group",
                tvs1chart.fields.chartGroup
              );
              $(`[key='${itemName}']`).addClass("chart-visibility");
              //$(`[key='${itemName}']`).attr('chart-id', tvs1chart.fields.Id);
              $(`[key='${itemName}'] .on-editor-change-mode`).attr(
                "chart-slug",
                itemName
              );

              if (tvs1chart.fields.Active == true) {
                $(`[key='${itemName}'] .on-editor-change-mode`).text("Hide");
                $(`[key='${itemName}'] .on-editor-change-mode`).attr(
                  "is-hidden",
                  "false"
                );

                $(`[key='${itemName}']`).removeClass("hideelement");
                //$(`[key='${itemName}']`).attr("is-hidden", false);
              } else {
                $(`[key='${itemName}']`).addClass("hideelement");
                $(`[key='${itemName}'] .on-editor-change-mode`).text("Show");
                // $(`[key='${itemName}']`).attr("is-hidden", true);
                $(`[key='${itemName}'] .on-editor-change-mode`).attr(
                  "is-hidden",
                  "true"
                );
              }
            }
            //}
          }, index * 100);
        });
      }

      displayedCharts = document.querySelectorAll(
        ".chart-visibility:not(.hideelement)"
      );

      if (displayedCharts.length == 0) {
        // this will show all by default
        //console.log("No charts are being displayed, so show everything");
        itemList.forEach((item) => {
          $(`[key='${item}'] .on-editor-change-mode`).text("Hide");
          $(`[key='${item}'] .on-editor-change-mode`).attr("is-hidden", false);
          $(`[key='${item}'] .on-editor-change-mode`).attr("chart-slug", item);
          $(`[key='${item}']`).removeClass("hideelement");
          $(`[key='${item}']`).addClass("chart-visibility");
          // $(`[key='${item}']`).attr("is-hidden", false);
        });
      }
    }
  };

  templateObject.hideChartElements = () => {
    // on edit mode false
    // $(".on-editor-change-mode").removeClass("showelement");
    // $(".on-editor-change-mode").addClass("hideelement");

    var dimmedElements = document.getElementsByClassName("dimmedChart");
    while (dimmedElements.length > 0) {
      dimmedElements[0].classList.remove("dimmedChart");
    }
  };

  templateObject.showChartElements = function () {
    // on edit mode true

    // $(".on-editor-change-mode").addClass("showelement");
    // $(".on-editor-change-mode").removeClass("hideelement");

    $(".card").addClass("dimmedChart");
    $(".py-2").removeClass("dimmedChart");
  };
  templateObject.checkChartToDisplay();
  draggableCharts.enable();
  resizableCharts.enable();

  // $(".connectedSortable").sortable({
  //   connectWith: ".connectedSortable",
  //   stop: function (event, ui) {
  //     // $('.connectedSortable').each(function() {
  //     //     // result = "";
  //     //     // $(this).find("li").each(function(){
  //     //     //     result += $(this).text() + ",";
  //     //     // });
  //     //     //$("."+$(this).attr("id")+".list").html(result);
  //     // });
  //   },
  // });
  //$(element).resizable().draggable();
  //   $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").prepend(
  //     "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
  //
  // $(".portlet-toggle").on("click", function() {
  //   var icon = $(this);
  //   icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
  //   icon.closest(".portlet").find(".portlet-content").toggle();
  // });

  //$(".portlet").resizable();
});

Template.purchasesoverview.events({
  "click .on-editor-change-mode": (e) => {
    // this will toggle the visibility of the widget
    if ($(e.currentTarget).attr("is-hidden") == "true") {
      // console.log('was true');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'false');
      // $(e.currentTarget).parent(".chart-visibility").addClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "false");

      $(e.currentTarget).text("Hide");
    } else {
      // console.log('was false');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'true');
      // $(e.currentTarget).parent(".chart-visibility").removeClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "true");
      $(e.currentTarget).text("Show");
    }
  },
  "click #btnCancel": function () {
    chartsEditor.disable();

    const templateObject = Template.instance();
    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();

    //templateObject.deactivateDraggable();
  },

  "click #btnDone": () => {
    saveCharts();
    chartsEditor.disable();

    const templateObject = Template.instance();
    templateObject.hideChartElements();
    // $("#btnDone").addClass("hideelement");
    // $("#btnDone").removeClass("showelement");
    // $("#btnCancel").addClass("hideelement");
    // $("#btnCancel").removeClass("showelement");
    // $("#editcharts").addClass("showelement");
    // $("#editcharts").removeClass("hideelement");

    templateObject.checkChartToDisplay();
  },
  "click .editchartsbtn": () => {
    chartsEditor.enable();
  },
  "click #editcharts": () => {
    chartsEditor.enable();
  },
  "click #resetcharts": () => {
    chartsEditor.disable();
  },
  "click #resetchartbtn": () => {
    chartsEditor.disable();
  },
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    let prevMonth11Date = moment()
      .subtract(reportsloadMonths, "months")
      .format("YYYY-MM-DD");

    sideBarService
      .getAllPurchaseOrderListAll(
        prevMonth11Date,
        toDate,
        false,
        initialReportLoad,
        0
      )
      .then(function (data) {
        addVS1Data("TbillReport", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/purchasesoverview", "_self");
          })
          .catch(function (err) {
            window.open("/purchasesoverview", "_self");
          });
      })
      .catch(function (err) {
        window.open("/purchasesoverview", "_self");
      });
  },
  "change #dateTo": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
      dateFrom.getFullYear() +
      "-" +
      (dateFrom.getMonth() + 1) +
      "-" +
      dateFrom.getDate();
    let formatDateTo =
      dateTo.getFullYear() +
      "-" +
      (dateTo.getMonth() + 1) +
      "-" +
      dateTo.getDate();

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterPurchasesData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
  },
  "change #dateFrom": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
      dateFrom.getFullYear() +
      "-" +
      (dateFrom.getMonth() + 1) +
      "-" +
      dateFrom.getDate();
    let formatDateTo =
      dateTo.getFullYear() +
      "-" +
      (dateTo.getMonth() + 1) +
      "-" +
      dateTo.getDate();

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterPurchasesData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
  },
  "click #today": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterPurchasesData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastweek": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() +
      "-" +
      fromDateMonth +
      "-" +
      (fromDateDay - 7);
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay -
      7 +
      "/" +
      fromDateMonth +
      "/" +
      currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterPurchasesData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    var prevMonthFirstDate = new Date(
      currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
      (currentDate.getMonth() - 1 + 12) % 12,
      1
    );

    var formatDateComponent = function (dateComponent) {
      return (dateComponent < 10 ? "0" : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (
        formatDateComponent(date.getDate()) +
        "/" +
        formatDateComponent(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    };

    var formatDateERP = function (date) {
      return (
        date.getFullYear() +
        "-" +
        formatDateComponent(date.getMonth() + 1) +
        "-" +
        formatDateComponent(date.getDate())
      );
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.getAllFilterPurchasesData(getDateFrom, getLoadDate, false);
  },
  "click #lastQuarter": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    function getQuarter(d) {
      d = d || new Date();
      var m = Math.floor(d.getMonth() / 3) + 2;
      return m > 4 ? m - 4 : m;
    }

    var quarterAdjustment = (moment().month() % 3) + 1;
    var lastQuarterEndDate = moment()
      .subtract({
        months: quarterAdjustment,
      })
      .endOf("month");
    var lastQuarterStartDate = lastQuarterEndDate
      .clone()
      .subtract({
        months: 2,
      })
      .startOf("month");

    var lastQuarterStartDateFormat =
      moment(lastQuarterStartDate).format("DD/MM/YYYY");
    var lastQuarterEndDateFormat =
      moment(lastQuarterEndDate).format("DD/MM/YYYY");

    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    templateObject.getAllFilterPurchasesData(getDateFrom, getLoadDate, false);
  },
  "click #last12Months": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate =
      fromDateDay +
      "/" +
      fromDateMonth +
      "/" +
      Math.floor(currentDate.getFullYear() - 1);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    if (currentDate2.getMonth() + 1 < 10) {
      fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    }
    if (currentDate2.getDate() < 10) {
      fromDateDay2 = "0" + currentDate2.getDate();
    }
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      fromDateMonth2 +
      "-" +
      currentDate2.getDate();
    templateObject.getAllFilterPurchasesData(getDateFrom, getLoadDate, false);
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterPurchasesData("", "", true);
  },
  "click #newPurchaseorder": function (event) {
    FlowRouter.go("/purchaseordercard");
  },
  "click .purchaseorderList": function (event) {
    FlowRouter.go("/purchaseorderlist");
  },
  "click .purchaseorderListBO": function (event) {
    FlowRouter.go("/purchaseorderlistBO");
  },
  "click #newBill": function (event) {
    FlowRouter.go("/billcard");
  },
  "click .billList": function (event) {
    FlowRouter.go("/billlist");
  },
  "click #newCredit": function (event) {
    FlowRouter.go("/creditcard");
  },
  "click .creditList": function (event) {
    FlowRouter.go("/creditlist");
  },
  "click .newpo": function (event) {
    FlowRouter.go("/purchaseordercard");
  },
  "click .cardBills": function (event) {
    FlowRouter.go("/billlist");
  },
  "click .cardCredit": function (event) {
    FlowRouter.go("/creditlist");
  },
  "click .cardOutPO": function (event) {
    FlowRouter.go("/agedpayables");
  },
  "click .newBill": function (event) {
    //FlowRouter.go('/creditcard');
  },
  "click .newCredit": function (event) {
    //FlowRouter.go('/creditcard');
  },
  "click .allList": function (event) {
    //FlowRouter.go('/purchasesoverview?id=all');
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterPurchasesData("", "", true);
  },
  "click .chkDatatable": function (event) {
    var columns = $("#tblPurchaseOverview th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
  "click .resetTable": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblPurchaseOverview",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .saveTable": function (event) {
    let lineItems = [];
    //let datatable =$('#tblPurchaseOverview').DataTable();
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass,
      };

      lineItems.push(lineItemObj);
    });
    //datatable.state.save();

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblPurchaseOverview",
        });
        if (checkPrefDetails) {
          CloudPreference.update(
            {
              _id: checkPrefDetails._id,
            },
            {
              $set: {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "salesform",
                PrefName: "tblPurchaseOverview",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert(
            {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "tblPurchaseOverview",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        }
      }
    }
    $("#myModal2").modal("toggle");
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");

    var datable = $("#tblPurchaseOverview").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumn")
      .text();
    var datable = $("#tblPurchaseOverview th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettings": function (event) {
    let templateObject = Template.instance();
    var columns = $("#tblPurchaseOverview th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });

    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblPurchaseOverview_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .printConfirm": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblPurchaseOverview_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  },
});
Template.purchasesoverview.helpers({
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.orderdate == "NA") {
          return 1;
        } else if (b.orderdate == "NA") {
          return -1;
        }
        return a.orderdate.toUpperCase() > b.orderdate.toUpperCase() ? 1 : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  purchasesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: Session.get("mycloudLogonID"),
      PrefName: "tblPurchaseOverview",
    });
  },
  creditpercTotal: () => {
    return Template.instance().creditpercTotal.get() || 0;
  },
  billpercTotal: () => {
    return Template.instance().billpercTotal.get() || 0;
  },
  popercTotal: () => {
    return Template.instance().popercTotal.get() || 0;
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});
