import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import 'colresizable/colResizable-1.6.min';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');
Template.backuprestore.onCreated(() => {
  let templateObject = Template.instance();
  templateObject.restorerecords = new ReactiveVar();
});
Template.backuprestore.onRendered(function(){
  // $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let backupService = new TaxRateService();
  const restoreList = [];
  var erpGet = erpDb();
  let objDetails = {
      Name: "VS1_BackupList"
  };
  var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);
  backupService.pullBackupData(myString).then(function (objDetails) {
    let data = objDetails.ProcessLog.BackupList.Files;

    for (let i in data) {
      let segData = data[i].FileName.split('Backup_');
      let getDateTime = segData[1].replace('.7z', '') || '';
      let segGetDateTime = getDateTime.split('_');
      let getDataDate = segGetDateTime[0];
      let geDateTime = segGetDateTime[1].replace('-', ':');

      var dateFormat = new Date(getDataDate+':'+geDateTime);

      let getFormatValue = moment(dateFormat).format("ddd MMM D, YYYY, HH:mm:ss");
      //dateFormat.getDate() + " " + (dateFormat.getMonth() + 1) + "," + dateFormat.getFullYear();


        let recordObj = {
            filename: data[i].FileName || ' ',
            formateedname:getFormatValue||'',
            sortdatename:dateFormat||''
        };
        restoreList.push(recordObj);

    }
    templateObject.restorerecords.set(restoreList);
    $('.fullScreenSpin').css('display','none');
    // var myArrResponse = JSON.parse(objDetails);
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });



});
Template.backuprestore.events({
'click .btnRestore': function () {
  let backupService = new TaxRateService();
  var erpGet = erpDb();
  $('.fullScreenSpin').css('display','inline-block');
  let restorePoint = $('.sltRestorePoint').val();

  let objDetails = {
      Name: "VS1_DatabaseRestore",
      Params: {
        ArchiveName: restorePoint||''
    }
  };
  var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);
  backupService.restoreBackupData(myString).then(function (objDetails) {
    window.open('/backuprestore','_self');
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });
},'click .btnCreateBackup': function () {
  let backupService = new TaxRateService();
  $('.fullScreenSpin').css('display','inline-block');

  let objDetails = {
      Name: "VS1_DatabaseBackup"
  };
  var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);
  backupService.saveBackupData(myString).then(function (objDetails) {
    window.open('/backuprestore','_self');
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });
},
'click .btnBack':function(event){
  event.preventDefault();
  history.back();
},
'keydown .edtPortNo': function(event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (event.keyCode >= 35 && event.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }

    if (event.shiftKey == true) {
        event.preventDefault();
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 ||
        event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
        event.preventDefault();
    }
}
});
Template.backuprestore.helpers({
  restorerecords: () => {
      return Template.instance().restorerecords.get().sort((a, b) => {
  const aDate = new Date(a.sortdatename)
  const bDate = new Date(b.sortdatename)

  return bDate.getTime() - aDate.getTime()
});
  }
});
