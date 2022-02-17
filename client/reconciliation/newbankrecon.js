import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    ReconService
} from "./recon-service";
import {
    UtilityService
} from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
import 'jquery-editable-select';
import { AccountService } from "../accounts/account-service";
let utilityService = new UtilityService();

Template.newbankrecon.onCreated(function() {
    const templateObject = Template.instance();
});

Template.newbankrecon.onRendered(function() {

});

Template.newbankrecon.events({

});

Template.newbankrecon.helpers({
    
});
