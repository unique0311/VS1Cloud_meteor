import { Meteor } from 'meteor/meteor';
import {loadStripe} from '@stripe/stripe-js';

const stripe = loadStripe('pk_test_51H019EDvlF0UkKE2KE9etEOQmp7Ujth0Zzuhxp8y7rrrj5NwowQDWqKZVCZTIlQGOWd3RH8ANsAaYqEg57ODSW6D00TNGazZJU');
const braintree = require('braintree');
var yodlee = require('yodlee');
const Magento2 = require('node-magento2');
"use strict";


Meteor.startup(() => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  /* Connection to Braintree Paymentent Gateway */
  let env = braintree.Environment.Sandbox;

  var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: '2mh4gq43myk73yby',
    publicKey: 'k2j8pjckdvk94yck',
    privateKey: 'cdd3badd1bddcc1388198d78b6da5652'
  });

  //instantiate the client object

  const options = {
  url: 'https://www.payments.vs1cloud.com',
  store: 'default', //set a store to contextualise in
  authentication: {
    integration: { //from the integrations section in the magento2 backend
      access_token: 'v5qr02ewd2wemjotpujb9fatembkgm47'
    }
  }
};



  const mageClient = new Magento2('https://www.payments.vs1cloud.com', options)
  //initialise the helpers
  mageClient.init();
  let $json = {
      "search_criteria": {
          "filter_groups": [
              {
                  "filters": [
                      {
                          "field": "sku",
                          "value": "%",
                          "condition_type": "like"
                      }
                  ]
              }
          ]
      }
  };
// var sessionDataToLog = Session.get('mySession');
  let $jsonProfile = {
      "search_criteria": {
          "filter_groups": [
              {
                  "filters": [
                      // {
                      //     "field": "customer_email",
                      //     "value": "rasheedt4@vs1cloud.com",
                      //     "condition_type": "eq"
                      // },
                      {
                          "field": "status",
                          "value": "active",
                          "condition_type": "eq"
                      }
                  ]
              }
          ]
      }
  };

  let $jsonStripe = {
      "search_criteria": {
          "filter_groups": [
              {
                  "filters": [
                      {
                          "field": "customer_email",
                          "value": "%",
                          "condition_type": "like"
                      }
                  ]
              }
          ]
      }
  };
  //basic usage
  // mageClient.init()
  // .then(mageClient => {
  // return mageClient.get('/V1/customers');
  // }).then(function(option) {
  //   console.log(option);
  // }).catch(function(error) {
  //   console.log(error);
  // });

  // mageClient.get('/V1/STRIPE_CUSTOMERS', $jsonStripe)
  // .then(function(option) {
  //   console.log(option);
  // })
  // .catch(function(error) {
  //   console.log(error);
  // });



  // mageClient.get('/V1/products', $json).then(function(optionvalue) {
  //   // console.log(optionvalue)
  // })
  // .catch(function(error) {
  //   //console.log(error);
  // });



    // mageClient.get('/V1/awSarp2/profile/85').then(function(optionvalue) {
    //   console.log(optionvalue)
    // })
    // .catch(function(error) {
    //   console.log(error)
    // });



/* Connection to Yodlee Banking Interagion */
//   yodlee.use({
//     username: 'VIutoeFzbkYHrqQ9IV176CF1QGlt3ljs',
//     password: '1sFr1EO2DcwnKXWG',
//     api_base: 'https://node.sandbox.yodlee.com/authenticate/restserver/v1.1'
//   });
//
yodlee.getAccessToken({
    username: 'sbMem5f7qb50a65a361',
    password: 'site16441.2'
}).then(function(accessToken) {
    //console.log(accessToken);
  })
  .catch(function(error) {
    //console.log(error);
  });



