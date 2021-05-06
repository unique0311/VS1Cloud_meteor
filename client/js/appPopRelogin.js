Template.appAlertPage.onCreated(function(){


});

Template.appAlertPage.onRendered(function(){
  $("#resubmitLogin").click(function(e){
    var password = $("#re_login").val();
    var entpassword = CryptoJS.MD5(password).toString().toUpperCase();
    var userPassword = Session.get('myerpPassword');

    if(entpassword == userPassword){
      document.getElementById('apptimer').style.display='none';
    }else{
      //alert('Invalide password');
      Bert.alert('<strong>Error:</strong> The Password You Entered is Incorrect, Please Try Again.', 'danger');
      $("#re_login").focus();
    }
e.preventDefault();
  });



});
