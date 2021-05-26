import { PaymentsService } from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.supplierawaitingpurchaseorder.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.selectedAwaitingPayment = new ReactiveVar([]);
});

Template.supplierawaitingpurchaseorder.onRendered(function () {
  $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let paymentService = new PaymentsService();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];


  Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierAwaitingPO', function (error, result) {
    if (error) {

    } else {
      if (result) {
        
        for (let i = 0; i < result.customFields.length; i++) {
          let customcolumn = result.customFields;
          let columData = customcolumn[i].label;
          let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
          let hiddenColumn = customcolumn[i].hidden;
          let columnClass = columHeaderUpdate.split('.')[1];
          let columnWidth = customcolumn[i].width;
          // let columnindex = customcolumn[i].index + 1;
          $("th." + columnClass + "").html(columData);
          $("th." + columnClass + "").css('width', "" + columnWidth + "px");

        }
      }

    }
  });

  function MakeNegative() {
    $('td').each(function () {
      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    });
  };
  // $('#tblSupplierAwaitingPO').DataTable();
  templateObject.getAllSupplierPaymentData = function () {
    getVS1Data('TbillReport').then(function (dataObject) {
      if (dataObject.length == 0) {
        paymentService.getAllAwaitingSupplierDetails().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          let totalPaidCal = 0;

          for (let i = 0; i < data.tbillreport.length; i++) {
            if (data.tbillreport[i].Type == "Credit") {
              totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] + data.tbillreport[i].Balance;
            } else {
              totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] - data.tbillreport[i].Balance;
            }

            let amount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
            let applied = utilityService.modifynegativeCurrencyFormat(totalPaidCal) || 0.00;
            // Currency+''+data.tpurchaseorder[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
            let balance = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
            let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
            let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
            if (data.tbillreport[i].Balance != 0) {
              if ((data.tbillreport[i].Type == "Purchase Order") || (data.tbillreport[i].Type == "Bill") || (data.tbillreport[i].Type == "Credit")) {
                var dataList = {
                  id: data.tbillreport[i].PurchaseOrderID || '',
                  sortdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD") : data.tbillreport[i].OrderDate,
                  paymentdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY") : data.tbillreport[i].OrderDate,
                  customername: data.tbillreport[i].Company || '',
                  paymentamount: amount || 0.00,
                  applied: applied || 0.00,
                  balance: balance || 0.00,
                  originalamount: totalOrginialAmount || 0.00,
                  outsandingamount: totalOutstanding || 0.00,
                  ponumber: data.tbillreport[i].PurchaseOrderID || '',
                  // department: data.tpurchaseorder[i].SaleClassName || '',
                  refno: data.tbillreport[i].InvoiceNumber || '',
                  paymentmethod: '' || '',
                  notes: data.tbillreport[i].Comments || '',
                  type: data.tbillreport[i].Type || '',
                };
                //&& (data.tpurchaseorder[i].Invoiced == true)
                if ((data.tbillreport[i].TotalBalance != 0)) {
                  if ((data.tbillreport[i].Deleted == false)) {
                    dataTableList.push(dataList);
                  }
                }
              }
            }
          }
          templateObject.datatablerecords.set(dataTableList);
          if (templateObject.datatablerecords.get()) {

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierAwaitingPO', function (error, result) {
              if (error) {

              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    let columnindex = customcolumn[i].index + 1;

                    if (hiddenColumn == true) {

                      $("." + columnClass + "").addClass('hiddenColumn');
                      $("." + columnClass + "").removeClass('showColumn');
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass('hiddenColumn');
                      $("." + columnClass + "").addClass('showColumn');
                    }

                  }
                }

              }
            });


            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          $('.fullScreenSpin').css('display', 'none');
          setTimeout(function () {
            //$.fn.dataTable.moment('DD/MM/YY');
            $('#tblSupplierAwaitingPO').DataTable({
              columnDefs: [
                { "orderable": false, "targets": 0 },
                { type: 'date', targets: 1 }
              ],
              "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              buttons: [
                {
                  extend: 'excelHtml5',
                  text: '',
                  download: 'open',
                  className: "btntabletocsv hiddenColumn",
                  filename: "supplierpayment_" + moment().format(),
                  orientation: 'portrait',
                  exportOptions: {
                    columns: ':visible'
                  }
                }, {
                  extend: 'print',
                  download: 'open',
                  className: "btntabletopdf hiddenColumn",
                  text: '',
                  title: 'Supplier Payment',
                  filename: "supplierpayment_" + moment().format(),
                  exportOptions: {
                    columns: ':visible'
                  }
                }],
              select: true,
              destroy: true,
              colReorder: true,
              colReorder: {
                fixedColumnsLeft: 1
              },
              paging: false,
              "scrollY": "400px",
              "scrollCollapse": true,
              info: true,
              responsive: true,
              "order": [[1, "desc"]],
              // "aaSorting": [[1,'desc']],
              action: function () {
                $('#tblSupplierAwaitingPO').DataTable().ajax.reload();
              },
              "fnDrawCallback": function (oSettings) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              },

            }).on('page', function () {
              setTimeout(function () {
                MakeNegative();
              }, 100);
              let draftRecord = templateObject.datatablerecords.get();
              templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function () {

            }).on('length.dt', function (e, settings, len) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            });
            $('.fullScreenSpin').css('display', 'none');
          }, 0);

          var columns = $('#tblSupplierAwaitingPO th');
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
            if ((v.className.includes("hiddenColumn"))) {
              columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            
            let datatablerecordObj = {
              sTitle: v.innerText || '',
              sWidth: sWidth || '',
              sIndex: v.cellIndex || '',
              sVisible: columVisible || false,
              sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
          });
          templateObject.tableheaderrecords.set(tableHeaderList);
          $('div.dataTables_filter input').addClass('form-control form-control-sm');
          $('#tblSupplierAwaitingPO tbody').on('click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
            var listData = $(this).closest('tr').attr('id');
            var transactiontype = $(event.target).closest("tr").find(".colType").text();
            if ((listData) && (transactiontype)) {
              if (transactiontype === 'Purchase Order') {
                Router.go('/supplierpaymentcard?poid=' + listData);
              } else if (transactiontype === 'Bill') {
                Router.go('/supplierpaymentcard?billid=' + listData);
              } else if (transactiontype === 'Credit') {
                Router.go('/supplierpaymentcard?creditid=' + listData);
              }

            }

            // if(listData){
            //  Router.go('/supplierpaymentcard?poid='+ listData);
            // }
          });

        }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display', 'none');
          // Meteor._reload.reload();
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tbillreport;
        let lineItems = [];
        let lineItemObj = {};
        let totalPaidCal = 0;

        for (let i = 0; i < useData.length; i++) {
          if (useData[i].Type == "Credit") {
            totalPaidCal = useData[i]['Total Amount (Inc)'] + useData[i].Balance;
          } else {
            totalPaidCal = useData[i]['Total Amount (Inc)'] - useData[i].Balance;
          }

          let amount = utilityService.modifynegativeCurrencyFormat(useData[i]['Total Amount (Inc)']) || 0.00;
          let applied = utilityService.modifynegativeCurrencyFormat(totalPaidCal) || 0.00;
          // Currency+''+data.tpurchaseorder[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
          let balance = utilityService.modifynegativeCurrencyFormat(useData[i].Balance) || 0.00;
          let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].Balance) || 0.00;
          let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].Balance) || 0.00;
          let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(useData[i]['Total Amount (Inc)']) || 0.00;
          if (useData[i].Balance != 0) {
            if ((useData[i].Type == "Purchase Order") || (useData[i].Type == "Bill") || (useData[i].Type == "Credit")) {
              var dataList = {
                id: useData[i].PurchaseOrderID || '',
                sortdate: useData[i].OrderDate != '' ? moment(useData[i].OrderDate).format("YYYY/MM/DD") : useData[i].OrderDate,
                paymentdate: useData[i].OrderDate != '' ? moment(useData[i].OrderDate).format("DD/MM/YYYY") : useData[i].OrderDate,
                customername: useData[i].Company || '',
                paymentamount: amount || 0.00,
                applied: applied || 0.00,
                balance: balance || 0.00,
                originalamount: totalOrginialAmount || 0.00,
                outsandingamount: totalOutstanding || 0.00,
                ponumber: useData[i].PurchaseOrderID || '',
                // department: data.tpurchaseorder[i].SaleClassName || '',
                refno: useData[i].InvoiceNumber || '',
                paymentmethod: '' || '',
                notes: useData[i].Comments || '',
                type: useData[i].Type || '',
              };
              //&& (data.tpurchaseorder[i].Invoiced == true)
              if ((useData[i].TotalBalance != 0)) {
                if ((useData[i].Deleted == false)) {
                  dataTableList.push(dataList);
                }
              }
            }
          }
        }
        templateObject.datatablerecords.set(dataTableList);
        if (templateObject.datatablerecords.get()) {

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierAwaitingPO', function (error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.split('.')[1];
                  let columnWidth = customcolumn[i].width;
                  let columnindex = customcolumn[i].index + 1;

                  if (hiddenColumn == true) {

                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                  }

                }
              }

            }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
          //$.fn.dataTable.moment('DD/MM/YY');
          $('#tblSupplierAwaitingPO').DataTable({
            columnDefs: [
              { "orderable": false, "targets": 0 },
              { type: 'date', targets: 1 }
            ],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "supplierpayment_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                  columns: ':visible'
                }
              }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "supplierpayment_" + moment().format(),
                exportOptions: {
                  columns: ':visible'
                }
              }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
              fixedColumnsLeft: 1
            },
            paging: false,
            "scrollY": "400px",
            "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[1, "desc"]],
            // "aaSorting": [[1,'desc']],
            action: function () {
              $('#tblSupplierAwaitingPO').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },

          }).on('page', function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
          }).on('column-reorder', function () {

          }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });
          $('.fullScreenSpin').css('display', 'none');
        }, 0);

        var columns = $('#tblSupplierAwaitingPO th');
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
          if ((v.className.includes("hiddenColumn"))) {
            columVisible = false;
          }
          sWidth = v.style.width.replace('px', "");
          
          let datatablerecordObj = {
            sTitle: v.innerText || '',
            sWidth: sWidth || '',
            sIndex: v.cellIndex || '',
            sVisible: columVisible || false,
            sClass: v.className || ''
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
        $('#tblSupplierAwaitingPO tbody').on('click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
          var listData = $(this).closest('tr').attr('id');
          var transactiontype = $(event.target).closest("tr").find(".colType").text();
          if ((listData) && (transactiontype)) {
            if (transactiontype === 'Purchase Order') {
              Router.go('/supplierpaymentcard?poid=' + listData);
            } else if (transactiontype === 'Bill') {
              Router.go('/supplierpaymentcard?billid=' + listData);
            } else if (transactiontype === 'Credit') {
              Router.go('/supplierpaymentcard?creditid=' + listData);
            }

          }

          // if(listData){
          //  Router.go('/supplierpaymentcard?poid='+ listData);
          // }
        });
      }
    }).catch(function (err) {
      paymentService.getAllAwaitingSupplierDetails().then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        let totalPaidCal = 0;

        for (let i = 0; i < data.tbillreport.length; i++) {
          if (data.tbillreport[i].Type == "Credit") {
            totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] + data.tbillreport[i].Balance;
          } else {
            totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] - data.tbillreport[i].Balance;
          }

          let amount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
          let applied = utilityService.modifynegativeCurrencyFormat(totalPaidCal) || 0.00;
          // Currency+''+data.tpurchaseorder[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
          let balance = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
          let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
          let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
          let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
          if (data.tbillreport[i].Balance != 0) {
            if ((data.tbillreport[i].Type == "Purchase Order") || (data.tbillreport[i].Type == "Bill") || (data.tbillreport[i].Type == "Credit")) {
              var dataList = {
                id: data.tbillreport[i].PurchaseOrderID || '',
                sortdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD") : data.tbillreport[i].OrderDate,
                paymentdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY") : data.tbillreport[i].OrderDate,
                customername: data.tbillreport[i].Company || '',
                paymentamount: amount || 0.00,
                applied: applied || 0.00,
                balance: balance || 0.00,
                originalamount: totalOrginialAmount || 0.00,
                outsandingamount: totalOutstanding || 0.00,
                ponumber: data.tbillreport[i].PurchaseOrderID || '',
                // department: data.tpurchaseorder[i].SaleClassName || '',
                refno: data.tbillreport[i].InvoiceNumber || '',
                paymentmethod: '' || '',
                notes: data.tbillreport[i].Comments || '',
                type: data.tbillreport[i].Type || '',
              };
              //&& (data.tpurchaseorder[i].Invoiced == true)
              if ((data.tbillreport[i].TotalBalance != 0)) {
                if ((data.tbillreport[i].Deleted == false)) {
                  dataTableList.push(dataList);
                }
              }
            }
          }
        }
        templateObject.datatablerecords.set(dataTableList);
        if (templateObject.datatablerecords.get()) {

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierAwaitingPO', function (error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.split('.')[1];
                  let columnWidth = customcolumn[i].width;
                  let columnindex = customcolumn[i].index + 1;

                  if (hiddenColumn == true) {

                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                  }

                }
              }

            }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
          //$.fn.dataTable.moment('DD/MM/YY');
          $('#tblSupplierAwaitingPO').DataTable({
            columnDefs: [
              { "orderable": false, "targets": 0 },
              { type: 'date', targets: 1 }
            ],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "supplierpayment_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                  columns: ':visible'
                }
              }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "supplierpayment_" + moment().format(),
                exportOptions: {
                  columns: ':visible'
                }
              }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
              fixedColumnsLeft: 1
            },
            paging: false,
            "scrollY": "400px",
            "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[1, "desc"]],
            // "aaSorting": [[1,'desc']],
            action: function () {
              $('#tblSupplierAwaitingPO').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },

          }).on('page', function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
          }).on('column-reorder', function () {

          }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });
          $('.fullScreenSpin').css('display', 'none');
        }, 0);

        var columns = $('#tblSupplierAwaitingPO th');
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
          if ((v.className.includes("hiddenColumn"))) {
            columVisible = false;
          }
          sWidth = v.style.width.replace('px', "");
          
          let datatablerecordObj = {
            sTitle: v.innerText || '',
            sWidth: sWidth || '',
            sIndex: v.cellIndex || '',
            sVisible: columVisible || false,
            sClass: v.className || ''
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
        $('#tblSupplierAwaitingPO tbody').on('click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
          var listData = $(this).closest('tr').attr('id');
          var transactiontype = $(event.target).closest("tr").find(".colType").text();
          if ((listData) && (transactiontype)) {
            if (transactiontype === 'Purchase Order') {
              Router.go('/supplierpaymentcard?poid=' + listData);
            } else if (transactiontype === 'Bill') {
              Router.go('/supplierpaymentcard?billid=' + listData);
            } else if (transactiontype === 'Credit') {
              Router.go('/supplierpaymentcard?creditid=' + listData);
            }

          }

          // if(listData){
          //  Router.go('/supplierpaymentcard?poid='+ listData);
          // }
        });

      }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $('.fullScreenSpin').css('display', 'none');
        // Meteor._reload.reload();
      });
    });


  }

  templateObject.getAllSupplierPaymentData();
  $('#tblSupplierAwaitingPO tbody').on('click', 'tr .colPaymentDate, tr .colReceiptNo, tr .colPaymentAmount, tr .colApplied, tr .colBalance, tr .colCustomerName, tr .colDepartment, tr .colRefNo, tr .colPaymentMethod', function () {
    var listData = $(this).closest('tr').attr('id');
    var transactiontype = $(event.target).closest("tr").find(".colType").text();
    if ((listData) && (transactiontype)) {
      if (transactiontype === 'Purchase Order') {
        Router.go('/supplierpaymentcard?poid=' + listData);
      } else if (transactiontype === 'Bill') {
        Router.go('/supplierpaymentcard?billid=' + listData);
      } else if (transactiontype === 'Credit') {
        Router.go('/supplierpaymentcard?creditid=' + listData);
      }

    }

    // if(listData){
    //  Router.go('/supplierpaymentcard?poid='+ listData);
    // }
  });
});

