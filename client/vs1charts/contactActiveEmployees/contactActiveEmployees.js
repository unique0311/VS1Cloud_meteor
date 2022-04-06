import "jQuery.print/jQuery.print.js";
import { ReactiveVar } from "meteor/reactive-var";
import { ContactService } from "../../contacts/contact-service";
let _ = require("lodash");

Template.contactActiveEmployees.onCreated(() => {
  const templateObject = Template.instance();


  templateObject.loggeduserdata = new ReactiveVar([]);
});

Template.contactActiveEmployees.onRendered(() => {
  const templateObject = Template.instance();
  let contactService = new ContactService();
  const loggedUserList = [];
  console.log("Contact Active employees rendered");


  templateObject.getLoggedUserData = function () {
    contactService.getCurrentLoggedUser().then(function (data) {
      let dataListloggedUser = {};
      let vs1EmployeeImage = Session.get("vs1EmployeeImages");

      let encoded = "";
      for (let i = 0; i < data.tappuser.length; i++) {
        let employeeUser =
          data.tappuser[i].FirstName + " " + data.tappuser[i].LastName;
        if (
          parseInt(data.tappuser[i].EmployeeID) ==
          parseInt(Session.get("mySessionEmployeeLoggedID"))
        ) {
          employeeUser = Session.get("mySessionEmployee");
        }
        dataListloggedUser = {
          id: data.tappuser[i].EmployeeID || "",
          employeename: employeeUser || "- -",
          ladtloging: data.tappuser[i].LastTime || "",
          // employeepicture: encoded|| ''
        };
        loggedUserList.push(dataListloggedUser);
      }
      templateObject.loggeduserdata.set(loggedUserList);
    });
    /*
        getVS1Data('TAppUser').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getCurrentLoggedUser().then(function (data) {

                    let dataListloggedUser = {};
                    let vs1EmployeeImage = Session.get('vs1EmployeeImages');

                    let encoded = '';
                    for(let i=0; i<data.tappuser.length; i++){
                        dataListloggedUser = {
                            id: data.tappuser[i].EmployeeID || '',
                            employeename: data.tappuser[i].UserName || '',
                            ladtloging: data.tappuser[i].LastTime|| '',
                            // employeepicture: encoded|| ''
                        };
                        loggedUserList.push(dataListloggedUser);
                    }
                    templateObject.loggeduserdata.set(loggedUserList);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tappuser;
                let dataListloggedUser = {};
                let vs1EmployeeImage = Session.get('vs1EmployeeImages');

                let encoded = '';
                for(let i=0; i<useData.length; i++){
                    dataListloggedUser = {
                        id: useData[i].EmployeeID || '',
                        employeename: useData[i].UserName || '',
                        ladtloging: useData[i].LastTime|| '',
                        // employeepicture: encoded|| ''
                    };
                    loggedUserList.push(dataListloggedUser);
                }
                templateObject.loggeduserdata.set(loggedUserList);

            }
        }).catch(function (err) {
            contactService.getCurrentLoggedUser().then(function (data) {

                let dataListloggedUser = {};
                let vs1EmployeeImage = Session.get('vs1EmployeeImages');

                let encoded = '';
                for(let i=0; i<data.tappuser.length; i++){
                    dataListloggedUser = {
                        id: data.tappuser[i].EmployeeID || '',
                        employeename: data.tappuser[i].UserName || '',
                        ladtloging: data.tappuser[i].LastTime|| '',
                        // employeepicture: encoded|| ''
                    };
                    loggedUserList.push(dataListloggedUser);
                }
                templateObject.loggeduserdata.set(loggedUserList);
            });
        });
        */
  };
  templateObject.getLoggedUserData();

});

Template.contactActiveEmployees.events({
  // 'click #expenseshide': function () {
  //  let check = localStorage.getItem("expenseschart") || true;
  //   if(check == "true" || check == true) {
  //      $("#expenseshide").text("Show");
  //      // localStorage.setItem("expenseschart",false);
  //   } else {
  //      $("#expenseshide").text("Hide");
  //      // localStorage.setItem("expenseschart",true);
  //   }
  // }
});
Template.contactActiveEmployees.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  topTenData: () => {
    return Template.instance().topTenData.get();
  },
  Currency: () => {
    return Currency;
  },
  companyname: () => {
    return loggedCompany;
  },
  salesperc: () => {
    return Template.instance().salesperc.get() || 0;
  },
  expenseperc: () => {
    return Template.instance().expenseperc.get() || 0;
  },
  salespercTotal: () => {
    return Template.instance().salespercTotal.get() || 0;
  },
  expensepercTotal: () => {
    return Template.instance().expensepercTotal.get() || 0;
  },
});
Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  return a.indexOf(b) >= 0;
});
