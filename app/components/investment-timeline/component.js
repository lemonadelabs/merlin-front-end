import Ember from 'ember';
import processPlanData from './process-plan-data'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';

export default Ember.Component.extend({
  processPlanData: processPlanData,
  timelineGridObjects:undefined,
  graphData:undefined,
  graphs: [],
  axes: {},
  axesWidth:undefined,
  init: function () {
    this._super();
    this.buildChart()
  },
  chartInlineStyle:Ember.computed('axesWidth', function () {
    let axesWidth = this.get('axesWidth');
    return(`margin-left:-${axesWidth}px; width:calc(80% + ${axesWidth}px)`)
  }),
  buildChart: function () {
    let totalExpenditureColour = 'rgb(245, 166, 35)';
    let investmentColour = 'rgb(60, 255, 122)';
    let operationalColour = 'rgb(129, 65, 255)';
    let axisColour = 'rgb(255, 255, 255)';
    let graphData = this.processAndSortData();
    let totalExpenditure = new DataSet('total expenditure', graphData.totalExpenditure.data, totalExpenditureColour);
    let investment  = new DataSet('investment expenditure', graphData.investment.data, investmentColour);
    let operational  = new DataSet('operational expenditure', graphData.operational.data, operationalColour);

    // totalExpenditure.setDashType('longDash')
    investment.setDashType('longDash')
    operational.setDashType('dotted')

    let xAxes = new Axes('', axisColour);
    xAxes.hideGridLines();
    xAxes.hideTicks();
    let yAxes = new Axes('', axisColour);
    yAxes.prependToTickLabel('$');
    yAxes.beginAtZero(false);
    this.set('axes',{'xAxes': xAxes, 'yAxes': yAxes})
    let chartParameters = new ChartParameters( [totalExpenditure, investment, operational], graphData.totalExpenditure.labels, [xAxes], [yAxes])
    this.graphs.push(chartParameters)

  },
  didInsertElement(){
    let axes = this.get('axes');
    this.set('axesWidth', axes.yAxes.maxWidth);
  },
  processAndSortData(){
    var model = this.get('model'),
        processedData = this.processPlanData({
          metadata : model.metadata,
          timelineObjects : model.timelineObjects
        }),
        sortedData = {}

    _.forEach(processedData, function (dataset, name) {
      sortedData[name] = {
        labels : [],
        data : []
      }
      _.forEach(dataset, function (data, year) {
        _.forEach(data, function (expenditure, month) {
          if (month.length === 1) {month = '0' + String(month)}
          sortedData[name].labels.push( `${year}/${month}` )
          sortedData[name].data.push( expenditure )
        })
      })
    })
    return(sortedData);
  },
  actions:{
    recalculateInvestments:function(){
      let processedData = this.processAndSortData(),
          investmentGraph = this.get('graphs.0'),
          dataSetIndex = {
            'totalExpenditure' : 0,
            'investment' : 1,
            'operational' : 2
          }

      _.forEach(processedData, function(value, key){
        let index = dataSetIndex[key];
        Ember.set(investmentGraph.data.datasets, `${index}.data`, value.data);

      });

    }
  }
});
