import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';

Template.clienttypesettings.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);

    templateObject.departlist = new ReactiveVar([]);
});

Template.clienttypesettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'clienttypeList', function(error, result){
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

    templateObject.getAllEmployees = function () {

        taxRateService.getEmployees().then(function (data) {
            let employeeList = [];
            for (let i = 0; i < data.temployee.length; i++) {

                let dataObj = {
                    empID: data.temployee[i].Id || ' ',
                    employeename: data.temployee[i].EmployeeName || ' '
                };
                if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                    employeeList.push(dataObj);
                }
            }
            templateObject.employeerecords.set(employeeList);
        });
    };
    templateObject.getAllEmployees();

    templateObject.getTaxRates = function () {
        taxRateService.getClientType().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tclienttype.length; i++){
                // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                var dataList = {
                    id: data.tclienttype[i].Id || '',
                    typeName: data.tclienttype[i].TypeName || '-',
                    description: data.tclienttype[i].TypeDescription || '-',
                    status:data.tclienttype[i].Active || 'false',


                };

                dataTableList.push(dataList);
                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

                Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'clienttypeList', function(error, result){
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
            } else{
                console.log('Nothing');
            }

            $('.fullScreenSpin').css('display','none');
            setTimeout(function () {
                $('#clienttypeList').DataTable({
                    columnDefs: [
                        {type: 'date', targets: 0},
                        { "orderable": false, "targets": -1 }
                    ],
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "departmentlist_"+ moment().format(),
                            orientation:'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },{
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Client Type List',
                            filename: "departmentlist_"+ moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsRight: 1
                    },
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: 25,
                    lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],
                    action: function () {
                        $('#clienttypeList').DataTable().ajax.reload();
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

                // $('#clienttypeList').DataTable().column( 0 ).visible( true );
                $('.fullScreenSpin').css('display','none');
            }, 0);

            var columns = $('#clienttypeList th');
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
            swal({
                title: 'Something went wrong',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
    }
    templateObject.getTaxRates();


    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.clienttypeList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    $('#clienttypeList tbody').on( 'click', 'tr .colDeptID, tr .colHeadDept, tr .colDeptName, tr .colStatus, tr .colDescription, tr .colSiteCode', function () {
        var listData = $(this).closest('tr').attr('id');
        if(listData){
            $('#add-dept-title').text('Edit Client Type');
            if (listData !== '') {
                listData = Number(listData);
                taxRateService.getOneDepartment(listData).then(function (data) {

                    var deptID = data.fields.ID || '';
                    var headerDept = data.fields.DeptClassGroup || '';
                    var deptName = data.fields.DeptClassName || '';
                    var deptDesc = data.fields.Description || '';
                    var siteCode = data.fields.SiteCode || '';
                    //data.fields.Rate || '';


                    $('#edtDepartmentID').val(deptID);
                    //$('#sltDepartment').val(headerDept);
                    $('#edtDeptName').val(deptName);
                    $('#edtDeptName').prop('readonly', true);
                    $('#edtDeptDesc').val(deptDesc);
                    $('#edtSiteCode').val(siteCode);

                    if (data.fields.StSClass != null) {

                        var stsmaincontactno = data.fields.StSClass.fields.PrincipleContactPhone || '';
                        var licensenumber = data.fields.StSClass.fields.LicenseNumber || '';
                        var principlecontactname = data.fields.StSClass.fields.PrincipleContactName || '';
                        var defaultroomname = data.fields.StSClass.fields.DefaultBinLocation || '';

                        $('#stsMainContactNo').val(stsmaincontactno);
                        $('#stsLicenseNo').val(licensenumber);
                        $('#sltMainContact').val(principlecontactname);
                        $('#sltDefaultRoom').val(defaultroomname);
                    }

                });

                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.clienttypesettings.events({
    'click #btnNewInvoice':function(event){
        // Router.go('/invoicecard');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#clienttypeList th');
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'clienttypeList'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'clienttypeList'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'clienttypeList',published:true,
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
                                            PrefGroup:'salesform',PrefName:'clienttypeList',published:true,
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
        var datable = $('#clienttypeList').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#clienttypeList th');
        $.each(datable, function(i,v) {
            console.log(datable);
            if(v.innerText == columnDataValue){
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("."+replaceClass+"").css('width',range+'px');

            }
        });

    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        var columns = $('#clienttypeList th');
        // console.log(columns);
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
            console.log(sWidth);
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
        jQuery('#clienttypeList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .btnAddNewDepart': function () {
        $('#newTaxRate').css('display','block');

    },
    'click .btnCloseAddNewDept': function () {
        $('#newTaxRate').css('display','none');

    },
    'click .btnDeleteDepartment': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let deptId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TDeptClass",
            fields: {
                Id: deptId,
                Active: false
            }
        };

        taxRateService.saveDepartment(objDetails).then(function (objDetails) {
            Meteor._reload.reload();
        }).catch(function (err) {
            swal({
                title: 'Something went wrong',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
        });

    },
    'click .btnSaveDept': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let deptID = $('#edtDepartmentID').val();
        //let headerDept = $('#sltDepartment').val();
        let deptName = $('#edtDeptName').val();
        if (deptName === ''){
        swal('Client Type name cannot be blank!', '', 'warning');
        $('.fullScreenSpin').css('display','none');
        e.preventDefault();
        }

        let deptDesc = $('#edtDeptDesc').val();
        let siteCode = $('#edtSiteCode').val();
        let checkDeptID ='';
        let objDetails = '';
        let objStSDetails = null;

        if (isModuleGreenTrack) {

            let sltMainContact = $('#sltMainContact').val();
            let stsMainContactNo = $('#stsMainContactNo').val();
            let stsLicenseNo = $('#stsLicenseNo').val();
            let sltDefaultRoomName = $('#sltDefaultRoom').val();
            var newbinnum = $("#sltDefaultRoom").find('option:selected').attr('mytagroom');
            objStSDetails = {
                type: "TStSClass",
                fields: {
                    DefaultBinLocation: sltDefaultRoomName || '',
                    DefaultBinNumber: newbinnum || '',
                    LicenseNumber: stsLicenseNo || '',
                    PrincipleContactName: sltMainContact || '',
                    PrincipleContactPhone: stsMainContactNo || ''
                }
            }
        }

        if (deptName === ''){
            Bert.alert('<strong>WARNING:</strong> Client Type Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if(deptID == ""){

            taxRateService.checkDepartmentByName(deptName).then(function (data) {
                deptID = data.tdeptclass[0].Id;
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        ID: deptID||0,
                        Active: true,
                        //DeptClassGroup: headerDept,
                        //DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                    Meteor._reload.reload();
                }).catch(function (err) {
                    swal({
                        title: 'Something went wrong',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display','none');
                });

            }).catch(function (err) {
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        Active: true,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                    Meteor._reload.reload();
                }).catch(function (err) {
                    swal({
                        title: 'Something went wrong',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display','none');
                });
            });

        }else{
            objDetails = {
                type: "TDeptClass",
                fields: {
                    ID: deptID,
                    Active: true,
                    //  DeptClassGroup: headerDept,
                    DeptClassName: deptName,
                    Description: deptDesc,
                    SiteCode: siteCode,
                    StSClass: objStSDetails
                }
            };

            taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                Meteor._reload.reload();
            }).catch(function (err) {
                swal({
                    title: 'Something went wrong',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display','none');
            });
        }

        //console.log(objDetails);


    },
    'click .btnAddDept': function () {
        $('#add-dept-title').text('Add New Client Type');
        $('#edtDepartmentID').val('');
        $('#edtSiteCode').val('');

        $('#edtDeptName').val('');
        $('#edtDeptName').prop('readonly', false);
        $('#edtDeptDesc').val('');
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
    },
    'keydown #edtSiteCode, keyup #edtSiteCode': function(event){
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {

        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
            event.preventDefault();
        } else {
            //event.preventDefault();
        }

    },
    'blur #edtSiteCode': function(event){
        $(event.target).val($(event.target).val().toUpperCase());

    },
    'click .btnSaveRoom': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();

        var parentdept = $('#sltDepartmentList').val();
        var newroomname = $('#newRoomName').val();
        var newroomnum = $('#newRoomNum').val();


        let data = '';

        data = {
            type: "TProductBin",
            fields: {
                BinClassName: parentdept|| '',
                BinLocation: newroomname|| '',
                BinNumber: newroomnum|| ''
            }
        };

        console.log(data);

        taxRateService.saveRoom(data).then(function (data) {
            window.open('/clienttypesettings','_self');
        }).catch(function (err) {
            console.log(err);
            $('.fullScreenSpin').css('display','none');
        });
    },
});

Template.clienttypesettings.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.headDept == 'NA') {
                return 1;
            }
            else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'clienttypeList'});
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
                return 1;
            }
            else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b){
            if (a.roomname == 'NA') {
                return 1;
            }
            else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b){
            if (a.deptname == 'NA') {
                return 1;
            }
            else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