/* Braintree Method to Charge Client */
  Meteor.methods({
    'magentoAWSProfileRenewal': function() {
      return mageClient.get('/V1/awSarp2/profile/search?', $jsonProfile)
          .then(function(option) {
            return option;
            // console.log(option);
          }).catch(function(error) {
            // console.log(error);
          });
    },
    'magentoAWSProfileLoggedUser': function(useremail) {
      let $jsonOneProfile = {
          "search_criteria": {
              "filter_groups": [
                  {
                      "filters": [
                          {
                              "field": "customer_email",
                              "value": useremail,
                              "condition_type": "eq"
                          },
                          {
                              "field": "status",
                              "value": "active",
                              "condition_type": "eq"
                          }
                      ]
                  }
              ]
          }
      };

      return mageClient.get('/V1/awSarp2/profile/search?', $jsonOneProfile)
          .then(function(option) {
            return option;
            // console.log(option);
          }).catch(function(error) {
            // console.log(error);
          });
    },
    'magentoSKUProductsDetail': function(productSKU) {
      let $jsonOneProfile = {
          "search_criteria": {
              "filter_groups": [
                  {
                      "filters": [
                          {
                              "field": "sku",
                              "value": productSKU,
                              "condition_type": "eq"
                          },
                          {
                              "field": "status",
                              "value": "active",
                              "condition_type": "eq"
                          }
                      ]
                  }
              ]
          }
      };

      return mageClient.get('/V1/products', $jsonOneProfile)
          .then(function(option) {
            // console.log(option.extension_attributes);
            return option;

          }).catch(function(error) {
            // console.log(error);
          });
    },
    'braintreeChargeCard': function(stripeToken, amountCharged) {
      gateway.customer.search((search) => {
        search.email().is(stripeToken);
      }, (err, response) => {
        customerID  = response.ids[0];
        if(customerID){
          gateway.transaction.sale({
          amount: amountCharged,
          customerId: customerID,
          paymentMethodNonce: 'nonce-from-the-client',
          options: {
            submitForSettlement: true
          }
        }).then(function (result) {
          if (result.success) {
            //console.log('Transaction ID: ' + result.transaction.id);
          } else {
             //console.error(result.message);
          }
        }).catch(function (err) {
            //console.error(err);
        });
        }else{
          gateway.transaction.sale({
          amount: amountCharged,
          paymentMethodNonce: 'nonce-from-the-client',
          options: {
            submitForSettlement: true
          }
        }).then(function (result) {
          if (result.success) {
             //console.log('Transaction ID: ' + result.transaction.id);
          } else {
             //console.error(result.message);
          }
        }).catch(function (err) {
            //console.error(err);
        });
        }

      });


  },
  'StripeChargeCard': function(useradminEmail, amountCharged) {
    var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');
      const customer = Stripe.customers.create({
       source: 'tok_mastercard',
       email: useradminEmail,
      },function(err, charge) {
       Stripe.charges.create({
         amount: amountCharged,// this is equivalent to $50
         currency: 'usd',
         customer: charge.id
       },function(errData, chargeData) {
         if(errData){
           //console.log(errData);
         }else{
           //console.log(chargeData);
         }
       });
      });
   },
   'StripeTestChargeCard': function() {
     var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');
       return Stripe.customers.create({
        source: 'tok_mastercard',
        email: 'adeola@vs1cloud.com',
       },function(err, charge) {
         if(err){
           return err;
           }else{
           return charge;
           }
        // Stripe.charges.create({
        //   amount: amountCharged,// this is equivalent to $50
        //   currency: 'usd',
        //   customer: charge.id
        // },function(errData, chargeData) {
        //   if(errData){
        //
        //   }else{
        //
        //   }
        // });
       });
    },
    getClientToken: (clientId) => {
      const generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
      const options = {};

      if (clientId) {
        options.clientId = clientId;
      }

      const response = generateToken(options);
      return response.clientToken;
    },
    subscribeToPlan(nonce, plan) {
        const customer = Meteor.wrapAsync(gateway.customer.create, gateway.customer);
        const subscription = Meteor.wrapAsync(gateway.subscription.create, gateway.subscription);
        const plans = Meteor.wrapAsync(gateway.plan.all, gateway.plan);
        const plansResult = plans().plans;

        const planId = plansResult.find((planObject) => {
          return planObject.name === plan;
        }).id;

        const email = Meteor.user().emails[0].address;

        const customerResult = customer({
          email,
          paymentMethodNonce: nonce,
        });

        if (customerResult.success) {
          const token = customerResult.customer.paymentMethods[0].token;
          const subscriptionResult = subscription({
            paymentMethodToken: token,
            planId,
          });

          if (subscriptionResult.success) {
            // Set / check the correct role for your user
            const currentRoles = Roles.getRolesForUser(Meteor.userId());
            currentRoles.forEach((role) => {
              if (role === plan) {
                throw new Meteor.Error('400', 'User already subscribed to this plan');
              } else {

                // We support 3 roles, but you may have more or less (it's probably better to get these from the braintree api)
                if (role === 'free' || role === 'developer' || role === 'professional') {
                  Roles.removeUsersFromRoles(Meteor.userId(), role);
                }
              }
            });

            // add new subscription
            Roles.addUsersToRoles(Meteor.userId(), plan);

            return true;
          }
        }
    },
  });
  // code to run on server at startup
});
