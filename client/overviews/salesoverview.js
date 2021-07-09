import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.salesoverview.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.salesoverview.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let salesService = new SalesBoardService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];


    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOverview', function(error, result){
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
    // $('#tblSalesOverview').DataTable();
    templateObject.getAllSalesOrderData = function () {
        getVS1Data('TSalesList').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getSalesListData().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for(let i=0; i<data.tsaleslist.length; i++){
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmount)|| 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalTax) || 0.00;
                        // Currency+''+data.tsaleslist[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmountinc)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Payment)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Balance)|| 0.00;
                        var dataList = {
                            id: data.tsaleslist[i].SaleId || '',
                            employee:data.tsaleslist[i].employeename || '',
                            sortdate: data.tsaleslist[i].SaleDate !=''? moment(data.tsaleslist[i].SaleDate).format("YYYY/MM/DD"): data.tsaleslist[i].SaleDate,
                            saledate: data.tsaleslist[i].SaleDate !=''? moment(data.tsaleslist[i].SaleDate).format("DD/MM/YYYY"): data.tsaleslist[i].SaleDate,
                            customername: data.tsaleslist[i].CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tsaleslist[i].Status || '',
                            custfield1:  '',
                            custfield2:  '',
                            comments: data.tsaleslist[i].Comments || '',
                            type: data.tsaleslist[i].Type || '',
                        };
                        //if(data.tsaleslist[i].Deleted == false){
                        dataTableList.push(dataList);
                        //}

                    }
                    templateObject.datatablerecords.set(dataTableList);
                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOverview', function(error, result){
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
                        $('.fullScreenSpin').css('display','none');
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblSalesOverview').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [
                                {type: 'date', targets: 0}
                                // ,
                                // { targets: 0, className: "text-center" }

                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Sales Overview List - "+ moment().format(),
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
                                    title: 'Sales Overview',
                                    filename: "Sales Overview List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    },
                                    // customize: function ( win ) {
                                    //     $(win.document.body)
                                    //         .css( 'font-size', '10pt' )
                                    //         .prepend(
                                    //             '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
                                    //         );
                                    //
                                    //     $(win.document.body).find( 'table' )
                                    //         .addClass( 'compact' )
                                    //         .css( 'font-size', 'inherit' );
                                    // }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: 25,
                            searching: false,
                            lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#tblSalesOverview').DataTable().ajax.reload();
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

                        });

                    }, 0);

                    var columns = $('#tblSalesOverview th');
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

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsaleslist;
                let lineItems = [];
                let lineItemObj = {};

                $('.fullScreenSpin').css('display','none');
                for(let i=0; i<useData.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].TotalAmount)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].TotalTax) || 0.00;
                    // Currency+''+useData[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].TotalAmountinc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].Payment)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].Balance)|| 0.00;
                    var dataList = {
                        id: useData[i].SaleId || '',
                        employee:useData[i].employeename || '',
                        sortdate: useData[i].SaleDate !=''? moment(useData[i].SaleDate).format("YYYY/MM/DD"): useData[i].SaleDate,
                        saledate: useData[i].SaleDate !=''? moment(useData[i].SaleDate).format("DD/MM/YYYY"): useData[i].SaleDate,
                        customername: useData[i].CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: useData[i].Status || '',
                        custfield1: '',
                        custfield2: '',
                        comments: useData[i].Comments || '',
                        type: useData[i].Type || '',
                    };
                    //if(useData[i].Deleted == false){
                    dataTableList.push(dataList);
                    //}

                }
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOverview', function(error, result){
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
                    $('.fullScreenSpin').css('display','none');
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblSalesOverview').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            {type: 'date', targets: 0}
                            // ,
                            // { targets: 0, className: "text-center" }

                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Sales Overview List - "+ moment().format(),
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
                                title: 'Sales Overview',
                                filename: "Sales Overview List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                },
                                // customize: function ( win ) {
                                //     $(win.document.body)
                                //         .css( 'font-size', '10pt' )
                                //         .prepend(
                                //             '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
                                //         );
                                //
                                //     $(win.document.body).find( 'table' )
                                //         .addClass( 'compact' )
                                //         .css( 'font-size', 'inherit' );
                                // }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: 25,
                        searching: false,
                        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblSalesOverview').DataTable().ajax.reload();
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

                    });

                }, 0);

                var columns = $('#tblSalesOverview th');
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


            }
        }).catch(function (err) {
            sideBarService.getSalesListData().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<data.tsaleslist.length; i++){
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmount)|| 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalTax) || 0.00;
                    // Currency+''+data.tsaleslist[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmountinc)|| 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Payment)|| 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Balance)|| 0.00;
                    var dataList = {
                        id: data.tsaleslist[i].SaleId || '',
                        employee:data.tsaleslist[i].employeename || '',
                        sortdate: data.tsaleslist[i].SaleDate !=''? moment(data.tsaleslist[i].SaleDate).format("YYYY/MM/DD"): data.tsaleslist[i].SaleDate,
                        saledate: data.tsaleslist[i].SaleDate !=''? moment(data.tsaleslist[i].SaleDate).format("DD/MM/YYYY"): data.tsaleslist[i].SaleDate,
                        customername: data.tsaleslist[i].CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: data.tsaleslist[i].Status || '',
                        custfield1:  '',
                        custfield2:  '',
                        comments: data.tsaleslist[i].Comments || '',
                        type: data.tsaleslist[i].Type || '',
                    };
                    //if(data.tsaleslist[i].Deleted == false){
                    dataTableList.push(dataList);
                    //}

                }
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSalesOverview', function(error, result){
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
                    $('.fullScreenSpin').css('display','none');
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblSalesOverview').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            {type: 'date', targets: 0}
                            // ,
                            // { targets: 0, className: "text-center" }

                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Sales Overview List - "+ moment().format(),
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
                                title: 'Sales Overview',
                                filename: "Sales Overview List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                },
                                // customize: function ( win ) {
                                //     $(win.document.body)
                                //         .css( 'font-size', '10pt' )
                                //         .prepend(
                                //             '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
                                //         );
                                //
                                //     $(win.document.body).find( 'table' )
                                //         .addClass( 'compact' )
                                //         .css( 'font-size', 'inherit' );
                                // }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: 25,
                        searching: false,
                        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblSalesOverview').DataTable().ajax.reload();
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

                    });

                }, 0);

                var columns = $('#tblSalesOverview th');
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

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
        });

        $('#tblSalesOverview tbody').on( 'click', 'tr', function () {
            var listData = $(this).closest('tr').attr('id');

            var transactiontype = $(event.target).closest("tr").find(".colType").text();
            if((listData) && (transactiontype)){
                if(transactiontype === 'Invoice' ){
                    Router.go('/invoicecard?id=' + listData);
                }else if(transactiontype === 'Quote'){
                    Router.go('/quotecard?id=' + listData);
                }else if(transactiontype === 'Sales Order'){
                    Router.go('/salesordercard?id=' + listData);
                }else if(transactiontype === 'Refund'){
                    Router.go('/refundcard?id=' + listData);
                }else{
                    //Router.go('/purchaseordercard?id=' + listData);
                }

            }
        });
    }

    templateObject.getAllSalesOrderData();

});

