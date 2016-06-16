import * as convertTime from './convert-time'

export function getScenarioIds (projects) {
  var phases = getPhasesFromProjects( projects )
  var phasesSorted = sortProjectphasesCronologically( phases )
  return getScenarioIdsFromPhases( phasesSorted )
}

function getPhasesFromProjects(projects) {
  return _.flatten ( _.map( projects, function ( project ) { return project.phases }) )
}

function sortProjectphasesCronologically(phases) {
  return _.sortBy(phases, function (phase) {
    return Number( convertTime.quarterToBackend({ time : phase.start_date }).replace(/-/g,'') )
  })
}

function getScenarioIdsFromPhases (phases) {
  return _.map(phases, function (phase) {
    return phase.scenario
  })
}
