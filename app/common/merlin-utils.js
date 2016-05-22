export function modifyProcessAction(opts) {
  var entityId = opts.entityId
  var processPropertyId = opts.processPropertyId
  var newValue = Number( opts.newValue )
  var oldValue = Number( opts.oldValue )
  var revert = opts.revert

  var props, value
  if (oldValue) {
    value = newValue - oldValue
    props = { 'additive' : true }
  } else {
    value = newValue
    props = null
  }
  if(revert){
    value = -value
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

export function newEventObject(opts) {
  var scenarioId = opts.scenarioId,
      time = opts.time

  return {
    "scenario" : `http://192.168.99.100:8000/api/scenarios/${scenarioId}/`,
    "time" : String(time),
    "actions" : []
  }
}