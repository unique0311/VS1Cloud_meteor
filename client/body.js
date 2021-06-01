import { ReactiveVar } from 'meteor/reactive-var';
// client/main.js
import '../imports/startup/client/serviceWorker.js';
Template.body.onCreated(function bodyOnCreated() {
    const templateObject = Template.instance();
    Meteor.subscribe('RegisterUsers');
    Meteor.subscribe('CloudDatabases');
    Meteor.subscribe('CloudUsers');
    Meteor.subscribe('ForgotPasswords');
    Meteor.subscribe('CloudPreferences');

    templateObject.isCloudSidePanelMenu = new ReactiveVar();
    templateObject.isCloudSidePanelMenu.set(false);
});

Template.body.onRendered(function(){
  const templateObject = Template.instance();
  let isSidePanel = Session.get('CloudSidePanelMenu');
  if(isSidePanel){
    templateObject.isCloudSidePanelMenu.set(true);
    $("html").addClass("hasSideBar");
    $("body").addClass("hasSideBar");
  }
  // document.addEventListener('contextmenu', function(e) {
  // e.preventDefault();
  // });

  $(document).ready(function() {
    var loc = window.location.pathname;
    if ( loc == "/vs1greentracklogin" ){
      document.title = 'GreenTrack';
      $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
    }else if ( loc == "/" ){
      document.title = 'VS1 Cloud';
      $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
    }else if( loc == "/registersts" ){
      document.title = 'GreenTrack';
      $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
    }

    // $("body").on("click", "#sidebarToggleTop", function() {
    //   var sideBarPanel = $("#sidenavbar").attr("class");
    //   if(sideBarPanel.indexOf("toggled") >= 0){
    //     $("#sidenavbar").removeClass("toggled");
    //     //Session.setPersistent('sidePanelToggle', "toggled");
    //   }else{
    //     $("#sidenavbar").addClass("toggled");
    //     //Session.setPersistent('sidePanelToggle', "");
    //   }
    //   });

      $("body").on("mouseenter", "#content-wrapper", function() {
        if ($(".collapse.show")[0]){
        $('.collapse').removeClass('show');
          // Do something if class exists
        }
        // $('.hoverSideNavAccounts .collapse').removeClass('show');
        // $('.hoverSideNavBanking .collapse').removeClass('show');
        // $('.hoverSideNavContacts .collapse').removeClass('show');
        // $('.hoverSidenavinventory .collapse').removeClass('show');
        // $('.hoverSideNavPayments .collapse').removeClass('show');
        // $('.hoverSideNavPurchases .collapse').removeClass('show');
        // $('.hoverSideNavReports .collapse').removeClass('show');
        // $('.hoverSideNavSales .collapse').removeClass('show');
        // $('.hoverSideNavSeedToSale .collapse').removeClass('show');
        // $('.hoverSideNavSettings .collapse').removeClass('show');
        // $('.hoverSideNavPayroll .collapse').removeClass('show');
        // $('.hoverSideNavAppointment .collapse').removeClass('show');
      });

   });

});
Template.body.helpers({
  isCloudSidePanelMenu: () => {
      return Template.instance().isCloudSidePanelMenu.get();
  },
  isGreenTrack: function() {
    let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
  }
});
