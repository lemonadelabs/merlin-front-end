export default function processProjects (opts) {
  var metadata = opts.metadata
  var projects = opts.projects
  // var totalInvestmentSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var researchSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var devSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var ongoingCostSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var capitalisationSkeleton = makeSkeleton( { metadata : opts.metadata } )

  populateSkeletons({
    // totalInvestmentSkeleton : totalInvestmentSkeleton,
    researchSkeleton : researchSkeleton,
    devSkeleton : devSkeleton,
    ongoingCostSkeleton : ongoingCostSkeleton,
    capitalisationSkeleton : capitalisationSkeleton,

    projects : projects,
    metadata : metadata
  })

  return {
    research : researchSkeleton,
    dev : devSkeleton,
    ongoingCost : ongoingCostSkeleton,
    capitalisation : capitalisationSkeleton
  }

}

function populateSkeletons(opts) {
  var projects = opts.projects
  var metadata = opts.metadata
  var units = metadata.units
  var maxValue = getMaxValue(units)

  _.forEach(projects, function (project) {

    ////////////////////////////////////////////////////////
    // RESEARCH COST
    ////////////////////////////////////////////////////////

    var researchCost = project.research.cost
    var researchStart = project.research.start
    var researchEnd = project.research.end
    var researchNoOfInstallments = findNoOfInstallments({
      start : researchStart,
      end : researchEnd,
      maxValue : maxValue
    })
    var researchinstallment = researchCost / researchNoOfInstallments

    distributeCost({
      skeleton : opts.researchSkeleton,
      start : researchStart,
      end : researchEnd,
      installment : researchinstallment,
      maxValue : maxValue
    })

    ////////////////////////////////////////////////////////
    // DEV COST
    ////////////////////////////////////////////////////////

    var devCost = project.development.cost
    var devStart = project.development.start
    var devEnd = project.development.end
    var devNoOfInstallments = findNoOfInstallments({
      start : devStart,
      end : devEnd,
      maxValue : maxValue
    })
    var devinstallment = devCost / devNoOfInstallments

    distributeCost({
      skeleton : opts.devSkeleton,
      start : devStart,
      end : devEnd,
      installment : devinstallment,
      maxValue : maxValue
    })

    ////////////////////////////////////////////////////////
    // CAPITALISATION
    ////////////////////////////////////////////////////////

    var devCost = project.development.cost
    var capitalisationAmount = devCost * 0.75

    // var capitalisationStart = incrementTimeBy1({
    //   time : project.development.end,
    //   maxValue : maxValue
    // })
    var capitalisationStart = project.development.end

    var capitalisationEnd = metadata.end

    distributeCost({
      skeleton : opts.capitalisationSkeleton,
      start : capitalisationStart,
      end : capitalisationEnd,
      installment : capitalisationAmount,
      maxValue : maxValue
    })

    ////////////////////////////////////////////////////////
    // ONGOING COST
    ////////////////////////////////////////////////////////

    var ongoingCostYearly = capitalisationAmount * 0.25
    var ongoingCostInstallment = ongoingCostYearly / maxValue
    var ongoingCostStart = capitalisationStart
    var ongoingCostEnd = metadata.end

    distributeCost({
      skeleton : opts.ongoingCostSkeleton,
      start : ongoingCostStart,
      end : ongoingCostEnd,
      installment : ongoingCostInstallment,
      maxValue : maxValue
    })
  })
}


function incrementTimeBy1(opts) {
  var time = _.cloneDeep(opts.time)
  if (time.value === opts.maxValue) {
    time.year +=1
    time.value = 1
  } else {
    time.value += 1
  }
  return time
}



function distributeCost(opts) {
  var skeleton = opts.skeleton
  var start = opts.start
  var end = opts.end
  var installment = opts.installment
  var maxValue = opts.maxValue

  var itterate = 0

  if (start.year === end.year) {
    for (var j = start.value; j <= end.value; j++) {
      skeleton[start.year][j] += installment
      itterate += 1
    }
    return
  }

  for (var i = start.year; i <= end.year; i++) {
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    } else if (i === end.year) {
      for (var j = 1; j <= end.value; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    }
  }
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
      for (var j = 1; j <= end.value; j++) {
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
      for (var j = 1; j <= end.value; j++) {
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
      for (var j = 1; j <= end.value; j++) {
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

// function sigmoid(t) {
//   var xMultiplier = 1.3
//   var startingYModifier = - 0.5
//   var yMultiplier = 1.6
//   return ( 1 / ( 1 + Math.pow( Math.E, - ( t * xMultiplier ) ) ) + startingYModifier ) * yMultiplier;
// }