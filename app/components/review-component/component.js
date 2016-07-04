import Ember from 'ember';
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import Tooltip from '../lemonade-chart/tooltip';
import ChartParameters from '../lemonade-chart/chartParameters';
import * as simTraverse from '../../common/simulation-traversal';
import * as projectsTraversal from '../../common/projects-traversal'
import * as merlinUtils from '../../common/merlin-utils';
import postJSON from '../../common/post-json';
import toTwoDP from '../../common/toTwoDP';
import commaSeperateNumber from '../../common/commaSeperateNumber';

export default Ember.Component.extend({
  classNames : ['review-component'],
  services : undefined,
  senarios: {},
  simulationData: {},
  graphData : {},
  graphs : [],
  cards : [],
  init(){
    this._super();
    this.findSecenariosAndRunSims();
    let simData = this.get('simulationData');
    if (!_.isEmpty(simData)){
      this.set('simulationData',{});
    }
  },
  didReceiveAttrs(){
    Ember.run.next(this,this.setupServicesFilter)
  },
  findSecenariosAndRunSims(){
    this.findAndRunBaseline()
    this.findAndRunHaircut()
    this.findAndRunBaselineWithProjects()
  },
  findAndRunBaselineWithProjects: function () {
    var self = this
    var baseline = this.loadScenarioFromModel('baseline')
    var projects = this.get('model.projects')
    var simulationId = this.get('model.simulation.id')

    var scenarioIds = projectsTraversal.getScenarioIds(projects)
    scenarioIds = _.concat([baseline.id], scenarioIds)
    var url = merlinUtils.simulationRunUrl({
      scenarioIds : scenarioIds,
      simulationId : simulationId,
      timeframe : 120
    })
    var simulationRun = Ember.$.getJSON(url)
    simulationRun.then(function (telemetry) {
      self.set('simulationData.planned', telemetry)
      let canSetupChart = self.checkSenarioLoadStatus()
      if(canSetupChart){
        self.initCharts()
      }
    })
  },
  findAndRunBaseline: function () {
    var self = this
    var baselineSenarioLoad = this.loadSenario('baseline')
    baselineSenarioLoad.then(function(){
      self.runSimulationWithSenario('baseline')
      .then(function(){
        let canSetupChart = self.checkSenarioLoadStatus()
        if(canSetupChart){
          self.initCharts()
        }
      })
    })
  },
  findAndRunHaircut: function () {
    var self = this
    var haircutSenarioLoad = this.loadSenario('haircut')
    haircutSenarioLoad.then(function() {
      self.runSimulationWithSenario('haircut')
      .then(function(){
        let canSetupChart = self.checkSenarioLoadStatus()
        if(canSetupChart){
          self.initCharts()
        }
      })
    })
  },
  initCharts(){
    this.generateGraphData()
    this.createCards()
  },
  checkSenarioLoadStatus(){
    let requiredKeys = {"baseline":false, "haircut":false, "planned":false}
    let simulationData = this.get('simulationData')
    _.forEach(simulationData, function(v,k){
      if(!requiredKeys[k]){
        requiredKeys[k] = true;
      }
    })
    let allSimsLoaded = !_.includes(requiredKeys, false)
    return allSimsLoaded
  },

  loadScenarioFromModel: function (scenarioName) {
    var id = this.get('model.simulation.id')
    var scenarios = this.get('model.scenarios')
    var simSubstring = `api/simulations/${id}/`
    var scenario = _.find(scenarios, function (scenario) {
      return  ( _.includes(scenario.sim, simSubstring) && scenario.name === scenarioName)
    })
    return scenario
  },

  loadSenario: function (senarioName) {
    var self = this
    var id = this.get('model.simulation.id')
    var simSubstring = `api/simulations/${id}/`
    return Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var senario = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === senarioName)
      })

      if (senario) {
        self.set(`senarios.${senarioName}`, senario)
      } else {
        var postData = {
          "name": senarioName,
          "sim": "http://127.0.0.1:8000/api/simulations/" + id + '/',
          "start_offset": 0
        }
        postJSON({
          data : postData,
          url : "api/scenarios/"
        }).then(function (senario) {
          self.set(`senarios.${senarioName}`, senario)
        })
      }
    })
  },
  runSimulationWithSenario(senario){
    var self = this
    let senarioData = this.get(`senarios.${senario}`)
    let simulation_id = this.get(`model.simulation.id`)
    return Ember.$.getJSON(`api/simulation-run/${simulation_id}/?steps=120&s0=${senarioData.id}`).then(
      function(simData){
        self.set(`simulationData.${senario}`,simData)
      }
    )
  },
  setupServicesFilter(){
    var simulation = this.get('model.simulation')
    var serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation})
    this.set('services', serviceModels)
  },
  newGraph(graphColours, GraphData, lineTypes, Datatype){
    let axisColour = 'rgb(255, 255, 255)',
        labels = this.get('chartLabels') || this.generateYearLabels(GraphData[0].length),
        dataSets = [],
        xAxes = new Axes('Years', axisColour),
        yAxes = new Axes(undefined, axisColour),
        tooltip = new Tooltip()

    if(!this.get('chartLabels')){
      this.set('chartLabels',labels)
    }
    _.forEach(GraphData, function(value, i) {
      let data = value.data;
      let dataSet = new DataSet(value.name, data, graphColours[i]);
      if (lineTypes && lineTypes[i] !== 'solid') {
        dataSet.setDashType(lineTypes[i])
      }
      dataSets.push(dataSet);
    })

    if(Datatype === "Money"){
      yAxes.prependToTickLabel("$")
      yAxes.customFormatting(this.formatBigNumbers)
      tooltip.prependToTooltipLabel("$")
      tooltip.formatTooltipLabelValue(this.formatFinance)
    }
    if(Datatype === "Percentage"){
      yAxes.appendToTickLabel("%")
      tooltip.appendToTooltipLabel("%")
      tooltip.formatTooltipLabelValue(this.formatPercentage)

    }
    let chartParameters = new ChartParameters( dataSets, labels, [xAxes], [yAxes], tooltip)
    // chartParameters.name = value.name

    return chartParameters;
  },
  formatPercentage(tooltipItem, data){
    let valueRounded =  Math.round(tooltipItem.yLabel)
    tooltipItem.yLabel = valueRounded

  },
  formatFinance(tooltipItem, data){
    let valueTwoDP =  toTwoDP(tooltipItem.yLabel)
    let valueCommaSeperated = commaSeperateNumber(valueTwoDP)
    tooltipItem.yLabel = valueCommaSeperated
  },
  formatBigNumbers(tick){
    if(tick / 1000000000 > 0.99 || tick / 1000000000 < -0.99){
      return (tick/1000000000 + " B");
    }
    if(tick / 1000000 > 0.99 || tick / 1000000 < -0.99){
      return (tick/1000000 + " M");
    }
    if(tick / 1000 > 0.99 || tick / 1000 < -0.99){
      return (tick/1000 + " T");
    }
    return tick
  },
  createCards(){
    this.set('cards', []);
    this.createFinanceCard();
    this.createStaffCard();
    this.createOutputCard();
  },
  createFinanceCard(){
    let revenueBudgeted = this.get('graphData.revenueBudgeted');
    let revenuePlanned = this.get('graphData.revenuePlanned');
    let revenueHaircut = this.get('graphData.revenueHaircut');

    let expensesBudgeted = this.get('graphData.expensesBudgeted');
    let expensesPlanned = this.get('graphData.expensesPlanned');
    let expensesHaircut = this.get('graphData.expensesHaircut');

    let surplusOpertationalBudgeted = this.get('graphData.surplusOpertationalBudgeted');
    let surplusOpertationalPlanned = this.get('graphData.surplusOpertationalPlanned');
    let surplusOpertationalHaircut = this.get('graphData.surplusOpertationalHaircut');

    let surplusBudgetaryBudgeted = this.get('graphData.surplusBudgetaryBudgeted');
    let surplusBudgetaryPlanned = this.get('graphData.surplusBudgetaryPlanned');
    let surplusBudgetaryHaircut = this.get('graphData.surplusBudgetaryHaircut');

    let financeCard = {};
    financeCard.name = "Finance";
    financeCard.graphs = {};
    financeCard.graphs["Revenue"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Revenue Budgeted',
          data: revenueBudgeted
        },
        {
          name: 'Revenue Planned',
          data: revenuePlanned
        },
        {
          name: 'Revenue Haircut',
          data: revenueHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ],
      "Money"
    );

    financeCard.graphs["Expenses"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Expenses Budgeted',
          data: expensesBudgeted
        },
        {
          name: 'Expenses Planned',
          data: expensesPlanned
        },
        {
          name: 'Expenses Haircut',
          data: expensesHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ],
      "Money");

    financeCard.graphs["Operational Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Operational Surplus Budgeted',
          data: surplusOpertationalBudgeted
        },
        {
          name: 'Operational Surplus Planned',
          data: surplusOpertationalPlanned
        },
        {
          name: 'Operational Surplus Haircut',
          data: surplusOpertationalHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ],
      "Money");

    financeCard.graphs["Budgetary Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Budgetary Surplus Budgeted',
          data: surplusBudgetaryBudgeted
        },
        {
          name: 'Budgetary Surplus Planned',
          data: surplusBudgetaryPlanned
        },
        {
          name: 'Budgetary Surplus Haircut',
          data: surplusBudgetaryHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ],
      "Money");
    financeCard.filterCategories = [
      {
        label:'Revenue',
        selected:true
      },
      {
        label:'Expenses',
        selected:false
      },
      {
        label:'Operational Surplus',
        selected:false
      },
      {
        label:'Budgetary Surplus',
        selected:false
      }
    ]
    this.get('cards').push(financeCard)
  },
  createStaffCard(){
    //Utilisation needs to be on another axis
    let staffCard = {};
    let lineStaffBudgeted = this.get('graphData.lineStaffBudgeted');
    let OhStaffBudgeted = this.get('graphData.OhStaffBudgeted');

    let lineStaffPlanned = this.get('graphData.lineStaffPlanned');
    let OhStaffPlanned = this.get('graphData.OhStaffPlanned');

    let lineStaffHaircut = this.get('graphData.lineStaffHaircut');
    let OhStaffHaircut = this.get('graphData.OhStaffHaircut');

    let staffUtilisationBudgeted = this.get('graphData.staffUtilisationBudgeted');
    let staffUtilisationPlanned = this.get('graphData.staffUtilisationPlanned');
    let staffUtilisationHaircut = this.get('graphData.staffUtilisationHaircut');


    staffCard.name = "Staff";
    staffCard.graphs = {};
    staffCard.graphs["Staff Numbers"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 217, 226)',
        'rgb(74, 217, 226)',
        'rgb(74, 217, 226)',

      ],
      [
        {name: 'Line Staff Budgeted', data:lineStaffBudgeted},
        {name: 'Line Staff Planned', data:lineStaffPlanned},
        {name: 'Line Staff Haircut', data:lineStaffHaircut},
        {name: 'Overhead Staff Budgeted', data:OhStaffBudgeted},
        {name: 'Overhead Staff Planned', data:OhStaffPlanned},
        {name: 'Overhead Staff Haircut', data:OhStaffHaircut},
      ],
      [
        'solid',
        'dotted',
        'longDash',
        'solid',
        'dotted',
        'longDash'
      ]
    );

    staffCard.graphs["Utilisation"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
      ],
      [
        {name: 'Utilisation Budgeted', data:staffUtilisationBudgeted},
        {name: 'Utilisation Planned', data:staffUtilisationPlanned},
        {name: 'Utilisation Haircut', data:staffUtilisationHaircut}

      ],
      [
        'solid',
        'dotted',
        'longDash',
      ], "Staff Numbers"
    );

    staffCard.filterCategories = [
      // {
      //   label:'Utilisation',
      //   selected:true
      // },
      {
        label:'Staff Numbers',
        selected:true
      }
    ]

    this.get('cards').push(staffCard)
  },
  createOutputCard(){
    let outputCard = {};
    let outputsPlanned = this.get('graphData.outputsPlanned');
    // let outputsBudgeted = this.get('graphData.outputsBudgeted');
    let outputsHaircut = this.get('graphData.outputsHaircut');

    let outputsSlaPlanned = this.get('graphData.outputsSlaPlanned');
    let outputsSlaBudgeted = this.get('graphData.outputsSlaBudgeted');
    let outputsSlaHaircut = this.get('graphData.outputsSlaHaircut');

    outputCard.name = "Outputs";
    outputCard.graphs = {};
    outputCard.graphs["Indexed Outputs"] = this.newGraph(
      [
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Indexed Outputs Planned', data:outputsPlanned},
        {name: 'Indexed Outputs Haircut', data:outputsHaircut}
      ],
      [
        'dotted',
        'longDash'
      ],
      "Percentage"
    );
    outputCard.graphs["Service Level"] = this.newGraph(
      [
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Service Level Budgeted', data:outputsSlaBudgeted},
        {name: 'Service Level Planned', data:outputsSlaPlanned},
        {name: 'Service Level Haircut', data:outputsSlaHaircut}
      ],
      [
        'solid',
        'dotted',
        'longDash'
      ],
      "Percentage"
    );
    outputCard.filterCategories = [
      {
        label:'Service Level',
        selected:true
      },
      {
        label:'Indexed Outputs',
        selected:false
      }
    ]
    this.get('cards').push(outputCard)
  },
  generateGraphData(){
    let baseline = this.get('simulationData.baseline');
    let haircut = this.get('simulationData.haircut');
    let planned = this.get('simulationData.planned');
    this.set('graphData',{})
    this.findAndSetOutputData(baseline, haircut, planned)
    this.findAndSetStaffData(baseline, haircut, planned)
    this.findAndSetFinancialData(baseline, haircut, planned);

  },
  findOutputsFromTelemetry(simultionRun) {
    var simulation = this.get('model.simulation')
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
    return outputsTelemetry
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


  anualiseIndexed: function (indexed) {
    var anualisedData = []
    _.forEach(indexed, function (datum, i) {
      var year = Math.floor(i / 12)
      if (!anualisedData[year]) { anualisedData[year] = 0}
      anualisedData[year] += datum
    })
    return anualisedData
  },

  makeDataYearlyAverage: function (data) {
    return _.map(data, function (datum) {
      return datum / 12
    })
  },

  indexOutputDataWithBaseline: function (opts) {
    var returnData = []
    var telemetry = opts.telemetry
    var baselineTelemetry = opts.baselineTelemetry
    var amountDatasets = telemetry.length
    _.forEach(telemetry, function (set, itterate) {
      var data = set.data.value
      _.forEach(data, function (datum, i) {
        if (!returnData[i]) { returnData[i] = 0 }
        if(baselineTelemetry[itterate].data.value[i] === 0){
          returnData[i] += 0
        }
        else{
          returnData[i] += ( datum / baselineTelemetry[itterate].data.value[i] ) * 100
        }
      })
    })

    returnData = _.map(returnData, function (datum) {
      return datum / amountDatasets
    })
    return returnData
  },
  findAndSetOutputData(baseline, haircut, planned){
    var baselineOutputTelemetry = this.findOutputsFromTelemetry(baseline)
    var plannedOutputTelemetry = this.findOutputsFromTelemetry(planned)
    var haircutOutputTelemetry = this.findOutputsFromTelemetry(haircut)

    //Planned (from the projects senarios)
    var plannedIndexBaseline = this.indexOutputDataWithBaseline({
      telemetry : plannedOutputTelemetry,
      baselineTelemetry : baselineOutputTelemetry
    })
    var anualisedPlannedIndexBaseline = this.anualiseIndexed(plannedIndexBaseline)
    var averagedPlannedIndexBaseline = this.makeDataYearlyAverage(anualisedPlannedIndexBaseline)
    this.set('graphData.outputsPlanned',averagedPlannedIndexBaseline)


    var indexedSlaPlanned = this.indexOutputData({ telemetry : plannedOutputTelemetry })
    var anualisedSlaPlanned = this.anualiseIndexed(indexedSlaPlanned)
    var averagedSlaPlanned = this.makeDataYearlyAverage(anualisedSlaPlanned)

    this.set('graphData.outputsSlaPlanned',averagedSlaPlanned)

    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.outputsBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsBudgeted').push(rando);
    }

    var indexedSlaBudgeted = this.indexOutputData({ telemetry : baselineOutputTelemetry })
    var anualisedSlaBudgeted = this.anualiseIndexed(indexedSlaBudgeted)
    var averagedSlaBudgeted = this.makeDataYearlyAverage(anualisedSlaBudgeted)
    this.set('graphData.outputsSlaBudgeted',averagedSlaBudgeted)


    //Haircut (from the 'haircut' senarios)
    var haircutIndexBaseline = this.indexOutputDataWithBaseline({
      telemetry : haircutOutputTelemetry,
      baselineTelemetry : baselineOutputTelemetry
    })
    var anualisedHaircutIndexBaseline = this.anualiseIndexed(haircutIndexBaseline)
    var averagedHaircutIndexBaseline = this.makeDataYearlyAverage(anualisedHaircutIndexBaseline)
    this.set('graphData.outputsHaircut',averagedHaircutIndexBaseline)

    var indexedSlaHaircut = this.indexOutputData({ telemetry : haircutOutputTelemetry })
    var anualisedSlaHaircut = this.anualiseIndexed(indexedSlaHaircut)
    var averagedSlaHaircut = this.makeDataYearlyAverage(anualisedSlaHaircut)
    this.set('graphData.outputsSlaHaircut',averagedSlaHaircut)

  },
  findAndSetStaffData(baseline, haircut, planned){
    //Planned (from the projects senarios)
     let lineStaffPlanned = this.findDataSetForGraphData(planned,'line staff #','ProcessProperty')
    _.forEach(lineStaffPlanned,function(v,i){
      lineStaffPlanned[i] = v / 12;
    })
    this.set('graphData.lineStaffPlanned',lineStaffPlanned)

   let ohStaffPlanned = this.findDataSetForGraphData(planned,'overhead staff #','ProcessProperty')
    _.forEach(ohStaffPlanned,function(v,i){
      ohStaffPlanned[i] = v / 12;
    })
    this.set('graphData.OhStaffPlanned',ohStaffPlanned)

    this.set('graphData.staffUtilisationPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationPlanned').push(rando);
    }

    //Budgeted (from the 'baseline' senarios)
    let lineStaffBudgeted = this.findDataSetForGraphData(baseline,'line staff #','ProcessProperty')
    _.forEach(lineStaffBudgeted,function(v,i){
      lineStaffBudgeted[i] = v / 12;
    })
    this.set('graphData.lineStaffBudgeted',lineStaffBudgeted)

    let OhStaffBudgeted = this.findDataSetForGraphData(baseline,'overhead staff #','ProcessProperty')
    _.forEach(OhStaffBudgeted,function(v,i){
      OhStaffBudgeted[i] = v / 12;
    })
    this.set('graphData.OhStaffBudgeted',OhStaffBudgeted)

    this.set('graphData.staffUtilisationBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationBudgeted').push(rando);
    }

    //Haircut (from the 'haircut' senarios)
    let lineStaffHaircut = this.findDataSetForGraphData(baseline,'line staff #','ProcessProperty')
    _.forEach(lineStaffHaircut,function(v,i){
      lineStaffHaircut[i] = v / 12;
    })
    this.set('graphData.lineStaffHaircut',lineStaffHaircut)

    let OhStaffHaircut = this.findDataSetForGraphData(baseline,'overhead staff #','ProcessProperty')
    _.forEach(OhStaffHaircut,function(v,i){
      OhStaffHaircut[i] = v / 12;
    })
    this.set('graphData.OhStaffHaircut',OhStaffHaircut)

    this.set('graphData.staffUtilisationHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationHaircut').push(rando);
    }
  },
  findAndSetFinancialData(baseline, haircut, planned){
    //Planned (from the projects senarios)
    let plannedRevenuePlannedData = this.findDataSetForGraphData(planned,'Service Revenue','Output')
    this.set('graphData.revenuePlanned',plannedRevenuePlannedData)

    let plannedOperationalSurplusData = this.findDataSetForGraphData(planned,'Operational Surplus','Output')
    this.set('graphData.surplusOpertationalPlanned',plannedOperationalSurplusData)

    let plannedBudgetarySurplusData = this.findDataSetForGraphData(planned,'Budgetary Surplus','Output')
    this.set('graphData.surplusBudgetaryPlanned',plannedBudgetarySurplusData)

    let expensesPlannedData = []
    _.forEach(plannedRevenuePlannedData,function(revData,i){
      expensesPlannedData[i] = revData - plannedOperationalSurplusData[i]
    })
    this.set('graphData.expensesPlanned',expensesPlannedData)

    //Budgeted (from the 'baseline' senarios)
    let baselineRevenueBudgetedData = this.findDataSetForGraphData(baseline,'Service Revenue','Output')
    this.set('graphData.revenueBudgeted',baselineRevenueBudgetedData)

    let baselineOperationalSurplusData = this.findDataSetForGraphData(baseline,'Operational Surplus','Output')
    this.set('graphData.surplusOpertationalBudgeted',baselineOperationalSurplusData)

    let baselineBudgetarySurplusData = this.findDataSetForGraphData(baseline,'Budgetary Surplus','Output')
    this.set('graphData.surplusBudgetaryBudgeted',baselineBudgetarySurplusData)

    let expensesBudgetedData = []
    _.forEach(baselineRevenueBudgetedData,function(revData,i){
      expensesBudgetedData[i] = revData - baselineOperationalSurplusData[i]
    })
    this.set('graphData.expensesBudgeted',expensesBudgetedData)

    //Haircut (from the 'haircut' senarios)
    let revenueHaircutData = this.findDataSetForGraphData(haircut, 'Service Revenue','Output')
    this.set('graphData.revenueHaircut',revenueHaircutData)

    let haircutOperationalSurplusData = this.findDataSetForGraphData(haircut,'Operational Surplus','Output')
    this.set('graphData.surplusOpertationalHaircut',haircutOperationalSurplusData)

    let haircutBudgetarySurplusData = this.findDataSetForGraphData(haircut,'Budgetary Surplus','Output')
    this.set('graphData.surplusBudgetaryHaircut',haircutBudgetarySurplusData)

    let expensesHaircutData = []
    _.forEach(baselineRevenueBudgetedData,function(revData,i){
      expensesHaircutData[i] = revData - haircutOperationalSurplusData[i]
    })
    this.set('graphData.expensesHaircut',expensesHaircutData)
  },
  findDataSetForGraphData(simulationRun,DataSetName,DataSetType){
    let telemetartyForSimulationRun = _.filter(simulationRun, { 'name': DataSetName, 'type': DataSetType });
    let dataSet = []
    _.forEach(telemetartyForSimulationRun,function(telemetry){
      _.forEach(telemetry.data.value,function(data,i){
        let month = i
        let year = Math.floor(month/12)
        if(dataSet[year] === undefined ){
          dataSet[year] = 0
        }
        dataSet[year] += data
      })
    })
    return dataSet
  },
  generateYearLabels:function(){
    let resultLabels = [];
    const startYear = 2016;
    for (let i = 0; i < 10; i++) {
      let year = startYear + i;
      let fYear = year - 1999;
      let label = `${year}/${fYear}`;

      resultLabels.push(label)
    }
    return resultLabels
  }
});
