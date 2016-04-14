import Ember from 'ember';
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';

export default Ember.Component.extend({
  timelineObjects:[
    {
      name:"project1",
      start:{
        year:2016,
        value:1,
      },
      end:{
        year:2016,
        value:3
      }
    },
    {
      name:"project2",
      start:{
        year:2017,
        value:1,
      },
      end:{
        year:2017,
        value:4
      }
    },
    {
      name:"project3",
      start:{
        year:2018,
        value:1,
      },
      end:{
        year:2019,
        value:3
      }
    }
  ],
  graphs:{},
  timespan:{
    start:{
      year:2016
    },
    end:{
      year:2016
    },
    units:'months'
  },
  timelineGridObjects:undefined,
  init(){
    this._super();
    this.setupGrapData();
  },
  didInsertElement(){
  },
  setupGrapData:function(){
    var graphColour = new Color('rgb(245, 166, 35)');
    var graphColour2 = new Color('rgb(126, 211, 33)');
    var axisColour = new Color('rgb(255, 255, 255)');

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    var resultRequestsData = new DataSet(this.get('model.0.name'), this.get('model.0.data.result'), graphColour)
    resultRequestsData.setDashType('dotted')

    var resultCashData = new DataSet(this.get('model.1.name'), this.get('model.1.data.value'), graphColour2)
    resultCashData.setAxisId('y-axes-2')

    var xAxes = new Axes('Month', axisColour, 'x-axes-1');
    var yAxes1 = new Axes('Requests', graphColour, 'y-axes-1');
    var yAxes2 = new Axes('Requests2', graphColour2, 'y-axes-2');
    yAxes2.setPosition('right');

    var resultLabels = [];

    for (var i = 0; i < resultRequestsData.data.length; i++) {
      resultLabels.push(months[i])
    }
    var testGraph = new ChartParameters( [resultRequestsData, resultCashData], resultLabels, [xAxes], [yAxes1, yAxes2])
    this.set('graphs.testGraph',testGraph);
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  }
});
