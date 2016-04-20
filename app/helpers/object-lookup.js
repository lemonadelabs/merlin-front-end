import Ember from 'ember';

export function objectLookup(params/*, hash*/) {
  var object = params[0]
  var key = params[1]
  return object[key];
}

export default Ember.Helper.helper(objectLookup);