Template.salesoverview.events({
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();

        sideBarService.getSalesListData().then(function(data) {
            addVS1Data('TSalesList',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllInvoiceList().then(function(data) {
            addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {
                Meteor._reload.reload();
            }).catch(function (err) {
                Meteor._reload.reload();
            });
        }).catch(function(err) {
            Meteor._reload.reload();
        });
    },
    'click .feeOnTopInput':function(event){
        if($(event.target).is(':checked')){
            $('.feeInPriceInput').attr('checked', false);
        }
    },
    'click .feeInPriceInput':function(event){
        if($(event.target).is(':checked')){
            $('.feeOnTopInput').attr('checked', false);
        }
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
    'click #newRefund' : function(event){
        Router.go('/refundcard');
    },
    'click .invoiceList' : function(event){
        Router.go('/invoicelist');
    },
    'click .invoiceListBO' : function(event){
        Router.go('/invoicelistBO');
    },
    'click #newQuote' : function(event){
        Router.go('/quotecard');
    },
    'click .QuoteList' : function(event){
        Router.go('/quoteslist');
    },
    'click .btnTaxRateSettings' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/taxratesettings');
    },
    'click .btnTermsSettings' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/termsettings');
    },
    'click .btnCurrencySettings' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/currenciesSettings');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblSalesOverview th');
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOverview'});
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
        //let datatable =$('#tblSalesOverview').DataTable();
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblSalesOverview'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblSalesOverview',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblSalesOverview',published:true,
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

        //Meteor._reload.reload();
    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblSalesOverview').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblSalesOverview th');
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
        var columns = $('#tblSalesOverview th');

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
        jQuery('#tblSalesOverview_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblSalesOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
        // $('#html-2-pdfwrapper').css('display','block');
        // var pdf =  new jsPDF('portrait','mm','a4');
        // //new jsPDF('p', 'pt', 'a4');
        //   pdf.setFontSize(18);
        //   var source = document.getElementById('html-2-pdfwrapper');
        //   pdf.addHTML(source, function () {
        //      pdf.save('salesoverview.pdf');
        //      $('#html-2-pdfwrapper').css('display','none');
        //  });
    },
    'click .close' : function(event){
        var vid = document.getElementById("myVideo");
        vid.pause();
    }


});
Template.salesoverview.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.saledate == 'NA') {
                return 1;
            }
            else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblSalesOverview'});
    },
    currentdate : () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
