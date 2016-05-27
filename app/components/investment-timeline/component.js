import Ember from 'ember';
import processProjects from '../../business-logic/process-timeline-objects'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';
import truncateBigNumbers from '../../common/truncateBigNumbers';
import convertTime from '../../common/convert-time'
import * as scenarioInteractions from '../../common/scenario-interactions'
import * as simTraverse from '../../common/simulation-traversal'


export default Ember.Component.extend({
  processProjects: processProjects,
  timelineGridObjects:undefined,
  graphData:undefined,
  investmentGraph:undefined,
  axes: {},
  axes1Width:undefined,
  axes2Width:undefined,
  hardCodedMetadata: {
    start : {
      year : 2016,
      value : 1
    },
    end : {
      year : 2019,
      value : 4
    },
    units : 'quarters',
    availableFunds: 50000000
  },
  init: function () {
    this._super();
    this.buildChart()
  },
  chartInlineStyle:Ember.computed('axes1Width','axes2Width', function () {
    let axes1Width = this.get('axes1Width');
    let axes2Width = this.get('axes2Width');
    let widthOffset = axes1Width + axes2Width
    return Ember.String.htmlSafe(`margin-left:-${axes1Width}px; width:calc(80vw + ${widthOffset}px)`)
  }),
  buildChart: function () {
    let opexColor = 'rgb(245, 166, 35)';
    let capexColor = 'rgb(60, 255, 122)';
    let totalInvestmentColor = 'rgb(255, 255, 255)';
    let remainingFundsColor = 'rgb(129, 65, 255)';
    let axisColor = 'rgb(255, 255, 255)';
    let graphData = this.processAndSortData();
    console.log(graphData)



    let capex = new DataSet('total investment', graphData.capex, capexColor);
    let opex = new DataSet('opex', graphData.opex, opexColor);
    let totalInvestment = new DataSet('ongoing cost', graphData.totalInvestment, totalInvestmentColor);
    let remainingFunds = new DataSet('remaining funds', graphData.remainingFunds, remainingFundsColor);

    opex.setDashType('longDash')
    totalInvestment.setDashType('dotted')

    let xAxes = new Axes('', axisColor);
    xAxes.hideGridLines();
    xAxes.hideTicks();
    let yAxes1 = new Axes('', axisColor);
    yAxes1.prependToTickLabel('$');
    yAxes1.beginAtZero(false);
    yAxes1.customFormatting(truncateBigNumbers)
    let yAxes2 = new Axes('', axisColor);
    yAxes2.prependToTickLabel('$');
    yAxes2.beginAtZero(false);
    yAxes2.setPosition('right');
    yAxes2.hideGridLines();

    this.set('axes',{'xAxes': xAxes, 'yAxes1': yAxes1,'yAxes2': yAxes2})
    // let chartParameters = new ChartParameters( [totalInvestment, ongoingCost, capitalisation], graphData.labels, [xAxes], [yAxes1,yAxes2])
    let chartParameters = new ChartParameters( [totalInvestment, capex, opex, remainingFunds], graphData.labels, [xAxes], [yAxes1,yAxes2])
    // let chartParameters = new ChartParameters( [totalInvestment, ongoingCost], graphData.labels, [xAxes], [yAxes1,yAxes2])
    this.set('investmentGraph', chartParameters)
  },
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
      projectsReal : projects
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
    console.log(sortedData)

    _.forEach(sortedData, function (dataset) { // add a value on to the begining of the dataset, for layout reasons
      dataset.unshift(0)
    })
    sortedData.remainingFunds[0] = 50000000

    return sortedData;
  },

  setServiceModels: function () {
    var self = this
    var serviceModels = []
    var simulation = this.get('simulation')
    var parentEntity = this.get('parentEntity')
    _.forEach(parentEntity.children, function (childUrl) {
      var childId = simTraverse.getIdFromUrl(childUrl)
      var serviceModel = _.find(simulation.entities, function (entity) {
        return entity.id == childId
      })
      serviceModels.push(serviceModel)
    })
    this.set('serviceModels', serviceModels)
  }.observes('parentEntity'),

  recalculateInvestments:function(){
    let processedData = this.processAndSortData(),
        investmentGraph = this.get('investmentGraph'),
        dataSetIndex = {
          'totalInvestment' : 0,
          'ongoingCost' : 1,
          // 'capitalisation' : 2
          'remainingFunds' : 2
        }
    _.forEach(processedData, function(value, key){
      let index = dataSetIndex[key];
      if(index !== undefined){
        Ember.set(investmentGraph.data.datasets, `${index}.data`, value);
      }
    });
  },

  persistDatesToBackend: function (opts) {
    scenarioInteractions.updatePhaseTimes(opts)
  },



  actions:{
    onTimelineObjectInteractionEnd: function (context) {
      this.recalculateInvestments()
      this.persistDatesToBackend({
        "id": context.get('id'),
        "start_date": context.get('start'),
        "end_date": context.get('end'),
        scenarioId: context.get('scenarioId')
      })
    },
  }
});
