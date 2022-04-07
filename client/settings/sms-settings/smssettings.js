import {OrganisationService} from '../../js/organisation-service';
import {CountryService} from '../../js/country-service';
import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

Template.smssettings.onCreated(() => {
});

Template.smssettings.onRendered(function () {

});

Template.smssettings.helpers({

});

Template.smssettings.events({

});
