Template.productlistpop.events({
  'keyup #tblInventory_filter input': function (event) {
    if (event.keyCode == 13) {
       $(".btnRefreshProduct").trigger("click");
    }
  }
});
