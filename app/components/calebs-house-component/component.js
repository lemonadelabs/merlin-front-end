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
  graphs:[],
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
  generateMonthLabels:function(dataSetLength){
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let resultLabels = [];
    for (let i = 0; i < dataSetLength; i++) {
      resultLabels.push(months[i])
    }

    return resultLabels
  },
  setupGrapData:function(){
    let graphColour = new Color('rgb(245, 166, 35)');
    let graphColour2 = new Color('rgb(126, 211, 33)');
    let axisColour = new Color('rgb(255, 255, 255)');

    let resultRequestsData = new DataSet(this.get('model.0.name'), this.get('model.0.data.result'), graphColour)
    resultRequestsData.setDashType('dotted')

    let resultCashData = new DataSet(this.get('model.1.name'), this.get('model.1.data.value'), graphColour2)
    resultCashData.setAxisId('y-axes-2')

    let xAxes = new Axes('Month', axisColour, 'x-axes-1');
    let yAxes1 = new Axes('Requests', graphColour, 'y-axes-1');
    let yAxes2 = new Axes('Requests2', graphColour2, 'y-axes-2');
    yAxes2.setPosition('right');

    let labels = this.generateMonthLabels(resultRequestsData.data.length)
    let testGraph = new ChartParameters( [resultRequestsData, resultCashData], labels, [xAxes], [yAxes1, yAxes2])
    this.graphs.push(testGraph);
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  }
});
