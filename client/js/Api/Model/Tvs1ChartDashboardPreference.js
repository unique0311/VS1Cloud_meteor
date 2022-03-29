import Tvs1ChartDashboardPreferenceField from "./Tvs1ChartDashboardPreferenceField";

/**
 * @param {Object} object
 * @param {String} object.type
 * @param {Tvs1ChartDashboardPreferenceField} object.fields
 */
export default class Tvs1ChartDashboardPreference {
  constructor(options) {
    this.type = options.type;
    this.fields = new Tvs1ChartDashboardPreferenceField(options.fields);
  }


  /**
   * 
   * @param {Array} array 
   * @return {Tvs1ChartDashboardPreference[]}
   */
  static fromList(array) {
    
    let myList = [];
    array.forEach((element) => {
      myList.push(new Tvs1ChartDashboardPreference(element));
    });

    return myList;
  }
}
