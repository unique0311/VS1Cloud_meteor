Meteor.startup(function(){
    if (Meteor.isServer) {
       Meteor.startup( function() {
           process.env.MAIL_URL='smtps://noreply%40vs1cloud.com:' + encodeURIComponent("Jp9CvV2M5g") + '@mail.vs1cloud.com:465';

         process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
         process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
       });

    }

});

Meteor.methods({
  authCall: function () {
      this.unblock();
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
        check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);
        this.unblock();
        if(mailFields.attachments === undefined){
            mailFields.attachments = [];
        }else{

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

            });
        } catch(e) {
            if (e) {
                throw new Meteor.Error("error", e.response);
            }
        }
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

});
},
'listchargeCard2': function() {
var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

Stripe.charges.list({
limit: 2
},function(err, charge) {
  if(err){

  }else{

      let valueData = charge.data;

      for (let j in valueData) {
        let billing_details = valueData[j].billing_details;
        let payment_details = valueData[j].payment_method_details;

      }
  }

});
},
'listcustomersStripe': function() {
var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

return Stripe.customers.list({

},function(err, charge) {
  if(err){

  }else{

      let valueData = charge.data;
      return valueData;

      for (let j in valueData) {

      }
  }

});
}
});
