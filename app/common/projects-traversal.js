export function getScenarioIds (projects) {
  var scenarios = []
  _.forEach( projects, function ( project ) {
    _.forEach(project.phases, function ( phase ) {
      scenarios.push(phase.scenario)
    })
  })
  return scenarios
}

