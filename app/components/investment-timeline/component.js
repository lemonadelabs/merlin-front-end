import Ember from 'ember';
import processPlanData from './process-plan-data'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';

export default Ember.Component.extend({
  processPlanData: processPlanData,
  graphs: [],
  init: function () {
    this._super();
    this.buildChart()

  },
  buildChart: function () {
    var data = []
    var labels = []

    var model = this.get('model')
    var processedData = this.processPlanData({
      metadata : model.metadata,
      timelineObjects : model.timelineObjects
    })

    var sortedData = {}

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


    let totalExpenditureColour = 'rgb(245, 166, 35)';
    let investmentColour = 'rgb(60, 255, 122)';
    let operationalColour = 'rgb(129, 65, 255)';
    let axisColour = 'rgb(255, 255, 255)';

    let totalExpenditure = new DataSet('total expenditure', sortedData.totalExpenditure.data, totalExpenditureColour);
    let investment  = new DataSet('investment expenditure', sortedData.investment.data, investmentColour);
    let operational  = new DataSet('operational expenditure', sortedData.operational.data, operationalColour);

    // totalExpenditure.setDashType('longDash')
    investment.setDashType('longDash')
    operational.setDashType('dotted')

    let xAxes = new Axes('', axisColour);
    let yAxes = new Axes('', axisColour);
    let chartParameters = new ChartParameters( [totalExpenditure,investment,operational], sortedData.totalExpenditure.labels, [xAxes], [yAxes])
    this.graphs.push(chartParameters)
  }
});
