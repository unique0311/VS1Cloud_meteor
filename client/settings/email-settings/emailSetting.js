import { HTTP } from 'meteor/http';
Template.emailSettings.onCreated(function(){
    //this is called when finished calling the template
    console.log('email template created');
});

Template.generalsettings.onRendered(function(){
    //this is called when we finished rendering this template
    console.log('email template rendered');
});
