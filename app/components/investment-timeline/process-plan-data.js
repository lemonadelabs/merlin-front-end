export default function processPlanData (opts) {
  var metadata = opts.metadata
  var timelineObjects = opts.timelineObjects
  var skeleton = makeSkeleton( { metadata : opts.metadata } )
  var populatedSkeleton = populateSkeleton({
    skeleton : skeleton,
    timelineObjects : timelineObjects,
    metadata : metadata
  })
  return populatedSkeleton
}

function populateSkeleton(opts) {
  var skeleton = opts.skeleton
  var timelineObjects = opts.timelineObjects
  var metadata = opts.metadata
  var units = metadata.units
  var maxValue = getMaxValue(units)

  _.forEach(timelineObjects, function (timelineObject) {
    var investment = timelineObject.capex
    var operational = investment / 3
    var totalExpenditure = operational + investment

    var start = timelineObject.start
    var end = timelineObject.end
    var noOfInstallments = findNoOfInstallments({
      start : start,
      end : end,
      maxValue : maxValue
    })

    var installment = totalExpenditure / noOfInstallments

    fillSkeletonSingleObject({
      installment : installment,
      skeleton : skeleton,
      timelineObject : timelineObject,
      maxValue : maxValue
    })
  })
  return skeleton
}

function fillSkeletonSingleObject(opts) {
  var installment = opts.installment
  var skeleton = opts.skeleton
  var timelineObject = opts.timelineObject
  var maxValue = opts.maxValue
  var start = timelineObject.start
  var end = timelineObject.end

  if (start.year === end.year) {
    for (var j = start.value; j <= end.value; j++) {
      skeleton[start.year][j] += installment
    }
    return
  }

  for (var i = start.year; i <= end.year; i++) {
    // skeleton[i] = {}
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        skeleton[i][j] += installment
      }
    } else if (i === end.year) {
      for (var j = 1; j < end.value; j++) {
        skeleton[i][j] += installment
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        skeleton[i][j] += installment
      }
    }
  }
  return
}

function findNoOfInstallments(opts) {
  var start = opts.start
  var end = opts.end
  var units = opts.units
  var maxValue = opts.maxValue
  var installments = 0

  if (start.year === end.year) {
    for (var j = start.value; j <= end.value; j++) {
      installments += 1
    }
    return installments
  }

  for (var i = start.year; i <= end.year; i++) {
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        installments += 1
      }
    } else if (i === end.year) {
      for (var j = 1; j < end.value; j++) {
        installments += 1
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        installments += 1
      }
    }
  }
  return installments
}

function makeSkeleton(opts) {
  var metadata = opts.metadata
  var start = metadata.start
  var end = metadata.end
  var units = metadata.units

  var maxValue = getMaxValue(units)
  var skeleton = {}

  for (var i = start.year; i <= end.year; i++) {
    skeleton[i] = {}
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        skeleton[i][j] = 0
      }
    } else if (i === end.year) {
      for (var j = 1; j < end.value; j++) {
        skeleton[i][j] = 0
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        skeleton[i][j] = 0
      }
    }
  }
  return skeleton
}

function getMaxValue (units) {
  if (units === 'months') {
    return 12
  } else if (units === 'quarters') {
    return 4
  }
}