Template.supplierawaitingpurchaseorder.events({

  'click .chkDatatable': function (event) {
    var columns = $('#tblSupplierAwaitingPO th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(':checked')) {
          $("." + replaceClass + "").css('display', 'table-cell');
          $("." + replaceClass + "").css('padding', '.75rem');
          $("." + replaceClass + "").css('vertical-align', 'top');
        } else {
          $("." + replaceClass + "").css('display', 'none');
        }
      }
    });
  },
  'click .resetTable': function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblSupplierAwaitingPO' });
        if (checkPrefDetails) {
          CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
            if (err) {

            } else {
              Meteor._reload.reload();
            }
          });

        }
      }
    }
  },
  'click .saveTable': function (event) {
    let lineItems = [];
    //let datatable =$('#tblSupplierAwaitingPO').DataTable();
    $('.columnSettings').each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || '';
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(':checked')) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      }

      lineItems.push(lineItemObj);
    });
    //datatable.state.save();

    var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblSupplierAwaitingPO' });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID, username: clientUsername, useremail: clientEmail,
              PrefGroup: 'salesform', PrefName: 'tblSupplierAwaitingPO', published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');
            }
          });

        } else {
          CloudPreference.insert({
            userid: clientID, username: clientUsername, useremail: clientEmail,
            PrefGroup: 'salesform', PrefName: 'tblSupplierAwaitingPO', published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');

            }
          });
          
        }
      }
    }

    //Meteor._reload.reload();
  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //alert(columnDataValue);
    var datable = $('#tblSupplierAwaitingPO').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblSupplierAwaitingPO th');
    $.each(datable, function (i, v) {
      
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css('width', range + 'px');

      }
    });

  },
  'click .btnOpenSettings': function (event) {
    let templateObject = Template.instance();
    var columns = $('#tblSupplierAwaitingPO th');
    
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
      if ((v.className.includes("hiddenColumn"))) {
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");

      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || '',
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click #exportbtn': function () {
    // alert('here');
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblSupplierAwaitingPO_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');

  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    sideBarService.getAllPurchaseOrderListAll().then(function (data) {
      addVS1Data('TbillReport', JSON.stringify(data)).then(function (datareturn) {
        Meteor._reload.reload();
      }).catch(function (err) {
        Meteor._reload.reload();
      });
    }).catch(function (err) {
      Meteor._reload.reload();
    });
  }
  ,
  'click .printConfirm': function (event) {

    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblSupplierAwaitingPO_wrapper .dt-buttons .btntabletopdf').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click .chkBoxAll': function () {
    if ($(event.target).is(':checked')) {
      $(".chkBox").prop("checked", true);
    } else {
      $(".chkBox").prop("checked", false);
    }
  },
  'click .chkPaymentCard': function () {
    var listData = $(this).closest('tr').attr('id');
    var selectedClient = $(event.target).closest("tr").find(".colCustomerName").text();
    const templateObject = Template.instance();
    const selectedAwaitingPayment = [];
    const selectedAwaitingPayment2 = [];
    $('.chkPaymentCard:checkbox:checked').each(function () {
      var chkIdLine = $(this).closest('tr').attr('id');
      var customername = $(this).closest('.colCustomerName');
      let paymentTransObj = {
        awaitingId: chkIdLine,
        type: $('#coltype' + chkIdLine).text(),
        clientname: $('#colSupplierName' + chkIdLine).text()
      };
      if (selectedAwaitingPayment.length > 0) {
        var checkClient = selectedAwaitingPayment.filter(slctdAwtngPyment => {
          return slctdAwtngPyment.clientname == $('#colSupplierName' + chkIdLine).text();
        });

        if (checkClient.length > 0) {
          selectedAwaitingPayment.push(paymentTransObj);
        } else {
          swal('WARNING','You have selected multiple Suppliers,  a seperate payment will be created for each', 'error');
          $(this).prop("checked", false);
        }
      } else {
       selectedAwaitingPayment.push(paymentTransObj);
      }
    });
    templateObject.selectedAwaitingPayment.set(selectedAwaitingPayment);

  },
  'click .btnSuppPayment': function () {
    const templateObject = Template.instance();
    let selectClient = templateObject.selectedAwaitingPayment.get();
    //Click Payment and check if not empty.
    if (selectClient.length === 0) {
      swal('Please select Supplier to pay for!', '', 'info');
    } else {
      var resultPO = [];
      var resultBill = [];
      var resultCredit = [];
      $.each(selectClient, function (k, v) {
        if (v.type === "Purchase Order") {
          resultPO.push(v.awaitingId);
        } else if (v.type === "Bill") {
          resultBill.push(v.awaitingId);
        } else if (v.type === "Credit") {
          resultCredit.push(v.awaitingId);
        }

      });
      Router.go('/supplierpaymentcard?selectsupppo=' + resultPO + '&selectsuppbill=' + resultBill + '&selectsuppcredit=' + resultCredit);
    }

  }


});
Template.supplierawaitingpurchaseorder.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.paymentdate == 'NA') {
        return 1;
      }
      else if (b.paymentdate == 'NA') {
        return -1;
      }
      return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblSupplierAwaitingPO' });
  }
});
