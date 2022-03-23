import Tvs1ChartField from "./Tvs1ChartField";

/**
 * @param {Object} object
 * @param {String} object.type
 * @param {Tvs1ChartField} object.fields
 */
export default class Tvs1chart {
  constructor(options) {
    this.type = options.type;
    this.fields = new Tvs1ChartField(options.fields);
  }


  /**
   * 
   * @param {Array} array 
   * @return {Tvs1chart[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new Tvs1chart(element));
    });

    return myList;
  }
}
