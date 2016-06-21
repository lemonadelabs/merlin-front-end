import * as convertTime from '../common/convert-time'

export default function processProjects (opts) {
  var metadata = opts.metadata
  var projects = opts.projects

  // needs : start, end, units,
  var researchSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var devSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var ongoingCostSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var capitalisationSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var fuelTankSkeleton = makeSkeleton( { metadata : opts.metadata } )

  var capexSkeleton = makeSkeleton( { metadata : opts.metadata } )
  var opexSkeleton = makeSkeleton( { metadata : opts.metadata } )



  populateSkeletons({
    researchSkeleton : researchSkeleton,
    devSkeleton : devSkeleton,
    ongoingCostSkeleton : ongoingCostSkeleton,
    capitalisationSkeleton : capitalisationSkeleton,
    fuelTankSkeleton : fuelTankSkeleton,
    capexSkeleton : capexSkeleton,
    opexSkeleton : opexSkeleton,

    projects : projects,
    metadata : metadata
  })

  return {
    remainingFunds : fuelTankSkeleton,
    capex : capexSkeleton,
    opex : opexSkeleton,

    capitalisation : capitalisationSkeleton,
    ongoingCost : ongoingCostSkeleton,

  }

}

function populateSkeletons(opts) {
  var fuelTankSkeleton = opts.fuelTankSkeleton
  var capexSkeleton = opts.capexSkeleton
  var opexSkeleton = opts.opexSkeleton

  var projects = opts.projects
  var metadata = opts.metadata
  var units = metadata.units
  var maxValue = getMaxValue(units)

  _.forEach(projects, function (project) {
    var projectTotalCost = 0
    var lastPhaseEnd
    _.forEach(project.phases, function (phase) {
      var opex = phase.service_cost
      var capex = phase.investment_cost
      var phaseTotalCost = capex + opex
      projectTotalCost += phaseTotalCost
      lastPhaseEnd = phase.end_date

      var installments = findNoOfInstallments({
        start : phase.start_date,
        end : phase.end_date,
      })

      var capexInstallment = capex / installments
      var opexInstallment = opex / installments

      distributeCost({
        skeleton : capexSkeleton,
        start : phase.start_date,
        end : phase.end_date,
        installment : capexInstallment,
      })

      distributeCost({
        skeleton : opexSkeleton,
        start : phase.start_date,
        end : phase.end_date,
        installment : opexInstallment,
      })
    })

    //////////////////////////////////////////////////////
    // CAPITALISATION
    //////////////////////////////////////////////////////

    var capitalisationAmount = projectTotalCost * 0.4

    var capitalisationStart = convertTime.incrementTimeBy1({
      time : lastPhaseEnd
    })
    // var capitalisationStart = lastPhaseEnd

    var capitalisationEnd = metadata.end

    distributeCost({
      skeleton : opts.capitalisationSkeleton,
      start : capitalisationStart,
      end : capitalisationEnd,
      installment : capitalisationAmount
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
      installment : ongoingCostInstallment
    })
  })

  var availableFunds = metadata.availableFunds

  drainFuelTank({
    fuelTankSkeleton : fuelTankSkeleton,
    toSubtract : [ opts.capexSkeleton ],
    maxValue : maxValue,
    availableFunds : availableFunds
  })


}

function drainFuelTank (opts) {
  var toSubtract = opts.toSubtract
  var fuelTankSkeleton = opts.fuelTankSkeleton
  var yearlyFunds = opts.availableFunds
  var maxValue = opts.maxValue || 4
  var availableFunds = 0

  _.forEach(fuelTankSkeleton, function (data, year) {
    _.forEach(data, function (expenditure, month) {
      console.log(typeof month)
      if ( Number( month ) === 1 ) {
        availableFunds += yearlyFunds
      }

      _.forEach(toSubtract, function (dataset) {
        availableFunds -= dataset[year][month]
      })

      /*jshint eqeqeq: true */
      if (  Number( month ) == maxValue) {
        if (availableFunds > 0) { availableFunds = 0 }
      }

      fuelTankSkeleton[year][month] = availableFunds
    })
  })
}

function distributeCost(opts) {
  var skeleton = opts.skeleton
  var start = opts.start
  var end = opts.end
  var installment = opts.installment
  var maxValue = opts.maxValue || 4

  var itterate = 0

  var i, j
  if (start.year === end.year) {
    for (j = start.value; j <= end.value; j++) {
      skeleton[start.year][j] += installment
      itterate += 1
    }
    return
  }

  for (i = start.year; i <= end.year; i++) {
    if (i === start.year) {
      for (j = start.value; j <= maxValue; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    } else if (i === end.year) {
      for (j = 1; j <= end.value; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    } else {
      for (j = 1; j <= maxValue; j++) {
        skeleton[i][j] += installment
        itterate += 1
      }
    }
  }
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
  var maxValue = opts.maxValue || 4
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