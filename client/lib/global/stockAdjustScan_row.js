addScannedAdjustRow = function () {
  var $componentTB = $("#tblStockAdjust"),
        $firstTRCopy = $componentTB.children('tr').first().clone(),
      click_count = 0;

$(document).on('click', 'a.send_new', function () {
  event.stopPropagation();

  var barcode = $('input[name="prodBarcode"]').val();
 if(barcode != ''){
 var erpGetProd = erpDb();
 var oProdBarcodeReq = new XMLHttpRequest();
 oProdBarcodeReq.open("GET",URLRequest + erpGetProd.ERPIPAddress + ':' + erpGetProd.ERPPort + '/' + erpGetProd.ERPApi + '/' + erpGetProd.ERPProductBarcode+ '&select=[BARCODE]="'+barcode+'" ' , true);
 oProdBarcodeReq.setRequestHeader("database",erpGetProd.ERPDatabase);
 oProdBarcodeReq.setRequestHeader("username",erpGetProd.ERPUsername);
 oProdBarcodeReq.setRequestHeader("password",erpGetProd.ERPPassword);
 oProdBarcodeReq.send();
 oProdBarcodeReq.timeout = 30000;

 oProdBarcodeReq.onreadystatechange = function() {
 if (oProdBarcodeReq.readyState == 4 && oProdBarcodeReq.status == 200) {
 var dataListProd = JSON.parse(oProdBarcodeReq.responseText)
 for (var event in dataListProd) {
   var dataCopyP = dataListProd[event];
   for (var dataP in dataCopyP) {
     var mainDataP = dataCopyP[dataP];
 //var dataListProd = [mainDataP.Id, mainDataP.ProductName];
 var productName = mainDataP.ProductName;
 click_count++;
 //for (var i = 0; i < rowCount; i++) {
 var $clones 	= $('#tblStockAdjust tbody>tr'),
          num 		= $clones.size() + 1,
          next_num 	= parseInt($clones.last().find('input[name^="prod_id"]').val()) + 1,
          //POJob_num 	= ($clones.last().find('input[name^="POJobno"]').val()),
         // PODepartment_num 	= ($clones.last().find('input[name^="PODepartment"]').val()),
         // job_name 	= ($clones.last().find('input[name^="POJobname"]').val()),
         // NonPoJob_name 	= ($clones.last().find('input[name^="jobname"]').val()),
       //   NonPoJob_No 	= ($clones.last().find('select[name^="jobno"]').val()),
       $template 	= $clones.first(),
       newSection 	= $template.clone().attr('id', 'pq_entry_'+num),
       prod_id 	= 'prod_id_'+num,
       ProdName = 'ProdName_'+num,
       productdesc = 'productdesc_'+num,
       productname = 'productname_'+num,
       department = 'department_'+num,
       uom = 'uom_'+num,
       barcode = 'barcode_'+num,
       instock = 'instock_'+num,
       available = 'available_'+num,
       final = 'final_'+num,
       adjust = 'adjust_'+num,
       departmentID = '#department_'+num;

       //TotalAmt = 'TotalAmt_'+num;
       //department = 'department_'+num;
       //PODepartment = 'PODepartment_'+num;
       //person_lname = 'person_lname_'+num;
     //  $componentTB.append($firstTRCopy.clone());

     newSection.removeAttr('data-saved');
     newSection.find('input[type="text"]').val('');
     newSection.find('input[name^="prod_id"]').attr({
     'name': prod_id
   }).val(next_num);

   newSection.find('input[name^="productdesc_1"]').attr({
   'name': productdesc
   }).val('');

   newSection.find('input[name^="barcode_1"]').attr({
   'name': barcode
   }).val('');

   newSection.find('input[name^="instock_1"]').attr({
   'name': instock
   }).val('');

   newSection.find('input[name^="available_1"]').attr({
   'name': available
   }).val('');

   newSection.find('input[name^="final_1"]').attr({
   'name': final
   }).val('');

   newSection.find('input[name^="adjust_1"]').attr({
   'name': adjust
   }).val('');


   newSection.find('select[name^="ProdName"]').attr({
     'name': ProdName
   }).val('');



   newSection.find('select[name^="department_1"]').attr({
   'name': department
   }).val('');

   newSection.find('select[id^="department_1"]').attr({
   'id': department
   }).val('');

   newSection.find('select[name^="uom"]').attr({
     'name': uom
   }).val('');

    $('#tblStockAdjust').append(newSection);
     // }
      $('input[name="'+adjust+'"]').keydown(function (event) {


                  if (event.shiftKey == true) {
                      event.preventDefault();
                  }

                  if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

                  } else {
                      event.preventDefault();
                  }

                  if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                      event.preventDefault();

              });




              var $tblrows = $("#tblStockAdjust tbody tr");
              $tblrows.each(function (index) {
                  var $tblrow = $(this);
                  $tblrow.find('.prodSelect').on('change', function () {
                    var itemVal =  $(this).val();
                    var Segs = itemVal.split(',');
                    //var AccTaxCode = Segs[1];
                    var ProdDesc = Segs[1];
                    var ProdBarcode = Segs[2];
                    var ProdName = Segs[0];
                    var erpGet = erpDb();

                    $('input[name="'+available+'"]').val('0');
                   $('input[name="'+productdesc+'"]').val(ProdDesc);
                  // $('input[name="'+adjust+'"]').val('1');
                    // alert(itemVal);
                    $('input[name="'+barcode+'"]').val(ProdBarcode);
                    var oReq = new XMLHttpRequest();

                    oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPProductClassQuantityList + '&select=[ProductName]="'+ProdName+'"and [DepartmentName]="Default"' , true);
                    //oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPPOCard + '/' + ProdName, true);
                    oReq.setRequestHeader("database",erpGet.ERPDatabase);
                    oReq.setRequestHeader("username",erpGet.ERPUsername);
                    oReq.setRequestHeader("password",erpGet.ERPPassword);
                    oReq.send();

                    oReq.timeout = 30000;
                    //alert('1');
                    oReq.onreadystatechange = function() {
                    if (oReq.readyState == 4 && oReq.status == 200) {
                      var dataListRet2 = JSON.parse(oReq.responseText);

                      for (var event in dataListRet2) {
                        var dataCopy2 = dataListRet2[event];
                        for (var data2 in dataCopy2) {
                          var mainData2 = dataCopy2[data2];
                          //alert(mainData2.EmployeeName);
                         // department = mainData2.DeptName;
                          quantity = mainData2.AvailableQty;
                          inStockQty = mainData2.InStockQty;


                        }
                      }

                      $('input[name="'+instock+'"]').val(inStockQty);
                     $('input[name="'+available+'"]').val(quantity);
                     $('input[name="'+final+'"]').val(inStockQty);
                       $('input[name="'+adjust+'"]').val('1');
                       var adjustment = 1;
                       //alert(qty);
                      // var availableQty = $tblrow.find("[id=instock]").val();
                       var sumTotal = parseInt(adjustment) + parseInt(inStockQty);
                       if (!isNaN(sumTotal)) {

                       $('input[name="'+final+'"]').val(sumTotal);


                      }

                       //alert(quantity);

                   /* var dataListRet = oReq.responseText;
                    //var id = '';
                    var obj = $.parseJSON(dataListRet);
                    $.each(obj, function() {
                  AvailQty = this['DeptName'];
                  alert(AvailQty);
                  //product = this['Lines'];

                  });
   */
                  AddUERP(oReq.responseText);
                    }
                    }
                    //$('input[name="'+unitPriceN+'"]').val(ProdPrice);
                   // $('input[name="'+TotalAmtN+'"]').val(Amount);
                    //$('#LineTaxTotal_1').append('<option value="ADJ" selected="selected">'+AccTaxCode+'</option>');
                    $('select[name="'+department+'"] option[value="Default"]').prop('selected', true);
                   //  $('select[name="'+uomN+'"] option: eq(1)').prop('selected', true);
                     $('select[name='+uom+'] option[value="Units"]').prop('selected', true);




                 });

                  $tblrow.find('.AdjustQty').on('change', function () {
                    var adjust = $tblrow.find("[id=adjust]").val();
                    //alert(qty);
                    var availableQty = $tblrow.find("[id=instock]").val();
                    var sumTotal = parseInt(adjust) + parseInt(availableQty);
                    if (!isNaN(sumTotal)) {

                   $tblrow.find('.finalQty').val(sumTotal);


                   }


                 });

              });




              $('select[name="'+ProdName+'"] option').filter(function() {
                return this.text == productName;
              }).attr('selected', true).trigger("change");

                $('input[name="'+adjust+'"]').val('1').trigger("change");

              //  $('#tblStockAdjust tbody tr').each(function() {

                  //  if ($(this).find('td:empty').length) $(this).remove();
              //  });


 //var prodDesc = mainDataP.SalesDescription;
 //var prodPrice = mainDataP.SellQty1Price;
 //var Id = mainDataP.Id;

 }
 }

   }
 }
}
//alert(prodName);
    //$('#component_tb tbody>tr:last').clone(true).insertAfter('#component_tb tbody>tr:last');
  //  var rowCount = $('#component_tb tbody>tr').length;

    //alert(num);
    $('input[name="prodBarcode"]').val('');
  });



