import {ProductService} from "../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import 'jquery-editable-select';
import Chart from 'chart.js';
import XLSX from 'xlsx';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.inventorylist.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.deptrecords = new ReactiveVar();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.datatablebackuprecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);


  templateObject.taxraterecords = new ReactiveVar([]);
  templateObject.deptrecords = new ReactiveVar();
  templateObject.recentTrasactions = new ReactiveVar([]);

  templateObject.coggsaccountrecords = new ReactiveVar();
  templateObject.salesaccountrecords = new ReactiveVar();

  templateObject.productdeptrecords = new ReactiveVar();
  templateObject.proddeptIDrecords = new ReactiveVar();
  templateObject.selectedFile = new ReactiveVar();
});

Template.inventorylist.onRendered(function() {
  $('.fullScreenSpin').css('display','inline-block');

  if(FlowRouter.current().queryParams.success){
    $('.btnRefresh').addClass('btnRefreshAlert');
  }

  let templateObject = Template.instance();
  let productService = new ProductService();
  const deptrecords = [];
  const dataTableList = [];
  const tableHeaderList = [];

  const taxCodesList =[];

  const coggsaccountrecords = [];
  const salesaccountrecords = [];
  let deptprodlineItems = [];
  var tableInventory = "";
//   $(document).ready(function() {
//   $('#edtassetaccount').editableSelect();
//   $('#sltcogsaccount').editableSelect();
// });

  let productTable;
  var splashArray = new Array();
  var splashArrayProd = new Array();
  var splashArrayProdDept = new Array();
  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInventory', function(error, result){
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

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'productview', function(error, resultPref){
  if(error){

  }else{
    if(resultPref){
      $("th.colProdCustField1").html(resultPref.customFields[0].label);
      $("th.colProdCustField2").html(resultPref.customFields[1].label);

    }

  }
  });

  templateObject.getAllProductClassDeptData = function () {
    productService.getProductClassQtyData().then(function (data) {

      let deptprodlineItemObj = {};

        for(let j in data.tproductclassquantity){
          deptprodlineItemObj = {
            department:data.tproductclassquantity[j].DepartmentName || '',
            productid:data.tproductclassquantity[j].ProductID || 0,
            productqty:data.tproductclassquantity[j].InStockQty || 0
          }
          // totaldeptquantity += data.tproductvs1class[j].InStockQty;
          //splashArrayProdDept.push(deptprodlineItemObj);
        }

        let groupData = _.omit(_.groupBy(deptprodlineItems, 'productid'), ['']);

        templateObject.productdeptrecords.set(groupData);
        let totalAmountCalculation = _.map(groupData, function (value, key) {


            let totalPayment  = 0;
            let departmentname = '';
            for(let i=0; i<value.length;i++) {
                totalPayment += value[i].productqty;
                departmentname = value[i].department
            }
            let userObject = {};
            userObject.productid = key;
            userObject.department = departmentname;
            userObject.productqty =  totalPayment;
            return userObject;

        });

        // $('#edttotalqtyinstock').val(totaldeptquantity);



        // templateObject.totaldeptquantity.set(totaldeptquantity);
        //templateObject.getAllProductData('All');
    }).catch(function (err) {
      swal({
      title: 'Oooops...',
      text: err,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Try Again'
      }).then((result) => {
      if (result.value) {
       Meteor._reload.reload();
      } else if (result.dismiss === 'cancel') {

      }
      });
        $('.fullScreenSpin').css('display','none');
    });

  }


  templateObject.getAllProductData = function (deptname) {
    var dataRes = getVS1Data('TProductVS1').then(function (dataObject) {
      if(dataObject.length == 0){
        sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
          addVS1Data('TProductVS1',JSON.stringify(data));
          // addVS1Data('TProductVS1',JSON.stringify(data));
        //localStorage.setItem('VS1ProductList', JSON.stringify(data)||'');
          let lineItems = [];
          let lineItemObj = {};
          let departmentData = '';
          let departmentDataLoad = '';
          let prodQtyData = 0;
          let prodQtyDataLoad = 0;
          let deptStatus = '';
          //let getDepartmentData = templateObject.productdeptrecords.get();
          var dataList = {};
          //if((deptname == 'undefined') || (deptname == 'All')){
           departmentData = 'All';
            for(let i=0; i<data.tproductvs1.length; i++){
              dataList = {
               id: data.tproductvs1[i].fields.ID || '',
               productname: data.tproductvs1[i].fields.ProductName || '',
               salesdescription: data.tproductvs1[i].fields.SalesDescription || '',
               department: departmentData || '',
               //deptstatus: deptStatus || '',
               //departmentcheck: departmentDataLoad || '',
               costprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100) || 0,
               saleprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100) || 0,
               quantity: data.tproductvs1[i].fields.TotalQtyInStock || 0,
               //quantitycheck: JSON.stringify(favoriteProdQty) || 0,
               purchasedescription: data.tproductvs1[i].fields.PurchaseDescription || '',
               productgroup1: data.tproductvs1[i].fields.ProductGroup1 || '',
               productgroup2: data.tproductvs1[i].fields.ProductGroup2 || '',
               customfield1: data.tproductvs1[i].fields.CUSTFLD1 || '',
               customfield2: data.tproductvs1[i].fields.CUSTFLD2 || '',
               prodbarcode: data.tproductvs1[i].fields.BARCODE || '',
             };
             dataTableList.push(dataList);
            }

          templateObject.datatablerecords.set(dataTableList);
          templateObject.datatablebackuprecords.set(dataTableList);
          function MakeNegative() {
            $('td').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
          };
          // Session.set('VS1ProductList', splashArrayProd);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInventory', function(error, result){
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

          $('.fullScreenSpin').css('display','none');
          setTimeout(function () {
              tableInventory = $('#tblInventory').DataTable({
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
                       filename: "inventory_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Inventory List',
                        filename: "inventory_"+ moment().format(),
                        exportOptions: {
                        columns: ':visible'
                      }
                    }],
                    // bStateSave: true,
                    // rowId: 0,
                    paging: false,
                    "scrollY": "800px",
                    "scrollCollapse": true,
                    info: false,
                    responsive: true,
                    "order": [[ 0, "asc" ]],
                    action: function () {
                        $('#tblInventory').DataTable().ajax.reload();
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
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

                }).on('column-reorder', function () {

                }).on( 'length.dt', function ( e, settings, len ) {
                  setTimeout(function () {

                    MakeNegative();
                  }, 100);
                });

                $('.fullScreenSpin').css('display','none');
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
            }, 0);


        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
      }else{

      let data = JSON.parse(dataObject[0].data);
      let useData = data.tproductvs1;
      let lineItems = [];
let lineItemObj = {};
let departmentData = '';
let departmentDataLoad = '';
let prodQtyData = 0;
let prodQtyDataLoad = 0;
let deptStatus = '';
//let getDepartmentData = templateObject.productdeptrecords.get();
var dataList = {};
//if((deptname == 'undefined') || (deptname == 'All')){
 departmentData = 'All';
  for(let i=0; i<useData.length; i++){
    dataList = {
     id: useData[i].fields.ID || useData[i].fields.Id,
     productname: useData[i].fields.ProductName || '',
     salesdescription: useData[i].fields.SalesDescription || '',
     department: departmentData || '',
     //deptstatus: deptStatus || '',
     //departmentcheck: departmentDataLoad || '',
     costprice: utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.BuyQty1Cost * 100) / 100) || 0,
     saleprice: utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.SellQty1Price * 100) / 100) || 0,
     quantity: useData[i].fields.TotalQtyInStock || 0,
     //quantitycheck: JSON.stringify(favoriteProdQty) || 0,
     purchasedescription: useData[i].fields.PurchaseDescription || '',
     productgroup1: useData[i].fields.ProductGroup1 || '',
     productgroup2: useData[i].fields.ProductGroup2 || '',
     customfield1: useData[i].fields.CUSTFLD1 || '',
     customfield2: useData[i].fields.CUSTFLD2 || '',
     prodbarcode: useData[i].fields.BARCODE || '',
   };
   dataTableList.push(dataList);
  }

