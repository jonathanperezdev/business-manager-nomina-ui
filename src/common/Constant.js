import Moment from 'moment';

const NOMINA_API = '/nomina';

//General
const DATE_FORMAT = Moment.HTML5_FMT.DATE;

//Table options
const OPTIONS_TABLE = {
  alwaysShowAllBtns: false,
  hideSizePerPage: true,
  firstPageText: '<<',
  prePageText: '<',
  nextPageText: '>',
  lastPageText: '>>',
  showTotal: false
};

class Constant {

  static get NOMINA_API() {
    return NOMINA_API;
  }
  
  //Table options
  static get OPTIONS_TABLE() {
    return OPTIONS_TABLE;
  }

  //General
  static get DATE_FORMAT() {
    return DATE_FORMAT;
  }  
}

export default Constant;
