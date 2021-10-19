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
Template.invoicelistBO.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.invoicelistBO.onRendered(function() {
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

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelistBO', function(error, result){
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
        window.open('/invoicelistBO?page=last','_self');
    }

    templateObject.getAllSalesOrderData = function () {
        getVS1Data('BackOrderSalesList').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllBOInvoiceList(initialDataLoad,0).then(function (data) {
                  addVS1Data('BackOrderSalesList',JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};

                    for(let i=0; i<data.BackOrderSalesList.length; i++){
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountEx)|| 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalTax) || 0.00;
                        // Currency+''+data.BackOrderSalesList[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountInc)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalPaid)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalBalance)|| 0.00;
                        var dataList = {
                            id: data.BackOrderSalesList[i].SaleID || '',
                            employee:data.BackOrderSalesList[i].SaleEnteredBy || '',
                            sortdate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("YYYY/MM/DD"): data.BackOrderSalesList[i].SaleDate,
                            saledate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].SaleDate,
                            duedate: data.BackOrderSalesList[i].DueDate !=''? moment(data.BackOrderSalesList[i].DueDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].DueDate,
                            customername: data.BackOrderSalesList[i].CustomerPrintName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            department: data.BackOrderSalesList[i].Department || '',
                            custfield1: data.BackOrderSalesList[i].UOM || '',
                            custfield2: data.BackOrderSalesList[i].SaleTerms || '',
                            comments: data.BackOrderSalesList[i].SaleComments || '',
                            qtybackorder: data.BackOrderSalesList[i].QtyBackOrder || '',
                            product: data.BackOrderSalesList[i].ProductPrintName || '',
                            // shipdate:data.BackOrderSalesList[i].ShipDate !=''? moment(data.BackOrderSalesList[i].ShipDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].ShipDate,

                        };

                        //if(data.BackOrderSalesList[i].IsBackOrder == true){
                        dataTableList.push(dataList);
                        //}
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelistBO', function(error, result){
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
                        $('#tblInvoicelistBO').DataTable({
                            columnDefs: [
                                {type: 'date', targets: 0}
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Invoice List Back Order"+ moment().format(),
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
                                    title: 'Invoice List',
                                    filename: "Invoice List Back Order"+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            action: function () {
                                $('#tblInvoicelistBO').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                             $("<button class='btn btn-primary btnRefreshInvoiceListBO' type='button' id='btnRefreshInvoiceListBO' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInvoicelistBO_filter");

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

                        // $('#tblInvoicelistBO').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblInvoicelistBO th');
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
                    $('#tblInvoicelistBO tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if(listData){
                            FlowRouter.go('/invoicecard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.BackOrderSalesList;
                let lineItems = [];
                let lineItemObj = {};

                for(let i=0; i<data.BackOrderSalesList.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountEx)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalTax) || 0.00;
                    // Currency+''+data.BackOrderSalesList[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountInc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: data.BackOrderSalesList[i].SaleID || '',
                        employee:data.BackOrderSalesList[i].SaleEnteredBy || '',
                        sortdate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("YYYY/MM/DD"): data.BackOrderSalesList[i].SaleDate,
                        saledate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].SaleDate,
                        duedate: data.BackOrderSalesList[i].DueDate !=''? moment(data.BackOrderSalesList[i].DueDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].DueDate,
                        customername: data.BackOrderSalesList[i].CustomerPrintName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        department: data.BackOrderSalesList[i].Department || '',
                        custfield1: data.BackOrderSalesList[i].UOM || '',
                        custfield2: data.BackOrderSalesList[i].SaleTerms || '',
                        comments: data.BackOrderSalesList[i].SaleComments || '',
                        qtybackorder: data.BackOrderSalesList[i].QtyBackOrder || '',
                        product: data.BackOrderSalesList[i].ProductPrintName || '',
                        // shipdate:data.BackOrderSalesList[i].ShipDate !=''? moment(data.BackOrderSalesList[i].ShipDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].ShipDate,

                    };

                    //if(data.BackOrderSalesList[i].IsBackOrder == true){
                    dataTableList.push(dataList);
                    //}
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelistBO', function(error, result){
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
                    $('#tblInvoicelistBO').DataTable({
                        columnDefs: [
                            {type: 'date', targets: 0}
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Invoice List Back Order"+ moment().format(),
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
                                title: 'Invoice List',
                                filename: "Invoice List Back Order"+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        action: function () {
                            $('#tblInvoicelistBO').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblInvoicelistBO_ellipsis').addClass('disabled');

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

                             sideBarService.getAllBOInvoiceList(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('BackOrderSalesList').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.BackOrderSalesList), dataOld.BackOrderSalesList);
                                   let objCombineData = {
                                     BackOrderSalesList:thirdaryData
                                   }


                                     addVS1Data('BackOrderSalesList',JSON.stringify(objCombineData)).then(function (datareturn) {
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
                             $("<button class='btn btn-primary btnRefreshInvoiceListBO' type='button' id='btnRefreshInvoiceListBO' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInvoicelistBO_filter");
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
                        sideBarService.getAllBOInvoiceList('All',1).then(function(dataNonBo) {

                          addVS1Data('BackOrderSalesList',JSON.stringify(dataNonBo)).then(function (datareturn) {
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
                          sideBarService.getAllBOInvoiceList(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('BackOrderSalesList',JSON.stringify(dataNonBo)).then(function (datareturn) {
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

                    // $('#tblInvoicelistBO').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblInvoicelistBO th');
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
                $('#tblInvoicelistBO tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/invoicecard?id=' + listData);
                    }
                });

            }
        }).catch(function (err) {
              sideBarService.getAllBOInvoiceList(initialDataLoad,0).then(function (data) {
                addVS1Data('BackOrderSalesList',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};

                for(let i=0; i<data.BackOrderSalesList.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountEx)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalTax) || 0.00;
                    // Currency+''+data.BackOrderSalesList[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalAmountInc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.BackOrderSalesList[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: data.BackOrderSalesList[i].SaleID || '',
                        employee:data.BackOrderSalesList[i].SaleEnteredBy || '',
                        sortdate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("YYYY/MM/DD"): data.BackOrderSalesList[i].SaleDate,
                        saledate: data.BackOrderSalesList[i].SaleDate !=''? moment(data.BackOrderSalesList[i].SaleDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].SaleDate,
                        duedate: data.BackOrderSalesList[i].DueDate !=''? moment(data.BackOrderSalesList[i].DueDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].DueDate,
                        customername: data.BackOrderSalesList[i].CustomerPrintName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        department: data.BackOrderSalesList[i].Department || '',
                        custfield1: data.BackOrderSalesList[i].UOM || '',
                        custfield2: data.BackOrderSalesList[i].SaleTerms || '',
                        comments: data.BackOrderSalesList[i].SaleComments || '',
                        qtybackorder: data.BackOrderSalesList[i].QtyBackOrder || '',
                        product: data.BackOrderSalesList[i].ProductPrintName || '',
                        // shipdate:data.BackOrderSalesList[i].ShipDate !=''? moment(data.BackOrderSalesList[i].ShipDate).format("DD/MM/YYYY"): data.BackOrderSalesList[i].ShipDate,

                    };

                    //if(data.BackOrderSalesList[i].IsBackOrder == true){
                    dataTableList.push(dataList);
                    //}
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblInvoicelistBO', function(error, result){
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
                    $('#tblInvoicelistBO').DataTable({
                        columnDefs: [
                            {type: 'date', targets: 0}
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Invoice List Back Order"+ moment().format(),
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
                                title: 'Invoice List',
                                filename: "Invoice List Back Order"+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        action: function () {
                            $('#tblInvoicelistBO').DataTable().ajax.reload();
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

                    // $('#tblInvoicelistBO').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblInvoicelistBO th');
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
                $('#tblInvoicelistBO tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/invoicecard?id=' + listData);
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

    $('#tblInvoicelistBO tbody').on( 'click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        if(listData){
            FlowRouter.go('/invoicecard?id=' + listData);
        }

    });


});


Template.invoicelistBO.events({
    'click #btnNewInvoice':function(event){
        FlowRouter.go('/invoicecard');
    },
    'click #btnInvoiceList':function(event){
        FlowRouter.go('/invoicelist');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblInvoicelistBO th');
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
    'keyup #tblInvoicelistBO_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshInvoiceListBO").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshInvoiceListBO").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshInvoiceListBO").trigger("click");
          }
        },
        'blur #tblInventory_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshInvoiceListBO").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshInvoiceListBO").removeClass('btnSearchAlert');
          }

        },
        'click .btnRefreshInvoiceListBO':function(event){
        $(".btnRefresh").trigger("click");
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInvoicelistBO'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblInvoicelistBO'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblInvoicelistBO',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblInvoicelistBO',published:true,
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
        var datable = $('#tblInvoicelistBO').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblInvoicelistBO th');
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
        var columns = $('#tblInvoicelistBO th');

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
        jQuery('#tblInvoicelistBO_wrapper .dt-buttons .btntabletocsv').click();
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
        sideBarService.getAllBOInvoiceList(initialDataLoad,0).then(function (dataBO) {
          addVS1Data('BackOrderSalesList',JSON.stringify(dataBO)).then(function (datareturn) {
              window.open('/invoicelistBO','_self');
          }).catch(function (err) {
              window.open('/invoicelistBO','_self');
          });
        }).catch(function(err) {
            window.open('/invoicelistBO','_self');
        });

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblInvoicelistBO_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    }


});

Template.invoicelistBO.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.saledate == 'NA') {
                return 1;
            }
            else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblInvoicelistBO'});
    }
});
