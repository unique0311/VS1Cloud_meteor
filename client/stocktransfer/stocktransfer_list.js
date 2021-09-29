//
//
//
import {StockTransferService} from "../stocktransfer/stocktransfer-service";
import {ReactiveVar} from "meteor/reactive-var";





Template.stocktransferlist.onCreated(function () {
  const templateObject = Template.instance();
      templateObject.records = new ReactiveVar([]);
      templateObject.allCount = new ReactiveVar();
      templateObject.salesorderRecords = new ReactiveVar({});
      templateObject.allSalesOrdersData = new ReactiveVar([]);

});

Template.stocktransferlist.onRendered(function () {
  let templateObject = Template.instance();
  let stockTransferService = new StockTransferService();
  let table;
  var splashArray = new Array();
  $('.fullScreenSpin').css('display','inline-block');
  templateObject.getStockTransfers = function () {
  stockTransferService.getAllStockTransferEntry().then(function(data){
  let records = [];
  let lineItemObj = {};


  for(let i=0; i<data.tstocktransferentry.length; i++){
     let recordObj = {};
     let deleteOption = data.tstocktransferentry[i].deleted;
/*
     recordObj.id = data.tstocktransferentry[i].Id;
     recordObj.active = data.tstocktransferentry[i].Deleted;
    recordObj.dataArr = [
        // data.tstockadjustentry[i].Id || '',
        data.tstocktransferentry[i].Id || '',
        data.tstocktransferentry[i].AccountName || '',
        data.tstocktransferentry[i].Employee || '',
        data.tstocktransferentry[i].Description || '',
        data.tstocktransferentry[i].DateTransferred !=''? moment(data.tstocktransferentry[i].DateTransferred).format("DD-MM-YYYY"): data.tstocktransferentry[i].DateTransferred,
        data.tstocktransferentry[i].Notes || '',

    ];
    records.push(recordObj);
    */
    //if(deleteOption === false){
    var dataList = [data.tstocktransferentry[i].Id || '',
    data.tstocktransferentry[i].AccountName || '',
    data.tstocktransferentry[i].EmployeeName || '',
    data.tstocktransferentry[i].Description || '',
    data.tstocktransferentry[i].CreationDate !=''? moment(data.tstocktransferentry[i].CreationDate).format("DD-MM-YYYY"): data.tstocktransferentry[i].CreationDate,
    data.tstocktransferentry[i].DateTransferred !=''? moment(data.tstocktransferentry[i].DateTransferred).format("DD-MM-YYYY"): data.tstocktransferentry[i].DateTransferred,
    data.tstocktransferentry[i].Notes || '',
    data.tstocktransferentry[i].Processed == false ? '<input type="checkbox" class="select-invoice-draft disable-click-event">' : data.tstocktransferentry[i].Processed || data.tstocktransferentry[i].Processed == true ? '<input type="checkbox" checked="checked" class="select-invoice-draft disable-click-event" >' : data.tstocktransferentry[i].Processed
    // data.tstockadjustentry[i].ClientName || '',

    ];

    //lineItems.push(lineItemObj);
    splashArray.push(dataList);
  //}
    //records.push(lineItemObj);
    //arrayformid.push(lineItemObj.lineID)


  }
  localStorage.setItem('VS1StockTransferList', JSON.stringify(splashArray));
  table = $('#stocktransfer_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1StockTransferList')),
    processing: true,
    paging: true,
    columnDefs: [
        { orderable: false, targets: 0 },
        { targets: 7, className: "text-center" }
    ],
    colReorder: true,
    colReorder: {
        fixedColumnsLeft: 1
    },
    bStateSave: true,
    scrollX: 1000,
    rowId: 0,
    pageLength: 100,
    lengthMenu: [ [100, -1], [100, "All"] ],
    info: true,
    responsive: true
    // "dom": '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();
  $('#stocktransfer_list tbody').on( 'click', 'tr', function () {
      //var listData = table.row( this ).id();
      var listData = $(this).closest('tr').attr('id');

      if(listData){
        window.open('/stocktransfercard?id=' + listData,'_self');
      }
  });
// templateObject.records.set(records);
  //templateObject.salesorderRecords.set(lineItems);
  //templateObject.employeeformID.set(arrayformid);
  //templateObject.erpAccessLevelRecord.set(lineItems);

$('.fullScreenSpin').css('display','none');
});

};

if (!localStorage.getItem('VS1StockTransferList')) {
   templateObject.getStockTransfers();
}else{
  table = $('#stocktransfer_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1StockTransferList')),
    processing: true,
    paging: true,
    columnDefs: [
        { orderable: false, targets: 0 }
    ],
    colReorder: true,
    colReorder: {
        fixedColumnsLeft: 1
    },
    bStateSave: true,
    scrollX: 1000,
    rowId: 0,
    pageLength: 100,
    lengthMenu: [ [100, -1], [100, "All"] ],
    info: true,
    responsive: true
    // "dom": '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();
  $('#stocktransfer_list tbody').on( 'click', 'tr', function () {
      //var listData = table.row( this ).id();
      var listData = $(this).closest('tr').attr('id');

      //for(let i=0 ; i<splashArray.length ;i++){
      if(listData){
        window.open('/stocktransfercard?id=' + listData,'_self');
      }
      //}
  });


$('.fullScreenSpin').css('display','none');

}
  //let tableSalesOrder;

   // table.column(0).visible(false);
});

Template.stocktransferlist.helpers({
  records: () => {
      return Template.instance().records.get();
  },
  // salesorderRecords: () => {
  //     return Template.instance().allSalesOrdersData.get();
  // }
  });

  Template.stocktransferlist.events({
    'click #refreshpagelist': function(event){
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1StockTransferList', '');
        Meteor._reload.reload();
        let templateObject = Template.instance();
         templateObject.getStockTransfers();
    },
    'click .disable-click-event':function (event) {

        // event.stopPropagation();
    }
    });
