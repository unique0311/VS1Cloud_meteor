import { AppointmentService } from './appointment-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { ProductService } from "../product/product-service";
import { UtilityService } from "../utility-service";
import { SalesBoardService } from '../js/sales-service';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.appointmenttimelist.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.productsrecord = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.clientrecords = new ReactiveVar([]);
  templateObject.selectedAppointment = new ReactiveVar([]);
  templateObject.appointmentInfo = new ReactiveVar([]);
});

Template.appointmenttimelist.onRendered(function () {
  $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let accountService = new AccountService();
  let appointmentService = new AppointmentService();
  let clientsService = new SalesBoardService();
  let productService = new ProductService();
  const supplierList = [];
  let billTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];
  const clientList = [];

  Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmenttimelist', function (error, result) {
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

  templateObject.diff_hours = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);
  }

  templateObject.dateFormat = function (date) {
    var dateParts = date.split("/");
    var dateObject = dateParts[2] + '/' + ('0' + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
    return dateObject;
  }

  templateObject.getAllProductData = function () {
    productList = [];
    getVS1Data('TProductVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        productService.getNewProductListVS1().then(function (data) {
          var dataList = {};
          for (let i = 0; i < data.tproductvs1.length; i++) {
            dataList = {
              id: data.tproductvs1[i].Id || '',
              productname: data.tproductvs1[i].ProductName || ''
            }
            productList.push(dataList);
          }
          templateObject.productsrecord.set(productList);

        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tproductvs1;
        var dataList = {};
        for (let i = 0; i < useData.length; i++) {
          dataList = {
            id: useData[i].fields.ID || '',
            productname: useData[i].fields.ProductName || ''
          }
          if (useData[i].fields.ProductType != 'INV') {
            productList.push(dataList);
          }

        }
        templateObject.productsrecord.set(productList);

      }
    }).catch(function (err) {
      console.log(err);
      productService.getNewProductListVS1().then(function (data) {

        var dataList = {};
        for (let i = 0; i < data.tproductvs1.length; i++) {
          dataList = {
            id: data.tproductvs1[i].Id || '',
            productname: data.tproductvs1[i].ProductName || ''
          }
          productList.push(dataList);

        }
        templateObject.productsrecord.set(productList);

      });
    });

  }

  $(".formClassDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    dateFormat: 'dd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });
  templateObject.getAllClients = function () {
    getVS1Data('TCustomerVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        clientsService.getClientVS1().then(function (data) {
          for (let i in data.tcustomervs1) {

            let customerrecordObj = {
              customerid: data.tcustomervs1[i].Id || ' ',
              customername: data.tcustomervs1[i].ClientName || ' ',
              customeremail: data.tcustomervs1[i].Email || ' ',
              street: data.tcustomervs1[i].Street || ' ',
              street2: data.tcustomervs1[i].Street2 || ' ',
              street3: data.tcustomervs1[i].Street3 || ' ',
              suburb: data.tcustomervs1[i].Suburb || ' ',
              phone: data.tcustomervs1[i].Phone || ' ',
              statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
              country: data.tcustomervs1[i].Country || ' ',
              termsName: data.tcustomervs1[i].TermsName || ''
            };
            //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
            clientList.push(customerrecordObj);

            //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
          }
          templateObject.clientrecords.set(clientList);
          templateObject.clientrecords.set(clientList.sort(function (a, b) {
            if (a.customername == 'NA') {
              return 1;
            }
            else if (b.customername == 'NA') {
              return -1;
            }
            return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
          }));

          for (var i = 0; i < clientList.length; i++) {
            $('#customer').editableSelect('add', clientList[i].customername);
          }

        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcustomervs1;
        for (let i in useData) {

          let customerrecordObj = {
            customerid: useData[i].fields.ID || ' ',
            customername: useData[i].fields.ClientName || ' ',
            customeremail: useData[i].fields.Email || ' ',
            street: useData[i].fields.Street || ' ',
            street2: useData[i].fields.Street2 || ' ',
            street3: useData[i].fields.Street3 || ' ',
            suburb: useData[i].fields.Suburb || ' ',
            phone: useData[i].fields.Phone || ' ',
            statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
            country: useData[i].fields.Country || ' ',
            termsName: useData[i].fields.TermsName || ''
          };
          //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
          clientList.push(customerrecordObj);

          //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
        }
        templateObject.clientrecords.set(clientList);
        templateObject.clientrecords.set(clientList.sort(function (a, b) {
          if (a.customername == 'NA') {
            return 1;
          }
          else if (b.customername == 'NA') {
            return -1;
          }
          return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
        }));

        for (var i = 0; i < clientList.length; i++) {
          $('#customer').editableSelect('add', clientList[i].customername);
        }

      }
    }).catch(function (err) {
      clientsService.getClientVS1().then(function (data) {
        for (let i in data.tcustomervs1) {

          let customerrecordObj = {
            customerid: data.tcustomervs1[i].Id || ' ',
            customername: data.tcustomervs1[i].ClientName || ' ',
            customeremail: data.tcustomervs1[i].Email || ' ',
            street: data.tcustomervs1[i].Street || ' ',
            street2: data.tcustomervs1[i].Street2 || ' ',
            street3: data.tcustomervs1[i].Street3 || ' ',
            suburb: data.tcustomervs1[i].Suburb || ' ',
            phone: data.tcustomervs1[i].Phone || ' ',
            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
            country: data.tcustomervs1[i].Country || ' ',
            termsName: data.tcustomervs1[i].TermsName || ''
          };
          //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
          clientList.push(customerrecordObj);

          //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
        }
        templateObject.clientrecords.set(clientList);
        templateObject.clientrecords.set(clientList.sort(function (a, b) {
          if (a.customername == 'NA') {
            return 1;
          }
          else if (b.customername == 'NA') {
            return -1;
          }
          return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
        }));

        for (var i = 0; i < clientList.length; i++) {
          $('#customer').editableSelect('add', clientList[i].customername);
        }

      });
    });

  };

  templateObject.getAllClients();
  templateObject.getAllReconData = function () {
    ///if(!localStorage.getItem('VS1TReconcilationList')){
    getVS1Data('TAppointment').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getAllAppointmentList().then(function (data) {
          // localStorage.setItem('VS1TReconcilationList', JSON.stringify(data)||'');
          let lineItems = [];
          let lineItemObj = {};
          var dataList = "";
          for (let i = 0; i < data.tappointment.length; i++) {
            if (data.tappointment[i].fields.AppointmentsTimeLog != null) {
              let url = new URL(window.location.href);
              let searchID = parseInt(url.searchParams.get("id")) || 0;
              // let openBalance = utilityService.modifynegativeCurrencyFormat(data.tappointment[i].fields.OpenBalance)|| 0.00;
              // let closeBalance = utilityService.modifynegativeCurrencyFormat(data.tappointment[i].fields.CloseBalance)|| 0.00;
              if (data.tappointment[i].fields.AppointmentsTimeLog.length) {
                for (let a = 0; a < data.tappointment[i].fields.AppointmentsTimeLog.length; a++) {
                  if (searchID == data.tappointment[i].fields.AppointmentsTimeLog[a].fields.AppointID) {
                    dataList = {
                      id: data.tappointment[i].fields.AppointmentsTimeLog[a].fields.AppointID || '',
                      appointmentdate: data.tappointment[i].fields.MsTimeStamp != '' ? moment(data.tappointment[i].fields.MsTimeStamp).format("DD/MM/YYYY") : data.tappointment[i].fields.MsTimeStamp,
                      accountname: data.tappointment[i].fields.ClientName || '',
                      statementno: data.tappointment[i].fields.TrainerName || '',
                      employeename: data.tappointment[i].fields.TrainerName || '',
                      department: data.tappointment[i].fields.DeptClassName || '',
                      phone: data.tappointment[i].fields.Phone || '',
                      mobile: data.tappointment[i].fields.ClientMobile || '',
                      suburb: data.tappointment[i].fields.Suburb || '',
                      street: data.tappointment[i].fields.Street || '',
                      state: data.tappointment[i].fields.State || '',
                      country: data.tappointment[i].fields.Country || '',
                      zip: data.tappointment[i].fields.Postcode || '',
                      timelog: new Array(data.tappointment[i].fields.AppointmentsTimeLog) || '',
                      startTime: data.tappointment[i].fields.StartTime.split(' ')[1] || '',
                      timeStart: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.StartDatetime).format('h:mm a'),
                      timeEnd: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.EndDateTime).format('h:mm a'),
                      totalHours: data.tappointment[i].fields.TotalHours || 0,
                      endTime: data.tappointment[i].fields.EndTime.split(' ')[1] || '',
                      startDate: data.tappointment[i].fields.StartTime || '',
                      endDate: data.tappointment[i].fields.EndTime || '',
                      frmDate: moment(data.tappointment[i].fields.StartTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.StartTime).format('DD'),
                      toDate: moment(data.tappointment[i].fields.endTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.endTime).format('DD'),
                      fromDate: data.tappointment[i].fields.Actual_EndTime != '' ? moment(data.tappointment[i].fields.Actual_EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.Actual_EndTime,
                      openbalance: data.tappointment[i].fields.Actual_EndTime || '',
                      aStartTime: data.tappointment[i].fields.Actual_StartTime.split(' ')[1] || '',
                      aEndTime: data.tappointment[i].fields.Actual_EndTime.split(' ')[1] || '',
                      actualHours: '',
                      closebalance: '',
                      product: data.tappointment[i].fields.ProductDesc || '',
                      finished: data.tappointment[i].fields.Status || '',
                      employee: data.tappointment[i].fields.EndTime != '' ? moment(data.tappointment[i].fields.EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.EndTime,
                      notes: data.tappointment[i].fields.Notes || ''
                    };
                    dataTableList.push(dataList);
                  } else {
                    dataList = {
                      id: data.tappointment[i].fields.AppointmentsTimeLog[a].fields.AppointID || '',
                      appointmentdate: data.tappointment[i].fields.MsTimeStamp != '' ? moment(data.tappointment[i].fields.MsTimeStamp).format("DD/MM/YYYY") : data.tappointment[i].fields.MsTimeStamp,
                      accountname: data.tappointment[i].fields.ClientName || '',
                      statementno: data.tappointment[i].fields.TrainerName || '',
                      employeename: data.tappointment[i].fields.TrainerName || '',
                      department: data.tappointment[i].fields.DeptClassName || '',
                      phone: data.tappointment[i].fields.Phone || '',
                      mobile: data.tappointment[i].fields.ClientMobile || '',
                      suburb: data.tappointment[i].fields.Suburb || '',
                      street: data.tappointment[i].fields.Street || '',
                      state: data.tappointment[i].fields.State || '',
                      country: data.tappointment[i].fields.Country || '',
                      zip: data.tappointment[i].fields.Postcode || '',
                      timelog: new Array(data.tappointment[i].fields.AppointmentsTimeLog) || '',
                      startTime: data.tappointment[i].fields.StartTime.split(' ')[1] || '',
                      timeStart: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.StartDatetime).format('h:mm a'),
                      timeEnd: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.EndDateTime).format('h:mm a'),
                      totalHours: data.tappointment[i].fields.TotalHours || 0,
                      endTime: data.tappointment[i].fields.EndTime.split(' ')[1] || '',
                      startDate: data.tappointment[i].fields.StartTime || '',
                      endDate: data.tappointment[i].fields.EndTime || '',
                      frmDate: moment(data.tappointment[i].fields.StartTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.StartTime).format('DD'),
                      toDate: moment(data.tappointment[i].fields.endTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.endTime).format('DD'),
                      fromDate: data.tappointment[i].fields.Actual_EndTime != '' ? moment(data.tappointment[i].fields.Actual_EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.Actual_EndTime,
                      openbalance: data.tappointment[i].fields.Actual_EndTime || '',
                      aStartTime: data.tappointment[i].fields.Actual_StartTime.split(' ')[1] || '',
                      aEndTime: data.tappointment[i].fields.Actual_EndTime.split(' ')[1] || '',
                      actualHours: '',
                      closebalance: '',
                      product: data.tappointment[i].fields.ProductDesc || '',
                      finished: data.tappointment[i].fields.Status || '',
                      employee: data.tappointment[i].fields.EndTime != '' ? moment(data.tappointment[i].fields.EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.EndTime,
                      notes: data.tappointment[i].fields.Notes || ''
                    };
                    dataTableList.push(dataList);
                  }
                }

              } else {
                dataList = {
                  id: data.tappointment[i].fields.AppointmentsTimeLog.fields.AppointID || '',
                  appointmentdate: data.tappointment[i].fields.MsTimeStamp != '' ? moment(data.tappointment[i].fields.MsTimeStamp).format("DD/MM/YYYY") : data.tappointment[i].fields.MsTimeStamp,
                  accountname: data.tappointment[i].fields.ClientName || '',
                  statementno: data.tappointment[i].fields.TrainerName || '',
                  employeename: data.tappointment[i].fields.TrainerName || '',
                  department: data.tappointment[i].fields.DeptClassName || '',
                  phone: data.tappointment[i].fields.Phone || '',
                  mobile: data.tappointment[i].fields.ClientMobile || '',
                  suburb: data.tappointment[i].fields.Suburb || '',
                  street: data.tappointment[i].fields.Street || '',
                  state: data.tappointment[i].fields.State || '',
                  country: data.tappointment[i].fields.Country || '',
                  zip: data.tappointment[i].fields.Postcode || '',
                  timelog: new Array(data.tappointment[i].fields.AppointmentsTimeLog) || '',
                  startTime: data.tappointment[i].fields.StartTime.split(' ')[1] || '',
                  timeStart: moment(data.tappointment[i].fields.AppointmentsTimeLog.fields.StartDatetime).format('h:mm a'),
                  timeEnd: moment(data.tappointment[i].fields.AppointmentsTimeLog.fields.EndDateTime).format('h:mm a'),
                  totalHours: data.tappointment[i].fields.TotalHours || 0,
                  endTime: data.tappointment[i].fields.EndTime.split(' ')[1] || '',
                  startDate: data.tappointment[i].fields.StartTime || '',
                  endDate: data.tappointment[i].fields.EndTime || '',
                  frmDate: moment(data.tappointment[i].fields.StartTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.StartTime).format('DD'),
                  toDate: moment(data.tappointment[i].fields.endTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.endTime).format('DD'),
                  fromDate: data.tappointment[i].fields.Actual_EndTime != '' ? moment(data.tappointment[i].fields.Actual_EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.Actual_EndTime,
                  openbalance: data.tappointment[i].fields.Actual_EndTime || '',
                  aStartTime: data.tappointment[i].fields.Actual_StartTime.split(' ')[1] || '',
                  aEndTime: data.tappointment[i].fields.Actual_EndTime.split(' ')[1] || '',
                  actualHours: '',
                  closebalance: '',
                  product: data.tappointment[i].fields.ProductDesc || '',
                  finished: data.tappointment[i].fields.Status || '',
                  employee: data.tappointment[i].fields.EndTime != '' ? moment(data.tappointment[i].fields.EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.EndTime,
                  notes: data.tappointment[i].fields.Notes || ''
                };
                dataTableList.push(dataList);
              }

            }
          }

          templateObject.datatablerecords.set(dataTableList);

          if (templateObject.datatablerecords.get()) {

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmenttimelist', function (error, result) {
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

          setTimeout(function () {
            $('.fullScreenSpin').css('display', 'none');
            //$.fn.dataTable.moment('DD/MM/YY');
            $('#tblappointmenttimelist').DataTable({
              columnDefs: [
                { type: 'date', targets: 0 }
              ],
              // "sDom": "<'row'><'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              buttons: [
                {
                  extend: 'excelHtml5',
                  text: '',
                  download: 'open',
                  className: "btntabletocsv hiddenColumn",
                  filename: "appointmentlist_" + moment().format(),
                  orientation: 'portrait',
                  exportOptions: {
                    columns: ':visible'
                  }
                }, {
                  extend: 'print',
                  download: 'open',
                  className: "btntabletopdf hiddenColumn",
                  text: '',
                  title: 'Reconciliation',
                  filename: "appointmentlist_" + moment().format(),
                  exportOptions: {
                    columns: ':visible'
                  }
                }],
              select: true,
              destroy: true,
              colReorder: true,
              // bStateSave: true,
              // rowId: 0,
              pageLength: 25,
              lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
              info: true,
              responsive: true,
              "order": [[0, "desc"]],
              action: function () {
                $('#tblappointmenttimelist').DataTable().ajax.reload();
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

          var columns = $('#tblappointmenttimelist th');
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
            //console.log(sWidth);
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

        }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display', 'none');
          // Meteor._reload.reload();
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tappointment;
        let lineItems = [];
        let lineItemObj = {};
        appointmentTable = [];
        var dataList = "";
        let times = [];
        for (let i = 0; i < useData.length; i++) {

          var appointment = {
            id: useData[i].fields.ID || '',
            sortdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("YYYY/MM/DD") : "",
            appointmentdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : "",
            accountname: useData[i].fields.ClientName || '',
            statementno: useData[i].fields.TrainerName || '',
            employeename: useData[i].fields.TrainerName || '',
            department: useData[i].fields.DeptClassName || '',
            phone: useData[i].fields.Phone || '',
            mobile: useData[i].fields.Mobile || '',
            suburb: useData[i].fields.Suburb || '',
            street: useData[i].fields.Street || '',
            state: useData[i].fields.State || '',
            country: useData[i].fields.Country || '',
            zip: useData[i].fields.Postcode || '',
            startTime: useData[i].fields.StartTime.split(' ')[1] || '',
            totalHours: useData[i].fields.TotalHours || 0,
            endTime: useData[i].fields.EndTime.split(' ')[1] || '',
            startDate: useData[i].fields.StartTime || '',
            endDate: useData[i].fields.EndTime || '',
            fromDate: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
            openbalance: useData[i].fields.Actual_EndTime || '',
            aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
            aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
            actualHours: '',
            closebalance: '',
            product: useData[i].fields.ProductDesc || '',
            finished: useData[i].fields.Status || '',
            //employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
            notes: useData[i].fields.Notes || ''
          };

          appointmentTable.push(appointment);
          if (useData[i].fields.AppointmentsTimeLog != null) {
            let url = new URL(window.location.href);
            let searchID = parseInt(url.searchParams.get("id")) || 0;
            if (Array.isArray(useData[i].fields.AppointmentsTimeLog)) {
              for (let a = 0; a < useData[i].fields.AppointmentsTimeLog.length; a++) {
                if (searchID != 0) {
                  if (searchID == useData[i].fields.AppointmentsTimeLog[a].fields.AppointID) {
                    if (useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime != "") {
                      useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime = moment(useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime).format('h:mm a')
                    }
    
                    if (useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime != "") {
                      useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime = moment(useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime).format('h:mm a')
                    }
                    
                    dataList = {
                      id: useData[i].fields.AppointmentsTimeLog[a].fields.AppointID || '',
                      appointmentdate: useData[i].fields.MsTimeStamp != '' ? moment(useData[i].fields.MsTimeStamp).format("DD/MM/YYYY") : useData[i].fields.MsTimeStamp,
                      accountname: useData[i].fields.ClientName || '',
                      statementno: useData[i].fields.TrainerName || '',
                      employeename: useData[i].fields.TrainerName || '',
                      department: useData[i].fields.DeptClassName || '',
                      phone: useData[i].fields.Phone || '',
                      mobile: useData[i].fields.ClientMobile || '',
                      suburb: useData[i].fields.Suburb || '',
                      street: useData[i].fields.Street || '',
                      state: useData[i].fields.State || '',
                      country: useData[i].fields.Country || '',
                      zip: useData[i].fields.Postcode || '',
                      timelog: new Array(useData[i].fields.AppointmentsTimeLog) || '',
                      startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                      timeStart: useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime || '',
                      timeEnd: useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime || '',
                      totalHours: useData[i].fields.TotalHours || 0,
                      endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                      startDate: useData[i].fields.StartTime || '',
                      endDate: useData[i].fields.EndTime || '',
                      frmDate: moment(useData[i].fields.StartTime).format('dddd') + ', ' + moment(useData[i].fields.StartTime).format('DD'),
                      toDate: moment(useData[i].fields.endTime).format('dddd') + ', ' + moment(useData[i].fields.endTime).format('DD'),
                      fromDate: useData[i].fields.Actual_EndTime != '' ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : useData[i].fields.Actual_EndTime,
                      openbalance: useData[i].fields.Actual_EndTime || '',
                      aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                      aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                      actualHours: '',
                      closebalance: '',
                      product: useData[i].fields.ProductDesc || '',
                      finished: useData[i].fields.Status || '',
                      employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                      notes: useData[i].fields.AppointmentsTimeLog[a].fields.Description || ''
                    };
                    dataTableList.push(dataList);
                  }
                } else {
                  if (useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime != "") {
                    useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime = moment(useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime).format('h:mm a')
                  }
  
                  if (useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime != "") {
                    useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime = moment(useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime).format('h:mm a')
                  }
                  dataList = {
                    id: useData[i].fields.AppointmentsTimeLog[a].fields.AppointID || '',
                    appointmentdate: useData[i].fields.MsTimeStamp != '' ? moment(useData[i].fields.MsTimeStamp).format("DD/MM/YYYY") : useData[i].fields.MsTimeStamp,
                    accountname: useData[i].fields.ClientName || '',
                    statementno: useData[i].fields.TrainerName || '',
                    employeename: useData[i].fields.TrainerName || '',
                    department: useData[i].fields.DeptClassName || '',
                    phone: useData[i].fields.Phone || '',
                    mobile: useData[i].fields.ClientMobile || '',
                    suburb: useData[i].fields.Suburb || '',
                    street: useData[i].fields.Street || '',
                    state: useData[i].fields.State || '',
                    country: useData[i].fields.Country || '',
                    zip: useData[i].fields.Postcode || '',
                    timelog: new Array(useData[i].fields.AppointmentsTimeLog) || '',
                    startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                    timeStart: useData[i].fields.AppointmentsTimeLog[a].fields.StartDatetime || '',
                    timeEnd: useData[i].fields.AppointmentsTimeLog[a].fields.EndDateTime || '',
                    totalHours: useData[i].fields.TotalHours || 0,
                    endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                    startDate: useData[i].fields.StartTime || '',
                    endDate: useData[i].fields.EndTime || '',
                    frmDate: moment(useData[i].fields.StartTime).format('dddd') + ', ' + moment(useData[i].fields.StartTime).format('DD'),
                    toDate: moment(useData[i].fields.endTime).format('dddd') + ', ' + moment(useData[i].fields.endTime).format('DD'),
                    fromDate: useData[i].fields.Actual_EndTime != '' ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : useData[i].fields.Actual_EndTime,
                    openbalance: useData[i].fields.Actual_EndTime || '',
                    aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                    aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                    actualHours: '',
                    closebalance: '',
                    product: useData[i].fields.ProductDesc || '',
                    finished: useData[i].fields.Status || '',
                    employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                    notes: useData[i].fields.AppointmentsTimeLog[a].fields.Description || ''
                  };

                  dataTableList.push(dataList);
                }
              }
            } else {
              if (searchID != 0) {
                if (searchID == useData[i].fields.AppointmentsTimeLog.fields.AppointID) {
                  if (useData[i].fields.AppointmentsTimeLog.fields.StartDatetime != "") {
                    useData[i].fields.AppointmentsTimeLog.fields.StartDatetime = moment(useData[i].fields.AppointmentsTimeLog.fields.StartDatetime).format('h:mm a')
                  }
                  if (useData[i].fields.AppointmentsTimeLog.fields.EndDateTime != "") {
                    useData[i].fields.AppointmentsTimeLog.fields.EndDateTime = moment(useData[i].fields.AppointmentsTimeLog.fields.EndDateTime).format('h:mm a')
                  }

                  dataList = {
                    id: useData[i].fields.AppointmentsTimeLog.fields.AppointID || '',
                    appointmentdate: useData[i].fields.MsTimeStamp != '' ? moment(useData[i].fields.MsTimeStamp).format("DD/MM/YYYY") : useData[i].fields.MsTimeStamp,
                    accountname: useData[i].fields.ClientName || '',
                    statementno: useData[i].fields.TrainerName || '',
                    employeename: useData[i].fields.TrainerName || '',
                    department: useData[i].fields.DeptClassName || '',
                    phone: useData[i].fields.Phone || '',
                    mobile: useData[i].fields.ClientMobile || '',
                    suburb: useData[i].fields.Suburb || '',
                    street: useData[i].fields.Street || '',
                    state: useData[i].fields.State || '',
                    country: useData[i].fields.Country || '',
                    zip: useData[i].fields.Postcode || '',
                    timelog: new Array(useData[i].fields.AppointmentsTimeLog) || '',
                    startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                    timeStart: useData[i].fields.AppointmentsTimeLog.fields.StartDatetime || '',
                    timeEnd: useData[i].fields.AppointmentsTimeLog.fields.EndDateTime || '',
                    totalHours: useData[i].fields.TotalHours || 0,
                    endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                    startDate: useData[i].fields.StartTime || '',
                    endDate: useData[i].fields.EndTime || '',
                    frmDate: moment(useData[i].fields.StartTime).format('dddd') + ', ' + moment(useData[i].fields.StartTime).format('DD') || '',
                    toDate: moment(useData[i].fields.endTime).format('dddd') + ', ' + moment(useData[i].fields.endTime).format('DD') || '',
                    fromDate: useData[i].fields.Actual_EndTime != '' ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : useData[i].fields.Actual_EndTime,
                    openbalance: useData[i].fields.Actual_EndTime || '',
                    aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                    aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                    actualHours: '',
                    closebalance: '',
                    product: useData[i].fields.ProductDesc || '',
                    finished: useData[i].fields.Status || '',
                    employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                    notes: useData[i].fields.AppointmentsTimeLog.fields.Description || ''
                  };
                  dataTableList.push(dataList);
                }
              } else {
                
                if (useData[i].fields.AppointmentsTimeLog.fields.StartDatetime != "") {
                  useData[i].fields.AppointmentsTimeLog.fields.StartDatetime = moment(useData[i].fields.AppointmentsTimeLog.fields.StartDatetime).format('h:mm a');
                }

                if (useData[i].fields.AppointmentsTimeLog.fields.EndDateTime != "") {
                  useData[i].fields.AppointmentsTimeLog.fields.EndDateTime = moment(useData[i].fields.AppointmentsTimeLog.fields.EndDateTime).format('h:mm a');
                }

                dataList = {
                  id: useData[i].fields.AppointmentsTimeLog.fields.AppointID || '',
                  appointmentdate: useData[i].fields.MsTimeStamp != '' ? moment(useData[i].fields.MsTimeStamp).format("DD/MM/YYYY") : useData[i].fields.MsTimeStamp,
                  accountname: useData[i].fields.ClientName || '',
                  statementno: useData[i].fields.TrainerName || '',
                  employeename: useData[i].fields.TrainerName || '',
                  department: useData[i].fields.DeptClassName || '',
                  phone: useData[i].fields.Phone || '',
                  mobile: useData[i].fields.ClientMobile || '',
                  suburb: useData[i].fields.Suburb || '',
                  street: useData[i].fields.Street || '',
                  state: useData[i].fields.State || '',
                  country: useData[i].fields.Country || '',
                  zip: useData[i].fields.Postcode || '',
                  timelog: new Array(useData[i].fields.AppointmentsTimeLog) || '',
                  startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                  timeStart: useData[i].fields.AppointmentsTimeLog.fields.StartDatetime || '',
                  timeEnd: useData[i].fields.AppointmentsTimeLog.fields.EndDateTime || '',
                  totalHours: useData[i].fields.TotalHours || 0,
                  endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                  startDate: useData[i].fields.StartTime || '',
                  endDate: useData[i].fields.EndTime || '',
                  frmDate: moment(useData[i].fields.StartTime).format('dddd') + ', ' + moment(useData[i].fields.StartTime).format('DD'),
                  toDate: moment(useData[i].fields.endTime).format('dddd') + ', ' + moment(useData[i].fields.endTime).format('DD'),
                  fromDate: useData[i].fields.Actual_EndTime != '' ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : useData[i].fields.Actual_EndTime,
                  openbalance: useData[i].fields.Actual_EndTime || '',
                  aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                  aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                  actualHours: '',
                  closebalance: '',
                  product: useData[i].fields.ProductDesc || '',
                  finished: useData[i].fields.Status || '',
                  employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                  notes: useData[i].fields.AppointmentsTimeLog.fields.Description || ''
                };
                dataTableList.push(dataList);
              }
            }
          }

        }
      }
      templateObject.datatablerecords.set(dataTableList);
      templateObject.appointmentInfo.set(appointmentTable);
      if (templateObject.datatablerecords.get()) {

        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmenttimelist', function (error, result) {
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

      setTimeout(function () {
        $('.fullScreenSpin').css('display', 'none');
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblappointmenttimelist').DataTable({
          columnDefs: [
            { type: 'date', targets: 0 }
          ],
          // "sDom": "<'row'><'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          buttons: [
            {
              extend: 'excelHtml5',
              text: '',
              download: 'open',
              className: "btntabletocsv hiddenColumn",
              filename: "appointmentlist_" + moment().format(),
              orientation: 'portrait',
              exportOptions: {
                columns: ':visible'
              }
            }, {
              extend: 'print',
              download: 'open',
              className: "btntabletopdf hiddenColumn",
              text: '',
              title: 'Reconciliation',
              filename: "appointmentlist_" + moment().format(),
              exportOptions: {
                columns: ':visible'
              }
            }],
          select: true,
          destroy: true,
          colReorder: true,
          // bStateSave: true,
          // rowId: 0,
          pageLength: 25,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
          info: true,
          responsive: true,
          "order": [[0, "desc"]],
          action: function () {
            $('#tblappointmenttimelist').DataTable().ajax.reload();
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

      var columns = $('#tblappointmenttimelist th');
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
        //console.log(sWidth);
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
    }).catch(function (err) {
      console.log(err);
      sideBarService.getAllAppointmentList().then(function (data) {
        // localStorage.setItem('VS1TReconcilationList', JSON.stringify(data)||'');
        let lineItems = [];
        let lineItemObj = {};
        var dataList = "";
        for (let i = 0; i < data.tappointment.length; i++) {
          if (data.tappointment[i].fields.AppointmentsTimeLog != null) {
            // let openBalance = utilityService.modifynegativeCurrencyFormat(data.tappointment[i].fields.OpenBalance)|| 0.00;
            // let closeBalance = utilityService.modifynegativeCurrencyFormat(data.tappointment[i].fields.CloseBalance)|| 0.00;
            if (data.tappointment[i].fields.AppointmentsTimeLog.length) {
              for (let a = 0; a < data.tappointment[i].fields.AppointmentsTimeLog.length; a++) {
                dataList = {
                  id: data.tappointment[i].fields.AppointmentsTimeLog[a].fields.AppointID || '',
                  appointmentdate: data.tappointment[i].fields.MsTimeStamp != '' ? moment(data.tappointment[i].fields.MsTimeStamp).format("DD/MM/YYYY") : data.tappointment[i].fields.MsTimeStamp,
                  accountname: data.tappointment[i].fields.ClientName || '',
                  statementno: data.tappointment[i].fields.TrainerName || '',
                  employeename: data.tappointment[i].fields.TrainerName || '',
                  department: data.tappointment[i].fields.DeptClassName || '',
                  phone: data.tappointment[i].fields.Phone || '',
                  mobile: data.tappointment[i].fields.ClientMobile || '',
                  suburb: data.tappointment[i].fields.Suburb || '',
                  street: data.tappointment[i].fields.Street || '',
                  state: data.tappointment[i].fields.State || '',
                  country: data.tappointment[i].fields.Country || '',
                  zip: data.tappointment[i].fields.Postcode || '',
                  timelog: new Array(data.tappointment[i].fields.AppointmentsTimeLog) || '',
                  startTime: data.tappointment[i].fields.StartTime.split(' ')[1] || '',
                  timeStart: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.StartDatetime).format('h:mm a'),
                  timeEnd: moment(data.tappointment[i].fields.AppointmentsTimeLog[a].fields.EndDateTime).format('h:mm a'),
                  totalHours: data.tappointment[i].fields.TotalHours || 0,
                  endTime: data.tappointment[i].fields.EndTime.split(' ')[1] || '',
                  startDate: data.tappointment[i].fields.StartTime || '',
                  endDate: data.tappointment[i].fields.EndTime || '',
                  frmDate: moment(data.tappointment[i].fields.StartTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.StartTime).format('DD'),
                  toDate: moment(data.tappointment[i].fields.endTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.endTime).format('DD'),
                  fromDate: data.tappointment[i].fields.Actual_EndTime != '' ? moment(data.tappointment[i].fields.Actual_EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.Actual_EndTime,
                  openbalance: data.tappointment[i].fields.Actual_EndTime || '',
                  aStartTime: data.tappointment[i].fields.Actual_StartTime.split(' ')[1] || '',
                  aEndTime: data.tappointment[i].fields.Actual_EndTime.split(' ')[1] || '',
                  actualHours: '',
                  closebalance: '',
                  product: data.tappointment[i].fields.ProductDesc || '',
                  finished: data.tappointment[i].fields.Status || '',
                  employee: data.tappointment[i].fields.EndTime != '' ? moment(data.tappointment[i].fields.EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.EndTime,
                  notes: data.tappointment[i].fields.Notes || ''
                };
                dataTableList.push(dataList);
              }

            } else {
              dataList = {
                id: data.tappointment[i].fields.AppointmentsTimeLog.fields.AppointID || '',
                appointmentdate: data.tappointment[i].fields.MsTimeStamp != '' ? moment(data.tappointment[i].fields.MsTimeStamp).format("DD/MM/YYYY") : data.tappointment[i].fields.MsTimeStamp,
                accountname: data.tappointment[i].fields.ClientName || '',
                statementno: data.tappointment[i].fields.TrainerName || '',
                employeename: data.tappointment[i].fields.TrainerName || '',
                department: data.tappointment[i].fields.DeptClassName || '',
                phone: data.tappointment[i].fields.Phone || '',
                mobile: data.tappointment[i].fields.ClientMobile || '',
                suburb: data.tappointment[i].fields.Suburb || '',
                street: data.tappointment[i].fields.Street || '',
                state: data.tappointment[i].fields.State || '',
                country: data.tappointment[i].fields.Country || '',
                zip: data.tappointment[i].fields.Postcode || '',
                timelog: new Array(data.tappointment[i].fields.AppointmentsTimeLog) || '',
                startTime: data.tappointment[i].fields.StartTime.split(' ')[1] || '',
                timeStart: moment(data.tappointment[i].fields.AppointmentsTimeLog.fields.StartDatetime).format('h:mm a'),
                timeEnd: moment(data.tappointment[i].fields.AppointmentsTimeLog.fields.EndDateTime).format('h:mm a'),
                totalHours: data.tappointment[i].fields.TotalHours || 0,
                endTime: data.tappointment[i].fields.EndTime.split(' ')[1] || '',
                startDate: data.tappointment[i].fields.StartTime || '',
                endDate: data.tappointment[i].fields.EndTime || '',
                frmDate: moment(data.tappointment[i].fields.StartTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.StartTime).format('DD'),
                toDate: moment(data.tappointment[i].fields.endTime).format('dddd') + ', ' + moment(data.tappointment[i].fields.endTime).format('DD'),
                fromDate: data.tappointment[i].fields.Actual_EndTime != '' ? moment(data.tappointment[i].fields.Actual_EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.Actual_EndTime,
                openbalance: data.tappointment[i].fields.Actual_EndTime || '',
                aStartTime: data.tappointment[i].fields.Actual_StartTime.split(' ')[1] || '',
                aEndTime: data.tappointment[i].fields.Actual_EndTime.split(' ')[1] || '',
                actualHours: '',
                closebalance: '',
                product: data.tappointment[i].fields.ProductDesc || '',
                finished: data.tappointment[i].fields.Status || '',
                employee: data.tappointment[i].fields.EndTime != '' ? moment(data.tappointment[i].fields.EndTime).format("DD/MM/YYYY") : data.tappointment[i].fields.EndTime,
                notes: data.tappointment[i].fields.Notes || ''
              };
              dataTableList.push(dataList);
            }

          }
        }
        templateObject.datatablerecords.set(dataTableList);

        if (templateObject.datatablerecords.get()) {

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmenttimelist', function (error, result) {
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

        setTimeout(function () {
          $('.fullScreenSpin').css('display', 'none');
          //$.fn.dataTable.moment('DD/MM/YY');
          $('#tblappointmenttimelist').DataTable({
            columnDefs: [
              { type: 'date', targets: 0 }
            ],
            // "sDom": "<'row'><'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "appointmentlist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                  columns: ':visible'
                }
              }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Reconciliation',
                filename: "appointmentlist_" + moment().format(),
                exportOptions: {
                  columns: ':visible'
                }
              }],
            select: true,
            destroy: true,
            colReorder: true,
            // bStateSave: true,
            // rowId: 0,
            pageLength: 25,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            info: true,
            responsive: true,
            "order": [[0, "desc"]],
            action: function () {
              $('#tblappointmenttimelist').DataTable().ajax.reload();
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

        var columns = $('#tblappointmenttimelist th');
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
          //console.log(sWidth);
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

      }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $('.fullScreenSpin').css('display', 'none');
        // Meteor._reload.reload();
      });
    });



  }

  templateObject.getAllReconData();

  $('#tblappointmenttimelist tbody').on('click', 'tr td:not(:first-child)', function () {
    document.getElementById("frmAppointment").reset();
    var id = $(this).closest('tr').attr('id');
    window.open('appointments?id='+id,'_self');
  });


});

Template.appointmenttimelist.events({
  'click #btnAppointment': function (event) {
    Router.go('/appointments');
  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentDate = new Date();
    let hours = currentDate.getHours(); //returns 0-23
    let minutes = currentDate.getMinutes(); //returns 0-59
    let seconds = currentDate.getSeconds(); //returns 0-59
    let month = (currentDate.getMonth() + 1);
    let days = currentDate.getDate();

    if (currentDate.getMonth() < 10) {
      month = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
      days = "0" + currentDate.getDate();
    }
    let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
    let templateObject = Template.instance();
    getVS1Data('TAppointment').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getAllAppointmentList().then(function (data) {
          addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
            window.open('/appointmenttimelist', '_self');
          }).catch(function (err) {
            window.open('/appointmenttimelist', '_self');
          });
        }).catch(function (err) {
          window.open('/appointmenttimelist', '_self');
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tappointment;
        if (useData[0].Id) {
          sideBarService.getAllAppointmentList().then(function (data) {
            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
              window.open('/appointmenttimelist', '_self');
            }).catch(function (err) {
              window.open('/appointmenttimelist', '_self');
            });
          }).catch(function (err) {
            window.open('/appointmenttimelist', '_self');
          });
        } else {
          let getTimeStamp = dataObject[0].timestamp;
          if (getTimeStamp) {
            if (getTimeStamp[0] != currenctTodayDate) {
              sideBarService.getAllAppointmentList(getTimeStamp).then(function (dataUpdate) {
                let newDataObject = [];
                if (dataUpdate.tappointment.length === 0) {
                  sideBarService.getAllAppointmentList().then(function (data) {
                    addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                      window.open('/appointmenttimelist', '_self');
                    }).catch(function (err) {
                      window.open('/appointmenttimelist', '_self');
                    });
                  }).catch(function (err) {
                    window.open('/appointmenttimelist', '_self');
                  });
                } else {
                  let dataOld = JSON.parse(dataObject[0].data);
                  let oldObjectData = dataOld.tappointment;

                  let dataNew = dataUpdate;
                  let newObjectData = dataNew.tappointment;
                  let index = '';
                  let index2 = '';

                  var resultArray = []

                  oldObjectData.forEach(function (destObj) {
                    var addedcheck = false;
                    newObjectData.some(function (origObj) {
                      if (origObj.fields.ID == destObj.fields.ID) {
                        addedcheck = true;
                        index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
                        destObj = origObj;
                        resultArray.push(destObj);

                      }
                    });
                    if (!addedcheck) {
                      resultArray.push(destObj)
                    }

                  });
                  newObjectData.forEach(function (origObj) {
                    var addedcheck = false;
                    oldObjectData.some(function (destObj) {
                      if (origObj.fields.ID == destObj.fields.ID) {
                        addedcheck = true;
                        index = oldObjectData.map(function (e) { return e.fields.ID; }).indexOf(parseInt(origObj.fields.ID));
                        destObj = origObj;
                        resultArray.push(destObj);

                      }
                    });
                    if (!addedcheck) {
                      resultArray.push(origObj)
                    }

                  });
                  var resultGetData = [];
                  $.each(resultArray, function (i, e) {
                    var matchingItems = $.grep(resultGetData, function (item) {
                      return item.fields.ID === e.fields.ID;
                    });
                    if (matchingItems.length === 0) {
                      resultGetData.push(e);
                    }
                  });

                  let dataToAdd = {
                    tappointment: resultGetData
                  };
                  addVS1Data('TAppointment', JSON.stringify(dataToAdd)).then(function (datareturn) {
                    window.open('/appointmenttimelist', '_self');
                  }).catch(function (err) {
                    window.open('/appointmenttimelist', '_self');
                  });
                }

              }).catch(function (err) {
                addVS1Data('TAppointment', dataObject[0].data).then(function (datareturn) {
                  window.open('/appointmenttimelist', '_self');
                }).catch(function (err) {
                  window.open('/appointmenttimelist', '_self');
                });
              });
            }

          }
        }
      }
    }).catch(function (err) {
      sideBarService.getAllAppointmentList().then(function (data) {
        addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
          window.open('/appointmenttimelist', '_self');
        }).catch(function (err) {
          window.open('/appointmenttimelist', '_self');
        });
      }).catch(function (err) {
        window.open('/appointmenttimelist', '_self');
      });
    });

  },
  'click .chkDatatable': function (event) {
    var columns = $('#tblappointmenttimelist th');
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
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblappointmenttimelist' });
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
  'submit #frmAppointment': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let appointmentService = new AppointmentService();
    var frmAppointment = $('#frmAppointment')[0];
    event.preventDefault();
    var formData = new FormData(frmAppointment);
    let aStartDate = '';
    let aEndDate = '';
    let clientname = formData.get('customer') || '';
    let clientmobile = formData.get('mobile') || '0';
    let contact = formData.get('phone') || '0';
    let startTime = formData.get('startTime') || '';
    let endTime = formData.get('endTime') || '';
    let aStartTime = formData.get('tActualStartTime') || '';
    let aEndTime = formData.get('endTime') || '';
    let state = formData.get('state') || '';
    let country = formData.get('country') || '';
    let street = formData.get('address') || '';
    let zip = formData.get('zip') || '';
    let suburb = formData.get('suburb') || '';
    var startDateTime = new Date(formData.get('dtSODate'));
    let startDate = startDateTime.getFullYear() + "-" + ("0" + (startDateTime.getMonth() + 1)).slice(-2) + "-" + ("0" + startDateTime.getDate()).slice(-2);

    var endDateTime = new Date(formData.get('dtSODate2'));
    let endDate = endDateTime.getFullYear() + "-" + ("0" + (endDateTime.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateTime.getDate()).slice(-2);

    let employeeName = formData.get('employee_name').trim() || '';
    let id = formData.get('updateID') || '0';
    let notes = formData.get('txtNotes') || ' ';
    let selectedProduct = formData.get('product-list') || '';
    let status = "Not Converted";
    if (aStartTime != '') {
      aStartDate = moment().format("YYYY/MM/DD") + ''
    }

    if (aEndTime != '') {
      aEndDate = moment().format("YYYY/MM/DD") + ' ' + aEndTime;
    }

    if (aStartTime != '') {
      aStartDate = moment().format("YYYY/MM/DD") + ' ' + aStartTime;
    }
    let objectData = "";
    if (id == '0') {
      objectData = {
        type: "TAppointment",
        fields: {
          ClientName: clientname,
          Mobile: clientmobile,
          Phone: contact,
          StartTime: startDate + ' ' + startTime,
          EndTime: endDate + ' ' + endTime,
          Street: street,
          Suburb: suburb,
          State: state,
          Postcode: zip,
          Country: country,
          // Actual_StartTime : aStartDate,
          // Actual_EndTime : aEndDate,
          TrainerName: employeeName,
          Notes: notes,
          ProductDesc: selectedProduct,
          Status: status
        }
      };
    } else {
      objectData = {
        type: "TAppointment",
        fields: {
          Id: parseInt(id),
          ClientName: clientname,
          Mobile: clientmobile,
          Phone: contact,
          StartTime: startDate + ' ' + startTime,
          EndTime: endDate + ' ' + endTime,
          Street: street,
          Suburb: suburb,
          State: state,
          Postcode: zip,
          Country: country,
          // Actual_StartTime : aStartDate,
          // Actual_EndTime : aEndDate,
          TrainerName: employeeName,
          Notes: notes,
          ProductDesc: selectedProduct,
          Status: status
        }
      };
    }
    appointmentService.saveAppointment(objectData).then(function (data) {
      //Router.go('/appointmentlist');
      window.open('/appointmentlist', '_self');
    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
    });


  },
  'click #btnDelete': function (event) {
    let appointmentService = new AppointmentService();
    let id = document.getElementById('updateID').value || '0';
    swal({
      title: 'Delete Appointment',
      text: "Are you sure you want to delete Appointment?",
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.fullScreenSpin').css('display', 'inline-block');
        if (id == '0' || id == null) {
          swal({
            title: 'Cant delete appointment, it does not exist',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          });
        } else {
          objectData = {
            type: "TAppointment",
            fields: {
              Id: parseInt(id),
              Active: false
            }
          }

          appointmentService.saveAppointment(objectData).then(function (data) {
            $('.fullScreenSpin').css('display', 'none');
            $('#event-modal').modal('hide');
            sideBarService.getAllAppointmentList().then(function (data) {
              addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                window.open('/appointmentlist', '_self');
              }).catch(function (err) {
                window.open('/appointmentlist', '_self');
              });
            }).catch(function (err) {
              window.open('/appointmentlist', '_self');
            });

          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
          });
        }
      } else if (result.dismiss === 'cancel') {
        window.open('/appointmentlist', "_self");
      } else {

      }
    });

  },
  'change #startTime': function () {
    const templateObject = Template.instance();
    let date1 = document.getElementById("dtSODate").value;
    let date2 = document.getElementById("dtSODate2").value;
    date1 = templateObject.dateFormat(date1);
    date2 = templateObject.dateFormat(date2);
    var endTime = new Date(date2 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (date2 != "" && endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
      console.log("Enter end time above start time to calculate total hours");
    }
  },
  'change #endTime': function () {
    const templateObject = Template.instance();
    let date1 = document.getElementById("dtSODate").value;
    let date2 = document.getElementById("dtSODate2").value;
    date1 = templateObject.dateFormat(date1);
    date2 = templateObject.dateFormat(date2);
    var endTime = new Date(date2 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
      console.log("End time must be greater than start time");
    }
  },
  'change #tActualStartTime': function () {
    const templateObject = Template.instance();
    let date1 = document.getElementById("dtSODate").value;
    let date2 = document.getElementById("dtSODate2").value;
    date1 = templateObject.dateFormat(date1);
    date2 = templateObject.dateFormat(date2);
    var endTime = new Date(date2 + ' ' + document.getElementById("tActualEndTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("tActualStartTime").value + ':00');
    if (date2 != "" && endTime > startTime) {
      document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
      console.log("Enter end time above actual start time to calculate total hours");
    }
  },
  'change #tActualEndTime': function () {
    const templateObject = Template.instance();
    let date1 = document.getElementById("dtSODate").value;
    let date2 = document.getElementById("dtSODate2").value;
    date1 = templateObject.dateFormat(date1);
    date2 = templateObject.dateFormat(date2);
    var endTime = new Date(date2 + ' ' + document.getElementById("tActualEndTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("tActualStartTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
      console.log("End time must be greater than start time");
    }
  },
  'click .saveTable': function (event) {
    let lineItems = [];
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

    var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblappointmenttimelist' });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID, username: clientUsername, useremail: clientEmail,
              PrefGroup: 'salesform', PrefName: 'tblappointmenttimelist', published: true,
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
            PrefGroup: 'salesform', PrefName: 'tblappointmenttimelist', published: true,
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

  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();
    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    var datable = $('#tblappointmenttimelist').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblappointmenttimelist th');
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
    var columns = $('#tblappointmenttimelist th');
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
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblappointmenttimelist_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');

  },
  'click .printConfirm': function (event) {

    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblappointmenttimelist_wrapper .dt-buttons .btntabletopdf').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click #check-all': function (event) {
    if ($(event.target).is(':checked')) {
      $(".chkBox").prop("checked", true);
    } else {
      $(".chkBox").prop("checked", false);
    }
  },
  'click .chkBox': function () {
    var listData = $(this).closest('tr').attr('id');
    var selectedClient = $(this.target).closest("tr").find(".colAccountName").text();
    const templateObject = Template.instance();
    const selectedAppointmentList = [];
    const selectedAppointmentCheck = [];
    let JsonIn = {};
    let JsonIn1 = {};
    let myStringJSON = '';
    $('.chkBox:checkbox:checked').each(function () {
      var chkIdLine = $(this).closest('tr').attr('id');
      //var customername = $(this).closest('#colAccountName').text();
      //console.log(customername);
      JsonIn = {
        Params: {
          AppointID: parseInt(chkIdLine)
        }
      };

      myStringJSON = '"JsonIn"' + ':' + JSON.stringify(JsonIn);


      // JsonIn1 = {
      //   AppointID:chkIdLine,
      //   clientname : $('#colAccountName'+chkIdLine).text()
      // };

      //   if (selectedAppointmentCheck.length > 0) {
      //    var checkClient = selectedAppointmentCheck.filter(slctdApt => {
      //      return slctdApt.clientname == $('#colAccountName' + chkIdLine).text();
      //    });

      //    console.log(selectedAppointmentCheck);

      //    if (checkClient.length > 0) {
      //     selectedAppointmentList.push(JsonIn);
      //     selectedAppointmentCheck.push(JsonIn1)
      //    } else {
      //      swal('WARNING','You have selected multiple Customers,  a seperate invoice will be created for each', 'error');
      //      $(this).prop("checked", false);
      //    }
      //  } else {
      selectedAppointmentList.push(JsonIn);

      templateObject.selectedAppointmentID.set(chkIdLine);
      // selectedAppointmentCheck.push(JsonIn1);
      // }
    });
    templateObject.selectedAppointment.set(myStringJSON);
  },
  'click #btnInvoice': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    const templateObject = Template.instance();
    let selectClient = templateObject.selectedAppointment.get();
    let selectAppointmentID = templateObject.selectedAppointmentID.get();
    if (selectClient.length === 0) {
      swal('Please select Appointment to generate invoice for!', '', 'info');
    } else {
      let appointmentService = new AppointmentService();
      var erpGet = erpDb();
      var oPost = new XMLHttpRequest();
      oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"', true);
      oPost.setRequestHeader("database", erpGet.ERPDatabase);
      oPost.setRequestHeader("username", erpGet.ERPUsername);
      oPost.setRequestHeader("password", erpGet.ERPPassword);
      oPost.setRequestHeader("Accept", "application/json");
      oPost.setRequestHeader("Accept", "application/html");
      oPost.setRequestHeader("Content-type", "application/json");
      // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
      oPost.send(selectClient);

      oPost.onreadystatechange = function () {
        if (oPost.readyState == 4 && oPost.status == 200) {
          $('.fullScreenSpin').css('display', 'none');
          var myArrResponse = JSON.parse(oPost.responseText);
          if (myArrResponse.ProcessLog.ResponseStatus == "OK") {
            //window.open('/appointmentlist', '_self');
            // let objectDataConverted = {
            //    type: "TAppointment",
            //    fields: {
            //      Id: parseInt(selectAppointmentID),
            //      Status: "Converted"
            //    }
            //  };
            //  appointmentService.saveAppointment(objectDataConverted).then(function (data) {
            //    window.open('/appointmentlist', '_self');
            //  }).catch(function (err) {
            //    $('.fullScreenSpin').css('display', 'none');
            //  });

          } else {
            swal({
              title: 'Oooops...',
              text: myArrResponse.ProcessLog.ResponseStatus,
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
            }).then((result) => {
              if (result.value) {

              } else if (result.dismiss === 'cancel') {

              }
            });
          }

        } else if (oPost.readyState == 4 && oPost.status == 403) {
          $('.fullScreenSpin').css('display', 'none');
          swal({
            title: 'Something went wrong',
            text: oPost.getResponseHeader('errormessage'),
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          }).then((result) => {
            if (result.value) {
            } else if (result.dismiss === 'cancel') {

            }
          });
        } else if (oPost.readyState == 4 && oPost.status == 406) {
          $('.fullScreenSpin').css('display', 'none');
          var ErrorResponse = oPost.getResponseHeader('errormessage');
          var segError = ErrorResponse.split(':');

          if ((segError[1]) == ' "Unable to lock object') {

            swal({
              title: 'Something went wrong',
              text: oPost.getResponseHeader('errormessage'),
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
            }).then((result) => {
              if (result.value) {
              } else if (result.dismiss === 'cancel') {

              }
            });
          } else {
            swal({
              title: 'Something went wrong',
              text: oPost.getResponseHeader('errormessage'),
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
            }).then((result) => {
              if (result.value) {
              } else if (result.dismiss === 'cancel') {

              }
            });
          }

        } else if (oPost.readyState == '') {
          $('.fullScreenSpin').css('display', 'none');
          swal({
            title: 'Something went wrong',
            text: oPost.getResponseHeader('errormessage'),
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          }).then((result) => {
            if (result.value) {
            } else if (result.dismiss === 'cancel') {

            }
          });
        }

      }

    }

  }

});
Template.appointmenttimelist.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.appointmentdate == 'NA') {
        return 1;
      }
      else if (b.appointmentdate == 'NA') {
        return -1;
      }
      return (a.appointmentdate > b.appointmentdate) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  clientrecords: () => {
    return Template.instance().clientrecords.get();
  },
  productsrecord: () => {
    return Template.instance().productsrecord.get().sort(function (a, b) {
      if (a.productname == 'NA') {
        return 1;
      }
      else if (b.productname == 'NA') {
        return -1;
      }
      return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
    });
  },
  purchasesCloudPreferenceRec: () => {
    return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblappointmenttimelist' });
  }

});
