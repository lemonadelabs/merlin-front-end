import Ember from 'ember';
import toTwoDP from '../common/toTwoDP';
import commaSeperateNumber from '../common/commaSeperateNumber';

// params list
// 0 object
// 1 id
// 2 month

export function simRunLookup(params/*, hash*/) {
  let object = params[0],
      id = params[1],
      month = params[2],
      objectData
  console.log(month)
  if (object) {
    if (!object[id]) {
      console.warn('there is no telemetry data for this query')
      return undefined
    }
    objectData = (object[id].data.value) ? object[id].data.value[month - 1] : object[id].data.result[month - 1]
  }

  if(objectData){
    objectData = toTwoDP(objectData);
    objectData = commaSeperateNumber(objectData)
  }

  return objectData;
}
export default Ember.Helper.helper(simRunLookup);
