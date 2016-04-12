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
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      backgroundColor: "rgba(220,220,220,0.2)",
      borderColor: "rgba(220,220,220,1)",
      data: [12, 19, 3, 5, 2, 3]
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
      year:2017
    },
    units:'quarters'
  },
  timelineGridObjects:undefined,
  didInsertElement(){
    console.log(this.get('timelineGridObjects'));
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!', this.timelineObjects);
    }
  }
});