templateObject.datatablerecords.set(dataTableList);
templateObject.datatablebackuprecords.set(dataTableList);
function MakeNegative() {
  $('td').each(function(){
    if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
   });
};
// Session.set('VS1ProductList', splashArrayProd);

if(templateObject.datatablerecords.get()){

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInventory', function(error, result){
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

$('.fullScreenSpin').css('display','none');
setTimeout(function () {
     $('#tblInventory').DataTable({
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
             filename: "inventory_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }
          },{
              extend: 'print',
              download: 'open',
              className: "btntabletopdf hiddenColumn",
              text: '',
              title: 'Inventory List',
              filename: "inventory_"+ moment().format(),
              exportOptions: {
              columns: ':visible'
            }
          }],
          // bStateSave: true,
          // rowId: 0,
          paging: false,
          "scrollY": "800px",
          "scrollCollapse": true,
          info: false,
          responsive: true,
          "order": [[ 0, "asc" ]],
          action: function () {
              $('#tblInventory').DataTable().ajax.reload();
              let draftRecord = templateObject.datatablerecords.get();
              templateObject.datatablerecords.set(draftRecord);
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

      }).on('column-reorder', function () {

      }).on('length.dt', function ( e, settings, len ) {
        setTimeout(function () {

          MakeNegative();
        }, 100);
      }).on('search.dt', function () {
        let draftRecord = templateObject.datatablerecords.get();

        let newDataArray = [];
        let searchTerm = $(event.target).val();
        if(searchTerm != ''){

        }else{
          templateObject.datatablerecords.set(draftRecord);
          //$('.tblInventory tbody tr').show();
        }

        // if(searchTerm == ""){

        //   templateObject.datatablerecords.set(draftRecord);
        //   tableInventory.search(searchTerm).draw();
        // }else{
        //   $.grep(draftRecord, function(elem) {
        //
        //     //return elem.toLowerCase().indexOf(searchTerm) > -1;
        //   });
        // }


        // $.each(draftRecord, function(i, v) {

        // if (v.index(eventData) !== -1) {

        // }
        //   // useData[i].fields.ID
        //   //   if (v[i].fields.name.search(new RegExp(/peter/i)) != -1) {
        //   //       alert(v.age);
        //   //       return;
        //   //   }
        // });

      });

      $('.fullScreenSpin').css('display','none');
      $('div.dataTables_filter input').addClass('form-control form-control-sm');
  }, 0);

      }
    }).catch(function (err) {

      sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
      addVS1Data('TProductVS1',JSON.stringify(data));
        let lineItems = [];
        let lineItemObj = {};
        let departmentData = '';
        let departmentDataLoad = '';
        let prodQtyData = 0;
        let prodQtyDataLoad = 0;
        let deptStatus = '';
        //let getDepartmentData = templateObject.productdeptrecords.get();
        var dataList = {};
        //if((deptname == 'undefined') || (deptname == 'All')){
         departmentData = 'All';
          for(let i=0; i<data.tproductvs1.length; i++){
            dataList = {
             id: data.tproductvs1[i].fields.ID || '',
             productname: data.tproductvs1[i].fields.ProductName || '',
             salesdescription: data.tproductvs1[i].fields.SalesDescription || '',
             department: departmentData || '',
             //deptstatus: deptStatus || '',
             //departmentcheck: departmentDataLoad || '',
             costprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100) || 0,
             saleprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100) || 0,
             quantity: data.tproductvs1[i].fields.TotalQtyInStock || 0,
             //quantitycheck: JSON.stringify(favoriteProdQty) || 0,
             purchasedescription: data.tproductvs1[i].fields.PurchaseDescription || '',
             productgroup1: data.tproductvs1[i].fields.ProductGroup1 || '',
             productgroup2: data.tproductvs1[i].fields.ProductGroup2 || '',
             customfield1: data.tproductvs1[i].fields.CUSTFLD1 || '',
             customfield2: data.tproductvs1[i].fields.CUSTFLD2 || '',
             prodbarcode: data.tproductvs1[i].fields.BARCODE || '',
           };
           dataTableList.push(dataList);
          }

        templateObject.datatablerecords.set(dataTableList);
        templateObject.datatablebackuprecords.set(dataTableList);
        function MakeNegative() {
          $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
           });
        };
        // Session.set('VS1ProductList', splashArrayProd);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInventory', function(error, result){
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

        $('.fullScreenSpin').css('display','none');
        setTimeout(function () {
          tableInventory = $('#tblInventory').DataTable({
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
                     filename: "inventory_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Inventory List',
                      filename: "inventory_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  // bStateSave: true,
                  // rowId: 0,
                  paging: false,
                  "scrollY": "800px",
                  "scrollCollapse": true,
                  info: false,
                  responsive: true,
                  "order": [[ 0, "asc" ]],
                  action: function () {
                      $('#tblInventory').DataTable().ajax.reload();
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
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

              }).on('column-reorder', function () {

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {

                  MakeNegative();
                }, 100);
              });

              $('.fullScreenSpin').css('display','none');
              $('div.dataTables_filter input').addClass('form-control form-control-sm');
          }, 0);


      }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display','none');
          // Meteor._reload.reload();
      });
    });

  }

  $('#tblInventory tbody').on( 'click', 'tr', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      //FlowRouter.go('/productview?id=' + listData);
      FlowRouter.go('/productview?id=' + listData);
    }
  });

  templateObject.getDepartments = function(){
    getVS1Data('TDeptClass').then(function (dataObject) {
      if(dataObject.length == 0){
        productService.getDepartment().then(function(data){
          //let deptArr = [];
          for(let i in data.tdeptclass){

            let deptrecordObj = {
              id: data.tdeptclass[i].Id || ' ',
              department: data.tdeptclass[i].DeptClassName || ' ',
            };
            //deptArr.push(data.tdeptclass[i].DeptClassName);
            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

          }
      });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;
        for(let i in useData){

          let deptrecordObj = {
            id: useData[i].Id || ' ',
            department: useData[i].DeptClassName || ' ',
          };
          //deptArr.push(data.tdeptclass[i].DeptClassName);
          deptrecords.push(deptrecordObj);
          templateObject.deptrecords.set(deptrecords);

        }

      }
      }).catch(function (err) {
        productService.getDepartment().then(function(data){
          //let deptArr = [];
          for(let i in data.tdeptclass){

            let deptrecordObj = {
              id: data.tdeptclass[i].Id || ' ',
              department: data.tdeptclass[i].DeptClassName || ' ',
            };
            //deptArr.push(data.tdeptclass[i].DeptClassName);
            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

          }
      });
      });


  }
  // templateObject.getAllProductData();
  templateObject.getDepartments();
  templateObject.getAllProductData("All");
  //templateObject.getAllProductClassDeptData();



  templateObject.getProductClassDeptData = function (deptname) {
    productService.getProductClassDataByDeptName(deptname).then(function (data) {
      // $('.fullScreenSpin').css('display','none');
      let deptprodlineItems = [];
      let deptprodlineItemObj = {};


    for(let j in data.tproductvs1class){
          deptprodlineItemObj = {
            department:data.tproductvs1class[j].DeptName || '',
            productid:data.tproductvs1class[j].ProductID || 0,
          }
          // totaldeptquantity += data.tproductvs1class[j].InStockQty;
          deptprodlineItems.push(deptprodlineItemObj);
          splashArrayProdDept.push(deptprodlineItemObj);
        }
        // $('#edttotalqtyinstock').val(totaldeptquantity);
        // templateObject.productdeptrecords.set(deptprodlineItems);

        // templateObject.totaldeptquantity.set(totaldeptquantity);

    }).catch(function (err) {
      swal({
      title: 'Oooops...',
      text: err,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Try Again'
      }).then((result) => {
      if (result.value) {
       Meteor._reload.reload();
      } else if (result.dismiss === 'cancel') {

      }
      });
        $('.fullScreenSpin').css('display','none');
    });

  }
  /*
  if ((Session.get('VS1ProductList') === '') || (!Session.get('VS1ProductList'))) {
   templateObject.getAllProductData();
  }else{

    templateObject.datatablerecords.set(Session.get('VS1ProductList'));
    if(templateObject.datatablerecords.get()){

      Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInventory', function(error, result){
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
    }

    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
        $('#tblInventory').DataTable({
              select: true,
              destroy: true,
              colReorder: true,
              // bStateSave: true,
              rowId: 0,
              pageLength: 25,
              lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
              info: true,
              responsive: true,
              "order": [[ 0, "asc" ]] ,
              action: function () {
                  $('#tblInventory').DataTable().ajax.reload();
              },

          }).on('page', function () {

              let draftRecord = templateObject.datatablerecords.get();
              templateObject.datatablerecords.set(draftRecord);
          }).on('column-reorder', function () {

          });

          $('.fullScreenSpin').css('display','none');
          $('div.dataTables_filter input').addClass('form-control form-control-sm');
      }, 0);
  }
*/

  templateObject.getAccountNames = function(){
    productService.getAccountName().then(function(data){
        // let productData = templateObject.records.get();
      for(let i in data.taccount){

        let accountnamerecordObj = {
          accountname: data.taccount[i].AccountName || ' '
        };

        if((data.taccount[i].AccountTypeName == "COGS")){
            coggsaccountrecords.push(accountnamerecordObj);
          templateObject.coggsaccountrecords.set(coggsaccountrecords);
        }
        if((data.taccount[i].AccountTypeName == "INC")){
          salesaccountrecords.push(accountnamerecordObj);
          templateObject.salesaccountrecords.set(salesaccountrecords);
        }
      }
  });

  }

  templateObject.getAllTaxCodes = function () {
      productService.getTaxCodes().then(function (data) {

          for(let i=0; i<data.ttaxcodevs1.length; i++){

            let taxcoderecordObj = {
              codename: data.ttaxcodevs1[i].CodeName || ' ',
              coderate: data.ttaxcodevs1[i].Rate || ' ',
            };

            taxCodesList.push(taxcoderecordObj);

          }
          templateObject.taxraterecords.set(taxCodesList);

      })
  };
