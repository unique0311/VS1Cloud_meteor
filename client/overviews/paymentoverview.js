import {PaymentsService} from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.paymentoverview.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.awaitingcustpaymentCount = new ReactiveVar();
    templateObject.awaitingsupppaymentCount = new ReactiveVar();

    templateObject.overduecustpaymentCount = new ReactiveVar();
    templateObject.overduesupppaymentCount = new ReactiveVar();


    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colAwaitingPayment").removeClass("col");
                $("#colAwaitingPayment").addClass("col-12");
                $("#colAwaitingPaymentNum").removeClass("col");
                $("#colAwaitingPaymentNum").addClass("col-10");
                $("#colAwaitingPaymentIcon").removeClass("col-auto");
                $("#colAwaitingPaymentIcon").addClass("col-2");

                $("#colOverdue").removeClass("col");
                $("#colOverdue").addClass("col-12");
                $("#colOverdueNum").removeClass("col");
                $("#colOverdueNum").addClass("col-10");
                $("#colOverdueIcon").removeClass("col-auto");
                $("#colOverdueIcon").addClass("col-2");

                $("#colAwaitingPaymentSupp").removeClass("col");
                $("#colAwaitingPaymentSupp").addClass("col-12");
                $("#colAwaitingPaymentSuppNum").removeClass("col");
                $("#colAwaitingPaymentSuppNum").addClass("col-10");
                $("#colAwaitingPaymentSuppIcon").removeClass("col-auto");
                $("#colAwaitingPaymentSuppIcon").addClass("col-2");

                $("#colOverdueSupp").removeClass("col");
                $("#colOverdueSupp").addClass("col-12");
                $("#colOverdueSuppNum").removeClass("col");
                $("#colOverdueSuppNum").addClass("col-10");
                $("#colOverdueSuppIcon").removeClass("col-auto");
                $("#colOverdueSuppIcon").addClass("col-2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#paymentCard1").removeClass("col-auto");
                $("#paymentCard2").removeClass("col-auto");
                $("#paymentCard3").removeClass("col-auto");
                $("#paymentCard4").removeClass("col-auto");
                $("#paymentCard1").addClass("col-12");
                $("#paymentCard2").addClass("col-12");
                $("#paymentCard3").addClass("col-12");
                $("#paymentCard4").addClass("col-12");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

});

