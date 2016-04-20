import Helper from 'ember-helper';
import { htmlSafe } from 'ember-string';

export default Helper.extend({
  compute(params) {
    let string = params[0];
    console.log(htmlSafe(string));
    return htmlSafe(string);
  }
});
