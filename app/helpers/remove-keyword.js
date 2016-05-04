import Ember from 'ember';

export function removeKeyword(params/*, hash*/) {
  let string = params[0],
      keyword = params[1]
  if(string.includes(keyword)){
    string = string.replace(keyword, "")
  }
  return string;
}

export default Ember.Helper.helper(removeKeyword);
