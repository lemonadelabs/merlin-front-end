import Ember from 'ember';
import commaSeperate from '../common/commaSeperateNumber';
export function commaSeperateNumber(params, hash) {
  console.log(hash);
  return commaSeperate(hash.number);
}

export default Ember.Helper.helper(commaSeperateNumber);