Template.paymentoverview.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if(Router.current().params.query.success){
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentOverview', function(error, result){
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
    getVS1Data('TARReport').then(function (dataObject) {
        if(dataObject.length == 0){
            paymentService.getOverviewARDetails().then(function (data) {
                let itemsAwaitingPaymentcount = [];
                let itemsOverduePaymentcount = [];
                let dataListAwaitingCust = {};
                let totAmount = 0;
                let totAmountOverDue = 0;
                let customerawaitingpaymentCount = '';
                for(let i=0; i<data.tarreport.length; i++){
                    dataListAwaitingCust = {
                        id: data.tarreport[i].ClientID || '',
                    };
                    if(data.tarreport[i].AmountDue != 0){
                        itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                        totAmount += Number(data.tarreport[i].AmountDue);
                        let date = new Date(data.tarreport[i].DueDate);
                        if (date < new Date()) {
                            itemsOverduePaymentcount.push(dataListAwaitingCust);
                            totAmountOverDue += Number(data.tarreport[i].AmountDue);
                        }
                    }

                }
                $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
                $('#custOverdue').text(itemsOverduePaymentcount.length);
                $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));


                //templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
            });
        }else{
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tarreport;
            let itemsAwaitingPaymentcount = [];
            let itemsOverduePaymentcount = [];
            let dataListAwaitingCust = {};
            let totAmount = 0;
            let totAmountOverDue = 0;
            let customerawaitingpaymentCount = '';
            for(let i=0; i<useData.length; i++){
                dataListAwaitingCust = {
                    id: useData[i].ClientID || '',
                };
                if(useData[i].AmountDue != 0){
                    itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                    totAmount += Number(useData[i].AmountDue);
                    let date = new Date(useData[i].DueDate);
                    if (date < new Date()) {
                        itemsOverduePaymentcount.push(dataListAwaitingCust);
                        totAmountOverDue += Number(useData[i].AmountDue);
                    }
                }

            }
            $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
            $('#custOverdue').text(itemsOverduePaymentcount.length);
            $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
            $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));

            //templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
        }
    }).catch(function (err) {
        paymentService.getOverviewARDetails().then(function (data) {
            let itemsAwaitingPaymentcount = [];
            let itemsOverduePaymentcount = [];
            let dataListAwaitingCust = {};
            let totAmount = 0;
            let totAmountOverDue = 0;
            let customerawaitingpaymentCount = '';
            for(let i=0; i<data.tarreport.length; i++){
                dataListAwaitingCust = {
                    id: data.tarreport[i].ClientID || '',
                };
                if(data.tarreport[i].AmountDue != 0){
                    itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                    totAmount += Number(data.tarreport[i].AmountDue);
                    let date = new Date(data.tarreport[i].DueDate);
                    if (date < new Date()) {
                        itemsOverduePaymentcount.push(dataListAwaitingCust);
                        totAmountOverDue += Number(data.tarreport[i].AmountDue);
                    }
                }

            }
            $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
            $('#custOverdue').text(itemsOverduePaymentcount.length);
            $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
            $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));


            //templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
        });
    });
    getVS1Data('TAPReport').then(function (dataObject) {
        if(dataObject.length == 0){
            paymentService.getOverviewAPDetails().then(function (data) {
                let itemsSuppAwaitingPaymentcount = [];
                let itemsSuppOverduePaymentcount = [];
                let dataListAwaitingSupp = {};
                let customerawaitingpaymentCount = '';
                let supptotAmount = 0;
                let supptotAmountOverDue = 0;
                for(let i=0; i<data.tapreport.length; i++){
                    dataListAwaitingSupp = {
                        id: data.tapreport[i].ClientID || '',
                    };
                    if(data.tapreport[i].AmountDue != 0){
                        // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                        supptotAmount += Number(data.tapreport[i].AmountDue);
                        itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                        let date = new Date(data.tapreport[i].DueDate);
                        if (date < new Date()) {
                            supptotAmountOverDue += Number(data.tapreport[i].AmountDue);
                            itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                        }
                    }

                }
                $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
                $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

                $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
                $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
                // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
            });
        }else{
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tapreport;
            let itemsSuppAwaitingPaymentcount = [];
            let itemsSuppOverduePaymentcount = [];
            let dataListAwaitingSupp = {};
            let customerawaitingpaymentCount = '';
            let supptotAmount = 0;
            let supptotAmountOverDue = 0;
            for(let i=0; i<useData.length; i++){
                dataListAwaitingSupp = {
                    id: useData[i].ClientID || '',
                };
                if(useData[i].AmountDue != 0){
                    // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                    supptotAmount += Number(useData[i].AmountDue);
                    itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                    let date = new Date(useData[i].DueDate);
                    if (date < new Date()) {
                        supptotAmountOverDue += Number(useData[i].AmountDue);
                        itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                    }
                }

            }
            $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
            $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

            $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
            $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
        }
    }).catch(function (err) {
        paymentService.getOverviewAPDetails().then(function (data) {
            let itemsSuppAwaitingPaymentcount = [];
            let itemsSuppOverduePaymentcount = [];
            let dataListAwaitingSupp = {};
            let customerawaitingpaymentCount = '';
            let supptotAmount = 0;
            let supptotAmountOverDue = 0;
            for(let i=0; i<data.tapreport.length; i++){
                dataListAwaitingSupp = {
                    id: data.tapreport[i].ClientID || '',
                };
                if(data.tapreport[i].AmountDue != 0){
                    // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                    supptotAmount += Number(data.tapreport[i].AmountDue);
                    itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                    let date = new Date(data.tapreport[i].DueDate);
                    if (date < new Date()) {
                        supptotAmountOverDue += Number(data.tapreport[i].AmountDue);
                        itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                    }
                }

            }
            $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
            $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

            $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
            $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
            // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
        });
    });




    // $('#tblPaymentOverview').DataTable();
    templateObject.getAllSalesOrderData = function () {
        getVS1Data('TPaymentList').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getTPaymentList(25,0).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};

                        addVS1Data('TPaymentList',JSON.stringify(data));

                    for(let i=0; i<data.tpaymentlist.length; i++){
                        let amount = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].PaymentAmount)|| 0.00;
                        let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].OpeningBalance) || 0.00;
                        let bankAccount = data.tpaymentlist[i].BankAccount;
                        if(bankAccount == "Accounts Receivable"){
                            bankAccount = "A/R";
                        }else if(bankAccount == "Accounts Payables"){
                            bankAccount = "A/P";
                        }
                        var dataList = {
                            id: data.tpaymentlist[i].PaymentID || '',
                            sortdate: data.tpaymentlist[i].PaymentDate !=''? moment(data.tpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tpaymentlist[i].PaymentDate,
                            paymentdate: data.tpaymentlist[i].PaymentDate !=''? moment(data.tpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tpaymentlist[i].PaymentDate,
                            customername: data.tpaymentlist[i].ClientName || '',
                            paymentamount: amount || 0.00,
                            openingbalance: openningBalance || 0.00,
                            // balance: balance || 0.00,
                            bankaccount: bankAccount || '',
                            department: data.tpaymentlist[i].Department || '',
                            refno: data.tpaymentlist[i].ReferenceNo || '',
                            receiptno: data.tpaymentlist[i].ReceiptNo || '',
                            jobname: data.tpaymentlist[i].jobname || '',
                            paymentmethod: data.tpaymentlist[i].PaymentMethod || '',
                            type: data.tpaymentlist[i].TYPE || '',
                            notes: data.tpaymentlist[i].Notes || ''
                        };
                        if(data.tpaymentlist[i].Deleted == false){
                            dataTableList.push(dataList);
                        }

                    }


                    //awaitingpaymentCount
                    templateObject.datatablerecords.set(dataTableList);
                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentOverview', function(error, result){
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
                        $('#tblPaymentOverview').DataTable({
                            // dom: 'lBfrtip',

                            "columnDefs" : [{"targets":0, "type":"date"}],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Payment List - "+ moment().format(),
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
                                    title: 'Payment Overview',
                                    filename: "Payment List - "+ moment().format(),
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
                            pageLength: 25,
                            searching: false,
                            lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#tblPaymentOverview').DataTable().ajax.reload();
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
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblPaymentOverview th');
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
                    $('#tblPaymentOverview tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        if((listData) && (transactiontype)){
                            if(transactiontype === 'Customer Payment' ){
                                Router.go('/paymentcard?id=' + listData);
                            }else if(transactiontype === 'Supplier Payment'){
                                Router.go('/supplierpaymentcard?id=' + listData);
                            }else{
                                Router.go('/paymentcard?id=' + listData);
                            }

                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentlist;
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<useData.length; i++){
                    let amount = utilityService.modifynegativeCurrencyFormat(useData[i].PaymentAmount)|| 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(useData[i].OpeningBalance) || 0.00;
                    let bankAccount = useData[i].BankAccount;
                    if(bankAccount == "Accounts Receivable"){
                        bankAccount = "A/R";
                    }else if(bankAccount == "Accounts Payables"){
                        bankAccount = "A/P";
                    }
                    var dataList = {
                        id: useData[i].PaymentID || '',
                        sortdate: useData[i].PaymentDate !=''? moment(useData[i].PaymentDate).format("YYYY/MM/DD"): useData[i].PaymentDate,
                        paymentdate: useData[i].PaymentDate !=''? moment(useData[i].PaymentDate).format("DD/MM/YYYY"): useData[i].PaymentDate,
                        customername: useData[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        openingbalance: openningBalance || 0.00,
                        // balance: balance || 0.00,
                        bankaccount: bankAccount || '',
                        department: useData[i].Department || '',
                        refno: useData[i].ReferenceNo || '',
                        receiptno: useData[i].ReceiptNo || '',
                        jobname: useData[i].jobname || '',
                        paymentmethod: useData[i].PaymentMethod || '',
                        type: useData[i].TYPE || '',
                        notes: useData[i].Notes || ''
                    };
                    if(useData[i].Deleted == false){
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentOverview', function(error, result){
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
                    $('#tblPaymentOverview').DataTable({
                        // dom: 'lBfrtip',
                        "columnDefs" : [{"targets":0, "type":"date"}],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Payment List - "+ moment().format(),
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
                                title: 'Payment Overview',
                                filename: "Payment List - "+ moment().format(),
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
                        pageLength: 25,
                        searching: false,
                        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblPaymentOverview').DataTable().ajax.reload();
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
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblPaymentOverview th');
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
                $('#tblPaymentOverview tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if((listData) && (transactiontype)){
                        if(transactiontype === 'Customer Payment' ){
                            Router.go('/paymentcard?id=' + listData);
                        }else if(transactiontype === 'Supplier Payment'){
                            Router.go('/supplierpaymentcard?id=' + listData);
                        }else{
                            Router.go('/paymentcard?id=' + listData);
                        }

                    }
                });
            }
        }).catch(function (err) {
            sideBarService.getTPaymentList(25,0).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                
                    addVS1Data('TPaymentList',JSON.stringify(data));

                for(let i=0; i<data.tpaymentlist.length; i++){
                    let amount = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].PaymentAmount)|| 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].OpeningBalance) || 0.00;
                    let bankAccount = data.tpaymentlist[i].BankAccount;
                    if(bankAccount == "Accounts Receivable"){
                        bankAccount = "A/R";
                    }else if(bankAccount == "Accounts Payables"){
                        bankAccount = "A/P";
                    }
                    // Currency+''+data.tpaymentlist[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: data.tpaymentlist[i].PaymentID || '',
                        sortdate: data.tpaymentlist[i].PaymentDate !=''? moment(data.tpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tpaymentlist[i].PaymentDate,
                        paymentdate: data.tpaymentlist[i].PaymentDate !=''? moment(data.tpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tpaymentlist[i].PaymentDate,
                        customername: data.tpaymentlist[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        openingbalance: openningBalance || 0.00,
                        // balance: balance || 0.00,
                        bankaccount: bankAccount || '',
                        department: data.tpaymentlist[i].Department || '',
                        refno: data.tpaymentlist[i].ReferenceNo || '',
                        receiptno: data.tpaymentlist[i].ReceiptNo || '',
                        jobname: data.tpaymentlist[i].jobname || '',
                        paymentmethod: data.tpaymentlist[i].PaymentMethod || '',
                        type: data.tpaymentlist[i].TYPE || '',
                        notes: data.tpaymentlist[i].Notes || ''
                    };
                    if(data.tpaymentlist[i].Deleted == false){
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPaymentOverview', function(error, result){
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
                    $('#tblPaymentOverview').DataTable({
                        // dom: 'lBfrtip',
                        "columnDefs" : [{"targets":0, "type":"date"}],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Payment List - "+ moment().format(),
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
                                title: 'Payment Overview',
                                filename: "Payment List - "+ moment().format(),
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
                        pageLength: 25,
                        searching: false,
                        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblPaymentOverview').DataTable().ajax.reload();
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
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblPaymentOverview th');
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
                $('#tblPaymentOverview tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if((listData) && (transactiontype)){
                        if(transactiontype === 'Customer Payment' ){
                            Router.go('/paymentcard?id=' + listData);
                        }else if(transactiontype === 'Supplier Payment'){
                            Router.go('/supplierpaymentcard?id=' + listData);
                        }else{
                            Router.go('/paymentcard?id=' + listData);
                        }

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


    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                //                alert("Matches");
                $("#paymentCard1").removeClass("col-auto");
                $("#paymentCard2").removeClass("col-auto");
                $("#paymentCard3").removeClass("col-auto");
                $("#paymentCard4").removeClass("col-auto");
                $("#paymentCard1").addClass("col-6");
                $("#paymentCard2").addClass("col-6");
                $("#paymentCard3").addClass("col-6");
                $("#paymentCard4").addClass("col-6");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 500);


});

Template.paymentoverview.events({
    'click #newSalesOrder' : function(event){
        Router.go('/salesordercard');
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
    'click .btnCustomerlist' : function(event){
        Router.go('/customerpayment');
    },
    'click #newInvoice' : function(event){
        Router.go('/invoicecard');
    },
    'click .btnSupplierPaymentList' : function(event){
        Router.go('/supplierpayment');
    },
    'click #newQuote' : function(event){
        Router.go('/quotecard');
    },
    'click .QuoteList' : function(event){
        Router.go('/quoteslist');
    },
    'click .btnPaymentSettings' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/paymentmethodSettings');
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

    'click .customerAwaitingPayment' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/agedreceivables');
    },
    'click .customerOverdue' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/agedreceivables');
    },
    'click .supplierAwaitingPayment' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/agedpayables');
    },
    'click .supplierOverdue' : function(event){
        $('.modal-backdrop').css('display','none');
        Router.go('/agedpayables');
    },

    'click .chkDatatable' : function(event){
        var columns = $('#tblPaymentOverview th');
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblPaymentOverview'});
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
        //let datatable =$('#tblPaymentOverview').DataTable();
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblPaymentOverview'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblPaymentOverview',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblPaymentOverview',published:true,
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

        var datable = $('#tblPaymentOverview').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblPaymentOverview th');
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
        var columns = $('#tblPaymentOverview th');

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
        jQuery('#tblPaymentOverview_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();


        sideBarService.getAllInvoiceList().then(function(data) {
            addVS1Data('TInvoiceEx',JSON.stringify(data)).then(function (datareturn) {
            }).catch(function (err) {

            });
        }).catch(function(err) {

        });
        sideBarService.getTCustomerPaymentList().then(function(data) {
            addVS1Data('TCustomerPayment',JSON.stringify(data)).then(function (datareturn) {
            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllPurchaseOrderListAll().then(function (data) {
            addVS1Data('TbillReport', JSON.stringify(data)).then(function (datareturn) {
                sideBarService.getTPaymentList().then(function(data) {
                    addVS1Data('TPaymentList',JSON.stringify(data)).then(function (datareturn) {
                        window.open('/paymentoverview','_self');
                    }).catch(function (err) {
                        window.open('/paymentoverview','_self');
                    });
                }).catch(function(err) {
                    window.open('/paymentoverview','_self');
                });
            }).catch(function (err) {
                window.open('/paymentoverview','_self');
            });
        }).catch(function (err) {
            window.open('/paymentoverview','_self');
        });

        sideBarService.getSalesListData().then(function(data) {
            addVS1Data('TSalesList',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });
    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblPaymentOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    }
    ,
    'click .openaccountpayable': function () {
        Router.go('/agedpayables');
    },
    'click .openaccountreceivable': function () {
        Router.go('/agedreceivables');
    },
    'click .btnPrinStatment': function () {
        Router.go('/statementlist');
    }




});
Template.paymentoverview.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.sortdate == 'NA') {
                return 1;
            }
            else if (b.sortdate == 'NA') {
                return -1;
            }
            return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblPaymentOverview'});
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
