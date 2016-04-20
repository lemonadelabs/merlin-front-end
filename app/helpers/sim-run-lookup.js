import Ember from 'ember';

// params list
// 0 object
// 1 id
// 2 month

export function simRunLookup(params/*, hash*/) {
  var object = params[0]
  var id = params[1]
  var month = params[2]
  if (object) {
    return (object[id].data.value) ? object[id].data.value[month - 1] : object[id].data.result[month - 1]

    // console.log(object[id])
    // return object[id].data.result[month]
  }
}
export default Ember.Helper.helper(simRunLookup);
