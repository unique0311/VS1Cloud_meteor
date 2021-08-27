import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {STSService} from "./sts-service";
import {UtilityService} from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();
const templateObject = Template.instance();

Template.stsdashboard.onCreated(function(){

});


Template.stsdashboard.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');
});


Template.stsdashboard.events({

    //Dashboard buttons
    'click #btnPlants':function(event){
        FlowRouter.go('/stsplants');
    },
    'click #btnHarvests':function(event){
        FlowRouter.go('/stsharvests');
    },
    'click #btnPackages':function(event){
        FlowRouter.go('/stspackages');
    },
    'click #btnTransfers':function(event){
        FlowRouter.go('/ststransfers');
    },
    'click #btnOverviews':function(event){
        FlowRouter.go('/stsoverviews');
    },
    'click #btnSettings':function(event){
        FlowRouter.go('/stssettings');
    },

    //Buttons inside Scan Modal
    'click #btnCreatePlantings':function(event){
        window.open('/stscreateplantings','_self');
    },
    'click #btnRecordAdditives':function(event){
        window.open('/stsrecordadditives','_self');
    },
    'click #btnChangeRoom':function(event){
        window.open('/stschangeroom','_self');
    },
    'click #btnManicurePlants':function(event){
        window.open('/stsmanicureplants','_self');
    },
    'click #btnDestroyPlants':function(event){
        window.open('/stsdestroyplants','_self');
    },
    'click #btnTransactionHistory':function(event){
        window.open('/','_self');
    }
});


Template.stsdashboard.helpers({
  loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
 }
});
