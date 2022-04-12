export default class resizableCharts {
  static enable(timeOut = 200) {
    setTimeout(() => {
      $(".portlet").resizable({
        disabled: false,
        minHeight:200,
        minWidth:250,
        // aspectRatio: 1.5 / 1
        handles: "e",
        resize: function( event, ui ) {
          $(ui.element[0]).css('height', "");
         // console.log(event.currentTarget);
          //console.log(ui.element[0]);
        }
      });
      
      
    }, timeOut);
  }

  static disable() {
    $(".portlet").resizable({
      disabled: true,
      minHeight:200,
      minWidth:250,
      // aspectRatio: 1.5 / 1
      handles: "e",
    });
  }
}
