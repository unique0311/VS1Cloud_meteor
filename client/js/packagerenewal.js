import {Mongo} from 'meteor/mongo';

Template.packagerenewal.onCreated(function() {
  //const templateObject = Template.instance();
  Meteor.call('sendEmail', {
      from: "VS1 Cloud <info@vs1cloud.com>",
      to: 'rasheed@trueerp.com',
      // cc: 'info@vs1cloud.com',
      subject: '[VS1 Cloud] - Licence Renewal',
      text: "Test Render",
      html:'',
      attachments : ''

  }, function (error, result) {

  });
});


Template.packagerenewal.onRendered(function() {
  const templateObject = Template.instance();

  let currentURL = Router.current().params.query;
  Meteor.call('magentoAWSProfileRenewal', function(error, result) {
    if (error) {
      // console.log(error);
    } else {
      if (result) {
        // console.log(result);
        let valueData = result.items;
        for (let j in valueData) {
          if (valueData[j].status == "active") {
            if (valueData[j].created_at.split(' ')[0] != valueData[j].last_order_date.split(' ')[0]) {
              var currentDate = new Date();
              var renewCurrentDate = moment(currentDate).format("YYYY-MM-DD");
              let lastOrderDate = valueData[j].last_order_date.split(' ')[0];
              // console.log(lastOrderDate);
              let customerEmail = valueData[j].customer_email;
              let paymentMethod = valueData[j].payment_method;
              let paymentAmount = valueData[j].regular_subtotal;
              // $('#emEmail').html(currentURL.emailakey);
              // $('#emPassword').html(currentURL.passkey);
    if (lastOrderDate === renewCurrentDate) {
              let objDetails = {
                Name: "VS1_Renew",
                Params: {
                  CloudUserName: customerEmail,
                  // CloudPassword: "Pass@123",
                  Paymentamount: parseFloat(paymentAmount) || 0,
                  PayMethod: paymentMethod,
                }
              };

              var erpGet = erpDb();
              var oPost = new XMLHttpRequest();
              var serverIP = '165.228.147.127';
              var port = checkSSLPorts;
              oPost.open("POST", URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_Renew"', true);
              oPost.setRequestHeader("database", vs1loggedDatatbase);
              oPost.setRequestHeader("username", "VS1_Cloud_Admin");
              oPost.setRequestHeader("password", "DptfGw83mFl1j&9");
              oPost.setRequestHeader("Accept", "application/json");
              oPost.setRequestHeader("Accept", "application/html");
              oPost.setRequestHeader("Content-type", "application/json");
              // console.log(objDetails);
              var myString = JSON.stringify(objDetails);
              oPost.send(myString);
              oPost.onreadystatechange = function() {

                if (oPost.readyState == 4 && oPost.status == 200) {

                  Meteor.call('sendEmail', {
                      from: "VS1 Cloud <info@vs1cloud.com>",
                      to: 'rasheed@trueerp.com',
                      // cc: 'info@vs1cloud.com',
                      subject: '[VS1 Cloud] - Licence Renewal',
                      text: customerEmail,
                      html:'',
                      attachments : ''

                  }, function (error, result) {

                  });

                  var myArrResponse = JSON.parse(oPost.responseText);
                  //console.log(myArrResponse);
                  if (myArrResponse.ProcessLog.Error) {
                    // Bert.alert('Database Error<strong> :'+ myArrResponse.ProcessLog.Error+'</strong>', 'now-error');
                    // swal('Database Error', myArrResponse.ProcessLog.Error, 'error');
                    // $('.fullScreenSpin').css('display','none');
                  } else {
                    var databaseName = myArrResponse.ProcessLog.Databasename;

                  }

                } else if (oPost.readyState == 4 && oPost.status == 403) {

                } else if (oPost.readyState == 4 && oPost.status == 406) {

                  var ErrorResponse = oPost.getResponseHeader('errormessage');
                  var segError = ErrorResponse.split(':');

                  if ((segError[1]) == ' "Unable to lock object') {

                    //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the customer form in ERP!', 'danger');

                  } else {
                    //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');

                  }

                } else if (oPost.readyState == '') {

                }

              }



              }

            }

          }

        }
      }

    }
  });
  //console.log(currentURL.quoteid);
  let userEmail = '';
  let cloudpassword = '';

  if ((currentURL.passkey) && (currentURL.emailakey)) {
    userEmail = currentURL.emailakey;
    cloudpassword = currentURL.passkey;
    $('#emEmail').html(currentURL.emailakey);
    $('#emPassword').html(currentURL.passkey);
    let paymentAmount = currentURL.pricetopay;
    let objDetails = {
      Name: "VS1_Renew",
      Params: {
        CloudUserName: userEmail,
        CloudPassword: cloudpassword,
        Paymentamount: parseFloat(paymentAmount) || 1000,
        Paymethod: "Cash",
      }
    };

    var erpGet = erpDb();
    var oPost = new XMLHttpRequest();
    var serverIP = '165.228.147.127';
    var port = checkSSLPorts;
    oPost.open("POST", URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_Renew"', true);
    oPost.setRequestHeader("database", vs1loggedDatatbase);
    oPost.setRequestHeader("username", "VS1_Cloud_Admin");
    oPost.setRequestHeader("password", "DptfGw83mFl1j&9");
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
     console.log(JSON.stringify(objDetails));
    var myString = JSON.stringify(objDetails);
    //oPost.send(myString);
    oPost.onreadystatechange = function() {

      if (oPost.readyState == 4 && oPost.status == 200) {

        var myArrResponse = JSON.parse(oPost.responseText);
        //console.log(myArrResponse);
        if (myArrResponse.ProcessLog.Error) {
          // Bert.alert('Database Error<strong> :'+ myArrResponse.ProcessLog.Error+'</strong>', 'now-error');
          swal('Database Error', myArrResponse.ProcessLog.Error, 'error');
          // $('.fullScreenSpin').css('display','none');
        } else {
          var databaseName = myArrResponse.ProcessLog.Databasename;

          localStorage.usremail = userEmail;
          localStorage.usrpassword = cloudpassword;
          window.open('/','_self');
          // let mailBodyNew = $('.emailBody').html();
          // Meteor.call('sendEmail', {
          //     from: "VS1 Cloud <info@vs1cloud.com>",
          //     to: userEmail,
          //     cc: 'info@vs1cloud.com',
          //     subject: '[VS1 Cloud] - Licence Renewal',
          //     text: '',
          //     html:mailBodyNew,
          //     attachments : ''
          //
          // }, function (error, result) {
          //
          //       window.open('/','_self');
          //
          // });



          // Meteor.call('chargeCard2', stripeToken);

        }

      } else if (oPost.readyState == 4 && oPost.status == 403) {
        $('.fullScreenSpin').css('display', 'none');
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
      } else if (oPost.readyState == 4 && oPost.status == 406) {
        $('.fullScreenSpin').css('display', 'none');
        var ErrorResponse = oPost.getResponseHeader('errormessage');
        var segError = ErrorResponse.split(':');

        if ((segError[1]) == ' "Unable to lock object') {

          //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the customer form in ERP!', 'danger');
          swal('WARNING', oPost.getResponseHeader('errormessage') + 'Please try again!', 'error');
        } else {
          //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
          swal('WARNING', oPost.getResponseHeader('errormessage') + 'Please try again!', 'error');
        }

      } else if (oPost.readyState == '') {
        $('.fullScreenSpin').css('display', 'none');
        //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
        swal('Connection Failed', oPost.getResponseHeader('errormessage') + ' Please try again!', 'error');
      }

    }
  } else {
    // window.open('/','_self');
  }





});
