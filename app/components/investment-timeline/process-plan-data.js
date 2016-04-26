export default function processPlanData (opts) {
  var metadata = opts.metadata
  var timelineObjects = opts.timelineObjects
  var totalExpenditureSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var investmentSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var operationalSkeleton = makeSkeleton( { metadata : opts.metadata } )
  populateSkeletons({
    totalExpenditureSkeleton : totalExpenditureSkeleton,
    investmentSkeleton : investmentSkeleton,
    operationalSkeleton : operationalSkeleton,
    timelineObjects : timelineObjects,
    metadata : metadata
  })
  return {
    investment : investmentSkeleton,
    operational : operationalSkeleton,
    totalExpenditure : totalExpenditureSkeleton
  }

}

function populateSkeletons(opts) {
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
      totalExpenditureSkeleton : opts.totalExpenditureSkeleton,
      investmentSkeleton : opts.investmentSkeleton,
      operationalSkeleton : opts.operationalSkeleton,
      installment : installment,
      timelineObject : timelineObject,
      maxValue : maxValue
    })
  })
}

function sigmoid(t) {
  var xMultiplier = 1.3
  var startingYModifier = - 0.5
  var yMultiplier = 1.6
  return ( 1 / ( 1 + Math.pow( Math.E, - ( t * xMultiplier ) ) ) + startingYModifier ) * yMultiplier;
}

function fillSkeletonSingleObject(opts) {
  var installment = opts.installment

  var totalExpenditureSkeleton = opts.totalExpenditureSkeleton
  var investmentSkeleton = opts.investmentSkeleton
  var operationalSkeleton = opts.operationalSkeleton
  var timelineObject = opts.timelineObject
  var maxValue = opts.maxValue
  var start = timelineObject.start
  var end = timelineObject.end

  var itterate = 0

  if (start.year === end.year) {
    for (var j = start.value; j <= end.value; j++) {
      totalExpenditureSkeleton[start.year][j] += installment
      investmentSkeleton[start.year][j] += installment * sigmoid(itterate)
      operationalSkeleton[start.year][j] += installment - investmentSkeleton[start.year][j]
      itterate += 1
    }
    return
  }

  for (var i = start.year; i <= end.year; i++) {
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        totalExpenditureSkeleton[i][j] += installment
        investmentSkeleton[i][j] += installment * sigmoid(itterate)
        operationalSkeleton[i][j] += installment - investmentSkeleton[i][j]
        itterate += 1
      }
    } else if (i === end.year) {
      for (var j = 1; j < end.value; j++) {
        totalExpenditureSkeleton[i][j] += installment
        investmentSkeleton[i][j] += installment * sigmoid(itterate)
        operationalSkeleton[i][j] += installment - investmentSkeleton[i][j]
        itterate += 1
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        totalExpenditureSkeleton[i][j] += installment
        investmentSkeleton[i][j] += installment * sigmoid(itterate)
        operationalSkeleton[i][j] += installment - investmentSkeleton[i][j]
        itterate += 1
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
