import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.salesorderslist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.salesorderslist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let salesService = new SalesBoardService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if(FlowRouter.current().queryParams.success){
        $('.btnRefresh').addClass('btnRefreshAlert');
    }
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
                    // let columnindex = customcolumn[i].index + 1;
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

    templateObject.resetData = function (dataVal) {
        window.open('/salesorderslist?page=last','_self');
    }

    templateObject.getAllSalesOrderData = function () {
        getVS1Data('TSalesOrderEx').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllSalesOrderList(initialDataLoad,0).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    addVS1Data('TSalesOrderEx',JSON.stringify(data));
                    for(let i=0; i<data.tsalesorderex.length; i++){
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmount)|| 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalTax) || 0.00;
                        // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmountInc)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalPaid)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalBalance)|| 0.00;
                        var dataList = {
                            id: data.tsalesorderex[i].fields.ID || '',
                            employee:data.tsalesorderex[i].fields.EmployeeName || '',
                            sortdate: data.tsalesorderex[i].fields.SaleDate !=''? moment(data.tsalesorderex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tsalesorderex[i].fields.SaleDate,
                            saledate: data.tsalesorderex[i].fields.SaleDate !=''? moment(data.tsalesorderex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tsalesorderex[i].fields.SaleDate,
                            duedate: data.tsalesorderex[i].fields.DueDate !=''? moment(data.tsalesorderex[i].fields.DueDate).format("DD/MM/YYYY"): data.tsalesorderex[i].fields.DueDate,
                            customername: data.tsalesorderex[i].fields.CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tsalesorderex[i].fields.SalesStatus || '',
                            custfield1: data.tsalesorderex[i].fields.SaleCustField1 || '',
                            custfield2: data.tsalesorderex[i].fields.SaleCustField2 || '',
                            comments: data.tsalesorderex[i].fields.Comments || '',
                        };

                        if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                            dataTableList.push(dataList);
                        }

                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
                        $('#tblSalesOrderlist').DataTable({
                            columnDefs: [
                                {type: 'date', targets: 0}
                            ],
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
                                    filename: "Sales Order List - "+ moment().format(),
                                    orientation:'portrait',
                                    exportOptions: {
                                        columns: ':visible',
                                        format: {
                                            body: function ( data, row, column ) {
                                                if(data.includes("</span>")){
                                                    var res = data.split("</span>");
                                                    data = res[1];
                                                }

                                                return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                            }
                                        }
                                    }
                                },{
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Sales Order List',
                                    filename: "Sales Order List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            //bStateSave: true,
                            //rowId: 0,
                            pageLength: initialDatatableLoad,
                            searching: true,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            responsive: true,
                            action: function () {
                                $('#tblSalesOrderlist').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                             $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");

                         }

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

                        // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblSalesOrderlist th');
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
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if(listData){
                            FlowRouter.go('/salesordercard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsalesorderex;
                let lineItems = [];
                let lineItemObj = {};

                for(let i=0; i<useData.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmount)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalTax) || 0.00;
                    // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employee:useData[i].fields.EmployeeName || '',
                        sortdate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("YYYY/MM/DD"): useData[i].fields.SaleDate,
                        saledate: useData[i].fields.SaleDate !=''? moment(useData[i].fields.SaleDate).format("DD/MM/YYYY"): useData[i].fields.SaleDate,
                        duedate: useData[i].fields.DueDate !=''? moment(useData[i].fields.DueDate).format("DD/MM/YYYY"): useData[i].fields.DueDate,
                        customername: useData[i].fields.CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: useData[i].fields.SalesStatus || '',
                        custfield1: useData[i].fields.SaleCustField1 || '',
                        custfield2: useData[i].fields.SaleCustField2 || '',
                        comments: useData[i].fields.Comments || '',
                    };

                    if(useData[i].fields.Deleted == false && useData[i].fields.CustomerName.replace(/\s/g, '') != ''){
                        dataTableList.push(dataList);
                    }

                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
                    $('#tblSalesOrderlist').DataTable({
                        columnDefs: [
                            {type: 'date', targets: 0}
                        ],
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
                                filename: "Sales Order List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function ( data, row, column ) {
                                            if(data.includes("</span>")){
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }

                                            return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                        }
                                    }
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Sales Order List',
                                filename: "Sales Order List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        //bStateSave: true,
                        //rowId: 0,
                        pageLength: initialDatatableLoad,
                        searching: true,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        responsive: true,
                        action: function () {
                            $('#tblSalesOrderlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblSalesOrderlist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;

                             sideBarService.getAllSalesOrderList(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TSalesOrderEx').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderex), dataOld.tsalesorderex);
                                   let objCombineData = {
                                     tsalesorderex:thirdaryData
                                   }


                                     addVS1Data('TSalesOrderEx',JSON.stringify(objCombineData)).then(function (datareturn) {
                                       templateObject.resetData(objCombineData);
                                     $('.fullScreenSpin').css('display','none');
                                     }).catch(function (err) {
                                     $('.fullScreenSpin').css('display','none');
                                     });

                                 }
                                }).catch(function (err) {

                                });

                             }).catch(function(err) {
                               $('.fullScreenSpin').css('display','none');
                             });

                           });
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if(urlParametersPage){
                            this.fnPageChange('last');
                          }
                        $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");

                         }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on( 'length.dt', function ( e, settings, len ) {
                      $('.fullScreenSpin').css('display','inline-block');
                      let dataLenght = settings._iDisplayLength;
                      if(dataLenght == -1){
                        if(settings.fnRecordsDisplay() > initialDatatableLoad){
                          $('.fullScreenSpin').css('display','none');
                        }else{
                        sideBarService.getAllSalesOrderList('All',1).then(function(dataNonBo) {

                          addVS1Data('TSalesOrderEx',JSON.stringify(dataNonBo)).then(function (datareturn) {
                            templateObject.resetData(dataNonBo);
                          $('.fullScreenSpin').css('display','none');
                          }).catch(function (err) {
                          $('.fullScreenSpin').css('display','none');
                          });
                        }).catch(function(err) {
                          $('.fullScreenSpin').css('display','none');
                        });
                       }
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display','none');
                        }else{
                          sideBarService.getAllSalesOrderList(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('TSalesOrderEx',JSON.stringify(dataNonBo)).then(function (datareturn) {
                              templateObject.resetData(dataNonBo);
                            $('.fullScreenSpin').css('display','none');
                            }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                            });
                          }).catch(function(err) {
                            $('.fullScreenSpin').css('display','none');
                          });
                        }
                      }
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblSalesOrderlist th');
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
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/salesordercard?id=' + listData);
                    }
                });

            }
        }).catch(function (err) {

          sideBarService.getAllSalesOrderList(initialDataLoad,0).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              addVS1Data('TSalesOrderEx',JSON.stringify(data));
              for(let i=0; i<data.tsalesorderex.length; i++){
                  let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmount)|| 0.00;
                  let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalTax) || 0.00;
                  // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                  let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmountInc)|| 0.00;
                  let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalPaid)|| 0.00;
                  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalBalance)|| 0.00;
                  var dataList = {
                      id: data.tsalesorderex[i].fields.ID || '',
                      employee:data.tsalesorderex[i].fields.EmployeeName || '',
                      sortdate: data.tsalesorderex[i].fields.SaleDate !=''? moment(data.tsalesorderex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tsalesorderex[i].fields.SaleDate,
                      saledate: data.tsalesorderex[i].fields.SaleDate !=''? moment(data.tsalesorderex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tsalesorderex[i].fields.SaleDate,
                      duedate: data.tsalesorderex[i].fields.DueDate !=''? moment(data.tsalesorderex[i].fields.DueDate).format("DD/MM/YYYY"): data.tsalesorderex[i].fields.DueDate,
                      customername: data.tsalesorderex[i].fields.CustomerName || '',
                      totalamountex: totalAmountEx || 0.00,
                      totaltax: totalTax || 0.00,
                      totalamount: totalAmount || 0.00,
                      totalpaid: totalPaid || 0.00,
                      totaloustanding: totalOutstanding || 0.00,
                      salestatus: data.tsalesorderex[i].fields.SalesStatus || '',
                      custfield1: data.tsalesorderex[i].fields.SaleCustField1 || '',
                      custfield2: data.tsalesorderex[i].fields.SaleCustField2 || '',
                      comments: data.tsalesorderex[i].fields.Comments || '',
                  };

                  if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
                      dataTableList.push(dataList);
                  }

                  //}
              }

              templateObject.datatablerecords.set(dataTableList);

              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOrderlist', function(error, result){
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
                  $('#tblSalesOrderlist').DataTable({
                      columnDefs: [
                          {type: 'date', targets: 0}
                      ],
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
                              filename: "Sales Order List - "+ moment().format(),
                              orientation:'portrait',
                              exportOptions: {
                                  columns: ':visible',
                                  format: {
                                      body: function ( data, row, column ) {
                                          if(data.includes("</span>")){
                                              var res = data.split("</span>");
                                              data = res[1];
                                          }

                                          return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                      }
                                  }
                              }
                          },{
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Sales Order List',
                              filename: "Sales Order List - "+ moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                      //bStateSave: true,
                      //rowId: 0,
                      pageLength: initialDatatableLoad,
                      searching: true,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      responsive: true,
                      action: function () {
                          $('#tblSalesOrderlist').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      },
                      "fnInitComplete": function () {
                             $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");

                     }

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

                  // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#tblSalesOrderlist th');
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
              $('div.dataTables_filter input').addClass('form-control form-control-sm');
              $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
                  var listData = $(this).closest('tr').attr('id');
                  if(listData){
                      FlowRouter.go('/salesordercard?id=' + listData);
                  }
              });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });

    }

    templateObject.getAllSalesOrderData();

    $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
        //var listData = table.row( this ).id();
        var listData = $(this).closest('tr').attr('id');

        //for(let i=0 ; i<splashArray.length ;i++){
        if(listData){
            FlowRouter.go('/salesordercard?id=' + listData);
        }
        //}
    });

});


