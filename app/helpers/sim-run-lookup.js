import Ember from 'ember';

// params list
// 0 object
// 1 id
// 2 time or week

export function simRunLookup(params/*, hash*/) {
  var object = params[0]
  var id = params[1]
  var time = params[2]
  if (object) {
    return object[id].data.result[time]
  }
}
export default Ember.Helper.helper(simRunLookup);
