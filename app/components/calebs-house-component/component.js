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
  bool:false,
  testValue:300,
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
    let graphColour = 'rgb(245, 166, 35)';
    let graphColour2 = 'rgb(126, 211, 33)';
    let axisColour = 'rgb(255, 255, 255)';

    let model = this.get('model')
    let graphs = this.get('graphs')
    var self = this;
    
    _.forEach(model,function(value) {
      let data = value.data.result || value.data.value;
      let dataSet = new DataSet(value.name, data, graphColour);
      let xAxes = new Axes('', axisColour);
      let yAxes = new Axes('', axisColour);
      let labels = self.generateMonthLabels(data.length)
      let chartParameters = new ChartParameters( [dataSet], labels, [xAxes], [yAxes])
      chartParameters.name = value.name
      graphs.push(chartParameters)
    })




    // let resultRequestsData = new DataSet(this.get('model.0.name'), this.get('model.0.data.result'), graphColour)
    // resultRequestsData.setDashType('dotted')
    //
    // let resultCashData = new DataSet(this.get('model.1.name'), this.get('model.1.data.value'), graphColour2)
    // resultCashData.setAxisId('y-axes-2')
    //
    // let xAxes = new Axes('Month', axisColour, 'x-axes-1');
    // let yAxes1 = new Axes('Requests', graphColour, 'y-axes-1');
    // let yAxes2 = new Axes('Requests2', graphColour2, 'y-axes-2');
    // yAxes2.setPosition('right');
    //
    // let labels = this.generateMonthLabels(resultRequestsData.data.length)
    // let testGraph = new ChartParameters( [resultRequestsData, resultCashData], labels, [xAxes], [yAxes1, yAxes2])
    // this.graphs.push(testGraph);
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  },
  observeSwitch: function(){
    console.log(this.get('bool'));
  }.observes('bool')
});
