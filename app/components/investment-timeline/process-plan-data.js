export default function processPlanData (opts) {
  var metadata = opts.metadata
  var timelineObjects = opts.timelineObjects
  var skeleton = makeSkeleton( { metadata : opts.metadata } )
  var populatedSkeleton = populateSkeleton({
    skeleton : skeleton,
    timelineObjects : timelineObjects,
    metadata : metadata
  })
  // console.log(populatedSkeleton)
  function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
  }

  var total = 0
  for (var i = 0; i < 100; i++) {
    console.log(sigmoid(i))
    total += sigmoid(i)
  };
}

function populateSkeleton(opts) {
  var skeleton = opts.skeleton
  var timelineObjects = opts.timelineObjects
  var metadata = opts.metadata
  var units = metadata.units
  var maxValue = getMaxValue(units)

  _.forEach(timelineObjects, function (timelineObject) {
    var capex = timelineObject.capex
    var start = timelineObject.start
    var end = timelineObject.end
    var noOfcapexInstallments = findNoOfcapexInstallments({
      start : start,
      end : end,
      maxValue : maxValue
    })

    var capexInstallment = capex / noOfcapexInstallments

    fillSkeletonSingleObject({
      capexInstallment : capexInstallment,
      skeleton : skeleton,
      timelineObject : timelineObject,
      maxValue : maxValue
    })
  })
  return skeleton
}

function fillSkeletonSingleObject(opts) {
  var capexInstallment = opts.capexInstallment
  var skeleton = opts.skeleton
  var timelineObject = opts.timelineObject
  var maxValue = opts.maxValue
  var start = timelineObject.start
  var end = timelineObject.end

  if (start.year === end.year) {
    for (var j = start.value; j <= end.value; j++) {
      skeleton[start.year][j] += capexInstallment
    }
    return
  }

  for (var i = start.year; i <= end.year; i++) {
    // skeleton[i] = {}
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        skeleton[i][j] += capexInstallment
      }
    } else if (i === end.year) {
      for (var j = 1; j < end.value; j++) {
        skeleton[i][j] += capexInstallment
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        skeleton[i][j] += capexInstallment
      }
    }
  }
  return
}

function findNoOfcapexInstallments(opts) {
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