/*

    $('#tblStockAdjust  tbody').on('change', 'select', function (e) {

      var x = document.getElementById("tblStockAdjust");
      var DeptName =  $(this).val();
      var tblrows2 = $("#tblStockAdjust tbody tr");
      //var Segs2 = itemVal2.split(',');
      //var AccTaxCode = Segs[1];

      var erpGet2 = erpDb();
       //alert(itemVal2);
          if (x != null) {

              for (var i = 0; i < x.rows.length; i++) {

                  for (var j = 0; j < x.rows[i].cells.length; j++)

                      x.rows[i].cells[5].onclick = function () {

                        var cnt = i;
                      //alert('here 3');
                        var instock2N ="instock_"+cnt;
                        var available2N ="available_"+cnt;
                        var final2N ="final_"+cnt;
                        var prodNameN ="ProdName_"+cnt;


                        return function() {

                  $('input[name="'+available2N+'"]').val('0');
                  var productName = $('select[name=' + prodNameN + ']').val();
                  //$("#ProdName").val();
                  var Segs3 = productName.split(',');
                  var ProdName2 = Segs3[0];
                //  alert(ProdName2);
                 var oReqDept = new XMLHttpRequest();

                 oReqDept.open("GET",URLRequest + erpGet2.ERPIPAddress + ':' + erpGet2.ERPPort + '/' + erpGet2.ERPApi + '/' + erpGet2.ERPProductClassQuantityList + '&select=[ProductName]="'+ProdName2+'"and [DepartmentName]="'+DeptName+'"' , true);
                 //oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPPOCard + '/' + ProdName, true);
                 oReqDept.setRequestHeader("database",erpGet2.ERPDatabase);
                 oReqDept.setRequestHeader("username",erpGet2.ERPUsername);
                 oReqDept.setRequestHeader("password",erpGet2.ERPPassword);
                 oReqDept.send();

                 oReqDept.timeout = 30000;
                 //alert('1');
                 oReqDept.onreadystatechange = function() {
                 if (oReqDept.readyState == 4 && oReqDept.status == 200) {
                   var dataListRet3 = JSON.parse(oReqDept.responseText);
                     var quantity2 = '';
                     var inStockQty2 = '';
                   for (var event2 in dataListRet3) {
                     var dataCopy3 = dataListRet3[event2];
                     for (var data3 in dataCopy3) {
                       var mainData3 = dataCopy3[data3];
                       quantity2 = mainData3.AvailableQty;
                       inStockQty2 = mainData3.InStockQty;

                     }
                   }
                  if(quantity2 == ''){
                    $('input[name="'+available2N+'"]').val('0');
                 }else{
                    $('input[name="'+available2N+'"]').val(quantity2);
                  }
                   $('input[name="'+instock2N+'"]').val(inStockQty2);
                   $('input[name="'+final2N+'"]').val(inStockQty2);

               AddUERP(oReqDept.responseText);
                 }
                 }



                }
                      }(i);

              }

          }



      e.preventDefault();
    });

*/

};
