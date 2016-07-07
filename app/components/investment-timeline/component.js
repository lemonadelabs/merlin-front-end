import Ember from 'ember';
import ProjectProcessor from '../../business-logic/process-timeline-objects'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import Tooltip from '../lemonade-chart/tooltip';
import ChartParameters from '../lemonade-chart/chartParameters';
import truncateBigNumbers from '../../common/truncateBigNumbers';
import * as scenarioInteractions from '../../common/scenario-interactions'
import * as simTraverse from '../../common/simulation-traversal'
import * as projectsTraversal from '../../common/projects-traversal'
import * as merlinUtils from '../../common/merlin-utils'
import toTwoDP from '../../common/toTwoDP';
import commaSeperateNumber from '../../common/commaSeperateNumber';

export default Ember.Component.extend({
  classNames: ['investment-timeline'],
  timelineGridObjects:undefined,
  graphData:undefined,
  outputData:undefined,
  investmentGraph:undefined,
  axes: {},
  axes1Width:undefined,
  axes2Width:undefined,
  hardCodedMetadata: {
    start : {
      year : 2017,
      value : 1
    },
    end : {
      year : 2020,
      value : 4
    },
    units : 'quarters',
    availableFunds: 50000000
  },
  chartInlineStyle:Ember.computed('axes1Width','axes2Width', function () {
    let axes1Width = this.get('axes1Width');
    let axes2Width = this.get('axes2Width');
    let widthOffset = axes1Width + axes2Width
    return Ember.String.htmlSafe(`margin-left:-${axes1Width}px; width:calc(80vw + ${widthOffset}px)`)
  }),
  init: function () {
    this._super();
    this.projectProcessor = new ProjectProcessor({ metadata : this.hardCodedMetadata }),
    // this.processTelemetryData()
    this.set('graphData', this.processAndSortData() )
    this.buildChart()
  },
  didInsertElement: function (){
    Ember.run.next(this,function(){
      let axes = this.get('axes');
      this.set('axes1Width', axes.yAxes1.maxWidth);
      this.set('axes2Width', axes.yAxes2.maxWidth);
    })
  },

  buildChart: function () { // initializes the chart. Is run once on init
    let totalInvestmentColor = 'rgb(255, 255, 255)';
    let remainingFundsColor = 'rgb(129, 65, 255)';
    let axisColor = 'rgb(255, 255, 255)';
    let capitalisationColor = 'rgb(9, 255, 255)'
    let ongoingCostColor = 'rgb(10, 25, 170)'
    let outputsColor = 'rgb(245, 166, 35)'

    let graphData = this.get('graphData');

    let placeholder = new Array(48)

    let remainingFunds = new DataSet('Remaining Funds', placeholder, remainingFundsColor);
    let totalInvestment = new DataSet('Total Investment', placeholder, totalInvestmentColor);
    totalInvestment.setDashType('longDash')
    let ongoingCost = new DataSet('Ongoing Cost', placeholder, ongoingCostColor);
    ongoingCost.setDashType('dotted')
    let outputs = new DataSet('outputs', placeholder, outputsColor);
    outputs.setAxisId('yAxes2')

    let xAxes = new Axes('', axisColor);
    xAxes.hideGridLines();
    xAxes.hideTicks();
    let yAxes1 = new Axes('', axisColor);
    yAxes1.prependToTickLabel('$');
    yAxes1.beginAtZero(false);
    yAxes1.customFormatting(truncateBigNumbers)
    let yAxes2 = new Axes('', axisColor,'yAxes2');
    yAxes2.appendToTickLabel('%');
    yAxes2.beginAtZero(false);
    yAxes2.setPosition('right');
    yAxes2.hideGridLines();

    this.set('axes', {'xAxes': xAxes, 'yAxes1': yAxes1,'yAxes2': yAxes2})

    var dataSets = [
      remainingFunds,
      totalInvestment,
      ongoingCost,
      outputs,
    ]

    let tooltip = new Tooltip()
    tooltip.formatTooltipLabelValue(this.formatTooltipValue)

    let chartParameters = new ChartParameters(dataSets, graphData.labels, [xAxes], [yAxes1,yAxes2], tooltip)
    this.set('investmentGraph', chartParameters)
  },

  recalculateInvestments: function(){ // repaint project graphs
    console.log('recalculateInvestments')
    let processedData = this.processAndSortData()
    // run simulation
    var investmentGraph = this.get('investmentGraph')
    var dataSetIndex = {
      'remainingFunds' : 0,
      // 'capex' : 1,
      // 'opex' : 2,
      'totalInvestment' : 1,
      'ongoingCost' : 2,
      'outputs' : 3,
      // 'capitalisation' : 5,
    }
    _.forEach(processedData, function(value, key){
      let index = dataSetIndex[key];
      if(index !== undefined){
        Ember.set(investmentGraph.data.datasets, `${index}.data`, value);
      }
    });
  },

  formatTooltipValue: function (tooltipItem, data){ // belongs to buildChart
    let valueRounded =  Math.round(tooltipItem.yLabel)
    tooltipItem.yLabel = valueRounded
  },


  processTelemetryData: function () { // loads outputs data, and processes it
                                      // call on chart repaint
    var self = this
    var simulation = this.get('simulation')
    var simRunReq = this.runSimulation()


    simRunReq.then(function (simultionRun) {
      function entityHasMinimumProperty (entity) {
        return _.find(entity.processes, function (process) {
          return _.find(process.properties, function (property) {
            if ( property.name === "Minimum" ) {
              minimumsHash[entity.outputs[0].id] = property.property_value
              return true
            }
          })
        })
      }

      function indexOutputData (telemetry) {
        // belongs to processTelemetryData
        var returnData = []
        var amountDatasets = telemetry.length
        _.forEach(telemetry, function (set) {
          var data = set.data.value
          var minimum = minimumsHash[set.id]
          _.forEach(data, function (datum, i) {
            if (!returnData[i]) { returnData[i] = 0 }
            returnData[i] += ( datum / minimum ) * 100
          })
        })

        returnData = _.map(returnData, function (datum) {
          return datum / amountDatasets
        })
        return returnData
      }

      function recalculateOutputs  (data) {
        // belongs to processTelemetryData
        var investmentGraph = self.get('investmentGraph')
        let index = 3
        if(index !== undefined){
          Ember.set(investmentGraph.data.datasets, `${index}.data`, data);
        }
      }

      if ( simultionRun[simultionRun.length - 1].messages) { self.logErrors(simultionRun.pop().messages) }

      // get the outputs
      var outputEntities = simTraverse.getOutputEntities(self.get('simulation').entities)
      // filter outputs to find the one that is relevant
      var minimumsHash = {}

      var relevantOutputEntities = _.filter(outputEntities, function (e) {
        return entityHasMinimumProperty(e)
      })


      // find the outputTerminalId for the entities
      var outputTerminalIds = _.map(relevantOutputEntities, function (e) {
        return e.outputs[0].id
      })

      // get the telemetry data
      var outputsTelemetry = _.filter(simultionRun, function (telemetry) {
        return _.includes(outputTerminalIds, telemetry.id) && telemetry.type === 'OutputConnector'
      })

      var indexed = indexOutputData( outputsTelemetry )

      var quartered = merlinUtils.convertDatasetToQuarters({ dataset : indexed })
      quartered.unshift(quartered[0])

      self.set('outputData', quartered)

      recalculateOutputs( quartered )
    })
  },


  runSimulation: function() {
    // belongs to processTelemetryData
    var simulationId = this.get('simulation.id')
    var projects = this.get('projects')

    var scenarios = this.get('scenarios')
    var baseline = scenarioInteractions.findBaseline({
      scenarios : scenarios,
      simulationId : simulationId
    })

    var projectScenarioIds = projectsTraversal.getScenarioIds(projects)

    var scenarioIds = _.concat([ baseline.id ], projectScenarioIds)

    var url = merlinUtils.simulationRunUrl({
      scenarioIds : scenarioIds,
      simulationId : simulationId,
      timeframe : 48
    })
    return Ember.$.getJSON(url)
  },

  projectHasBeenAdded: function () { // is run when we get a new project
    this.processTelemetryData()
    this.recalculateInvestments()
  }.observes('projects'),


  processAndSortData: function(){ // this sorts out project stuff
    var projects = this.get('projects')

    var sortedData = this.projectProcessor.process( projects )
    return sortedData;

    // console.log(processedData)

    // var sortedData = {}
    // sortedData.labels = []

    // var labelsNotMadeYet = true
    // _.forEach(processedData, function (dataset, name) {
    //   sortedData[name] = []
    //   _.forEach(dataset, function (data, year) {
    //     _.forEach(data, function (expenditure, month) {
    //       sortedData[name].push( expenditure )
    //       console.log('asdf')

    //       if (labelsNotMadeYet) {
    //         if (month.length === 1) {month = '0' + String(month)}
    //         sortedData.labels.push( `${year}/${month}` )
    //       }
    //     })
    //   })
    //   labelsNotMadeYet = false
    // })

    // _.forEach(sortedData, function (dataset) { // add a value on to the begining of the dataset, for layout reasons
    //   dataset.unshift(0)
    // })
    // sortedData.remainingFunds[0] = 50000000

    // console.log(sortedData)

  },




  persistDatesToBackend: function (opts) {
    var callback = function () {
      this.processTelemetryData()
    }
    scenarioInteractions.updatePhaseTimes( opts, callback.bind(this) )

  },



  logErrors: function (messages) {
    _.forEach( messages, function (message) {
      // console.log(message.time, message.message)
    })
  },

  observeChart:function(){
    let chart = this.get('chart')
    if(chart){
      chart.resize();
    }
  }.observes('chart'),



  actions:{
    onContextMenu: function () {
      console.log('onContextMenu action')
    },


    onTimelineObjectInteractionEnd: function (context) {
      var requests = this.persistDatesToBackend({
        // jshint unused:false
        "id": context.get('id'),
        "start_date": context.get('start'),
        "end_date": context.get('end'),
        scenarioId: context.get('scenarioId')
      })
      this.recalculateInvestments()
    },

  }
});

  // setServiceModels: function () {
  //   console.log('asdfasdfasdfasdfdsafdsfdasf')
  //   var serviceModels = []
  //   var simulation = this.get('simulation')
  //   var parentEntity = this.get('parentEntity')
  //   _.forEach(parentEntity.children, function (childUrl) {
  //     var childId = simTraverse.getIdFromUrl(childUrl)
  //     var serviceModel = _.find(simulation.entities, function (entity) {
  //       /*jshint eqeqeq: true */
  //       return  entity.id == childId
  //     })
  //     serviceModels.push(serviceModel)
  //   })
  //   this.set('serviceModels', serviceModels)
  // }.observes('parentEntity'),
