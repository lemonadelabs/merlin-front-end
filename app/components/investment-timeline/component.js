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
    var skeleton = this.processPlanData({
      metadata : model.metadata,
      timelineObjects : model.timelineObjects
    })

    _.forEach(skeleton, function (object, year) {
      _.forEach(object, function (expenditure, month) {
        labels.push(`${year}, ${month}`)
        data.push(expenditure)
      })
    })

    var total = 0




    function sigmoid(t) {
      var xMultiplier = 1.3
      var startingYModifier = - 0.5
      var yMultiplier = 1.6
      return ( 1 / ( 1 + Math.pow( Math.E, - ( t * xMultiplier ) ) ) + startingYModifier ) * yMultiplier;
    }

    // for (var i = 0; i < 100; i++) {
    //   data.push(sigmoid(i))
    //   labels.push(i)
    // };

    let graphColour = 'rgb(245, 166, 35)';
    let axisColour = 'rgb(255, 255, 255)';

    let totalExpenditure = new DataSet('test curve', data, graphColour);
    totalExpenditure.setDashType('longDash')

    let xAxes = new Axes('', axisColour);
    let yAxes = new Axes('', axisColour);
    let chartParameters = new ChartParameters( [totalExpenditure], labels, [xAxes], [yAxes])
    this.graphs.push(chartParameters)




  }
});
