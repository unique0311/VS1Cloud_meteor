Meteor.startup(function(){

    /*
    * in username : Default SMTP Login
    * in password : Default Password
    * */
    if (Meteor.isServer) {
       Meteor.startup( function() {
          process.env.MAIL_URL =
             // "smtp://YOUR_DEFAULT_SMTP_LOGIN:YOUR_DEFAULT_PASSWORD@smtp.mailgun.org:587";
             "smtps://vsonecloud%40gmail.com:Jp9CvV2M5g@smtp.gmail.com:465/";
             //"smtp://info@vs1cloud.com:Jp9CvV2M5g@ns2.auserver.com.au:587/";

         process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
         process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
       });

    }

    // Stripe.paymentIntents.create({
    //   amount: 7300,// this is equivalent to $50
    //   currency: 'usd',
    //   payment_method_types: ['card'],
    // },function(errData, dataValue) {
    //
    //   // let intendID = dataValue.id;
    //   // console.log(intendID);
    //   console.log(dataValue);
    // });
/*
    Stripe.charges.create({
      amount: 7300,// this is equivalent to $50
      currency: 'usd',
      customer: 'cus_IVFQjP4VgqKvgM'
    },function(errData, chargeData) {
      if(errData){
        console.log(errData);
      }else{
        console.log(chargeData);
      }
    });
*/

    // console.log(errData);
    //console.log(chargeData);

//console.log(customer.id);

/*
    Meteor.Mailgun.config({

        // marcele's account (old one)
         username: 'postmaster@sandboxfb2791091efd48978d77873c20e2ebe7.mailgun.org',
         password: '6b03a28c6c9c0981628fcc5b77576028-3b1f59cf-ab1f2da0'

        // ariyibi' account (new one)
        // username: 'postmaster@sandboxdce321777be94b4ba1328ce259e359e7.mailgun.org',
        // password: '63bbf8c8ec8d94be30eb74b091b0724d-bd350f28-5dac8d9f'
    });
    */
});

// In your server code: define a method that the client can call
Meteor.methods({
  authCall: function () {
      this.unblock(); // Make sure server doesn't get block from this call
      var auth_url="https://192.168.1.100:4433/erpapi/TERPSysInfo";
      return Meteor.http.call("GET", auth_url, {

        headers: {
          'database':'vs1_cloud',
          'username':'VS1_Cloud_Admin',
          'password':'DptfGw83mFl1j&9',
          "content-type":"application/json",
          "Accept":"application/json"
        },
        strictSSL: false
      })
    },
    sendEmail: function (mailFields) {
        // console.log(mailFields);
        check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);
        // process.env.MAIL_URL = 'smtp://postmaster@sandboxfb2791091efd48978d77873c20e2ebe7.mailgun.org:6b03a28c6c9c0981628fcc5b77576028-3b1f59cf-ab1f2da0@smtp.mailgun.org:587';
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        if(mailFields.attachments === undefined){
            mailFields.attachments = [];
        }else{
            // console.log(mailFields.attachments.length);
        }
        try {
          Email.send({
                to: mailFields.to,
                from: mailFields.from,
                cc: mailFields.cc,
                subject: mailFields.subject,
                text: mailFields.text,
                html: mailFields.html,
                attachments: mailFields.attachments
                // attachments : [{path: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='}]
                // attachments : [ { filename: 'text1.txt', content: 'aGVsbG8gd29ybGQh', encoding: 'base64'},{ filename: 'text2.txt', content: 'aGVsbG8gd29ybGQh', encoding: 'base64'},{ filename: 'text3.txt', content: 'aGVsbG8gd29ybGQh', encoding: 'base64'} ]
                // attachments : [ { fileName : 'fileName', filePath : 'https://documentation.mailgun.com/en/latest/_static/img/mailgun-primary-no-tag.svg' } ]
            });
        } catch(e) {
            if (e) {
                // console.log(e);
                throw new Meteor.Error("error", e.response);
            }
        }
        // console.log('mail sent');
    }
});

Meteor.methods({
'chargeCard2': function(stripeToken, amountCharged, currency) {
var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

Stripe.charges.create({
amount: amountCharged,// this is equivalent to $65
currency: currency,
source: stripeToken
},function(err, charge) {
// console.log(err, charge);
// Bert.alert('Payment Error<strong> :'+ err+' - '+charge+'!</strong>', 'now-error');
// Bert.alert('Payment Error <strong> :'+ err+'!</strong>'+ charge, 'now-error');
});
},
'listchargeCard2': function() {
var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

Stripe.charges.list({
limit: 2
},function(err, charge) {
  if(err){
//console.log(err);
  }else{
      // console.log(charge);
      let valueData = charge.data;
      // console.log(valueData);
      for (let j in valueData) {
        let billing_details = valueData[j].billing_details;
        let payment_details = valueData[j].payment_method_details;

        //console.log(payment_details);
      }
  }

// Bert.alert('Payment Error<strong> :'+ err+' - '+charge+'!</strong>', 'now-error');
// Bert.alert('Payment Error <strong> :'+ err+'!</strong>'+ charge, 'now-error');
});
},
'listcustomersStripe': function() {
var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

return Stripe.customers.list({
// limit: 2
},function(err, charge) {
  if(err){
console.log(err);
  }else{
      // console.log(charge);
      let valueData = charge.data;
      return valueData;
      console.log(valueData);
      for (let j in valueData) {
        // let billing_details = valueData[j].billing_details;
        // let payment_details = valueData[j].payment_method_details;
        //
        // console.log(payment_details);
      }
  }

// Bert.alert('Payment Error<strong> :'+ err+' - '+charge+'!</strong>', 'now-error');
// Bert.alert('Payment Error <strong> :'+ err+'!</strong>'+ charge, 'now-error');
});
}
});
// Meteor.call('sendEmail',{
//     to: 'rasheed@trueerp.com',
//     from: 'info@vs1cloud.com',
//     subject: 'eeeeeeeeeeeee8888eeeeeeeee!',
//     text: 'eeeeeeeeeeeeee8888eeeeeeee!',
//     html: 'With meteor it&apos;s easy to set up <strong>HTML</strong> <span style="color:red">emails</span> too.'
// });
