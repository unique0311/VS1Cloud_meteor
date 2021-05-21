import { ReactiveVar } from 'meteor/reactive-var';
import {EmployeeProfileService} from './profile-service';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
Template.forgotpassword.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});
Template.forgotpassword.helpers({

});

Template.forgotpassword.onCreated(function(){
  const templateObject = Template.instance();
});


Template.forgotpassword.events({
  'click #reset-button':function(){
    var originURL  = window.location.origin;
    //console.log(originURL);
    var token = Random.secret();
    var when = new Date();
    let mailTo = $('#email').val().replace(/;/g, ",");
    let mailFrom = 'noreply@vs1cloud.com';
    let urlWithoutHash = originURL+'/resetpassword?token='+token;
    function isEmailValid(mailTo) {
        return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
    };

    if(!isEmailValid(mailTo)){
        Bert.alert('<strong>WARNING:</strong> The email field must be a valid email address !', 'warning');
        e.preventDefault();
        return false;
    }else{
      var emailAlreadyExist  = CloudUser.find({cloudEmail: mailTo}).fetch();
      if (emailAlreadyExist.length > 0) {
      $('.fullScreenSpin').css('display','inline-block');
      ForgotPassword.insert({ useremail: mailTo,emailToken:token,createdAt: new Date() });

      Meteor.call('sendEmail', {
          from: "VS1 Cloud <info@vs1cloud.com>",
          to: mailTo,
          // cc: mailCC,
          subject: '[VS1 Cloud] - Reset Your Password',
          text: 'A password reset has been requested for the account related to this address ('+mailTo+'). To reset the password, visit the following link:\n\n'+urlWithoutHash+'\n\n If you did not request this reset, please ignore this email. If you feel something is wrong, please contact our support team: support@vs1cloud.com.',
          html:'',
          attachments : ''

      }, function (error, result) {
          if (error && error.error === "error") {
              Bert.alert('<strong>WARNING:</strong>' + error, 'warning');
              event.preventDefault();
          } else {
            setTimeout(function () {
              $('.fullScreenSpin').css('display','none');
            window.open('/','_self');
          }, 100);
          }
      });
    }else{
      $('.fullScreenSpin').css('display','inline-block');
      Bert.alert('<strong>Error:</strong> Invalid Email, Email Not Found Please Try Again!', 'danger');
      Meteor.call('sendEmail', {
          from: "VS1 Cloud <info@vs1cloud.com>",
          to: mailTo,
          // cc: mailCC,
          subject: '[VS1 Cloud] - Reset Your Password',
          text: 'VS1Cloud doesn’t have a registered user with that email address ['+mailTo+']. If you’re a registered user, then it’s with a different email address. Please contact us at support@vs1cloud.com.',
          html:'',
          attachments : ''
      }, function (error, result) {
          if (error && error.error === "error") {
              Bert.alert('<strong>WARNING:</strong>' + error, 'warning');
              event.preventDefault();
          } else {
            setTimeout(function () {
              $('.fullScreenSpin').css('display','none');
            window.open('/','_self');
          }, 100);
          }
      });
    }
    }

  },
  'click .backtoLogin':function(){
    window.open('/','_self');
  }
});
