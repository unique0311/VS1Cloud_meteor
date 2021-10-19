import {PurchaseBoardService} from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.purchaseorderlistBO.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.purchaseorderlistBO.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    const supplierList = [];
    let purchaseOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpurchaseorderlistBO', function(error, result){
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
    templateObject.resetData = function (dataVal) {
        window.open('/purchaseorderlistBO?page=last','_self');
    }
    templateObject.getAllPurchaseOrderData = function () {
        getVS1Data('TpurchaseOrderBackOrder').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllPurchaseOrderListBO(initialDataLoad,0).then(function (data) {
                    addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for(let i=0; i<data.tpurchaseorderbackorder.length; i++){
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalAmount)|| 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalTax) || 0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalAmountInc)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalPaid)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalBalance)|| 0.00;
                        var dataList = {
                            id: data.tpurchaseorderbackorder[i].Id || '',
                            employee:data.tpurchaseorderbackorder[i].EmployeeName || '',
                            sortdate: data.tpurchaseorderbackorder[i].OrderDate !=''? moment(data.tpurchaseorderbackorder[i].OrderDate).format("YYYY/MM/DD"): data.tpurchaseorderbackorder[i].OrderDate,
                            orderdate: data.tpurchaseorderbackorder[i].OrderDate !=''? moment(data.tpurchaseorderbackorder[i].OrderDate).format("DD/MM/YYYY"): data.tpurchaseorderbackorder[i].OrderDate,
                            suppliername: data.tpurchaseorderbackorder[i].SupplierName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            orderstatus: data.tpurchaseorderbackorder[i].OrderStatus || '',
                            custfield1: '' || '',
                            custfield2: '' || '',
                            comments: data.tpurchaseorderbackorder[i].Comments || '',
                        };
                        if(data.tpurchaseorderbackorder[i].Deleted === false){
                            dataTableList.push(dataList);
                        }


                    }
                    templateObject.datatablerecords.set(dataTableList);

                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpurchaseorderlistBO', function(error, result){
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
                        ////$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblpurchaseorderlistBO').DataTable({
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
                                    filename: "Purchase Order Back Order List - "+ moment().format(),
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
                                    title: 'Purchase Order List',
                                    filename: "Purchase Order Back Order List - "+ moment().format(),
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
                                $('#tblpurchaseorderlistBO').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                             "fnInitComplete": function () {
                             $("<button class='btn btn-primary btnRefreshPOBoList' type='button' id='btnRefreshPOBoList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblpurchaseorderlistBO_filter");

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
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblpurchaseorderlistBO th');
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
                    $('#tblpurchaseorderlistBO tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if(listData){
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpurchaseorderbackorder;
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<useData.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].TotalAmount)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].TotalAmountInc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].Id || '',
                        employee:useData[i].EmployeeName || '',
                        sortdate: useData[i].OrderDate !=''? moment(useData[i].OrderDate).format("YYYY/MM/DD"): useData[i].OrderDate,
                        orderdate: useData[i].OrderDate !=''? moment(useData[i].OrderDate).format("DD/MM/YYYY"): useData[i].OrderDate,
                        suppliername: useData[i].SupplierName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        orderstatus: useData[i].OrderStatus || '',
                        custfield1: '' || '',
                        custfield2: '' || '',
                        comments: useData[i].Comments || '',
                    };
                    if(useData[i].Deleted === false){
                        dataTableList.push(dataList);
                    }


                }
                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpurchaseorderlistBO', function(error, result){
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
                    ////$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblpurchaseorderlistBO').DataTable({
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
                                filename: "Purchase Order Back Order List - "+ moment().format(),
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
                                title: 'Purchase Order List',
                                filename: "Purchase Order Back Order List - "+ moment().format(),
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
                            $('#tblpurchaseorderlistBO').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblpurchaseorderlistBO_ellipsis').addClass('disabled');

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

                             sideBarService.getAllPurchaseOrderListBO(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TpurchaseOrderBackOrder').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tpurchaseorderbackorder), dataOld.tpurchaseorderbackorder);
                                   let objCombineData = {
                                     tpurchaseorderbackorder:thirdaryData
                                   }


                                     addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(objCombineData)).then(function (datareturn) {
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

                             $("<button class='btn btn-primary btnRefreshPOBoList' type='button' id='btnRefreshPOBoList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblpurchaseorderlistBO_filter");
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
                        sideBarService.getAllPurchaseOrderListBO('All',1).then(function(dataNonBo) {

                          addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(dataNonBo)).then(function (datareturn) {
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
                          sideBarService.getAllPurchaseOrderListBO(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(dataNonBo)).then(function (datareturn) {
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
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblpurchaseorderlistBO th');
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
                $('#tblpurchaseorderlistBO tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/purchaseordercard?id=' + listData);
                    }
                });

            }
        }).catch(function (err) {
            sideBarService.getAllPurchaseOrderListBO(initialDataLoad,0).then(function (data) {
                addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<data.tpurchaseorderbackorder.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalAmount)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalAmountInc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalPaid)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tpurchaseorderbackorder[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: data.tpurchaseorderbackorder[i].Id || '',
                        employee:data.tpurchaseorderbackorder[i].EmployeeName || '',
                        sortdate: data.tpurchaseorderbackorder[i].OrderDate !=''? moment(data.tpurchaseorderbackorder[i].OrderDate).format("YYYY/MM/DD"): data.tpurchaseorderbackorder[i].OrderDate,
                        orderdate: data.tpurchaseorderbackorder[i].OrderDate !=''? moment(data.tpurchaseorderbackorder[i].OrderDate).format("DD/MM/YYYY"): data.tpurchaseorderbackorder[i].OrderDate,
                        suppliername: data.tpurchaseorderbackorder[i].SupplierName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        orderstatus: data.tpurchaseorderbackorder[i].OrderStatus || '',
                        custfield1: '' || '',
                        custfield2: '' || '',
                        comments: data.tpurchaseorderbackorder[i].Comments || '',
                    };
                    if(data.tpurchaseorderbackorder[i].Deleted === false){
                        dataTableList.push(dataList);
                    }


                }
                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpurchaseorderlistBO', function(error, result){
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
                    ////$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblpurchaseorderlistBO').DataTable({
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
                                filename: "Purchase Order Back Order List - "+ moment().format(),
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
                                title: 'Purchase Order List',
                                filename: "Purchase Order Back Order List - "+ moment().format(),
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
                            $('#tblpurchaseorderlistBO').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                             $("<button class='btn btn-primary btnRefreshPOBoList' type='button' id='btnRefreshPOBoList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblpurchaseorderlistBO_filter");
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
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblpurchaseorderlistBO th');
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
                $('#tblpurchaseorderlistBO tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/purchaseordercard?id=' + listData);
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getAllPurchaseOrderData();


});

