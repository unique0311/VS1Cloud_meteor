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
Template.quoteslist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.quoteslist.onRendered(function() {
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
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblquotelist', function(error, result){
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
        window.open('/quoteslist?page=last','_self');
    }

    templateObject.getAllQuoteData = function () {
        getVS1Data('TQuote').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllQuoteList(initialDataLoad,0).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    addVS1Data('TQuote',JSON.stringify(data));
                    for(let i=0; i<data.tquoteex.length; i++){
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalAmount)|| 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalTax) || 0.00;
                        // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalAmountInc)|| 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalPaid)|| 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalBalance)|| 0.00;
                        var dataList = {
                            id: data.tquoteex[i].fields.ID || '',
                            employee:data.tquoteex[i].fields.EmployeeName || '',
                            sortdate: data.tquoteex[i].fields.SaleDate !=''? moment(data.tquoteex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tquoteex[i].fields.SaleDate,
                            saledate: data.tquoteex[i].fields.SaleDate !=''? moment(data.tquoteex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tquoteex[i].fields.SaleDate,
                            duedate: data.tquoteex[i].fields.DueDate !=''? moment(data.tquoteex[i].fields.DueDate).format("DD/MM/YYYY"): data.tquoteex[i].fields.DueDate,
                            customername: data.tquoteex[i].fields.CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tquoteex[i].fields.SalesStatus || '',
                            custfield1: data.tquoteex[i].fields.SaleCustField1 || '',
                            custfield2: data.tquoteex[i].fields.SaleCustField2 || '',
                            comments: data.tquoteex[i].fields.Comments || '',
                        };
                        if(data.tquoteex[i].fields.CustomerName != ''){
                            dataTableList.push(dataList);
                        }

                        // splashArray.push(dataList);
                        //}
                    }
                    templateObject.datatablerecords.set(dataTableList);
                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblquotelist', function(error, result){
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
                        $('#tblquotelist').DataTable({
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
                                    filename: "Quote List - "+ moment().format(),
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
                                    title: 'Quote List',
                                    filename: "Quote List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            searching: true,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            action: function () {
                                $('#tblquotelist').DataTable().ajax.reload();
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

                        // $('#tblquotelist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblquotelist th');
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
                    $('#tblquotelist tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if(listData){
                            FlowRouter.go('/quotecard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tquoteex;

                let lineItems = [];
                let lineItemObj = {};
                $('.fullScreenSpin').css('display','none');
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
                    if(useData[i].fields.CustomerName != ''){
                        dataTableList.push(dataList);
                    }

                    // splashArray.push(dataList);
                    //}
                }
                templateObject.datatablerecords.set(dataTableList);
                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblquotelist', function(error, result){
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
                    $('#tblquotelist').DataTable({
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
                                filename: "Quote List - "+ moment().format(),
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
                                title: 'Quote List',
                                filename: "Quote List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        searching: true,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        action: function () {
                            $('#tblquotelist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblquotelist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < 100){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }
                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;

                             sideBarService.getAllQuoteList(100,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TQuote').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tquoteex), dataOld.tquoteex);
                                   let objCombineData = {
                                     tquoteex:thirdaryData
                                   }


                                     addVS1Data('TQuote',JSON.stringify(objCombineData)).then(function (datareturn) {
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
                  if(settings.fnRecordsDisplay() > 150){
                    $('.paginate_button.page-item.next').addClass('disabled');
                    $('.fullScreenSpin').css('display','none');
                  }else{
                  sideBarService.getAllQuoteList('All',1).then(function(dataNonBo) {

                    addVS1Data('TQuote',JSON.stringify(dataNonBo)).then(function (datareturn) {
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
                    sideBarService.getAllQuoteList(dataLenght,0).then(function(dataNonBo) {

                      addVS1Data('TQuote',JSON.stringify(dataNonBo)).then(function (datareturn) {
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

                    // $('#tblquotelist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblquotelist th');
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
                $('#tblquotelist tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if(listData){
                        FlowRouter.go('/quotecard?id=' + listData);
                    }
                });
            }
        }).catch(function (err) {
          sideBarService.getAllQuoteList(initialDataLoad,0).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              addVS1Data('TQuote',JSON.stringify(data));
              for(let i=0; i<data.tquoteex.length; i++){
                  let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalAmount)|| 0.00;
                  let totalTax = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalTax) || 0.00;
                  // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                  let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalAmountInc)|| 0.00;
                  let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalPaid)|| 0.00;
                  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tquoteex[i].fields.TotalBalance)|| 0.00;
                  var dataList = {
                      id: data.tquoteex[i].fields.ID || '',
                      employee:data.tquoteex[i].fields.EmployeeName || '',
                      sortdate: data.tquoteex[i].fields.SaleDate !=''? moment(data.tquoteex[i].fields.SaleDate).format("YYYY/MM/DD"): data.tquoteex[i].fields.SaleDate,
                      saledate: data.tquoteex[i].fields.SaleDate !=''? moment(data.tquoteex[i].fields.SaleDate).format("DD/MM/YYYY"): data.tquoteex[i].fields.SaleDate,
                      duedate: data.tquoteex[i].fields.DueDate !=''? moment(data.tquoteex[i].fields.DueDate).format("DD/MM/YYYY"): data.tquoteex[i].fields.DueDate,
                      customername: data.tquoteex[i].fields.CustomerName || '',
                      totalamountex: totalAmountEx || 0.00,
                      totaltax: totalTax || 0.00,
                      totalamount: totalAmount || 0.00,
                      totalpaid: totalPaid || 0.00,
                      totaloustanding: totalOutstanding || 0.00,
                      salestatus: data.tquoteex[i].fields.SalesStatus || '',
                      custfield1: data.tquoteex[i].fields.SaleCustField1 || '',
                      custfield2: data.tquoteex[i].fields.SaleCustField2 || '',
                      comments: data.tquoteex[i].fields.Comments || '',
                  };
                  if(data.tquoteex[i].fields.CustomerName != ''){
                      dataTableList.push(dataList);
                  }

                  // splashArray.push(dataList);
                  //}
              }
              templateObject.datatablerecords.set(dataTableList);
              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblquotelist', function(error, result){
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
                  $('#tblquotelist').DataTable({
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
                              filename: "Quote List - "+ moment().format(),
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
                              title: 'Quote List',
                              filename: "Quote List - "+ moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: initialDatatableLoad,
                      searching: true,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      action: function () {
                          $('#tblquotelist').DataTable().ajax.reload();
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

                  // $('#tblquotelist').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#tblquotelist th');
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
              $('#tblquotelist tbody').on( 'click', 'tr', function () {
                  var listData = $(this).closest('tr').attr('id');
                  if(listData){
                      FlowRouter.go('/quotecard?id=' + listData);
                  }
              });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        });
    }

    templateObject.getAllQuoteData();

    $('#tblquotelist tbody').on( 'click', 'tr', function () {
        //var listData = table.row( this ).id();
        var listData = $(this).closest('tr').attr('id');

        //for(let i=0 ; i<splashArray.length ;i++){
        if(listData){
            FlowRouter.go('/quotecard?id=' + listData);
        }
        //}
    });

});



Template.quoteslist.helpers({
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
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblquotelist'});
    }

});

Template.quoteslist.events({
    'click #btnNewQuote':function(event){
        FlowRouter.go('/quotecard');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblquotelist th');
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblquotelist'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblquotelist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblquotelist',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblquotelist',published:true,
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
        var datable = $('#tblquotelist').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblquotelist th');
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
        var columns = $('#tblquotelist th');

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
        jQuery('#tblquotelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblquotelist_wrapper .dt-buttons .btntabletopdf').click();
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
        sideBarService.getAllQuoteList(initialDataLoad,0).then(function(data) {
            addVS1Data('TQuote',JSON.stringify(data)).then(function (datareturn) {
                window.open('/quoteslist','_self');
            }).catch(function (err) {
                window.open('/quoteslist','_self');
            });
        }).catch(function(err) {
            window.open('/quoteslist','_self');
        });
    }



});
