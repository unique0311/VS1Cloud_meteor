import { Mongo } from 'meteor/mongo';

Template.simonpurchasedb.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.countryRegion = new ReactiveVar();
  templateObject.currenctRegion = new ReactiveVar();
  });

if (Meteor.isClient) {
Template.simonpurchasedb.events({
  'submit .addDatabaseForm' : function (event, template) {
   // alert(Random.id);
   $('.fullScreenSpin').css('display','inline-block');
   event.preventDefault();
   var firstname = event.target.fname.value;
   var lastname = event.target.lname.value;
   var company = event.target.cname.value;
   var phonenumber = event.target.phone.value;
   var country = event.target.country.value;

   let currentURLQuoteID = '';
   if(Router.current().params.quoteid){
     currentURLQuoteID = Router.current().params.quoteid;
   }
   // console.log(currentURL.quoteid);
   // Payment Info
   // var nameoncard = event.target.nameoncard.value;
   // var cardnumber = event.target.cardnumber.value;
    var expiredate = "11/30";
   // var ccv = event.target.ccv.value;

   var userEmail = event.target.email.value;

   var cloudpassword = event.target.password.value;
   var cloudconfirmpassword = event.target.confirmpassword.value;
   let getexpiredate = expiredate.split('/');
   let getMonth = getexpiredate[0]||0;
   let getYear = getexpiredate[1]||0;
   let licencelevel = 1;
   let paymentamount = 24;
   var url = window.location.href;
   if((url.indexOf('?package=') > 0) && (url.indexOf('itemtotal=') > 0)){
     // packageamount =
     var getpackagename = url.split('?package=');
     let currentpackagename = getpackagename[getpackagename.length-1].split("&");
     let packagename  = currentpackagename[0].replace(/%20/g, " ");
     if(packagename == 'simplebuynow'){
        licencelevel = 1;
     }else if(packagename == 'essentialsbuynow'){
        licencelevel = 2;
     }else if(packagename == 'plusbuynow'){
        licencelevel = 3;
     }else if(packagename == 'simpletrynow'){
        licencelevel = 1;
     }else if(packagename == 'essentialstrynow'){
        licencelevel = 2;
     }else if(packagename == 'plustrynow'){
        licencelevel = 3;
     };

     var getpaymentamount = url.split('itemtotal=');
     var currentpaymentamount = getpaymentamount[getpaymentamount.length-1].split('#')[0];
    paymentamount = parseFloat(currentpaymentamount)||0;
  };
   if(cloudpassword === cloudconfirmpassword){
   var cloudHashPassword = CryptoJS.MD5(cloudpassword).toString().toUpperCase();
    if(cloudpassword.length < 8) {
      // Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');
      // $('.CloudPassword').css('border-color','red');
      // $('.password').focus();
      $('.fullScreenSpin').css('display','none');
    }else{
      let objDetails = {
          Name: "VS1_NewRego",
          Params: {
          ClientName : company,
          CloudUserName : userEmail,
          CloudPassword:cloudpassword,
          FirstName:firstname,
          LastName:lastname,
          PhoneNumber:phonenumber,
          RegionName:country,
          CreditCardType:"Visa",
          CreditCardCardHolderName:company,
          CreditCardNumber:"4242424242424242",
          CreditCardNotes:'Magento Quote ID:'+currentURLQuoteID,
          CreditCardCVC:"567",
          CreditCardExpirymonth:11,
          CreditCardExpiryyear:25,
          Paymentamount:paymentamount,
          Paymethod:"Cash",
          // CreateNewDB:"T",
          LicenseLevel:parseInt(licencelevel)
          // LicenseLevelDesc:"Simple Start"
         }
      };

      var erpGet = erpDb();
  var oPost = new XMLHttpRequest();
  var serverIP = '192.168.1.19';
  var port = '88';
  oPost.open("POST",URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_NewRego"', true);
  oPost.setRequestHeader("database",vs1loggedDatatbase);
  oPost.setRequestHeader("username","VS1_Cloud_Admin");
  oPost.setRequestHeader("password","DptfGw83mFl1j&9");
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");
      // console.log(objDetails);
    var myString = JSON.stringify(objDetails);
    oPost.send(myString);
    //oPost.send(objDetails);
    //oPost.timeout = 30000;
    oPost.onreadystatechange = function() {

  if (oPost.readyState == 4 && oPost.status == 200) {

  var myArrResponse = JSON.parse(oPost.responseText);
  //console.log(myArrResponse);
  if(myArrResponse.ProcessLog.Error){
    // Bert.alert('Database Error<strong> :'+ myArrResponse.ProcessLog.Error+'</strong>', 'now-error');
    swal('Database Error', myArrResponse.ProcessLog.Error, 'error');
    $('.fullScreenSpin').css('display','none');
  }else{
    var databaseName = myArrResponse.ProcessLog.Databasename;

    // var emailAlreadyExist  = CloudUser.find({cloudEmail: userEmail}).fetch();
    // if (emailAlreadyExist.length > 0) {
    //   Bert.alert('<strong>Error:</strong> Email already registered!', 'warning');
    //   $('.fullScreenSpin').css('display','none');
    //  }else{
       CloudDatabase.insert({ server: serverIP,database:databaseName,username:userEmail.toLowerCase(),useremail:userEmail.toLowerCase(),password:cloudpassword,port:port,description:company,createdAt: new Date() }, function(err, idTag) {
         if (err) {
           $('.fullScreenSpin').css('display','none');
           //console.log("ALREADY FOUND TAG " + err);
         } else {
           //console.log("Creation of " + '192.168.1.50' + "in DB" + idTag);
           CloudUser.insert({ clouddatabaseID:idTag,cloudEmail:userEmail.toLowerCase(),cloudUsername:userEmail.toLowerCase(),cloudPassword:cloudpassword,cloudHashPassword:cloudHashPassword,server: serverIP,database:databaseName,username:userEmail,password:cloudpassword,port:port,userMultiLogon:false,createdAt: new Date() });
         }
       });

       localStorage.usremail = userEmail;
       localStorage.usrpassword = cloudpassword;
       let mailBodyNew = $('.emailBody').html();
       Meteor.call('sendEmail', {
           from: "VS1 Cloud <info@vs1cloud.com>",
           to: userEmail,
           cc: 'info@vs1cloud.com',
           subject: '[VS1 Cloud] - Account Creation',
           text: '',
           html:mailBodyNew,
           attachments : ''

       }, function (error, result) {

             setTimeout(function () {
               $('.fullScreenSpin').css('display','none');
             // window.open('/','_self');
             $('#myModal').modal('toggle');
           }, 50);

       });



    // Meteor.call('chargeCard2', stripeToken);

  }

  } else if(oPost.readyState == 4 && oPost.status == 403){
$('.fullScreenSpin').css('display','none');
swal({
title: 'Something went wrong',
text: oPost.getResponseHeader('errormessage'),
type: 'error',
showCancelButton: false,
confirmButtonText: 'Try Again'
}).then((result) => {
if (result.value) {

} else if (result.dismiss === 'cancel') {

}
});
  }else if(oPost.readyState == 4 && oPost.status == 406){
    $('.fullScreenSpin').css('display','none');
    var ErrorResponse = oPost.getResponseHeader('errormessage');
    var segError = ErrorResponse.split(':');

  if((segError[1]) == ' "Unable to lock object'){

    //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the customer form in ERP!', 'danger');
    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{
    //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

}else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');
  //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
}

  // AddUERP(oPost.responseText);
  }
    }


    }else{
      $('.fullScreenSpin').css('display','none');
      //Bert.alert('Error<strong> The specified passwords do no match.</strong>', 'danger');
      swal('Ooops...', 'The specified passwords do no match, Please try again!', 'error');
      $('.confirmpassword').focus();
    }

      //};
},
'click .btnLogin':    function(e) {
  window.open('/','_blank');
    },
    'blur #email' : function(event){
      let emailData = $(event.target).val().replace(/;/g, ",");
      $('#emEmail').html(emailData);
      function isEmailValid(emailData) {
          return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailData);
      };

      if(!isEmailValid(emailData)){
          // Bert.alert('<strong>WARNING:</strong> The email field must be a valid email address !', 'danger');
          // swal('Oops...', 'The email field must be a valid email address, please re-enter your email addres and try again!', 'error');
          // $('#email').val('');
          // $('#email').focus();
          e.preventDefault();
          return false;
      }
    },
    'blur #cname' : function(event){
      let companyName = $(event.target).val().replace(/;/g, ",");
      $('.emCompanyName').html("Welcome to VS1Cloud, "+companyName+ '!');
    },
    'blur #confirmpassword' : function(event){
      let cloudconfirmpassword = $(event.target).val().replace(/;/g, ",");
      let cloudpassword = $('#password').val().replace(/;/g, ",");
      if(cloudpassword === cloudconfirmpassword){
        $('#emPassword').html(cloudconfirmpassword);
      }else{
        //Bert.alert('Error<strong> The specified passwords do no match.</strong>', 'danger');
        swal('Oops...', 'The specified passwords does not match, please re-enter your password and try again!', 'error');
        //$('#password').focus();
        //$('#confirmpassword').focus();
        e.preventDefault();
        return false;
      }

    },
    'blur #password' : function(event){
      let cloudpassword = $(event.target).val().replace(/;/g, ",");
      if(cloudpassword.length < 8) {
              // Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
              swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');
              // $('#password').focus();
              e.preventDefault();
              return false;
      }

    },
    'click .btnReset' : function(event){
        // $('#myModal').modal('toggle');
              $('#fname').focus();

    }
});
}


Template.simonpurchasedb.onRendered( function() {
  const templateObject = Template.instance();

  let currentURL = Router.current().params.query;
  //console.log(currentURL.quoteid);
  if(currentURL.company){
    $('#cname').val(currentURL.company);
    $('.emCompanyName').html("Welcome to VS1Cloud, "+currentURL.company+ '!');
  };
   if(currentURL.firstname){
    $('#fname').val(currentURL.firstname);
  };
   if(currentURL.lastname){
    $('#lname').val(currentURL.lastname);
  };
   if(currentURL.phone){
    $('#phone').val(currentURL.phone);
  };
   if(currentURL.email){
    $('#email').val(currentURL.email);
  };
      $.get("https://ipinfo.io", function(response) {

      if(response.country === "AU"){
        templateObject.currenctRegion.set("Australia");
      }else if(response.country === "ZA"){
        templateObject.currenctRegion.set("South Africa");
      }else if(response.country === "USA"){
        templateObject.currenctRegion.set("United States");
      }else if(response.country === "MEX"){
        templateObject.currenctRegion.set("Mexico");
      }else if(response.country === "CAN"){
        templateObject.currenctRegion.set("Canada");
      }
      // setTimeout(function () {
      let currencyRegion = templateObject.currenctRegion.get();
      if(currencyRegion){
        $('#country').val(currencyRegion);
      };
       // }, 50);
    }, "jsonp");
        if (window.matchMedia('(max-width: 500px)').matches) {
             $( "#leftcol" ).removeClass( "col-12-narrow" );
             $( "#leftcol" ).addClass( "col-12" );

             $( "#rightcol" ).removeClass( "col-12-narrow" );
             $( "#rightcol" ).addClass( "col-12" );
        }


  $(document).on('click', '.btn_delete', function () {
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();
  if ( confirm( "Are you sure you want to delete? This is permanent." ) ) {
  CloudDatabase.remove({_id:id}, {server: serverIP,database:databaseName,username:userName,password:password,port:port,description:description});
  var usertoDelete = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){
  CloudUser.remove({_id:doc._id});
  });
  Bert.alert('<strong>Success:</strong> Server connection details for: <strong>'+databaseName+'</strong> successfully deleted!', 'success');
  $(this).closest('tr').remove();
      event.preventDefault();
      return false;
    }
  });

  $(document).on('click', '.btn_update', function () {
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var userEmail = $(this).closest('tr').find("[id=Useremail1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();
  var cloudPassword = $(this).closest('tr').find("[id=CloudPassword1]").val();
  var cloudHashPassword = CryptoJS.MD5(cloudPassword).toString().toUpperCase();
  CloudDatabase.update({_id:id}, {server: serverIP,database:databaseName,username:userName,useremail:userEmail,password:password,port:port,description:description}, function(err, idTag) {
    if(err){
      //console.log("ALREADY FOUND TAG " + err);
    }else{
      var queryList = [];
      var usertoUpdate = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){

      if(doc.cloudEmail == userEmail){
        if(cloudPassword != ''){
        if(doc.cloudPassword != cloudPassword ){
          CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,cloudPassword:cloudPassword,cloudHashPassword:cloudHashPassword,password:password,port:port,userMultiLogon:false}});
        }
      }else{
        CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,password:password,port:port,userMultiLogon:false}});
      }
      }else{
        CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,password:password,port:port,userMultiLogon:false}});
      }

      });
      //CloudUser.update({clouddatabaseID:id}, {cloudEmail:userEmail,cloudUsername:userName, cloudPassword:password,server: serverIP,database:databaseName,username:userName,password:password,port:port});
    }
   });
  Bert.alert('<strong>Success:</strong> Server connection details successfully updated for <strong>'+databaseName+'</strong>!', 'success');
      event.preventDefault();
    //  return false;

  });

  $(document).on('click', '.btn_test', function () {
    $('.fullScreenSpin').css('display','inline-block');
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();

  var usertoReset = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){
  // CloudUser.remove({_id:doc._id});
  CloudUser.update({_id: doc._id},{ $set: {userMultiLogon: false}});
  });
  // Bert.alert('Testing connection to: <strong>'+databaseName+'</strong>', 'success');
