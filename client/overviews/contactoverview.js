import {ContactService} from '../contacts/contact-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import {SalesBoardService} from '../js/sales-service';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.contactoverview.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.topTenData = new ReactiveVar([]);
  templateObject.loggeduserdata = new ReactiveVar([]);

});

Template.contactoverview.onRendered(function() {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let accountService = new AccountService();
  let contactService = new ContactService();
  const customerList = [];
  let salesOrderTable;
  const dataTableList = [];
  const tableHeaderList = [];
  const loggedUserList = [];
  var splashArray = new Array();

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

  templateObject.getLoggedUserData = function () {
    getVS1Data('TAppUser').then(function (dataObject) {
    if(dataObject.length == 0){
      contactService.getCurrentLoggedUser().then(function (data) {

        let dataListloggedUser = {};
        let vs1EmployeeImage = Session.get('vs1EmployeeImages');

        let encoded = '';
        for(let i=0; i<data.tappuser.length; i++){
            dataListloggedUser = {
            id: data.tappuser[i].EmployeeID || '',
            employeename: data.tappuser[i].UserName || '',
            ladtloging: data.tappuser[i].LastTime|| '',
            // employeepicture: encoded|| ''
            };
            loggedUserList.push(dataListloggedUser);
        }
          templateObject.loggeduserdata.set(loggedUserList);
      });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tappuser;
      let dataListloggedUser = {};
      let vs1EmployeeImage = Session.get('vs1EmployeeImages');

      let encoded = '';
      for(let i=0; i<useData.length; i++){
          dataListloggedUser = {
          id: useData[i].EmployeeID || '',
          employeename: useData[i].UserName || '',
          ladtloging: useData[i].LastTime|| '',
          // employeepicture: encoded|| ''
          };
          loggedUserList.push(dataListloggedUser);
      }
        templateObject.loggeduserdata.set(loggedUserList);

    }
    }).catch(function (err) {
      contactService.getCurrentLoggedUser().then(function (data) {

        let dataListloggedUser = {};
        let vs1EmployeeImage = Session.get('vs1EmployeeImages');

        let encoded = '';
        for(let i=0; i<data.tappuser.length; i++){
            dataListloggedUser = {
            id: data.tappuser[i].EmployeeID || '',
            employeename: data.tappuser[i].UserName || '',
            ladtloging: data.tappuser[i].LastTime|| '',
            // employeepicture: encoded|| ''
            };
            loggedUserList.push(dataListloggedUser);
        }
          templateObject.loggeduserdata.set(loggedUserList);
      });
    });

  };
  templateObject.getLoggedUserData();
  //this.topTenData = new ReactiveVar([]);
  getInvSales(function (data) {

      topTenData1 = _.take(data, 10);
      let totalBalance = 0;
      let itemName = [];
      let itemBalance = [];
      topTenData1.map(function (item) {
          item.totalbalance = +parseFloat(item.totalbalance).toFixed(2);
          if(item.totalbalance >0){
          itemName.push(item.name);
          itemBalance.push(item.totalbalance);
          }
          // itemName.push(item.name);
          // itemBalance.push(item.totalbalance);
      });
      let otherData = _.difference(data, topTenData1, _.isEqual);

      let totalPayment  = 0;
      let overDuePayment = 0;

      topData.topTenData.set(data);

      templateObject.topTenData.set(topTenData1);
      var ctx = document.getElementById("myChartCustomer").getContext("2d");
      var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
        labels: itemName,
        datasets: [{
        label: 'Amount #'+ this.name,
        data: itemBalance,

        backgroundColor: [
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e'
        ],
        borderColor: [
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)'
        ],
        borderWidth: 1
        }]
        },
        options: {
          'onClick' : function (evt, item) {
            if(item[0]['_model'].label){
              var activePoints = item[0]['_model'].label;
              Router.go('/salesreport?contact=' + activePoints);
            }

          },
        "maintainAspectRatio":false,
        tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(tooltipItem.xLabel)|| 0.00;
                // Currency + Number(tooltipItem.xLabel).toFixed(2).replace(/./g, function(c, i, a) {
                //     return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                // });
            }
        }
    },
        "legend":{
        "display":false
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
        "beginAtZero":true,
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
        "beginAtZero":true,
        "padding":20
        }
        }
        ]
        }
        }
        });
  });

  function getInvSales(callback) {

      return new Promise((res, rej) => {
          var salesBoardService = new SalesBoardService();
          getVS1Data('TInvoiceEx').then(function (dataObject) {
          if(dataObject.length == 0){
            salesBoardService.getInvSaleByCustomer().then((data) => {
                // templateObject.getAllData(data);
                let filterData =  _.filter(data.tinvoiceex, function (data) {
                    return (!data.deleted)
                });
                let filterDueDateData = _.filter(filterData, function (data) {
                    return data.CustomerName
                });

                let groupData = _.omit(_.groupBy(filterDueDateData, 'CustomerName'), ['']);
                let totalAmountCalculation = _.map(groupData, function (value, key) {
                    let totalPayment  = 0;
                    let overDuePayment = 0;
                    for(let i=0; i<value.length;i++) {
                            totalPayment += value[i].TotalAmountInc;
                    }
                    let userObject = {};
                    userObject.name = key;
                    userObject.totalbalance =  totalPayment;
                    return userObject;

                });

                let sortedArray = [];
                sortedArray = totalAmountCalculation.sort(function (a, b) {
                    return b.totalbalance - a.totalbalance;
                });
                if (callback) {
                    callback(sortedArray);
                }


            });
          }else{
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tinvoiceex;
            let invoiceItemObj = {};
            let invoiceItems = [];
              for(let j in useData){
                invoiceItemObj = {
                  deleted:useData[j].fields.Deleted || false,
                  CustomerName:useData[j].fields.CustomerName || '',
                  TotalAmountInc:useData[j].fields.TotalAmountInc || 0
                }
                // totaldeptquantity += data.tproductvs1class[j].InStockQty;
                invoiceItems.push(invoiceItemObj);
              }
            let filterData =  _.filter(invoiceItems, function (data) {
                return (!data.deleted)
            });
            let filterDueDateData = _.filter(filterData, function (data) {
                return data.CustomerName
            });

            let groupData = _.omit(_.groupBy(filterDueDateData, 'CustomerName'), ['']);
            let totalAmountCalculation = _.map(groupData, function (value, key) {
                let totalPayment  = 0;
                let overDuePayment = 0;
                for(let i=0; i<value.length;i++) {
                        totalPayment += value[i].TotalAmountInc;
                }
                let userObject = {};
                userObject.name = key;
                userObject.totalbalance =  totalPayment;
                return userObject;

            });

            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function (a, b) {
                return b.totalbalance - a.totalbalance;
            });
            if (callback) {
                callback(sortedArray);
            }

          }
          }).catch(function (err) {
            salesBoardService.getInvSaleByCustomer().then((data) => {
                // templateObject.getAllData(data);
                let filterData =  _.filter(data.tinvoiceex, function (data) {
                    return (!data.deleted)
                });
                let filterDueDateData = _.filter(filterData, function (data) {
                    return data.CustomerName
                });

                let groupData = _.omit(_.groupBy(filterDueDateData, 'CustomerName'), ['']);
                let totalAmountCalculation = _.map(groupData, function (value, key) {
                    let totalPayment  = 0;
                    let overDuePayment = 0;
                    for(let i=0; i<value.length;i++) {
                            totalPayment += value[i].TotalAmountInc;
                    }
                    let userObject = {};
                    userObject.name = key;
                    userObject.totalbalance =  totalPayment;
                    return userObject;

                });

                let sortedArray = [];
                sortedArray = totalAmountCalculation.sort(function (a, b) {
                    return b.totalbalance - a.totalbalance;
                });
                if (callback) {
                    callback(sortedArray);
                }


            });
          });


      });

  }

  getSupplierPurchases(function (data) {
      topTenSuppData1 = _.take(data, 10);
      let totalBalance = 0;
      let itemName = [];
      let itemBalance = [];
      topTenSuppData1.map(function (item) {
          item.totalbalance = +parseFloat(item.totalbalance).toFixed(2);
          if(item.totalbalance >0){
          itemName.push(item.name);
          itemBalance.push(item.totalbalance);
          }
      });
      let otherData = _.difference(data, topTenSuppData1, _.isEqual);

      let totalPayment  = 0;
      let overDuePayment = 0;

      // topData.topTenData.set(data);

      // templateObject.topTenData.set(topTenSuppData1);
      var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
        labels: itemName,
        datasets: [{
        label: 'Earnings',
        data: itemBalance,
        backgroundColor: [
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e'
        ],
        borderColor: [
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)'
        ],
        borderWidth: 1
        }]
        },
        options: {
          'onClick' : function (evt, item) {
            if(item[0]['_model'].label){
              var activePoints = item[0]['_model'].label;
              Router.go('/purchasesreport?contact=' + activePoints);
            }

          },
        "maintainAspectRatio":false,
        tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(tooltipItem.xLabel)|| 0.00;
            }
        }
    },
        "legend":{
        "display":false
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
        "beginAtZero":true,
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
        "beginAtZero":true,
        "padding":20
        }
        }
        ]
        }
        }
        });
  });
  function getSupplierPurchases(callback) {

      return new Promise((res, rej) => {
          var salesBoardService = new SalesBoardService();
          getVS1Data('TPurchaseOrderEx').then(function (dataObject) {
          if(dataObject.length == 0){
            salesBoardService.getPurchaseBySupplier().then((data) => {
                // templateObject.getAllData(data);
                let filterData =  _.filter(data.tpurchaseorderex, function (data) {
                    return (!data.deleted)
                });
                let filterDueDateData = _.filter(filterData, function (data) {
                    return data.ClientName
                });

                let groupData = _.omit(_.groupBy(filterDueDateData, 'ClientName'), ['']);
                let totalAmountCalculation = _.map(groupData, function (value, key) {
                    let totalPayment  = 0;
                    let overDuePayment = 0;
                    for(let i=0; i<value.length;i++) {
                            totalPayment += value[i].TotalAmountInc;
                    }
                    let userObject = {};
                    userObject.name = key;
                    userObject.totalbalance =  totalPayment;
                    return userObject;

                });

                let sortedArray = [];
                sortedArray = totalAmountCalculation.sort(function (a, b) {
                    return b.totalbalance - a.totalbalance;
                });
                if (callback) {
                    callback(sortedArray);
                }


            });
          }else{
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tpurchaseorderex;
            let arrayDataUse = [];
            //arrayDataUse.push(useData[i].fields);
            for(let i=0; i<useData.length; i++){
                 arrayDataUse.push(useData[i].fields);

            }
            let filterData =  _.filter(arrayDataUse, function (data) {
                return (!data.Deleted)
            });
            let filterDueDateData = _.filter(filterData, function (data) {
                return data.ClientName
            });

            let groupData = _.omit(_.groupBy(filterDueDateData, 'ClientName'), ['']);
            let totalAmountCalculation = _.map(groupData, function (value, key) {
                let totalPayment  = 0;
                let overDuePayment = 0;
                for(let i=0; i<value.length;i++) {
                        totalPayment += value[i].TotalAmountInc;
                }
                let userObject = {};
                userObject.name = key;
                userObject.totalbalance =  totalPayment;
                return userObject;

            });

            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function (a, b) {
                return b.totalbalance - a.totalbalance;
            });
            if (callback) {
                callback(sortedArray);
            }

          }
          }).catch(function (err) {
            salesBoardService.getPurchaseBySupplier().then((data) => {
                // templateObject.getAllData(data);
                let filterData =  _.filter(data.tpurchaseorderex, function (data) {
                    return (!data.deleted)
                });
                let filterDueDateData = _.filter(filterData, function (data) {
                    return data.ClientName
                });

                let groupData = _.omit(_.groupBy(filterDueDateData, 'ClientName'), ['']);
                let totalAmountCalculation = _.map(groupData, function (value, key) {
                    let totalPayment  = 0;
                    let overDuePayment = 0;
                    for(let i=0; i<value.length;i++) {
                            totalPayment += value[i].TotalAmountInc;
                    }
                    let userObject = {};
                    userObject.name = key;
                    userObject.totalbalance =  totalPayment;
                    return userObject;

                });

                let sortedArray = [];
                sortedArray = totalAmountCalculation.sort(function (a, b) {
                    return b.totalbalance - a.totalbalance;
                });
                if (callback) {
                    callback(sortedArray);
                }


            });
          });



      });

  }

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcontactoverview', function(error, result){
  if(error){

  }else{
    if(result){
      for (let i = 0; i < result.customFields.length; i++) {
        let customcolumn = result.customFields;
        let columData = customcolumn[i].label;
        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
        let hiddenColumn = customcolumn[i].hidden;
        let columnClass = columHeaderUpdate.split('.')[1];
        let columnWidth = customcolumn[i].width;

         $("th."+columnClass+"").html(columData);
          $("th."+columnClass+"").css('width',""+columnWidth+"px");

      }
    }

  }
  });

  function MakeNegative() {
    $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
     });
  };

  templateObject.getAllContactData = function () {
    getVS1Data('TERPCombinedContactsVS1').then(function (dataObject) {
    if(dataObject.length == 0){
      contactService.getAllContactCombineVS1().then(function (data) {
        $('.fullScreenSpin').css('display','none');
        let lineItems = [];
        let lineItemObj = {};
        let clienttype = '';

        let isprospect = false;
        let iscustomer = false;
        let isEmployee = false;
        let issupplier = false;
        for(let i=0; i<data.terpcombinedcontactsvs1.length; i++){
          isprospect = data.terpcombinedcontactsvs1[i].isprospect;
          iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
          isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
          issupplier = data.terpcombinedcontactsvs1[i].issupplier;

          if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
            clienttype = "Customer / Employee / Prospect / Supplier";
          }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
            clienttype = "Customer / Prospect / Supplier";
          }else if((iscustomer ==true) && (issupplier ==true)){
            clienttype = "Customer / Supplier";
          }else if((iscustomer ==true)){

            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
              clienttype = "Job";
            }else{
              clienttype = "Customer";
            }
            // clienttype = "Customer";
          }else if((isEmployee ==true)){
            clienttype = "Employee";
          }else if((issupplier ==true)){
            clienttype = "Supplier";
          }else if((isprospect ==true)){
            clienttype = "Prospect";
          }else{
            clienttype = " ";
          }
          // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
          //   clienttype = "Customer";
          // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
          //   clienttype = "Supplier";
          // };

          let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
          let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
          let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
          let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
          let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
          if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
             arBalance = Currency + "0.00";
          }

          if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
             creditBalance = Currency + "0.00";
          }
          if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
             balance = Currency + "0.00";
          }
          if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
             creditLimit = Currency + "0.00";
          }

          if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
             salesOrderBalance = Currency + "0.00";
          }

          // alert(salesOrderBalance);
              var dataList = {
                id: data.terpcombinedcontactsvs1[i].ID || '',
                employeeno: data.terpcombinedcontactsvs1[i].printname || '',
                clientname:data.terpcombinedcontactsvs1[i].name || '',
                phone: data.terpcombinedcontactsvs1[i].phone || '',
                mobile: data.terpcombinedcontactsvs1[i].mobile || '',
                arbalance: arBalance || 0.00,
                creditbalance: creditBalance || 0.00,
                balance: balance || 0.00,
                creditlimit: creditLimit || 0.00,
                salesorderbalance: salesOrderBalance || 0.00,
                email: data.terpcombinedcontactsvs1[i].email || '',
                address: data.terpcombinedcontactsvs1[i].street || '',
                // country: data.terpcombinedcontactsvs1[i].Country || '',
                // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                type: clienttype || '',
                custFld1: data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                custFld2: data.terpcombinedcontactsvs1[i].CUSTFLD2 || ''
           };

           if(data.terpcombinedcontactsvs1[i].name.replace(/\s/g, '') !== ""){
             dataTableList.push(dataList);
           }

            //}
        }
        templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcontactoverview', function(error, result){
          if(error){

          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split('.')[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if(hiddenColumn == true){

                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
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

            $('#tblcontactoverview').DataTable({

                  select: true,
                  destroy: true,
                  colReorder: true,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "contactoverview_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Contact Overview',
                      filename: "contactoverview_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: 25,
                  lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                  info: true,
                  responsive: true,
                  // "order": [[ 0, "asc" ]],
                  action: function () {
                      $('#tblcontactoverview').DataTable().ajax.reload();
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

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
              $('.fullScreenSpin').css('display','none');
          }, 0);


          var columns = $('#tblcontactoverview th');
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function(i,v) {
            if(v.hidden == false){
              columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
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

         $('#tblcontactoverview tbody').on( 'click', 'tr', function () {
         var listData = $(this).closest('tr').attr('id');
         var transactiontype = $(event.target).closest("tr").find(".colType").text();
           if((listData) && (transactiontype)){
             if(transactiontype === 'Customer / Employee / Prospect / Supplier' ){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer / Prospect / Supplier'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer / Supplier'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer'){
               Router.go('/customerscard?id=' + listData);
             }
             else if(transactiontype === 'Supplier'){
               Router.go('/supplierscard?id=' + listData);
             }else if(transactiontype === 'Employee'){
               Router.go('/employeescard?id=' + listData);
             }else if(transactiontype === 'Prospect'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Job'){
               Router.go('/customerscard?jobid=' + listData);
             }

           }
         //if(listData){
           // Router.go('/employeescard?id=' + listData);
         //}
       });

      }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display','none');
          // Meteor._reload.reload();
      });
    }else{
      let data = JSON.parse(dataObject[0].data);
      let useData = data.terpcombinedcontactsvs1;
      $('.fullScreenSpin').css('display','none');
      let lineItems = [];
      let lineItemObj = {};
      let clienttype = '';

      let isprospect = false;
      let iscustomer = false;
      let isEmployee = false;
      let issupplier = false;
      for(let i=0; i<useData.length; i++){
        isprospect = useData[i].isprospect;
        iscustomer = useData[i].iscustomer;
        isEmployee = useData[i].isEmployee;
        issupplier = useData[i].issupplier;

        if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
          clienttype = "Customer / Employee / Prospect / Supplier";
        }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
          clienttype = "Customer / Prospect / Supplier";
        }else if((iscustomer ==true) && (issupplier ==true)){
          clienttype = "Customer / Supplier";
        }else if((iscustomer ==true)){

          if (useData[i].name.toLowerCase().indexOf("^") >= 0){
            clienttype = "Job";
          }else{
            clienttype = "Customer";
          }
          // clienttype = "Customer";
        }else if((isEmployee ==true)){
          clienttype = "Employee";
        }else if((issupplier ==true)){
          clienttype = "Supplier";
        }else if((isprospect ==true)){
          clienttype = "Prospect";
        }else{
          clienttype = " ";
        }
        // if(useData[i].IsCustomer == true){
        //   clienttype = "Customer";
        // }else if(useData[i].IsSupplier == true){
        //   clienttype = "Supplier";
        // };

        let arBalance = utilityService.modifynegativeCurrencyFormat(useData[i].ARBalance)|| 0.00;
        let creditBalance = utilityService.modifynegativeCurrencyFormat(useData[i].CreditBalance) || 0.00;
        let balance = utilityService.modifynegativeCurrencyFormat(useData[i].Balance)|| 0.00;
        let creditLimit = utilityService.modifynegativeCurrencyFormat(useData[i].CreditLimit)|| 0.00;
        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(useData[i].SalesOrderBalance)|| 0.00;
        if (isNaN(useData[i].ARBalance)) {
           arBalance = Currency + "0.00";
        }

        if (isNaN(useData[i].CreditBalance)) {
           creditBalance = Currency + "0.00";
        }
        if (isNaN(useData[i].Balance)) {
           balance = Currency + "0.00";
        }
        if (isNaN(useData[i].CreditLimit)) {
           creditLimit = Currency + "0.00";
        }

        if (isNaN(useData[i].SalesOrderBalance)) {
           salesOrderBalance = Currency + "0.00";
        }

        // alert(salesOrderBalance);
            var dataList = {
              id: useData[i].ID || '',
              employeeno: useData[i].printname || '',
              clientname:useData[i].name || '',
              phone: useData[i].phone || '',
              mobile: useData[i].mobile || '',
              arbalance: arBalance || 0.00,
              creditbalance: creditBalance || 0.00,
              balance: balance || 0.00,
              creditlimit: creditLimit || 0.00,
              salesorderbalance: salesOrderBalance || 0.00,
              email: useData[i].email || '',
              address: useData[i].street || '',
              // country: useData[i].Country || '',
              // department: useData[i].DefaultClassName || '',
              type: clienttype || '',
              custFld1: useData[i].CUSTFLD1 || '',
              custFld2: useData[i].CUSTFLD2 || ''
         };

         if(useData[i].name.replace(/\s/g, '') !== ""){
           dataTableList.push(dataList);
         }

          //}
      }
      templateObject.datatablerecords.set(dataTableList);

      if(templateObject.datatablerecords.get()){

        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcontactoverview', function(error, result){
        if(error){

        }else{
          if(result){
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.split('.')[1];
              let columnWidth = customcolumn[i].width;
              let columnindex = customcolumn[i].index + 1;

              if(hiddenColumn == true){

                $("."+columnClass+"").addClass('hiddenColumn');
                $("."+columnClass+"").removeClass('showColumn');
              }else if(hiddenColumn == false){
                $("."+columnClass+"").removeClass('hiddenColumn');
                $("."+columnClass+"").addClass('showColumn');
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

          $('#tblcontactoverview').DataTable({

                select: true,
                destroy: true,
                colReorder: true,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                      {
                   extend: 'excelHtml5',
                   text: '',
                   download: 'open',
                   className: "btntabletocsv hiddenColumn",
                   filename: "contactoverview_"+ moment().format(),
                   orientation:'portrait',
                    exportOptions: {
                    columns: ':visible'
                  }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Contact Overview',
                    filename: "contactoverview_"+ moment().format(),
                    exportOptions: {
                    columns: ':visible'
                  }
                }],
                // bStateSave: true,
                // rowId: 0,
                pageLength: 25,
                lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                info: true,
                responsive: true,
                // "order": [[ 0, "asc" ]],
                action: function () {
                    $('#tblcontactoverview').DataTable().ajax.reload();
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

            }).on( 'length.dt', function ( e, settings, len ) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            });
            $('.fullScreenSpin').css('display','none');
        }, 0);


        var columns = $('#tblcontactoverview th');
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
          if(v.hidden == false){
            columVisible =  true;
          }
          if((v.className.includes("hiddenColumn"))){
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

       $('#tblcontactoverview tbody').on( 'click', 'tr', function () {
       var listData = $(this).closest('tr').attr('id');
       var transactiontype = $(event.target).closest("tr").find(".colType").text();
         if((listData) && (transactiontype)){
           if(transactiontype === 'Customer / Employee / Prospect / Supplier' ){
             Router.go('/customerscard?id=' + listData);
           }else if(transactiontype === 'Customer / Prospect / Supplier'){
             Router.go('/customerscard?id=' + listData);
           }else if(transactiontype === 'Customer / Supplier'){
             Router.go('/customerscard?id=' + listData);
           }else if(transactiontype === 'Customer'){
             Router.go('/customerscard?id=' + listData);
           }
           else if(transactiontype === 'Supplier'){
             Router.go('/supplierscard?id=' + listData);
           }else if(transactiontype === 'Employee'){
             Router.go('/employeescard?id=' + listData);
           }else if(transactiontype === 'Prospect'){
             Router.go('/customerscard?id=' + listData);
           }else if(transactiontype === 'Job'){
             Router.go('/customerscard?jobid=' + listData);
           }

         }
       //if(listData){
         // Router.go('/employeescard?id=' + listData);
       //}
     });

    }
    }).catch(function (err) {
      contactService.getAllContactCombineVS1().then(function (data) {

        $('.fullScreenSpin').css('display','none');
        let lineItems = [];
        let lineItemObj = {};
        let clienttype = '';

        let isprospect = false;
        let iscustomer = false;
        let isEmployee = false;
        let issupplier = false;
        for(let i=0; i<data.terpcombinedcontactsvs1.length; i++){
          isprospect = data.terpcombinedcontactsvs1[i].isprospect;
          iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
          isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
          issupplier = data.terpcombinedcontactsvs1[i].issupplier;

          if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
            clienttype = "Customer / Employee / Prospect / Supplier";
          }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
            clienttype = "Customer / Prospect / Supplier";
          }else if((iscustomer ==true) && (issupplier ==true)){
            clienttype = "Customer / Supplier";
          }else if((iscustomer ==true)){

            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
              clienttype = "Job";
            }else{
              clienttype = "Customer";
            }
            // clienttype = "Customer";
          }else if((isEmployee ==true)){
            clienttype = "Employee";
          }else if((issupplier ==true)){
            clienttype = "Supplier";
          }else if((isprospect ==true)){
            clienttype = "Prospect";
          }else{
            clienttype = " ";
          }
          // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
          //   clienttype = "Customer";
          // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
          //   clienttype = "Supplier";
          // };

          let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
          let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
          let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
          let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
          let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
          if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
             arBalance = Currency + "0.00";
          }

          if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
             creditBalance = Currency + "0.00";
          }
          if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
             balance = Currency + "0.00";
          }
          if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
             creditLimit = Currency + "0.00";
          }

          if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
             salesOrderBalance = Currency + "0.00";
          }

          // alert(salesOrderBalance);
              var dataList = {
                id: data.terpcombinedcontactsvs1[i].ID || '',
                employeeno: data.terpcombinedcontactsvs1[i].printname || '',
                clientname:data.terpcombinedcontactsvs1[i].name || '',
                phone: data.terpcombinedcontactsvs1[i].phone || '',
                mobile: data.terpcombinedcontactsvs1[i].mobile || '',
                arbalance: arBalance || 0.00,
                creditbalance: creditBalance || 0.00,
                balance: balance || 0.00,
                creditlimit: creditLimit || 0.00,
                salesorderbalance: salesOrderBalance || 0.00,
                email: data.terpcombinedcontactsvs1[i].email || '',
                address: data.terpcombinedcontactsvs1[i].street || '',
                // country: data.terpcombinedcontactsvs1[i].Country || '',
                // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                type: clienttype || '',
                custFld1: data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                custFld2: data.terpcombinedcontactsvs1[i].CUSTFLD2 || ''
           };

           if(data.terpcombinedcontactsvs1[i].name.replace(/\s/g, '') !== ""){
             dataTableList.push(dataList);
           }

            //}
        }
        templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblcontactoverview', function(error, result){
          if(error){

          }else{
            if(result){
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split('.')[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if(hiddenColumn == true){

                  $("."+columnClass+"").addClass('hiddenColumn');
                  $("."+columnClass+"").removeClass('showColumn');
                }else if(hiddenColumn == false){
                  $("."+columnClass+"").removeClass('hiddenColumn');
                  $("."+columnClass+"").addClass('showColumn');
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

            $('#tblcontactoverview').DataTable({

                  select: true,
                  destroy: true,
                  colReorder: true,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "contactoverview_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Contact Overview',
                      filename: "contactoverview_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: 25,
                  lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                  info: true,
                  responsive: true,
                  // "order": [[ 0, "asc" ]],
                  action: function () {
                      $('#tblcontactoverview').DataTable().ajax.reload();
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

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
              $('.fullScreenSpin').css('display','none');
          }, 0);


          var columns = $('#tblcontactoverview th');
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function(i,v) {
            if(v.hidden == false){
              columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
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

         $('#tblcontactoverview tbody').on( 'click', 'tr', function () {
         var listData = $(this).closest('tr').attr('id');
         var transactiontype = $(event.target).closest("tr").find(".colType").text();
           if((listData) && (transactiontype)){
             if(transactiontype === 'Customer / Employee / Prospect / Supplier' ){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer / Prospect / Supplier'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer / Supplier'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Customer'){
               Router.go('/customerscard?id=' + listData);
             }
             else if(transactiontype === 'Supplier'){
               Router.go('/supplierscard?id=' + listData);
             }else if(transactiontype === 'Employee'){
               Router.go('/employeescard?id=' + listData);
             }else if(transactiontype === 'Prospect'){
               Router.go('/customerscard?id=' + listData);
             }else if(transactiontype === 'Job'){
               Router.go('/customerscard?jobid=' + listData);
             }

           }
         //if(listData){
           // Router.go('/employeescard?id=' + listData);
         //}
       });

      }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display','none');
          // Meteor._reload.reload();
      });
    });

  }

  templateObject.getAllContactData();

});

