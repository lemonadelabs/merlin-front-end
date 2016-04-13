import Ember from 'ember';
import DataSet from '../lemonade-chart/dataSet';

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
  testData:{
    labels: [],
    datasets: []
  },
  testOptions:{
    scales: {
      yAxes: [{
          ticks: {
          beginAtZero:true
          }
        }]
    }
  },
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
  didInsertElement(){
    this.setupGrapData();
  },
  setupGrapData:function(){
    var graphColour = new Color('rgb(245, 166, 35)');
    var graphColour2 = new Color('rgb(126, 211, 33)');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var resultRequestsData = new DataSet(this.get('model.0.name'), this.get('model.0.data.result'), graphColour,[]);
    var resultCashData = new DataSet(this.get('model.1.name'), this.get('model.1.data.value'), graphColour2, [5,7]);
    var resultLabels = [];
    for (var i = 0; i < resultRequestsData.data.length; i++) {
      resultLabels.push(months[i])
    }
    this.testData.datasets.pushObjects([resultRequestsData,resultCashData])
    this.set('testData.labels',resultLabels);
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  }
});
