import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
import "jquery-validation/dist/jquery.validate.min";

Template.resetpassword.helpers({
    getUserEmail: function(){
      var url = window.location.href;
      var getcustomer_email = url.split('?token=');
      var customer_email = getcustomer_email[getcustomer_email.length-1];
      if(customer_email){
       return ForgotPassword.find({emailToken: customer_email}).fetch();
    }
  }
});

Template.resetpassword.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});

Template.resetpassword.onCreated(function(){
  const templateObject = Template.instance();
});
Template.resetpassword.onRendered(function(){

});

Template.resetpassword.events({
  'click #password-reset':function(event, template){
    event.preventDefault();
    let mailTo = $('#enteredEmail').val();
    let cloudpassword = $("#cloudEmpUserPassword").val();
    let confirmCloudpassword = $("#confirmCloudEmpUserPassword").val();

    if(cloudpassword.length < 8) {
      Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      $('#cloudEmpUserPassword').css('border-color','red');
      $('#cloudEmpUserPassword').focus();

    }else{
      if((cloudpassword.match(/[A-z]/)) && (cloudpassword.match(/[A-Z]/)) && (cloudpassword.match(/\d/))){
        if(cloudpassword == confirmCloudpassword){
      $('#cloudEmpUserPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
    $("form[name='formreset']").validate({
        rules: {
            cloudEmpLogonName: "required",
            cloudEmpEmailAddress: "required",
            cloudEmpUserPassword: "required"
        },
        messages: {
            cloudEmpLogonName: "This field can't be blank",
            cloudEmpEmailAddress: "This field can't be blank",
            cloudEmpUserPassword: "This field can't be blank"
        },
        submitHandler: function (form) {
        $('.fullScreenSpin').css('display','inline-block');
        var enteredEmail = $("#enteredEmail").val();
        var enteredPassword = $("#cloudEmpUserPassword").val();
        var cloudHashPassword = CryptoJS.MD5(enteredPassword).toString().toUpperCase();
        var emailExist  = CloudUser.findOne({cloudEmail: enteredEmail});

        if (emailExist) {

          /*
          CloudUser.update({_id:emailExist._id},
            {$set:{clouddatabaseID:emailExist.clouddatabaseID,server: emailExist.server,
              database:emailExist.database,username:emailExist.username,
              password:emailExist.password,cloudPassword:enteredPassword,
              cloudHashPassword:cloudHashPassword,port:emailExist.port,userMultiLogon:false}},
               function(err, idTag) {
                 */
          CloudUser.update({_id:emailExist._id},{$set:{cloudPassword:enteredPassword,cloudHashPassword:cloudHashPassword,userMultiLogon:false}}, function(err, idTag) {
            if(err){
              
            }else{

              $('.fullScreenSpin').css('display','none');
              window.open('/','_self');
            }
          });
          
         }else{
           Meteor._reload.reload();
         }
        }
    });
    $("form[name='formreset']").submit();

  }else{
    Bert.alert('<strong>Error: Confirm Password</strong> The Confirm Password confirmation does not match.', 'danger');
    $('#confirmCloudEmpUserPassword').css('border-color','red');
    $('#confirmCloudEmpUserPassword').focus();
  }
  } else {
      Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      $('#cloudEmpUserPassword').css('border-color','red');
      $('#cloudEmpUserPassword').focus();
    }
  }
},
'click .backtoLogin':function(){
  window.open('/','_self');
}

});
