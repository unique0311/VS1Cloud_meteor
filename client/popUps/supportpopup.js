import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();

Template.supportmodalpop.onCreated(function() {

});

Template.supportmodalpop.onRendered(function() {

    if (Session.get('ERPLoggedCountry') == "Australia") {
        document.getElementById("phoneAUS").style.display = "block";
        document.getElementById("iconAUS").style.display = "block";

        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();

        if (time >= "8:00" || time <= "16:00") {
            $("#phoneParentAUS").addClass("phoneOpen");
            $("#phoneChildAUS").addClass("phoneOpen");
            $("#phoneParentAUS").removeClass("phoneClosed");
            $("#phoneChildAUS").removeClass("phoneClosed");
        } else {
            $("#phoneParentAUS").addClass("phoneClosed");
            $("#phoneChildAUS").addClass("phoneClosed");
            $("#phoneParentAUS").removeClass("phoneOpen");
            $("#phoneChildAUS").removeClass("phoneOpen");
        }
    } else if (Session.get('ERPLoggedCountry') == "United States of America") {
        document.getElementById("phoneUSA").style.display = "block";
        document.getElementById("iconUSA").style.display = "block";

        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();

        if (time >= "8:00" || time <= "16:00") {
            $("#phoneParentUSA").addClass("phoneOpen");
            $("#phoneChildUSA").addClass("phoneOpen");
            $("#phoneParentUSA").removeClass("phoneClosed");
            $("#phoneChildUSA").removeClass("phoneClosed");
        } else {
            $("#phoneParentUSA").addClass("phoneClosed");
            $("#phoneChildUSA").addClass("phoneClosed");
            $("#phoneParentUSA").removeClass("phoneOpen");
            $("#phoneChildUSA").removeClass("phoneOpen");
        }
    } else if (Session.get('ERPLoggedCountry') == "South Africa") {
        document.getElementById("phoneSA").style.display = "block";
        document.getElementById("iconSA").style.display = "block";

        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();

        if (time >= "8:00" || time <= "16:00") {
            $("#phoneParentSA").addClass("phoneOpen");
            $("#phoneChildSA").addClass("phoneOpen");
            $("#phoneParentSA").removeClass("phoneClosed");
            $("#phoneChildSA").removeClass("phoneClosed");
        } else {
            $("#phoneParentSA").addClass("phoneClosed");
            $("#phoneChildSA").addClass("phoneClosed");
            $("#phoneParentSA").removeClass("phoneOpen");
            $("#phoneChildSA").removeClass("phoneOpen");
        }
    } else {
        document.getElementById("phoneUSA").style.display = "block";
        document.getElementById("iconUSA").style.display = "block";

        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();

        if (time >= "8:00" || time <= "16:00") {
            $("#phoneParentUSA").addClass("phoneOpen");
        } else {
            $("#phoneParentUSA").addClass("phoneClosed");
        }
    }

});


Template.supportmodalpop.events({
    'click .btnAddNewTerm': function(event) {
        setTimeout(function() {
            $('#edtName').focus();
        }, 1000);
    }
});

Template.supportmodalpop.helpers({});
