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

export function createInvertedAction (opts) {
  var action = _.cloneDeep(opts.action)
  action.operand_2.params[1] = (action.operand_2.params[1]) * ( -1 )
  return action
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