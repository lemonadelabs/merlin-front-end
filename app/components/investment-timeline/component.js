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
  axes1Width:undefined,
  axes2Width:undefined,
  init: function () {
    this._super();
    this.buildChart()
  },
  chartInlineStyle:Ember.computed('axes1Width','axes2Width', function () {
    let axes1Width = this.get('axes1Width');
    let axes2Width = this.get('axes2Width');
    let widthOffset = axes1Width + axes2Width
    return(`margin-left:-${axes1Width}px; width:calc(80% + ${widthOffset}px)`)
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
    let yAxes1 = new Axes('', axisColour);
    yAxes1.prependToTickLabel('$');
    yAxes1.beginAtZero(false);

    let yAxes2 = new Axes('', axisColour);
    yAxes2.prependToTickLabel('$');
    yAxes2.beginAtZero(false);
    yAxes2.setPosition('right');
    yAxes2.hideGridLines();

    this.set('axes',{'xAxes': xAxes, 'yAxes1': yAxes1,'yAxes2': yAxes2})
    let chartParameters = new ChartParameters( [totalExpenditure, investment, operational], graphData.totalExpenditure.labels, [xAxes], [yAxes1,yAxes2])
    this.graphs.push(chartParameters)
  },

  didInsertElement(){
    let axes = this.get('axes');
    this.set('axes1Width', axes.yAxes1.maxWidth);
    this.set('axes2Width', axes.yAxes2.maxWidth);
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

    _.forEach(sortedData, function (dataset) { // add a value on to the begining of the dataset, for layout reasons
      dataset.labels.unshift(0)
      dataset.data.unshift(0)
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