Template.salesorderslist.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblSalesOrderlist'});
    }
});

Template.salesorderslist.events({
    'click #btnNewSalesOrder':function(event){
        FlowRouter.go('/salesordercard');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblSalesOrderlist th');
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
     'keyup #tblSalesOrderlist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshSOList").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshSOList").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshSOList").trigger("click");
          }
        },
        'blur #tblInventory_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshSOList").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshSOList").removeClass('btnSearchAlert');
          }

        },
    'click .btnRefreshSOList':function(event){
         let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblSalesOrderlist_filter input').val();
        console.log(dataSearchName);
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewSalesOrderByNameOrID(dataSearchName).then(function (data) {
                $(".btnRefreshSOList_filter").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tsalesorderex.length > 0) {
                    for (let i = 0; i < data.tsalesorderex.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmount) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalTax) || 0.00;
                        // Currency+''+data.tsalesorderex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderex[i].fields.TotalBalance) || 0.00;
                        var dataList = {
                            id: data.tsalesorderex[i].fields.ID || '',
                            employee: data.tsalesorderex[i].fields.EmployeeName || '',
                            sortdate: data.tsalesorderex[i].fields.SaleDate != '' ? moment(data.tsalesorderex[i].fields.SaleDate).format("YYYY/MM/DD") : data.tsalesorderex[i].fields.SaleDate,
                            saledate: data.tsalesorderex[i].fields.SaleDate != '' ? moment(data.tsalesorderex[i].fields.SaleDate).format("DD/MM/YYYY") : data.tsalesorderex[i].fields.SaleDate,
                            duedate: data.tsalesorderex[i].fields.DueDate != '' ? moment(data.tsalesorderex[i].fields.DueDate).format("DD/MM/YYYY") : data.tsalesorderex[i].fields.DueDate,
                            customername: data.tsalesorderex[i].fields.CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tsalesorderex[i].fields.SalesStatus || '',
                            custfield1: data.tsalesorderex[i].fields.SaleCustField1 || '',
                            custfield2: data.tsalesorderex[i].fields.SaleCustField2 || '',
                            comments: data.tsalesorderex[i].fields.Comments || '',
                            // shipdate:data.tsalesorderex[i].fields.ShipDate !=''? moment(data.tsalesorderex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tsalesorderex[i].fields.ShipDate,

                        };

                        //if(data.tsalesorderex[i].fields.Deleted == false){
                        //splashArrayInvoiceList.push(dataList);
                        dataTableList.push(dataList);
                        //}


                        //}
                    }
                    templateObject.datatablerecords.set(dataTableList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (dataTableList) {
                        var datatable = $('#tblquotelist').DataTable();
                        $("#tblSalesOrderlist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblSalesOrderlist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colSortDate hiddenColumn">' + item[x].sortdate + '</td>' +
                                '<td contenteditable="false" class="colSaleDate" ><span style="display:none;">' + item[x].sortdate + '</span>' + item[x].saledate + '</td>' +
                                '<td contenteditable="false" class="colSalesNo">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colDueDate" >' + item[x].duedate + '</td>' +
                                '<td contenteditable="false" class="colCustomer">' + item[x].customername + '</td>' +
                                '<td contenteditable="false" class="colAmountEx" style="text-align: right!important;">' + item[x].totalamountex + '</td>' +
                                '<td contenteditable="false" class="colTax" style="text-align: right!important;">' + item[x].totaltax + '</td>' +
                                '<td contenteditable="false" class="colAmount" style="text-align: right!important;">' + item[x].totalamount + '</td>' +
                                // '<td contenteditable="false" class="colPaid" style="text-align: right!important;">' + item[x].totalpaid + '</td>' +
                                // '<td contenteditable="false" class="colBalanceOutstanding" style="text-align: right!important;">' + item[x].totaloustanding + '</td>' +
                                '<td contenteditable="false" class="colStatus hiddenColumn">' + item[x].salestatus + '</td>' +
                                '<td contenteditable="false" class="colSaleCustField1 hiddenColumn">' + item[x].custfield1 + '</td>' +
                                '<td contenteditable="false" class="colSaleCustField2 hiddenColumn">' + item[x].custfield2 + '</td>' +
                                '<td contenteditable="false" class="colEmployee hiddenColumn">' + item[x].employee + '</td>' +
                                '<td contenteditable="false" class="colComments">' + item[x].comments + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.tsalesorderex.length + ' of ' + data.tsalesorderex.length + ' entries');

                    }

                } else {
                    $('.fullScreenSpin').css('display', 'none');

                    swal({
                        title: 'Question',
                        text: "Sales Order does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/salesordercard');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          $(".btnRefresh").trigger("click");
        }
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOrderlist'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOrderlist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblSalesOrderlist',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblSalesOrderlist',published:true,
                                            customFields:lineItems,
                                            createdAt: new Date() }, function(err, idTag) {
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
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblSalesOrderlist').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblSalesOrderlist th');
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
        var columns = $('#tblSalesOrderlist th');

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
        jQuery('#tblSalesOrderlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblSalesOrderlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let currentDate = new Date();
        let hours = currentDate.getHours(); //returns 0-23
        let minutes = currentDate.getMinutes(); //returns 0-59
        let seconds = currentDate.getSeconds(); //returns 0-59
        let month = (currentDate.getMonth()+1);
        let days = currentDate.getDate();

        if((currentDate.getMonth()+1) < 10){
            month = "0" + (currentDate.getMonth()+1);
        }

        if(currentDate.getDate() < 10){
            days = "0" + currentDate.getDate();
        }
        let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days + " "+ hours+ ":"+ minutes+ ":"+ seconds;
        let templateObject = Template.instance();
        sideBarService.getAllSalesOrderList(initialDataLoad,0).then(function(data) {
            addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {
                window.open('/salesorderslist','_self');
            }).catch(function (err) {
                window.open('/salesorderslist','_self');
            });
        }).catch(function(err) {
            window.open('/salesorderslist','_self');
        });
    }



});
