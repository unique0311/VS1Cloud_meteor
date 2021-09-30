import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import {ProductService} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.productlistpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.InvoiceNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.invoicerecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.InvoiceId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.record = new ReactiveVar({});
    templateObject.accountID = new ReactiveVar();
    templateObject.stripe_fee_method = new ReactiveVar()
    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.includeBOnShippedQty = new ReactiveVar();
    templateObject.includeBOnShippedQty.set(true);
    templateObject.productextrasellrecords = new ReactiveVar([]);

});

Template.productlistpop.onRendered(function () {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];

    tempObj.getAllProducts = function () {
        getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                    addVS1Data('TProductVS1',JSON.stringify(data));
                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductvs1.length; i++) {

                      if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                          for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                              let lineExtaSellObj = {
                                  clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                  productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                                  price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                                  qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                              };
                              lineExtaSellItems.push(lineExtaSellObj);

                          }
                      }
                        var dataList = [

                            data.tproductvs1[i].fields.ProductName || '-',
                            data.tproductvs1[i].fields.SalesDescription || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || '',
                            data.tproductvs1[i].fields.ID || '',
                            JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                        ];


                        splashArrayProductList.push(dataList);
                    }
                    //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                        $('#tblInventory').dataTable({
                            data: splashArrayProductList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                            columnDefs: [
                                {
                                    className: "productName",
                                    "targets": [0]
                                }, {
                                    className: "productDesc",
                                    "targets": [1]
                                }, {
                                    className: "costPrice text-right",
                                    "targets": [2]
                                }, {
                                    className: "salePrice text-right",
                                    "targets": [3]
                                }, {
                                    className: "prdqty text-right",
                                    "targets": [4]
                                }, {
                                    className: "taxrate",
                                    "targets": [5]
                                }, {
                                    className: "colProuctPOPID hiddenColumn",
                                    "targets": [6]
                                }, {
                                    className: "colExtraSellPrice hiddenColumn",
                                    "targets": [7]
                                }
                            ],
                            colReorder: true,
                            lengthMenu: [
                                [25, -1],
                                [25, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnDrawCallback": function (oSettings) {
                                // $('.dataTables_paginate').css('display', 'none');
                            },
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                                $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                            }

                        });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {

                  if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                      for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                          let lineExtaSellObj = {
                              clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                              productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                              price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                              qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                          };
                          lineExtaSellItems.push(lineExtaSellObj);

                      }
                  }
                    var dataList = [

                        data.tproductvs1[i].fields.ProductName || '-',
                        data.tproductvs1[i].fields.SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || '',
                        data.tproductvs1[i].fields.ID || '',
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                    ];


                    splashArrayProductList.push(dataList);
                }

                tempObj.productextrasellrecords.set(lineExtaSellItems);
                //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                        columnDefs: [
                            {
                                className: "productName",
                                "targets": [0]
                            }, {
                                className: "productDesc",
                                "targets": [1]
                            }, {
                                className: "costPrice text-right",
                                "targets": [2]
                            }, {
                                className: "salePrice text-right",
                                "targets": [3]
                            }, {
                                className: "prdqty text-right",
                                "targets": [4]
                            }, {
                                className: "taxrate",
                                "targets": [5]
                            }, {
                                className: "colProuctPOPID hiddenColumn",
                                "targets": [6]
                            }, {
                                className: "colExtraSellPrice hiddenColumn",
                                "targets": [7]
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [[100, -1], [100, "All"]],
                        info: true,
                        responsive: true,
                        "fnDrawCallback": function (oSettings) {
                            // $('.dataTables_paginate').css('display', 'none');
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }


                    }).on('length.dt', function (e, settings, len) {
                      $('.fullScreenSpin').css('display', 'inline-block');
                      let dataLenght = settings._iDisplayLength;
                      splashArrayProductList = [];
                      if (dataLenght == -1) {
                        sideBarService.getNewProductListVS1('All', 1).then(function (data) {
                          let records = [];
                          let inventoryData = [];
                          for (let i = 0; i < data.tproductvs1.length; i++) {
                              var dataList = [

                                  data.tproductvs1[i].fields.ProductName || '-',
                                  data.tproductvs1[i].fields.SalesDescription || '',
                                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                  data.tproductvs1[i].fields.TotalQtyInStock,
                                  data.tproductvs1[i].fields.TaxCodeSales || '',
                                  data.tproductvs1[i].fields.ID || '',
                                  JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                              ];

                              if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                                  for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                                      let lineExtaSellObj = {
                                          clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                          productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                                          price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                                      };
                                      lineExtaSellItems.push(lineExtaSellObj);

                                  }
                              }
                              splashArrayProductList.push(dataList);
                          }

                          var datatable = $('#tblInventory').DataTable();
                          datatable.clear();
                          datatable.rows.add(splashArrayProductList);
                          datatable.draw(false);

                          $('.fullScreenSpin').css('display', 'none');
                          $('.dataTables_info').html('Showing 1 to ' + data.tproductvs1.length + ' of ' + data.tproductvs1.length + ' entries');
                          $('.fullScreenSpin').css('display', 'none');
                        });
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {

                            $('.fullScreenSpin').css('display', 'none');
                        }

                      }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                }
            }
        }).catch(function (err) {
            sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                addVS1Data('TProductVS1',JSON.stringify(data));
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {

                  if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                      for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                          let lineExtaSellObj = {
                              clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                              productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                              price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                              qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                          };
                          lineExtaSellItems.push(lineExtaSellObj);

                      }
                  }
                    var dataList = [

                        data.tproductvs1[i].fields.ProductName || '-',
                        data.tproductvs1[i].fields.SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || '',
                        data.tproductvs1[i].fields.ID || '',
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                    ];


                    splashArrayProductList.push(dataList);
                }
                //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [
                            {
                                className: "productName",
                                "targets": [0]
                            }, {
                                className: "productDesc",
                                "targets": [1]
                            }, {
                                className: "costPrice text-right",
                                "targets": [2]
                            }, {
                                className: "salePrice text-right",
                                "targets": [3]
                            }, {
                                className: "prdqty text-right",
                                "targets": [4]
                            }, {
                                className: "taxrate",
                                "targets": [5]
                            }, {
                                className: "taxrate",
                                "targets": [5]
                            }, {
                                className: "colProuctPOPID hiddenColumn",
                                "targets": [6]
                            }, {
                                className: "colExtraSellPrice hiddenColumn",
                                "targets": [7]
                            }
                        ],
                        colReorder: true,


                        lengthMenu: [
                            [25,-1],
                            [25, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        "fnDrawCallback": function (oSettings) {
                            // $('.dataTables_paginate').css('display', 'none');
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }



                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            })
        });

    };

    tempObj.getAllProducts();

});