Template.contactoverview.events({
   'click .btnRefresh': function () {
     $('.fullScreenSpin').css('display','inline-block');
     let templateObject = Template.instance();
     batchUpdateCall();
     sideBarService.getAllContactCombineVS1().then(function(data) {
       addVS1Data('TERPCombinedContactsVS1',JSON.stringify(data)).then(function (datareturn) {
       }).catch(function (err) {

       });
     }).catch(function(err) {

     });
   },
  'click #newSalesOrder' : function(event){
   Router.go('/salesordercard');
  },
  'click .salesOrderList' : function(event){
  Router.go('/salesorderslist');
  },
  'click #newInvoice' : function(event){
   Router.go('/invoicecard');
  },
  'click .invoiceList' : function(event){
  Router.go('/invoicelist');
  },
  'click #newQuote' : function(event){
  Router.go('/quotecard');
  },
  'click .QuoteList' : function(event){
  Router.go('/quoteslist');
  },
  'click .chkDatatable' : function(event){
    var columns = $('#tblcontactoverview th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function(i,v) {
      let className = v.classList;
      let replaceClass = className[1];

    if(v.innerText == columnDataValue){
    if($(event.target).is(':checked')){
      $("."+replaceClass+"").css('display','table-cell');
      $("."+replaceClass+"").css('padding','.75rem');
      $("."+replaceClass+"").css('vertical-align','top');
    }else{
      $("."+replaceClass+"").css('display','none');
    }
    }
    });
  },
  'click .resetTable' : function(event){
    var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    if(getcurrentCloudDetails){
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblcontactoverview'});
        if (checkPrefDetails) {
          CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
          if (err) {

          }else{
            Meteor._reload.reload();
          }
          });

        }
      }
    }
  },
  'click .saveTable' : function(event){
    let lineItems = [];
    //let datatable =$('#tblcontactoverview').DataTable();
    $('.columnSettings').each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text()||'';
      var colWidth = $tblrow.find(".custom-range").val()||0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
      var colHidden = false;
      if($tblrow.find(".custom-control-input").is(':checked')){
        colHidden = false;
      }else{
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

    var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
    if(getcurrentCloudDetails){
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblcontactoverview'});
        if (checkPrefDetails) {
          CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
            PrefGroup:'salesform',PrefName:'tblcontactoverview',published:true,
            customFields:lineItems,
            updatedAt: new Date() }}, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');
            }
          });

        }else{
          CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
            PrefGroup:'salesform',PrefName:'tblcontactoverview',published:true,
            customFields:lineItems,
            createdAt: new Date() }, function(err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');

            }
          });
           // console.log(checkPrefDetails);
        }
      }
    }

    //Meteor._reload.reload();
  },
  'blur .divcolumn' : function(event){
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //alert(columnDataValue);
    var datable = $('#tblcontactoverview').DataTable();
    var title = datable.column( columnDatanIndex ).header();
    $(title).html(columData);

  },
  'change .rngRange' : function(event){
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblcontactoverview th');
    $.each(datable, function(i,v) {
      console.log(datable);
    if(v.innerText == columnDataValue){
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
      $("."+replaceClass+"").css('width',range+'px');

    }
    });

  },
  'click .btnOpenSettings' : function(event){
    let templateObject = Template.instance();
    var columns = $('#tblcontactoverview th');
    // console.log(columns);
    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function(i,v) {
      if(v.hidden == false){
        columVisible =  true;
      }
      if((v.className.includes("hiddenColumn"))){
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
      $('.fullScreenSpin').css('display','inline-block');
      jQuery('#tblcontactoverview_wrapper .dt-buttons .btntabletocsv').click();
       $('.fullScreenSpin').css('display','none');

    },
'click .printConfirm' : function(event){

$('.fullScreenSpin').css('display','inline-block');
jQuery('#tblcontactoverview_wrapper .dt-buttons .btntabletopdf').click();
$('.fullScreenSpin').css('display','none');
}
  });

  Template.contactoverview.helpers({
    datatablerecords : () => {
       return Template.instance().datatablerecords.get().sort(function(a, b){
         if (a.clientname == 'NA') {
       return 1;
           }
       else if (b.clientname == 'NA') {
         return -1;
       }
     return (a.clientname.toUpperCase() > b.clientname.toUpperCase()) ? 1 : -1;
     });
    },
    tableheaderrecords: () => {
       return Template.instance().tableheaderrecords.get();
    },
    purchasesCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblcontactoverview'});
  },
  topTenData: () => {
        return Template.instance().topTenData.get();
  },
  Currency: () => {
        return Currency;
  },
  loggeduserdata: () => {
     return Template.instance().loggeduserdata.get().sort(function(a, b){
       if (a.employeename == 'NA') {
     return 1;
         }
     else if (b.employeename == 'NA') {
       return -1;
     }
   return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
   });
  },
  loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
 }
  });
