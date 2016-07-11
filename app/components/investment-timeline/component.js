import Ember from 'ember';
import processProjects from '../../business-logic/process-timeline-objects'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import Tooltip from '../lemonade-chart/tooltip';
import ChartParameters from '../lemonade-chart/chartParameters';
import truncateBigNumbers from '../../common/truncateBigNumbers';
import * as scenarioInteractions from '../../common/scenario-interactions'
import * as simTraverse from '../../common/simulation-traversal'
import * as projectsTraversal from '../../common/projects-traversal'
import * as merlinUtils from '../../common/merlin-utils'
import * as convertTime from '../../common/convert-time'
import toTwoDP from '../../common/toTwoDP';
import commaSeperateNumber from '../../common/commaSeperateNumber';

export default Ember.Component.extend({
  classNames: ['investment-timeline'],
  processProjects: processProjects,
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
  init: function () {
    this._super();
    this.processTelemetryData()
    this.buildChart()
  },
  chartInlineStyle:Ember.computed('axes1Width','axes2Width', function () {
    let axes1Width = this.get('axes1Width');
    let axes2Width = this.get('axes2Width');
    let widthOffset = axes1Width + axes2Width
    return Ember.String.htmlSafe(`margin-left:-${axes1Width}px; width:calc(80vw + ${widthOffset}px)`)
  }),
  logErrors: function (messages) {
    _.forEach( messages, function (message) {
      // console.log(message.time, message.message)
    })
  },

  processTelemetryData: function () {
    var self = this
    var simulation = this.get('simulation')
    var simRunReq = this.runSimulation()

    simRunReq.then(function (simultionRun) {
      self.set('simultionRun', simultionRun)

      if ( simultionRun[simultionRun.length - 1].messages) { self.logErrors(simultionRun.pop().messages) }

      var outputsTelemetry = _.filter(simultionRun, function (telemetry) {
        return (telemetry.type === "Output" && telemetry.name !== 'Service Revenue'  && telemetry.name !== 'Budgetary Surplus'  && telemetry.name !== 'Operational Surplus')
      })

      _.forEach(outputsTelemetry, function (outputTelemetry) {
        var simulationOutput = _.find(simulation.outputs, function (output) {
          return output.id === outputTelemetry.id
        })
        var minimum = simulationOutput.minimum
        outputTelemetry.minimum = minimum
      })

      var indexed = self.indexOutputData({
        telemetry: outputsTelemetry
      })

      var quartered = merlinUtils.convertDatasetToQuarters({ dataset : indexed })
      quartered.unshift(quartered[0])

      self.set('outputData', quartered)

      self.recalculateOutputs( quartered )
    })
  },

  recalculateOutputs: function (data) {
    var investmentGraph = this.get('investmentGraph')
    let index = 3
    if(index !== undefined){
      Ember.set(investmentGraph.data.datasets, `${index}.data`, data);
    }
  },


  indexOutputData: function (opts) {
    var returnData = []
    var telemetry = opts.telemetry
    var amountDatasets = telemetry.length
    _.forEach(telemetry, function (set) {
      var data = set.data.value
      var minimum = set.minimum
      _.forEach(data, function (datum, i) {
        if (!returnData[i]) { returnData[i] = 0 }
        returnData[i] += ( datum / minimum ) * 100
      })
    })

    returnData = _.map(returnData, function (datum) {
      return datum / amountDatasets
    })
    return returnData
  },

  runSimulation: function() {
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

  projectHasBeenAdded: function () {
    this.processTelemetryData()
    this.recalculateInvestments()
  }.observes('projects'),

  buildChart: function () {
    // let opexColor = 'rgb(245, 166, 35)';
    // let capexColor = 'rgb(60, 255, 122)';
    let totalInvestmentColor = 'rgb(255, 255, 255)';
    let remainingFundsColor = 'rgb(129, 65, 255)';
    let axisColor = 'rgb(255, 255, 255)';
    let capitalisationColor = 'rgb(9, 255, 255)'
    let ongoingCostColor = 'rgb(10, 25, 170)'
    let outputsColor = 'rgb(245, 166, 35)'
    let graphData = this.processAndSortData();

    let remainingFunds = new DataSet('Remaining Funds', graphData.remainingFunds, remainingFundsColor);
    // let capexContribution = new DataSet('capex contribution', graphData.capex, capexColor);
    // let opexContribution = new DataSet('opex contribution', graphData.opex, opexColor);
    let totalInvestment = new DataSet('Total Investment', graphData.totalInvestment, totalInvestmentColor);

    let capitalisation = new DataSet('Capitalisation', graphData.capitalisation, capitalisationColor);
    let ongoingCost = new DataSet('Ongoing Cost', graphData.ongoingCost, ongoingCostColor);

    let outputData = new Array(48)
    this.set('outputData', outputData)
    let outputs = new DataSet('outputs', outputData, outputsColor);
    outputs.setAxisId('yAxes2')


    // remainingFunds.setDashType('longDash')
    // capexContribution.setDashType('longDash')
    // opexContribution.setDashType('longDash')
    totalInvestment.setDashType('longDash')

    capitalisation.setDashType('dotted')
    ongoingCost.setDashType('dotted')

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

    this.set('axes',{'xAxes': xAxes, 'yAxes1': yAxes1,'yAxes2': yAxes2})

    var dataSets = [
      remainingFunds,
      // capexContribution,
      // opexContribution,
      totalInvestment,
      ongoingCost,
      outputs,
      // capitalisation,
    ]

    let tooltip = new Tooltip()
    tooltip.formatTooltipLabelValue(this.formatTooltipValue)

    let chartParameters = new ChartParameters(dataSets, graphData.labels, [xAxes], [yAxes1,yAxes2], tooltip)
    this.set('investmentGraph', chartParameters)
  },
  formatTooltipValue(tooltipItem, data){
    let datasetIndex = tooltipItem.datasetIndex;
    let datasetLabel = data.datasets[datasetIndex].label;

    let valueRounded =  Math.round(tooltipItem.yLabel)
    let valueToReturn;
    let valueToAppend = "";
    let valueToPrepend = "";
    if(datasetLabel==="outputs"){
      valueToAppend = '%'
      valueToReturn = valueRounded;
    }
    else{
      valueToPrepend = '$'
      valueToReturn = commaSeperateNumber(valueRounded)
    }
    tooltipItem.yLabel = valueToPrepend+valueToReturn+valueToAppend;

  },
  observeChart:function(){
    let chart = this.get('chart')
    if(chart){
      chart.resize();
    }
  }.observes('chart'),
  didInsertElement(){
    Ember.run.next(this,function(){
      let axes = this.get('axes');
      this.set('axes1Width', axes.yAxes1.maxWidth);
      this.set('axes2Width', axes.yAxes2.maxWidth);
    })
  },

  processAndSortData(){
    var projects = this.get('projects')

    var processedData = this.processProjects({
      metadata : this.get('hardCodedMetadata'),
      projects : projects
    })

    var sortedData = {}
    sortedData.labels = []
    var labelsNotMadeYet = true

    _.forEach(processedData, function (dataset, name) {
      sortedData[name] = []
      _.forEach(dataset, function (data, year) {
        _.forEach(data, function (expenditure, month) {
          sortedData[name].push( expenditure )

          if (labelsNotMadeYet) {
            if (month.length === 1) {month = '0' + String(month)}
            sortedData.labels.push( `${year}/${month}` )
          }
        })
      })
      labelsNotMadeYet = false
    })

    sortedData.totalInvestment = []

    _.forEach(sortedData.capex, function (datum, i) { // add up total investment
      sortedData.totalInvestment.push(datum)
      sortedData.totalInvestment[i] += sortedData.opex[i]
    })

    _.forEach(sortedData, function (dataset) { // add a value on to the begining of the dataset, for layout reasons
      dataset.unshift(0)
    })
    sortedData.remainingFunds[0] = 50000000

    return sortedData;
  },

  setServiceModels: function () {
    var serviceModels = []
    var simulation = this.get('simulation')
    var parentEntity = this.get('parentEntity')
    _.forEach(parentEntity.children, function (childUrl) {
      var childId = simTraverse.getIdFromUrl(childUrl)
      var serviceModel = _.find(simulation.entities, function (entity) {
        /*jshint eqeqeq: false */
        return  entity.id == childId
      })
      serviceModels.push(serviceModel)
    })
    this.set('serviceModels', serviceModels)
  }.observes('parentEntity'),

  recalculateInvestments: function(){
    let processedData = this.processAndSortData()
    // run simulation
    var investmentGraph = this.get('investmentGraph')
    var dataSetIndex = {
      'remainingFunds' : 0,
      // 'capex' : 1,
      // 'opex' : 2,
      'totalInvestment' : 1,
      'ongoingCost' : 2,
      // 'outputs' : 5,
      // 'capitalisation' : 5,
    }
    _.forEach(processedData, function(value, key){
      let index = dataSetIndex[key];
      if(index !== undefined){
        Ember.set(investmentGraph.data.datasets, `${index}.data`, value);
      }
    });
  },

  persistDatesToBackend: function (opts) {
    if (opts.id > 0) { // do nothing for phases that are a suggestion.
      var callback = function () {
        this.processTelemetryData()
      }
      scenarioInteractions.updatePhaseTimes( opts, callback.bind(this) )
    }
  },

  actions:{
    onContextMenu: function () {
      // console.log('onContextMenu action')
    },

    onContextMenuAction: function(timelineObject, action){
      this.send(action, timelineObject)
    },
    getSuggestion: function(timelineObject){
      let phaseId = timelineObject.id;
      Ember.$.getJSON(`api/optimize-phase/${phaseId}/`).then( (suggestedPhase) => {
        suggestedPhase.investment_cost = 0
        suggestedPhase.service_cost = 0
        suggestedPhase.capitalization = 0
        suggestedPhase.isSuggestion = true
        convertTime.convertTimesInObject(suggestedPhase)

        //Kludge to fix time being off
        suggestedPhase.end_date.value -= 1;

        var project = _.find(this.get('projects'), ['id', suggestedPhase.project])
        suggestedPhase.id = suggestedPhase.id * -1
        var originalLength = project.phases.length
        if(!project.suggestions){
          Ember.set(project,'suggestions',[])
        }

        project.suggestions.push(suggestedPhase)
        project.suggestions.arrayContentDidChange(originalLength, 1, 0)
      });
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