//alert('Connected to: '+setup.database);
var serverTest = URLRequest + serverIP + ':' + port + '/erpapi/TERPSysInfo';
//alert(serverTest);
var oReq = new XMLHttpRequest();
oReq.open("GET",serverTest, true);
oReq.setRequestHeader("database",databaseName);
oReq.setRequestHeader("username",userName);
oReq.setRequestHeader("password",password);
//oReq.AddHeader("Access-Control-Allow-Credentials","true");
/*
oReq.onload = function(){
  alert('here');
  // do some stuff
  var ErrorMessage = oReq.getResponseHeader('content-type');
  alert(ErrorMessage);
};
*/
oReq.send();


oReq.timeout = 30000;
oReq.onreadystatechange = function() {
//alert(oReq.responseText);
  if (oReq.readyState == 4 && oReq.status == 200) {
   // alert(oReq.responseText);
    //document.getElementById("result").innerHTML = oReq.responseText;
    $('#isnotokayres').css('display','none');
    $('#isokay').css('display','block');
    document.getElementById("isokay").innerHTML = 'Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Pass </b>';
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isokay').css('display','none');
    }, 3500);

  } else if(oReq.statusText == '') {
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');

    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
      document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);
    //document.getElementById("result").innerHTML = 'Connection Timeout: Please check that your servers IP address and port is correct.';
  }else if(oReq.readyState == 4 && oReq.status == 403){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
       document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
      document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);
    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else if(oReq.readyState == 4 && oReq.status == 406){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
    document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);
    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else if(oReq.readyState == 4 && oReq.status == 500){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
    document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);
    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else{
    $('.fullScreenSpin').css('display','none');
  }
