import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
// import {SalesBoardService} from '../../js/sales-service';

let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let _ = require('lodash');
Template.quotedsalesorderinvoicedamounts.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();

templateObject.salesperc = new ReactiveVar();
templateObject.expenseperc = new ReactiveVar();
templateObject.salespercTotal = new ReactiveVar();
templateObject.expensepercTotal = new ReactiveVar();
templateObject.topTenData = new ReactiveVar([]);
});

Template.quotedsalesorderinvoicedamounts.onRendered(()=>{

  const templateObject = Template.instance();

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

  getInvSales(function (data) {
    // console.log(data);
    let currentDate = new Date();
    let currentMonthDate = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let currentMonthData = [];
    let prevMonthData = [];
    let prevMonth2Data = [];
    let prevMonth3Data = [];
    let prevMonth4Data = [];
    let prevMonth5Data = [];
    let prevMonth6Data = [];
    let prevMonth7Data = [];
    let totalQuotePayment  = 0;
    let totalQuotePayment2  = 0;
    let totalQuotePayment3  = 0;
    let totalQuotePayment4  = 0;
    let totalQuotePayment5  = 0;
    let totalQuotePayment6  = 0;
    let totalQuotePayment7  = 0;
    let totalQuotePayment8  = 0;

    let totalSOPayment  = 0;
    let totalSOPayment2  = 0;
    let totalSOPayment3  = 0;
    let totalSOPayment4  = 0;
    let totalSOPayment5  = 0;
    let totalSOPayment6  = 0;
    let totalSOPayment7  = 0;
    let totalSOPayment8  = 0;

    let totalInvPayment  = 0;
    let totalInvPayment2  = 0;
    let totalInvPayment3  = 0;
    let totalInvPayment4  = 0;
    let totalInvPayment5  = 0;
    let totalInvPayment6  = 0;
    let totalInvPayment7  = 0;
    let totalInvPayment8  = 0;

    getVS1Data('TSalesList').then(function (dataObject) {
    if(dataObject.length == 0){
      vs1chartService.getSalesListData().then((data) => {

            let filterData = _.filter(data.tsaleslist, function (data) {
                  return data.CustomerName
              });

              let graphData = _.orderBy(filterData, 'SaleDate');
            let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
              for (let l = 0; l < initialData.length; l++) {
                // console.log(initialData);
                      let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                      if(initialData[l].Type === "Quote"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment8 += initialData[l].TotalAmountinc;

                        }
                      }else if(initialData[l].Type === "Sales Order"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment8 += initialData[l].TotalAmountinc;

                        }
                      }else if(initialData[l].Type === "Invoice"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment8 += initialData[l].TotalAmountinc;

                        }
                      }

                  }
              // topData.topTenData.set(data);
              let currentMonth = moment().format("MMMM").substring(0, 3);
              let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
              let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
              let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
              let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
              let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
              let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
              let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

              var ctx = document.getElementById("quotedsoinvoicedamounts").getContext("2d");
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                labels: [
                 prevMonth7,
                 prevMonth6,
                 prevMonth5,
                 prevMonth4,
                 prevMonth3,
                 prevMonth2,
                 prevMonth,
                 currentMonth
               ],
                datasets: [
                  {
                  "label":"Quotes",
                  "fill":true,
                  "data":[
                     totalQuotePayment,
                     totalQuotePayment2,
                     totalQuotePayment3,
                     totalQuotePayment4,
                     totalQuotePayment5,
                     totalQuotePayment6,
                     totalQuotePayment7,
                     totalQuotePayment8
                  ],
                  "backgroundColor":"rgba(28,200,138,0.16)",
                  "borderColor":"#1cc88a"
               },
               {
                  "label":"Sales Orders",
                  "fill":true,
                  "data":[
                     totalSOPayment,
                     totalSOPayment2,
                     totalSOPayment3,
                     totalSOPayment4,
                     totalSOPayment5,
                     totalSOPayment6,
                     totalSOPayment7,
                     totalSOPayment8
                  ],
                  "borderColor":"#36b9cc",
                  "backgroundColor":"rgba(54,185,204,0.17)"
               },
               {
                  "label":"Invoices",
                  "fill":true,
                  "data":[
                     totalInvPayment,
                     totalInvPayment2,
                     totalInvPayment3,
                     totalInvPayment4,
                     totalInvPayment5,
                     totalInvPayment6,
                     totalInvPayment7,
                     totalInvPayment8
                  ],
                  "borderColor":"#f6c23e",
                  "backgroundColor":"rgba(246,194,62,0.17)"
               }]
                },
                options: {
                  'onClick' : function (evt, item) {
                    if(item[0]['_model'].label){
                      var activePoints = item[0]['_model'].label;
                      Router.go('/agedpayables?month=' + activePoints);
                    }

                  },
                maintainAspectRatio:false,
                tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

                    }
                }
            },
                "legend":{
                "display":true,
                "position":"bottom",
                },
                "title":{},
                "scales":{
                "xAxes":[
                {"gridLines":{
                "color":"rgb(234, 236, 244)",
                "zeroLineColor":"rgb(234, 236, 244)",
                "drawBorder":false,
                "drawTicks":false,
                "borderDash":["2"],
                "zeroLineBorderDash":["2"],
                "drawOnChartArea":false},
                "ticks":{
                "fontColor":"#858796",
                "padding":20}}],
                "yAxes":[{
                "gridLines":{"color":"rgb(234, 236, 244)",
                "zeroLineColor":"rgb(234, 236, 244)",
                "drawBorder":false,
                "drawTicks":false,
                "borderDash":["2"],
                "zeroLineBorderDash":["2"]},
                "ticks":{
                "fontColor":"#858796",
                "padding":20
                }
                }
                ]
                }
                }
                });




        });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tsaleslist;
      let filterData = _.filter(useData, function (data) {
            return data.CustomerName
        });

        let graphData = _.orderBy(filterData, 'SaleDate');
      let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
        for (let l = 0; l < initialData.length; l++) {
          // console.log(initialData);
                let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                if(initialData[l].Type === "Quote"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment8 += initialData[l].TotalAmountinc;

                  }
                }else if(initialData[l].Type === "Sales Order"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment8 += initialData[l].TotalAmountinc;

                  }
                }else if(initialData[l].Type === "Invoice"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment8 += initialData[l].TotalAmountinc;

                  }
                }

            }
        // topData.topTenData.set(data);
        let currentMonth = moment().format("MMMM").substring(0, 3);
        let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
        let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
        let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
        let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
        let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
        let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
        let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

        var ctx = document.getElementById("quotedsoinvoicedamounts").getContext("2d");
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
          labels: [
           prevMonth7,
           prevMonth6,
           prevMonth5,
           prevMonth4,
           prevMonth3,
           prevMonth2,
           prevMonth,
           currentMonth
         ],
          datasets: [
            {
            "label":"Quotes",
            "fill":true,
            "data":[
               totalQuotePayment,
               totalQuotePayment2,
               totalQuotePayment3,
               totalQuotePayment4,
               totalQuotePayment5,
               totalQuotePayment6,
               totalQuotePayment7,
               totalQuotePayment8
            ],
            "backgroundColor":"rgba(28,200,138,0.16)",
            "borderColor":"#1cc88a"
         },
         {
            "label":"Sales Orders",
            "fill":true,
            "data":[
               totalSOPayment,
               totalSOPayment2,
               totalSOPayment3,
               totalSOPayment4,
               totalSOPayment5,
               totalSOPayment6,
               totalSOPayment7,
               totalSOPayment8
            ],
            "borderColor":"#36b9cc",
            "backgroundColor":"rgba(54,185,204,0.17)"
         },
         {
            "label":"Invoices",
            "fill":true,
            "data":[
               totalInvPayment,
               totalInvPayment2,
               totalInvPayment3,
               totalInvPayment4,
               totalInvPayment5,
               totalInvPayment6,
               totalInvPayment7,
               totalInvPayment8
            ],
            "borderColor":"#f6c23e",
            "backgroundColor":"rgba(246,194,62,0.17)"
         }]
          },
          options: {
            'onClick' : function (evt, item) {
              if(item[0]['_model'].label){
                var activePoints = item[0]['_model'].label;
                Router.go('/agedpayables?month=' + activePoints);
              }

            },
          maintainAspectRatio:false,
          tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

              }
          }
      },
          "legend":{
          "display":true,
          "position":"bottom",
          },
          "title":{},
          "scales":{
          "xAxes":[
          {"gridLines":{
          "color":"rgb(234, 236, 244)",
          "zeroLineColor":"rgb(234, 236, 244)",
          "drawBorder":false,
          "drawTicks":false,
          "borderDash":["2"],
          "zeroLineBorderDash":["2"],
          "drawOnChartArea":false},
          "ticks":{
          "fontColor":"#858796",
          "padding":20}}],
          "yAxes":[{
          "gridLines":{"color":"rgb(234, 236, 244)",
          "zeroLineColor":"rgb(234, 236, 244)",
          "drawBorder":false,
          "drawTicks":false,
          "borderDash":["2"],
          "zeroLineBorderDash":["2"]},
          "ticks":{
          "fontColor":"#858796",
          "padding":20
          }
          }
          ]
          }
          }
          });

    }
    }).catch(function (err) {
      vs1chartService.getSalesListData().then((data) => {

            let filterData = _.filter(data.tsaleslist, function (data) {
                  return data.CustomerName
              });

              let graphData = _.orderBy(filterData, 'SaleDate');
            let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
              for (let l = 0; l < initialData.length; l++) {
                // console.log(initialData);
                      let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                      if(initialData[l].Type === "Quote"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment8 += initialData[l].TotalAmountinc;

                        }
                      }else if(initialData[l].Type === "Sales Order"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment8 += initialData[l].TotalAmountinc;

                        }
                      }else if(initialData[l].Type === "Invoice"){
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment8 += initialData[l].TotalAmountinc;

                        }
                      }

                  }
              // topData.topTenData.set(data);
              let currentMonth = moment().format("MMMM").substring(0, 3);
              let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
              let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
              let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
              let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
              let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
              let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
              let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

              var ctx = document.getElementById("quotedsoinvoicedamounts").getContext("2d");
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                labels: [
                 prevMonth7,
                 prevMonth6,
                 prevMonth5,
                 prevMonth4,
                 prevMonth3,
                 prevMonth2,
                 prevMonth,
                 currentMonth
               ],
                datasets: [
                  {
                  "label":"Quotes",
                  "fill":true,
                  "data":[
                     totalQuotePayment,
                     totalQuotePayment2,
                     totalQuotePayment3,
                     totalQuotePayment4,
                     totalQuotePayment5,
                     totalQuotePayment6,
                     totalQuotePayment7,
                     totalQuotePayment8
                  ],
                  "backgroundColor":"rgba(28,200,138,0.16)",
                  "borderColor":"#1cc88a"
               },
               {
                  "label":"Sales Orders",
                  "fill":true,
                  "data":[
                     totalSOPayment,
                     totalSOPayment2,
                     totalSOPayment3,
                     totalSOPayment4,
                     totalSOPayment5,
                     totalSOPayment6,
                     totalSOPayment7,
                     totalSOPayment8
                  ],
                  "borderColor":"#36b9cc",
                  "backgroundColor":"rgba(54,185,204,0.17)"
               },
               {
                  "label":"Invoices",
                  "fill":true,
                  "data":[
                     totalInvPayment,
                     totalInvPayment2,
                     totalInvPayment3,
                     totalInvPayment4,
                     totalInvPayment5,
                     totalInvPayment6,
                     totalInvPayment7,
                     totalInvPayment8
                  ],
                  "borderColor":"#f6c23e",
                  "backgroundColor":"rgba(246,194,62,0.17)"
               }]
                },
                options: {
                  'onClick' : function (evt, item) {
                    if(item[0]['_model'].label){
                      var activePoints = item[0]['_model'].label;
                      Router.go('/agedpayables?month=' + activePoints);
                    }

                  },
                maintainAspectRatio:false,
                tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

                    }
                }
            },
                "legend":{
                "display":true,
                "position":"bottom",
                },
                "title":{},
                "scales":{
                "xAxes":[
                {"gridLines":{
                "color":"rgb(234, 236, 244)",
                "zeroLineColor":"rgb(234, 236, 244)",
                "drawBorder":false,
                "drawTicks":false,
                "borderDash":["2"],
                "zeroLineBorderDash":["2"],
                "drawOnChartArea":false},
                "ticks":{
                "fontColor":"#858796",
                "padding":20}}],
                "yAxes":[{
                "gridLines":{"color":"rgb(234, 236, 244)",
                "zeroLineColor":"rgb(234, 236, 244)",
                "drawBorder":false,
                "drawTicks":false,
                "borderDash":["2"],
                "zeroLineBorderDash":["2"]},
                "ticks":{
                "fontColor":"#858796",
                "padding":20
                }
                }
                ]
                }
                }
                });




        });
    });

    if(!localStorage.getItem('VS1TSalesList')){
    vs1chartService.getSalesListData().then((data) => {
      localStorage.setItem('VS1TSalesList', JSON.stringify(data)||'');
          let filterData = _.filter(data.tsaleslist, function (data) {
                return data.CustomerName
            });

            let graphData = _.orderBy(filterData, 'SaleDate');
          let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
            for (let l = 0; l < initialData.length; l++) {
              // console.log(initialData);
                    let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                    if(initialData[l].Type === "Quote"){
                      if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment2 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment3 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment4 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment5 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment6 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment7 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalQuotePayment8 += initialData[l].TotalAmountinc;

                      }
                    }else if(initialData[l].Type === "Sales Order"){
                      if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment2 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment3 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment4 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment5 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment6 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment7 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalSOPayment8 += initialData[l].TotalAmountinc;

                      }
                    }else if(initialData[l].Type === "Invoice"){
                      if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment2 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment3 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment4 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment5 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment6 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment7 += initialData[l].TotalAmountinc;

                      } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                          totalInvPayment8 += initialData[l].TotalAmountinc;

                      }
                    }

                }
            // topData.topTenData.set(data);
            let currentMonth = moment().format("MMMM").substring(0, 3);
            let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
            let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
            let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
            let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
            let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
            let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
            let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

            var ctx = document.getElementById("quotedsoinvoicedamounts").getContext("2d");
            var myChart = new Chart(ctx, {
              type: 'line',
              data: {
              labels: [
               prevMonth7,
               prevMonth6,
               prevMonth5,
               prevMonth4,
               prevMonth3,
               prevMonth2,
               prevMonth,
               currentMonth
             ],
              datasets: [
                {
                "label":"Quotes",
                "fill":true,
                "data":[
                   totalQuotePayment,
                   totalQuotePayment2,
                   totalQuotePayment3,
                   totalQuotePayment4,
                   totalQuotePayment5,
                   totalQuotePayment6,
                   totalQuotePayment7,
                   totalQuotePayment8
                ],
                "backgroundColor":"rgba(28,200,138,0.16)",
                "borderColor":"#1cc88a"
             },
             {
                "label":"Sales Orders",
                "fill":true,
                "data":[
                   totalSOPayment,
                   totalSOPayment2,
                   totalSOPayment3,
                   totalSOPayment4,
                   totalSOPayment5,
                   totalSOPayment6,
                   totalSOPayment7,
                   totalSOPayment8
                ],
                "borderColor":"#36b9cc",
                "backgroundColor":"rgba(54,185,204,0.17)"
             },
             {
                "label":"Invoices",
                "fill":true,
                "data":[
                   totalInvPayment,
                   totalInvPayment2,
                   totalInvPayment3,
                   totalInvPayment4,
                   totalInvPayment5,
                   totalInvPayment6,
                   totalInvPayment7,
                   totalInvPayment8
                ],
                "borderColor":"#f6c23e",
                "backgroundColor":"rgba(246,194,62,0.17)"
             }]
              },
              options: {
                'onClick' : function (evt, item) {
                  if(item[0]['_model'].label){
                    var activePoints = item[0]['_model'].label;
                    Router.go('/agedpayables?month=' + activePoints);
                  }

                },
              maintainAspectRatio:false,
              tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

                  }
              }
          },
              "legend":{
              "display":true,
              "position":"bottom",
              },
              "title":{},
              "scales":{
              "xAxes":[
              {"gridLines":{
              "color":"rgb(234, 236, 244)",
              "zeroLineColor":"rgb(234, 236, 244)",
              "drawBorder":false,
              "drawTicks":false,
              "borderDash":["2"],
              "zeroLineBorderDash":["2"],
              "drawOnChartArea":false},
              "ticks":{
              "fontColor":"#858796",
              "padding":20}}],
              "yAxes":[{
              "gridLines":{"color":"rgb(234, 236, 244)",
              "zeroLineColor":"rgb(234, 236, 244)",
              "drawBorder":false,
              "drawTicks":false,
              "borderDash":["2"],
              "zeroLineBorderDash":["2"]},
              "ticks":{
              "fontColor":"#858796",
              "padding":20
              }
              }
              ]
              }
              }
              });




      });

    }else{
      let data = JSON.parse(localStorage.getItem('VS1TSalesList'));
      let filterData = _.filter(data.tsaleslist, function (data) {
            return data.CustomerName
        });

        let graphData = _.orderBy(filterData, 'SaleDate');
      let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
        for (let l = 0; l < initialData.length; l++) {
          // console.log(initialData);
                let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                if(initialData[l].Type === "Quote"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalQuotePayment8 += initialData[l].TotalAmountinc;

                  }
                }else if(initialData[l].Type === "Sales Order"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalSOPayment8 += initialData[l].TotalAmountinc;

                  }
                }else if(initialData[l].Type === "Invoice"){
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment2 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment3 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment4 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment5 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment6 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment7 += initialData[l].TotalAmountinc;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                      totalInvPayment8 += initialData[l].TotalAmountinc;

                  }
                }

            }
        // topData.topTenData.set(data);
        let currentMonth = moment().format("MMMM").substring(0, 3);
        let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
        let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
        let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
        let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
        let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
        let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
        let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

        var ctx = document.getElementById("quotedsoinvoicedamounts").getContext("2d");
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
          labels: [
           prevMonth7,
           prevMonth6,
           prevMonth5,
           prevMonth4,
           prevMonth3,
           prevMonth2,
           prevMonth,
           currentMonth
         ],
          datasets: [
            {
            "label":"Quotes",
            "fill":true,
            "data":[
               totalQuotePayment,
               totalQuotePayment2,
               totalQuotePayment3,
               totalQuotePayment4,
               totalQuotePayment5,
               totalQuotePayment6,
               totalQuotePayment7,
               totalQuotePayment8
            ],
            "backgroundColor":"rgba(28,200,138,0.16)",
            "borderColor":"#1cc88a"
         },
         {
            "label":"Sales Orders",
            "fill":true,
            "data":[
               totalSOPayment,
               totalSOPayment2,
               totalSOPayment3,
               totalSOPayment4,
               totalSOPayment5,
               totalSOPayment6,
               totalSOPayment7,
               totalSOPayment8
            ],
            "borderColor":"#36b9cc",
            "backgroundColor":"rgba(54,185,204,0.17)"
         },
         {
            "label":"Invoices",
            "fill":true,
            "data":[
               totalInvPayment,
               totalInvPayment2,
               totalInvPayment3,
               totalInvPayment4,
               totalInvPayment5,
               totalInvPayment6,
               totalInvPayment7,
               totalInvPayment8
            ],
            "borderColor":"#f6c23e",
            "backgroundColor":"rgba(246,194,62,0.17)"
         }]
          },
          options: {
            'onClick' : function (evt, item) {
              if(item[0]['_model'].label){
                var activePoints = item[0]['_model'].label;
                Router.go('/agedpayables?month=' + activePoints);
              }

            },
          maintainAspectRatio:false,
          tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

              }
          }
      },
          "legend":{
          "display":true,
          "position":"bottom",
          },
          "title":{},
          "scales":{
          "xAxes":[
          {"gridLines":{
          "color":"rgb(234, 236, 244)",
          "zeroLineColor":"rgb(234, 236, 244)",
          "drawBorder":false,
          "drawTicks":false,
          "borderDash":["2"],
          "zeroLineBorderDash":["2"],
          "drawOnChartArea":false},
          "ticks":{
          "fontColor":"#858796",
          "padding":20}}],
          "yAxes":[{
          "gridLines":{"color":"rgb(234, 236, 244)",
          "zeroLineColor":"rgb(234, 236, 244)",
          "drawBorder":false,
          "drawTicks":false,
          "borderDash":["2"],
          "zeroLineBorderDash":["2"]},
          "ticks":{
          "fontColor":"#858796",
          "padding":20
          }
          }
          ]
          }
          }
          });
    }



  });

  function getInvSales(callback) {

      return new Promise((res, rej) => {
          // var salesBoardService = new SalesBoardService();

                callback('');
                // console.log(prevMonth3Data);


      });

  }

  });


  Template.quotedsalesorderinvoicedamounts.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    topTenData: () => {
          return Template.instance().topTenData.get();
    },
    Currency: () => {
          return Currency;
    },
    companyname: () =>{
        return loggedCompany;
    },
    salesperc: () =>{
        return Template.instance().salesperc.get() || 0;
    },
    expenseperc: () =>{
        return Template.instance().expenseperc.get() || 0;
    },
    salespercTotal: () =>{
        return Template.instance().salespercTotal.get() || 0;
    },
    expensepercTotal: () =>{
        return Template.instance().expensepercTotal.get() || 0;
    }
  });
  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });

  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });

  Template.registerHelper('containsequals', function (a, b) {
      return (a.indexOf(b) >= 0 );
  });
