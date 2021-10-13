import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {ProductService } from "../product/product-service";
import {PurchaseBoardService} from '../js/purchase-service';
import '../lib/global/indexdbstorage.js';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import {Random} from 'meteor/random';
import 'jquery-editable-select';
const _ = require('lodash');
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.stocktransfercard.onCreated(function(){
  const templateObject = Template.instance();
    templateObject.includeInvoiceAttachment = new ReactiveVar();
    templateObject.includeInvoiceAttachment.set(false);
    templateObject.includeDocketAttachment = new ReactiveVar();
    templateObject.includeDocketAttachment.set(false);

    templateObject.includeIsPrintInvoice = new ReactiveVar();
    templateObject.includeIsPrintInvoice.set(false);
    templateObject.includeIsPrintDocket = new ReactiveVar();
    templateObject.includeIsPrintDocket.set(false);
    templateObject.includeBothPrint = new ReactiveVar();
    templateObject.hasPrintPrint = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    templateObject.stocktransferrecord = new ReactiveVar({});
    templateObject.shipviarecords = new ReactiveVar();
});

Template.stocktransfercard.onRendered(function() {
  var erpGet = erpDb();
var url = window.location.href;
var getsale_id = url.split('?id=');
var salesID = FlowRouter.current().queryParams.id;
let clientsService = new PurchaseBoardService();
$('.fullScreenSpin').css('display','inline-block');
const templateObject = Template.instance();
let printDeliveryDocket = Session.get('CloudPrintDeliveryDocket');
let printInvoice = Session.get('CloudPrintInvoice');
const records = [];
const viarecords = [];

$("#date-input,#dtShipDate,#dtDueDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    constrainInput: false,
    dateFormat: 'd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
});

setTimeout(function () {
    $('.fullScreenSpin').css('display','none');
}, 3000);

templateObject.getAllClients = function() {
    clientsService.getSupplierVS1().then(function(data) {
        for (let i in data.tsuppliervs1) {

            let supplierrecordObj = {
                supplierid: data.tsuppliervs1[i].Id || ' ',
                suppliername: data.tsuppliervs1[i].ClientName || ' ',
                supplieremail: data.tsuppliervs1[i].Email || ' ',
                street: data.tsuppliervs1[i].Street || ' ',
                street2: data.tsuppliervs1[i].Street2 || ' ',
                street3: data.tsuppliervs1[i].Street3 || ' ',
                suburb: data.tsuppliervs1[i].Suburb || ' ',
                statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                country: data.tsuppliervs1[i].Country || ' '
            };

            clientList.push(supplierrecordObj);

            $('#edtSupplierName').editableSelect('add', data.tsuppliervs1[i].ClientName);
        }
        templateObject.clientrecords.set(clientList);


    });
};

var url = FlowRouter.current().path;
if (url.indexOf('?id=') > 0) {
    var getso_id = url.split('?id=');
    var currentBill = getso_id[getso_id.length - 1];
    if (getso_id[1]) {
        currentBill = parseInt(currentBill);
    $('.fullScreenSpin').css('display', 'none');
    }

} else {
    $('.fullScreenSpin').css('display', 'none');


    let lineItems = [];
    let lineItemsTable = [];
    let lineItemObj = {};

    //for (let i = 0; i < 2; i++) {
        lineItemObj = {
            lineID: Random.id(),
            item: '',
            accountname: '',
            accountno: '',
            memo: '',
            creditex: '',
            debitex: '',
            taxCode: ''
        };
        lineItems.push(lineItemObj);
    //}
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let record = {
        id: '',
        lid: 'New Stock Transfer',
        accountname: '',
        memo: '',
        department: defaultDept,
        entryno: '',
        transdate: begunDate,
        LineItems: lineItems,
        isReconciled: false

    };
    setTimeout(function() {
        $('#sltDepartment').val(defaultDept);
    }, 200);
    templateObject.stocktransferrecord.set(record);

}

if (FlowRouter.current().queryParams.id) {

} else {
    setTimeout(function() {
        $('#edtCustomerName').trigger("click");
    }, 200);
}

templateObject.getShpVias = function() {
    getVS1Data('TShippingMethod').then(function(dataObject) {
        if (dataObject.length == 0) {
            sideBarService.getShippingMethodData().then(function(data) {
              addVS1Data('TShippingMethod',JSON.stringify(data));
                for (let i in data.tshippingmethod) {

                    let viarecordObj = {
                        shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.shipviarecords.set(viarecords);

                }
            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tshippingmethod;
            for (let i in useData) {

                let viarecordObj = {
                    shippingmethod: useData[i].ShippingMethod || ' ',
                };

                viarecords.push(viarecordObj);

                templateObject.shipviarecords.set(viarecords);

            }

        }
    }).catch(function(err) {

        sideBarService.getShippingMethodData().then(function(data) {
          addVS1Data('TShippingMethod',JSON.stringify(data));

            for (let i in data.tshippingmethod) {

                let viarecordObj = {
                    shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                };

                viarecords.push(viarecordObj);
                templateObject.shipviarecords.set(viarecords);

            }
        });
    });

}
templateObject.getShpVias();


$(document).ready(function() {
    $('#sltDepartment').editableSelect();
    $('#edtCustomerName').editableSelect();
});

$(document).on("click", "#departmentList tbody tr", function(e) {
    $('#sltDepartment').val($(this).find(".colDeptName").text());
    $('#departmentModal').modal('toggle');
});


$('#edtCustomerName').editableSelect()
    .on('click.editable-select', function(e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        $('#edtCustomerPOPID').val('');
        var customerDataName = e.target.value || '';
        // alert(customerDataName);
        // var customerDataID = $('#edtCustomerName').attr('custid').replace(/\s/g, '') || '';
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#customerListModal').modal();
            setTimeout(function() {
                $('#tblCustomerlist_filter .form-control-sm').focus();
                $('#tblCustomerlist_filter .form-control-sm').val('');
                $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblCustomerlist').DataTable();
                //datatable.clear();
                //datatable.rows.add(splashArrayCustomerList);
                datatable.draw();
                $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
            }, 500);
        } else {
            if (customerDataName.replace(/\s/g, '') != '') {
                //FlowRouter.go('/customerscard?name=' + e.target.value);
                $('#edtCustomerPOPID').val('');
                getVS1Data('TCustomerVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            $('#add-customer-title').text('Edit Customer');
                            let popCustomerID = data.tcustomer[0].fields.ID || '';
                            let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                            let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                            let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                            let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                            let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                            let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                            let popCustomertfn = '' || '';
                            let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                            let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                            let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                            let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                            let popCustomerURL = data.tcustomer[0].fields.URL || '';
                            let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                            let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                            let popCustomerState = data.tcustomer[0].fields.State || '';
                            let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                            let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                            let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                            let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                            let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                            let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                            let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                            let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                            let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                            let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                            let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                            let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                            let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                            let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                            let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                            let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                            let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                            let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                            let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                            let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                            let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                            let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                            $('#edtCustomerCompany').val(popCustomerName);
                            $('#edtCustomerPOPID').val(popCustomerID);
                            $('#edtCustomerPOPEmail').val(popCustomerEmail);
                            $('#edtTitle').val(popCustomerTitle);
                            $('#edtFirstName').val(popCustomerFirstName);
                            $('#edtMiddleName').val(popCustomerMiddleName);
                            $('#edtLastName').val(popCustomerLastName);
                            $('#edtCustomerPhone').val(popCustomerPhone);
                            $('#edtCustomerMobile').val(popCustomerMobile);
                            $('#edtCustomerFax').val(popCustomerFaxnumber);
                            $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                            $('#edtCustomerWebsite').val(popCustomerURL);
                            $('#edtCustomerShippingAddress').val(popCustomerStreet);
                            $('#edtCustomerShippingCity').val(popCustomerStreet2);
                            $('#edtCustomerShippingState').val(popCustomerState);
                            $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                            $('#sedtCountry').val(popCustomerCountry);
                            $('#txaNotes').val(popCustomernotes);
                            $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                            $('#sltTermsPOP').val(popCustomerterms);
                            $('#sltCustomerType').val(popCustomerType);
                            $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                            $('#edtCustomeField1').val(popCustomercustfield1);
                            $('#edtCustomeField2').val(popCustomercustfield2);
                            $('#edtCustomeField3').val(popCustomercustfield3);
                            $('#edtCustomeField4').val(popCustomercustfield4);

                            $('#sltTaxCode').val(popCustomerTaxCode);

                            if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                $('#chkSameAsShipping2').attr("checked", "checked");
                            }

                            if (data.tcustomer[0].fields.IsSupplier == true) {
                                // $('#isformcontractor')
                                $('#chkSameAsSupplier').attr("checked", "checked");
                            } else {
                                $('#chkSameAsSupplier').removeAttr("checked");
                            }

                            setTimeout(function() {
                                $('#addCustomerModal').modal('show');
                            }, 200);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcustomervs1;

                        var added = false;
                        for (let i = 0; i < data.tcustomervs1.length; i++) {
                            if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                                let lineItems = [];
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                                let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                                let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                                let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                                let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                                let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                                let popCustomerState = data.tcustomervs1[i].fields.State || '';
                                let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                                let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtCustomerPOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                    (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                    (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addCustomerModal').modal('show');
                                }, 200);

                            }
                        }
                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomer[0].fields.ID || '';
                                let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                let popCustomerState = data.tcustomer[0].fields.State || '';
                                let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtCustomerPOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                    (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                    (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomer[0].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addCustomerModal').modal('show');
                                }, 200);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        $('#add-customer-title').text('Edit Customer');
                        let popCustomerID = data.tcustomer[0].fields.ID || '';
                        let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                        let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                        let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                        let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                        let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                        let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                        let popCustomertfn = '' || '';
                        let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                        let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                        let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                        let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                        let popCustomerURL = data.tcustomer[0].fields.URL || '';
                        let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                        let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                        let popCustomerState = data.tcustomer[0].fields.State || '';
                        let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                        let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                        let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                        let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                        let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                        let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                        let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                        let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                        let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                        let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                        let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                        let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                        let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                        let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                        let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                        let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                        let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                        let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                        let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                        let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                        let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                        let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                        $('#edtCustomerCompany').val(popCustomerName);
                        $('#edtCustomerPOPID').val(popCustomerID);
                        $('#edtCustomerPOPEmail').val(popCustomerEmail);
                        $('#edtTitle').val(popCustomerTitle);
                        $('#edtFirstName').val(popCustomerFirstName);
                        $('#edtMiddleName').val(popCustomerMiddleName);
                        $('#edtLastName').val(popCustomerLastName);
                        $('#edtCustomerPhone').val(popCustomerPhone);
                        $('#edtCustomerMobile').val(popCustomerMobile);
                        $('#edtCustomerFax').val(popCustomerFaxnumber);
                        $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                        $('#edtCustomerWebsite').val(popCustomerURL);
                        $('#edtCustomerShippingAddress').val(popCustomerStreet);
                        $('#edtCustomerShippingCity').val(popCustomerStreet2);
                        $('#edtCustomerShippingState').val(popCustomerState);
                        $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                        $('#sedtCountry').val(popCustomerCountry);
                        $('#txaNotes').val(popCustomernotes);
                        $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                        $('#sltTermsPOP').val(popCustomerterms);
                        $('#sltCustomerType').val(popCustomerType);
                        $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                        $('#edtCustomeField1').val(popCustomercustfield1);
                        $('#edtCustomeField2').val(popCustomercustfield2);
                        $('#edtCustomeField3').val(popCustomercustfield3);
                        $('#edtCustomeField4').val(popCustomercustfield4);

                        $('#sltTaxCode').val(popCustomerTaxCode);

                        if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                            (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                            (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                            $('#chkSameAsShipping2').attr("checked", "checked");
                        }

                        if (data.tcustomer[0].fields.IsSupplier == true) {
                            // $('#isformcontractor')
                            $('#chkSameAsSupplier').attr("checked", "checked");
                        } else {
                            $('#chkSameAsSupplier').removeAttr("checked");
                        }

                        setTimeout(function() {
                            $('#addCustomerModal').modal('show');
                        }, 200);
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
            } else {
                $('#customerListModal').modal();
                setTimeout(function() {
                    $('#tblCustomerlist_filter .form-control-sm').focus();
                    $('#tblCustomerlist_filter .form-control-sm').val('');
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblCustomerlist').DataTable();
                    //datatable.clear();
                    //datatable.rows.add(splashArrayCustomerList);
                    datatable.draw();
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                }, 500);
            }
        }


    });

    /* On click Customer List */
    $(document).on("click", "#tblCustomerlist tbody tr", function(e) {

        var tableCustomer = $(this);
        $('#edtCustomerName').val(tableCustomer.find(".colCompany").text());
        $('#edtCustomerName').attr("custid", tableCustomer.find(".colID").text());
        $('#customerListModal').modal('toggle');

        $('#edtCustomerEmail').val(tableCustomer.find(".colEmail").text());
        $('#edtCustomerEmail').attr('customerid', tableCustomer.find(".colID").text());
        $('#edtCustomerName').attr('custid', tableCustomer.find(".colID").text());
        $('#edtCustomerEmail').attr('customerfirstname', tableCustomer.find(".colCustomerFirstName").text());
        $('#edtCustomerEmail').attr('customerlastname', tableCustomer.find(".colCustomerLastName").text());

        let postalAddress = tableCustomer.find(".colCompany").text() + '\n' + tableCustomer.find(".colStreetAddress").text() + '\n' + tableCustomer.find(".colCity").text() + ' ' + tableCustomer.find(".colState").text() + ' ' + tableCustomer.find(".colZipCode").text() + '\n' + tableCustomer.find(".colCountry").text();
        $('#txaShipingInfo').val(postalAddress);

        $('#tblCustomerlist_filter .form-control-sm').val('');
        setTimeout(function() {
            //$('#tblCustomerlist_filter .form-control-sm').focus();
            $('.btnRefreshCustomer').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
        // }
    });
});

Template.stocktransfercard.events({
  'click #sltDepartment': function(event) {
      $('#departmentModal').modal('toggle');
  },
  'click .lineProductName, keydown .lineProductName': function(event) {
      var $earch = $(event.currentTarget);
      var offset = $earch.offset();
      let customername = $('#edtCustomerName').val();
      if (customername === '') {
          swal('Customer has not been selected!', '', 'warning');
          event.preventDefault();
      } else {
          var productDataName = $(event.target).val() || '';
          if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
              $('#productListModal').modal('toggle');
              var targetID = $(event.target).closest('tr').attr('id');
              $('#selectLineID').val(targetID);
              setTimeout(function() {
                  $('#tblInventory_filter .form-control-sm').focus();
                  $('#tblInventory_filter .form-control-sm').val('');
                  $('#tblInventory_filter .form-control-sm').trigger("input");

                  var datatable = $('#tblInventory').DataTable();
                  datatable.draw();
                  $('#tblInventory_filter .form-control-sm').trigger("input");

              }, 500);
          } else {
              if (productDataName.replace(/\s/g, '') != '') {
                  //FlowRouter.go('/productview?prodname=' +  $(event.target).text());
                  let lineExtaSellItems = [];
                  let lineExtaSellObj = {};
                  $('.fullScreenSpin').css('display', 'inline-block');
                  getVS1Data('TProductVS1').then(function(dataObject) {
                      if (dataObject.length == 0) {
                          sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                              $('.fullScreenSpin').css('display', 'none');
                              let lineItems = [];
                              let lineItemObj = {};
                              let currencySymbol = Currency;
                              let totalquantity = 0;
                              let productname = data.tproduct[0].fields.ProductName || '';
                              let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                              let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                              let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                              let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                              let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                              let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                              let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                              let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                              let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                              let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                              let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                              let active = data.tproduct[0].fields.Active;
                              let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                              let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                              let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                              let barcode = data.tproduct[0].fields.BARCODE || '';
                              $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                              $('#add-product-title').text('Edit Product');
                              $('#edtproductname').val(productname);
                              $('#edtsellqty1price').val(sellqty1price);
                              $('#txasalesdescription').val(salesdescription);
                              $('#sltsalesacount').val(incomeaccount);
                              $('#slttaxcodesales').val(taxcodesales);
                              $('#edtbarcode').val(barcode);
                              $('#txapurchasedescription').val(purchasedescription);
                              $('#sltcogsaccount').val(cogsaccount);
                              $('#slttaxcodepurchase').val(taxcodepurchase);
                              $('#edtbuyqty1cost').val(buyqty1cost);

                              setTimeout(function() {
                                  $('#newProductModal').modal('show');
                              }, 500);
                          }).catch(function(err) {

                              $('.fullScreenSpin').css('display', 'none');
                          });
                      } else {
                          let data = JSON.parse(dataObject[0].data);
                          let useData = data.tproductvs1;
                          var added = false;

                          for (let i = 0; i < data.tproductvs1.length; i++) {
                              if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                  added = true;
                                  $('.fullScreenSpin').css('display', 'none');
                                  let lineItems = [];
                                  let lineItemObj = {};
                                  let currencySymbol = Currency;
                                  let totalquantity = 0;

                                  let productname = data.tproductvs1[i].fields.ProductName || '';
                                  let productcode = data.tproductvs1[i].fields.PRODUCTCODE || '';
                                  let productprintName = data.tproductvs1[i].fields.ProductPrintName || '';
                                  let assetaccount = data.tproductvs1[i].fields.AssetAccount || '';
                                  let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost) || 0;
                                  let cogsaccount = data.tproductvs1[i].fields.CogsAccount || '';
                                  let taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase || '';
                                  let purchasedescription = data.tproductvs1[i].fields.PurchaseDescription || '';
                                  let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price) || 0;
                                  let incomeaccount = data.tproductvs1[i].fields.IncomeAccount || '';
                                  let taxcodesales = data.tproductvs1[i].fields.TaxCodeSales || '';
                                  let salesdescription = data.tproductvs1[i].fields.SalesDescription || '';
                                  let active = data.tproductvs1[i].fields.Active;
                                  let lockextrasell = data.tproductvs1[i].fields.LockExtraSell || '';
                                  let customfield1 = data.tproductvs1[i].fields.CUSTFLD1 || '';
                                  let customfield2 = data.tproductvs1[i].fields.CUSTFLD2 || '';
                                  let barcode = data.tproductvs1[i].fields.BARCODE || '';
                                  $("#selectProductID").val(data.tproductvs1[i].fields.ID).trigger("change");
                                  $('#add-product-title').text('Edit Product');
                                  $('#edtproductname').val(productname);
                                  $('#edtsellqty1price').val(sellqty1price);
                                  $('#txasalesdescription').val(salesdescription);
                                  $('#sltsalesacount').val(incomeaccount);
                                  $('#slttaxcodesales').val(taxcodesales);
                                  $('#edtbarcode').val(barcode);
                                  $('#txapurchasedescription').val(purchasedescription);
                                  $('#sltcogsaccount').val(cogsaccount);
                                  $('#slttaxcodepurchase').val(taxcodepurchase);
                                  $('#edtbuyqty1cost').val(buyqty1cost);

                                  setTimeout(function() {
                                      $('#newProductModal').modal('show');
                                  }, 500);
                              }
                          }
                          if (!added) {
                              sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                  $('.fullScreenSpin').css('display', 'none');
                                  let lineItems = [];
                                  let lineItemObj = {};
                                  let currencySymbol = Currency;
                                  let totalquantity = 0;
                                  let productname = data.tproduct[0].fields.ProductName || '';
                                  let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                  let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                  let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                  let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                  let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                  let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                  let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                  let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                  let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                  let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                  let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                  let active = data.tproduct[0].fields.Active;
                                  let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                  let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                  let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                  let barcode = data.tproduct[0].fields.BARCODE || '';
                                  $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                  $('#add-product-title').text('Edit Product');
                                  $('#edtproductname').val(productname);
                                  $('#edtsellqty1price').val(sellqty1price);
                                  $('#txasalesdescription').val(salesdescription);
                                  $('#sltsalesacount').val(incomeaccount);
                                  $('#slttaxcodesales').val(taxcodesales);
                                  $('#edtbarcode').val(barcode);
                                  $('#txapurchasedescription').val(purchasedescription);
                                  $('#sltcogsaccount').val(cogsaccount);
                                  $('#slttaxcodepurchase').val(taxcodepurchase);
                                  $('#edtbuyqty1cost').val(buyqty1cost);

                                  setTimeout(function() {
                                      $('#newProductModal').modal('show');
                                  }, 500);
                              }).catch(function(err) {

                                  $('.fullScreenSpin').css('display', 'none');
                              });
                          }
                      }
                  }).catch(function(err) {

                      sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                          $('.fullScreenSpin').css('display', 'none');
                          let lineItems = [];
                          let lineItemObj = {};
                          let currencySymbol = Currency;
                          let totalquantity = 0;
                          let productname = data.tproduct[0].fields.ProductName || '';
                          let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                          let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                          let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                          let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                          let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                          let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                          let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                          let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                          let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                          let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                          let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                          let active = data.tproduct[0].fields.Active;
                          let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                          let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                          let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                          let barcode = data.tproduct[0].fields.BARCODE || '';
                          $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                          $('#add-product-title').text('Edit Product');
                          $('#edtproductname').val(productname);
                          $('#edtsellqty1price').val(sellqty1price);
                          $('#txasalesdescription').val(salesdescription);
                          $('#sltsalesacount').val(incomeaccount);
                          $('#slttaxcodesales').val(taxcodesales);
                          $('#edtbarcode').val(barcode);
                          $('#txapurchasedescription').val(purchasedescription);
                          $('#sltcogsaccount').val(cogsaccount);
                          $('#slttaxcodepurchase').val(taxcodepurchase);
                          $('#edtbuyqty1cost').val(buyqty1cost);

                          setTimeout(function() {
                              $('#newProductModal').modal('show');
                          }, 500);
                      }).catch(function(err) {

                          $('.fullScreenSpin').css('display', 'none');
                      });

                  });
              } else {
                  $('#productListModal').modal('toggle');
                  var targetID = $(event.target).closest('tr').attr('id');
                  $('#selectLineID').val(targetID);
                  setTimeout(function() {
                      $('#tblInventory_filter .form-control-sm').focus();
                      $('#tblInventory_filter .form-control-sm').val('');
                      $('#tblInventory_filter .form-control-sm').trigger("input");

                      var datatable = $('#tblInventory').DataTable();
                      datatable.draw();
                      $('#tblInventory_filter .form-control-sm').trigger("input");

                  }, 500);
              }

          }
      }
  },
  'click #includeInvoiceAttachment': function (e) {
    let templateObject = Template.instance();
    if ($('#includeInvoiceAttachment').prop('checked')) {
        templateObject.includeInvoiceAttachment.set(true);
        $(".btnprintDockets").attr("data-toggle", "modal");
        $(".btnprintDockets").attr("data-target", "#print-dockets");
        $(".btnprintDockets").attr("data-dismiss", "modal");
    } else {
        templateObject.includeInvoiceAttachment.set(false);
        let isInvoice = templateObject.includeInvoiceAttachment.get();
        let isShippingDocket = templateObject.includeDocketAttachment.get();
        if(!(isInvoice) && !(isShippingDocket) ){
          $(".btnprintDockets").removeAttr("data-toggle");
          $(".btnprintDockets").removeAttr("data-target");
          $(".btnprintDockets").removeAttr("data-dismiss");
        }
    }
},
'click #includeDocketAttachment': function (e) {
    let templateObject = Template.instance();

    if ($('#includeDocketAttachment').prop('checked')) {
        templateObject.includeDocketAttachment.set(true);
        $(".btnprintDockets").attr("data-toggle", "modal");
        $(".btnprintDockets").attr("data-target", "#print-dockets");
        $(".btnprintDockets").attr("data-dismiss", "modal");
    } else {
        templateObject.includeDocketAttachment.set(false);
        let isInvoice = templateObject.includeInvoiceAttachment.get();
        let isShippingDocket = templateObject.includeDocketAttachment.get();
        if(!(isInvoice) && !(isShippingDocket) ){
          $(".btnprintDockets").removeAttr("data-toggle");
          $(".btnprintDockets").removeAttr("data-target");
          $(".btnprintDockets").removeAttr("data-dismiss");
        }

    }
},
'click .btnprintDockets':function(e){

 let invoiceID = parseInt($("#SalesId").val());
 let templateObject = Template.instance();
 let isInvoice = templateObject.includeInvoiceAttachment.get();
 let isShippingDocket = templateObject.includeDocketAttachment.get();

  if(invoiceID){
    if((isInvoice) && (isShippingDocket)){
      let templateObject = Template.instance();
      let printType = "InvoiceANDDeliveryDocket";
      templateObject.SendShippingDetails(printType);

    }
    if((isInvoice) && !(isShippingDocket)){
      let templateObject = Template.instance();
      let printType = "InvoiceOnly";
      templateObject.SendShippingDetails(printType);
  }
  if((isShippingDocket) && !(isInvoice) ){
    let templateObject = Template.instance();
    let printType = "DeliveryDocketsOnly";
    templateObject.SendShippingDetails(printType);
  }
  }

},
'click .btnprintInvoice':function(e){
let templateObject = Template.instance();
let printType = "InvoiceOnly";
templateObject.SendShippingDetails(printType);
},
'click .btnprintDelDocket':function(e){
let templateObject = Template.instance();
let printType = "DeliveryDocketsOnly";
templateObject.SendShippingDetails(printType);
},
'click #printDockets':function(e){
const templateObject = Template.instance();
},
'click .btnBack': function(event) {
    event.preventDefault();
    history.back(1);


}
});

Template.stocktransfercard.helpers({
  isPrintInvoice: () => {
      return Template.instance().includeIsPrintInvoice.get();
  },
  isPrintDeliveryDocket: () => {
      return Template.instance().includeIsPrintDocket.get();
  },
  includeBothPrint: () => {
      return Template.instance().includeBothPrint.get();
  },
  hasPrintPrint: () => {
      return Template.instance().hasPrintPrint.get();
  },
  stocktransferrecord: () => {
      return Template.instance().stocktransferrecord.get();
  },
  shipviarecords: () => {
      return Template.instance().shipviarecords.get().sort(function(a, b) {
          if (a.shippingmethod == 'NA') {
              return 1;
          } else if (b.shippingmethod == 'NA') {
              return -1;
          }
          return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
      });
  }
});
