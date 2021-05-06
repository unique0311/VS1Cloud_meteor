//var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionHeartbeatInterval || (1*60*10); // 3mins
//var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionActivityEvents || 'mousemove click keydown';

//var activityDetected = false;
var activityTimeout = setTimeout(inActive, 1800000);
var sidebarTimeout = setTimeout(closeSideBar, 3000);

function resetActive(){
    $(document.body).attr('class', 'active');
    clearTimeout(activityTimeout);
    clearTimeout(sidebarTimeout);
    activityTimeout = setTimeout(inActive, 1800000);
    sidebarTimeout = setTimeout(closeSideBar, 3000);
    //3600000
}
function closeSideBar(){
  // alert('here 1');
if ($(".collapse.show")[0]){
$('.collapse').removeClass('show');
  // Do something if class exists
}
}
// No activity do something.
function inActive(){
    $(document.body).attr('class', 'inactive');
    var loc = window.location.pathname;

      if ((loc != '/') && (loc != '/register') && (loc != '/registerdb') && (loc != '/vs1greentracklogin')&& (loc != '/registersts')) {
        CloudUser.update({_id: Session.get('mycloudLogonID')},{ $set: {userMultiLogon: false}});
        if(Session.get('isGreenTrack')){
          window.open('/vs1greentracklogin','_self');
        }else{
          window.open('/','_self');
        }

        document.getElementById('apptimer').style.display='block';
      }

}

// Check for mousemove, could add other events here such as checking for key presses ect.
$(document).bind('mousemove', function(){resetActive()});
  /*
Meteor.startup(function() {

    //
    // periodically send a heartbeat if activity has been detected within the interval
    //

    Meteor.setInterval(function() {
      var loc = window.location.pathname;
      //alert(loc);
        if ( (activityDetected != true)) {
          document.getElementById('apptimer').style.display='block';
          //alert('Rasheed');
            Meteor.call('heartbeat');
            activityDetected = false;
        }
    }, heartbeatInterval);

    //
    // detect activity and mark it as detected on any of the following events
    //
    $(document).on(activityEvents, function() {
      //alert('here');
      //document.getElementById('apptimer').style.display='none';
       activityDetected = true;
    });

});
*/