//alert(oReq.getResponseHeader('error'));
AddUERP(oReq.responseText);
}

  });

$(document).ready(function() {
  $('.CloudPassword').keyup(function() {

  }).focus(function() {
      // focus code here
  }).blur(function() {
    var pswd = $(this).val();
    // var checkPassword= '/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/';
    if(pswd.length < 8) {
    Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at <b>least eight characters</b> including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
    $('.CloudPassword').css('border-color','red');
    }else {
        //validate capital letter
        if(pswd.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)) {
          $('.CloudPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
        } else {
          Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
          $('.CloudPassword').css('border-color','red');
        }

    }
    // $('.CloudPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
      // blur code here
  });

  $('#expdate').keyup(function() {
    var expiryValue = $(this).val();
    let operationValue = '';
    if(expiryValue.length === 2) {
      operationValue= expiryValue+'/';
      $('#expdate').val(operationValue);
    }

  }).focus(function() {
    $(this).select();
  }).blur(function() {

  }).keydown(function() {
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
      event.keyCode == 46 || event.keyCode == 190) {
      } else {
          event.preventDefault();
      }
  });
});

/*
var getRegionOptions = URLRequest + "192.168.1.100" + ':' + "88" + '/erpapi/TRegionalOptions?PropertyList="CountryName, Region, CurrencySymbol, RegionAbbreviation"';
let regionOptions = [];
var oReq = new XMLHttpRequest();
oReq.open("GET",getRegionOptions, true);
oReq.setRequestHeader("database","vs1_cloud");
oReq.setRequestHeader("username","VS1_Cloud_Admin");
oReq.setRequestHeader("password","DptfGw83mFl1j&9");

oReq.send();


// oReq.timeout = 50000;
oReq.onreadystatechange = function() {
//alert(oReq.responseText);
  if (oReq.readyState == 4 && oReq.status == 200) {
    var data = JSON.parse(oReq.responseText);
    for (let i = 0; i < data.tregionaloptions.length; i++) {
        regionOptions.push(data.tregionaloptions[i].Region)
    }
    regionOptions = _.sortBy(regionOptions);
    templateObject.countryRegion.set(regionOptions);

  } else if(oReq.statusText == '') {

    //document.getElementById("result").innerHTML = 'Connection Timeout: Please check that your servers IP address and port is correct.';
  }else if(oReq.readyState == 4 && oReq.status == 403){

    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else if(oReq.readyState == 4 && oReq.status == 406){

    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else if(oReq.readyState == 4 && oReq.status == 500){

    //document.getElementById("result").innerHTML = oReq.getResponseHeader('errormessage');
  }else{

  }
}
*/
});

Template.simonpurchasedb.helpers({

  regionOptions: () => {
      return Template.instance().countryRegion.get();
  },
  currentRegions: () => {
    return Template.instance().currenctRegion.get();
  }

  });
