export default class resizableCharts {
  static enable(timeOut = 200) {
    setTimeout(() => {
      $(".portlet").resizable({
        disabled: false,
      //  handles: "e",
      });
    }, timeOut);
  }

  static disable() {
    $(".portlet").resizable({
      disabled: true,
      // handles: "e",
    });
  }
}
