/**
* useful misc merlin-specific functions.
* @module merlin-utils
*/


/**
* takes a set of telemetry information in monththly devisions, and returns the information in quarterly devisions
*
* @method convertDatasetToQuarters
* @param {Object} opts
*   @param {Array} opts.dataset
* @return {Array} dataset
*/

export function convertDatasetToQuarters(opts) {
  var dataset = opts.dataset
  var returnData = []
  var remainder = dataset.length % 3

  for (var i = 0; i < dataset.length; i++) {
    var index = Math.floor(i/3)
    if (!returnData[index]) { returnData[index] = 0 }
    var denominator = (i < dataset.length - remainder) ? 3 : remainder ;
    returnData[index] += dataset[i] / denominator
  }
  return returnData
}

/**
* constructs a url to the simulation-run endpoint for a given simulation and set of scenario ids
*
* @simulationRunUrl
* @param {Object} opts
*   @param {Number} opts.simulationId
*   @param {Array} opts.scenarioIds
* @return {String} url
*/
export function simulationRunUrl(opts) {
  var scenarioIds = opts.scenarioIds
  var simulationId = opts.simulationId
  var timeframe = opts.timeframe
  var url = `api/simulation-run/${simulationId}/?steps=${timeframe}`
  _.forEach(scenarioIds, function (scenarioId, itterate) {
    url += `&s${itterate}=${scenarioId}`
  })
  return url
  // 'api/simulation-run/' + id + '/?steps=' + timeframe + '&s0=' + baselineId (example url)
}

/**
* creates a `modify process property` action
*
* @method createModifyProcessAction
* @param {Object} opts
*   @param {Number} opts.entityId
*   @param {Boolean} opts.revert
*   @param {Object} opts.newProcessProperty
*   @param {Number} opts.processPropertyId
*   @param {Numeber or String} opts.newValue
*   @param {Numeber or String} opts.oldValue

* @return {Object} json packet action
*/
export function createModifyProcessAction(opts) {
  var entityId = opts.entityId
  var props, value, processPropertyId
  var revert = opts.revert

  if (opts.newProcessProperty) {
    var newProcessProperty = opts.newProcessProperty

    value = opts.newProcessProperty.change
    processPropertyId = newProcessProperty.id
    props = { 'additive' : true }
  } else {
    processPropertyId = opts.processPropertyId
    var newValue = Number( opts.newValue )
    var oldValue = Number( opts.oldValue )

    if (oldValue) {
      value = newValue - oldValue
      props = { 'additive' : true }
    } else {
      value = newValue
      props = null
    }
  }

  if(revert){
    value = value * -1
  }

  return {
    "op": ":=",
    "operand_1": {
      "type": "Entity",
      "params": [ entityId ],
      "props": null
    },
    "operand_2": {
      "type": "Property",
      "params": [ processPropertyId, value ],
      "props": props
    }
  }
}

/**
* takes an action, and returns an action with the inverse effect
*
* @method createInvertedAction
* @param {Object} opts
*   @param {Object} opts.action
* @return {Object} inverted action
*/

export function createInvertedAction (opts) {
  var action = _.cloneDeep(opts.action)
  action.operand_2.params[1] = (action.operand_2.params[1]) * ( -1 )
  return action
}

/**
* @method newEventObject
* @param {Object} opts
*   @param {Number} opts.scenarioId
*   @param {Number} opts.time
* @return {Object} event object
*/
export function newEventObject(opts) {
  var scenarioId = opts.scenarioId,
      time = opts.time

  return {
    "scenario" : `http://192.168.99.100:8000/api/scenarios/${scenarioId}/`,
    "time" : String(time),
    "actions" : []
  }
}