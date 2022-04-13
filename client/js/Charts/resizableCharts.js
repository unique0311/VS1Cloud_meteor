export default class resizableCharts {
  static enable(timeOut = 200) {
    setTimeout(() => {
      $(".portlet").resizable({
        disabled: false,
        minHeight:200,
        minWidth:250,
        // aspectRatio: 1.5 / 1
        handles: "e,s",
        resize: function( event, ui ) {
          let chartHeight = ui.size.height - 150;
          let chartWidth = ui.size.width - 20;          
          $(ui.element[0]).find('canvas').css('width',  chartWidth);
          $(ui.element[0]).find('canvas').css('height', chartHeight );
        //  console.log(event.currentTarget);
        //   console.log(ui.element[0]);
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
