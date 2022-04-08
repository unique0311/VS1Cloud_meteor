export default class resizableCharts {
  static enable(timeOut = 200) {
    setTimeout(() => {
      $(".portlet").resizable({
        disabled: false,
        // aspectRatio: 1.5 / 1
      //  handles: "e",
      });
    }, timeOut);
  }

  static disable() {
    $(".portlet").resizable({
      disabled: true,
      // aspectRatio: 1.5 / 1
      // handles: "e",
    });
  }
}
