


export default class FinanceApi {
    constructor() {

    }

    /**
     * This function will return the exchange rate
     * 
     * @param {String} from 
     * @param {String} to 
     * @returns {String}
     */
    async get(from, to) {
      try {
        const response = await fetch("API_URL", {
            method: "GET"
        });

        if(response.ok) {
            const data = await response.json();
            console.log(data);
            
        }
      } catch(err) {
          
      }


    } 
}