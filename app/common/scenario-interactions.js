import * as convertTime from './convert-time-es6'
import putJSON from './put-json'

export function updatePhaseTimes(data) {
  // get old start_date
  var getRequst = Ember.$.getJSON(`api/projectphases/${data.id}`)
  getRequst.then(function (oldPhase) {

    // calc clicks between old and new start_date
    var beginningPhaseMoved = convertTime.clicksBetween({
      a : oldPhase.start_date,
      b : data.start_date
    })

    var endPhaseMoved = convertTime.clicksBetween({
      a : oldPhase.end_date,
      b : data.end_date
    })

    console.log('beginning moved: ', beginningPhaseMoved)
    console.log('end moved: ', endPhaseMoved)

    // convertTime.convertTimesInObject(data)
    // update the phase with new date
    // update the scenario offset with phase.scenario


    // return putJSON({
    //   data : data,
    //   url : `api/projectphases/${data.id}/`
    // })

  })

}