// templateObject.getAccountNames();
// templateObject.getAllTaxCodes();
  exportInventoryToPdf = function(){

  productService.getProductPrintList().then(function (data) {
      let records = [];
      let inventoryData = [];
      for (let i = 0; i < data.tproductvs1.length; i++) {
          var recentTranObject = {
                      productId: data.tproductvs1[i].fields.Id,
                      productName: data.tproductvs1[i].fields.ProductName,
                      productDescription: data.tproductvs1[i].fields.SalesDescription,
                      purchasesPrice:  utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1CostInc) || 0,
                      purchaseAccount: data.tproductvs1[i].fields.AssetAccount,
                      costOfGoodsSoldAccount: data.tproductvs1[i].fields.CogsAccount,
                      unitOfMeasure: data.tproductvs1[i].fields.UOMPurchases || ' ',
                      salesDescription: data.tproductvs1[i].fields.SalesDescription,
                      itemName: data.tproductvs1[i].fields.ProductName,
                      salesPrice:utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1PriceInc) || 0,
                      salesAccount: data.tproductvs1[i].fields.IncomeAccount,
                      taxCodeSales: data.tproductvs1[i].fields.TaxCodeSales,
                  };
                  inventoryData.push(recentTranObject);


          $('.fullScreenSpin').css('display','none');
      }

      if(inventoryData){
    let doc = new jsPDF('landscape','mm','a3');
    // let listId= tempObj2.productListID.get();
    let inventoryDataList= inventoryData;
    const totalPagesExp = "{total_pages_count_string}";
    let xAxis=15;
    let yAxis=70;
    let tableTitle=['Item Code',
        'Item Name',
        'Purchases\n'+'Description',
        'Purchases\n'+'Price',
        'Purchases\n'+'Account',
        'Cost of\n'+'Goods Sold\n'+'Account',
        'Inventory\n'+'Asset\n'+'Account',
        'Unit of\n'+'measure',
        'Sales\n' +'Description',
        'Sales Price',
        'Sales\n'+'Account',
        'Tax\n'+'Code(S)'
    ];
    doc.setFontSize(18);
    doc.setTextColor(0, 123, 169);
    // doc.setFontStyle('Roboto Mono');
    doc.text(loggedCompany, 180, 40);
    doc.text("As at " + moment().format('DD MMM YYYY'),183, 50);
    let totalPage= inventoryDataList.length;
    let pageData=0;
    let printData=8;

          if(totalPage%5!=0){
            totalPage=(totalPage/5)+1;
            totalPage= totalPage.toString().split(".")[0];
        }
        else{
            totalPage=totalPage/5;
        }

         for(let k=1;k<=totalPage;k++) {
             //HEADER
            doc.setFontSize(22);
            doc.setTextColor(30);
            // doc.setFontStyle('Roboto Mono');
            doc.text("Inventory", 16, 20);
            doc.setDrawColor(0, 123, 169);
            doc.setLineWidth(1);
            doc.line(15, 25, 408, 25);
            //TABLE HEAD
            doc.setFontSize(12);
            doc.setFontStyle('bold');
            doc.setTextColor(0, 0, 0);
             for(let m=0;m<12;m++){
                 doc.text(tableTitle[m], xAxis,yAxis);
                 xAxis+=32;
             }
             doc.setDrawColor(179, 179, 179);
             doc.setLineWidth(0.1);
             doc.line(12, yAxis+13, 390, yAxis+13);
             xAxis=18;
             yAxis+=20;
             doc.setFontStyle('normal');
             for (let i= pageData; i< printData; i++) {
                 let changeY = yAxis;
                 let itemY=yAxis;
                 const itmNme = inventoryDataList[i].itemName.split(" ");
                 for (let j = 0; j < itmNme.length; j++) {
                     doc.text('' + itmNme[j], xAxis, itemY);
                     doc.text('' + itmNme[j], xAxis+32, itemY);
                     itemY += 5;
                 }
                const prodescription = inventoryDataList[i].productDescription.split(" ");
                for (let j = 0; j < prodescription.length; j++) {
                    doc.text('' + prodescription[j], xAxis + 64, changeY);
                    changeY += 5;
                }
                doc.text('' +inventoryDataList[i].purchasesPrice, xAxis + 96, yAxis);
                doc.text('' +inventoryDataList[i].purchaseAccount, xAxis + 128, yAxis);
                doc.text('' + inventoryDataList[i].costOfGoodsSoldAccount, xAxis + 160, yAxis);
                doc.text('' + inventoryDataList[i].purchaseAccount, xAxis + 192, yAxis);
                doc.text('' + inventoryDataList[i].unitOfMeasure, xAxis + 224, yAxis);
                changeY = yAxis;
                const saledescription = inventoryDataList[i].salesDescription.split(" ");
                for (let j = 0; j < saledescription.length; j++) {
                    doc.text('' + saledescription[j], xAxis + 256, changeY);
                    changeY += 5;
                }
                doc.text('' + inventoryDataList[i].salesPrice, xAxis + 288, yAxis);
                doc.text('' + inventoryDataList[i].purchaseAccount, xAxis + 320, yAxis);
                doc.text('' + inventoryDataList[i].taxCodeSales, xAxis + 352, yAxis);
                if(itmNme>changeY){
                    yAxis = itmNme + 4;
                }
                else{
                    yAxis = changeY + 4;
                }

                yAxis += 5;
            }
             let str = 'Inventory | ' + loggedCompany + ' | ' + moment().format('DD MMM YYYY');

                     let str1 = "Page "+k+" of "+totalPage;
                     doc.setDrawColor(0, 123, 169);
                     doc.setLineWidth(1);
                     doc.line(15, 280, 408, 280);
                     doc.setFontSize(10);
                     doc.text(str,16, 285);
                     doc.text(str1,390, 285);

            if(k<totalPage){
                doc.addPage();
            }
             yAxis=50;
         let difference = inventoryDataList.length-printData;
         pageData = pageData+5;
         if(difference<5){
             printData = printData+difference;
         }
         else{
             printData = printData+5;
         }
        }

        if(inventoryDataList.length!=0) {
            doc.save(loggedCompany + '-inventory.pdf');
        }
      }
     //localStorage.setItem('VS1ProductPrintList', JSON.stringify(inventoryData));

    }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong> - Error Printing Product!', 'danger');
        swal({
        title: 'Error Printing Product!',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
        }).then((result) => {
        if (result.value) {
         // Meteor._reload.reload();
        } else if (result.dismiss === 'cancel') {

        }
        });
        $('.fullScreenSpin').css('display','none');
    });




};

});

