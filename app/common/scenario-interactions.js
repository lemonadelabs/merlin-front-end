import * as convertTime from './convert-time-es6'
import putJSON from './put-json'

export function findBaseline(opts) {
  var scenarios = opts.scenarios
  var simulationId = opts.simulationId
  var simSubstring = `api/simulations/${simulationId}/`

  return _.find(scenarios, function (scenario) {
    return  ( _.includes(scenario.sim, simSubstring) && scenario.name === 'baseline')
  })
}

export function updatePhaseTimes(data, callback) {
  // get old start_date
  var requests = []
  var phaseRequst = Ember.$.getJSON(`api/projectphases/${data.id}`)
  phaseRequst.then(function (oldPhase) {
    var scenarioRequest = Ember.$.getJSON(`api/scenarios/${oldPhase.scenario}`)
    scenarioRequest.then(function (oldScenario) {

      var oldPhaseLength = convertTime.clicksBetween({
        a : oldPhase.start_date,
        b : oldPhase.end_date
      })

      var newPhaseLength = convertTime.clicksBetween({
        a : data.start_date,
        b : data.end_date
      })

      // calc clicks between old and new start_date
      var beginningPhaseMoved = convertTime.clicksBetween({
        a : oldPhase.start_date,
        b : data.start_date
      })

      var phaseTimes = {
        start_date : convertTime.quarterToBackend({time : data.start_date}),
        end_date : convertTime.quarterToBackend({
          time : data.end_date.
          isEndDate : true
        }),
      }
      // update the phase with new time data
      var phaseReq = putJSON({
        data : phaseTimes,
        url : `api/projectphases/${data.id}/`
      })
      requests.push(phaseReq)

      oldScenario.start_offset +=  beginningPhaseMoved

      var index
      var highest = 0
      _.forEach(oldScenario.events, function (event, i) {
        if (event.time > highest) {
          highest = event.time
          index = i
        }
      })

      if (highest === 1) {
        index = oldScenario.events.length - 1
        console.warn('both events are happening at the same time. we dont now which event is the end event.')
      }
      var endEvent = oldScenario.events[index]

      endEvent.time = newPhaseLength


      var endEventReq = putJSON({
        data : endEvent,
        url : `api/events/${endEvent.id}/`
      })
      requests.push(endEventReq)


      var scenarioReq = putJSON({
        data : oldScenario,
        url : `api/scenarios/${oldScenario.id}/`
      })
      requests.push(scenarioReq)

      var promisesReturned = 0
      _.forEach( requests, function (request) {
        request.then(function (response) {
          promisesReturned ++
          if (promisesReturned === requests.length) { callback() }
        })
      })



    })
  })
}