import * as convertTime from '../common/convert-time'

/**
* this function and assosiated functions takes an array of projects and uses the financial information and time information to create datasets that represent global cashflow.
*
* @method processProjects
* @param {Object} opts
*   @param {Object} opts.metadata
*   @param {Projects} opts.projects
* @return {Object} populated datasctructures
*/
export default function processProjects (opts) {
  var metadata = opts.metadata
  var projects = opts.projects

  // needs : start, end, units,
  var researchSkeleton = makeSkeleton( { metadata : metadata } )
  var devSkeleton = makeSkeleton( { metadata : metadata } )
  var ongoingCostSkeleton = makeSkeleton( { metadata : metadata } )
  var capitalisationSkeleton = makeSkeleton( { metadata : metadata } )
  var fuelTankSkeleton = makeSkeleton( { metadata : metadata } )

  var capexSkeleton = makeSkeleton( { metadata : metadata } )
  var opexSkeleton = makeSkeleton( { metadata : metadata } )



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

/**
* this method destructively modifies the provided data structures. It controls the interegation of the projects and populates the datastructures with the desired information
*
* @method populateSkeletons
* @param {Object} opts
*   @param {Object} opts.fuelTankSkeleton
*   @param {Object} opts.capexSkeleton
*   @param {Object} opts.opexSkeleton
*   @param {Object} opts.projects
*   @param {Object} opts.metadata
*/
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

      //////////////////////////////////////////////////////
      // CAPITALISATION
      //////////////////////////////////////////////////////

      var capitalisationAmount = phaseTotalCost * phase.capitalization

      var capitalisationStart = convertTime.incrementTimeBy1({
        time : phase.end_date
      })

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
  })

  var availableFunds = metadata.availableFunds

  drainFuelTank({
    fuelTankSkeleton : fuelTankSkeleton,
    toSubtract : [ opts.capexSkeleton ],
    maxValue : maxValue,
    availableFunds : availableFunds
  })


}

/**
* This method destructively modifies the provided datasctructutre `fuelTankSkeleton`. It tops up the fuel tank every year with `availableFunds`. It subtracts the datastructures in the `toSubtract` array from the fuelTank data structure.
*
* @method drainFuelTank
* @param {Object} opts
*   @param {Array} opts.toSubtract datasctructures to subtract from the fueltank
*   @param {Object} opts.fuelTankSkeleton
*   @param {Number} opts.availableFunds
*   @param {Number} opts.maxValue year devision default 4
*/
function drainFuelTank (opts) {
  var toSubtract = opts.toSubtract
  var fuelTankSkeleton = opts.fuelTankSkeleton
  var yearlyFunds = opts.availableFunds
  var maxValue = opts.maxValue || 4
  var availableFunds = 0

  _.forEach(fuelTankSkeleton, function (data, year) {
    _.forEach(data, function (expenditure, month) {
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

/**
* This method destructively modifies the provided datasctructutre skeleton, adding the installment value to each datum between start and end dates.
*
* @method distributeCost
* @param {Object} opts
*   @param {Object} opts.skeleton
*   @param {Object} opts.start
*   @param {Object} opts.end
*   @param {Number} opts.installment
*   @param {Number} opts.maxValue year devision default 4
*/
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

/**
* this function creates a datastructure that represents the timeframe of the metadata. The returned datastructure is made up of values of `0`
*
* @method makeSkeleton
* @param {Object} opts
*   @param {Object} opts.metadata
* @return {Object} datasctructure of zeros
*/
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

// this function decides how many year devisions there are.
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