Template.purchaseorderlistBO.events({
    'click #btnNewPurchaseOrder':function(event){
        FlowRouter.go('/purchaseordercard');
    },
    'click #btnPurchaseOrderList':function(event){
        FlowRouter.go('/purchaseorderlist');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblpurchaseorderlistBO th');
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
    'keyup #tblpurchaseorderlistBO_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshPOBoList").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshPOBoList").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshPOBoList").trigger("click");
          }
        },
        'click .btnRefreshPOBoList':function(event){
        $(".btnRefresh").trigger("click");
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblpurchaseorderlistBO'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblpurchaseorderlistBO'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblpurchaseorderlistBO',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblpurchaseorderlistBO',published:true,
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
        var datable = $('#tblpurchaseorderlistBO').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblpurchaseorderlistBO th');
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
        var columns = $('#tblpurchaseorderlistBO th');
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
        jQuery('#tblpurchaseorderlistBO_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblpurchaseorderlistBO_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        sideBarService.getAllPurchaseOrderListBO(initialDataLoad,0).then(function(data) {
            addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(data)).then(function (datareturn) {
                Meteor._reload.reload();
            }).catch(function (err) {
                Meteor._reload.reload();
            });
        }).catch(function(err) {
            Meteor._reload.reload();
        });

        sideBarService.getAllPurchaseOrderListAll(prevMonth11Date,toDate, false).then(function(data) {
            addVS1Data('TbillReport',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });
    }

});

Template.purchaseorderlistBO.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.orderdate == 'NA') {
                return 1;
            }
            else if (b.orderdate == 'NA') {
                return -1;
            }
            return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    purchasesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblpurchaseorderlistBO'});
    }

});
