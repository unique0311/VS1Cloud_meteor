import { ReactiveVar } from 'meteor/reactive-var';
Template.settings.onRendered(function() {
  let isFxCurrencyLicence = Session.get('CloudUseForeignLicence');

   

    
    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) { 

//                alert("Matches");
                $("#settingsCard").removeClass("col-8");
                $("#settingsCard").addClass("col-12");

            }
        }
        mediaQuery(x) 
        x.addListener(mediaQuery) 
    }, 500);
    

    let imageData= (localStorage.getItem("Image"));
    if(imageData)
    {
        $('#uploadedImage').attr('src', imageData);
        // $('#uploadedImage').attr('width','50%');
    }

});
Template.settings.events({
'click .btnOrganisationSettings' : function(event){
 //window.open('/organisationSettings','_self');
 Router.go('/organisationsettings');
},
'click .btnAccessLevel' : function(event){
 Router.go('/accesslevel');
},
'click .btnCompanyAppSettings' : function(event){
 Router.go('/companyappsettings');
},
'click .btncurrenciesSettings' : function(event){
 Router.go('/currenciesSettings');
},
'click .btntaxRatesSettings' : function(event){
 Router.go('/taxratesettings');
},
'click .btnDepartmentSettings' : function(event){
 Router.go('/departmentSettings');
},
'click .btnpaymentMethodSettings' : function(event){
 Router.go('/paymentmethodSettings');
},
'click .btnTermsSettings' : function(event){
 Router.go('/termsettings');
},
'click .btnSubcription' : function(event){
 Router.go('/subscriptionSettings');
}


});

Template.settings.helpers({
  checkFXCurrency : () => {
     return Session.get('CloudUseForeignLicence');
  },
  isGreenTrack: function() {
    let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
  }
});
