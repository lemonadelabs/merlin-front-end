import * as convertTime from '../common/convert-time'

export default function ProjectProcessor (opts) {
  this.metadata = opts.metadata
  this.trees = makeDataTrees(opts.metadata)
  this.labels = undefined
}

function makeDataTrees(metadata) {
  var tree = makeDataTree( metadata )
  return {
    fuelTankTree :  tree,
    capexTree : _.cloneDeep( tree ),
    opexTree : _.cloneDeep( tree ),
    totalInvestmentTree : _.cloneDeep( tree ),
    ongoingCostTree : _.cloneDeep( tree ),
    capitalisationTree : _.cloneDeep( tree )
  }
};

ProjectProcessor.prototype.process = function(projects) {
  var trees = this.resetTrees(this.trees)
  trees = this.populateDataTrees(projects, trees)
  if (!this.labels) { this.makeLabels(trees.totalInvestment) }
  var flattened = this.flattenData(trees)
  flattened.labels = this.labels
  var formatted = this.unshiftValue(flattened)
  console.log(formatted)
  return formatted
};

ProjectProcessor.prototype.unshiftValue = function(datasets) {
  _.forEach(datasets, function (dataset, name) { // add a value on to the begining of the dataset, for layout reasons
    if (name === 'labels') return
    dataset.unshift(0)
  })
  datasets.remainingFunds[0] = this.metadata.availableFunds

  return datasets
};

ProjectProcessor.prototype.resetTrees = function(trees) {
  _.forEach(trees, this.resetTree)
  return trees
};

ProjectProcessor.prototype.resetTree = function(tree) {
  _.forEach(tree, function (data, year) {
    _.forEach(data, function (datum, yearDevision) {
      tree[year][yearDevision] = 0
    })
  })
};

ProjectProcessor.prototype.makeLabels = function(tree) {
  var labels = []
  _.forEach(tree, function (data, year) {
    _.forEach(data, function (expenditure, month) {
      if (month.length === 1) {month = '0' + String(month)}
      labels.push( `${year}/${month}` )
    })
  })
  labels.unshift(0)
  this.labels = labels
};

ProjectProcessor.prototype.flattenData = function(trees) {
  var sortedData = {}
  _.forEach(trees, function (dataset, name) {
    sortedData[name] = []
    _.forEach(dataset, function (data, year) {
      _.forEach(data, function (expenditure, month) {
        sortedData[name].push( expenditure )
      })
    })
  })
  return sortedData
};

ProjectProcessor.prototype.populateDataTrees = function(projects, trees) {

  var fuelTankTree = trees.fuelTankTree
  var capexTree = trees.capexTree
  var opexTree = trees.opexTree
  var totalInvestmentTree = trees.totalInvestmentTree
  var ongoingCostTree = trees.ongoingCostTree
  var capitalisationTree = trees.capitalisationTree

  var metadata = this.metadata
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
        tree : capexTree,
        start : phase.start_date,
        end : phase.end_date,
        installment : capexInstallment,
      })

      distributeCost({
        tree : opexTree,
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
        tree : capitalisationTree,
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
        tree : ongoingCostTree,
        start : ongoingCostStart,
        end : ongoingCostEnd,
        installment : ongoingCostInstallment
      })

    })

    aggregateTotalInvestment({
      capexTree : capexTree,
      opexTree : opexTree,
      totalInvestmentTree : totalInvestmentTree
    })

  })

  var availableFunds = this.metadata.availableFunds

  drainFuelTank({
    fuelTankTree : fuelTankTree,
    toSubtract : [ capexTree ],
    maxValue : maxValue,
    availableFunds : availableFunds
  })


  return  {
    remainingFunds : fuelTankTree,
    // capex : capitalisationTree,
    // opex : opexTree,
    totalInvestment : totalInvestmentTree,

    // capitalisation : capitalisationTree,
    ongoingCost : ongoingCostTree,
  }

}


function aggregateTotalInvestment (opts) {
  var capexTree = opts.capexTree
  var opexTree = opts.opexTree
  var totalInvestmentTree = opts.totalInvestmentTree
  _.forEach(totalInvestmentTree, function (data, year) {
    _.forEach(data, function (datum, yearDevision) {
      totalInvestmentTree[year][yearDevision] += ( capexTree[year][yearDevision] + opexTree[year][yearDevision] )
    })
  })
}

function drainFuelTank (opts) {
  var toSubtract = opts.toSubtract
  var fuelTankTree = opts.fuelTankTree
  var yearlyFunds = opts.availableFunds
  var maxValue = opts.maxValue || 4
  var availableFunds

  _.forEach(fuelTankTree, function (data, year) {
    _.forEach(data, function (expenditure, month) {
      if ( Number( month ) === 1 ) {
        availableFunds = yearlyFunds
      }

      // console.log(availableFunds)

      _.forEach(toSubtract, function (dataset) {
        availableFunds -= dataset[year][month]
      })

      /*jshint eqeqeq: true */
      // if (  Number( month ) == maxValue) {
      //   if (availableFunds > 0) { availableFunds = 0 }
      // }

      fuelTankTree[year][month] = availableFunds
    })
  })
}

function distributeCost(opts) {
  var tree = opts.tree
  var start = opts.start
  var end = opts.end
  var installment = opts.installment
  var maxValue = opts.maxValue || 4

  var itterate = 0

  var i, j
  if (start.year === end.year) {
    for (j = start.value; j <= end.value; j++) {
      tree[start.year][j] += installment
      itterate += 1
    }
    return
  }

  for (i = start.year; i <= end.year; i++) {
    if (i === start.year) {
      for (j = start.value; j <= maxValue; j++) {
        tree[i][j] += installment
        itterate += 1
      }
    } else if (i === end.year) {
      for (j = 1; j <= end.value; j++) {
        tree[i][j] += installment
        itterate += 1
      }
    } else {
      for (j = 1; j <= maxValue; j++) {
        tree[i][j] += installment
        itterate += 1
      }
    }
  }
}

function makeDataTree(metadata) {
  var start = metadata.start
  var end = metadata.end
  var units = metadata.units

  var maxValue = getMaxValue(units)
  var tree = {}

  for (var i = start.year; i <= end.year; i++) {
    tree[i] = {}
    if (i === start.year) {
      for (var j = start.value; j <= maxValue; j++) {
        tree[i][j] = 0
      }
    } else if (i === end.year) {
      for (var j = 1; j <= end.value; j++) {
        tree[i][j] = 0
      }
    } else {
      for (var j = 1; j <= maxValue; j++) {
        tree[i][j] = 0
      }
    }
  }
  return tree
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