Template.inventorylist.helpers({

  deptrecords: () => {
      return Template.instance().deptrecords.get().sort(function(a, b){
        if (a.department == 'NA') {
      return 1;
          }
      else if (b.department == 'NA') {
        return -1;
      }
    return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
    });
  },
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.productname == 'NA') {
     return 1;
         }
     else if (b.productname == 'NA') {
       return -1;
     }
   return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
   });;
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblInventory'});
},
  productsCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'productview'});
  },
  taxraterecords :() => {
     return Template.instance().taxraterecords.get();
  },
  coggsaccountrecords: () => {
      return Template.instance().coggsaccountrecords.get();
  },
  salesaccountrecords: () => {
      return Template.instance().salesaccountrecords.get();
  },
  loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
 }
  });


  Template.inventorylist.events({
        'click .chkDatatable' : function(event){
          var columns = $('#tblInventory th');
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
              var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInventory'});
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

          var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
          if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
              var clientID = getcurrentCloudDetails._id;
              var clientUsername = getcurrentCloudDetails.cloudUsername;
              var clientEmail = getcurrentCloudDetails.cloudEmail;
              var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInventory'});
              if (checkPrefDetails) {
                CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                  PrefGroup:'inventoryform',PrefName:'tblInventory',published:true,
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
                  PrefGroup:'inventoryform',PrefName:'tblInventory',published:true,
                  customFields:lineItems,
                  createdAt: new Date() }, function(err, idTag) {
                  if (err) {
                    $('#myModal2').modal('toggle');
                  } else {
                    $('#myModal2').modal('toggle');

                  }
                });
              };

              let getcustomField1 = $('.colProdCustField1').html();
              let getcustomField2 = $('.colProdCustField2').html();

              var checkPrefDetailsProd = CloudPreference.findOne({userid:clientID,PrefName:'productview'});
              if (checkPrefDetailsProd) {
              CloudPreference.update({ _id: checkPrefDetailsProd._id},{ $set: {username:clientUsername,useremail:clientEmail,
                PrefGroup:'inventoryform',PrefName:'productview',published:true,
                customFields:[{
                    index: '1',
                    label: getcustomField1
                    // hidden: false,
                    },{
                    index: '2',
                    label: getcustomField2
                    // hidden: getchkcustomField2
                }],
                updatedAt: new Date() }}, function(err, idTag) {
                if (err) {

                } else {


                }
              });
            }else{
              CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                PrefGroup:'inventoryform',PrefName:'productview',published:true,
                customFields:[{
                    index: '1',
                    label: getcustomField1,
                    hidden: false
                    },{
                    index: '2',
                    label: getcustomField2,
                    hidden: false
                }],
                createdAt: new Date() }, function(err, idTag) {
                if (err) {

                } else {


                }
              });
            }

            }
          }


        },
        'blur .divcolumn' : function(event){
          let columData = $(event.target).text();

          let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
          var datable = $('#tblInventory').DataTable();
          var title = datable.column( columnDatanIndex ).header();
          $(title).html(columData);

        },
        'change .rngRange' : function(event){
          let range = $(event.target).val();
          $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

          let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
          let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
          var datable = $('#tblInventory th');
          $.each(datable, function(i,v) {

          if(v.innerText == columnDataValue){
              let className = v.className;
              let replaceClass = className.replace(/ /g, ".");
            $("."+replaceClass+"").css('width',range+'px');

          }
          });

        },
        'click .btnOpenSettings' : function(event){
          let templateObject = Template.instance();
          var columns = $('#tblInventory th');

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

      'click .btnRefresh': function () {
        // localStorage.removeItem("VS1ProductList");
        // localStorage.setItem("VS1ProductList", '');
        //   Meteor._reload.reload();
          $('.fullScreenSpin').css('display','inline-block');
          let templateObject = Template.instance();
          var currentBeginDate = new Date();
          var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
          let fromDateMonth = currentBeginDate.getMonth();
          let fromDateDay = currentBeginDate.getDate();
          if(currentBeginDate.getMonth() < 10){
              fromDateMonth = "0" + (currentBeginDate.getMonth()+2);
          }else{
            fromDateMonth = (currentBeginDate.getMonth()+2);
          }

          if(currentBeginDate.getDate() < 10){
              fromDateDay = "0" + currentBeginDate.getDate();
          }
          var fromDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay+1);
          let prevMonth11Date = (moment().subtract(6, 'months')).format("YYYY-MM-DD");
          sideBarService.getProductStocknSaleReportData(prevMonth11Date,fromDate).then(function(data) {
              addVS1Data('TProductStocknSalePeriodReport',JSON.stringify(data));
          }).catch(function(err) {

          });
          
          sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function(data) {
            addVS1Data('TProductVS1',JSON.stringify(data)).then(function (datareturn) {
              window.open('/inventorylist','_self');
            }).catch(function (err) {
              window.open('/inventorylist','_self');
            });
          }).catch(function(err) {
            window.open('/inventorylist','_self');
          });
          // templateObject.getAllProductClassDeptData();
          //templateObject.getAllProductData("All");


      },
      'click #exportinv_pdf': async function () {
      $('.fullScreenSpin').css('display','inline-block');
      exportInventoryToPdf();
      },
      'click #exportinv_csv': async function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblInventory_wrapper .dt-buttons .btntabletocsv').click();
         $('.fullScreenSpin').css('display','none');
      },
      'click #btnSave': async function () {
        let productService = new ProductService();
        let productCode = $("#edtproductvs1code").val();
        let productName = $("#edtproductvs1name").val();
          if(productName == ''){
             // Bert.alert('<strong>Please provide product Name !</strong>', 'danger');
             swal('Please provide product Name !', '', 'info');
             e.preventDefault();
             return false;
          }

      let  TaxCodePurchase = $("#slttaxcodepurchase").val();
      let  TaxCodeSales    = $("#slttaxcodesales").val();
      if(TaxCodePurchase == '' || TaxCodeSales == '' ){
          // Bert.alert('<strong>Please fill Tax rate !</strong>', 'danger');
          swal('Please fill Tax rate !', '', 'warning');
          e.preventDefault();
          return false;
      }


        var objDetails = {
            type:"TProduct",
            fields:
            {
            Active:true,
            ProductType:"INV",
            PRODUCTCODE:productCode,
            ProductPrintName:productName,
            ProductName:productName,
            PurchaseDescription:$("#txapurchasedescription").val(),
            SalesDescription:$("#txasalesdescription").val(),
            // AssetAccount:($("#sltcogsaccount").val()).includes(" - ") ? ($("#sltcogsaccount").val()).split(' - ')[1] : $("#inventoryAssetAccount").val(),
            CogsAccount:$("#edtassetaccount").val(),
            IncomeAccount:$("#sltcogsaccount").val(),
            BuyQty1:1,
            BuyQty1Cost:Number($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
            BuyQty2:1,
            BuyQty2Cost:Number($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
            BuyQty3:1,
            BuyQty3Cost:Number($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0 ,
            SellQty1:1,
            SellQty1Price:Number($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
            SellQty2:1,
            SellQty2Price:Number($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
            SellQty3:1,
            SellQty3Price:Number($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
            TaxCodePurchase:$("#slttaxcodepurchase").val(),
            TaxCodeSales:$("#slttaxcodesales").val(),
            UOMPurchases:defaultUOM,
            UOMSales:defaultUOM,
            TotalQtyInStock:$("#edttotalqtyinstock").val(),
            TotalQtyOnOrder:$("#edttotalqtyonorder").val()
            /*Barcode:$("#NProdBar").val(),*/
          }
            };

          productService.saveProduct(objDetails).then(function (objDetails) {
            FlowRouter.go('/inventorylist');
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              //$('.loginSpinner').css('display','none');
              $('.fullScreenSpin').css('display','none');
          });
      },
      'click .chkDepartment' : function(event){
      $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        //let dataValue = $(event.target).val();
          let productService = new ProductService();
        // var dataList = {};

        const dataTableList = [];
        var dataList = {};
        var favorite = [];
        let favoriteproddeptIDrecords = [];
        let departmetn = '';
         $.each($("input[name='chkDepartment']:checked"), function(){
           favorite.push($(this).val());
          });


        let totalSummary =  0;
        if(favorite.length == 0){
          $('.fullScreenSpin').css('display','none');
        }else{
          if ($('.chkDepartment:checked').length == $('.chkDepartment').length) {
            let getOldData = templateObject.datatablebackuprecords.get();
             templateObject.datatablerecords.set(getOldData);
             $('.fullScreenSpin').css('display','none');
          }else{
          productService.getProductListDeptQtyList(favorite.join(",")).then(function (data) {
            $('.fullScreenSpin').css('display','none');
          for(let i=0; i<data.tproductlocationqty.length; i++){
            dataList = {
             id: data.tproductlocationqty[i].ProductID || '',
             productname: data.tproductlocationqty[i].ProductName || '',
             salesdescription: data.tproductlocationqty[i].ProductName || '',
             department: data.tproductlocationqty[i].Deptname || '',
             //deptstatus: deptStatus || '',
             //departmentcheck: departmentDataLoad || '',
             costprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlocationqty[i].Cost * 100) / 100) || 0,
             saleprice: utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlocationqty[i].Cost * 100) / 100) || 0,
             quantity: data.tproductlocationqty[i].InStock || 0,
             //quantitycheck: JSON.stringify(favoriteProdQty) || 0,
             purchasedescription: data.tproductlocationqty[i].ProductName || '',
             productgroup1: data.tproductlocationqty[i].ProductGroup1 || '',
             productgroup2: data.tproductlocationqty[i].ProductGroup2 || '',
             customfield1: data.tproductlocationqty[i].CUSTFLD1 || '',
             customfield2: data.tproductlocationqty[i].CUSTFLD2 || '',
             prodbarcode: data.tproductlocationqty[i].BARCODE || '',
           };

             dataTableList.push(dataList);


          }

       templateObject.datatablerecords.set(dataTableList);
       // templateObject.datatablerecords.set(dataTableList);


       if(templateObject.datatablerecords.get()){

       }
         }).catch(function (err) {
             $('.fullScreenSpin').css('display','none');
         });
       }
        }

      },
      'click .btnSaveSelect': async function () {
        $('#myModalDepartment').modal('toggle');
        $('.fullScreenSpin').css('display','none');
        $('.modal-backdrop').css('display','none');
      },
      'click .btnNewProduct':function () {
        FlowRouter.go('/productview');
      },
'click .printConfirm' : function(event){

$('.fullScreenSpin').css('display','inline-block');
jQuery('#tblInventory_wrapper .dt-buttons .btntabletopdf').click();
$('.fullScreenSpin').css('display','none');
},
'click .btnStockAdjustment' : function(event){
  FlowRouter.go('/stockadjustmentoverview');
},
'click .templateDownload': function () {
let utilityService = new UtilityService();
let rows =[];
const filename = 'SampleProduct'+'.csv';
rows[0]= ['Product Name','Sales Description','Sale Price', 'Sales Account', 'Tax Code','Barcode', 'Purchase Description', 'COGGS Account', 'Purchase Tax Code', 'Cost', 'Product Type'];
rows[1]= ['TSL - Black','T-Shirt Large Black', '600', 'Sales','NT', '','T-Shirt Large Black', 'Cost of Goods Sold', 'NT', '700', 'NONINV'];
rows[2]= ['TSL - Blue','T-Shirt Large Blue', '600', 'Sales','NT', '','T-Shirt Large Blue', 'Cost of Goods Sold', 'NT', '700', 'INV'];
rows[3]= ['TSL - Yellow','T-Shirt Large Yellow', '600', 'Sales','NT', '','T-Shirt Large Yellow', 'Cost of Goods Sold', 'NT', '700', 'OTHER'];
utilityService.exportToCsv(rows, filename, 'csv');
},
'click .btnUploadFile':function(event){
$('#attachment-upload').val('');
$('.file-name').text('');
//$(".btnImport").removeAttr("disabled");
$('#attachment-upload').trigger('click');

},
'click .templateDownloadXLSX': function (e) {

  e.preventDefault();  //stop the browser from following
  window.location.href = 'sample_imports/SampleProduct.xlsx';
},
'change #attachment-upload': function (e) {
    let templateObj = Template.instance();
    var filename = $('#attachment-upload')[0].files[0]['name'];
    var fileExtension = filename.split('.').pop().toLowerCase();
    var validExtensions = ["csv","txt","xlsx"];
    var validCSVExtensions = ["csv","txt"];
    var validExcelExtensions = ["xlsx","xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
        // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
        swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
        $('.file-name').text('');
        $(".btnImport").Attr("disabled");
    }else if(validCSVExtensions.indexOf(fileExtension) != -1){

      $('.file-name').text(filename);
      let selectedFile = event.target.files[0];

      templateObj.selectedFile.set(selectedFile);
      if($('.file-name').text() != ""){
        $(".btnImport").removeAttr("disabled");
      }else{
        $(".btnImport").Attr("disabled");
      }
    }else if(fileExtension == 'xlsx'){
      $('.file-name').text(filename);
      let selectedFile = event.target.files[0];
      var oFileIn;
    var oFile = selectedFile;
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {type: 'array'});

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if($('.file-name').text() != ""){
              $(".btnImport").removeAttr("disabled");
            }else{
              $(".btnImport").Attr("disabled");
            }

    }



},
'click .btnImport' : function () {
$('.fullScreenSpin').css('display','inline-block');
let templateObject = Template.instance();
let productService = new ProductService();
let objDetails;

Papa.parse(templateObject.selectedFile.get(), {

complete: function(results) {

  if(results.data.length > 0){
if((results.data[0][0] == "Product Name") && (results.data[0][1] == "Sales Description")
&& (results.data[0][2] == "Sale Price") && (results.data[0][3] == "Sales Account")
&& (results.data[0][4] == "Tax Code") && (results.data[0][5] == "Barcode")
&& (results.data[0][6] == "Purchase Description") && (results.data[0][7] == "COGGS Account")
&& (results.data[0][8] == "Purchase Tax Code") && (results.data[0][9] == "Cost")&& (results.data[0][10] == "Product Type")) {

let dataLength = results.data.length * 3000;
setTimeout(function(){
// $('#importModal').modal('toggle');
window.open('/inventorylist?success=true','_self');
$('.fullScreenSpin').css('display','none');
},parseInt(dataLength));

for (let i = 0; i < results.data.length -1; i++) {
objDetails = {
 type: "TProductVS1",
 fields:
     {
       Active:true,
       ProductType:results.data[i+1][10]||"INV",

       ProductPrintName:results.data[i+1][0],
       ProductName:results.data[i+1][0],
       SalesDescription:results.data[i+1][1],
       SellQty1Price:parseFloat(results.data[i+1][2].replace(/[^0-9.-]+/g,"")) || 0,
       IncomeAccount:results.data[i+1][3],
       TaxCodeSales:results.data[i+1][4],
       Barcode:results.data[i+1][5],
       PurchaseDescription:results.data[i+1][6],

       // AssetAccount:results.data[i+1][0],
       CogsAccount:results.data[i+1][7],


       TaxCodePurchase:results.data[i+1][8],

       BuyQty1Cost:parseFloat(results.data[i+1][9].replace(/[^0-9.-]+/g,"")) || 0,

       PublishOnVS1: true
     }
};
if(results.data[i+1][1]){
if(results.data[i+1][1] !== "") {
productService.saveProductVS1(objDetails).then(function (data) {
//$('.fullScreenSpin').css('display','none');
FlowRouter.go('/inventorylist?success=true');
}).catch(function (err) {
//$('.fullScreenSpin').css('display','none');
swal({
title: 'Oooops...',
text: err,
type: 'error',
showCancelButton: false,
confirmButtonText: 'Try Again'
}).then((result) => {
if (result.value) {
  window.open('/inventorylist?success=true','_self');
} else if (result.dismiss === 'cancel') {
  window.open('/inventorylist?success=true','_self');
}
});
});
}
}
}

}else{
  $('.fullScreenSpin').css('display','none');
  // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
  swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
}
}else{
$('.fullScreenSpin').css('display','none');
// Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
}

}
});
},
'keyup #myInputSearch, change #myInputSearch, search #myInputSearch':function(event){
  $('.tblInventory tbody tr').show();
  let searchItem = $(event.target).val();
  if(searchItem != ''){
    var value = searchItem.toLowerCase();
    $('.tblInventory tbody tr').each(function(){
     var found = 'false';
     $(this).each(function(){
          if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
          {
               found = 'true';
          }

          if($(this).text().replace(/[^0-9.-]+/g, "").indexOf(value.toLowerCase()) >= 0)
          {
               found = 'true';
          }


     });
     if(found == 'true')
     {
          $(this).show();
     }
     else
     {
          $(this).hide();
     }
});
  }else{
    $('.tblInventory tbody tr').show();
  }
}

});

    Template.registerHelper('equals', function (a, b) {
        return a === b;
    });