Template.productlistpop.events({
  'keyup #tblInventory_filter input': function (event) {
    if (event.keyCode == 13) {
       $(".btnRefreshProduct").trigger("click");
    }
  },
  'click .btnRefreshProduct':function(event){
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
  let productService = new ProductService();
  //let salesService = new SalesBoardService();
  let tableProductList;
  var splashArrayProductList = new Array();
  var splashArrayTaxRateList = new Array();
  const taxCodesList = [];
  const lineExtaSellItems = [];
    $('.fullScreenSpin').css('display', 'inline-block');
    let dataSearchName = $('#tblInventory_filter input').val();
    if(dataSearchName.replace(/\s/g, '') != ''){
    sideBarService.getNewProductListVS1ByName(dataSearchName).then(function (data) {
        let records = [];

        let inventoryData = [];
        if(data.tproductvs1.length > 0){
        for (let i = 0; i < data.tproductvs1.length; i++) {
            var dataList = [

                data.tproductvs1[i].fields.ProductName || '-',
                data.tproductvs1[i].fields.SalesDescription || '',
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                data.tproductvs1[i].fields.TotalQtyInStock,
                data.tproductvs1[i].fields.TaxCodeSales || '',
                data.tproductvs1[i].fields.ID || '',
                JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
            ];

            if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                    let lineExtaSellObj = {
                        clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                        productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                        price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                    };
                    lineExtaSellItems.push(lineExtaSellObj);

                }
            }
            splashArrayProductList.push(dataList);
        }
        //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
        $('.fullScreenSpin').css('display', 'none');
        if (splashArrayProductList) {
          var datatable = $('#tblInventory').DataTable();
          datatable.clear();
          datatable.rows.add(splashArrayProductList);
          datatable.draw(false);

        }
        }else{
          $('.fullScreenSpin').css('display', 'none');
          $('#productListModal').modal('toggle');
          swal({
          title: 'Question',
          text: "Product does not exist, would you like to create it?",
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
          }).then((result) => {
          if (result.value) {
            $('#newProductModal').modal('toggle');
            $('#edtproductname').val(dataSearchName);
          } else if (result.dismiss === 'cancel') {
            $('#productListModal').modal('toggle');
          }
          });
        }
    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
    });
  }else{
    sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.tproductvs1.length; i++) {
              var dataList = [

                  data.tproductvs1[i].fields.ProductName || '-',
                  data.tproductvs1[i].fields.SalesDescription || '',
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                  data.tproductvs1[i].fields.TotalQtyInStock,
                  data.tproductvs1[i].fields.TaxCodeSales || '',
                  data.tproductvs1[i].fields.ID || '',
                  JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
              ];

              if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                  for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                      let lineExtaSellObj = {
                          clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                          productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                          price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                      };
                      lineExtaSellItems.push(lineExtaSellObj);

                  }
              }
              splashArrayProductList.push(dataList);
          }
          //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
          $('.fullScreenSpin').css('display', 'none');
          if (splashArrayProductList) {
            var datatable = $('#tblInventory').DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayProductList);
            datatable.draw(false);


          }
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
  }
  },
  'click #productListModal #refreshpagelist': function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      localStorage.setItem('VS1SalesProductList', '');
      let templateObject = Template.instance();
      Meteor._reload.reload();
      templateObject.getAllProducts();

  }
});
