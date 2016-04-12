import Ember from 'ember';

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
    datasets: [{
      label: '# of Votes',
      backgroundColor: "rgba(220,220,220,0.2)",
      borderColor: "rgba(220,220,220,1)",
      data: []
    }]
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
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    var resultData = this.get('model.0.data.result');
    var resultLabels = [];

    for (var i = 0; i < resultData.length; i++) {
      resultLabels.push(months[i])
    }

    this.set('testData.labels',resultData);
    this.set('testData.datasets.data',resultLabels);

    console.log(this.get('model.0'));
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  }
});
